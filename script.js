const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
// generate api key and put it here
// const API_KEY = "";


const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode"

    // default text when no chat
    const defaultText = `<div class="default-text">
        <h1>ChatGPT clone</h1>
        <p>start conversationa nd explore the conersation of AI. your chat history will be displayed here</p>
    </div>`;

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalStorage();


const createElement = (html, className) => {
    //create new div, apply chat to render it 
    const ChatDiv = document.createElement("div");
    ChatDiv.classList.add("chat", className);
    ChatDiv.innerHTML = html;
    return ChatDiv; // return newly cretaed chat div
}


const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");


    // define the properties and data for API request
    const requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${API_KEY}`
        },
        "body": JSON.stringify({
            "model": "gpt-3.5-turbo-instruct",
            "prompt": userText,
            "max_tokens": 100,
            "temperature": 0.7,
            "stop": null
        })
    }

    //send POST request to api, get resonse and set response as paragraph element
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch (error) {
        console.log(error);
    }

    // save chat to browsers local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);

    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    localStorage.setItem("all-chats", chatContainer.innerHTML);
}

//copy generated response
const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="./images/chatbot.jpg" alt="user-img">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay:0.2s"></div>
                        <div class="typing-dot" style="--delay:0.3s"></div>
                        <div class="typing-dot" style="--delay:0.4s"></div>
                    </div>
                </div>
                <span onclick = copyResponse("this")class="material-symbols-outlined">
                    content_copy
                </span>
            </div>`;

    // create a new outgoing chat and append it to chatContainer
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);

    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // get chat input and remove extra spaces
    if (!userText) return;


    const html = `<div class="chat outgoing">
            <div class="chat-content">
                <div class="chat-details">
                    <img src="./images/user.jpg" alt="user-img">
                    <p>${userText}</p>
                </div>
            </div>
        </div>`;

    // create a new outgoing chat and append it to chatContainer
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}


deleteButton.addEventListener("click", () => {

    if (confirm("do u want to delete all chat?")) {
        localStorage.removeItem("all-chats");
        // localStorage.removeItem("theme-color");
        loadDataFromLocalStorage();
    }
});

themeBtn.addEventListener("click", () => {
    // working on changing theme and saving in browsers local storage
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeBtn.innerText);
    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
})

// adjust height of input textarea dynamically
const initialHeight = chatInput.scrollHeight;
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

sendButton.addEventListener("click", handleOutgoingChat);