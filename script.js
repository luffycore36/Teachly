/* ================= TOPICS ================= */

const topics = [

  {
    name: "The Water Cycle",
    lesson:
      "Water moves around Earth in a continuous cycle. " +
      "The Sun causes evaporation. Water vapor cools and " +
      "condenses into clouds. Precipitation then returns " +
      "water to Earth.",
    q: "What process changes liquid water into water vapor?",
    a: ["evaporation"]
  },

  {
    name: "Photosynthesis",
    lesson:
      "Plants use sunlight to make food. They take in " +
      "carbon dioxide and water and produce glucose and oxygen.",
    q: "What gas do plants take in for photosynthesis?",
    a: ["carbon dioxide", "co2"]
  },

  {
    name: "Fractions",
    lesson:
      "A fraction represents part of a whole. " +
      "The top number is the numerator and the bottom " +
      "number is the denominator.",
    q: "In 3/4, what is the denominator?",
    a: ["4", "four"]
  },

  {
    name: "Gravity",
    lesson:
      "Gravity is a force of attraction between objects " +
      "with mass. Earth's gravity pulls objects toward Earth.",
    q: "What force pulls objects toward Earth?",
    a: ["gravity"]
  },

  {
    name: "The Solar System",
    lesson:
      "Our Solar System contains the Sun, planets, moons, " +
      "asteroids and comets. The Sun is at its center.",
    q: "What is at the center of our Solar System?",
    a: ["sun", "the sun"]
  },

  {
    name: "Computer Algorithms",
    lesson:
      "An algorithm is a clear sequence of steps used " +
      "to solve a problem or complete a task.",
    q: "What is a step-by-step procedure for solving a problem?",
    a: ["algorithm", "an algorithm"]
  },

  {
    name: "The Human Brain",
    lesson:
      "The brain controls many activities in the body. " +
      "It helps us think, remember, learn, move and respond.",
    q: "Which organ controls most activities of the body?",
    a: ["brain", "the brain"]
  },

  {
    name: "Electricity",
    lesson:
      "Electricity is associated with the movement of " +
      "electric charge. Circuits allow electrical energy " +
      "to power devices.",
    q: "What provides a path for electric current?",
    a: ["circuit", "a circuit"]
  },

  {
    name: "Programming",
    lesson:
      "Programming means writing instructions that computers " +
      "can follow. Languages such as JavaScript, Python and " +
      "Java are used to create software.",
    q: "What do programmers write for computers to follow?",
    a: ["instructions", "code"]
  },

  {
    name: "World Geography",
    lesson:
      "Geography is the study of Earth's places, environments, " +
      "landforms, people and how they interact.",
    q: "What subject studies Earth's places and environments?",
    a: ["geography"]
  }

];


/* ================= STATE ================= */

let state;

try {

  state =
    JSON.parse(
      localStorage.getItem("teachlyV4") || "null"
    ) || {
      name: "",
      role: "",
      coins: 100,
      sessions: 0,
      owned: []
    };

} catch {

  state = {
    name: "",
    role: "",
    coins: 100,
    sessions: 0,
    owned: []
  };

}


let currentTopic = null;


/* ================= SAVE ================= */

function save() {

  localStorage.setItem(
    "teachlyV4",
    JSON.stringify(state)
  );

  const coins =
    document.getElementById("coins");

  if (coins) {
    coins.textContent = state.coins;
  }

}


/* ================= SCREEN ================= */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen =>
      screen.classList.remove("active")
    );

  const target =
    document.getElementById(id);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo(0, 0);

}


/* ================= NAME ================= */

function continueWithName() {

  const input =
    document.getElementById("nameInput");

  const msg =
    document.getElementById("nameMsg");

  const name =
    input.value.trim();


  if (!name) {

    msg.textContent =
      "Please enter your username.";

    return;

  }


  state.name = name;

  save();

  showScreen("roleScreen");

}


/* ================= ROLE ================= */

