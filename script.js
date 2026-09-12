/* =====================================================
   TEACHLY
   Main Frontend Controller
===================================================== */

const API_URL = "https://teachly-nmxh.onrender.com";

let currentUser = null;
let currentLesson = null;
let currentQuiz = null;
let currentCategory = "All";
let socket = null;
let map = null;
let avatarData = "";


/* =====================================================
   DATA
===================================================== */

const lessons = [
  {
    id: 1,
    title: "Fractions",
    category: "Mathematics",
    description: "Understand fractions, numerators and denominators.",
    content: `
      <h2>What is a fraction?</h2>
      <p>A fraction represents a part of a whole.</p>
      <p>For example, <strong>3/4</strong> means three parts out of four equal parts.</p>

      <h3>Numerator</h3>
      <p>The top number is the numerator. It tells us how many parts we have.</p>

      <h3>Denominator</h3>
      <p>The bottom number is the denominator. It tells us how many equal parts make the whole.</p>

      <h3>Example</h3>
      <p>If a pizza is divided into 8 equal pieces and you eat 3, you ate <strong>3/8</strong> of the pizza.</p>
    `,
    quiz: {
      question: "In the fraction 3/5, what is the denominator?",
      options: ["3", "5", "8", "2"],
      answer: 1
    }
  },

  {
    id: 2,
    title: "Algebra Basics",
    category: "Mathematics",
    description: "Learn variables, expressions and simple equations.",
    content: `
      <h2>What is algebra?</h2>
      <p>Algebra uses letters and symbols to represent unknown numbers.</p>

      <h3>Variables</h3>
      <p>A variable is a letter that represents a number.</p>

      <h3>Example</h3>
      <p>If <strong>x + 5 = 12</strong>, then x must be 7.</p>

      <h3>Remember</h3>
      <p>Whatever operation you perform on one side of an equation must also be performed on the other side.</p>
    `,
    quiz: {
      question: "If x + 5 = 12, what is x?",
      options: ["5", "6", "7", "8"],
      answer: 2
    }
  },

  {
    id: 3,
    title: "Solar System",
    category: "Science",
    description: "Explore planets and our solar system.",
    content: `
      <h2>Our Solar System</h2>
      <p>The Solar System contains the Sun and the objects that orbit it.</p>

      <h3>The planets</h3>
      <p>The eight planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune.</p>

      <h3>The Sun</h3>
      <p>The Sun is a star at the center of our Solar System.</p>

      <h3>Earth</h3>
      <p>Earth is the planet where we live and is the third planet from the Sun.</p>
    `,
    quiz: {
      question: "Which planet is third from the Sun?",
      options: ["Mars", "Earth", "Venus", "Jupiter"],
      answer: 1
    }
  },

  {
    id: 4,
    title: "Photosynthesis",
    category: "Science",
    description: "Learn how plants make their own food.",
    content: `
      <h2>Photosynthesis</h2>
      <p>Photosynthesis is the process plants use to make food using light energy.</p>

      <h3>Plants need</h3>
      <ul>
        <li>Sunlight</li>
        <li>Water</li>
        <li>Carbon dioxide</li>
      </ul>

      <h3>What is produced?</h3>
      <p>Plants produce glucose and release oxygen during photosynthesis.</p>

      <h3>Why it matters</h3>
      <p>Photosynthesis provides food for plants and contributes oxygen to the atmosphere.</p>
    `,
    quiz: {
      question: "Which gas do plants take in for photosynthesis?",
      options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
      answer: 2
    }
  },

  {
    id: 5,
    title: "Gravity",
    category: "Science",
    description: "Understand the force that attracts objects toward each other.",
    content: `
      <h2>Gravity</h2>
      <p>Gravity is a force of attraction between objects that have mass.</p>

      <h3>Earth's gravity</h3>
      <p>Earth's gravity pulls objects toward its center.</p>

      <h3>Why do things fall?</h3>
      <p>Objects near Earth are pulled downward by Earth's gravitational force.</p>

      <h3>Space</h3>
      <p>Gravity also keeps planets in orbit around stars and moons in orbit around planets.</p>
    `,
    quiz: {
      question: "What force pulls objects toward Earth?",
      options: ["Magnetism", "Gravity", "Friction", "Electricity"],
      answer: 1
    }
  },

  {
    id: 6,
    title: "World Geography",
    category: "Geography",
    description: "Discover continents, countries and our amazing planet.",
    content: `
      <h2>World Geography</h2>
      <p>Geography is the study of Earth's places, environments and people.</p>

      <h3>Continents</h3>
      <p>There are seven commonly recognized continents: Africa, Antarctica, Asia, Europe, North America, South America and Australia.</p>

      <h3>Oceans</h3>
      <p>Earth has five major oceans: Pacific, Atlantic, Indian, Southern and Arctic.</p>

      <h3>Fun fact</h3>
      <p>Earth is mostly covered by water.</p>
    `,
    quiz: {
      question: "Which is the largest continent?",
      options: ["Africa", "Europe", "Asia", "Australia"],
      answer: 2
    }
  }
];


