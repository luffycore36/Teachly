const API_URL = "https://teachly-nmxh.onrender.com";

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
  theme: "light",
  avatar: "",
  badges: [],
  ownedEffects: [],
  equippedEffect: ""
};

let people = [];


/* =========================================================
   BASIC HELPERS
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
  const old = document.querySelector(".teachly-toast");

  if (old) {
    old.remove();
  }

  const toast = document.createElement("div");

  toast.className = "teachly-toast";
  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.bottom = "25px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.zIndex = "99999";
  toast.style.padding = "13px 20px";
  toast.style.borderRadius = "12px";
  toast.style.background = "#111";
  toast.style.color = "#fff";
  toast.style.fontWeight = "600";
  toast.style.boxShadow = "0 8px 30px rgba(0,0,0,.2)";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}


async function readJSONResponse(response) {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();

  throw new Error(
    `Server returned HTML instead of JSON (${response.status}). ${text.slice(0, 200)}`
  );
}


async function apiFetch(endpoint, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  const data = await readJSONResponse(response);

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
      localStorage.getItem("teachlyState");

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

    if (!state.quizScores || typeof state.quizScores !== "object") {
      state.quizScores = {};
    }

    if (!Array.isArray(state.badges)) {
      state.badges = [];
    }

  } catch (error) {
    console.error(
      "Could not load saved state:",
      error
    );
  }
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(pageId) {
  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove("active");
    });

  const page =
    document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (pageId === "homePage") {
    updateHome();
  }

  if (pageId === "peoplePage") {
    loadPeople();
  }

  if (pageId === "aiPage") {
    renderLessons();
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
    }, 100);
  }
}


/* =========================================================
   START SCREEN
========================================================= */

function startTeachly() {
  const input =
    document.getElementById("usernameInput");

  if (!input) {
    return;
  }

  const name =
    input.value.trim();

  if (!name) {
    showToast("Please enter your username.");
    return;
  }

  state.name = name;
  state.loggedIn = true;

  save();

  const welcome =
    document.getElementById("welcomeText");

  if (welcome) {
    welcome.textContent =
      `Welcome, ${state.name}!`;
  }

  updateHome();
  openPage("homePage");
}


/* =========================================================
   HOME
========================================================= */

function updateHome() {
  const username =
    document.getElementById("homeUsername");

  if (username) {
    username.textContent =
      state.name || "Learner";
  }

  const welcome =
    document.getElementById("welcomeText");

  if (welcome && state.name) {
    welcome.textContent =
      `Welcome, ${state.name}!`;
  }

  const coinElements =
    document.querySelectorAll(
      "#coinCount, .coinCount, #homeCoins, #shopCoins"
    );

  coinElements.forEach(element => {
    element.textContent =
      state.coins || 0;
  });

  const sessionElements =
    document.querySelectorAll(
      "#sessionCount, .sessionCount"
    );

  sessionElements.forEach(element => {
    element.textContent =
      state.sessions || 0;
  });

  const progress =
    document.getElementById("overallProgress");

  if (progress) {
    const total =
      lessons.length;

    const completed =
      Array.isArray(state.completedLessons)
        ? state.completedLessons.length
        : 0;

    const percentage =
      total
        ? Math.round((completed / total) * 100)
        : 0;

    progress.style.width =
      `${percentage}%`;
  }

  updateBadges();
}


/* =========================================================
   ROLE SELECTION
========================================================= */

function chooseRole(role) {
  currentRole = role;

  openPage("searchPage");

  const title =
    document.getElementById("searchTitle");

  const text =
    document.getElementById("searchText");

  if (role === "learner") {
    if (title) {
      title.textContent =
        "Finding a teacher...";
    }

    if (text) {
      text.textContent =
        "Looking for a real registered teacher volunteer.";
    }
  } else {
    if (title) {
      title.textContent =
        "Finding a learner...";
    }

    if (text) {
      text.textContent =
        "Looking for a real registered learner volunteer.";
    }
  }

  setTimeout(
    findRealPerson,
    1200
  );
}


