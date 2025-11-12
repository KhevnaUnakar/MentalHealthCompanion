// Chat functionality
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Initialize chat
function initChat() {
  showEmptyState();
  
  // Event listeners
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
  });
}

function showEmptyState() {
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.id = 'empty-state';
  emptyState.innerHTML = `
    <div class="empty-state-icon">💬</div>
    <h3>Welcome to Your Mental Health Companion</h3>
    <p>I'm here to listen and support you. Share how you're feeling today, and let's talk about it together.</p>
  `;
  chatWindow.appendChild(emptyState);
}

function removeEmptyState() {
  const emptyState = document.getElementById('empty-state');
  if (emptyState) {
    emptyState.remove();
  }
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function addMessage(sender, text, mood = null) {
  removeEmptyState();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = sender === 'user' ? '👤' : '🤖';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;
  
  contentDiv.appendChild(bubble);
  
  // Add mood badge for user messages
  if (sender === 'user' && mood) {
    const moodBadge = document.createElement('div');
    moodBadge.className = `mood-badge ${mood.label.toLowerCase()}`;
    const moodEmoji = getMoodEmoji(mood.label);
    const moodScore = Math.round(mood.score * 100);
    moodBadge.innerHTML = `${moodEmoji} ${mood.label} (${moodScore}%)`;
    contentDiv.appendChild(moodBadge);
  }
  
  const timeDiv = document.createElement('div');
  timeDiv.className = 'message-time';
  timeDiv.textContent = getCurrentTime();
  contentDiv.appendChild(timeDiv);
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(contentDiv);
  
  chatWindow.appendChild(messageDiv);
  scrollToBottom();
}

function getMoodEmoji(label) {
  const moodMap = {
    'POSITIVE': '😊',
    'Positive': '😊',
    'NEGATIVE': '😔',
    'Negative': '😔',
    'NEUTRAL': '😐',
    'Neutral': '😐'
  };
  return moodMap[label] || '😐';
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai';
  typingDiv.id = 'typing-indicator';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = '🤖';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const typingBubble = document.createElement('div');
  typingBubble.className = 'typing-indicator';
  typingBubble.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  
  contentDiv.appendChild(typingBubble);
  typingDiv.appendChild(avatar);
  typingDiv.appendChild(contentDiv);
  
  chatWindow.appendChild(typingDiv);
  scrollToBottom();
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  
  if (!message) {
    return;
  }
  
  // Disable input while processing
  userInput.disabled = true;
  sendBtn.disabled = true;
  
  // Add user message
  addMessage('user', message);
  
  // Clear input
  userInput.value = '';
  userInput.style.height = 'auto';
  
  // Show typing indicator
  showTypingIndicator();
  
  try {
    const response = await fetch('/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Update user message with mood
    const messages = chatWindow.querySelectorAll('.message.user');
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && data.mood) {
      const contentDiv = lastUserMessage.querySelector('.message-content');
      const existingBadge = contentDiv.querySelector('.mood-badge');
      if (!existingBadge) {
        const moodBadge = document.createElement('div');
        moodBadge.className = `mood-badge ${data.mood.label.toLowerCase()}`;
        const moodEmoji = getMoodEmoji(data.mood.label);
        const moodScore = Math.round(data.mood.score * 100);
        moodBadge.innerHTML = `${moodEmoji} ${data.mood.label} (${moodScore}%)`;
        const bubble = contentDiv.querySelector('.message-bubble');
        bubble.after(moodBadge);
      }
    }
    
    // Add AI response
    addMessage('ai', data.ai_response);
    
  } catch (error) {
    removeTypingIndicator();
    addMessage('ai', 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.');
    console.error('Error:', error);
  } finally {
    // Re-enable input
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChat);
} else {
  initChat();
}
