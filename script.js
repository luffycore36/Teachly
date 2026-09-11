const API_URL = "https://teachly-nmxh.onrender.com";


/* =========================================================
   STATE
========================================================= */

let currentRole = "";
let currentPerson = "";
let selectedLesson = null;
let currentCategory = "All";

let state = {
  name: "",
  email: "",
  token: "",
  loggedIn: false,

  sessions: 0,
  coins: 0,

  completedLessons: [],
  lessonProgress: {},
  quizScores: {},
  savedLessons: [],

  badges: [],

  ownedEffects: [],
  equippedEffect: "",

  theme: "light"
};

let people = [];


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function showToast(message) {

  const old =
    document.querySelector(".teachly-toast");

  if (old) {
    old.remove();
  }

  const toast =
    document.createElement("div");

  toast.className =
    "teachly-toast";

  toast.textContent =
    message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "25px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "99999",
    padding: "13px 20px",
    borderRadius: "12px",
    background: "#111",
    color: "#fff",
    fontWeight: "700",
    boxShadow: "0 8px 30px rgba(0,0,0,.3)"
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}


/* =========================================================
   STORAGE
========================================================= */

function save() {
  localStorage.setItem(
    "teachlyState",
    JSON.stringify(state)
  );
}


function load() {

  try {

    const saved =
      localStorage.getItem(
        "teachlyState"
      );

    if (!saved) {
      return;
    }

    const parsed =
      JSON.parse(saved);

    state = {
      ...state,
      ...parsed
    };

    if (!Array.isArray(state.completedLessons)) {
      state.completedLessons = [];
    }

    if (!Array.isArray(state.savedLessons)) {
      state.savedLessons = [];
    }

    if (!Array.isArray(state.badges)) {
      state.badges = [];
    }

    if (!Array.isArray(state.ownedEffects)) {
      state.ownedEffects = [];
    }

    if (!state.quizScores) {
      state.quizScores = {};
    }

  } catch (error) {

    console.error(
      "State load error:",
      error
    );

  }
}


/* =========================================================
   API
========================================================= */

async function apiFetch(endpoint, options = {}) {

  const headers = {
    ...(options.headers || {})
  };

  if (state.token) {
    headers.Authorization =
      `Bearer ${state.token}`;
  }

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers
      }
    );

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data;

  if (
    contentType.includes(
      "application/json"
    )
  ) {

    data =
      await response.json();

  } else {

    const text =
      await response.text();

    throw new Error(
      `Server returned HTML instead of JSON (${response.status}). ${text.slice(0, 150)}`
    );

  }

  if (!response.ok) {

    throw new Error(
      data.error ||
      data.message ||
      `Request failed (${response.status})`
    );

  }

  return data;
}


/* =========================================================
   NAVIGATION
========================================================= */

function openPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove("active");
    });

  const page =
    document.getElementById(pageId);

  if (!page) {
    console.warn(
      "Page not found:",
      pageId
    );
    return;
  }

  page.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (pageId === "homePage") {
    updateHome();
  }

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

    setTimeout(() => {
      initializeMap();
    }, 150);

  }

}


/* =========================================================
   START
========================================================= */

function startTeachly() {

  const input =
    document.getElementById(
      "usernameInput"
    );

  if (!input) {
    return;
  }

  const name =
    input.value.trim();

  if (!name) {

    showToast(
      "Please enter your username."
    );

    return;
  }

  state.name =
    name;

  state.loggedIn =
    true;

  save();

  updateHome();

  openPage(
    "homePage"
  );
}


/* =========================================================
   HOME
========================================================= */

function updateHome() {

  const username =
    document.getElementById(
      "homeUsername"
    );

  if (username) {
    username.textContent =
      state.name ||
      "Learner";
  }


  const welcome =
    document.getElementById(
      "welcomeText"
    );

  if (welcome) {

    welcome.textContent =
      state.name
        ? `Welcome, ${state.name}!`
        : "Welcome!";

  }


  const coinElements =
    document.querySelectorAll(
      "#coinCount, #homeCoins, #shopCoins"
    );

  coinElements.forEach(element => {
    element.textContent =
      state.coins || 0;
  });


  const sessionElements =
    document.querySelectorAll(
      "#sessionCount"
    );

  sessionElements.forEach(element => {
    element.textContent =
      state.sessions || 0;
  });


  const progress =
    document.getElementById(
      "overallProgress"
    );

  if (progress) {

    const completed =
      state.completedLessons.length;

    const percentage =
      lessons.length
        ? Math.round(
            completed /
            lessons.length *
            100
          )
        : 0;

    progress.style.width =
      `${percentage}%`;

  }

  updateBadges();
}


/* =========================================================
   ROLE MATCHING
========================================================= */

function chooseRole(role) {

  currentRole =
    role;

  openPage(
    "searchPage"
  );

  const title =
    document.getElementById(
      "searchTitle"
    );

  const text =
    document.getElementById(
      "searchText"
    );

  if (role === "learner") {

    title.textContent =
      "Finding a teacher...";

    text.textContent =
      "Looking for a real registered teacher volunteer.";

  } else {

    title.textContent =
      "Finding a learner...";

    text.textContent =
      "Looking for a real registered learner volunteer.";

  }

  setTimeout(
    findRealPerson,
    1200
  );
}


