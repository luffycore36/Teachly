const topics = [

{
name: "The Water Cycle",

lesson:
  "Water moves around Earth in a continuous cycle. " +
  "Heat from the Sun causes evaporation, water vapor cools " +
  "and condenses into clouds, and precipitation returns water " +
  "to Earth. Collection in rivers, lakes and oceans starts " +
  "the cycle again.",

q: "What process changes liquid water into water vapor?",

a: ["evaporation"]

},

{
name: "Photosynthesis",

lesson:
  "Plants make food using light energy. In photosynthesis, " +
  "plants use carbon dioxide and water to produce glucose " +
  "and oxygen. Chlorophyll in leaves helps capture light.",

q: "What gas do plants take in for photosynthesis?",

a: ["carbon dioxide", "co2"]

},

{
name: "Fractions",

lesson:
  "A fraction represents part of a whole. The top number " +
  "is the numerator and the bottom number is the denominator. " +
  "For example, 3/4 means three of four equal parts.",

q: "In 3/4, what is the denominator?",

a: ["4", "four"]

},

{
name: "Gravity",

lesson:
  "Gravity is an attractive force between objects with mass. " +
  "Earth's gravity pulls objects toward its center, which " +
  "is why dropped objects fall.",

q: "What force pulls objects toward Earth?",

a: ["gravity"]

},

{
name: "The Solar System",

lesson:
  "Our Solar System contains the Sun and objects that orbit it, " +
  "including planets, moons, asteroids and comets. The Sun is " +
  "a star at the center of the system.",

q: "What is at the center of our Solar System?",

a: ["sun", "the sun"]

},

{
name: "Computer Algorithms",

lesson:
  "An algorithm is a clear sequence of steps for solving a " +
  "problem or completing a task. Recipes and computer programs " +
  "can both be thought of as algorithms.",

q: "What do we call a step-by-step procedure for solving a problem?",

a: ["algorithm", "an algorithm"]

}

];

let state;

try {

state =
JSON.parse(
localStorage.getItem("teachlyV3") || "null"
) || {
name: "",
email: "",
role: "",
coins: 100,
sessions: 0,
owned: []
};

state.name = state.name || "";
state.email = state.email || "";
state.role = state.role || "";

if (typeof state.coins !== "number") {
state.coins = 100;
}

if (typeof state.sessions !== "number") {
state.sessions = 0;
}

if (!Array.isArray(state.owned)) {
state.owned = [];
}

} catch (error) {

state = {
name: "",
email: "",
role: "",
coins: 100,
sessions: 0,
owned: []
};

localStorage.removeItem("teachlyV3");

}

let currentTopic = null;

/* SAVE */

function save() {

localStorage.setItem(
"teachlyV3",
JSON.stringify(state)
);

const coinElement =
document.getElementById("coins");

if (coinElement) {
coinElement.textContent = state.coins;
}

}

/* SCREEN */

function showScreen(id) {

document
.querySelectorAll(".screen")
.forEach(x =>
x.classList.remove("active")
);

const screen =
document.getElementById(id);

if (screen) {
screen.classList.add("active");
}

window.scrollTo(0, 0);

}

/* ROLE */

function chooseRole(role) {

state.role = role;

save();

showScreen("dashboardScreen");

renderDashboard();

setTimeout(() => {

connectVolunteer(role);

}, 350);

}

/* DASHBOARD */

function renderDashboard() {

const hello =
document.getElementById("hello");

const roleText =
document.getElementById("roleText");

const mainFlow =
document.getElementById("mainFlow");

if (!hello || !roleText || !mainFlow) {
return;
}

hello.textContent =
"Welcome to Teachly! 👋";

roleText.textContent =
state.role === "teacher"
? "You chose Teacher 👨‍🏫"
: "You chose Learner 🎓";

mainFlow.innerHTML =

state.role === "teacher"

  ?

  `
  <div class="flow-icon">👨‍🏫</div>

  <div class="flow-title">
    Teacher Mode
  </div>

  <p class="status">
    We will connect you with a real learner volunteer.
  </p>

  <button
    class="primary big-action"
    onclick="connectVolunteer('teacher')"
  >
    🔎 Find Learner Volunteer
  </button>
  `

  :

  `
  <div class="flow-icon">🎓</div>

  <div class="flow-title">
    Learner Mode
  </div>

  <p class="status">
    We will connect you with a real teacher volunteer first.
  </p>

  <button
    class="primary big-action"
    onclick="connectVolunteer('learner')"
  >
    🔎 Find Teacher Volunteer
  </button>
  `;

}

/* VOLUNTEER SEARCH */

