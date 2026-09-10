const API_URL = "https://teachly-nmxh.onrender.com";

let currentRole = "";
let currentPerson = "";
let selectedLesson = null;

let state = {
  name: "",
  loggedIn: false,
  sessions: 0,
  coins: 0,
  completedLessons: [],
  lessonProgress: {},
  quizScores: {},
  savedLessons: [],
  theme: "light"
};

let people = [];


/* =========================
   BASIC HELPERS
========================= */

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


/* =========================
   API RESPONSE HELPER
========================= */

async function readAIResponse(response) {

  const contentType =
    response.headers.get("content-type") || "";

  if (!response.ok) {

    if (contentType.includes("application/json")) {

      const data = await response.json();

      throw new Error(
        data.error || `Server error ${response.status}`
      );
    }

    const text = await response.text();

    throw new Error(
      `Server returned HTML instead of JSON (${response.status}). ${text.slice(0, 200)}`
    );
  }

  if (!contentType.includes("application/json")) {

    const text = await response.text();

    throw new Error(
      `Expected JSON but received HTML. ${text.slice(0, 200)}`
    );
  }

  return response.json();
}


/* =========================
   STORAGE
========================= */

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

    if (saved) {

      const parsed =
        JSON.parse(saved);

      state = {
        ...state,
        ...parsed
      };
    }

  } catch (error) {

    console.error(
      "Could not load saved state:",
      error
    );
  }
}


/* =========================
   PAGE NAVIGATION
========================= */

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

  if (pageId === "peoplePage") {

    loadPeople();
  }

  if (pageId === "homePage") {

    updateHome();
  }

  if (pageId === "libraryPage") {

    renderLessons();
  }
}


/* =========================
   HOME
========================= */

function updateHome() {

  const username =
    document.getElementById("homeUsername");

  if (username) {

    username.textContent =
      state.name || "Learner";
  }


  const coins =
    document.querySelectorAll(
      "#coinCount, .coinCount"
    );

  coins.forEach(element => {

    element.textContent =
      state.coins || 0;
  });


  const sessions =
    document.querySelectorAll(
      "#sessionCount, .sessionCount"
    );

  sessions.forEach(element => {

    element.textContent =
      state.sessions || 0;
  });


  const progress =
    document.getElementById("overallProgress");

  if (progress) {

    const total =
      typeof lessons !== "undefined"
        ? lessons.length
        : 0;

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
}


/* =========================
   AUTH
========================= */

function showLogin() {

  openPage("loginPage");
}


function showSignup() {

  openPage("signupPage");
}


async function login() {

  const usernameInput =
    document.getElementById("loginUsername");

  const passwordInput =
    document.getElementById("loginPassword");

  if (!usernameInput || !passwordInput) {

    return;
  }

  const username =
    usernameInput.value.trim();

  const password =
    passwordInput.value;

  if (!username || !password) {

    showToast(
      "Please enter your username and password."
    );

    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/api/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            username,
            password
          })
        }
      );


    const data =
      await readAIResponse(response);


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Login failed."
      );
    }


    state.name =
      data.user?.username ||
      username;

    state.loggedIn = true;

    save();

    showToast(
      "Login successful!"
    );

    openPage("homePage");

    updateHome();

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    showToast(
      error.message ||
      "Could not log in."
    );
  }
}


async function signup() {

  const usernameInput =
    document.getElementById("signupUsername");

  const passwordInput =
    document.getElementById("signupPassword");

  const roleInput =
    document.getElementById("signupRole");


  if (
    !usernameInput ||
    !passwordInput
  ) {

    return;
  }


  const username =
    usernameInput.value.trim();

  const password =
    passwordInput.value;

  const role =
    roleInput
      ? roleInput.value
      : "learner";


  if (!username || !password) {

    showToast(
      "Please complete all required fields."
    );

    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/api/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            username,
            password,
            role
          })
        }
      );


    const data =
      await readAIResponse(response);


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Registration failed."
      );
    }


    state.name =
      data.user?.username ||
      username;

    state.loggedIn = true;

    save();


    showToast(
      "Account created successfully!"
    );

    openPage("homePage");

    updateHome();

  } catch (error) {

    console.error(
      "SIGNUP ERROR:",
      error
    );

    showToast(
      error.message ||
      "Could not create account."
    );
  }
}


