// static/js/chat.js

document.addEventListener("DOMContentLoaded", function() {
  const sendBtn = document.getElementById("send-btn");
  const input = document.getElementById("user-input");
  const chatWindow = document.getElementById("chat-window");

  function appendMessage(text, klass) {
    const el = document.createElement("div");
    el.className = "mb-2 p-2 " + klass;
    el.style.borderRadius = "8px";
    el.style.maxWidth = "85%";
    if (klass === "user-msg") {
      el.style.background = "#d1e7dd";
      el.style.marginLeft = "auto";
    } else {
      el.style.background = "#e9ecef";
    }
    el.innerHTML = text;
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  async function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;
    appendMessage(msg, "user-msg");
    input.value = "";
    // call backend
    try {
      const resp = await fetch("api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add X-CSRFToken header here if you enable CSRF protection
          "crsf-token": getCookie('csrftoken')
        },
        body: JSON.stringify({message: msg})
      });
      const data = await resp.json();
      if (data.ai_response) {
        appendMessage(data.ai_response + `<br><small>Mood: ${data.mood.label} (${(data.mood.score || 0).toFixed(2)})</small>`, "ai-msg");
      } else if (data.error) {
        appendMessage("Error: " + data.error, "ai-msg");
      }
    } catch (err) {
      appendMessage("Network error: " + err, "ai-msg");
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", function(e){
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});