function chooseRole(role) {

  state.role = role;

  save();

  showScreen("dashboardScreen");

  renderDashboard();

  setTimeout(() => {

    connectVolunteer(role);

  }, 400);

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

  const hello =
    document.getElementById("hello");

  const roleText =
    document.getElementById("roleText");

  const roleBadge =
    document.getElementById("roleBadge");

  const flow =
    document.getElementById("mainFlow");


  hello.textContent =
    `Hello, ${state.name}! 👋`;


  if (state.role === "teacher") {

    roleBadge.textContent =
      "👨‍🏫 TEACH";

    roleText.textContent =
      "You are in Teach mode.";

  } else {

    roleBadge.textContent =
      "🎓 LEARN";

    roleText.textContent =
      "You are in Learn mode.";

  }


  flow.innerHTML =

    state.role === "teacher"

      ? `

        <div class="flow-icon">👨‍🏫</div>

        <div class="flow-title">
          TEACH
        </div>

        <p class="status">
          Find a learner who wants to learn from you.
        </p>

        <button
          class="primary big-action"
          onclick="connectVolunteer('teacher')">
          🔎 Find People
        </button>

      `

      : `

        <div class="flow-icon">🎓</div>

        <div class="flow-title">
          LEARN
        </div>

        <p class="status">
          Find someone who can teach you a skill.
        </p>

        <button
          class="primary big-action"
          onclick="connectVolunteer('learner')">
          🔎 Find People
        </button>

      `;

}


/* ================= FIND PEOPLE ================= */

function connectVolunteer(role) {

  const flow =
    document.getElementById("mainFlow");


  flow.innerHTML = `

    <div class="flow-icon">🔎</div>

    <div class="flow-title">
      Finding people...
    </div>

    <p class="status">
      Searching for a volunteer.
    </p>

  `;


  setTimeout(() => {

    if (role === "teacher") {

      flow.innerHTML = `

        <div class="flow-icon">❌</div>

        <div class="flow-title danger">
          Can't find learner volunteer
        </div>

        <p class="status">
          No learner volunteer is available right now.
        </p>

        <button
          class="secondary big-action"
          onclick="renderDashboard()">
          🔄 Try Again
        </button>

      `;

    } else {

      flow.innerHTML = `

        <div class="flow-icon">❌</div>

        <div class="flow-title danger">
          Can't find teacher volunteer
        </div>

        <p class="status">
          No teacher volunteer is available right now.
        </p>

        <button
          class="primary big-action"
          onclick="startAI()">
          🤖 Let AI Teach Me
        </button>

        <button
          class="secondary big-action"
          onclick="renderDashboard()">
          ↩️ Go Back
        </button>

      `;

    }

  }, 1000);

}


/* ================= AI ================= */

function startAI() {

  showScreen("aiScreen");

  newAITopic();

}


function newAITopic() {

  currentTopic =
    topics[
      Math.floor(
        Math.random() * topics.length
      )
    ];


  document.getElementById("aiTopic")
    .textContent =
    currentTopic.name;


  document.getElementById("aiLesson")
    .innerHTML = `

      <strong>🤖 TutorBot:</strong><br><br>

      ${currentTopic.lesson}

    `;


  document.getElementById("aiChat")
    .innerHTML = "";

}


/* ================= AI CHAT ================= */

function askAI() {

  const input =
    document.getElementById("aiQuestion");

  const q =
    input.value.trim();

  if (!q) return;


  const chat =
    document.getElementById("aiChat");


  chat.innerHTML += `

    <div class="bubble user-bubble">
      🎓 ${escapeHtml(q)}
    </div>

  `;


  const answer =
    getAIAnswer(q);


  chat.innerHTML += `

    <div class="bubble ai-bubble">
      🤖 <strong>TutorBot:</strong><br>
      ${answer}
    </div>

  `;


  input.value = "";

}


/* ================= AI ANSWERS ================= */

function getAIAnswer(q) {

  const s =
    q.toLowerCase();


  if (!currentTopic) {
    return "Choose a topic first!";
  }


  if (
    currentTopic.name === "Photosynthesis"
  ) {

    return `
      Plants use sunlight to make food from
      carbon dioxide and water. Oxygen is
      released during the process.
    `;

  }


  if (
    currentTopic.name === "Fractions"
  ) {

    return `
      The numerator is the top number.
      The denominator is the bottom number.
    `;

  }


  if (
    currentTopic.name === "Gravity"
  ) {

    return `
      Gravity is an attractive force between
      objects with mass. Earth's gravity pulls
      objects toward the ground.
    `;

  }


  if (
    currentTopic.name === "Programming"
  ) {

    return `
      Programming is writing instructions for
      a computer. Different programming
      languages let us create apps, games,
      websites and more.
    `;

  }


  if (
    currentTopic.name === "The Human Brain"
  ) {

    return `
      The brain helps control thinking,
      memory, movement, learning and many
      other body functions.
    `;

  }


  return `
    That's a great question about
    <strong>${escapeHtml(currentTopic.name)}</strong>!<br><br>

    The main idea is:
    ${escapeHtml(currentTopic.lesson)}
  `;

}


/* ================= QUIZ ================= */

