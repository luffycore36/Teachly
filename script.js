const API_URL = "https://teachly-nmxh.onrender.com";

let currentUser = null;
let currentRole = "learner";
let currentLesson = null;
let currentQuiz = null;
let currentChatUser = null;
let socket = null;
let map = null;

const lessons = [
  {
    id: 1,
    title: "Fractions",
    category: "Mathematics",
    icon: "➗",
    description: "Understand fractions and their parts.",
    content: `
      <h3>What is a fraction?</h3>
      <p>
        A fraction represents a part of a whole.
      </p>

      <p>
        For example, <strong>1/2</strong> means one
        part out of two equal parts.
      </p>

      <h3>Parts of a fraction</h3>

      <p>
        The top number is called the
        <strong>numerator</strong>.
      </p>

      <p>
        The bottom number is called the
        <strong>denominator</strong>.
      </p>
    `,
    quiz: {
      question: "What is the numerator in 3/5?",
      options: ["3", "5", "8", "2"],
      answer: "3"
    }
  },

  {
    id: 2,
    title: "Algebra Basics",
    category: "Mathematics",
    icon: "📐",
    description: "Learn variables and simple equations.",
    content: `
      <h3>What is algebra?</h3>

      <p>
        Algebra uses letters to represent unknown values.
      </p>

      <p>
        Example:
      </p>

      <p>
        <strong>x + 5 = 10</strong>
      </p>

      <p>
        Subtract 5 from both sides:
      </p>

      <p>
        <strong>x = 5</strong>
      </p>
    `,
    quiz: {
      question: "If x + 3 = 8, what is x?",
      options: ["3", "5", "8", "11"],
      answer: "5"
    }
  },

  {
    id: 3,
    title: "Solar System",
    category: "Science",
    icon: "🪐",
    description: "Explore the planets around our Sun.",
    content: `
      <h3>The Solar System</h3>

      <p>
        Our Solar System contains the Sun and objects
        that orbit it.
      </p>

      <p>
        There are eight recognized planets:
      </p>

      <ul>
        <li>Mercury</li>
        <li>Venus</li>
        <li>Earth</li>
        <li>Mars</li>
        <li>Jupiter</li>
        <li>Saturn</li>
        <li>Uranus</li>
        <li>Neptune</li>
      </ul>
    `,
    quiz: {
      question: "How many planets are in our Solar System?",
      options: ["7", "8", "9", "10"],
      answer: "8"
    }
  },

  {
    id: 4,
    title: "Photosynthesis",
    category: "Science",
    icon: "🌱",
    description: "Learn how plants make food.",
    content: `
      <h3>Photosynthesis</h3>

      <p>
        Photosynthesis is how plants make food
        using light energy.
      </p>

      <p>Plants use:</p>

      <ul>
        <li>Sunlight</li>
        <li>Water</li>
        <li>Carbon dioxide</li>
      </ul>

      <p>
        Oxygen is released during the process.
      </p>
    `,
    quiz: {
      question: "What gas do plants take in?",
      options: [
        "Oxygen",
        "Carbon dioxide",
        "Hydrogen",
        "Helium"
      ],
      answer: "Carbon dioxide"
    }
  },

  {
    id: 5,
    title: "Grammar Basics",
    category: "English",
    icon: "✍️",
    description: "Learn some important grammar basics.",
    content: `
      <h3>Grammar</h3>

      <p>
        Grammar describes the rules used to form sentences.
      </p>

      <h3>Nouns</h3>

      <p>
        A noun names a person, place, thing or idea.
      </p>

      <h3>Verbs</h3>

      <p>
        A verb describes an action or state.
      </p>
    `,
    quiz: {
      question: "Which word is a verb in 'Birds fly'?",
      options: ["Birds", "fly", "the", "none"],
      answer: "fly"
    }
  },

  {
    id: 6,
    title: "Ancient Egypt",
    category: "History",
    icon: "🏺",
    description: "Discover Ancient Egyptian civilization.",
    content: `
      <h3>Ancient Egypt</h3>

      <p>
        Ancient Egypt developed around the Nile River.
      </p>

      <p>
        The Nile provided water, transportation
        and fertile farmland.
      </p>

      <p>
        Ancient Egypt is famous for pyramids,
        temples, pharaohs and hieroglyphics.
      </p>
    `,
    quiz: {
      question:
        "Which river was central to Ancient Egypt?",
      options: [
        "Nile",
        "Amazon",
        "Ganges",
        "Danube"
      ],
      answer: "Nile"
    }
  }
];