async function findRealPerson() {

  try {

    const data =
      await apiFetch(
        "/api/people"
      );

    const users =
      Array.isArray(data.people)
        ? data.people
        : [];

    const current =
      String(state.name || "")
        .trim()
        .toLowerCase();

    const wantedRole =
      currentRole === "learner"
        ? "teacher"
        : "learner";

    const matches =
      users.filter(user => {

        if (!user.username) {
          return false;
        }

        return (
          String(user.username)
            .trim()
            .toLowerCase() !==
          current &&
          user.role === wantedRole
        );

      });


    if (!matches.length) {

      if (
        currentRole ===
        "learner"
      ) {

        showToast(
          "No registered teacher is available."
        );

        setTimeout(() => {

          const useAI =
            confirm(
              "No registered teacher is available.\n\nWould you like the AI Teacher instead?"
            );

          if (useAI) {
            openAITeacher();
          } else {
            goHome();
          }

        }, 400);

      } else {

        showToast(
          "No registered learner is available."
        );

        setTimeout(
          goHome,
          1200
        );

      }

      return;
    }


    const person =
      matches[0];

    currentPerson =
      person.username;

    state.sessions++;

    save();

    updateBadges();

    openChat(
      currentPerson
    );

  } catch (error) {

    console.error(
      "MATCH ERROR:",
      error
    );

    showToast(
      "Could not check registered users."
    );

    setTimeout(
      goHome,
      1500
    );

  }

}


/* =========================================================
   PEOPLE
========================================================= */

async function loadPeople() {

  const box =
    document.getElementById(
      "peopleList"
    );

  if (!box) {
    return;
  }

  box.innerHTML = `
    <div class="person">
      Loading real registered users...
    </div>
  `;


  try {

    const data =
      await apiFetch(
        "/api/people"
      );

    people =
      Array.isArray(data.people)
        ? data.people
        : [];


    const current =
      String(state.name || "")
        .trim()
        .toLowerCase();


    const visible =
      people.filter(person => {

        return (
          person.username &&
          String(person.username)
            .trim()
            .toLowerCase() !==
          current
        );

      });


    if (!visible.length) {

      box.innerHTML = `
        <div class="person">
          <div>
            <h3>No other users yet.</h3>
            <p>
              Verified Teachly users will appear here.
            </p>
          </div>
        </div>
      `;

      return;
    }


    box.innerHTML =
      visible.map(person => `

        <div class="person">

          <div>

            <div style="font-size:35px">
              👤
            </div>

            <h3>
              ${escapeHTML(person.username)}
            </h3>

            <p>
              Role:
              ${escapeHTML(person.role || "user")}
            </p>

          </div>

          <button
            onclick="connectPerson(${JSON.stringify(person.username)})"
          >
            Connect
          </button>

        </div>

      `).join("");


  } catch (error) {

    console.error(
      "PEOPLE ERROR:",
      error
    );

    box.innerHTML = `
      <div class="person">
        Unable to load people right now.
      </div>
    `;

  }

}


function connectPerson(username) {

  if (!username) {
    return;
  }

  currentPerson =
    username;

  state.sessions++;

  save();

  updateBadges();

  openChat(
    username
  );
}


/* =========================================================
   CHAT
========================================================= */

function openChat(person) {

  currentPerson =
    person;

  const title =
    document.getElementById(
      "chatTitle"
    );

  if (title) {
    title.textContent =
      person;
  }

  openPage(
    "chatPage"
  );
}


function sendMessage() {

  const input =
    document.getElementById(
      "messageInput"
    );

  const messages =
    document.getElementById(
      "chatMessages"
    );

  if (!input || !messages) {
    return;
  }

  const text =
    input.value.trim();

  if (!text) {
    return;
  }


  const message =
    document.createElement(
      "div"
    );

  message.className =
    "message me";

  message.textContent =
    text;

  messages.appendChild(
    message
  );

  input.value = "";

  messages.scrollTop =
    messages.scrollHeight;


  setTimeout(() => {

    const reply =
      document.createElement(
        "div"
      );

    reply.className =
      "message";

    reply.textContent =
      `${currentPerson} is not currently connected to the live chat.`;

    messages.appendChild(
      reply
    );

    messages.scrollTop =
      messages.scrollHeight;

  }, 600);

}


function addEmoji(emoji) {

  const input =
    document.getElementById(
      "messageInput"
    );

  if (!input) {
    return;
  }

  input.value +=
    emoji;

  input.focus();
}


/* =========================================================
   LESSONS
========================================================= */

