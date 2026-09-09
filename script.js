/* =========================
   TEACHLY DATA
========================= */

let state = JSON.parse(localStorage.getItem("teachlyState")) || {
  name: "",
  coins: 0,
  sessions: 0,
  badges: [],
  owned: []
};

let currentRole = "";
let currentPerson = "";

function save() {
  localStorage.setItem("teachlyState", JSON.stringify(state));
}


/* =========================
   START
========================= */

function startTeachly() {

  const name = document
    .getElementById("usernameInput")
    .value
    .trim();

  if (!name) {
    showToast("Please enter your username");
    return;
  }

  state.name = name;
  save();

  document.getElementById("welcomeText").textContent =
    "Welcome, " + state.name + "!";

  openPage("homePage");
  updateAll();
}


/* =========================
   PAGE SYSTEM
========================= */

function openPage(id) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  updateAll();
}

function goHome() {
  openPage("homePage");
}


/* =========================
   TEACHER / LEARNER
========================= */

function chooseRole(role) {

  currentRole = role;

  openPage("searchPage");

  if (role === "learner") {
    document.getElementById("searchTitle").textContent =
      "Finding a teacher...";
    document.getElementById("searchText").textContent =
      "Looking for a teacher volunteer";
  } else {
    document.getElementById("searchTitle").textContent =
      "Finding a learner...";
    document.getElementById("searchText").textContent =
      "Looking for a learner volunteer";
  }

  setTimeout(() => {

    /*
      DEMO MATCHING

      A real multi-user volunteer system needs
      a backend/database such as Firebase or Supabase.
    */

    const found = Math.random() > 0.5;

    if (found) {

      currentPerson =
        role === "learner"
          ? "Arjun • Java Teacher"
          : "Meera • Science Learner";

      state.sessions++;
      save();

      openChat(currentPerson);

    } else {

      if (role === "learner") {

        showToast("Can't find teacher volunteer");

        setTimeout(() => {

          const useAI = confirm(
            "Can't find teacher volunteer.\n\nDo you want AI to teach you?"
          );

          if (useAI) {
            openAITeacher();
          } else {
            goHome();
          }

        }, 500);

      } else {

        showToast("Can't find learner volunteer");

        setTimeout(goHome, 1200);
      }
    }

  }, 1800);
}


/* =========================
   CHAT
========================= */

function openChat(person) {

  document.getElementById("chatTitle").textContent =
    person;

  document.getElementById("chatMessages").innerHTML = `
    <div class="message">
      👋 You are connected with <b>${person}</b>
    </div>

    <div class="message">
      Please introduce yourself!
    </div>
  `;

  openPage("chatPage");
}

function sendMessage() {

  const input =
    document.getElementById("messageInput");

  const text = input.value.trim();

  if (!text) return;

  const box =
    document.getElementById("chatMessages");

  box.innerHTML += `
    <div class="message me">
      ${escapeHTML(text)}
    </div>
  `;

  input.value = "";

  box.scrollTop = box.scrollHeight;
}

function addEmoji(emoji) {

  document.getElementById("messageInput").value += emoji;
}

function escapeHTML(text) {

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}


/* =========================
   AI TEACHER
========================= */

const aiTopics = [

  {
    name: "Python",
    explanation:
      "Python is a programming language known for readable syntax and is used for web development, automation, data science and AI."
  },

  {
    name: "Java",
    explanation:
      "Java is a programming language that uses classes and objects and is widely used for applications and backend systems."
  },

  {
    name: "Artificial Intelligence",
    explanation:
      "Artificial intelligence allows computer systems to perform tasks that normally require human-like reasoning or pattern recognition."
  },

  {
    name: "Space",
    explanation:
      "Space contains stars, planets, galaxies and many other objects. Our Solar System is part of the Milky Way galaxy."
  },

  {
    name: "Physics",
    explanation:
      "Physics studies matter, energy, motion, forces and how objects interact."
  },

  {
    name: "Biology",
    explanation:
      "Biology is the study of living organisms and processes such as growth, reproduction and cellular activity."
  },

  {
    name: "Cybersecurity",
    explanation:
      "Cybersecurity focuses on protecting computers, networks and information from unauthorized access and attacks."
  },

  {
    name: "Astronomy",
    explanation:
      "Astronomy is the scientific study of objects and events beyond Earth's atmosphere."
  },

  {
    name: "Mathematics",
    explanation:
      "Mathematics uses numbers, patterns, logic and structures to solve problems."
  },

  {
    name: "Chemistry",
    explanation:
      "Chemistry studies matter, its properties and the reactions that transform substances."
  }

];

