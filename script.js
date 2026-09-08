let currentUser = null;
let selectedRole = "";
let socket = null;
let currentSession = false;
let currentRoom = null;


/* =========================
   BADGES
========================= */

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


/* =========================
   SHOP
========================= */

const products = [

    {
        id: "ring",
        name: "Orbit Ring",
        price: 30
    },

    {
        id: "spark",
        name: "Spark",
        price: 45
    },

    {
        id: "crown",
        name: "Crown Glow",
        price: 70
    }

];


/* =========================
   COUNTRY DATA
========================= */

const countries = {

    India: {

        flag: "🇮🇳",

        capital: "New Delhi",

        language: "Hindi & English",

        currency: "Indian Rupee (INR)",

        continent: "Asia",

        description:
            "India is a highly diverse country known for its languages, traditions, food, festivals, technology, cinema and long history.",

        places: [

            {
                name: "Taj Mahal",

                description:
                    "The Taj Mahal is a famous white-marble monument in Agra and one of India's best-known landmarks.",

                image:
                    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Bollywood",

                description:
                    "Bollywood is the major Hindi-language film industry centered in Mumbai.",

                image:
                    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Indian Cuisine",

                description:
                    "India has many regional cuisines with different ingredients, spices and cooking traditions.",

                image:
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    France: {

        flag: "🇫🇷",

        capital: "Paris",

        language: "French",

        currency: "Euro (EUR)",

        continent: "Europe",

        description:
            "France is known around the world for art, fashion, cuisine, architecture and history.",

        places: [

            {
                name: "Eiffel Tower",

                description:
                    "The Eiffel Tower is a famous iron landmark in Paris.",

                image:
                    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Louvre Museum",

                description:
                    "The Louvre is one of the world's major museums and is located in Paris.",

                image:
                    "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    Japan: {

        flag: "🇯🇵",

        capital: "Tokyo",

        language: "Japanese",

        currency: "Japanese Yen (JPY)",

        continent: "Asia",

        description:
            "Japan combines modern technology and large cities with long-standing cultural traditions.",

        places: [

            {
                name: "Mount Fuji",

                description:
                    "Mount Fuji is Japan's highest mountain and an important cultural symbol.",

                image:
                    "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Tokyo",

                description:
                    "Tokyo is a huge metropolitan area known for technology, food, shopping and culture.",

                image:
                    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    "United States": {

        flag: "🇺🇸",

        capital: "Washington, D.C.",

        language: "English is most widely used",

        currency: "US Dollar (USD)",

        continent: "North America",

        description:
            "The United States is a large country with diverse landscapes, cultures, industries and cities.",

        places: [

            {
                name: "New York City",

                description:
                    "New York City is a major global city known for finance, arts, media and landmarks.",

                image:
                    "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Grand Canyon",

                description:
                    "The Grand Canyon is a vast canyon in Arizona carved by the Colorado River.",

                image:
                    "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    Egypt: {

        flag: "🇪🇬",

        capital: "Cairo",

        language: "Arabic",

        currency: "Egyptian Pound (EGP)",

        continent: "Africa",

        description:
            "Egypt is famous for its ancient civilization, the Nile River and archaeological sites.",

        places: [

            {
                name: "Pyramids of Giza",

                description:
                    "The Pyramids of Giza are ancient monumental structures near Cairo.",

                image:
                    "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Nile River",

                description:
                    "The Nile has played a major role in Egyptian agriculture, settlement and history.",

                image:
                    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    Brazil: {

        flag: "🇧🇷",

        capital: "Brasília",

        language: "Portuguese",

        currency: "Brazilian Real (BRL)",

        continent: "South America",

        description:
            "Brazil is South America's largest country and is known for biodiversity, music, football and cities.",

        places: [

            {
                name: "Amazon Rainforest",

                description:
                    "The Amazon rainforest contains extraordinary biodiversity and spans a large part of northern South America.",

                image:
                    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Rio de Janeiro",

                description:
                    "Rio de Janeiro is a famous coastal city known for mountains, beaches and landmarks.",

                image:
                    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    Australia: {

        flag: "🇦🇺",

        capital: "Canberra",

        language: "English",

        currency: "Australian Dollar (AUD)",

        continent: "Oceania",

        description:
            "Australia is known for unique wildlife, large landscapes and coastal cities.",

        places: [

            {
                name: "Sydney Opera House",

                description:
                    "The Sydney Opera House is a distinctive performing-arts building beside Sydney Harbour.",

                image:
                    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d4?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Great Barrier Reef",

                description:
                    "The Great Barrier Reef is a huge coral reef system off Australia's northeast coast.",

                image:
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    Canada: {

        flag: "🇨🇦",

        capital: "Ottawa",

        language: "English & French",

        currency: "Canadian Dollar (CAD)",

        continent: "North America",

        description:
            "Canada is known for forests, lakes, mountains and multicultural cities.",

        places: [

            {
                name: "Banff",

                description:
                    "Banff is known for mountains, lakes and dramatic natural scenery.",

                image:
                    "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Niagara Falls",

                description:
                    "Niagara Falls is a group of powerful waterfalls on the Canada–US border.",

                image:
                    "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    Italy: {

        flag: "🇮🇹",

        capital: "Rome",

        language: "Italian",

        currency: "Euro (EUR)",

        continent: "Europe",

        description:
            "Italy is known for Roman history, Renaissance art, architecture and regional cuisine.",

        places: [

            {
                name: "Colosseum",

                description:
                    "The Colosseum is an ancient Roman amphitheatre in Rome.",

                image:
                    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Venice",

                description:
                    "Venice is a historic city built around canals and islands.",

                image:
                    "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    China: {

        flag: "🇨🇳",

        capital: "Beijing",

        language: "Mandarin Chinese",

        currency: "Renminbi (CNY)",

        continent: "Asia",

        description:
            "China is a vast country with thousands of years of history and major modern cities.",

        places: [

            {
                name: "Great Wall",

                description:
                    "The Great Wall is a historic fortification system stretching across northern China.",

                image:
                    "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Forbidden City",

                description:
                    "The Forbidden City is a historic palace complex in central Beijing.",

                image:
                    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    "United Kingdom": {

        flag: "🇬🇧",

        capital: "London",

        language: "English",

        currency: "Pound Sterling (GBP)",

        continent: "Europe",

        description:
            "The United Kingdom has a long history and major contributions to literature, science, music and culture.",

        places: [

            {
                name: "London",

                description:
                    "London is the capital city and is known for landmarks, museums, theatres and culture.",

                image:
                    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Stonehenge",

                description:
                    "Stonehenge is a prehistoric monument in Wiltshire made from a circle of large stones.",

                image:
                    "https://images.unsplash.com/photo-1599833975787-5f9f4b9b9b9b?auto=format&fit=crop&w=900&q=80"
            }

        ]

    },


    Mexico: {

        flag: "🇲🇽",

        capital: "Mexico City",

        language: "Spanish",

        currency: "Mexican Peso (MXN)",

        continent: "North America",

        description:
            "Mexico is known for ancient civilizations, diverse regional cuisine, art and traditions.",

        places: [

            {
                name: "Chichen Itza",

                description:
                    "Chichen Itza is a major archaeological site associated with the Maya civilization.",

                image:
                    "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=900&q=80"
            },

            {
                name: "Mexico City",

                description:
                    "Mexico City is a huge capital with museums, historic districts and diverse food culture.",

                image:
                    "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=900&q=80"
            }

        ]

    }

};


/* =========================
   AUTH
========================= */

function setAuthMode(mode) {

    document
        .getElementById("loginForm")
        .classList.toggle(
            "hidden",
            mode !== "login"
        );

    document
        .getElementById("signupForm")
        .classList.toggle(
            "hidden",
            mode !== "signup"
        );

    document
        .getElementById("verifyBox")
        .classList.add("hidden");

}


function showAuthMessage(text) {

    document.getElementById(
        "authMessage"
    ).textContent = text;

}


async function api(
    url,
    body,
    method = "POST"
) {

    const response = await fetch(
        url,
        {
            method,
            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                body
                    ? JSON.stringify(body)
                    : undefined
        }
    );


    const data =
        await response
            .json()
            .catch(() => ({}));


    if (!response.ok) {

        throw new Error(
            data.error ||
            "Request failed."
        );

    }


    if (data.token) {

        localStorage.setItem(
            "teachlySession",
            data.token
        );

    }


    return data;

}


/* SIGN UP */

async function checkAndRegister() {

    const username =
        document
            .getElementById(
                "signupUsername"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "signupEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "signupPassword"
            )
            .value;


    if (!username) {

        showAuthMessage(
            "Please enter a username."
        );

        return;

    }


    if (
        !email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

        showAuthMessage(
            "Please enter a valid email address."
        );

        return;

    }


    if (password.length < 8) {

        showAuthMessage(
            "Password must contain at least 8 characters."
        );

        return;

    }


    try {

        const data =
            await api(
                "/api/auth/register",
                {
                    username,
                    email,
                    password
                }
            );


        showAuthMessage(
            data.message
        );


        document
            .getElementById(
                "signupForm"
            )
            .classList.add("hidden");


        document
            .getElementById(
                "verifyBox"
            )
            .classList.remove("hidden");

    }

    catch (error) {

        showAuthMessage(
            error.message
        );

    }

}


/* VERIFY */

async function verifyEmail() {

    const email =
        document
            .getElementById(
                "signupEmail"
            )
            .value
            .trim();


    const code =
        document
            .getElementById(
                "verifyCode"
            )
            .value
            .trim();


    try {

        const data =
            await api(
                "/api/auth/verify-email",
                {
                    email,
                    code
                }
            );


        currentUser =
            data.user;


        finishLogin();

    }

    catch (error) {

        showAuthMessage(
            error.message
        );

    }

}


/* LOGIN */

async function login() {

    const email =
        document
            .getElementById(
                "loginEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value;


    try {

        const data =
            await api(
                "/api/auth/login",
                {
                    email,
                    password
                }
            );


        currentUser =
            data.user;


        finishLogin();

    }

    catch (error) {

        showAuthMessage(
            error.message
        );

    }

}


/* AFTER LOGIN */

function finishLogin() {

    document
        .getElementById(
            "authPage"
        )
        .classList.add("hidden");


    document
        .getElementById(
            "mainNav"
        )
        .classList.remove("hidden");


    showPage("homePage");

    updateProfile();

    connectSocket();

}


/* LOGOUT */

async function logout() {

    try {

        await api(
            "/api/auth/logout",
            {}
        );

    }

    catch (_) {}


    localStorage.removeItem(
        "teachlySession"
    );


    currentUser = null;


    if (socket) {

        socket.disconnect();

    }


    document
        .getElementById(
            "mainNav"
        )
        .classList.add("hidden");


    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            page =>
                page.classList.add(
                    "hidden"
                )
        );


    document
        .getElementById(
            "authPage"
        )
        .classList.remove("hidden");

}


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(id) {

    if (!currentUser) {

        return;

    }


    document
        .querySelectorAll(
            "main > .page"
        )
        .forEach(
            page =>
                page.classList.add(
                    "hidden"
                )
        );


    document
        .getElementById(id)
        .classList.remove("hidden");


    if (id === "worldPage") {

        setTimeout(
            initMap,
            100
        );

    }


    if (id === "badgesPage") {

        renderBadges();

    }


    if (id === "profilePage") {

        renderEffects();

    }

}


/* =========================
   PROFILE
========================= */

function updateProfile() {

    document.getElementById(
        "profileName"
    ).textContent =
        currentUser.username;


    document.getElementById(
        "profileEmail"
    ).textContent =
        currentUser.email;


    document.getElementById(
        "sessionCount"
    ).textContent =
        currentUser.sessions;


    document.getElementById(
        "streakCount"
    ).textContent =
        currentUser.streak;


    document.getElementById(
        "ticketCount"
    ).textContent =
        currentUser.tickets;


    document.getElementById(
        "navTickets"
    ).textContent =
        "🎫 " +
        currentUser.tickets;


    document.getElementById(
        "profileTickets"
    ).textContent =
        currentUser.tickets;


    document.getElementById(
        "profileSessions"
    ).textContent =
        currentUser.sessions;


    document.getElementById(
        "streakMessage"
    ).textContent =
        currentUser.streak
            ? `Knowledge streak: ${currentUser.streak} 🔥`
            : "Start your first session!";


    document.getElementById(
        "profileImage"
    ).src =
        currentUser.profileImage ||
        "https://via.placeholder.com/150";


    applyEffect();

}


/* =========================
   ROLE
========================= */

function chooseRole(role) {

    selectedRole = role;


    document
        .getElementById(
            "teacherBtn"
        )
        .classList.toggle(
            "primary",
            role === "teacher"
        );


    document
        .getElementById(
            "learnerBtn"
        )
        .classList.toggle(
            "primary",
            role === "learner"
        );


    document
        .getElementById(
            "onlineStatus"
        )
        .textContent =
        `Role selected: ${role}. Enter a topic and find a person.`;

}


/* =========================
   MULTIPLAYER
========================= */

function connectSocket() {

    if (
        socket &&
        socket.connected
    ) {

        return;

    }


    socket = io({

        auth: {

            token:
                localStorage.getItem(
                    "teachlySession"
                )

        }

    });


    socket.on(
        "connect",
        () => {

            socket.emit(
                "authSession"
            );

        }
    );


    socket.on(
        "matchFound",
        data => {

            currentSession = true;

            currentRoom =
                data.room;


            document
                .getElementById(
                    "chatPanel"
                )
                .classList.remove(
                    "hidden"
                );


            document
                .getElementById(
                    "chatTitle"
                )
                .textContent =
                `Session with ${data.partner.username} — ${data.topic}`;


            document
                .getElementById(
                    "onlineStatus"
                )
                .textContent =
                "Connected to a real person.";


            addMsg(
                "chatMessages",
                "Your text session has started.",
                "system"
            );

        }
    );


    socket.on(
        "sessionMessage",
        data => {

            addMsg(
                "chatMessages",

                `${data.username}: ${data.message}`,

                data.username ===
                    currentUser.username
                    ? "mine"
                    : ""
            );

        }
    );


    socket.on(
        "noUsersFound",
        () => {

            const useAI =
                confirm(
                    "Unable to find volunteer connecting to ai instead\n\nWould you like AI Mode?"
                );


            if (useAI) {

                openAIMode();

            }

            else {

                document
                    .getElementById(
                        "onlineStatus"
                    )
                    .textContent =
                    "No people found right now. Try again.";

            }

        }
    );


    socket.on(
        "partnerLeft",
        () => {

            addMsg(
                "chatMessages",
                "Your partner left the session.",
                "system"
            );

            currentSession = false;

        }
    );


    socket.on(
        "sessionCompleted",
        user => {

            currentUser = user;

            updateProfile();

            addMsg(
                "chatMessages",
                "Session completed! Your progress was saved.",
                "system"
            );

        }
    );

}


/* FIND PERSON */

function findPeople() {

    if (!selectedRole) {

        alert(
            "Choose Teacher or Learner first."
        );

        return;

    }


    const topic =
        document
            .getElementById(
                "topicInput"
            )
            .value
            .trim();


    if (!topic) {

        alert(
            "Enter a topic."
        );

        return;

    }


    connectSocket();


    setTimeout(
        () => {

            socket.emit(
                "findUser",
                {
                    role:
                        selectedRole,

                    topic
                }
            );

        },
        200
    );


    document
        .getElementById(
            "onlineStatus"
        )
        .textContent =
        "Searching for a real person...";

}


/* SEND */

function sendOnlineMessage() {

    const input =
        document
            .getElementById(
                "onlineMessage"
            );


    const message =
        input.value.trim();


    if (
        !message ||
        !currentSession
    ) {

        return;

    }


    socket.emit(
        "sessionMessage",
        {
            room:
                currentRoom,

            message
        }
    );


    input.value = "";

}


/* LEAVE */

function leaveOnlineSession() {

    if (
        socket &&
        currentRoom
    ) {

        socket.emit(
            "leaveSession",
            {
                room:
                    currentRoom
            }
        );

    }


    currentSession = false;

    currentRoom = null;


    document
        .getElementById(
            "chatPanel"
        )
        .classList.add("hidden");


    document
        .getElementById(
            "onlineStatus"
        )
        .textContent =
        "Session ended.";

}


/* MESSAGE */

function addMsg(
    elementId,
    text,
    className = ""
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "msg " +
        className;


    element.textContent =
        text;


    const container =
        document.getElementById(
            elementId
        );


    container.appendChild(
        element
    );


    container.scrollTop =
        container.scrollHeight;

}


/* =========================
   AI
========================= */

function openAIMode() {

    document
        .getElementById(
            "aiPanel"
        )
        .classList.remove(
            "hidden"
        );


    if (
        !document
            .getElementById(
                "aiMessages"
            )
            .children.length
    ) {

        addMsg(
            "aiMessages",
            "Hi! Ask me anything. I can explain concepts, give examples, quiz you, or re-explain something more simply.",
            "system"
        );

    }

}


function closeAIMode() {

    document
        .getElementById(
            "aiPanel"
        )
        .classList.add(
            "hidden"
        );

}


async function sendAI() {

    const input =
        document
            .getElementById(
                "aiMessage"
            );


    const message =
        input.value.trim();


    if (!message) {

        return;

    }


    addMsg(
        "aiMessages",
        "You: " + message,
        "mine"
    );


    input.value = "";


    try {

        const data =
            await api(
                "/api/ai",
                {
                    message
                }
            );


        addMsg(
            "aiMessages",
            "AI: " +
                data.answer
        );

    }

    catch (error) {

        addMsg(
            "aiMessages",
            "AI: " +
                error.message
        );

    }

}


/* =========================
   MYSTERY TOPIC
========================= */

function mysteryTopic() {

    const topics = [

        "photosynthesis",

        "basic Python",

        "French greetings",

        "probability",

        "space exploration",

        "Indian geography",

        "creative writing",

        "electricity"

    ];


    const topic =
        topics[
            Math.floor(
                Math.random() *
                topics.length
            )
        ];


    document
        .getElementById(
            "mysteryOutput"
        )
        .textContent =
        `Your mystery topic: ${topic}. Try teaching it back!`;

}


/* =========================
   SHOP
========================= */

function openShop() {

    document
        .getElementById(
            "shopModal"
        )
        .classList.remove(
            "hidden"
        );


    renderShop();

}


function closeShop() {

    document
        .getElementById(
            "shopModal"
        )
        .classList.add(
            "hidden"
        );

}


function renderShop() {

    document
        .getElementById(
            "shopModalGrid"
        )
        .innerHTML =

        products
            .map(
                product => `

                <div class="card">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Profile effect.
                    </p>

                    <b>
                        🎫 ${product.price}
                    </b>

                    <br><br>

                    <button
                        onclick="buyProduct('${product.id}')">

                        ${
                            currentUser
                                .ownedEffects
                                ?.includes(
                                    product.id
                                )
                                ? "Equip"
                                : "Buy"
                        }

                    </button>

                </div>

                `
            )
            .join("");

}


async function buyProduct(id) {

    try {

        const data =
            await api(
                "/api/shop/buy",
                {
                    id
                }
            );


        currentUser =
            data.user;


        updateProfile();

        renderShop();

        renderEffects();

    }

    catch (error) {

        alert(
            error.message ===
                "Unable to buy product"

                ? "Unable to buy product"

                : error.message
        );

    }

}


/* EQUIP */

async function equipProduct(id) {

    try {

        const data =
            await api(
                "/api/shop/equip",
                {
                    id
                }
            );


        currentUser =
            data.user;


        updateProfile();

        renderEffects();

    }

    catch (error) {

        alert(
            error.message
        );

    }

}


/* EFFECTS */

function renderEffects() {

    const container =
        document.getElementById(
            "effectOptions"
        );


    const owned =
        currentUser
            .ownedEffects || [];


    container.innerHTML =
        products

            .filter(
                product =>
                    owned.includes(
                        product.id
                    )
            )

            .map(
                product => `

                <button
                    class="effect-option"
                    onclick="equipProduct('${product.id}')">

                    ${product.name}

                    ${
                        currentUser.equippedEffect ===
                        product.id
                            ? " ✓"
                            : ""
                    }

                </button>

                `
            )

            .join("");


    if (!container.innerHTML) {

        container.innerHTML =
            "<p>No effects owned yet.</p>";

    }

}


function applyEffect() {

    const effect =
        currentUser.equippedEffect ||
        "ring";


    const element =
        document.getElementById(
            "profileEffect"
        );


    element.className =
        "avatar-effect " +
        effect;

}


/* =========================
   PROFILE IMAGE
========================= */

async function uploadAvatar(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    if (
        file.size >
        3 * 1024 * 1024
    ) {

        alert(
            "Please choose an image under 3 MB."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        async () => {

            try {

                const data =
                    await api(
                        "/api/auth/avatar",
                        {
                            image:
                                reader.result
                        }
                    );


                currentUser =
                    data.user;


                updateProfile();

            }

            catch (error) {

                alert(
                    error.message
                );

            }

        };


    reader.readAsDataURL(
        file
    );

}


/* =========================
   BADGES
========================= */

function renderBadges() {

    document
        .getElementById(
            "badgeGrid"
        )
        .innerHTML =

        badges

            .map(
                badge => {

                    const earned =
                        currentUser
                            .earnedBadges
                            ?.includes(
                                badge.name
                            );


                    return `

                    <div
                        class="badge ${
                            earned
                                ? ""
                                : "locked"
                        }">

                        <div class="icon">
                            ${badge.icon}
                        </div>

                        <h3>
                            ${badge.name}
                        </h3>

                        <p>
                            ${badge.sessions}
                            sessions
                        </p>

                        <small>
                            ${
                                earned
                                    ? "Earned"
                                    : "Locked"
                            }
                        </small>

                    </div>

                    `;

                }
            )

            .join("");

}


/* =====================================================
   🌍 WORLD EXPLORER
===================================================== */

let map = null;

let mapLayer = null;


/*
    IMPORTANT:

    The cursor/click now actually touches
    the individual country polygon.

    It does NOT just send "Asia" or
    "continent" to the information panel.

    Each polygon gets its own country name.
*/


function initMap() {

    if (map) {

        map.invalidateSize();

        return;

    }


    map =
        L.map(
            "map",
            {
                zoomControl: true,
                minZoom: 2,
                maxZoom: 5
            }
        )
        .setView(
            [20, 0],
            2
        );


    /*
        Map background
    */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "© OpenStreetMap contributors"
        }
    )
    .addTo(map);


    /*
        Get actual world country boundaries
    */

    fetch(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    )

        .then(
            response =>
                response.json()
        )

        .then(
            world => {

                const geojson =
                    topojson.feature(
                        world,
                        world.objects.countries
                    );


                mapLayer =
                    L.geoJSON(
                        geojson,
                        {

                            style: {

                                fillOpacity:
                                    0.55,

                                weight:
                                    1

                            },


                            onEachFeature:
                                (
                                    feature,
                                    layer
                                ) => {

                                    /*
                                        Get the country
                                        belonging to the
                                        polygon the cursor
                                        touches.
                                    */

                                    const name =
                                        getCountryName(
                                            feature
                                                .properties
                                                .name
                                        );


                                    /*
                                        Small country
                                        tooltip
                                    */

                                    layer.bindTooltip(
                                        name
                                    );


                                    /*
                                        Hover
                                    */

                                    layer.on(
                                        "mouseover",
                                        () => {

                                            layer.setStyle(
                                                {
                                                    fillOpacity:
                                                        0.8,

                                                    weight:
                                                        2
                                                }
                                            );

                                        }
                                    );


                                    /*
                                        Mouse leaves
                                    */

                                    layer.on(
                                        "mouseout",
                                        () => {

                                            layer.setStyle(
                                                {
                                                    fillOpacity:
                                                        0.55,

                                                    weight:
                                                        1
                                                }
                                            );

                                        }
                                    );


                                    /*
                                        CLICK COUNTRY
                                    */

                                    layer.on(
                                        "click",
                                        () => {

                                            showCountry(
                                                name,
                                                layer
                                            );

                                        }
                                    );

                                }

                        }
                    )
                    .addTo(map);

            }
        )

        .catch(
            error => {

                console.error(
                    "World map error:",
                    error
                );

            }
        );

}


/*
    Some map datasets use
    slightly different country names.

    Convert them to the names
    used by our country database.
*/

function getCountryName(name) {

    const aliases = {

        "United States of America":
            "United States",

        "USA":
            "United States",

        "UK":
            "United Kingdom",

        "Türkiye":
            "Turkey"

    };


    return (
        aliases[name] ||
        name
    );

}


/*
    COUNTRY INFORMATION PANEL

    This is the main fix.

    When the cursor/click touches
    a country polygon, this function
    receives THAT country name.

    It then retrieves the correct
    country credentials/facts.
*/

function showCountry(
    name,
    selectedLayer
) {

    const country =
        countries[name];


    /*
        Remove previous
        selection.
    */

    if (mapLayer) {

        mapLayer.setStyle(
            {
                fillOpacity:
                    0.55,

                weight:
                    1
            }
        );

    }


    /*
        Highlight selected country.
    */

    if (selectedLayer) {

        selectedLayer.setStyle(
            {
                fillOpacity:
                    0.9,

                weight:
                    3
            }
        );

    }


    /*
        If we don't have
        detailed data yet.
    */

    if (!country) {

        document
            .getElementById(
                "countryPanel"
            )
            .innerHTML = `

                <div class="country-title">

                    <div class="flag">
                        🌍
                    </div>

                    <div>

                        <p class="eyebrow">
                            COUNTRY
                        </p>

                        <h2>
                            ${name}
                        </h2>

                    </div>

                </div>

                <p>
                    Detailed Teachly facts
                    for this country have not
                    been added yet.
                </p>

                <p>
                    Select another country
                    to explore its information.
                </p>

            `;

        return;

    }


    /*
        CORRECT COUNTRY DATA
    */

    document
        .getElementById(
            "countryPanel"
        )
        .innerHTML = `

        <div class="country-title">

            <div class="flag">
                ${country.flag}
            </div>

            <div>

                <p class="eyebrow">
                    ${country.continent}
                </p>

                <h2>
                    ${name}
                </h2>

            </div>

        </div>


        <p>
            ${country.description}
        </p>


        <div class="facts">

            <div class="fact">

                <small>
                    Capital
                </small>

                <b>
                    ${country.capital}
                </b>

            </div>


            <div class="fact">

                <small>
                    Language
                </small>

                <b>
                    ${country.language}
                </b>

            </div>


            <div class="fact">

                <small>
                    Currency
                </small>

                <b>
                    ${country.currency}
                </b>

            </div>


            <div class="fact">

                <small>
                    Continent
                </small>

                <b>
                    ${country.continent}
                </b>

            </div>

        </div>


        <h3>
            Famous For
        </h3>


        ${
            country.places
                .map(
                    (place, index) => `

                    <div
                        class="place-card"
                        onclick="showPlace('${name}', ${index})">

                        <img
                            src="${place.image}"
                            alt="${place.name}">

                        <div>

                            <b>
                                ${place.name}
                            </b>

                            <p>
                                ${place.description}
                            </p>

                        </div>

                    </div>

                    `
                )
                .join("")
        }


        <div id="placeDetail">
        </div>

    `;

}


/*
    FAMOUS PLACE DETAILS

    Clicking a place opens its
    larger image and explanation.
*/

function showPlace(
    countryName,
    index
) {

    const country =
        countries[countryName];


    if (!country) {

        return;

    }


    const place =
        country.places[index];


    document
        .getElementById(
            "placeDetail"
        )
        .innerHTML = `

        <div class="place-detail">

            <h3>
                ${place.name}
            </h3>

            <img
                src="${place.image}"
                alt="${place.name}">

            <p>
                ${place.description}
            </p>

        </div>

    `;

}


/* =========================
   ENTER KEY
========================= */

window.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            document.activeElement?.id ===
                "onlineMessage"
        ) {

            sendOnlineMessage();

        }


        if (
            event.key === "Enter" &&
            document.activeElement?.id ===
                "aiMessage"
        ) {

            sendAI();

        }

    }
);