function showQuiz() {

  if (!currentTopic) {
    newAITopic();
  }


  document.getElementById("quizQuestion")
    .textContent =
    currentTopic.q;


  document.getElementById("quizAnswer")
    .value = "";


  document.getElementById("quizResult")
    .textContent = "";


  showScreen("quizScreen");

}


function checkQuiz() {

  const answer =
    document
      .getElementById("quizAnswer")
      .value
      .trim()
      .toLowerCase();


  const correct =
    currentTopic.a.some(
      item =>
        answer === item ||
        answer.includes(item)
    );


  const result =
    document.getElementById("quizResult");


  if (correct) {

    state.coins += 5;

    state.sessions++;

    save();

    result.innerHTML = `

      <span class="success">
        🎉 Correct! +5 💰 coins!
        <br>
        Sessions: ${state.sessions}
      </span>

    `;

  } else {

    result.innerHTML = `

      <span class="danger">
        ❌ Not quite!
        <br>
        Try again. Hint: ${currentTopic.name}
      </span>

    `;

  }

}


/* ================= PEOPLE ================= */

const people = [

  ["👨‍💻", "Arun", "Python • JavaScript • Coding", "Beginner"],
  ["👩‍🔬", "Maya", "Biology • Chemistry • Science", "Intermediate"],
  ["👨‍🎓", "Kavin", "Mathematics • Algebra • Geometry", "Advanced"],
  ["👩‍🎨", "Diya", "Drawing • Design • Art", "Intermediate"],
  ["👨‍🚀", "Rohan", "Astronomy • Physics • Space", "Advanced"],
  ["👩‍🏫", "Anu", "English • Grammar • Writing", "Advanced"],
  ["👨‍💼", "Vijay", "Business • Marketing • Finance", "Intermediate"],
  ["👩‍💻", "Sara", "Web Design • HTML • CSS", "Beginner"],
  ["👨‍🔧", "Arjun", "Robotics • Electronics • STEM", "Advanced"],
  ["🎹", "Nila", "Music • Piano • Theory", "Intermediate"],
  ["🌍", "Kevin", "Geography • History • Culture", "Advanced"],
  ["📸", "Meera", "Photography • Editing • Media", "Intermediate"]

];


function renderPeople(c) {

  c.innerHTML = `

    <div class="card">

      <div class="people-title">

        <h1>👥 SkillMatch</h1>

        <p>
          Find people who teach and learn
          different skills.
        </p>

      </div>

      <button
        class="primary find-button"
        onclick="alert('Searching for the best people for you! 🔎')">
        🔎 Find People
      </button>

      ${people.map(person => `

        <div class="person">

          <span class="avatar">
            ${person[0]}
          </span>

          <div class="person-info">

            <b>${person[1]}</b>

            <div class="subject">
              ${person[2]}
            </div>

            <div class="subject">
              ${person[3]}
            </div>

          </div>

          <button
            onclick="alert('Request sent to ${person[1]}!')">
            Connect
          </button>

        </div>

      `).join("")}

    </div>

  `;

}


/* ================= PAGES ================= */

function openPage(page) {

  const content =
    document.getElementById("pageContent");


  if (page === "people") {

    renderPeople(content);

  }


  if (page === "chat") {

    content.innerHTML = `

      <div class="card">

        <h1>💬 ConnectZone</h1>

        <p>
          Your learning conversations appear here.
        </p>

        <div class="bubble ai-bubble">
          💬 Connect with someone from SkillMatch
          to start learning together.
        </div>

      </div>

    `;

  }


  if (page === "shop") {

    renderShop(content);

  }


  if (page === "badges") {

    renderBadges(content);

  }


  if (page === "map") {

    renderMap(content);

  }


  showScreen("pageScreen");

}


/* ================= SHOP ================= */

const shop = [

  ["🔥", "Fire Aura", 73],
  ["🌌", "Void Aura", 146],
  ["🌪️", "Wind Aura", 58],
  ["⚡", "Lightning Aura", 219],
  ["❄️", "Ice Aura", 91],
  ["✨", "Galaxy Frame", 175],
  ["🌿", "Nature Frame", 64],
  ["😎", "Emoji Pack", 45]

];


function renderShop(c) {

  c.innerHTML = `

    <div class="card">

      <h1>🛍️ CoinCraft</h1>

      <p>
        Buy items using your TeachCoins.
      </p>

      <div class="shop-grid">

        ${shop.map((item, i) => `

          <div class="shop-item">

            <div class="emoji">
              ${item[0]}
            </div>

            <b>${item[1]}</b>

            <div class="price">
              💰 ${item[2]}
            </div>

            <button onclick="buyItem(${i})">

              ${
                state.owned.includes(i)
                  ? "Owned ✓"
                  : "Buy"
              }

            </button>

          </div>

        `).join("")}

      </div>

    </div>

  `;

}


