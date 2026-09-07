let currentUser = null;
let selectedRole = "";
let socket = null;
let onlineConnected = false;
let currentSession = false;

const badges = [
    { name: "Starter", sessions: 5, icon: "🥉" },
    { name: "Learner", sessions: 15, icon: "🥉" },
    { name: "Explorer", sessions: 50, icon: "🥈" },
    { name: "Knowledge Seeker", sessions: 75, icon: "🥈" },
    { name: "Skill Builder", sessions: 100, icon: "🥇" },
    { name: "Mentor", sessions: 150, icon: "🥇" },
    { name: "Expert", sessions: 250, icon: "🏆" },
    { name: "Master", sessions: 500, icon: "🏆" },
    { name: "Legend", sessions: 750, icon: "💎" },
    { name: "Teachly Champion", sessions: 1000, icon: "👑" }
];

const mysteryTopics = [
    "How do airplanes fly?",
    "Why is the sky blue?",
    "How does the internet work?",
    "Why do we need sleep?",
    "How do plants make food?",
    "What is artificial intelligence?",
    "How do earthquakes happen?",
    "Why does ice float on water?",
    "How does a rainbow form?",
    "What makes a good leader?"
];

function login() {
    const input = document.getElementById("usernameInput");
    const username = input.value.trim();

    if (!username) {
        alert("Please enter a username.");
        return;
    }

    const saved = JSON.parse(localStorage.getItem("teachly_" + username)) || {
        username,
        coins: 0,
        sessions: 0,
        streak: 0,
        earnedBadges: []
    };

    currentUser = saved;

    localStorage.setItem(
        "teachly_" + username,
        JSON.stringify(currentUser)
    );

    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("appSection").classList.remove("hidden");

    updateProfile();
}

function updateProfile() {
    if (!currentUser) return;

    document.getElementById("profileName").textContent =
        currentUser.username;

    document.getElementById("coinCount").textContent =
        currentUser.coins;

    document.getElementById("sessionCount").textContent =
        currentUser.sessions;

    document.getElementById("streakCount").textContent =
        currentUser.streak;

    document.getElementById("streakMessage").textContent =
        currentUser.streak > 0
            ? "🔥 Your current streak is " + currentUser.streak + "!"
            : "Start your streak today!";

    updateBadges();
}

function saveUser() {
    if (!currentUser) return;

    localStorage.setItem(
        "teachly_" + currentUser.username,
        JSON.stringify(currentUser)
    );
}

function openAIMode() {
    document.getElementById("aiSection").classList.remove("hidden");
    document.getElementById("onlineSection").classList.add("hidden");

    document.getElementById("aiSection").scrollIntoView({
        behavior: "smooth"
    });
}

function openOnlineMode() {
    document.getElementById("onlineSection").classList.remove("hidden");
    document.getElementById("aiSection").classList.add("hidden");

    document.getElementById("onlineSection").scrollIntoView({
        behavior: "smooth"
    });

    connectSocket();
}

function closeModes() {
    document.getElementById("aiSection").classList.add("hidden");
    document.getElementById("onlineSection").classList.add("hidden");
}