const lessons = [

  {
    id: "math-algebra",
    title: "Introduction to Algebra",
    category: "Mathematics",
    icon: "📐",
    description:
      "Learn variables, expressions and equations.",
    content:
      "Algebra uses letters and symbols to represent unknown values. A variable can represent a number we do not know yet. For example, in x + 3 = 7, x represents the unknown number. Solving the equation gives x = 4."
  },

  {
    id: "math-fractions",
    title: "Fractions",
    category: "Mathematics",
    icon: "➗",
    description:
      "Understand numerators, denominators and equivalent fractions.",
    content:
      "A fraction represents part of a whole. The numerator is the number above the line and the denominator is below it. Equivalent fractions have different numbers but represent the same value."
  },

  {
    id: "science-cells",
    title: "Cells",
    category: "Science",
    icon: "🔬",
    description:
      "Explore the basic unit of living organisms.",
    content:
      "Cells are the basic units of living organisms. Animal and plant cells contain structures such as the cell membrane, cytoplasm and nucleus. Plant cells also have a cell wall, chloroplasts and a large central vacuole."
  },

  {
    id: "science-solar",
    title: "The Solar System",
    category: "Science",
    icon: "🌌",
    description:
      "Explore planets and objects in our Solar System.",
    content:
      "Our Solar System contains the Sun, eight planets, dwarf planets, moons, asteroids and comets. The planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune."
  },

  {
    id: "english-grammar",
    title: "English Grammar",
    category: "English",
    icon: "📖",
    description:
      "Learn nouns, verbs and sentence structure.",
    content:
      "A noun names a person, place, thing or idea. A verb describes an action or state. A complete sentence communicates a complete thought and generally has a subject and predicate."
  },

  {
    id: "history-civilizations",
    title: "Ancient Civilizations",
    category: "History",
    icon: "🏛️",
    description:
      "Discover how early civilizations developed.",
    content:
      "Ancient civilizations developed organized societies, agriculture, governments, writing systems and trade. Important early civilizations developed in Mesopotamia, Egypt, the Indus Valley and China."
  }

];


function renderLessons() {

  const grid =
    document.getElementById(
      "lessonGrid"
    );

  if (!grid) {
    return;
  }


  const count =
    document.getElementById(
      "lessonCount"
    );

  if (count) {
    count.textContent =
      lessons.length;
  }


  let filtered =
    lessons;

  if (
    currentCategory !==
    "All"
  ) {

    filtered =
      lessons.filter(
        lesson =>
          lesson.category ===
          currentCategory
      );

  }


  grid.innerHTML =
    filtered.map(lesson => `

      <div
        class="lessonCard"
        onclick="openLesson('${lesson.id}')"
      >

        <div class="lessonIcon">
          ${lesson.icon}
        </div>

        <span class="lessonMiniTag">
          ${escapeHTML(lesson.category)}
        </span>

        <h3>
          ${escapeHTML(lesson.title)}
        </h3>

        <p>
          ${escapeHTML(lesson.description)}
        </p>

        <button
          onclick="event.stopPropagation(); openLesson('${lesson.id}')"
        >
          Start Lesson
        </button>

      </div>

    `).join("");

}


function filterLessons(category) {

  currentCategory =
    category;

  document
    .querySelectorAll(
      ".lessonCategoryButton"
    )
    .forEach(button => {

      button.classList.remove(
        "active"
      );

      if (
        button.textContent
          .trim() ===
        category
      ) {

        button.classList.add(
          "active"
        );

      }

    });

  renderLessons();
}


/* =========================================================
   OPEN LESSON
========================================================= */

function openLesson(id) {

  selectedLesson =
    lessons.find(
      lesson =>
        lesson.id === id
    );

  if (!selectedLesson) {
    return;
  }


  const title =
    document.querySelectorAll(
      "#selectedLessonTitle"
    );

  title.forEach(element => {
    element.textContent =
      selectedLesson.title;
  });


  const category =
    document.getElementById(
      "selectedLessonCategory"
    );

  if (category) {
    category.textContent =
      selectedLesson.category;
  }


  const description =
    document.getElementById(
      "selectedLessonDescription"
    );

  if (description) {
    description.textContent =
      selectedLesson.description;
  }


  const content =
    document.getElementById(
      "selectedLessonContent"
    );

  if (content) {
    content.textContent =
      selectedLesson.content;
  }


  updateLessonSaveButton();

  openPage(
    "selectedLessonPage"
  );
}


function updateLessonSaveButton() {

  const button =
    document.getElementById(
      "saveLessonButton"
    );

  if (!button || !selectedLesson) {
    return;
  }

  button.textContent =
    state.savedLessons.includes(
      selectedLesson.id
    )
      ? "★ Saved"
      : "☆ Save Lesson";
}


/* =========================================================
   COMPLETE LESSON
========================================================= */

function completeLesson() {

  if (!selectedLesson) {
    showToast(
      "Choose a lesson first."
    );

    return;
  }


  if (
    !state.completedLessons.includes(
      selectedLesson.id
    )
  ) {

    state.completedLessons.push(
      selectedLesson.id
    );

    state.coins +=
      10;

    save();

    updateBadges();

    updateHome();

    showToast(
      "Lesson completed! +10 💰"
    );

  } else {

    showToast(
      "You already completed this lesson."
    );

  }

}


/* =========================================================
   SAVED LESSONS
========================================================= */

function toggleSavedLesson() {

  if (!selectedLesson) {
    return;
  }

  const index =
    state.savedLessons.indexOf(
      selectedLesson.id
    );


  if (index === -1) {

    state.savedLessons.push(
      selectedLesson.id
    );

    showToast(
      "Lesson saved."
    );

  } else {

    state.savedLessons.splice(
      index,
      1
    );

    showToast(
      "Lesson removed from saved lessons."
    );

  }


  save();

  updateLessonSaveButton();
}