const mysteryTopics = [
  {
    title: "Black Holes",
    description: "Explore the mysterious objects in space whose gravity is incredibly strong."
  },
  {
    title: "The Human Brain",
    description: "Discover how the brain processes information, controls the body and helps us learn."
  },
  {
    title: "Volcanoes",
    description: "Learn why volcanoes form and how Earth's interior shapes the surface."
  },
  {
    title: "Deep Ocean",
    description: "Discover strange life and extreme environments hidden beneath the ocean."
  },
  {
    title: "Ancient Egypt",
    description: "Explore one of history's most fascinating civilizations."
  },
  {
    title: "Artificial Intelligence",
    description: "Learn how computers can recognize patterns and generate useful responses."
  },
  {
    title: "Dinosaurs",
    description: "Travel back millions of years and discover Earth's prehistoric animals."
  },
  {
    title: "Lightning",
    description: "Find out how enormous electrical discharges form in thunderstorms."
  },
  {
    title: "The Moon",
    description: "Learn why the Moon has phases and how it affects Earth."
  },
  {
    title: "Ocean Currents",
    description: "Discover how huge movements of seawater influence climate and ecosystems."
  }
];


const badges = [
  {
    id: "firstLesson",
    icon: "📚",
    title: "First Lesson",
    description: "Open your first lesson.",
    check: () => getNumber("lessonsCompleted") >= 1
  },

  {
    id: "bookCollector",
    icon: "📖",
    title: "Book Collector",
    description: "Complete 3 lessons.",
    check: () => getNumber("lessonsCompleted") >= 3
  },

  {
    id: "knowledgeMaster",
    icon: "🧠",
    title: "Knowledge Master",
    description: "Complete all 6 lessons.",
    check: () => getNumber("lessonsCompleted") >= 6
  },

  {
    id: "quizBeginner",
    icon: "🎯",
    title: "Quiz Beginner",
    description: "Answer your first quiz question.",
    check: () => getNumber("quizAnswered") >= 1
  },

  {
    id: "quizExpert",
    icon: "🏆",
    title: "Quiz Expert",
    description: "Get 5 quiz answers correct.",
    check: () => getNumber("quizCorrect") >= 5
  },

  {
    id: "connector",
    icon: "🤝",
    title: "Connector",
    description: "Connect with another learner or teacher.",
    check: () => getNumber("connections") >= 1
  },

  {
    id: "lessonSaver",
    icon: "🔖",
    title: "Lesson Saver",
    description: "Save a lesson.",
    check: () => getNumber("savedLessons") >= 1
  },

  {
    id: "shopExplorer",
    icon: "🛒",
    title: "Shop Explorer",
    description: "Buy your first shop item.",
    check: () => getNumber("itemsBought") >= 1
  },

  {
    id: "mysteryExplorer",
    icon: "🎲",
    title: "Mystery Explorer",
    description: "Discover 3 mystery topics.",
    check: () => getNumber("mysteryCount") >= 3
  },

  {
    id: "legend",
    icon: "👑",
    title: "Teachly Legend",
    description: "Unlock 7 badges.",
    check: () => unlockedBadgeCount() >= 7
  }
];


const shopItems = [
  {
    id: "ring",
    icon: "💍",
    name: "Scholar Ring",
    description: "A badge of learning.",
    price: 25
  },

  {
    id: "spark",
    icon: "✨",
    name: "Knowledge Spark",
    description: "Add a little energy to your profile.",
    price: 40
  },

  {
    id: "crown",
    icon: "👑",
    name: "Scholar Crown",
    description: "For serious learners.",
    price: 100
  },

  {
    id: "purpleGlow",
    icon: "💜",
    name: "Purple Glow",
    description: "Unlock a purple profile effect.",
    price: 75
  },

  {
    id: "starEffect",
    icon: "🌟",
    name: "Star Effect",
    description: "Show off your achievements.",
    price: 120
  },

  {
    id: "rocketEffect",
    icon: "🚀",
    name: "Rocket Effect",
    description: "Learning at full speed.",
    price: 150
  },

  {
    id: "fireAura",
    icon: "🔥",
    name: "Fire Aura",
    description: "Bring some energy to your profile.",
    price: 180
  },

  {
    id: "diamondAura",
    icon: "💎",
    name: "Diamond Aura",
    description: "A premium achievement effect.",
    price: 250
  },

  {
    id: "galaxyEffect",
    icon: "🌌",
    name: "Galaxy Effect",
    description: "Explore beyond the ordinary.",
    price: 300
  },

  {
    id: "lightningAura",
    icon: "⚡",
    name: "Lightning Aura",
    description: "Fast and powerful.",
    price: 350
  },

  {
    id: "rainbowAura",
    icon: "🌈",
    name: "Rainbow Aura",
    description: "A colorful profile effect.",
    price: 500
  }
];