function logout() {

  state.loggedIn = false;
  state.name = "";

  save();

  openPage("loginPage");

  showToast(
    "You have been logged out."
  );
}


/* =========================
   MATCHING / PEOPLE
========================= */

async function chooseRole(role) {

  currentRole = role;

  openPage("searchPage");


  if (role === "learner") {

    document.getElementById(
      "searchTitle"
    ).textContent =
      "Finding a teacher...";

    document.getElementById(
      "searchText"
    ).textContent =
      "Looking for a real registered teacher volunteer";

  } else {

    document.getElementById(
      "searchTitle"
    ).textContent =
      "Finding a learner...";

    document.getElementById(
      "searchText"
    ).textContent =
      "Looking for a real registered learner volunteer";
  }


  setTimeout(async () => {

    try {

      const response =
        await fetch(
          `${API_URL}/api/people`
        );


      const data =
        await readAIResponse(response);


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Unable to find users."
        );
      }


      const users =
        Array.isArray(data.people)
          ? data.people
          : [];


      const currentUsername =
        String(
          state.name || ""
        )
          .trim()
          .toLowerCase();


      let matches =
        users.filter(user =>

          user.username &&

          String(
            user.username
          )
            .trim()
            .toLowerCase() !==
            currentUsername &&

          user.role ===
            (
              role === "learner"
                ? "teacher"
                : "learner"
            )
        );


      /*
       * Only use real registered users.
       * Never create or use fake users.
       */

      if (!matches.length) {

        if (role === "learner") {

          showToast(
            "No registered teacher volunteer is available."
          );


          setTimeout(() => {

            const useAI =
              confirm(
                "No registered teacher volunteer is available.\n\nDo you want AI to teach you?"
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
        `${person.username} • ${person.role || "Teachly user"}`;


      state.sessions++;

      save();

      openChat(
        currentPerson
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

  }, 1800);
}


/* =========================
   PEOPLE PAGE
========================= */

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
      <p>Loading real registered Teachly users...</p>
    </div>
  `;


  try {

    const response =
      await fetch(
        `${API_URL}/api/people`
      );


    const data =
      await readAIResponse(response);


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Unable to load users."
      );
    }


    people =
      Array.isArray(data.people)
        ? data.people
        : [];


    const currentUsername =
      String(
        state.name || ""
      )
        .trim()
        .toLowerCase();


    const visiblePeople =
      people.filter(person =>

        person.username &&

        String(
          person.username
        )
          .trim()
          .toLowerCase() !==
          currentUsername
      );


    if (!visiblePeople.length) {

      box.innerHTML = `
        <div class="person">
          <h3>No other registered users yet.</h3>
          <p>When another verified Teachly user registers, they will appear here.</p>
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
            ${escapeHTML(
              person.username
            )}
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
        <h3>Unable to load people</h3>
        <p>Please try again later.</p>
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

  openChat(
    username
  );
}


/* =========================
   CHAT
========================= */

function openChat(person) {

  currentPerson =
    person;


  const title =
    document.getElementById(
      "chatPerson"
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
      "chatInput"
    );


  const messages =
    document.getElementById(
      "chatMessages"
    );


  if (
    !input ||
    !messages
  ) {

    return;
  }


  const text =
    input.value.trim();


  if (!text) {

    return;
  }


  const userMessage =
    document.createElement(
      "div"
    );


  userMessage.className =
    "message userMessage";


  userMessage.textContent =
    text;


  messages.appendChild(
    userMessage
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
      "message botMessage";


    reply.textContent =
      "Your message was sent. Your Teachly connection can reply when they are available.";


    messages.appendChild(
      reply
    );


    messages.scrollTop =
      messages.scrollHeight;

  }, 500);
}


/* =========================
   HOME HELPERS
========================= */

function goHome() {

  openPage(
    "homePage"
  );

  updateHome();
}


/* =========================
   LESSON DATA
========================= */

const lessons = [

  {
    id: "math-algebra",
    title: "Introduction to Algebra",
    category: "Mathematics",
    description:
      "Learn variables, expressions and simple equations.",
    content:
      "Algebra uses letters and symbols to represent unknown values. A variable is a letter such as x. An expression combines numbers, variables and operations. An equation states that two expressions are equal."
  },

  {
    id: "math-fractions",
    title: "Fractions",
    category: "Mathematics",
    description:
      "Understand numerators, denominators and fraction operations.",
    content:
      "A fraction represents part of a whole. The numerator is the top number and the denominator is the bottom number. Equivalent fractions represent the same value."
  },

  {
    id: "science-cells",
    title: "Cells",
    category: "Science",
    description:
      "Learn the basic structure and function of cells.",
    content:
      "Cells are the basic units of living organisms. Plant and animal cells contain structures such as the nucleus, cell membrane and cytoplasm. Plant cells also have a cell wall, chloroplasts and a large central vacuole."
  },

  {
    id: "science-solar",
    title: "The Solar System",
    category: "Science",
    description:
      "Explore planets and other objects in our solar system.",
    content:
      "The Solar System contains the Sun and objects that orbit it, including planets, dwarf planets, moons, asteroids and comets. The eight planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune."
  },

  {
    id: "english-grammar",
    title: "English Grammar",
    category: "English",
    description:
      "Learn the basics of nouns, verbs and sentence structure.",
    content:
      "A noun names a person, place, thing or idea. A verb describes an action or state. A complete sentence normally expresses a complete thought and includes a subject and predicate."
  },

  {
    id: "history-civilizations",
    title: "Ancient Civilizations",
    category: "History",
    description:
      "Discover how early civilizations developed.",
    content:
      "Ancient civilizations developed organized societies, agriculture, governments, writing systems and trade networks. Important early civilizations developed in regions such as Mesopotamia, Egypt, the Indus Valley and China."
  }

];


/* =========================
   LESSON LIBRARY
========================= */

function renderLessons() {

  const container =
    document.getElementById(
      "lessonList"
    );


  if (!container) {

    return;
  }


  container.innerHTML =
    lessons
      .map(lesson => `

      <div class="lessonCard">

        <div>

          <span class="lessonCategory">
            ${escapeHTML(
              lesson.category
            )}
          </span>

          <h3>
            ${escapeHTML(
              lesson.title
            )}
          </h3>

          <p>
            ${escapeHTML(
              lesson.description
            )}
          </p>

        </div>

        <button
          onclick="openLesson('${lesson.id}')"
        >
          Start Lesson
        </button>

      </div>

    `)
      .join("");
}


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
      "lessonTitle"
    );


  const category =
    document.getElementById(
      "lessonCategory"
    );


  const description =
    document.getElementById(
      "lessonDescription"
    );


  const content =
    document.getElementById(
      "lessonContent"
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


  openPage(
    "lessonPage"
  );
}


/* =========================
   LESSON PROGRESS
========================= */

function completeLesson() {

  if (!selectedLesson) {

    return;
  }


  if (
    !Array.isArray(
      state.completedLessons
    )
  ) {

    state.completedLessons =
      [];
  }


  if (
    !state.completedLessons.includes(
      selectedLesson.id
    )
  ) {

    state.completedLessons.push(
      selectedLesson.id
    );

    state.coins += 10;

    save();

    showToast(
      "Lesson completed! +10 💰"
    );

  } else {

    showToast(
      "You already completed this lesson."
    );
  }


  updateHome();
}


/* =========================
   QUIZ
========================= */

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


  openPage(
    "quizPage"
  );


  renderQuizQuestion();
}


function getQuizQuestions() {

  if (
    !selectedLesson
  ) {

    return [];
  }


  const category =
    selectedLesson.category;


  if (category === "Mathematics") {

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


  if (category === "Science") {

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
        "What does history study?",
      options: [
        "Past events",
        "Only mathematics",
        "Only planets",
        "Only weather"
      ],
      answer: 0
    }

  ];
}


function renderQuizQuestion() {

  const questions =
    getQuizQuestions();


  const question =
    questions[
      currentQuizIndex
    ];


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
    questions[
      currentQuizIndex
    ];


  if (!question) {

    return;
  }


  if (
    index ===
    question.answer
  ) {

    quizScore++;

    showToast(
      "Correct!"
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


  const result =
    document.getElementById(
      "quizResult"
    );


  if (result) {

    result.textContent =
      `You scored ${quizScore}/${questions.length}. You earned ${quizScore * 5} 💰.`;
  }


  updateHome();
}


/* =========================
   AI TEACHER
========================= */

function openAITeacher() {

  openPage(
    "aiTeacherPage"
  );


  const lessonName =
    document.getElementById(
      "aiLessonName"
    );


  if (lessonName) {

    lessonName.textContent =
      selectedLesson
        ? selectedLesson.title
        : "General learning";
  }


  const input =
    document.getElementById(
      "aiQuestion"
    );


  if (input) {

    setTimeout(() => {

      input.focus();

    }, 100);
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

    const response =
      await fetch(
        `${API_URL}/api/ai`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

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


    const data =
      await readAIResponse(
        response
      );


    if (!response.ok) {

      throw new Error(
        data.error ||
        "AI could not respond."
      );
    }


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


/* =========================
   ENTER KEY FOR AI
========================= */

function setupAIInput() {

  const input =
    document.getElementById(
      "aiQuestion"
    );


  if (!input) {

    return;
  }


  input.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        teacherAIHelp();
      }

    }
  );
}


/* =========================
   SEARCH / FILTER
========================= */

function searchLessons() {

  const input =
    document.getElementById(
      "lessonSearch"
    );


  const container =
    document.getElementById(
      "lessonList"
    );


  if (
    !input ||
    !container
  ) {

    return;
  }


  const query =
    input.value
      .trim()
      .toLowerCase();


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


  container.innerHTML =
    filtered
      .map(lesson => `

      <div class="lessonCard">

        <div>

          <span class="lessonCategory">
            ${escapeHTML(
              lesson.category
            )}
          </span>

          <h3>
            ${escapeHTML(
              lesson.title
            )}
          </h3>

          <p>
            ${escapeHTML(
              lesson.description
            )}
          </p>

        </div>

        <button
          onclick="openLesson('${lesson.id}')"
        >
          Start Lesson
        </button>

      </div>

    `)
      .join("");


  if (!filtered.length) {

    container.innerHTML = `
      <div class="lessonCard">
        <h3>No lessons found</h3>
        <p>Try another search.</p>
      </div>
    `;
  }
}


/* =========================
   SAVED LESSONS
========================= */

function toggleSavedLesson() {

  if (!selectedLesson) {

    return;
  }


  if (
    !Array.isArray(
      state.savedLessons
    )
  ) {

    state.savedLessons =
      [];
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
}


/* =========================
   THEME
========================= */

function toggleTheme() {

  state.theme =
    state.theme === "dark"
      ? "light"
      : "dark";


  document.body.classList.toggle(
    "dark",
    state.theme === "dark"
  );


  save();
}


function applyTheme() {

  document.body.classList.toggle(
    "dark",
    state.theme === "dark"
  );
}


/* =========================
   BACK BUTTON
========================= */

function goBack() {

  openPage(
    "homePage"
  );
}


/* =========================
   INITIALIZATION
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    load();

    applyTheme();

    updateHome();

    renderLessons();

    setupAIInput();


    /*
     * Make sure the app starts
     * on the correct page.
     */

    if (state.loggedIn) {

      openPage(
        "homePage"
      );

    } else {

      /*
       * Keep the existing login flow
       * if the login page exists.
       */

      const home =
        document.getElementById(
          "homePage"
        );

      const login =
        document.getElementById(
          "loginPage"
        );


      if (
        home &&
        login
      ) {

        openPage(
          "loginPage"
        );
      }
    }

  }
);


/* =========================
   GLOBAL KEYBOARD HANDLING
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
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


/* =========================
   KEEP HOME UPDATED
========================= */

window.addEventListener(
  "storage",
  () => {

    load();

    updateHome();
  }
);


/* =========================
   EXPOSE FUNCTIONS
========================= */

window.openPage =
  openPage;

window.login =
  login;

window.signup =
  signup;

window.logout =
  logout;

window.chooseRole =
  chooseRole;

window.loadPeople =
  loadPeople;

window.connectPerson =
  connectPerson;

window.sendMessage =
  sendMessage;

window.goHome =
  goHome;

window.openLesson =
  openLesson;

window.completeLesson =
  completeLesson;

window.startQuiz =
  startQuiz;

window.answerQuiz =
  answerQuiz;

window.finishQuiz =
  finishQuiz;

window.openAITeacher =
  openAITeacher;

window.teacherAIHelp =
  teacherAIHelp;

window.searchLessons =
  searchLessons;

window.toggleSavedLesson =
  toggleSavedLesson;

window.toggleTheme =
  toggleTheme;

window.goBack =
  goBack;