/* =========================================================
   QUIZ
========================================================= */

let currentQuizIndex = 0;
let quizScore = 0;


function startQuiz() {

  if (!selectedLesson) {

    showToast(
      "Choose a lesson first."
    );

    return;
  }

  currentQuizIndex =
    0;

  quizScore =
    0;


  const name =
    document.getElementById(
      "quizLessonName"
    );

  if (name) {
    name.textContent =
      selectedLesson.title;
  }


  const result =
    document.getElementById(
      "quizResult"
    );

  if (result) {
    result.textContent =
      "";
  }


  openPage(
    "quizPage"
  );

  renderQuizQuestion();
}


function getQuizQuestions() {

  if (!selectedLesson) {
    return [];
  }


  switch (
    selectedLesson.category
  ) {

    case "Mathematics":

      return [

        {
          question:
            "What is a variable?",
          options: [
            "A letter representing a value",
            "A punctuation mark",
            "A type of fraction",
            "A multiplication sign"
          ],
          answer: 0
        },

        {
          question:
            "What is 2 + 3?",
          options: [
            "4",
            "5",
            "6",
            "7"
          ],
          answer: 1
        },

        {
          question:
            "If x + 3 = 7, what is x?",
          options: [
            "2",
            "3",
            "4",
            "5"
          ],
          answer: 2
        }

      ];


    case "Science":

      return [

        {
          question:
            "What is the basic unit of life?",
          options: [
            "Cell",
            "Planet",
            "Rock",
            "Cloud"
          ],
          answer: 0
        },

        {
          question:
            "Which object is at the center of our Solar System?",
          options: [
            "Earth",
            "Moon",
            "Sun",
            "Mars"
          ],
          answer: 2
        },

        {
          question:
            "Which structure contains most of a cell's genetic material?",
          options: [
            "Nucleus",
            "Vacuole",
            "Cell wall",
            "Cytoplasm"
          ],
          answer: 0
        }

      ];


    case "English":

      return [

        {
          question:
            "Which word is a noun?",
          options: [
            "Run",
            "Beautiful",
            "School",
            "Quickly"
          ],
          answer: 2
        },

        {
          question:
            "Which word is a verb?",
          options: [
            "Jump",
            "Blue",
            "Table",
            "Happy"
          ],
          answer: 0
        },

        {
          question:
            "Which is a complete sentence?",
          options: [
            "Running quickly.",
            "The student reads.",
            "Because the.",
            "Very happy."
          ],
          answer: 1
        }

      ];


    default:

      return [

        {
          question:
            "What does history study?",
          options: [
            "Past events",
            "Only planets",
            "Only mathematics",
            "Only weather"
          ],
          answer: 0
        },

        {
          question:
            "Which was an ancient civilization?",
          options: [
            "Indus Valley civilization",
            "Internet civilization",
            "Digital civilization",
            "Modern civilization"
          ],
          answer: 0
        },

        {
          question:
            "Why are historical records useful?",
          options: [
            "They help us understand the past",
            "They control the weather",
            "They replace mathematics",
            "They predict everything"
          ],
          answer: 0
        }

      ];

  }

}


function renderQuizQuestion() {

  const questions =
    getQuizQuestions();

  const question =
    questions[currentQuizIndex];


  if (!question) {

    finishQuiz();

    return;
  }


  const questionBox =
    document.getElementById(
      "quizQuestion"
    );

  const optionsBox =
    document.getElementById(
      "quizOptions"
    );


  if (questionBox) {
    questionBox.textContent =
      question.question;
  }


  if (optionsBox) {

    optionsBox.innerHTML =
      question.options.map(
        (option, index) => `

          <button
            onclick="answerQuiz(${index})"
          >
            ${escapeHTML(option)}
          </button>

        `
      ).join("");

  }

}


function answerQuiz(index) {

  const questions =
    getQuizQuestions();

  const question =
    questions[currentQuizIndex];

  if (!question) {
    return;
  }


  if (
    index ===
    question.answer
  ) {

    quizScore++;

    showToast(
      "Correct! 🎉"
    );

  } else {

    showToast(
      "Not quite. Keep learning!"
    );

  }


  currentQuizIndex++;

  setTimeout(
    renderQuizQuestion,
    500
  );
}


function checkQuiz() {

  showToast(
    "Choose an answer above."
  );

}


function finishQuiz() {

  if (!selectedLesson) {
    return;
  }


  const questions =
    getQuizQuestions();


  state.quizScores[
    selectedLesson.id
  ] = quizScore;


  state.coins +=
    quizScore * 5;


  save();

  updateBadges();

  updateHome();


  const result =
    document.getElementById(
      "quizResult"
    );

  if (result) {

    result.textContent =
      `You scored ${quizScore}/${questions.length}. You earned ${quizScore * 5} 💰.`;

  }

}


/* =========================================================
   AI TEACHER
========================================================= */