function addAIMessage(text) {
    const chat = document.getElementById("aiChat");

    const message = document.createElement("div");
    message.className = "message ai-message";

    message.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div>
            <strong>Teachly AI</strong>
            <p>${formatMessage(text)}</p>
        </div>
    `;

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}

function addUserMessage(text) {
    const chat = document.getElementById("aiChat");

    const message = document.createElement("div");
    message.className = "message user-message";

    message.innerHTML = `
        <div>
            <strong>${escapeHTML(currentUser.username)}</strong>
            <p>${formatMessage(text)}</p>
        </div>
    `;

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}

async function sendAIMessage() {
    const input = document.getElementById("aiInput");
    const message = input.value.trim();

    if (!message) return;

    addUserMessage(message);
    input.value = "";

    addAIMessage("Thinking... 🤔");

    const chat = document.getElementById("aiChat");
    const thinkingMessage = chat.lastElementChild;

    try {
        const level = document.getElementById("aiLevel").value;

        const response = await fetch("/api/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: currentUser.username,
                level,
                message
            })
        });

        const data = await response.json();

        thinkingMessage.remove();

        if (data.reply) {
            addAIMessage(data.reply);
        } else {
            addAIMessage(
                "I couldn't get an answer right now. Please try again."
            );
        }
    } catch (error) {
        thinkingMessage.remove();

        addAIMessage(
            "AI Mode needs the Teachly server to be running. Start the backend and try again. 🤖"
        );
    }
}

function aiExplain() {
    const input = document.getElementById("aiInput");

    input.value =
        "Explain the topic I am currently confused about in a very simple step-by-step way.";

    input.focus();
}

function aiExample() {
    const input = document.getElementById("aiInput");

    input.value =
        "Give me a simple real-life example that helps me understand this topic.";

    input.focus();
}

function aiQuiz() {
    const input = document.getElementById("aiInput");

    input.value =
        "Give me a short quiz about this topic and wait for my answers.";

    input.focus();
}

function aiTeachBack() {
    const input = document.getElementById("aiInput");

    input.value =
        "Give me a Teach Back challenge. Ask me to explain this topic in my own words.";

    input.focus();
}

function chooseRole(role) {
    selectedRole = role;

    const teacherButton =
        document.getElementById("teacherRoleButton");

    const learnerButton =
        document.getElementById("learnerRoleButton");

    teacherButton.classList.remove("selected");
    learnerButton.classList.remove("selected");

    if (role === "Teacher") {
        teacherButton.classList.add("selected");
    } else {
        learnerButton.classList.add("selected");
    }

    document.getElementById("roleText").textContent =
        "You are currently a " + role;

    document.getElementById("topicArea").classList.remove("hidden");

    document.getElementById("onlineResult").innerHTML = "";
}

function connectSocket() {
    if (onlineConnected) return;

    if (typeof io === "undefined") {
        showOnlineResult(
            "error",
            "<strong>Online Mode is not connected.</strong><br><br>Start the Teachly server and make sure Socket.IO is loaded."
        );
        return;
    }

    socket = io();

    socket.on("connect", () => {
        onlineConnected = true;
    });

    socket.on("matchFound", data => {
        handleMatchFound(data);
    });

    socket.on("noUsersFound", () => {
        showOnlineResult(
            "empty",
            "🔍 <strong>No people found right now.</strong><br><br>Try another topic later or switch to AI Mode."
        );
    });

    socket.on("sessionMessage", data => {
        addOnlineMessage(
            data.username,
            data.message,
            data.username === currentUser.username
        );
    });

    socket.on("partnerLeft", () => {
        addOnlineMessage(
            "Teachly",
            "The other person has left the session.",
            false
        );

        currentSession = false;
    });

    socket.on("serverMessage", message => {
        addOnlineMessage(
            "Teachly",
            message,
            false
        );
    });

    socket.on("disconnect", () => {
        onlineConnected = false;
    });
}

function findPeople() {
    const topic = document
        .getElementById("topicInput")
        .value
        .trim();

    if (!selectedRole) {
        alert("Choose Teacher or Learner first.");
        return;
    }

    if (!topic) {
        alert("Enter a topic first.");
        return;
    }

    if (!socket || !onlineConnected) {
        connectSocket();

        setTimeout(() => {
            if (socket && onlineConnected) {
                startSearch(topic);
            }
        }, 500);

        return;
    }

    startSearch(topic);
}

function startSearch(topic) {
    showOnlineResult(
        "success",
        "🔎 Looking for a real person who matches your topic..."
    );

    socket.emit("findUser", {
        username: currentUser.username,
        role: selectedRole,
        topic
    });
}

function showOnlineResult(type, message) {
    const result = document.getElementById("onlineResult");

    result.className =
        type === "success"
            ? "success-result"
            : type === "empty"
                ? "empty-result"
                : "error-result";

    result.innerHTML = message;
}

function handleMatchFound(data) {
    currentSession = true;

    document.getElementById("onlineResult").innerHTML = "";

    document
        .getElementById("onlineChatArea")
        .classList.remove("hidden");

    document.getElementById("partnerName").textContent =
        data.partner.username;

    document.getElementById("partnerRole").textContent =
        data.partner.role;

    document.getElementById("onlineChat").innerHTML = "";

    addOnlineMessage(
        "Teachly",
        "🎉 You found a real person! Start your knowledge exchange.",
        false
    );
}

function sendOnlineMessage() {
    const input = document.getElementById("onlineInput");
    const message = input.value.trim();

    if (!message || !socket || !currentSession) return;

    socket.emit("sessionMessage", {
        message,
        username: currentUser.username
    });

    input.value = "";
}

function addOnlineMessage(username, message, own) {
    const chat = document.getElementById("onlineChat");

    const element = document.createElement("div");

    element.className =
        own
            ? "message user-message"
            : "message ai-message";

    element.innerHTML = `
        <div>
            <strong>${escapeHTML(username)}</strong>
            <p>${formatMessage(message)}</p>
        </div>
    `;

    chat.appendChild(element);
    chat.scrollTop = chat.scrollHeight;
}

function sendEmoji(emoji) {
    if (!socket || !currentSession) return;

    socket.emit("sessionMessage", {
        message: emoji,
        username: currentUser.username
    });
}

function leaveOnlineSession() {
    if (!currentSession) return;

    if (socket) {
        socket.emit("leaveSession");
    }

    currentSession = false;

    document
        .getElementById("onlineChatArea")
        .classList.add("hidden");

    document.getElementById("onlineChat").innerHTML = "";

    showOnlineResult(
        "success",
        "✅ Session ended. Great job exchanging knowledge!"
    );

    completeSession();
}

function completeSession() {
    currentUser.sessions += 1;
    currentUser.coins += 10;
    currentUser.streak += 1;

    const newlyEarned = [];

    badges.forEach(badge => {
        if (
            currentUser.sessions >= badge.sessions &&
            !currentUser.earnedBadges.includes(badge.name)
        ) {
            currentUser.earnedBadges.push(badge.name);
            currentUser.coins += 25;
            newlyEarned.push(badge);
        }
    });

    saveUser();
    updateProfile();

    let message =
        "🎉 Session completed! +10 Teachly Coins.";

    if (newlyEarned.length > 0) {
        newlyEarned.forEach(badge => {
            message +=
                ` ${badge.icon} You earned the ${badge.name} badge!`;
        });
    }

    addOnlineMessage(
        "Teachly",
        message,
        false
    );
}

function updateBadges() {
    const badgeElements =
        document.querySelectorAll(".badge");

    badgeElements.forEach((element, index) => {
        const badge = badges[index];

        if (
            currentUser.earnedBadges &&
            currentUser.earnedBadges.includes(badge.name)
        ) {
            element.style.opacity = "1";
            element.style.borderColor = "rgba(25, 211, 174, 0.6)";
        } else {
            element.style.opacity = "0.45";
        }
    });
}

function mysteryTopic() {
    const topic =
        mysteryTopics[
            Math.floor(Math.random() * mysteryTopics.length)
        ];

    document.getElementById("mysteryResult").innerHTML =
        "🎲 Your mystery topic:<br><br>“" +
        escapeHTML(topic) +
        "”";
}

function showSkillTrading() {
    document.getElementById("tradeResult").innerHTML =
        "🔄 Teach what you know and learn what someone else knows!";
}

function formatMessage(text) {
    return escapeHTML(String(text))
        .replace(/\n/g, "<br>");
}

function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

window.addEventListener("load", () => {
    const savedUsername =
        localStorage.getItem("teachlyLastUser");

    if (savedUsername) {
        const saved =
            localStorage.getItem("teachly_" + savedUsername);

        if (saved) {
            currentUser = JSON.parse(saved);

            document
                .getElementById("loginSection")
                .classList.add("hidden");

            document
                .getElementById("appSection")
                .classList.remove("hidden");

            updateProfile();
        }
    }
});