function buyItem(i) {

  const item =
    shop[i];


  if (state.owned.includes(i)) {

    alert("You already own this item!");

    return;

  }


  if (state.coins < item[2]) {

    alert("Not enough TeachCoins!");

    return;

  }


  state.coins -= item[2];

  state.owned.push(i);

  save();

  renderShop(
    document.getElementById("pageContent")
  );

}


/* ================= BADGES ================= */

function renderBadges(c) {

  const levels = [

    [1, "🌱 Starter"],
    [10, "⭐ Rising Star"],
    [50, "🥉 Bronze"],
    [100, "🥈 Silver"],
    [250, "🥇 Gold"],
    [500, "💎 Diamond"],
    [1000, "👑 Master"],
    [2500, "🔥 Legend"],
    [5000, "⚡ Elite"],
    [10000, "🏆 Teachly Titan"]

  ];


  c.innerHTML = `

    <div class="card">

      <h1>🏆 Achievement Vault</h1>

      <p>
        Completed sessions:
        <b>${state.sessions}</b>
      </p>

      ${levels.map(level => `

        <div class="badge">

          <span>${level[1]}</span>

          <b>
            ${
              state.sessions >= level[0]
                ? "✅"
                : level[0] + " sessions"
            }
          </b>

        </div>

      `).join("")}

    </div>

  `;

}


/* ================= MAP ================= */

function renderMap(c) {

  c.innerHTML = `

    <div class="card">

      <h1>🌍 LearnSphere</h1>

      <p>
        Explore the world and discover something new.
      </p>

      <div class="map">

        <div class="land na"></div>
        <div class="land sa"></div>
        <div class="land eu"></div>
        <div class="land af"></div>
        <div class="land as"></div>
        <div class="land au"></div>

        <button
          class="m-na"
          onclick="placeInfo('North America')">
          North America
        </button>

        <button
          class="m-sa"
          onclick="placeInfo('South America')">
          South America
        </button>

        <button
          class="m-eu"
          onclick="placeInfo('Europe')">
          Europe
        </button>

        <button
          class="m-af"
          onclick="placeInfo('Africa')">
          Africa
        </button>

        <button
          class="m-as"
          onclick="placeInfo('Asia')">
          Asia
        </button>

        <button
          class="m-au"
          onclick="placeInfo('Australia')">
          Australia
        </button>

        <button
          class="m-sea"
          onclick="placeInfo('Ocean')">
          🌊 Ocean
        </button>

      </div>

      <div
        id="placeInfo"
        class="card">

        <h2>📍 Choose a place</h2>

        <p>
          Tap a region to learn something interesting.
        </p>

      </div>

    </div>

  `;

}


/* ================= MAP INFO ================= */

function placeInfo(place) {

  const data = {

    "North America":
      ["North America",
       "A continent containing countries such as Canada, the United States and Mexico.",
       "🏞️ Grand Canyon"],

    "South America":
      ["South America",
       "Known for the Amazon rainforest and Andes Mountains.",
       "🌳 Amazon Rainforest"],

    "Europe":
      ["Europe",
       "A continent known for its many countries, languages, history and cultures.",
       "🏛️ Historic cities"],

    "Africa":
      ["Africa",
       "A continent with deserts, rainforests, savannas and incredible biodiversity.",
       "🦁 African savanna"],

    "Asia":
      ["Asia",
       "The largest continent, containing many countries, cultures and landscapes.",
       "🏔️ Mount Everest"],

    "Australia":
      ["Australia",
       "A country and continent famous for unique wildlife and the Great Barrier Reef.",
       "🐠 Great Barrier Reef"],

    "Ocean":
      ["Ocean",
       "Oceans cover most of Earth's surface and support huge amounts of life.",
       "🐋 Marine life"]

  };


  const d =
    data[place];


  document.getElementById("placeInfo")
    .innerHTML = `

      <h2>📍 ${d[0]}</h2>

      <p>${d[1]}</p>

      <h3>⭐ Special Thing</h3>

      <p>${d[2]}</p>

    `;

}


/* ================= CHANGE ROLE ================= */

function resetRole() {

  state.role = "";

  save();

  showScreen("roleScreen");

}


/* ================= SECURITY ================= */

function escapeHtml(text) {

  return text.replace(
    /[&<>"']/g,

    character => ({

      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"

    }[character])

  );

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    document.getElementById("coins")
      .textContent = state.coins;

    showScreen("nameScreen");

  }
);