function openAITeacher() {

  openPage(
    "aiTeacherPage"
  );


  const input =
    document.getElementById(
      "aiQuestion"
    );

  if (input) {

    setTimeout(
      () => input.focus(),
      150
    );

  }

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


  const message =
    input.value.trim();


  if (!message) {

    showToast(
      "Ask me a question first."
    );

    return;
  }


  input.value =
    "";


  const userBubble =
    document.createElement(
      "div"
    );

  userBubble.className =
    "aiMessage user";

  userBubble.textContent =
    message;

  chat.appendChild(
    userBubble
  );


  const loading =
    document.createElement(
      "div"
    );

  loading.className =
    "aiMessage assistant";

  loading.textContent =
    "Thinking...";

  chat.appendChild(
    loading
  );


  chat.scrollTop =
    chat.scrollHeight;


  try {

    const data =
      await apiFetch(
        "/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              message,

              lesson:
                selectedLesson
                  ? selectedLesson
                  : null
            })
        }
      );


    loading.textContent =
      data.answer ||
      "I couldn't generate an answer.";

  } catch (error) {

    console.error(
      "AI ERROR:",
      error
    );

    loading.textContent =
      "AI Teacher error: " +
      error.message;

  }


  chat.scrollTop =
    chat.scrollHeight;
}


/* =========================================================
   LESSON AI
========================================================= */

async function askAITeacher() {

  const input =
    document.getElementById(
      "aiTeacherInput"
    );

  const messages =
    document.getElementById(
      "aiTeacherMessages"
    );


  if (!input || !messages) {
    return;
  }


  const question =
    input.value.trim();


  if (!question) {

    showToast(
      "Ask the AI Teacher something."
    );

    return;
  }


  input.value =
    "";


  const user =
    document.createElement(
      "div"
    );

  user.className =
    "aiBubble";

  user.innerHTML =
    `<strong>You</strong><p>${escapeHTML(question)}</p>`;

  messages.appendChild(
    user
  );


  const loading =
    document.createElement(
      "div"
    );

  loading.className =
    "aiBubble";

  loading.innerHTML =
    `<strong>AI Teacher</strong><p>Thinking...</p>`;

  messages.appendChild(
    loading
  );


  try {

    const data =
      await apiFetch(
        "/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              message:
                question,

              lesson:
                selectedLesson
                  ? selectedLesson
                  : null
            })
        }
      );


    loading.innerHTML =
      `<strong>AI Teacher</strong><p>${escapeHTML(data.answer || "I couldn't answer that.")}</p>`;

  } catch (error) {

    console.error(
      "LESSON AI ERROR:",
      error
    );

    loading.innerHTML =
      `<strong>AI Teacher</strong><p>Sorry, the AI could not respond: ${escapeHTML(error.message)}</p>`;

  }


  messages.scrollTop =
    messages.scrollHeight;
}


function askAIQuick(question) {

  const input =
    document.getElementById(
      "aiTeacherInput"
    );

  if (!input) {
    return;
  }

  input.value =
    question;

  askAITeacher();
}


/* =========================================================
   RANDOM TOPIC
========================================================= */

const randomTopics = [

  {
    title: "Why is the sky blue?",
    text:
      "Sunlight contains many colors. Earth's atmosphere scatters blue light more strongly than many other visible wavelengths, which makes the daytime sky appear blue."
  },

  {
    title: "How do airplanes fly?",
    text:
      "Airplane wings are shaped to interact with moving air and generate lift. The engines provide thrust, while the wings and control surfaces help the aircraft stay stable and change direction."
  },

  {
    title: "How does a rainbow form?",
    text:
      "A rainbow forms when sunlight interacts with water droplets. The light is refracted, reflected and separated into different colors."
  },

  {
    title: "Why do we have seasons?",
    text:
      "Earth's axis is tilted. As Earth travels around the Sun, different parts of the planet receive different amounts of direct sunlight during the year."
  },

  {
    title: "How do plants make food?",
    text:
      "Plants use photosynthesis to turn light energy into chemical energy. They use carbon dioxide and water to produce sugars and release oxygen."
  },

  {
    title: "What is gravity?",
    text:
      "Gravity is an attractive interaction between objects with mass. Earth's gravity keeps people and objects near the surface and keeps the Moon in orbit."
  },

  {
    title: "How do volcanoes form?",
    text:
      "Volcanoes can form where magma reaches Earth's surface. Many occur near tectonic plate boundaries, although volcanic activity can also happen in other geological settings."
  },

  {
    title: "What is DNA?",
    text:
      "DNA is a molecule that stores biological instructions used by living organisms. Sections of DNA called genes contain information used in biological processes."
  },

  {
    title: "Why is the ocean salty?",
    text:
      "Rocks on land contain minerals that can dissolve into water. Rivers carry dissolved ions toward the ocean, and geological processes also contribute salts over very long periods."
  },

  {
    title: "How do stars shine?",
    text:
      "Stars produce energy through nuclear fusion in their cores. In stars like the Sun, hydrogen nuclei combine to form helium and release energy."
  }

];