async function findRealPerson() {
  try {
    const data =
      await apiFetch("/api/people");

    const users =
      Array.isArray(data.people)
        ? data.people
        : [];

    const currentUsername =
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

        const username =
          String(user.username)
            .trim()
            .toLowerCase();

        return (
          username !== currentUsername &&
          user.role === wantedRole
        );
      });

    if (!matches.length) {
      if (currentRole === "learner") {
        showToast(
          "No registered teacher volunteer is available."
        );

        setTimeout(() => {
          const useAI =
            confirm(
              "No registered teacher volunteer is available.\n\nWould you like to learn with the AI Teacher instead?"
            );

          if (useAI) {
            openAITeacher();
          } else {
            goHome();
          }
        }, 500);

      } else {
        showToast(
          "No registered learner volunteer is available."
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

    state.sessions =
      (state.sessions || 0) + 1;

    save();

    openChat(
      person.username
    );

  } catch (error) {
    console.error(
      "MATCHING ERROR:",
      error
    );

    showToast(
      "Could not check registered users right now."
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
    document.getElementById("peopleList");

  if (!box) {
    return;
  }

  box.innerHTML = `
    <div class="person">
      <p>Loading real registered Teachly users...</p>
    </div>
  `;

  try {
    const data =
      await apiFetch("/api/people");

    people =
      Array.isArray(data.people)
        ? data.people
        : [];

    const currentUsername =
      String(state.name || "")
        .trim()
        .toLowerCase();

    const visiblePeople =
      people.filter(person => {
        if (!person.username) {
          return false;
        }

        return (
          String(person.username)
            .trim()
            .toLowerCase() !==
          currentUsername
        );
      });

    if (!visiblePeople.length) {
      box.innerHTML = `
        <div class="person">
          <div>
            <h3>No other registered users yet.</h3>
            <p>
              When another verified Teachly user registers,
              they will appear here.
            </p>
          </div>
        </div>
      `;

      return;
    }

    box.innerHTML =
      visiblePeople
        .map(person => `
          <div class="person">

            <div>
              <div style="font-size:35px">
                👤
              </div>

              <h3>
                ${escapeHTML(person.username)}
              </h3>

              <p>
                ${
                  person.role
                    ? `Role: ${escapeHTML(person.role)}`
                    : "Verified Teachly user"
                }
              </p>
            </div>

            <button
              onclick="connectPerson(${JSON.stringify(person.username)})"
            >
              Connect
            </button>

          </div>
        `)
        .join("");

  } catch (error) {
    console.error(
      "PEOPLE ERROR:",
      error
    );

    box.innerHTML = `
      <div class="person">
        <div>
          <h3>Unable to load people</h3>
          <p>Please try again later.</p>
        </div>
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

  state.sessions =
    (state.sessions || 0) + 1;

  save();

  openChat(username);
}


/* =========================================================
   CHAT
========================================================= */

function openChat(person) {
  currentPerson =
    person;

  const title =
    document.getElementById("chatTitle");

  if (title) {
    title.textContent =
      person;
  }

  openPage("chatPage");
}


function sendMessage() {
  const input =
    document.getElementById("messageInput");

  const messages =
    document.getElementById("chatMessages");

  if (!input || !messages) {
    return;
  }

  const text =
    input.value.trim();

  if (!text) {
    return;
  }

  const userMessage =
    document.createElement("div");

  userMessage.className =
    "message me";

  userMessage.textContent =
    text;

  messages.appendChild(
    userMessage
  );

  input.value = "";

  messages.scrollTop =
    messages.scrollHeight;

  /*
   * The current HTML/JS version does not
   * establish a Socket.IO browser connection,
   * so keep this local fallback rather than
   * pretending the message was delivered.
   */

  setTimeout(() => {
    const reply =
      document.createElement("div");

    reply.className =
      "message";

    reply.textContent =
      `${currentPerson || "Your Teachly connection"} is not connected to the live session yet.`;

    messages.appendChild(reply);

    messages.scrollTop =
      messages.scrollHeight;

  }, 500);
}


/* =========================================================
   EMOJI
========================================================= */

function addEmoji(emoji) {
  const input =
    document.getElementById("messageInput");

  if (!input) {
    return;
  }

  input.value += emoji;
  input.focus();
}


/* =========================================================
   LESSON DATA
========================================================= */

const lessons = [

  {
    id: "math-algebra",
    title: "Introduction to Algebra",
    category: "Mathematics",
    icon: "📐",
    description:
      "Learn variables, expressions and simple equations.",
    content:
      "Algebra uses letters and symbols to represent unknown values. A variable is a letter such as x. An expression combines numbers, variables and operations. An equation states that two expressions are equal."
  },

  {
    id: "math-fractions",
    title: "Fractions",
    category: "Mathematics",
    icon: "➗",
    description:
      "Understand numerators, denominators and fraction operations.",
    content:
      "A fraction represents part of a whole. The numerator is the top number and the denominator is the bottom number. Equivalent fractions represent the same value."
  },

  {
    id: "science-cells",
    title: "Cells",
    category: "Science",
    icon: "🔬",
    description:
      "Learn the basic structure and function of cells.",
    content:
      "Cells are the basic units of living organisms. Plant and animal cells contain structures such as the nucleus, cell membrane and cytoplasm. Plant cells also have a cell wall, chloroplasts and a large central vacuole."
  },

  {
    id: "science-solar",
    title: "The Solar System",
    category: "Science",
    icon: "🌎",
    description:
      "Explore planets and other objects in our solar system.",
    content:
      "The Solar System contains the Sun and objects that orbit it, including planets, dwarf planets, moons, asteroids and comets. The eight planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune."
  },

  {
    id: "english-grammar",
    title: "English Grammar",
    category: "English",
    icon: "📚",
    description:
      "Learn the basics of nouns, verbs and sentence structure.",
    content:
      "A noun names a person, place, thing or idea. A verb describes an action or state. A complete sentence normally expresses a complete thought and includes a subject and predicate."
  },

  {
    id: "history-civilizations",
    title: "Ancient Civilizations",
    category: "History",
    icon: "🏛️",
    description:
      "Discover how early civilizations developed.",
    content:
      "Ancient civilizations developed organized societies, agriculture, governments, writing systems and trade networks. Important early civilizations developed in regions such as Mesopotamia, Egypt, the Indus Valley and China."
  }

];


/* =========================================================
   LESSON LIBRARY
========================================================= */

function renderLessons() {
  const container =
    document.getElementById("lessonGrid");

  if (!container) {
    return;
  }

  const count =
    document.getElementById("lessonCount");

  if (count) {
    count.textContent =
      lessons.length;
  }

  let filtered =
    lessons;

  if (currentCategory !== "All") {
    filtered =
      lessons.filter(
        lesson =>
          lesson.category ===
          currentCategory
      );
  }

  if (!filtered.length) {
    container.innerHTML = `
      <div class="lessonCard">
        <h3>No lessons found</h3>
        <p>Try another category.</p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    filtered
      .map(lesson => `
        <div
          class="lessonCard"
          onclick="openLesson('${lesson.id}')"
        >

          <div class="lessonIcon">
            ${lesson.icon}
          </div>

          <h3>
            ${escapeHTML(lesson.title)}
          </h3>

          <p>
            ${escapeHTML(lesson.description)}
          </p>

          <span class="lessonMiniTag">
            ${escapeHTML(lesson.category)}
          </span>

        </div>
      `)
      .join("");
}


function filterLessons(category) {
  currentCategory =
    category || "All";

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
          .trim()
          .toLowerCase() ===
        currentCategory.toLowerCase()
      ) {
        button.classList.add(
          "active"
        );
      }
    });

  renderLessons();
}


/* =========================================================
   OPEN SELECTED LESSON
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
    document.getElementById(
      "selectedLessonTitle"
    );

  const category =
    document.getElementById(
      "selectedLessonCategory"
    );

  const description =
    document.getElementById(
      "selectedLessonDescription"
    );

  const content =
    document.getElementById(
      "selectedLessonContent"
    );

  if (title) {
    title.textContent =
      selectedLesson.title;
  }

  if (category) {
    category.textContent =
      selectedLesson.category;
  }

  if (description) {
    description.textContent =
      selectedLesson.description;
  }

  if (content) {
    content.textContent =
      selectedLesson.content;
  }

  openPage("selectedLessonPage");

  updateLessonButtons();
}


function updateLessonButtons() {
  const saveButton =
    document.getElementById(
      "saveLessonButton"
    );

  if (!saveButton || !selectedLesson) {
    return;
  }

  const saved =
    state.savedLessons.includes(
      selectedLesson.id
    );

  saveButton.textContent =
    saved
      ? "★ Saved"
      : "☆ Save Lesson";
}


/* =========================================================
   COMPLETE LESSON
========================================================= */

function completeLesson() {
  if (!selectedLesson) {
    showToast(
      "Please choose a lesson first."
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

    state.coins =
      (state.coins || 0) + 10;

    save();

    showToast(
      "Lesson completed! +10 💰"
    );

    updateHome();

    updateBadges();

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

  updateLessonButtons();
}


/* =========================================================
   QUIZ
========================================================= */

let currentQuizIndex = 0;
let quizScore = 0;


function startQuiz() {
  if (!selectedLesson) {
    showToast(
      "Please choose a lesson first."
    );

    return;
  }

  currentQuizIndex = 0;
  quizScore = 0;

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
    result.textContent = "";
  }

  openPage("quizPage");

  renderQuizQuestion();
}


function getQuizQuestions() {
  if (!selectedLesson) {
    return [];
  }

  if (
    selectedLesson.category ===
    "Mathematics"
  ) {
    return [

      {
        question:
          "What is a variable?",
        options: [
          "A letter representing a value",
          "Only a multiplication sign",
          "A type of fraction",
          "A punctuation mark"
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
          "Which symbol usually represents an unknown value?",
        options: [
          "x",
          ".",
          ",",
          "!"
        ],
        answer: 0
      }

    ];
  }

  if (
    selectedLesson.category ===
    "Science"
  ) {
    return [

      {
        question:
          "What is the basic unit of life?",
        options: [
          "Cell",
          "Planet",
          "Atom",
          "Rock"
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
          "Cell wall",
          "Vacuole",
          "Cytoplasm"
        ],
        answer: 0
      }

    ];
  }

  if (
    selectedLesson.category ===
    "English"
  ) {
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
          "Which word is usually a verb?",
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
          "Which sentence is complete?",
        options: [
          "Running quickly.",
          "The student reads.",
          "Because the.",
          "Very happy."
        ],
        answer: 1
      }

    ];
  }

  return [

    {
      question:
        "What does history study?",
      options: [
        "Past events",
        "Only mathematics",
        "Only planets",
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
        "They predict every future event",
        "They replace mathematics",
        "They control the weather"
      ],
      answer: 0
    }

  ];
}


function renderQuizQuestion() {
  const questions =
    getQuizQuestions();

  const question =
    questions[currentQuizIndex];

  const questionBox =
    document.getElementById(
      "quizQuestion"
    );

  const answerBox =
    document.getElementById(
      "quizAnswer"
    );

  const optionsBox =
    document.getElementById(
      "quizOptions"
    );

  if (!question) {
    finishQuiz();
    return;
  }

  if (questionBox) {
    questionBox.textContent =
      question.question;
  }

  if (answerBox) {
    answerBox.value = "";
    answerBox.style.display =
      "none";
  }

  if (optionsBox) {
    optionsBox.innerHTML =
      question.options
        .map(
          (option, index) => `
            <button
              onclick="answerQuiz(${index})"
            >
              ${escapeHTML(option)}
            </button>
          `
        )
        .join("");
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


/*
 * Compatibility with the current HTML.
 * The HTML has checkQuiz(), while the
 * lesson quiz uses multiple choice.
 */

function checkQuiz() {
  const options =
    document.querySelectorAll(
      "#quizOptions button"
    );

  if (options.length) {
    showToast(
      "Choose one of the answer buttons."
    );

    return;
  }

  answerQuiz(0);
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

  state.coins =
    (state.coins || 0) +
    quizScore * 5;

  save();

  const result =
    document.getElementById(
      "quizResult"
    );

  if (result) {
    result.textContent =
      `You scored ${quizScore}/${questions.length}. You earned ${quizScore * 5} 💰.`;
  }

  updateHome();
  updateBadges();
}


/* =========================================================
   AI TEACHER
========================================================= */

function openAITeacher() {
  openPage("aiPage");

  const title =
    document.getElementById(
      "selectedLessonTitle"
    );

  if (
    selectedLesson &&
    title
  ) {
    title.textContent =
      selectedLesson.title;
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
      "Please enter a question."
    );

    return;
  }

  input.value = "";

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
                selectedLesson || {
                  title:
                    "General learning",

                  category:
                    "General",

                  description:
                    "",

                  content:
                    ""
                }
            })
        }
      );

    loading.textContent =
      data.answer ||
      "I couldn't generate an answer right now.";

  } catch (error) {
    console.error(
      "AI ERROR:",
      error
    );

    loading.textContent =
      `Sorry, I couldn't reach the AI right now. ${error.message || ""}`;
  }

  chat.scrollTop =
    chat.scrollHeight;
}