const mysteryTopics = [
  [
    "Why is the sky blue?",
    "Light scatters through Earth's atmosphere."
  ],

  [
    "How do airplanes fly?",
    "Wings generate lift as air moves around them."
  ],

  [
    "Why do we have seasons?",
    "Earth's tilt changes how sunlight reaches different regions."
  ],

  [
    "How do volcanoes form?",
    "Volcanic activity is connected to Earth's internal heat and moving tectonic plates."
  ],

  [
    "What is a black hole?",
    "A black hole is an extremely dense region of space whose gravity is strong enough to trap light."
  ],

  [
    "How do bees communicate?",
    "Honeybees use movement, including their famous waggle dance, to communicate information about food."
  ]
];

const badges = [
  {
    id: "first",
    icon: "🌱",
    title: "First Step",
    description: "Complete your first lesson.",
    requirement: 1
  },

  {
    id: "five",
    icon: "📚",
    title: "Bookworm",
    description: "Complete five lessons.",
    requirement: 5
  },

  {
    id: "ten",
    icon: "🧠",
    title: "Knowledge Builder",
    description: "Complete ten lessons.",
    requirement: 10
  },

  {
    id: "quiz",
    icon: "🏆",
    title: "Quiz Starter",
    description: "Complete your first quiz.",
    requirement: "quiz"
  },

  {
    id: "quiz-five",
    icon: "🎯",
    title: "Quiz Master",
    description: "Complete five quizzes.",
    requirement: "quiz5"
  },

  {
    id: "session",
    icon: "🤝",
    title: "First Connection",
    description: "Connect with another Teachly user.",
    requirement: "session"
  },

  {
    id: "teacher",
    icon: "🧑‍🏫",
    title: "Helpful Teacher",
    description: "Connect with a learner.",
    requirement: "teacher"
  },

  {
    id: "collector",
    icon: "🛍️",
    title: "Collector",
    description: "Purchase your first shop item.",
    requirement: "shop"
  }
];

const shopItems = [
  {
    id: "purple",
    icon: "🟣",
    name: "Purple Glow",
    description: "A cool purple profile style.",
    price: 50
  },

  {
    id: "star",
    icon: "⭐",
    name: "Star Badge",
    description: "Show a star beside your profile.",
    price: 75
  },

  {
    id: "rocket",
    icon: "🚀",
    name: "Rocket",
    description: "Give your profile a rocket icon.",
    price: 100
  },

  {
    id: "fire",
    icon: "🔥",
    name: "Fire Profile",
    description: "Show your learning streak with fire.",
    price: 150
  },

  {
    id: "crown",
    icon: "👑",
    name: "Learning Crown",
    description: "Show a crown on your profile.",
    price: 250
  },

  {
    id: "diamond",
    icon: "💎",
    name: "Diamond",
    description: "A premium-looking profile icon.",
    price: 500
  },

  {
    id: "galaxy",
    icon: "🌌",
    name: "Galaxy",
    description: "Give your profile a cosmic style.",
    price: 750
  },

  {
    id: "trophy",
    icon: "🏆",
    name: "Champion Trophy",
    description: "Show that you're a serious learner.",
    price: 1000
  },

  {
    id: "legend",
    icon: "⚡",
    name: "Legend Effect",
    description: "A special legendary profile effect.",
    price: 2500
  }
];

const continents = {
  Asia: {
    emoji: "🌏",
    title: "Asia",
    description:
      "Asia is the largest continent by area and population.",
    facts: [
      "Largest continent",
      "Contains many different climates",
      "Home to the Himalayas",
      "Contains many languages and cultures"
    ]
  },

  Africa: {
    emoji: "🌍",
    title: "Africa",
    description:
      "Africa is known for its diverse ecosystems, cultures and wildlife.",
    facts: [
      "Second-largest continent",
      "Home to the Sahara",
      "Contains many unique ecosystems",
      "Rich cultural diversity"
    ]
  },

  Europe: {
    emoji: "🌍",
    title: "Europe",
    description:
      "Europe contains many countries with long and varied histories.",
    facts: [
      "Many countries in a relatively small area",
      "Rich historical heritage",
      "Contains the Alps",
      "Many major rivers"
    ]
  },

  "North America": {
    emoji: "🌎",
    title: "North America",
    description:
      "North America includes diverse environments from Arctic regions to tropical areas.",
    facts: [
      "Includes Canada, the United States and Mexico",
      "Contains the Rocky Mountains",
      "Large range of climates",
      "Contains many major lakes"
    ]
  },

  "South America": {
    emoji: "🌎",
    title: "South America",
    description:
      "South America is famous for the Amazon rainforest and Andes Mountains.",
    facts: [
      "Home to the Amazon",
      "Contains the Andes",
      "Large biodiversity",
      "Many unique ecosystems"
    ]
  },

  "Australia/Oceania": {
    emoji: "🌏",
    title: "Australia/Oceania",
    description:
      "This region contains Australia and many Pacific island nations.",
    facts: [
      "Includes Australia",
      "Contains many Pacific islands",
      "Unique wildlife",
      "Large coral reef ecosystems"
    ]
  },

  Antarctica: {
    emoji: "❄️",
    title: "Antarctica",
    description:
      "Antarctica is Earth's coldest continent and is covered largely by ice.",
    facts: [
      "Coldest continent",
      "Contains enormous ice sheets",
      "No permanent native population",
      "Important for climate research"
    ]
  }
};