function mysteryTopic() {

  const topic =
    randomTopics[
      Math.floor(
        Math.random() *
        randomTopics.length
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
      topic.title;
  }

  if (text) {
    text.textContent =
      topic.text;
  }


  openPage(
    "mysteryPage"
  );
}


/* =========================================================
   BADGES
========================================================= */

const badgeDefinitions = [

  {
    id: "first-lesson",
    icon: "🌱",
    title: "First Step",
    description:
      "Complete your first lesson."
  },

  {
    id: "five-lessons",
    icon: "📚",
    title: "Bookworm",
    description:
      "Complete five lessons."
  },

  {
    id: "quiz-master",
    icon: "🏆",
    title: "Quiz Master",
    description:
      "Get a perfect quiz score."
  },

  {
    id: "connector",
    icon: "🤝",
    title: "Connector",
    description:
      "Connect with another Teachly user."
  },

  {
    id: "curious",
    icon: "🎲",
    title: "Curious Mind",
    description:
      "Discover a random topic."
  },

  {
    id: "scholar",
    icon: "🎓",
    title: "Scholar",
    description:
      "Complete every lesson."
  }

];


function updateBadges() {

  const unlocked = [];


  if (
    state.completedLessons.length >=
    1
  ) {
    unlocked.push(
      "first-lesson"
    );
  }


  if (
    state.completedLessons.length >=
    5
  ) {
    unlocked.push(
      "five-lessons"
    );
  }


  const perfect =
    Object.values(
      state.quizScores || {}
    ).some(
      score =>
        score === 3
    );


  if (perfect) {
    unlocked.push(
      "quiz-master"
    );
  }


  if (
    state.sessions >=
    1
  ) {
    unlocked.push(
      "connector"
    );
  }


  if (
    state.randomTopicsViewed
  ) {
    unlocked.push(
      "curious"
    );
  }


  if (
    state.completedLessons.length >=
    lessons.length
  ) {
    unlocked.push(
      "scholar"
    );
  }


  state.badges =
    unlocked;

  save();
}


function renderBadges() {

  updateBadges();


  const container =
    document.getElementById(
      "allBadges"
    );

  if (!container) {
    return;
  }


  container.innerHTML =
    badgeDefinitions.map(
      badge => {

        const unlocked =
          state.badges.includes(
            badge.id
          );


        return `

          <div class="badge ${
            unlocked
              ? ""
              : "locked"
          }">

            <div class="badgeIcon">
              ${badge.icon}
            </div>

            <h3>
              ${badge.title}
            </h3>

            <p>
              ${badge.description}
            </p>

            <small>
              ${
                unlocked
                  ? "Unlocked ✓"
                  : "Locked 🔒"
              }
            </small>

          </div>

        `;

      }
    ).join("");
}


/* =========================================================
   SHOP
========================================================= */

const shopProducts = [

  {
    id: "ring",
    icon: "💍",
    name: "Learning Ring",
    price: 30,
    description:
      "A special learning profile effect."
  },

  {
    id: "spark",
    icon: "✨",
    name: "Spark Effect",
    price: 45,
    description:
      "Add a spark effect to your profile."
  },

  {
    id: "crown",
    icon: "👑",
    name: "Knowledge Crown",
    price: 70,
    description:
      "Show your learning achievement."
  }

];


function renderShop() {

  const list =
    document.getElementById(
      "shopList"
    );

  if (!list) {
    return;
  }


  const coins =
    document.getElementById(
      "shopCoins"
    );

  if (coins) {
    coins.textContent =
      state.coins || 0;
  }


  list.innerHTML =
    shopProducts.map(
      product => {

        const owned =
          state.ownedEffects.includes(
            product.id
          );


        return `

          <div class="shopItem">

            <div style="font-size:55px">
              ${product.icon}
            </div>

            <h2>
              ${product.name}
            </h2>

            <p>
              ${product.description}
            </p>

            <div class="price">
              💰 ${product.price}
            </div>

            <button
              onclick="buyShopItem('${product.id}')"
            >
              ${
                owned
                  ? "Equip"
                  : "Buy"
              }
            </button>

          </div>

        `;

      }
    ).join("");
}


function buyShopItem(id) {

  const product =
    shopProducts.find(
      item =>
        item.id === id
    );

  if (!product) {
    return;
  }


  if (
    state.ownedEffects.includes(
      id
    )
  ) {

    state.equippedEffect =
      id;

    save();

    showToast(
      `${product.name} equipped!`
    );

    return;
  }


  if (
    state.coins <
    product.price
  ) {

    showToast(
      "You don't have enough 💰."
    );

    return;
  }


  state.coins -=
    product.price;

  state.ownedEffects.push(
    id
  );

  state.equippedEffect =
    id;

  save();

  renderShop();

  updateHome();

  showToast(
    `${product.name} purchased!`
  );
}


/* =========================================================
   PROFILE
========================================================= */

function updateProfile() {

  const name =
    document.getElementById(
      "profileName"
    );

  if (name) {
    name.textContent =
      state.name ||
      "Learner";
  }


  const lessonsCount =
    document.getElementById(
      "profileLessons"
    );

  if (lessonsCount) {
    lessonsCount.textContent =
      state.completedLessons.length;
  }


  const sessions =
    document.getElementById(
      "profileSessions"
    );

  if (sessions) {
    sessions.textContent =
      state.sessions;
  }


  const coins =
    document.getElementById(
      "profileCoins"
    );

  if (coins) {
    coins.textContent =
      state.coins;
  }

}


/* =========================================================
   LEARNSPHERE
========================================================= */

const continents = {

  "Asia": {

    emoji: "🌏",

    description:
      "Asia is the largest continent by both land area and population. It stretches from the Arctic region in the north to tropical Southeast Asia and includes enormous geographic diversity.",

    geography:
      "Asia contains the Himalayas, the Tibetan Plateau, large deserts, vast plains, forests, islands and major river systems.",

    climate:
      "Its climates range from Arctic conditions in Siberia to tropical climates near the equator.",

    wildlife:
      "Asian wildlife includes tigers, giant pandas, elephants, snow leopards, orangutans and many other species.",

    facts:
      [
        "Asia contains the Himalayas.",
        "The continent includes many of the world's most populous countries.",
        "The Gobi Desert is located in Asia.",
        "The world's highest mountain, Mount Everest, is in the Himalayas."
      ],

    coordinates:
      [30, 90]

  },


  "Africa": {

    emoji: "🌍",

    description:
      "Africa is the second-largest continent and is known for its huge variety of landscapes, cultures and ecosystems.",

    geography:
      "Africa contains the Sahara Desert, the Nile River, tropical rainforests, savannas, mountains and coastal regions.",

    climate:
      "Africa includes desert, tropical, Mediterranean, highland and savanna climates.",

    wildlife:
      "African wildlife includes lions, elephants, giraffes, zebras, gorillas, cheetahs and rhinoceroses.",

    facts:
      [
        "The Sahara is the largest hot desert.",
        "The Nile is one of the world's longest rivers.",
        "Africa is home to many unique ecosystems.",
        "The continent has enormous cultural and linguistic diversity."
      ],

    coordinates:
      [5, 20]

  },


  "Europe": {

    emoji: "🌍",

    description:
      "Europe is a relatively small continent with a long and influential history and a high diversity of languages, cultures and landscapes.",

    geography:
      "Europe includes mountain ranges such as the Alps, large plains, peninsulas, islands and extensive coastlines.",

    climate:
      "Much of Europe has temperate climates, while northern and southern areas have colder and warmer climates respectively.",

    wildlife:
      "European wildlife includes brown bears, wolves, lynx, reindeer, foxes and many bird species.",

    facts:
      [
        "Europe contains many countries within a relatively small area.",
        "The Alps are a major mountain range.",
        "The continent has many important rivers such as the Danube.",
        "Europe contains many historically important cities."
      ],

    coordinates:
      [50, 15]

  },


  "North America": {

    emoji: "🌎",

    description:
      "North America extends from Arctic regions in the north to tropical regions in the south.",

    geography:
      "The continent includes the Rocky Mountains, Great Plains, deserts, forests, large lakes and long coastlines.",

    climate:
      "North America contains Arctic, temperate, desert, tropical and Mediterranean climate zones.",

    wildlife:
      "Wildlife includes polar bears, bison, moose, bears, wolves, alligators and many bird species.",

    facts:
      [
        "Greenland is geographically part of North America.",
        "The Rocky Mountains stretch through the western part of the continent.",
        "The Great Lakes form one of the largest freshwater systems.",
        "North America has ecosystems ranging from Arctic tundra to tropical forests."
      ],

    coordinates:
      [40, -100]

  },


  "South America": {

    emoji: "🌎",

    description:
      "South America is known for the Andes Mountains, Amazon rainforest and enormous biological diversity.",

    geography:
      "The continent contains the Andes, Amazon Basin, grasslands, deserts, highlands and extensive coastlines.",

    climate:
      "South America has tropical rainforest, savanna, desert, temperate and highland climates.",

    wildlife:
      "Wildlife includes jaguars, llamas, alpacas, anacondas, capybaras, condors and many rainforest species.",

    facts:
      [
        "The Amazon rainforest is primarily in South America.",
        "The Andes are the world's longest continental mountain range.",
        "The Amazon River is one of the world's largest river systems.",
        "The continent contains extremely high biodiversity."
      ],

    coordinates:
      [-15, -60]

  },


  "Australia/Oceania": {

    emoji: "🌏",

    description:
      "Australia/Oceania includes Australia and the many islands and island groups of the Pacific region.",

    geography:
      "The region includes deserts, tropical forests, grasslands, mountains, coral reefs and thousands of islands.",

    climate:
      "Climate ranges from tropical conditions in northern areas to temperate and desert climates in Australia.",

    wildlife:
      "The region is famous for kangaroos, koalas, wombats, platypuses, emus and many unique birds and marine species.",

    facts:
      [
        "Australia is the world's smallest continent when treated as a continent.",
        "The Great Barrier Reef is off Australia's northeastern coast.",
        "Many species in Australia are found nowhere else naturally.",
        "Oceania includes numerous Pacific island groups."
      ],

    coordinates:
      [-25, 135]

  },


  "Antarctica": {

    emoji: "❄️",

    description:
      "Antarctica surrounds the South Pole and is the coldest, driest and windiest continent.",

    geography:
      "The continent is dominated by a huge ice sheet and contains mountain ranges, glaciers and floating ice shelves.",

    climate:
      "Antarctica has an extremely cold polar climate with very low precipitation.",

    wildlife:
      "Wildlife includes penguins, seals, whales and many seabirds, particularly around coastal areas.",

    facts:
      [
        "Antarctica is the coldest continent.",
        "Most of its surface is covered by ice.",
        "There are no permanent native human populations.",
        "It is an important area for scientific research."
      ],

    coordinates:
      [-82, 0]

  }

};


let worldMap = null;


function initializeMap() {

  const mapElement =
    document.getElementById(
      "worldMap"
    );

  if (
    !mapElement ||
    typeof L ===
    "undefined"
  ) {
    return;
  }


  if (worldMap) {

    worldMap.invalidateSize();

    return;
  }


  worldMap =
    L.map(
      mapElement
    ).setView(
      [20, 0],
      2
    );


  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        "&copy; OpenStreetMap contributors"
    }
  ).addTo(
    worldMap
  );

}


