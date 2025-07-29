/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

//update chat windows with messages
function updateChat(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  // Add responsive classes for user messages based on message length
  if (sender === "user") {
    const messageLength = message.length;
    if (messageLength > 100) {
      messageElement.classList.add("very-long-message");
    } else if (messageLength > 50) {
      messageElement.classList.add("long-message");
    }
  }

  messageElement.textContent = message;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}


updateChat("ai", "👋 Hello! How can I help you today?");

//update submit listener

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  updateChat("user", userMessage);
  userInput.value = "";

  const requestBody = {
    messages: [{ role: "user", content: userMessage }],
  };

  try {
    const response = await fetch(
      "https://super-cherry-f870.alejandrog3.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    updateChat("ai", botMessage);
  } catch (error) {
    console.error("Error:", error);
    updateChat("ai", "Sorry, something went wrong. Please try again later.");
  }
});

//initial message setup

const requestBody = {
  messages: [
    {
      role: "system",
      content:
        "You are a L'Oreal ai advisor. your job is to recommend L'oreal skincare, haircare, and cosmetis products based on user questions. you are allowed to invent fantasy-sounding product name ans descriptions, with routines, benefits - but make sure to say that these aren't actual L'oreal products. if user askes unrelated questions, say that your only trained to talk about L'oreal products. make your answers concise.",
    },
    { role: "user", content: userMessage },
  ],
};