const countries = {
  India: {
    flag: "🇮🇳",
    capital: "New Delhi",
    continent: "Asia",
    fact: "India is one of the world's most geographically and culturally diverse countries."
  },

  Japan: {
    flag: "🇯🇵",
    capital: "Tokyo",
    continent: "Asia",
    fact: "Japan is an island country in East Asia."
  },

  "United States": {
    flag: "🇺🇸",
    capital: "Washington, D.C.",
    continent: "North America",
    fact: "The United States spans a large range of climates and landscapes."
  },

  Brazil: {
    flag: "🇧🇷",
    capital: "Brasília",
    continent: "South America",
    fact: "Brazil contains a large portion of the Amazon rainforest."
  },

  Australia: {
    flag: "🇦🇺",
    capital: "Canberra",
    continent: "Australia",
    fact: "Australia is both a country and a continent."
  },

  Egypt: {
    flag: "🇪🇬",
    capital: "Cairo",
    continent: "Africa",
    fact: "Ancient Egyptian civilization developed along the Nile River."
  },

  Antarctica: {
    flag: "🧊",
    capital: "None",
    continent: "Antarctica",
    fact: "Antarctica is Earth's coldest continent and is covered mostly by ice."
  }
};


/* =====================================================
   HELPERS
===================================================== */

function $(id) {
  return document.getElementById(id);
}


function getNumber(key) {
  return Number(localStorage.getItem("teachly_" + key) || 0);
}


function setNumber(key, value) {
  localStorage.setItem(
    "teachly_" + key,
    String(value)
  );
}


function addNumber(key, amount = 1) {
  setNumber(
    key,
    getNumber(key) + amount
  );
}


function saveUser() {
  if (!currentUser) return;

  localStorage.setItem(
    "teachly_current_user",
    JSON.stringify(currentUser)
  );
}


function loadUser() {

  try {

    const saved =
      localStorage.getItem(
        "teachly_current_user"
      );

    currentUser =
      saved
        ? JSON.parse(saved)
        : null;

  } catch {

    currentUser = null;

  }
}


function stripHTML(html) {

  const temp =
    document.createElement("div");

  temp.innerHTML = html || "";

  return temp.textContent || temp.innerText || "";

}


function escapeHTML(value) {

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function showToast(message) {

  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.teachlyToastTimer);

  window.teachlyToastTimer =
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);

}


async function safeJSON(response) {

  const type =
    response.headers.get("content-type") || "";

  if (!type.includes("application/json")) {

    const text =
      await response.text();

    throw new Error(
      "Server returned a non-JSON response."
    );

  }

  return response.json();

}


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
    $(pageId);

  if (!page) {
    console.warn(
      "Page not found:",
      pageId
    );
    return;
  }

  page.classList.add("active");

  if (pageId === "homePage") {
    updateAll();
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
    renderProfile();
  }

  if (pageId === "mapPage") {
    setTimeout(initMap, 100);
  }

}


function goHome() {
  openPage("homePage");
}


function startTeachly() {
  openPage("loginPage");
}


function continueToName() {
  startTeachly();
}


/* =====================================================
   AUTH
===================================================== */

async function registerUserAccount() {

  const username =
    $("registerUsername")?.value.trim();

  const email =
    $("registerEmail")?.value.trim();

  const password =
    $("registerPassword")?.value;

  const role =
    $("registerRole")?.value || "learner";

  const message =
    $("registerMessage");

  if (!username || !email || !password) {

    if (message) {
      message.textContent =
        "Please fill in all fields.";
    }

    return;
  }

  if (password.length < 6) {

    if (message) {
      message.textContent =
        "Password must be at least 6 characters.";
    }

    return;
  }

  try {

    if (message) {
      message.textContent =
        "Creating account...";
    }

    const response =
      await fetch(
        API_URL + "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username,
            email,
            password,
            role
          })
        }
      );

    const data =
      await safeJSON(response);

    if (!response.ok || !data.ok) {
      throw new Error(
        data.message ||
        "Registration failed."
      );
    }

    showToast(
      "Account created successfully!"
    );

    $("loginEmail").value = email;

    $("loginPassword").value = "";

    openPage("loginPage");

  } catch (error) {

    console.error(
      "REGISTER:",
      error
    );

    if (message) {
      message.textContent =
        error.message;
    }

  }

}