function showContinent(name) {

  const continent =
    continents[name];

  if (!continent) {
    return;
  }


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
      ${escapeHTML(name)}
    </h2>

    <p>
      ${escapeHTML(continent.description)}
    </p>


    <div class="continentFacts">

      <div class="continentFact">
        <h3>🗺️ Geography</h3>
        <p>
          ${escapeHTML(continent.geography)}
        </p>
      </div>

      <div class="continentFact">
        <h3>🌦️ Climate</h3>
        <p>
          ${escapeHTML(continent.climate)}
        </p>
      </div>

      <div class="continentFact">
        <h3>🐾 Wildlife</h3>
        <p>
          ${escapeHTML(continent.wildlife)}
        </p>
      </div>

      <div class="continentFact">
        <h3>💡 Interesting Facts</h3>

        <ul>
          ${continent.facts
            .map(
              fact =>
                `<li>${escapeHTML(fact)}</li>`
            )
            .join("")}
        </ul>

      </div>

    </div>

  `;


  if (worldMap) {

    worldMap.setView(
      continent.coordinates,
      3
    );

  }

}


/* =========================================================
   RANDOM TOPIC BADGE
========================================================= */

const originalMysteryTopic =
  mysteryTopic;

mysteryTopic = function() {

  state.randomTopicsViewed =
    true;

  save();

  updateBadges();

  originalMysteryTopic();

};


/* =========================================================
   THEME
========================================================= */

function toggleTheme() {

  state.theme =
    state.theme ===
    "dark"
      ? "light"
      : "dark";

  document.body.classList.toggle(
    "dark",
    state.theme ===
    "dark"
  );

  save();
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  state.loggedIn =
    false;

  state.token =
    "";

  state.name =
    "";

  save();

  openPage(
    "namePage"
  );

  showToast(
    "Logged out."
  );
}


function goHome() {

  openPage(
    "homePage"
  );

}


function goBack() {

  goHome();

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    load();

    updateHome();

    renderLessons();

    renderBadges();

    renderShop();

    updateProfile();

    document.body.classList.toggle(
      "dark",
      state.theme ===
      "dark"
    );


    if (
      state.loggedIn &&
      state.name
    ) {

      openPage(
        "homePage"
      );

    } else {

      openPage(
        "namePage"
      );

    }

  }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Enter"
    ) {

      if (
        event.target?.id ===
        "usernameInput"
      ) {

        event.preventDefault();

        startTeachly();

      }


      if (
        event.target?.id ===
        "messageInput"
      ) {

        event.preventDefault();

        sendMessage();

      }

    }


    if (
      event.key ===
      "Escape"
    ) {

      goHome();

    }

  }
);


/* =========================================================
   GLOBAL FUNCTIONS FOR HTML
========================================================= */

window.openPage =
  openPage;

window.startTeachly =
  startTeachly;

window.chooseRole =
  chooseRole;

window.findRealPerson =
  findRealPerson;

window.loadPeople =
  loadPeople;

window.connectPerson =
  connectPerson;

window.openChat =
  openChat;

window.sendMessage =
  sendMessage;

window.addEmoji =
  addEmoji;

window.goHome =
  goHome;

window.goBack =
  goBack;

window.renderLessons =
  renderLessons;

window.filterLessons =
  filterLessons;

window.openLesson =
  openLesson;

window.completeLesson =
  completeLesson;

window.toggleSavedLesson =
  toggleSavedLesson;

window.startQuiz =
  startQuiz;

window.answerQuiz =
  answerQuiz;

window.checkQuiz =
  checkQuiz;

window.finishQuiz =
  finishQuiz;

window.openAITeacher =
  openAITeacher;

window.teacherAIHelp =
  teacherAIHelp;

window.askAITeacher =
  askAITeacher;

window.askAIQuick =
  askAIQuick;

window.mysteryTopic =
  mysteryTopic;

window.renderBadges =
  renderBadges;

window.renderShop =
  renderShop;

window.buyShopItem =
  buyShopItem;

window.updateProfile =
  updateProfile;

window.toggleTheme =
  toggleTheme;

window.showContinent =
  showContinent;

window.logout =
  logout;