function connectVolunteer(role) {

const box =
document.getElementById("mainFlow");

if (!box) return;

box.innerHTML =

`
<div class="flow-icon">🔎</div>

<div class="flow-title">
  Finding ${role === "teacher"
    ? "a learner"
    : "a teacher"}...
</div>

<p class="status">
  Looking for a volunteer.
</p>
`;

setTimeout(() => {

if (role === "teacher") {

  box.innerHTML =

    `
    <div class="flow-icon">❌</div>

    <div class="flow-title danger">
      Can't find learner volunteer
    </div>

    <p class="status">
      There is no learner volunteer available right now.
    </p>

    <button
      class="secondary big-action"
      onclick="renderDashboard()"
    >
      Try Again 🔄
    </button>
    `;

}

else {

  box.innerHTML =

    `
    <div class="flow-icon">❌</div>

    <div class="flow-title danger">
      Can't find teacher volunteer
    </div>

    <p class="status">
      There is no teacher volunteer available right now.
    </p>

    <button
      class="primary big-action"
      onclick="startAI()"
    >
      🤖 Yes, let AI teach me
    </button>

    <button
      class="secondary big-action"
      onclick="renderDashboard()"
    >
      No, go back ↩️
    </button>
    `;

}

}, 900);

}

/* AI */

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

const topic =
document.getElementById("aiTopic");

const lesson =
document.getElementById("aiLesson");

const chat =
document.getElementById("aiChat");

const question =
document.getElementById("aiQuestion");

if (topic) {
topic.textContent =
currentTopic.name;
}

if (lesson) {

lesson.innerHTML =
  `
  <strong>🤖 AI Teacher:</strong><br>
  ${currentTopic.lesson}
  `;

}

if (chat) {
chat.innerHTML = "";
}

if (question) {
question.value = "";
}

}

/* AI CHAT */

function askAI() {

if (!currentTopic) {
newAITopic();
}

const input =
document.getElementById("aiQuestion");

if (!input) return;

const q =
input.value.trim();

if (!q) return;

const chat =
document.getElementById("aiChat");

if (!chat) return;

chat.innerHTML +=

`
<div class="bubble user-bubble">
  🎓 ${escapeHtml(q)}
</div>
`;

const answer =
getAIAnswer(q);

chat.innerHTML +=

`
<div class="bubble ai-bubble">
  🤖 <strong>AI Teacher:</strong>
  ${answer}
</div>
`;

input.value = "";

}

/* AI ANSWERS */

function getAIAnswer(q) {

const s =
q.toLowerCase();

if (!currentTopic) {
return "Please choose a topic first!";
}

if (
currentTopic.name === "Photosynthesis" &&
(s.includes("why") ||
s.includes("how"))
) {

return `
  Plants use light energy to help turn
  water and carbon dioxide into food.
  Oxygen is released as a by-product.
`;

}

if (
currentTopic.name === "Fractions" &&
s.includes("numerator")
) {

return `
  The numerator is the top number.
  It tells how many equal parts are
  being considered.
`;

}

if (
currentTopic.name === "Gravity"
) {

return `
  Gravity is the force that attracts
  masses toward each other. Earth's
  gravity gives objects weight and
  pulls them toward Earth.
`;

}

if (
currentTopic.name === "The Water Cycle"
) {

return `
  Evaporation is when liquid water
  gains energy and becomes water vapor.
  Condensation is when vapor cools into
  tiny liquid droplets.
`;

}

if (
currentTopic.name === "The Solar System"
) {

return `
  The Sun is the star at the center
  of our Solar System, and its gravity
  helps keep planets in orbit.
`;

}

if (
currentTopic.name === "Computer Algorithms"
) {

return `
  An algorithm is a sequence of steps.
  A good algorithm has clear instructions
  and a defined goal.
`;

}

return "Great question! Based on today's topic, think about the main idea: <strong>${escapeHtml(currentTopic.name)}</strong>. I can explain the lesson in simpler words if you ask!";

}

/* QUIZ */

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

/* CHECK QUIZ */

function checkQuiz() {

if (!currentTopic) return;

const a =
document
.getElementById("quizAnswer")
.value
.trim()
.toLowerCase();

const correct =
currentTopic.a.some(
x =>
a === x ||
a.includes(x)
);

const out =
document.getElementById("quizResult");

if (correct) {

state.coins += 5;

state.sessions++;

save();


out.innerHTML =

  `
  <span class="success">
    🎉 Correct! +5 💰 coins.
    Sessions: ${state.sessions}
  </span>
  `;

}

else {

out.innerHTML =

  `
  <span class="danger">
    Not quite. 💡 Try again!
    Hint: ${currentTopic.name}.
  </span>
  `;

}

}

/* PAGES */