let currentAITopic = null;

function openAITeacher() {

  newAITopic();
  openPage("aiPage");
}

function newAITopic() {

  currentAITopic =
    aiTopics[Math.floor(Math.random() * aiTopics.length)];

  document.getElementById("aiTopic").innerHTML = `
    <h1>${currentAITopic.name}</h1>
    <p>
      TutorBot selected a new topic for you.
      Ask questions or press EXPLAIN.
    </p>
  `;

  document.getElementById("aiAnswer").innerHTML = "";
}

function aiExplain() {

  if (!currentAITopic) newAITopic();

  document.getElementById("aiAnswer").innerHTML = `
    <h3>📚 ${currentAITopic.name}</h3>
    <p>${currentAITopic.explanation}</p>
  `;
}


/* =========================
   AI TEACHER MODE
========================= */

function teacherAIHelp() {

  const topic =
    aiTopics[Math.floor(Math.random() * aiTopics.length)];

  document.getElementById("teacherAIResult").innerHTML = `
    <h3>🤖 Teacher AI Assistant</h3>

    <p><b>Suggested lesson:</b> ${topic.name}</p>

    <p>
      <b>Lesson idea:</b>
      Explain ${topic.name} using a simple example,
      ask the learner one question, then give them
      a small challenge.
    </p>

    <p>
      <b>Starter question:</b>
      "What do you already know about ${topic.name}?"
    </p>

    <p>
      <b>Activity:</b>
      Ask the learner to explain the topic in their own words.
    </p>
  `;
}


/* =========================
   MYSTERY TOPIC
========================= */

const mysteryTopics = [

  ["Black Holes",
   "Extremely dense astronomical objects with gravity so strong that light cannot escape from within the event horizon."],

  ["Deep Ocean",
   "The deep ocean is a huge environment with unusual animals, pressure and almost no sunlight."],

  ["Antarctica",
   "Antarctica is Earth's southernmost continent and contains most of the planet's ice."],

  ["Quantum Physics",
   "Quantum physics describes nature at very small scales such as atoms and particles."],

  ["Volcanoes",
   "Volcanoes form when magma and gases reach Earth's surface."],

  ["Human Brain",
   "The brain coordinates many functions including movement, senses, memory and thinking."],

  ["Robotics",
   "Robotics combines engineering and computing to design machines that can perform tasks."],

  ["Ocean Currents",
   "Large movements of seawater help distribute heat around Earth's oceans."]
];

function mysteryTopic() {

  const item =
    mysteryTopics[
      Math.floor(Math.random() * mysteryTopics.length)
    ];

  document.getElementById("mysteryTitle").textContent =
    item[0];

  document.getElementById("mysteryDescription").textContent =
    item[1];

  openPage("mysteryPage");
}


/* =========================
   QUIZ
========================= */

const quizQuestions = [

  {
    q: "What three things are needed by plants for photosynthesis?",
    groups: [
      ["light", "sunlight"],
      ["water"],
      ["carbon dioxide", "co2"]
    ],
    answer:
      "Plants need light, water and carbon dioxide for photosynthesis."
  },

  {
    q: "What does AI stand for and what is its basic purpose?",
    groups: [
      ["artificial intelligence"],
      ["computer", "machine", "system"],
      ["tasks", "problem", "reason"]
    ],
    answer:
      "AI means Artificial Intelligence. It allows computer systems to perform tasks that normally require intelligent reasoning."
  },

  {
    q: "What is gravity?",
    groups: [
      ["force"],
      ["attract", "attraction", "pull"],
      ["mass", "object", "body"]
    ],
    answer:
      "Gravity is a force of attraction between objects with mass."
  },

  {
    q: "What is the capital of India?",
    groups: [
      ["new delhi", "delhi"]
    ],
    answer:
      "The capital of India is New Delhi."
  }

];

let quizIndex = 0;
let quizAnswered = false;

function startQuiz() {

  quizIndex =
    Math.floor(Math.random() * quizQuestions.length);

  quizAnswered = false;

  openPage("quizPage");

  setupQuiz();
}