async function loginUser() {

  const email =
    $("loginEmail")?.value.trim();

  const password =
    $("loginPassword")?.value;

  const message =
    $("authMessage");

  if (!email || !password) {

    if (message) {
      message.textContent =
        "Enter your email and password.";
    }

    return;
  }

  try {

    if (message) {
      message.textContent =
        "Logging in...";
    }

    const response =
      await fetch(
        API_URL + "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

    const data =
      await safeJSON(response);

    if (!response.ok || !data.ok) {
      throw new Error(
        data.message ||
        "Login failed."
      );
    }

    currentUser = {
      ...data.user,
      token: data.token
    };

    saveUser();

    if (message) {
      message.textContent = "";
    }

    showToast(
      "Welcome to Teachly!"
    );

    openPage("homePage");

    connectSocket();

  } catch (error) {

    console.error(
      "LOGIN:",
      error
    );

    if (message) {
      message.textContent =
        error.message;
    }

  }

}


async function logout() {

  try {

    if (currentUser?.token) {

      await fetch(
        API_URL + "/api/auth/logout",
        {
          method: "POST",

          headers: {
            Authorization:
              "Bearer " +
              currentUser.token
          }
        }
      );

    }

  } catch {}

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentUser = null;

  localStorage.removeItem(
    "teachly_current_user"
  );

  openPage("loginPage");

  showToast(
    "Logged out."
  );

}


/* =====================================================
   HOME
===================================================== */

function updateAll() {

  loadUser();

  if ($("welcomeText")) {

    $("welcomeText").textContent =
      currentUser
        ? "Welcome, " +
          currentUser.username +
          "!"
        : "Welcome to Teachly!";

  }

  const coins =
    currentUser?.tickets ?? 0;

  if ($("homeCoins")) {
    $("homeCoins").textContent =
      coins;
  }

  if ($("shopCoins")) {
    $("shopCoins").textContent =
      coins;
  }

  renderHomeBadges();
  renderHomeShop();

}


function chooseRole(role) {

  localStorage.setItem(
    "teachly_search_role",
    role
  );

  const opposite =
    role === "teacher"
      ? "learner"
      : "teacher";

  const title =
    $("searchTitle");

  const text =
    $("searchText");

  if (title) {
    title.textContent =
      "Finding a " +
      opposite +
      "...";
  }

  if (text) {
    text.textContent =
      "Searching for someone who can help you learn.";
  }

  openPage("searchPage");

  setTimeout(
    openPeople,
    900
  );

}


/* =====================================================
   LESSONS
===================================================== */

function openLessons() {
  openPage("aiPage");
}


function renderLessonCategories() {

  const container =
    $("lessonCategories");

  if (!container) return;

  const categories = [
    "All",
    ...new Set(
      lessons.map(
        lesson => lesson.category
      )
    )
  ];

  container.innerHTML =
    categories
      .map(category => `
        <button
          class="${
            currentCategory === category
              ? "active"
              : ""
          }"
          onclick="filterLessons('${escapeHTML(category)}')"
          type="button"
        >
          ${escapeHTML(category)}
        </button>
      `)
      .join("");

}


function filterLessons(category) {

  currentCategory =
    category;

  renderLessons();

}


function renderLessons() {

  renderLessonCategories();

  const grid =
    $("lessonGrid");

  if (!grid) return;

  const filtered =
    currentCategory === "All"
      ? lessons
      : lessons.filter(
          lesson =>
            lesson.category ===
            currentCategory
        );

  if ($("lessonCount")) {
    $("lessonCount").textContent =
      filtered.length;
  }

  grid.innerHTML =
    filtered
      .map(
        lesson => `
          <article
            class="lessonCard"
            onclick="openLesson(${lesson.id})"
          >

            <span class="lessonPill">
              ${escapeHTML(lesson.category)}
            </span>

            <h3>
              ${escapeHTML(lesson.title)}
            </h3>

            <p>
              ${escapeHTML(lesson.description)}
            </p>

          </article>
        `
      )
      .join("");

}


function openLesson(id) {

  const lesson =
    lessons.find(
      item => item.id === id
    );

  if (!lesson) return;

  currentLesson =
    lesson;

  if ($("selectedLessonCategory")) {
    $("selectedLessonCategory").textContent =
      lesson.category;
  }

  if ($("selectedLessonTitle")) {
    $("selectedLessonTitle").textContent =
      lesson.title;
  }

  if ($("selectedLessonDescription")) {
    $("selectedLessonDescription").textContent =
      lesson.description;
  }

  if ($("selectedLessonContent")) {
    $("selectedLessonContent").innerHTML =
      lesson.content;
  }

  if ($("selectedLessonBox")) {
    $("selectedLessonBox").classList.remove(
      "hidden"
    );
  }

  prepareAITeacherForLesson();

  setTimeout(() => {

    $("selectedLessonBox")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }, 100);

}


function completeLesson() {

  if (!currentLesson) {
    showToast(
      "Choose a lesson first."
    );
    return;
  }

  const completed =
    getCompletedLessons();

  if (!completed.includes(currentLesson.id)) {

    completed.push(
      currentLesson.id
    );

    saveCompletedLessons(
      completed
    );

    addNumber(
      "lessonsCompleted",
      1
    );

    addCoins(20);

    showToast(
      "Lesson completed! +20 TeachCoins"
    );

  } else {

    showToast(
      "You already completed this lesson."
    );

  }

  updateAll();

}


function getCompletedLessons() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "teachly_completed_lessons"
      ) || "[]"
    );

  } catch {

    return [];

  }

}


function saveCompletedLessons(ids) {

  localStorage.setItem(
    "teachly_completed_lessons",
    JSON.stringify(ids)
  );

}


function toggleSavedLesson() {

  if (!currentLesson) return;

  let saved = [];

  try {

    saved = JSON.parse(
      localStorage.getItem(
        "teachly_saved_lessons"
      ) || "[]"
    );

  } catch {}

  if (saved.includes(currentLesson.id)) {

    saved =
      saved.filter(
        id => id !== currentLesson.id
      );

    showToast(
      "Lesson removed from saved lessons."
    );

  } else {

    saved.push(
      currentLesson.id
    );

    addNumber(
      "savedLessons",
      1
    );

    showToast(
      "Lesson saved!"
    );

  }

  localStorage.setItem(
    "teachly_saved_lessons",
    JSON.stringify(saved)
  );

}


/* =====================================================
   QUIZ
===================================================== */

function startQuiz() {

  if (!currentLesson) {
    currentLesson =
      lessons[0];
  }

  startQuizForLesson(
    currentLesson
  );

}


function startSelectedLessonQuiz() {

  if (!currentLesson) {

    showToast(
      "Choose a lesson first."
    );

    return;

  }

  startQuizForLesson(
    currentLesson
  );

}