function openPage(page) {

const c =
document.getElementById("pageContent");

if (!c) return;

if (page === "people") {

c.innerHTML =

  `
  <div class="card">

    <h1>👥 People</h1>

    <p>
      Volunteer matching demo:
    </p>


    <div class="person">

      <span class="avatar">
        👨‍💻
      </span>

      <div>
        <b>Arun</b>
        <br>
        Python • Beginner
      </div>

      <button onclick="alert('Volunteer request sent!')">
        Request
      </button>

    </div>


    <div class="person">

      <span class="avatar">
        👩‍🔬
      </span>

      <div>
        <b>Maya</b>
        <br>
        Science • Intermediate
      </div>

      <button onclick="alert('Volunteer request sent!')">
        Request
      </button>

    </div>


    <div class="person">

      <span class="avatar">
        👨‍🎓
      </span>

      <div>
        <b>Kavin</b>
        <br>
        Maths • Advanced
      </div>

      <button onclick="alert('Volunteer request sent!')">
        Request
      </button>

    </div>

  </div>
  `;

}

if (page === "chat") {

c.innerHTML =

  `
  <div class="card">

    <h1>💬 Chat</h1>

    <p>
      Common quick emojis:
    </p>

    <button
      class="secondary"
      onclick="alert('👍')">
      👍
    </button>

    <button
      class="secondary"
      onclick="alert('❤️')">
      ❤️
    </button>

    <button
      class="secondary"
      onclick="alert('😂')">
      😂
    </button>

    <div class="bubble ai-bubble">

      💬 Chat becomes a real
      cross-device chat when an
      online backend is connected.

    </div>

  </div>
  `;

}

if (page === "shop") {

renderShop(c);

}

if (page === "badges") {

renderBadges(c);

}

if (page === "map") {

renderMap(c);

}

showScreen("pageScreen");

}

/* SHOP */

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

c.innerHTML =

`
<div class="card">

  <h1>🛍️ Teachly Shop</h1>

  <p>
    Buy items using your 💰 coins.
  </p>

  <div class="shop-grid">

    ${shop.map((x, i) =>

      `
      <div class="shop-item">

        <div class="emoji">
          ${x[0]}
        </div>

        <b>
          ${x[1]}
        </b>

        <div class="price">
          💰 ${x[2]}
        </div>

        <button
          onclick="buyItem(${i})">

          ${
            state.owned.includes(i)
              ? "Owned ✓"
              : "Buy"
          }

        </button>

      </div>
      `

    ).join("")}

  </div>

</div>
`;

}

/* BUY */

function buyItem(i) {

const [
emoji,
name,
price
] = shop[i];

if (
state.owned.includes(i)
) {

alert(
  "You already own this item!"
);

return;

}

if (
state.coins < price
) {

alert(
  "You don't have enough coins to buy this! 💰"
);

return;

}

state.coins -= price;

state.owned.push(i);

save();

renderShop(
document.getElementById("pageContent")
);

alert(
"${name} purchased! ${emoji}"
);

}

/* BADGES */

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

c.innerHTML =

`
<div class="card">

  <h1>🏆 Badges</h1>

  <p>
    Completed sessions:
    <b>${state.sessions}</b>
  </p>

  ${
    levels.map(x =>

      `
      <div class="badge">

        <span>
          ${x[1]}
        </span>

        <b>
          ${
            state.sessions >= x[0]
              ? "✅"
              : x[0] + " sessions"
          }
        </b>

      </div>
      `

    ).join("")
  }

</div>
`;

}

/* WORLD MAP */

function renderMap(c) {

c.innerHTML =

`
<div class="card">

  <h1>
    🌍 Teachly World Explorer
  </h1>

  <p>
    Tap a region to learn about it.
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

    <h2>
      📍 Select a place
    </h2>

    <p>
      Tap a region on the map to
      see information and a
      special thing.
    </p>

  </div>

</div>
`;

}

/* PLACE INFO */

function placeInfo(place) {

const data = {

"North America": [
  "North America",
  "A large continent containing countries such as Canada, the United States and Mexico.",
  "🏞️ Grand Canyon"
],

"South America": [
  "South America",
  "A continent famous for the Amazon rainforest, Andes Mountains and many diverse cultures.",
  "🌳 Amazon Rainforest"
],

"Europe": [
  "Europe",
  "A continent with many countries and a long history of languages, art, science and architecture.",
  "🏛️ Historic cities"
],

"Africa": [
  "Africa",
  "A huge continent with diverse landscapes, wildlife and cultures, including deserts, savannas and rainforests.",
  "🦁 African savanna"
],

"Asia": [
  "Asia",
  "The world's largest continent, with many countries, languages, landscapes and ancient civilizations.",
  "🏔️ Mount Everest"
],

"Australia": [
  "Australia",
  "A country and continent known for unique wildlife, beaches, deserts and the Great Barrier Reef.",
  "🐠 Great Barrier Reef"
],

"Ocean": [
  "Ocean",
  "Oceans cover most of Earth's surface and support an enormous variety of life.",
  "🐋 Marine life"
]

};

const d = data[place];

if (!d) return;

document.getElementById("placeInfo")
.innerHTML =

`
<h2>
  📍 ${d[0]}
</h2>

<p>
  ${d[1]}
</p>

<h3>
  ⭐ Special thing
</h3>

<p>
  ${d[2]}
</p>
`;

}

/* CHANGE ROLE */

function resetRole() {

state.role = "";

save();

showScreen("roleScreen");

}

/* SECURITY */

function escapeHtml(s) {

return s.replace(
/[&<>"']/g,

m => ({

  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"

}[m])

);

}

/* START */

document.addEventListener(
"DOMContentLoaded",
function () {

const coins =
  document.getElementById("coins");

if (coins) {
  coins.textContent = state.coins;
}


/*
  Login/account has been removed.
  Teachly always starts at the role screen.
*/

showScreen("roleScreen");

}
);