/* =====================================================
   STARTUP
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  loadUser();

  const input =
    document.getElementById("usernameInput");

  if (input) {
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        continueFromName();
      }
    });
  }

  renderLessons();

});


function loadUser() {

  try {

    const saved =
      localStorage.getItem("teachlyUser");

    if (!saved) {
      return;
    }

    currentUser = JSON.parse(saved);

currentUser.coins = Number(currentUser.coins ?? 10000);
currentUser.completedLessons = currentUser.completedLessons || [];
currentUser.quizCompleted = currentUser.quizCompleted || [];
currentUser.savedLessons = currentUser.savedLessons || [];
currentUser.purchasedItems = currentUser.purchasedItems || [];
currentUser.equippedItem = currentUser.equippedItem || null;

saveUser();
    
    if (currentUser) {

      currentRole =
        currentUser.role || "learner";

      updateHome();

    }

  } catch (error) {

    console.error(error);

  }

}


/* =====================================================
   INTRO FLOW
===================================================== */

function continueToName() {

  openPage("namePage");

  setTimeout(() => {

    const input =
      document.getElementById("usernameInput");

    if (input) {
      input.focus();
    }

  }, 100);

}


function continueFromName() {

  const input =
    document.getElementById("usernameInput");

  if (!input) {
    return;
  }

  const username =
    input.value.trim();

  if (!username) {

    input.focus();

    return;

  }

  currentUser = {

    id:
      "local-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2),

    username,

    role: "learner",

    coins: 100000,

    lessonsCompleted: 0,

completedLessons: [],

sessions: 0,
   savedLessons: [],

quizCompleted: [],

purchasedItems: [],

equippedItem: null

  };

  saveUser();

  registerUser();

  updateHome();

  openPage("homePage");

}


window.continueToName = continueToName;
window.continueFromName = continueFromName;


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function openPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove("active");
    });

  const page =
    document.getElementById(pageId);

  if (!page) {
    return;
  }

  page.classList.add("active");

  if (pageId === "aiPage") {
    renderLessons();
  }

  if (pageId === "peoplePage") {
    loadPeople();
  }

  if (pageId === "badgesPage") {
    renderBadges();
  }

  if (pageId === "shopPage") {
    renderShop();
  }

  if (pageId === "profilePage") {
    updateProfile();
  }

  if (pageId === "mapPage") {
    initializeMap();
  }

}


function goHome() {
  openPage("homePage");
}


window.openPage = openPage;
window.goHome = goHome;


/* =====================================================
   USER
===================================================== */

function saveUser() {

  localStorage.setItem(
    "teachlyUser",
    JSON.stringify(currentUser)
  );

}


function updateHome() {

  if (!currentUser) {
    return;
  }

  const name =
    currentUser.username || "Learner";

  document
    .getElementById("welcomeText")
    ?.replaceChildren(
      document.createTextNode(
        `Welcome, ${name}!`
      )
    );

  const username =
    document.getElementById("homeUsername");

  const coins =
    document.getElementById("coinCount");

  const sessions =
    document.getElementById("sessionCount");

  if (username) {
    username.textContent = name;
  }

  if (coins) {
    coins.textContent =
      Number(currentUser.coins || 0);
  }

  const quizzes =
  (currentUser?.quizCompleted || []).length;

const purchases =
  (currentUser?.purchasedItems || []).length;

  if (sessions) {
    sessions.textContent =
      Number(currentUser.sessions || 0);
  }

  updateProgress();

}