function startQuizForLesson(lesson) {

  currentLesson =
    lesson;

  currentQuiz = {
    lessonId: lesson.id,
    question: lesson.quiz.question,
    options: lesson.quiz.options,
    answer: lesson.quiz.answer,
    answered: false
  };

  if ($("quizLessonName")) {
    $("quizLessonName").textContent =
      lesson.title;
  }

  if ($("quizQuestion")) {
    $("quizQuestion").textContent =
      lesson.quiz.question;
  }

  if ($("quizResult")) {
    $("quizResult").textContent = "";
  }

  const options =
    $("quizOptions");

  if (options) {

    options.innerHTML =
      lesson.quiz.options
        .map(
          (option, index) => `
            <button
              type="button"
              onclick="answerQuiz(${index})"
            >
              ${escapeHTML(option)}
            </button>
          `
        )
        .join("");

  }

  prepareAITeacherForLesson();

  openPage("quizPage");

}


function answerQuiz(index) {

  if (!currentQuiz) return;

  if (currentQuiz.answered) {
    return;
  }

  currentQuiz.answered =
    true;

  addNumber(
    "quizAnswered",
    1
  );

  const buttons =
    document.querySelectorAll(
      "#quizOptions button"
    );

  buttons.forEach(
    (button, buttonIndex) => {

      if (
        buttonIndex ===
        currentQuiz.answer
      ) {
        button.classList.add(
          "correct"
        );
      }

      if (
        buttonIndex === index &&
        index !== currentQuiz.answer
      ) {
        button.classList.add(
          "wrong"
        );
      }

      button.disabled = true;

    }
  );

  if (
    index ===
    currentQuiz.answer
  ) {

    addNumber(
      "quizCorrect",
      1
    );

    addCoins(15);

    if ($("quizResult")) {
      $("quizResult").textContent =
        "🎉 Correct! +15 TeachCoins";
    }

  } else {

    if ($("quizResult")) {
      $("quizResult").textContent =
        "Not quite. Check the highlighted answer and ask the AI teacher if you want an explanation.";
    }

  }

  updateAll();

}


/* =====================================================
   AI TEACHER
===================================================== */

function prepareAITeacherForLesson() {

  if (!currentLesson) return;

  if ($("aiTeacherLessonLabel")) {
    $("aiTeacherLessonLabel").textContent =
      "Currently learning: " +
      currentLesson.title;
  }

  if ($("aiTeacherMessages")) {

    $("aiTeacherMessages").innerHTML = `
      <div class="aiTeacherMessage assistant">
        Hi! I'm your Teachly AI Teacher.
        Ask me anything about ${escapeHTML(currentLesson.title)}.
      </div>
    `;

  }

}


function renderAIMessage(
  container,
  role,
  message
) {

  if (!container) return;

  const div =
    document.createElement("div");

  div.className =
    role === "user"
      ? "aiMessage user"
      : "aiMessage assistant";

  div.textContent =
    message;

  container.appendChild(div);

  container.scrollTop =
    container.scrollHeight;

}


function renderTeacherAIMessage(
  container,
  role,
  message
) {

  if (!container) return;

  const div =
    document.createElement("div");

  div.className =
    role === "user"
      ? "aiTeacherMessage user"
      : "aiTeacherMessage assistant";

  div.textContent =
    message;

  container.appendChild(div);

  container.scrollTop =
    container.scrollHeight;

}


async function askAI(messageOverride = null) {

  const input =
    $("aiInput");

  const message =
    messageOverride ??
    input?.value.trim();

  if (!message) {
    showToast(
      "Ask the AI something first."
    );
    return;
  }

  if (input) {
    input.value = "";
  }

  const container =
    $("aiMessages");

  renderAIMessage(
    container,
    "user",
    message
  );

  renderAIMessage(
    container,
    "assistant",
    "Thinking..."
  );

  try {

    const response =
      await fetch(
        API_URL + "/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message,

            lesson:
              currentLesson
                ? {
                    title:
                      currentLesson.title,

                    category:
                      currentLesson.category,

                    description:
                      currentLesson.description,

                    content:
                      stripHTML(
                        currentLesson.content
                      )
                  }
                : null
          })
        }
      );

    const data =
      await safeJSON(response);

    const thinking =
      container?.lastElementChild;

    if (thinking) {
      thinking.remove();
    }

    if (!response.ok || !data.ok) {
      throw new Error(
        data.message ||
        "AI request failed."
      );
    }

    renderAIMessage(
      container,
      "assistant",
      data.answer
    );

  } catch (error) {

    const thinking =
      container?.lastElementChild;

    if (thinking) {
      thinking.remove();
    }

    renderAIMessage(
      container,
      "assistant",
      "Sorry, I couldn't answer right now. " +
      error.message
    );

  }

}


async function teacherAIHelp() {
  await askAI();
}