function setupQuiz() {

  if (!quizQuestions[quizIndex]) {
    quizIndex = 0;
  }

  quizAnswered = false;

  document.getElementById("quizQuestion").innerHTML = `
    <h2>${quizQuestions[quizIndex].q}</h2>
    <p>Give a complete answer, not just one keyword.</p>
  `;

  document.getElementById("quizAnswer").value = "";
  document.getElementById("quizResult").innerHTML = "";
}

function normalize(text) {

  return text
    .toLowerCase()
    .replace(/[.,!?;:()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


/*
  IMPORTANT QUIZ FIX:

  It does NOT simply check whether the answer
  contains one keyword.

  It checks whether the important concepts
  needed for the complete answer are present.
*/

function checkQuiz() {

  if (quizAnswered) {
    showToast("This question has already been checked.");
    return;
  }

  const userAnswer =
    normalize(
      document.getElementById("quizAnswer").value
    );

  if (userAnswer.length < 10) {

    document.getElementById("quizResult").innerHTML = `
      <p>❌ Your answer is too short.</p>
      <p>Please explain your answer completely.</p>
    `;

    return;
  }

  const question = quizQuestions[quizIndex];

  let conceptsFound = 0;

  question.groups.forEach(group => {

    const found = group.some(word =>
      userAnswer.includes(word)
    );

    if (found) conceptsFound++;
  });

  const required =
    question.groups.length;

  /*
    Every important concept must be present.
  */

  if (conceptsFound === required) {

    quizAnswered = true;

    state.coins += 10;
    state.sessions++;

    save();

    document.getElementById("quizResult").innerHTML = `
      <h3>✅ Correct!</h3>
      <p>Your answer contains all the important concepts.</p>
      <p>🪙 +10 TeachCoins</p>
    `;

    updateAll();

  } else {

    const missing =
      required - conceptsFound;

    document.getElementById("quizResult").innerHTML = `
      <h3>❌ Not complete yet.</h3>
      <p>
        Your answer is missing ${missing}
        important concept${missing === 1 ? "" : "s"}.
      </p>
      <p>
        Think about the full question and try again.
      </p>
    `;
  }
}


/* =========================
   PEOPLE
========================= */

const people = [

  ["Arjun", "Java", "👨‍💻"],
  ["Meera", "Biology", "👩‍🔬"],
  ["Kavin", "Python", "🧑‍💻"],
  ["Ananya", "Physics", "👩‍🚀"],
  ["Rohan", "Mathematics", "🧠"],
  ["Sara", "English", "📖"],
  ["Vikram", "Robotics", "🤖"],
  ["Diya", "Chemistry", "🧪"],
  ["Rahul", "Astronomy", "🔭"],
  ["Ishita", "AI", "🤖"]
];

function loadPeople() {

  const box =
    document.getElementById("peopleList");

  box.innerHTML = people.map(person => `

    <div class="person">

      <div>
        <div style="font-size:35px">
          ${person[2]}
        </div>

        <h3>${person[0]}</h3>
        <p>Teaches: ${person[1]}</p>
      </div>

      <button onclick="connectPerson('${person[0]} • ${person[1]}')">
        CONNECT
      </button>

    </div>

  `).join("");
}

function connectPerson(person) {

  currentPerson = person;

  state.sessions++;
  save();

  openChat(person);
}


/* =========================
   BADGES
========================= */

const badgeRequirements = [
  5,
  10,
  25,
  50,
  100,
  200,
  300,
  500,
  750,
  1000
];

const badgeNames = [
  "First Step",
  "Learner",
  "Explorer",
  "Knowledge Seeker",
  "Smart Mind",
  "Expert",
  "Master",
  "Legend",
  "Grand Master",
  "Teachly Champion"
];

const badgeIcons = [
  "🌱",
  "📚",
  "🔎",
  "🧠",
  "⭐",
  "🏅",
  "🏆",
  "👑",
  "💎",
  "🌟"
];

function renderBadges() {

  let unlocked = 0;

  const html =
    badgeRequirements.map((req, i) => {

      const isUnlocked =
        state.sessions >= req;

      if (isUnlocked) unlocked++;

      return `
        <div class="badge ${isUnlocked ? "" : "locked"}">

          <div class="badgeIcon">
            ${isUnlocked ? badgeIcons[i] : "🔒"}
          </div>

          <h3>${badgeNames[i]}</h3>

          <p>
            ${req} sessions
          </p>

        </div>
      `;

    }).join("");

  document.getElementById("allBadges").innerHTML = html;
  document.getElementById("badgesHome").innerHTML =
    html.slice(0, 1200);

  document.getElementById("profileBadges").textContent =
    unlocked;
}


/* =========================
   SHOP
========================= */

const shopItems = [

  ["Galaxy Theme", 30, "🌌"],
  ["Spark Badge", 50, "⚡"],
  ["Rocket Avatar", 75, "🚀"],
  ["Scholar Frame", 100, "🎓"],
  ["Master Crown", 200, "👑"]
];

function renderShop() {

  const html =
    shopItems.map((item, index) => {

      const owned =
        state.owned.includes(index);

      const enough =
        state.coins >= item[1];

      return `
        <div class="shopItem">

          <div style="font-size:45px">
            ${item[2]}
          </div>

          <h3>${item[0]}</h3>

          <div class="price">
            🪙 ${item[1]}
          </div>

          <button
            class="${!enough && !owned ? "notEnough" : ""}"
            onclick="buyItem(${index})"
          >
            ${
              owned
                ? "OWNED"
                : enough
                  ? "BUY"
                  : "NOT ENOUGH COINS!"
            }
          </button>

        </div>
      `;

    }).join("");

  document.getElementById("shopList").innerHTML = html;
  document.getElementById("shopHome").innerHTML = html;
}

function buyItem(index) {

  const item = shopItems[index];

  if (state.owned.includes(index)) {
    showToast("Already owned!");
    return;
  }

  if (state.coins < item[1]) {

    showToast("Not enough coins!");
    return;
  }

  state.coins -= item[1];
  state.owned.push(index);

  save();

  showToast("Purchased!");
  updateAll();
}


/* =========================
   PROFILE
========================= */

function updateProfile() {

  document.getElementById("profileName").textContent =
    state.name;

  document.getElementById("profileSessions").textContent =
    state.sessions;

  document.getElementById("profileCoins").textContent =
    state.coins;

  document.getElementById("profileBadges").textContent =
    badgeRequirements.filter(
      x => state.sessions >= x
    ).length;
}


/* =========================
   REAL WORLD MAP
========================= */

let map;
let countryLayer;


/*
  Country information.

  The map itself uses Leaflet + OpenStreetMap
  so it behaves like an actual interactive map.
*/

const countries = {

  "India": {
    capital: "New Delhi",
    continent: "Asia",
    population: "Over 1.4 billion",
    language: "Hindi, English and many regional languages",
    currency: "Indian Rupee (INR)",
    fact: "India is one of the world's most geographically and culturally diverse countries."
  },

  "Japan": {
    capital: "Tokyo",
    continent: "Asia",
    population: "About 124 million",
    language: "Japanese",
    currency: "Japanese Yen (JPY)",
    fact: "Japan is an island country in East Asia."
  },

  "United States": {
    capital: "Washington, D.C.",
    continent: "North America",
    population: "Over 300 million",
    language: "English is the most widely spoken language",
    currency: "US Dollar (USD)",
    fact: "The United States contains a wide range of climates and landscapes."
  },

  "Brazil": {
    capital: "Brasília",
    continent: "South America",
    population: "Over 200 million",
    language: "Portuguese",
    currency: "Brazilian Real (BRL)",
    fact: "Brazil contains a large part of the Amazon rainforest."
  },

  "Australia": {
    capital: "Canberra",
    continent: "Oceania",
    population: "About 27 million",
    language: "English is the main language",
    currency: "Australian Dollar (AUD)",
    fact: "Australia is both a country and a continent."
  },

  "Egypt": {
    capital: "Cairo",
    continent: "Africa",
    population: "Over 100 million",
    language: "Arabic",
    currency: "Egyptian Pound (EGP)",
    fact: "Ancient Egypt is famous for its pyramids and civilization along the Nile."
  },

  "United Kingdom": {
    capital: "London",
    continent: "Europe",
    population: "About 69 million",
    language: "English",
    currency: "Pound Sterling (GBP)",
    fact: "The United Kingdom is made up of four constituent countries."
  },

  "China": {
    capital: "Beijing",
    continent: "Asia",
    population: "Over 1.4 billion",
    language: "Mandarin Chinese",
    currency: "Renminbi / Yuan (CNY)",
    fact: "China has one of the world's oldest continuous civilizations."
  },

  "Canada": {
    capital: "Ottawa",
    continent: "North America",
    population: "About 40 million",
    language: "English and French",
    currency: "Canadian Dollar (CAD)",
    fact: "Canada has the longest coastline of any country."
  },

  "South Africa": {
    capital: "Pretoria, Cape Town and Bloemfontein",
    continent: "Africa",
    population: "About 63 million",
    language: "Multiple official languages",
    currency: "South African Rand (ZAR)",
    fact: "South Africa has three capital cities."
  },

  "Antarctica": {
    capital: "No capital",
    continent: "Antarctica",
    population: "No permanent population",
    language: "No official language",
    currency: "No official currency",
    fact: "Antarctica is Earth's southernmost continent and contains most of the world's land ice."
  }

};


function initMap() {

  if (map) return;

  map = L.map("worldMap", {
    worldCopyJump: true,
    minZoom: 1.5,
    maxZoom: 7
  }).setView([20, 0], 2);

  /*
    OpenStreetMap gives LearnSphere an actual
    world-map appearance with country boundaries.
  */

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19
    }
  ).addTo(map);

  /*
    Add visible country markers for the countries
    with detailed Teachly information.
  */

  const locations = {

    "India": [22.5, 79],
    "Japan": [36, 138],
    "United States": [39, -98],
    "Brazil": [-10, -52],
    "Australia": [-25, 134],
    "Egypt": [26, 30],
    "United Kingdom": [54, -2],
    "China": [35, 103],
    "Canada": [56, -106],
    "South Africa": [-30, 25],
    "Antarctica": [-82, 0]

  };

  Object.keys(locations).forEach(name => {

    const marker =
      L.marker(locations[name])
        .addTo(map);

    marker.bindPopup(`
      <b>${name}</b><br>
      Tap for details
    `);

    marker.on("click", () => {
      showCountry(name);
    });

  });

}


/* =========================
   COUNTRY DETAILS
========================= */

function showCountry(name) {

  const country = countries[name];

  if (!country) {
    showToast("Country information coming soon!");
    return;
  }

  document.getElementById("countryInfo").innerHTML = `

    <h2>🌎 ${name}</h2>

    <p><b>Continent:</b> ${country.continent}</p>

    <p><b>Capital:</b> ${country.capital}</p>

    <p><b>Population:</b> ${country.population}</p>

    <p><b>Language:</b> ${country.language}</p>

    <p><b>Currency:</b> ${country.currency}</p>

    <p>
      <b>📚 Teachly Fact:</b>
      ${country.fact}
    </p>

  `;

  if (map) {

    const locations = {
      "India": [22.5, 79],
      "Japan": [36, 138],
      "United States": [39, -98],
      "Brazil": [-10, -52],
      "Australia": [-25, 134],
      "Egypt": [26, 30],
      "United Kingdom": [54, -2],
      "China": [35, 103],
      "Canada": [56, -106],
      "South Africa": [-30, 25],
      "Antarctica": [-82, 0]
    };

    if (locations[name]) {
      map.setView(locations[name], 4);
    }
  }
}


/* =========================
   UPDATE EVERYTHING
========================= */

function updateAll() {

  document.getElementById("homeCoins").textContent =
    state.coins;

  document.getElementById("shopCoins").textContent =
    state.coins;

  document.getElementById("welcomeText").textContent =
    state.name
      ? "Welcome, " + state.name + "!"
      : "";

  renderBadges();
  renderShop();
  updateProfile();
  loadPeople();

  if (
    document
      .getElementById("mapPage")
      .classList.contains("active")
  ) {
    setTimeout(initMap, 100);
  }
}


/* =========================
   TOAST
========================= */

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2200);
}


/* =========================
   MAP PAGE DETECTION
========================= */

const originalOpenPage = openPage;

openPage = function(id) {

  originalOpenPage(id);

  if (id === "mapPage") {

    setTimeout(() => {
      initMap();

      if (map) {
        map.invalidateSize();
      }
    }, 150);
  }
};


/* =========================
   INITIAL LOAD
========================= */

if (state.name) {

  document.getElementById("usernameInput").value =
    state.name;

  document.getElementById("welcomeText").textContent =
    "Welcome, " + state.name + "!";

  openPage("homePage");

} else {

  openPage("namePage");
}

updateAll();