function updateProgress() {

  if (!currentUser) {
    return;
  }

  const completed =
    Number(currentUser.lessonsCompleted || 0);

  const percent =
    Math.min(
      100,
      Math.round(
        completed /
        lessons.length *
        100
      )
    );

  const bar =
    document.getElementById(
      "overallProgress"
    );

  const text =
    document.getElementById(
      "progressPercent"
    );

  if (bar) {
    bar.style.width =
      percent + "%";
  }

  if (text) {
    text.textContent =
      percent + "%";
  }

}


/* =====================================================
   SERVER REGISTRATION
===================================================== */

async function registerUser() {

  if (!currentUser) {
    return;
  }

  try {

    await fetch(
      `${API_URL}/api/users`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            id: currentUser.id,
            username:
              currentUser.username,
            role:
              currentUser.role
          })
      }
    );

  } catch (error) {

    console.warn(
      "Server registration unavailable.",
      error
    );

  }

}


/* =====================================================
   ROLES
===================================================== */

function chooseRole(role) {

  currentRole = role;

  if (currentUser) {

    currentUser.role =
      role;

    saveUser();

    registerUser();

  }

  findRealPerson(
    role === "learner"
      ? "teacher"
      : "learner"
  );

}


window.chooseRole = chooseRole;


/* =====================================================
   REAL PEOPLE
===================================================== */

async function findRealPerson(requiredRole) {

  openPage("searchPage");

  const title =
    document.getElementById(
      "searchTitle"
    );

  const text =
    document.getElementById(
      "searchText"
    );

  if (title) {
    title.textContent =
      "Finding someone...";
  }

  if (text) {
    text.textContent =
      "Looking for a real registered Teachly user.";
  }

  try {

    const response =
      await fetch(
        `${API_URL}/api/people`
      );

    if (!response.ok) {
      throw new Error(
        "People request failed"
      );
    }

    const people =
      await response.json();

    const matches =
      people.filter(person => {

        if (!currentUser) {
          return false;
        }

        if (person.id === currentUser.id) {
          return false;
        }

        return person.role === requiredRole;

      });

    if (!matches.length) {

      if (title) {
        title.textContent =
          "No one is available yet.";
      }

      if (text) {
        text.textContent =
          `There isn't a registered ${requiredRole} available right now.`;
      }

      return;

    }

    const person =
      matches[
        Math.floor(
          Math.random() *
          matches.length
        )
      ];

    connectToPerson(person);

  } catch (error) {

    console.error(error);

    if (title) {
      title.textContent =
        "Couldn't connect.";
    }

    if (text) {
      text.textContent =
        "The Teachly server is unavailable.";
    }

  }

}


function connectToPerson(person) {

  currentChatUser =
    person;

if (currentUser) {

  currentUser.sessions =
    Number(
      currentUser.sessions || 0
    ) + 1;

  saveUser();

  updateHome();
  renderBadges();
}

  
  openPage("chatPage");

  const title =
    document.getElementById(
      "chatTitle"
    );

  if (title) {
    title.textContent =
      `Chat with ${person.username}`;
  }

  connectSocket();

}


window.findRealPerson = findRealPerson;


/* =====================================================
   SOCKET CHAT
===================================================== */

function connectSocket() {

  if (
    typeof io === "undefined"
  ) {
    return;
  }

  if (socket) {
    socket.disconnect();
  }

  socket =
    io(API_URL, {
      transports: [
        "websocket",
        "polling"
      ]
    });

  socket.on("connect", () => {

    socket.emit(
      "join-user",
      {
        id:
          currentUser?.id
      }
    );

  });


  socket.on(
    "private-message",
    data => {

      addChatMessage(
        data.message,
        false
      );

    }
  );

}


function sendMessage() {

  const input =
    document.getElementById(
      "messageInput"
    );

  if (!input) {
    return;
  }

  const message =
    input.value.trim();

  if (!message) {
    return;
  }

  addChatMessage(
    message,
    true
  );

  if (
    socket &&
    currentChatUser
  ) {

    socket.emit(
      "private-message",
      {
        to:
          currentChatUser.id,

        message
      }
    );

  }

  input.value = "";

}


function addChatMessage(
  message,
  mine
) {

  const box =
    document.getElementById(
      "chatMessages"
    );

  if (!box) {
    return;
  }

  const div =
    document.createElement(
      "div"
    );

  div.className =
    mine
      ? "message me"
      : "message";

  div.textContent =
    message;

  box.appendChild(div);

  box.scrollTop =
    box.scrollHeight;

}


function addEmoji(emoji) {

  const input =
    document.getElementById(
      "messageInput"
    );

  if (!input) {
    return;
  }

  input.value += emoji;

  input.focus();

}


window.addEmoji = addEmoji;
window.sendMessage = sendMessage;