async function askAITeacher() {

  const input =
    $("aiTeacherInput");

  const message =
    input?.value.trim();

  if (!message) {
    showToast(
      "Ask your question first."
    );
    return;
  }

  input.value = "";

  const container =
    $("aiTeacherMessages");

  renderTeacherAIMessage(
    container,
    "user",
    message
  );

  renderTeacherAIMessage(
    container,
    "assistant",
    "Thinking..."
  );

  try {

    const response =
      await fetch(
        API_URL + "/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message,

            lesson:
              currentLesson
                ? {
                    title:
                      currentLesson.title,

                    category:
                      currentLesson.category,

                    description:
                      currentLesson.description,

                    content:
                      stripHTML(
                        currentLesson.content
                      )
                  }
                : null
          })
        }
      );

    const data =
      await safeJSON(response);

    const thinking =
      container?.lastElementChild;

    if (thinking) {
      thinking.remove();
    }

    if (!response.ok || !data.ok) {
      throw new Error(
        data.message ||
        "AI request failed."
      );
    }

    renderTeacherAIMessage(
      container,
      "assistant",
      data.answer
    );

  } catch (error) {

    const thinking =
      container?.lastElementChild;

    if (thinking) {
      thinking.remove();
    }

    renderTeacherAIMessage(
      container,
      "assistant",
      "I couldn't reach the AI right now. " +
      error.message
    );

  }

}


async function askAIQuick(question) {
  if (!$("aiTeacherInput")) return;

  $("aiTeacherInput").value =
    question;

  await askAITeacher();
}


/* =====================================================
   MYSTERY TOPIC
===================================================== */

function mysteryTopic() {

  const topic =
    mysteryTopics[
      Math.floor(
        Math.random() *
        mysteryTopics.length
      )
    ];

  if ($("mysteryTitle")) {
    $("mysteryTitle").textContent =
      topic.title;
  }

  if ($("mysteryDescription")) {
    $("mysteryDescription").textContent =
      topic.description;
  }

  addNumber(
    "mysteryCount",
    1
  );

  openPage(
    "mysteryPage"
  );

}


/* =====================================================
   BADGES
===================================================== */

function unlockedBadgeCount() {

  return badges.filter(
    badge => badge.check()
  ).length;

}


function renderBadgeHTML(badge) {

  const unlocked =
    badge.check();

  return `
    <div class="badge ${
      unlocked
        ? "unlocked"
        : "locked"
    }">

      <div class="badgeIcon">
        ${badge.icon}
      </div>

      <h3>
        ${escapeHTML(badge.title)}
      </h3>

      <p>
        ${escapeHTML(badge.description)}
      </p>

      <p>
        ${
          unlocked
            ? "✓ UNLOCKED"
            : "🔒 LOCKED"
        }
      </p>

    </div>
  `;

}


function renderBadges() {

  const container =
    $("allBadges");

  if (!container) return;

  container.innerHTML =
    badges
      .map(renderBadgeHTML)
      .join("");

}


function renderHomeBadges() {

  const container =
    $("badgesHome");

  if (!container) return;

  container.innerHTML =
    badges
      .slice(0, 4)
      .map(renderBadgeHTML)
      .join("");

}


/* =====================================================
   SHOP
===================================================== */

function renderShop() {

  const container =
    $("shopList");

  if (!container) return;

  if ($("shopCoins")) {
    $("shopCoins").textContent =
      currentUser?.tickets ?? 0;
  }

  container.innerHTML =
    shopItems
      .map(
        item =>
          createShopHTML(item)
      )
      .join("");

}


function renderHomeShop() {

  const container =
    $("shopHome");

  if (!container) return;

  container.innerHTML =
    shopItems
      .slice(0, 4)
      .map(
        item =>
          createShopHTML(item)
      )
      .join("");

}


function createShopHTML(item) {

  const owned =
    Array.isArray(
      currentUser?.inventory
    ) &&
    currentUser.inventory.includes(
      item.id
    );

  const equipped =
    currentUser?.equipped ===
    item.id;

  return `
    <div class="shopItem">

      <div class="shopIcon">
        ${item.icon}
      </div>

      <h3>
        ${escapeHTML(item.name)}
      </h3>

      <p>
        ${escapeHTML(item.description)}
      </p>

      <div class="shopPrice">
        💰 ${item.price}
      </div>

      ${
        owned
          ? `
            <button
              type="button"
              onclick="equipShopItem('${item.id}')"
            >
              ${
                equipped
                  ? "✓ EQUIPPED"
                  : "EQUIP"
              }
            </button>
          `
          : `
            <button
              type="button"
              onclick="buyShopItem('${item.id}')"
            >
              BUY
            </button>
          `
      }

    </div>
  `;

}


async function buyShopItem(itemId) {

  const item =
    shopItems.find(
      product => product.id === itemId
    );

  if (!item) return;

  if (!currentUser?.token) {
    showToast(
      "Please log in first."
    );
    return;
  }

  try {

    const response =
      await fetch(
        API_URL + "/api/shop/buy",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " +
              currentUser.token
          },

          body: JSON.stringify({
            item: item.id,
            price: item.price
          })
        }
      );

    const data =
      await safeJSON(response);

    if (!response.ok || !data.ok) {
      throw new Error(
        data.message ||
        "Purchase failed."
      );
    }

    currentUser.tickets =
      data.tickets;

    currentUser.inventory =
      data.inventory;

    saveUser();

    addNumber(
      "itemsBought",
      1
    );

    showToast(
      item.name +
      " purchased!"
    );

    updateAll();
    renderShop();

  } catch (error) {

    showToast(
      error.message
    );

  }

}