/* =========================================================
   QUIZ PAGE AI TEACHER
========================================================= */

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
      "Please enter a question."
    );

    return;
  }

  input.value = "";

  const userBubble =
    document.createElement(
      "div"
    );

  userBubble.className =
    "aiBubble userBubble";

  userBubble.innerHTML =
    `<strong>You</strong><p>${escapeHTML(question)}</p>`;

  messages.appendChild(
    userBubble
  );

  const thinking =
    document.createElement(
      "div"
    );

  thinking.className =
    "aiBubble aiThinking";

  thinking.innerHTML =
    `<strong>AI Teacher</strong><p>Thinking...</p>`;

  messages.appendChild(
    thinking
  );

  messages.scrollTop =
    messages.scrollHeight;

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
              message: question,

              lesson:
                selectedLesson || {
                  title:
                    "General learning",

                  category:
                    "General",

                  description:
                    "",

                  content:
                    ""
                }
            })
        }
      );

    thinking.innerHTML =
      `<strong>AI Teacher</strong><p>${escapeHTML(data.answer || "I couldn't answer that.")}</p>`;

  } catch (error) {
    console.error(
      "AI TEACHER ERROR:",
      error
    );

    thinking.innerHTML =
      `<strong>AI Teacher</strong><p>Sorry, I couldn't reach the AI right now.</p>`;
  }

  messages.scrollTop =
    messages.scrollHeight;
}