/* =====================================================
   PEOPLE PAGE
===================================================== */

async function loadPeople() {

  const list =
    document.getElementById(
      "peopleList"
    );

  if (!list) {
    return;
  }

  list.innerHTML =
    "<p>Loading real Teachly users...</p>";

  try {

    const response =
      await fetch(
        `${API_URL}/api/people`
      );

    if (!response.ok) {
      throw new Error(
        "People request failed"
      );
    }

    const people =
      await response.json();

    if (!people.length) {

      list.innerHTML =
        `<div class="person">
          No registered Teachly users yet.
        </div>`;

      return;

    }

    list.innerHTML = "";

    people.forEach(person => {

      if (
        currentUser &&
        person.id === currentUser.id
      ) {
        return;
      }

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "person";

      item.innerHTML = `
        <div class="personInfo">
          <div class="personAvatar">
            ${person.profileImage
              ? `<img src="${escapeHtml(person.profileImage)}"
                   style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
              : "👤"}
          </div>

          <div>
            <strong>
              ${escapeHtml(person.username)}
            </strong>

            <div class="personRole">
              ${person.role === "teacher"
                ? "🧑‍🏫 Teacher"
                : "🎓 Learner"}
            </div>
          </div>
        </div>

        <button
          onclick="connectToPersonById('${escapeHtml(person.id)}')"
        >
          Connect
        </button>
      `;

      list.appendChild(item);

    });

  } catch (error) {

    console.error(error);

    list.innerHTML =
      `<div class="person">
        Couldn't load Teachly users.
      </div>`;

  }

}


async function connectToPersonById(id) {

  try {

    const response =
      await fetch(
        `${API_URL}/api/people`
      );

    const people =
      await response.json();

    const person =
      people.find(
        item => item.id === id
      );

    if (!person) {
      return;
    }

    connectToPerson(person);

  } catch (error) {

    console.error(error);

  }

}


window.connectToPersonById =
  connectToPersonById;


/* =====================================================
   LESSONS
===================================================== */

function renderLessons(category = "All") {

  const grid =
    document.getElementById(
      "lessonGrid"
    );

  const count =
    document.getElementById(
      "lessonCount"
    );

  if (!grid) {
    return;
  }

  const filtered =
    category === "All"
      ? lessons
      : lessons.filter(
          lesson =>
            lesson.category === category
        );

  if (count) {
    count.textContent =
      lessons.length;
  }

  grid.innerHTML = "";

  filtered.forEach(lesson => {

    const card =
      document.createElement(
        "div"
      );

    card.className =
      "lessonCard";

    card.innerHTML = `
      <div class="lessonIcon">
        ${lesson.icon}
      </div>

      <span class="lessonMiniTag">
        ${lesson.category}
      </span>

      <h3>
        ${lesson.title}
      </h3>

      <p>
        ${lesson.description}
      </p>

      <button
        onclick="openLesson(${lesson.id})"
      >
        Learn →
      </button>
    `;

    grid.appendChild(card);

  });

}


function filterLessons(category) {

  document
    .querySelectorAll(
      ".lessonCategoryButton"
    )
    .forEach(button => {

      button.classList.remove(
        "active"
      );

      if (
        button.textContent.trim() ===
        category
      ) {
        button.classList.add(
          "active"
        );
      }

    });

  renderLessons(category);

}


function openLesson(id) {

  currentLesson =
    lessons.find(
      lesson =>
        lesson.id === id
    );

  if (!currentLesson) {
    return;
  }

  document.getElementById(
    "selectedLessonHeader"
  ).textContent =
    currentLesson.title;

  document.getElementById(
    "selectedLessonCategory"
  ).textContent =
    currentLesson.category;

  document.getElementById(
    "selectedLessonTitle"
  ).textContent =
    currentLesson.title;

  document.getElementById(
    "selectedLessonDescription"
  ).textContent =
    currentLesson.description;

  document.getElementById(
    "selectedLessonContent"
  ).innerHTML =
    currentLesson.content;

  updateSaveButton();

  openPage(
    "selectedLessonPage"
  );

}


function completeLesson() {

  if (!currentLesson) {
    return;
  }

  if (!currentUser) {
    return;
  }

  const completedId =
    currentLesson.id;

  currentUser.completedLessons =
    currentUser.completedLessons || [];

  if (
    currentUser.completedLessons
      .includes(completedId)
  ) {

    alert(
      "You already completed this lesson."
    );

    return;

  }

  currentUser.completedLessons.push(
    completedId
  );

  currentUser.lessonsCompleted =
    currentUser.completedLessons.length;

  currentUser.coins =
    Number(currentUser.coins || 0) +
    20;

saveUser();
updateHome();
renderBadges();
updateProfile();
alert("Lesson completed! +20 💰 coins");
}


function toggleSavedLesson() {

  if (!currentLesson || !currentUser) {
    return;
  }

  currentUser.savedLessons =
    currentUser.savedLessons || [];

  const index =
    currentUser.savedLessons.indexOf(
      currentLesson.id
    );

  if (index >= 0) {

    currentUser.savedLessons.splice(
      index,
      1
    );

  } else {

    currentUser.savedLessons.push(
      currentLesson.id
    );

  }

  saveUser();

  updateSaveButton();

}


function updateSaveButton() {

  const button =
    document.getElementById(
      "saveLessonButton"
    );

  if (
    !button ||
    !currentLesson ||
    !currentUser
  ) {
    return;
  }

  const saved =
    (currentUser.savedLessons || [])
      .includes(
        currentLesson.id
      );

  button.textContent =
    saved
      ? "★ Saved"
      : "☆ Save Lesson";

}


window.filterLessons =
  filterLessons;

window.openLesson =
  openLesson;

window.completeLesson =
  completeLesson;

window.toggleSavedLesson =
  toggleSavedLesson;


/* =====================================================
   QUIZ
===================================================== */

function startQuiz() {

  if (!currentLesson) {
    return;
  }

  currentQuiz =
    currentLesson.quiz;

  document.getElementById(
    "quizLessonName"
  ).textContent =
    currentLesson.title;

  document.getElementById(
    "quizQuestion"
  ).textContent =
    currentQuiz.question;

  const options =
    document.getElementById(
      "quizOptions"
    );

  const result =
    document.getElementById(
      "quizResult"
    );

  options.innerHTML = "";

  result.textContent = "";

  currentQuiz.options.forEach(
    option => {

      const button =
        document.createElement(
          "button"
        );

      button.textContent =
        option;

      button.onclick = () =>
        answerQuiz(option);

      options.appendChild(
        button
      );

    }
  );

  openPage("quizPage");

}


function answerQuiz(answer) {

  if (!currentQuiz) {
    return;
  }

  const result =
    document.getElementById(
      "quizResult"
    );

  if (
    answer ===
    currentQuiz.answer
  ) {

    result.textContent =
      "🎉 Correct! Great job!";

    result.style.color =
      "#73e6a1";

  if (currentUser) {

  currentUser.quizCompleted =
    currentUser.quizCompleted || [];

  if (
    !currentUser.quizCompleted.includes(
      currentLesson.id
    )
  ) {

    currentUser.quizCompleted.push(
      currentLesson.id
    );

    currentUser.coins =
      Number(
        currentUser.coins || 0
      ) + 10;

    saveUser();

    updateHome();

    renderBadges();

    alert("Correct! +10 💰 coins");

  } else {

    saveUser();

    updateHome();

  }

}

  } else {

    result.textContent =
      "Not quite. Try again!";

    result.style.color =
      "#ff8d9b";

  }

}


function checkQuiz() {
  return;
}

window.startQuiz = startQuiz;
window.checkQuiz = checkQuiz;


/* =====================================================
   MYSTERY TOPIC
===================================================== */

function mysteryTopic() {

  openPage("mysteryPage");

  const topic =
    mysteryTopics[
      Math.floor(
        Math.random() *
        mysteryTopics.length
      )
    ];

  const title =
    document.getElementById(
      "mysteryTopicTitle"
    );

  const text =
    document.getElementById(
      "mysteryTopicText"
    );

  if (title) {
    title.textContent =
      topic[0];
  }

  if (text) {
    text.textContent =
      topic[1];
  }

}


window.mysteryTopic =
  mysteryTopic;


/* =====================================================
   AI TEACHER
===================================================== */

function openAITeacher() {

  openPage(
    "aiTeacherPage"
  );

}


async function askAI(message) {

  const response =
    await fetch(
      `${API_URL}/api/ai`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            message,
            username:
              currentUser?.username ||
              "Learner"
          })
      }
    );

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  if (!contentType.includes(
    "application/json"
  )) {

    throw new Error(
      "The server returned a non-JSON response."
    );

  }

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      "AI request failed"
    );
  }

  return data.answer;

}


async function teacherAIHelp() {

  const input =
    document.getElementById(
      "aiQuestion"
    );

  const chat =
    document.getElementById(
      "aiChat"
    );

  if (!input || !chat) {
    return;
  }

  const question =
    input.value.trim();

  if (!question) {
    return;
  }

  addAIMessage(
    chat,
    question,
    "user"
  );

  input.value = "";

  const loading =
    addAIMessage(
      chat,
      "Thinking...",
      "assistant"
    );

  try {

    const answer =
      await askAI(question);

    loading.textContent =
      answer;

  } catch (error) {

    loading.textContent =
      "Sorry, I couldn't reach the AI right now.";

    console.error(error);

  }

  chat.scrollTop =
    chat.scrollHeight;

}


function addAIMessage(
  container,
  text,
  type
) {

  const div =
    document.createElement(
      "div"
    );

  div.className =
    `aiMessage ${type}`;

  div.textContent =
    text;

  container.appendChild(div);

  container.scrollTop =
    container.scrollHeight;

  return div;

}


async function askAITeacher() {

  const input =
    document.getElementById(
      "aiTeacherInput"
    );

  const box =
    document.getElementById(
      "aiTeacherMessages"
    );

  if (!input || !box) {
    return;
  }

  const question =
    input.value.trim();

  if (!question) {
    return;
  }

  addTeacherBubble(
    box,
    question,
    true
  );

  input.value = "";

  const loading =
    addTeacherBubble(
      box,
      "Thinking...",
      false
    );

  try {

    const context =
      currentLesson
        ? `We are studying the lesson "${currentLesson.title}" in ${currentLesson.category}. ${currentLesson.description}. `
        : "";

    const answer =
      await askAI(
        context + question
      );

    loading.textContent =
      answer;

  } catch (error) {

    loading.textContent =
      "Sorry, the AI Teacher is unavailable right now.";

    console.error(error);

  }

}


async function askAIQuick(question) {

  const input =
    document.getElementById(
      "aiTeacherInput"
    );

  if (input) {
    input.value =
      question;
  }

  await askAITeacher();

}


function addTeacherBubble(
  box,
  text,
  user
) {

  const div =
    document.createElement(
      "div"
    );

  div.className =
    user
      ? "aiBubble user"
      : "aiBubble";

  div.textContent =
    text;

  box.appendChild(div);

  box.scrollTop =
    box.scrollHeight;

  return div;

}


window.openAITeacher =
  openAITeacher;

window.teacherAIHelp =
  teacherAIHelp;

window.askAITeacher =
  askAITeacher;

window.askAIQuick =
  askAIQuick;


/* =====================================================
   BADGES
===================================================== */

function renderBadges() {

  const box =
    document.getElementById(
      "allBadges"
    );

  if (!box) {
    return;
  }

  const completed =
    Number(
      currentUser?.lessonsCompleted || 0
    );

  const sessions =
  Number(
    currentUser?.sessions || 0
  );

const quizzes =
  (currentUser?.quizCompleted || []).length;

const purchases =
  (currentUser?.purchasedItems || []).length;

box.innerHTML = "";

  badges.forEach(badge => {
    
let unlocked = false;

if (badge.requirement === "session") {
  unlocked = sessions > 0;
} else if (badge.requirement === "teacher") {
  unlocked =
    sessions > 0 &&
    currentUser?.role === "teacher";
} else if (badge.requirement === "quiz") {
  unlocked = quizzes >= 1;
} else if (badge.requirement === "quiz5") {
  unlocked = quizzes >= 5;
} else if (badge.requirement === "shop") {
  unlocked = purchases >= 1;
} else {
  unlocked = completed >= badge.requirement;
}

    const card =
      document.createElement(
        "div"
      );

    card.className =
      unlocked
        ? "badge"
        : "badge locked";

    card.innerHTML = `
      <div class="badgeIcon">
        ${badge.icon}
      </div>

      <h3>
        ${badge.title}
      </h3>

      <p>
        ${badge.description}
      </p>

      <strong>
        ${unlocked ? "Unlocked ✓" : "Locked"}
      </strong>
    `;

    box.appendChild(card);

  });

}


/* =====================================================
   SHOP
===================================================== */

function renderShop() {

  const box =
    document.getElementById(
      "shopList"
    );

  const coins =
    document.getElementById(
      "shopCoins"
    );

  if (!box) {
    return;
  }

  if (coins) {
    coins.textContent =
      currentUser?.coins || 0;
  }

  box.innerHTML = "";

  shopItems.forEach(item => {

    const purchased =
      currentUser?.purchasedItems
        ?.includes(item.id);

    const equipped =
      currentUser?.equippedItem ===
      item.id;

    const card =
      document.createElement(
        "div"
      );

    card.className =
      "shopItem";

    card.innerHTML = `
      <div class="shopIcon">
        ${item.icon}
      </div>

      <h2>
        ${item.name}
      </h2>

      <p>
        ${item.description}
      </p>

      <div class="price">
        💰 ${item.price}
      </div>

      <button
        onclick="buyShopItem('${item.id}')"
      >
        ${
          equipped
            ? "Equipped"
            : purchased
              ? "Equip"
              : "Buy"
        }
      </button>
    `;

    box.appendChild(card);

  });

}


function buyShopItem(id) {

  if (!currentUser) {
    return;
  }

  const item =
    shopItems.find(
      shopItem =>
        shopItem.id === id
    );

  if (!item) {
    return;
  }

  currentUser.purchasedItems =
    currentUser.purchasedItems || [];

  const purchased =
    currentUser.purchasedItems
      .includes(id);

if (purchased) {

  currentUser.equippedItem =
    id;

  saveUser();
  updateHome();
  renderShop();
  renderBadges();
  updateProfile();

  return;
}
if (
  Number(currentUser.coins || 0) <
  item.price
) {

    alert(
      "You don't have enough 💰 coins."
    );

    return;

  }

  currentUser.coins -=
    item.price;

  currentUser.purchasedItems.push(
    id
  );

  currentUser.equippedItem =
    id;
saveUser();

updateHome();

renderShop();

renderBadges();

updateProfile();
  
}


window.buyShopItem =
  buyShopItem;


/* =====================================================
   PROFILE
===================================================== */

function updateProfile() {

  if (!currentUser) {
    return;
  }

  const name =
    document.getElementById(
      "profileName"
    );

  const lessonsDone =
    document.getElementById(
      "profileLessons"
    );

  const sessions =
    document.getElementById(
      "profileSessions"
    );

  const coins =
    document.getElementById(
      "profileCoins"
    );

  if (name) {
    name.textContent =
      currentUser.username;
  }

  if (lessonsDone) {
    lessonsDone.textContent =
      currentUser.lessonsCompleted || 0;
  }

  if (sessions) {
    sessions.textContent =
      currentUser.sessions || 0;
  }

  if (coins) {
    coins.textContent =
      currentUser.coins || 0;
  }


  
const avatar =
  document.getElementById("profileAvatar");

if (avatar) {

  const equipped =
    currentUser.equippedItem;

  const item =
    shopItems.find(
      shopItem =>
        shopItem.id === equipped
    );

  avatar.textContent =
    item
      ? item.icon
      : "👤";

}
  
}


/* =====================================================
   MAP
===================================================== */

function initializeMap() {

  if (
    typeof L === "undefined"
  ) {
    return;
  }

  if (map) {
    setTimeout(
      () => map.invalidateSize(),
      100
    );

    return;
  }

  const element =
    document.getElementById(
      "worldMap"
    );

  if (!element) {
    return;
  }

  map =
    L.map(
      "worldMap"
    ).setView(
      [20, 0],
      2
    );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution:
        "&copy; OpenStreetMap contributors"
    }
  ).addTo(map);

}


function showContinent(name) {

  const continent =
    continents[name];

  if (!continent) {
    return;
  }

  initializeMap();

  const info =
    document.getElementById(
      "countryInfo"
    );

  if (!info) {
    return;
  }

  info.innerHTML = `
    <h2>
      ${continent.emoji}
      ${continent.title}
    </h2>

    <p>
      ${continent.description}
    </p>

    <div class="continentFacts">

      ${continent.facts.map(
        fact =>
          `<div class="continentFact">
            🌟 ${fact}
          </div>`
      ).join("")}

    </div>
  `;

}


window.showContinent =
  showContinent;


/* =====================================================
   THEME
===================================================== */

function toggleTheme() {

  document.body.classList.toggle(
    "lightTheme"
  );

  localStorage.setItem(
    "teachlyTheme",
    document.body.classList.contains(
      "lightTheme"
    )
      ? "light"
      : "dark"
  );

}


function loadTheme() {

  const theme =
    localStorage.getItem(
      "teachlyTheme"
    );

  if (theme === "light") {

    document.body.classList.add(
      "lightTheme"
    );

  }

}


loadTheme();


window.toggleTheme =
  toggleTheme;


/* =====================================================
   SECURITY HELPER
===================================================== */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentUser = null;
  currentRole = "learner";
  currentLesson = null;
  currentQuiz = null;
  currentChatUser = null;

  localStorage.removeItem("teachlyUser");

  openPage("namePage");

  const input =
    document.getElementById("usernameInput");

  if (input) {
    input.value = "";
    input.focus();
  }

}

window.logout = logout;