async function equipShopItem(itemId) {

  if (!currentUser?.token) {
    return;
  }

  try {

    const response =
      await fetch(
        API_URL + "/api/shop/equip",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " +
              currentUser.token
          },

          body: JSON.stringify({
            item: itemId
          })
        }
      );

    const data =
      await safeJSON(response);

    if (!response.ok || !data.ok) {
      throw new Error(
        data.message ||
        "Could not equip item."
      );
    }

    currentUser.equipped =
      data.equipped;

    saveUser();

    showToast(
      "Item equipped!"
    );

    renderShop();

  } catch (error) {

    showToast(
      error.message
    );

  }

}


/* =====================================================
   COINS
===================================================== */

function addCoins(amount) {

  if (!currentUser) return;

  currentUser.tickets =
    Number(
      currentUser.tickets || 0
    ) + Number(amount);

  saveUser();

}


/* =====================================================
   PEOPLE
===================================================== */

async function openPeople() {

  openPage(
    "peoplePage"
  );

  const container =
    $("peopleList");

  if (!container) return;

  container.innerHTML = `
    <div class="centerBox">
      <div class="loadingCircle"></div>
      <p>Finding people...</p>
    </div>
  `;

  try {

    const response =
      await fetch(
        API_URL + "/api/people"
      );

    const data =
      await safeJSON(response);

    if (!response.ok || !data.ok) {
      throw new Error(
        data.message ||
        "Could not load people."
      );
    }

    let people =
      Array.isArray(data.people)
        ? data.people
        : [];

    if (currentUser) {

      const wantedRole =
        currentUser.role === "teacher"
          ? "learner"
          : "teacher";

      people =
        people.filter(
          person =>
            person.id !== currentUser.id &&
            person.role === wantedRole
        );

    }

    if (!people.length) {

      container.innerHTML = `
        <div class="centerBox">
          <h2>No matching people yet.</h2>
          <p>Come back when more learners and teachers join Teachly.</p>
        </div>
      `;

      return;

    }

    container.innerHTML =
      people
        .map(
          person => `
            <div class="person">

              <div class="personAvatar">

                ${
                  person.profileImage
                    ? `
                      <img
                        src="${person.profileImage}"
                        alt=""
                      >
                    `
                    : "👤"
                }

              </div>

              <div class="personInfo">

                <h3>
                  ${escapeHTML(person.username)}
                </h3>

                <p>
                  ${
                    person.role === "teacher"
                      ? "👨‍🏫 Teacher"
                      : "🎓 Learner"
                  }
                </p>

              </div>

              <button
                type="button"
                onclick="connectToPerson('${person.id}', '${escapeHTML(person.username)}')"
              >
                CONNECT
              </button>

            </div>
          `
        )
        .join("");

  } catch (error) {

    container.innerHTML = `
      <div class="centerBox">
        <h2>Could not load people.</h2>
        <p>${escapeHTML(error.message)}</p>
      </div>
    `;

  }

}


function connectToPerson(id, username) {

  if (!currentUser) {
    showToast(
      "Please log in first."
    );
    return;
  }

  currentUser.chatWith = {
    id,
    username
  };

  saveUser();

  addNumber(
    "connections",
    1
  );

  openPage("chatPage");

  if ($("chatTitle")) {
    $("chatTitle").textContent =
      "CHAT WITH " +
      username;
  }

  if ($("chatMessages")) {
    $("chatMessages").innerHTML = "";
  }

  connectSocket();

}


/* =====================================================
   SOCKET CHAT
===================================================== */

function connectSocket() {

  if (!currentUser?.token) {
    return;
  }

  if (socket) {
    try {
      socket.disconnect();
    } catch {}
  }

  if (
    typeof io !==
    "function"
  ) {

    console.warn(
      "Socket.IO library not loaded."
    );

    return;

  }

  socket =
    io(API_URL, {
      transports: [
        "websocket",
        "polling"
      ]
    });

  socket.on(
    "connect",
    () => {

      socket.emit(
        "authenticate",
        currentUser.token
      );

    }
  );

  socket.on(
    "authenticated",
    () => {

      console.log(
        "Teachly chat connected."
      );

    }
  );

  socket.on(
    "auth-error",
    data => {

      console.warn(
        data?.message ||
        "Chat authentication failed."
      );

    }
  );

  socket.on(
    "private-message",
    data => {

      addChatMessage(
        data?.message || "",
        false
      );

    }
  );

}


function sendMessage() {

  const input =
    $("messageInput");

  const message =
    input?.value.trim();

  if (!message) return;

  if (
    !currentUser?.chatWith?.id
  ) {

    showToast(
      "Choose someone to chat with first."
    );

    return;

  }

  if (
    !socket ||
    !socket.connected
  ) {

    connectSocket();

    showToast(
      "Connecting to chat..."
    );

    setTimeout(
      () => sendMessage(),
      700
    );

    return;

  }

  socket.emit(
    "private-message",
    {
      to:
        currentUser.chatWith.id,

      message
    }
  );

  addChatMessage(
    message,
    true
  );

  input.value = "";

}


