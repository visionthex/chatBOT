import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "Add your API KEY here"; // replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "Select the model type here"}); // replace "gemini-pro" with your actual model name

// Function to handle mouse movement
function handleMouseMove(e) {
  const navbar = document.querySelector('.navbar');
  const rightNavbar = document.querySelector('.right-navbar');
  const windowWidth = window.innerWidth;

  // Display the navbar if the mouse is within 250px of the left or right edge of the screen
  navbar.style.width = e.clientX < 250 ? '200px' : '0';
  rightNavbar.style.width = windowWidth - e.clientX < 250 ? '200px' : '0';
}

// Function to handle key up event
function handleKeyUp(e) {
  if (e.key === 'Enter') {
    document.getElementById('sendBtn').click();
  }
}

// Function to handle click event
async function handleClick() {
  const userInput = document.getElementById('userInput');
  const chatbox = document.getElementById('chatbox');
  const rightNavbar = document.querySelector('.right-navbar');
  let conversations = JSON.parse(localStorage.getItem('conversations')) || [];
  let conversation = [];

  const prompt = userInput.value;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Create a new div for the AI's response and add it to the chatbox
  const responseDiv = document.createElement('div');
  responseDiv.innerText = text;
  chatbox.appendChild(responseDiv);

  // Add the user's prompt and the AI's response to the conversation
  conversation.push({ user: prompt, ai: text });

  // If it's a new conversation, create a new conversation button
  if (conversation.length === 1) {
    const buttonDiv = createButtonDiv(conversations, conversation, rightNavbar, chatbox);
    rightNavbar.appendChild(buttonDiv);
    conversations.push(conversation);
  }

  // Save the conversations to localStorage
  localStorage.setItem('conversations', JSON.stringify(conversations));
  userInput.value = '';

  // Clear the chatbox after 5 seconds
  setTimeout(() => { chatbox.innerHTML = ''; }, 5000);
}

// Function to create a div containing the conversation and delete buttons
function createButtonDiv(conversations, conversation, rightNavbar, chatbox) {
  const conversationButton = document.createElement('button');
  conversationButton.innerText = `Conversation ${conversations.length + 1}`;

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'X';
  deleteButton.style.marginLeft = '10px';
  deleteButton.style.width = '30px';
  deleteButton.style.height = '30px';

  // Add event listeners to the delete and conversation buttons
  deleteButton.addEventListener('click', () => {
    const index = conversations.indexOf(conversation);
    if (index > -1) {
      conversations.splice(index, 1);
    }
    rightNavbar.removeChild(buttonDiv);
    localStorage.setItem('conversations', JSON.stringify(conversations));
  });

  conversationButton.addEventListener('click', () => {
    chatbox.innerHTML = '';
    const clickedConversation = conversations[conversationButton.innerText.split(' ')[1] - 1];
    clickedConversation.forEach((message, index) => {
      const messageDiv = document.createElement('div');
      messageDiv.innerText = `Message ${index + 1}:\nUser: ${message.user}\nAI: ${message.ai}`;
      chatbox.appendChild(messageDiv);
    });
  });

  // Create a div to hold the conversation and delete buttons
  const buttonDiv = document.createElement('div');
  buttonDiv.style.display = 'flex';
  buttonDiv.style.justifyContent = 'space-between';
  buttonDiv.appendChild(conversationButton);
  buttonDiv.appendChild(deleteButton);

  return buttonDiv;
}

// Add event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('mousemove', handleMouseMove);
  document.getElementById('userInput').addEventListener('keyup', handleKeyUp);
  document.getElementById('sendBtn').addEventListener('click', handleClick);
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('chatbox').innerHTML = '';
  });
});