/* =========================================================
   MYSTERY TOPIC
========================================================= */

const mysteryTopics = [
  {
    title: "Why is the sky blue?",
    text:
      "Sunlight contains many colors. Earth's atmosphere scatters shorter blue wavelengths more strongly, making the sky appear blue during the day."
  },
  {
    title: "How do airplanes fly?",
    text:
      "An airplane's wings interact with moving air to produce lift while the engines provide thrust. The shape and angle of the wings help create the pressure and airflow needed for flight."
  },
  {
    title: "How does a rainbow form?",
    text:
      "A rainbow forms when sunlight enters water droplets, where it is refracted, internally reflected and separated into different colors."
  },
  {
    title: "Why do we have seasons?",
    text:
      "Earth's axis is tilted. As Earth travels around the Sun, this tilt changes how directly sunlight reaches different parts of Earth during the year."
  },
  {
    title: "How do plants make food?",
    text:
      "Plants use photosynthesis to convert light energy into chemical energy. They use carbon dioxide and water to produce sugars, with oxygen released as a by-product."
  }
];


function mysteryTopic() {
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
      topic.title;
  }

  if (text) {
    text.textContent =
      topic.text;
  }

  openPage("mysteryPage");
}


/* =========================================================
   BADGES
========================================================= */

const badgeDefinitions = [
  {
    id: "first-lesson",
    icon: "🌱",
    title: "First Step",
    description: "Complete your first lesson."
  },
  {
    id: "five-lessons",
    icon: "📚",
    title: "Bookworm",
    description: "Complete five lessons."
  },
  {
    id: "quiz-master",
    icon: "🏆",
    title: "Quiz Master",
    description: "Score full marks on a quiz."
  },
  {
    id: "social",
    icon: "🤝",
    title: "Connector",
    description: "Start a Teachly connection."
  }
];