function addChatMessage(
  message,
  mine
) {

  const container =
    $("chatMessages");

  if (!container) return;

  const div =
    document.createElement("div");

  div.className =
    "chatMessage " +
    (mine ? "mine" : "");

  div.textContent =
    message;

  container.appendChild(div);

  container.scrollTop =
    container.scrollHeight;

}


function addEmoji(emoji) {

  const input =
    $("messageInput");

  if (!input) return;

  input.value += emoji;

  input.focus();

}


/* =====================================================
   PROFILE
===================================================== */

function renderProfile() {

  if (!currentUser) return;

  if ($("profileName")) {
    $("profileName").textContent =
      currentUser.username;
  }

  if ($("profileRole")) {
    $("profileRole").textContent =
      currentUser.role === "teacher"
        ? "👨‍🏫 Teacher"
        : "🎓 Learner";
  }

  if ($("profileSessions")) {
    $("profileSessions").textContent =
      currentUser.sessions || 0;
  }

  if ($("profileCoins")) {
    $("profileCoins").textContent =
      currentUser.tickets || 0;
  }

  if ($("profileBadges")) {
    $("profileBadges").textContent =
      unlockedBadgeCount();
  }

  const avatar =
    $("profileAvatar");

  if (avatar) {

    avatar.innerHTML =
      currentUser.profileImage
        ? `<img src="${currentUser.profileImage}" alt="">`
        : "👤";

  }

}


function previewAvatar(event) {

  const file =
    event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast(
      "Please choose an image."
    );
    return;
  }

  const reader =
    new FileReader();

  reader.onload = () => {

    avatarData =
      reader.result;

    if ($("profileAvatar")) {

      $("profileAvatar").innerHTML =
        `<img src="${avatarData}" alt="">`;

    }

  };

  reader.readAsDataURL(file);

}


async function uploadAvatar() {

  if (!currentUser?.token) {
    return;
  }

  if (!avatarData) {

    showToast(
      "Choose an image first."
    );

    return;

  }

  try {

    const response =
      await fetch(
        API_URL + "/api/auth/avatar",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " +
              currentUser.token
          },

          body: JSON.stringify({
            image: avatarData
          })
        }
      );

    const data =
      await safeJSON(response);

    if (!response.ok || !data.ok) {
      throw new Error(
        data.message ||
        "Avatar upload failed."
      );
    }

    currentUser.profileImage =
      data.profileImage;

    saveUser();

    avatarData = "";

    showToast(
      "Avatar saved!"
    );

  } catch (error) {

    showToast(
      error.message
    );

  }

}


/* =====================================================
   MAP
===================================================== */

function openMap() {
  openPage("mapPage");
}


function initMap() {

  if (!window.L) {
    console.warn(
      "Leaflet is not loaded."
    );
    return;
  }

  const mapElement =
    $("worldMap");

  if (!mapElement) return;

  if (map) {

    setTimeout(
      () => map.invalidateSize(),
      100
    );

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
      attribution:
        "&copy; OpenStreetMap contributors"
    }
  ).addTo(map);

  Object.entries(
    countries
  ).forEach(
    ([name, country]) => {

      const locations = {
        India: [20.5, 78.9],
        Japan: [36.2, 138.2],
        "United States": [39.8, -98.6],
        Brazil: [-10.8, -52.9],
        Australia: [-25.3, 133.8],
        Egypt: [26.8, 30.8],
        Antarctica: [-82, 0]
      };

      const position =
        locations[name];

      if (!position) return;

      L.marker(position)
        .addTo(map)
        .bindPopup(
          country.flag +
          " " +
          name
        )
        .on(
          "click",
          () => showCountry(name)
        );

    }
  );

}


function showCountry(name) {

  const country =
    countries[name];

  if (!country) return;

  const info =
    $("countryInfo");

  if (!info) return;

  info.innerHTML = `
    <h2>
      ${country.flag}
      ${escapeHTML(name)}
    </h2>

    <p>
      <strong>Capital:</strong>
      ${escapeHTML(country.capital)}
    </p>

    <p>
      <strong>Continent:</strong>
      ${escapeHTML(country.continent)}
    </p>

    <p>
      ${escapeHTML(country.fact)}
    </p>
  `;

}


/* =====================================================
   THEME
===================================================== */

function toggleTheme() {

  const body =
    document.body;

  const dark =
    body.getAttribute(
      "data-theme"
    ) === "dark";

  body.setAttribute(
    "data-theme",
    dark
      ? "light"
      : "dark"
  );

  localStorage.setItem(
    "teachly_theme",
    dark
      ? "light"
      : "dark"
  );

}


function loadTheme() {

  const theme =
    localStorage.getItem(
      "teachly_theme"
    );

  document.body.setAttribute(
    "data-theme",
    theme || "light"
  );

}


/* =====================================================
   SAVED LESSONS
===================================================== */

function openSavedLessons() {

  currentCategory =
    "All";

  openLessons();

}


/* =====================================================
   STARTUP
===================================================== */

function startApplication() {

  loadTheme();
  loadUser();

  if (currentUser) {

    openPage(
      "homePage"
    );

    connectSocket();

  } else {

    openPage(
      "introPage"
    );

  }

}


document.addEventListener(
  "DOMContentLoaded",
  () => {
    startApplication();
  }
);