function updateBadges() {
  const unlocked = [];

  if (
    state.completedLessons.length >= 1
  ) {
    unlocked.push(
      "first-lesson"
    );
  }

  if (
    state.completedLessons.length >= 5
  ) {
    unlocked.push(
      "five-lessons"
    );
  }

  const perfectQuiz =
    Object.values(
      state.quizScores || {}
    ).some(
      score =>
        score === 3
    );

  if (perfectQuiz) {
    unlocked.push(
      "quiz-master"
    );
  }

  if (
    (state.sessions || 0) >= 1
  ) {
    unlocked.push(
      "social"
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
    badgeDefinitions
      .map(badge => {
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
      })
      .join("");
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
      "A special profile effect."
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
      "Show off your learning achievement."
  }
];


function renderShop() {
  const container =
    document.getElementById(
      "shopList"
    );

  if (!container) {
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

  container.innerHTML =
    shopProducts
      .map(product => {
        const owned =
          state.ownedEffects.includes(
            product.id
          );

        const enough =
          (state.coins || 0) >=
          product.price;

        return `
          <div class="shopItem">

            <div style="font-size:45px">
              ${product.icon}
            </div>

            <h3>
              ${product.name}
            </h3>

            <p>
              ${product.description}
            </p>

            <div class="price">
              💰 ${product.price}
            </div>

            <button
              onclick="buyShopItem('${product.id}')"
              class="${
                !owned && !enough
                  ? "notEnough"
                  : ""
              }"
            >
              ${
                owned
                  ? "Equip"
                  : enough
                    ? "Buy"
                    : "Not enough 💰"
              }
            </button>

          </div>
        `;
      })
      .join("");
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

    renderShop();

    return;
  }

  if (
    (state.coins || 0) <
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

  showToast(
    `${product.name} purchased!`
  );

  renderShop();
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

  const avatar =
    document.getElementById(
      "profileAvatar"
    );

  if (avatar) {
    if (state.avatar) {
      avatar.textContent = "";
      avatar.style.backgroundImage =
        `url(${state.avatar})`;
      avatar.style.backgroundSize =
        "cover";
      avatar.style.backgroundPosition =
        "center";
    } else {
      avatar.textContent =
        "👤";
    }
  }

  const profileCoins =
    document.getElementById(
      "profileCoins"
    );

  if (profileCoins) {
    profileCoins.textContent =
      state.coins || 0;
  }

  const profileSessions =
    document.getElementById(
      "profileSessions"
    );

  if (profileSessions) {
    profileSessions.textContent =
      state.sessions || 0;
  }

  const profileLessons =
    document.getElementById(
      "profileLessons"
    );

  if (profileLessons) {
    profileLessons.textContent =
      state.completedLessons.length;
  }
}


/* =========================================================
   THEME
========================================================= */

function toggleTheme() {
  state.theme =
    state.theme === "dark"
      ? "light"
      : "dark";

  applyTheme();
  save();
}


function applyTheme() {
  document.body.classList.toggle(
    "dark",
    state.theme === "dark"
  );
}


/* =========================================================
   MAP
========================================================= */

let worldMap = null;


const countryData = {
  India: {
    title: "India 🇮🇳",
    text:
      "India is a country in South Asia with a long history, many languages and diverse cultures."
  },

  UnitedStates: {
    title: "United States 🇺🇸",
    text:
      "The United States is a country in North America made up of 50 states."
  },

  UnitedKingdom: {
    title: "United Kingdom 🇬🇧",
    text:
      "The United Kingdom consists of England, Scotland, Wales and Northern Ireland."
  },

  Japan: {
    title: "Japan 🇯🇵",
    text:
      "Japan is an island country in East Asia known for its history, technology and rich culture."
  },

  Australia: {
    title: "Australia 🇦🇺",
    text:
      "Australia is both a country and a continent located in the Southern Hemisphere."
  }
};


function initializeMap() {
  const mapElement =
    document.getElementById(
      "worldMap"
    );

  if (!mapElement) {
    return;
  }

  if (
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


function showCountry(country) {
  const info =
    document.getElementById(
      "countryInfo"
    );

  const data =
    countryData[country];

  if (!info || !data) {
    return;
  }

  info.innerHTML = `
    <h2>
      ${escapeHTML(data.title)}
    </h2>

    <p>
      ${escapeHTML(data.text)}
    </p>
  `;

  if (
    worldMap
  ) {
    const locations = {
      India: [20.5937, 78.9629],
      UnitedStates: [39.8283, -98.5795],
      UnitedKingdom: [55.3781, -3.4360],
      Japan: [36.2048, 138.2529],
      Australia: [-25.2744, 133.7751]
    };

    if (locations[country]) {
      worldMap.setView(
        locations[country],
        4
      );
    }
  }
}


/* =========================================================
   GO HOME / BACK
========================================================= */

function goHome() {
  openPage("homePage");
  updateHome();
}


function goBack() {
  goHome();
}


/* =========================================================
   SIMPLE SEARCH
========================================================= */

function searchLessons() {
  const input =
    document.getElementById(
      "lessonSearch"
    );

  if (!input) {
    return;
  }

  const query =
    input.value
      .trim()
      .toLowerCase();

  const container =
    document.getElementById(
      "lessonGrid"
    );

  if (!container) {
    return;
  }

  const filtered =
    lessons.filter(
      lesson =>
        lesson.title
          .toLowerCase()
          .includes(query) ||

        lesson.category
          .toLowerCase()
          .includes(query) ||

        lesson.description
          .toLowerCase()
          .includes(query)
    );

  if (!filtered.length) {
    container.innerHTML = `
      <div class="lessonCard">
        <h3>No lessons found</h3>
        <p>Try another search.</p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    filtered
      .map(lesson => `
        <div
          class="lessonCard"
          onclick="openLesson('${lesson.id}')"
        >

          <div class="lessonIcon">
            ${lesson.icon}
          </div>

          <h3>
            ${escapeHTML(lesson.title)}
          </h3>

          <p>
            ${escapeHTML(lesson.description)}
          </p>

          <span class="lessonMiniTag">
            ${escapeHTML(lesson.category)}
          </span>

        </div>
      `)
      .join("");
}


/* =========================================================
   LOGIN / SIGNUP COMPATIBILITY
========================================================= */

function showLogin() {
  showToast(
    "This Teachly version uses the username start screen."
  );
}


function showSignup() {
  showToast(
    "Create your Teachly account through the backend authentication flow."
  );
}


function logout() {
  state.loggedIn = false;
  state.token = "";
  state.name = "";

  save();

  const input =
    document.getElementById(
      "usernameInput"
    );

  if (input) {
    input.value = "";
  }

  const namePage =
    document.getElementById(
      "namePage"
    );

  if (namePage) {
    openPage("namePage");
  } else {
    location.reload();
  }
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    load();

    applyTheme();

    updateHome();

    renderLessons();

    renderBadges();

    renderShop();

    updateProfile();

    /*
     * Current index.html starts at namePage.
     * Do not try to open nonexistent loginPage
     * or signupPage.
     */

    if (state.loggedIn && state.name) {
      openPage("homePage");
    } else {
      openPage("namePage");
    }

  }
);


/* =========================================================
   ENTER KEY HANDLING
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      const target =
        event.target;

      if (
        target &&
        target.id ===
        "usernameInput"
      ) {
        event.preventDefault();
        startTeachly();
      }

      if (
        target &&
        target.id ===
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

      const searchPage =
        document.getElementById(
          "searchPage"
        );

      if (
        searchPage &&
        searchPage.classList.contains(
          "active"
        )
      ) {
        goHome();
      }

    }

  }
);


/* =========================================================
   STORAGE SYNC
========================================================= */

window.addEventListener(
  "storage",
  () => {
    load();
    applyTheme();
    updateHome();
  }
);


/* =========================================================
   EXPOSE FUNCTIONS USED BY HTML
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

window.openLesson =
  openLesson;

window.filterLessons =
  filterLessons;

window.searchLessons =
  searchLessons;

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

window.askAIQuick =
  askAIQuick;

window.askAITeacher =
  askAITeacher;

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

window.showCountry =
  showCountry;

window.showLogin =
  showLogin;

window.showSignup =
  showSignup;

window.logout =
  logout;
