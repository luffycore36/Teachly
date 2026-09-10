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
  localStorage.setItem(
    "teachlyState",
    JSON.stringify(state)
  );
}


/* =========================
   LESSON LIBRARY
========================= */

const lessons = [

  {
    id: "python-basics",
    category: "Computer Science",
    icon: "🐍",
    title: "Python Basics",
    description: "Learn variables, data types, conditions and the basic structure of Python programs.",
    blocks: [
      {
        title: "What is Python?",
        text: "Python is a general-purpose programming language designed to be readable and useful for many kinds of tasks."
      },
      {
        title: "Variables",
        text: "A variable is a name that refers to a value. For example, age = 15 stores the number 15 under the name age."
      },
      {
        title: "Conditions",
        text: "An if statement allows a program to make a decision. The code inside it runs when its condition is true."
      },
      {
        title: "Remember",
        list: [
          "Python uses readable syntax.",
          "Variables store or refer to values.",
          "if statements allow decisions.",
          "Programs can combine many small instructions."
        ]
      }
    ],
    quiz: {
      question: "What is a variable in Python, and why is it useful?",
      groups: [
        ["name", "identifier"],
        ["store", "hold", "refer"],
        ["value", "data"]
      ],
      answer: "A variable is a name used to store or refer to a value or piece of data."
    }
  },

  {
    id: "ai-basics",
    category: "Computer Science",
    icon: "🤖",
    title: "Artificial Intelligence",
    description: "Understand what AI is, how models learn patterns and where AI is used.",
    blocks: [
      {
        title: "What is AI?",
        text: "Artificial intelligence is a field of computing that builds systems capable of performing tasks that can involve learning, reasoning, recognizing patterns or making predictions."
      },
      {
        title: "How does AI learn?",
        text: "Many AI systems learn patterns from examples. During training, a model adjusts internal parameters so that its outputs become more useful for the task."
      },
      {
        title: "AI is not magic",
        text: "An AI system does not automatically know everything. Its abilities depend on its model, training, instructions, available information and tools."
      },
      {
        title: "Remember",
        list: [
          "AI is a field of computing.",
          "Many AI systems learn patterns from examples.",
          "AI can make mistakes.",
          "Good questions and context help an AI give better answers."
        ]
      }
    ],
    quiz: {
      question: "What is artificial intelligence and how can an AI system learn patterns?",
      groups: [
        ["artificial intelligence", "ai"],
        ["computer", "system", "machine"],
        ["patterns", "examples", "data"]
      ],
      answer: "Artificial intelligence is a field of computing. Many AI systems learn patterns from examples or data."
    }
  },

  {
    id: "physics-motion",
    category: "Physics",
    icon: "⚡",
    title: "Motion and Forces",
    description: "Learn about motion, forces, mass and acceleration.",
    blocks: [
      {
        title: "Motion",
        text: "Motion describes a change in an object's position over time."
      },
      {
        title: "Force",
        text: "A force is a push or pull that can change an object's motion."
      },
      {
        title: "Newton's Second Law",
        text: "Newton's second law connects force, mass and acceleration. It is commonly written as F = ma."
      },
      {
        title: "Remember",
        list: [
          "Motion means position changes over time.",
          "Force is a push or pull.",
          "Mass describes how much matter an object has.",
          "More net force generally produces more acceleration for the same mass."
        ]
      }
    ],
    quiz: {
      question: "What is a force and how are force, mass and acceleration related?",
      groups: [
        ["push", "pull"],
        ["force", "f"],
        ["mass", "m"],
        ["acceleration", "a"]
      ],
      answer: "A force is a push or pull. Newton's second law relates force, mass and acceleration with F = ma."
    }
  },

  {
    id: "biology-cells",
    category: "Biology",
    icon: "🧬",
    title: "Cells",
    description: "Learn why cells are important and the basic roles of common cell structures.",
    blocks: [
      {
        title: "What is a cell?",
        text: "A cell is the basic structural and functional unit of life."
      },
      {
        title: "Cell membrane",
        text: "The cell membrane surrounds the cell and helps control what enters and leaves it."
      },
      {
        title: "Nucleus",
        text: "In many eukaryotic cells, the nucleus contains most of the cell's genetic material and helps control cell activities."
      },
      {
        title: "Remember",
        list: [
          "Cells are fundamental units of living organisms.",
          "The membrane controls movement into and out of the cell.",
          "The nucleus contains genetic material in eukaryotic cells."
        ]
      }
    ],
    quiz: {
      question: "What is a cell and what are two important roles of the cell membrane and nucleus?",
      groups: [
        ["basic", "unit"],
        ["life", "living"],
        ["membrane", "membrane controls"],
        ["nucleus", "genetic", "dna"]
      ],
      answer: "A cell is a basic unit of life. The membrane controls movement into and out of the cell, while the nucleus contains genetic material in eukaryotic cells."
    }
  },

  {
    id: "chemistry-matter",
    category: "Chemistry",
    icon: "🧪",
    title: "Matter and Atoms",
    description: "Understand atoms, elements and the three familiar states of matter.",
    blocks: [
      {
        title: "Matter",
        text: "Matter is anything that has mass and occupies space."
      },
      {
        title: "Atoms",
        text: "Atoms are basic units of chemical elements. They contain a nucleus surrounded by electrons."
      },
      {
        title: "States of Matter",
        text: "Common states include solids, liquids and gases. Their particles have different arrangements and amounts of freedom of movement."
      },
      {
        title: "Remember",
        list: [
          "Matter has mass and occupies space.",
          "Atoms make up elements.",
          "Solids keep a definite shape.",
          "Liquids take the shape of their container.",
          "Gases spread to fill available space."
        ]
      }
    ],
    quiz: {
      question: "What is matter, what is an atom, and name three common states of matter.",
      groups: [
        ["mass"],
        ["space", "occupies"],
        ["atom"],
        ["solid", "liquid"],
        ["gas", "gases"]
      ],
      answer: "Matter has mass and occupies space. An atom is a basic unit of an element. Common states of matter are solid, liquid and gas."
    }
  },

  {
    id: "math-algebra",
    category: "Mathematics",
    icon: "➗",
    title: "Algebra Basics",
    description: "Learn variables, expressions and simple equations.",
    blocks: [
      {
        title: "Variables",
        text: "A variable represents an unknown or changing value, often written with a letter such as x."
      },
      {
        title: "Expressions",
        text: "An algebraic expression combines numbers, variables and operations, such as 3x + 5."
      },
      {
        title: "Equations",
        text: "An equation states that two expressions are equal. Solving an equation means finding the value that makes the statement true."
      },
      {
        title: "Example",
        text: "For x + 4 = 10, subtract 4 from both sides to get x = 6."
      }
    ],
    quiz: {
      question: "What is a variable and how would you solve x + 4 = 10?",
      groups: [
        ["variable", "unknown"],
        ["x"],
        ["subtract", "minus"],
        ["6"]
      ],
      answer: "A variable can represent an unknown value. To solve x + 4 = 10, subtract 4 from both sides, giving x = 6."
    }
  },

  {
    id: "astronomy-solar",
    category: "Space",
    icon: "🌌",
    title: "Our Solar System",
    description: "Explore the Sun, planets and the structure of our solar system.",
    blocks: [
      {
        title: "The Solar System",
        text: "Our solar system consists of the Sun and the objects gravitationally bound to it, including planets, dwarf planets, moons, asteroids and comets."
      },
      {
        title: "The Sun",
        text: "The Sun is a star at the center of our solar system. Its gravity plays a major role in keeping the solar system together."
      },
      {
        title: "Planets",
        text: "The eight planets orbit the Sun. The inner planets are rocky, while the outer planets are much larger and include gas and ice giants."
      },
      {
        title: "Remember",
        list: [
          "The Sun is a star.",
          "Planets orbit the Sun.",
          "Earth is one of eight planets.",
          "Gravity is important to orbital motion."
        ]
      }
    ],
    quiz: {
      question: "What is the Solar System and what role does the Sun play in it?",
      groups: [
        ["sun"],
        ["star"],
        ["planets", "planet"],
        ["orbit", "gravity"]
      ],
      answer: "The Solar System contains the Sun and objects orbiting it. The Sun is a star whose gravity plays a major role in the system."
    }
  },

  {
    id: "cybersecurity-basics",
    category: "Technology",
    icon: "🔐",
    title: "Cybersecurity Basics",
    description: "Learn the basics of protecting accounts, devices and information.",
    blocks: [
      {
        title: "What is cybersecurity?",
        text: "Cybersecurity is the practice of protecting systems, networks and information from unauthorized access, disruption or misuse."
      },
      {
        title: "Strong passwords",
        text: "Use long, unique passwords or passphrases and avoid reusing the same password across important accounts."
      },
      {
        title: "Phishing",
        text: "Phishing is a social-engineering technique where someone tries to trick a person into revealing information or clicking something unsafe."
      },
      {
        title: "Remember",
        list: [
          "Use unique passwords.",
          "Be careful with unexpected links and messages.",
          "Keep software updated.",
          "Use multi-factor authentication when available."
        ]
      }
    ],
    quiz: {
      question: "What is cybersecurity and name two ways to protect an account?",
      groups: [
        ["protect", "protection"],
        ["systems", "information", "account"],
        ["password"],
        ["multi-factor", "mfa", "two-factor"]
      ],
      answer: "Cybersecurity protects systems and information. Unique strong passwords and multi-factor authentication are two ways to protect an account."
    }
  },

  {
    id: "history-civilization",
    category: "History",
    icon: "🏛️",
    title: "Early Civilizations",
    description: "Discover why early civilizations developed around rivers and how societies became organized.",
    blocks: [
      {
        title: "Why rivers mattered",
        text: "Many early civilizations developed near rivers because rivers provided water, fertile land, transportation and resources."
      },
      {
        title: "Growing communities",
        text: "As agriculture became more productive, some communities grew into towns and cities."
      },
      {
        title: "Organization",
        text: "Larger societies developed systems for government, trade, writing, construction and managing resources."
      },
      {
        title: "Remember",
        list: [
          "Rivers supplied important resources.",
          "Agriculture supported larger populations.",
          "Cities developed as communities grew.",
          "Different civilizations developed their own institutions and cultures."
        ]
      }
    ],
    quiz: {
      question: "Why did many early civilizations develop near rivers?",
      groups: [
        ["water"],
        ["fertile", "soil", "land"],
        ["transport", "transportation"],
        ["resources", "agriculture", "farming"]
      ],
      answer: "Rivers provided water, fertile land, transportation and resources, which helped agriculture and growing communities."
    }
  },

  {
    id: "english-grammar",
    category: "English",
    icon: "📖",
    title: "Grammar Foundations",
    description: "Understand nouns, verbs, adjectives and how they work in sentences.",
    blocks: [
      {
        title: "Nouns",
        text: "A noun names a person, place, thing or idea."
      },
      {
        title: "Verbs",
        text: "A verb expresses an action, occurrence or state of being."
      },
      {
        title: "Adjectives",
        text: "An adjective describes or gives more information about a noun."
      },
      {
        title: "Example",
        text: "In the sentence 'The bright student solved the problem,' 'student' is a noun, 'bright' is an adjective and 'solved' is a verb."
      }
    ],
    quiz: {
      question: "What are a noun, a verb and an adjective?",
      groups: [
        ["noun", "person", "place", "thing"],
        ["verb", "action", "being"],
        ["adjective", "describe", "describes"]
      ],
      answer: "A noun names a person, place, thing or idea. A verb expresses an action or state. An adjective describes a noun."
    }
  },

  {
    id: "robotics-intro",
    category: "Technology",
    icon: "🦾",
    title: "Introduction to Robotics",
    description: "Learn how robots combine sensors, control systems, software and mechanical parts.",
    blocks: [
      {
        title: "What is a robot?",
        text: "A robot is a machine designed to carry out tasks, often using sensors, computation and actuators."
      },
      {
        title: "Sensors",
        text: "Sensors collect information about the robot's surroundings or internal state."
      },
      {
        title: "Actuators",
        text: "Actuators create physical movement, such as turning a wheel or moving a robotic arm."
      },
      {
        title: "Remember",
        list: [
          "Sensors collect information.",
          "Software can process sensor information.",
          "Actuators create movement.",
          "Robots combine hardware and software."
        ]
      }
    ],
    quiz: {
      question: "What are sensors and actuators in a robot?",
      groups: [
        ["sensor", "sensors"],
        ["information", "data"],
        ["actuator", "actuators"],
        ["movement", "move"]
      ],
      answer: "Sensors collect information, while actuators create physical movement."
    }
  },

  {
    id: "geography-earth",
    category: "Geography",
    icon: "🌍",
    title: "Earth's Continents",
    description: "Learn about continents, oceans and how Earth's land is organized.",
    blocks: [
      {
        title: "Continents",
        text: "A continent is one of Earth's large land areas. Different educational systems group and name continents somewhat differently."
      },
      {
        title: "Oceans",
        text: "Oceans cover most of Earth's surface and strongly influence climate, ecosystems and human activity."
      },
      {
        title: "Maps",
        text: "Maps represent locations and geographic features using symbols, scales and coordinates."
      },
      {
        title: "Remember",
        list: [
          "Earth has large land areas called continents.",
          "Oceans cover most of the planet.",
          "Maps help represent geographic information."
        ]
      }
    ],
    quiz: {
      question: "What is a continent and why are oceans important to Earth?",
      groups: [
        ["large", "land"],
        ["continent"],
        ["ocean", "oceans"],
        ["climate", "ecosystem", "life"]
      ],
      answer: "A continent is a large land area. Oceans influence climate and support many ecosystems and forms of life."
    }
  }

];

let selectedLesson = null;
let activeLessonCategory = "All";


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

  const page = document.getElementById(id);

  if (page) {
    page.classList.add("active");
  }

  updateAll();

  if (id === "mapPage") {
    setTimeout(() => {
      initMap();

      if (map) {
        map.invalidateSize();
      }
    }, 150);
  }

  if (id === "aiPage") {
    renderLessonLibrary();
  }
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

  document.getElementById("chatMessages").innerHTML = 
    <div class="message">
      👋 You are connected with <b>${escapeHTML(person)}</b>
    </div>

    <div class="message">
      Please introduce yourself!
    </div>
  ;

  openPage("chatPage");
}

function sendMessage() {

  const input =
    document.getElementById("messageInput");

  const text = input.value.trim();

  if (!text) return;

  const box =
    document.getElementById("chatMessages");

  box.innerHTML += 
    <div class="message me">
      ${escapeHTML(text)}
    </div>
  ;

  input.value = "";

  box.scrollTop = box.scrollHeight;
}

function addEmoji(emoji) {

  document.getElementById("messageInput").value += emoji;
}

function escapeHTML(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================
   AI TEACHER / LESSONS
========================= */

function openAITeacher() {

  openPage("aiPage");

  if (!selectedLesson) {
    renderLessonLibrary();
  }
}

function renderLessonLibrary() {

  const count =
    document.getElementById("lessonCount");

  const categoriesBox =
    document.getElementById("lessonCategories");

  const grid =
    document.getElementById("lessonGrid");

  if (!count || !categoriesBox || !grid) {
    return;
  }

  count.textContent = lessons.length;

  const categories = [
    "All",
    ...new Set(
      lessons.map(lesson => lesson.category)
    )
  ];

  categoriesBox.innerHTML =
    categories.map(category => 
      <button
        class="lessonCategoryButton ${
          activeLessonCategory === category
            ? "active"
            : ""
        }"
        onclick="filterLessons('${escapeHTML(category)}')"
      >
        ${escapeHTML(category)}
      </button>
    ).join("");

  const visibleLessons =
    activeLessonCategory === "All"
      ? lessons
      : lessons.filter(
          lesson =>
            lesson.category ===
            activeLessonCategory
        );

  grid.innerHTML =
    visibleLessons.map(lesson => 

      <div
        class="lessonCard"
        onclick="selectLesson('${lesson.id}')"
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

    ).join("");
}

function filterLessons(category) {

  activeLessonCategory = category;

  renderLessonLibrary();
}

function selectLesson(id) {

  const lesson =
    lessons.find(item => item.id === id);

  if (!lesson) return;

  selectedLesson = lesson;

  document
    .getElementById("selectedLessonBox")
    .classList.remove("hidden");

  document.getElementById(
    "selectedLessonCategory"
  ).textContent = lesson.category;

  document.getElementById(
    "selectedLessonTitle"
  ).textContent =
    ${lesson.icon} ${lesson.title};

  document.getElementById(
    "selectedLessonDescription"
  ).textContent =
    lesson.description;

  document.getElementById(
    "selectedLessonContent"
  ).innerHTML =
    lesson.blocks.map(block => {

      if (block.list) {

        return 
          <div class="lessonBlock">

            <h3>${escapeHTML(block.title)}</h3>

            <ul>
              ${block.list.map(item =>
                <li>${escapeHTML(item)}</li>
              ).join("")}
            </ul>

          </div>
        ;
      }

      return 
        <div class="lessonBlock">

          <h3>${escapeHTML(block.title)}</h3>

          <p>${escapeHTML(block.text)}</p>

        </div>
      ;

    }).join("");

  document
    .getElementById("selectedLessonBox")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}

function startSelectedLessonQuiz() {

  if (!selectedLesson) {
    showToast("Choose a lesson first.");
    return;
  }

  startQuizForLesson(selectedLesson);
}


/* =========================
   OLD TEACHER AI MODE
========================= */

async function teacherAIHelp() {

  const topic =
    selectedLesson || lessons[0];

  const result =
    document.getElementById("teacherAIResult");

  result.innerHTML =
    "<p>🤖 Preparing a teacher activity...</p>";

  try {

    const response =
      await fetch("https://teachly-nmxh.onrender.com/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message:
            Create a short classroom activity for this lesson.

Lesson:
${topic.title}

Lesson description:
${topic.description}

Lesson content:
${topic.blocks.map(block =>
  ${block.title}: ${block.text || block.list?.join(", ")}
).join("\n")}

Give:
1. A simple explanation.
2. One question.
3. One small activity.
4. One challenge.
        })
      });

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "AI could not respond."
      );
    }

    result.innerHTML = 
      <h3>🤖 Teacher AI Assistant</h3>
      <p>${formatAIText(data.answer)}</p>
    ;

  } catch (error) {

    result.innerHTML = 
      <p>
        ❌ ${escapeHTML(error.message)}
      </p>
    ;
  }
}


/* =========================
   REAL AI TEACHER
========================= */

function renderAIMessage(text, type = "ai") {

  const box =
    document.getElementById(
      "aiTeacherMessages"
    );

  if (!box) return;

  const message =
    document.createElement("div");

  message.className =
    aiBubble ${
      type === "user"
        ? "userBubble"
        : ""
    };

  if (type === "ai") {

    message.innerHTML =
      formatAIText(text);

  } else {

    message.textContent = text;
  }

  box.appendChild(message);

  box.scrollTop =
    box.scrollHeight;
}

function formatAIText(text) {

  const safe =
    escapeHTML(text || "");

  return safe
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
}

function prepareAITeacherForLesson() {

  if (!selectedLesson) return;

  const label =
    document.getElementById(
      "aiTeacherLessonLabel"
    );

  if (label) {

    label.textContent =
      Lesson: ${selectedLesson.title};
  }

  const messages =
    document.getElementById(
      "aiTeacherMessages"
    );

  if (messages) {

    messages.innerHTML = 
      <div class="aiBubble">

        <b>👋 I'm ready to help.</b>

        <p>
          We're studying
          <b>${escapeHTML(selectedLesson.title)}</b>.
          Ask me any doubt about it and I'll explain it
          step by step.
        </p>

      </div>
    ;
  }
}

async function askAITeacher() {

  if (!selectedLesson) {

    showToast(
      "Choose a lesson before asking the AI."
    );

    return;
  }

  const input =
    document.getElementById(
      "aiTeacherInput"
    );

  const question =
    input.value.trim();

  if (!question) {

    showToast("Type your doubt first.");

    return;
  }

  input.value = "";

  renderAIMessage(
    question,
    "user"
  );

  const messages =
    document.getElementById(
      "aiTeacherMessages"
    );

  const thinking =
    document.createElement("div");

  thinking.className =
    "aiBubble aiThinking";

  thinking.textContent =
    "🤖 Thinking about your question...";

  messages.appendChild(thinking);

  messages.scrollTop =
    messages.scrollHeight;

  try {

    const lessonContext =
      selectedLesson.blocks.map(
        block => {

          const content =
            block.text ||
            (block.list
              ? block.list.join("; ")
              : "");

          return ${block.title}: ${content};

        }
      ).join("\n");

    const response =
      await fetch("https://teachly-nmxh.onrender.com/api/ai", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          message: question,

          lesson: {
            title:
              selectedLesson.title,

            category:
              selectedLesson.category,

            description:
              selectedLesson.description,

            content:
              lessonContext
          }

        })

      });

    const data =
      await response.json();

    thinking.remove();

    if (!response.ok) {

      throw new Error(
        data.error ||
        "AI could not respond."
      );
    }

    renderAIMessage(
      data.answer,
      "ai"
    );

  } catch (error) {

    thinking.remove();

    renderAIMessage(
      "Sorry, I couldn't reach the AI right now. " +
      error.message
    );
  }
}

function askAIQuick(question) {

  const input =
    document.getElementById(
      "aiTeacherInput"
    );

  input.value = question;

  askAITeacher();
}


/* =========================
   MYSTERY TOPIC
========================= */

const mysteryTopics = [

  [
    "Black Holes",
    "Extremely dense astronomical objects with gravity so strong that light cannot escape from within the event horizon."
  ],

  [
    "Deep Ocean",
    "The deep ocean is a huge environment with unusual animals, pressure and almost no sunlight."
  ],

  [
    "Antarctica",
    "Antarctica is Earth's southernmost continent and contains most of the planet's ice."
  ],

  [
    "Quantum Physics",
    "Quantum physics describes nature at very small scales such as atoms and particles."
  ],

  [
    "Volcanoes",
    "Volcanoes form when magma and gases reach Earth's surface."
  ],

  [
    "Human Brain",
    "The brain coordinates many functions including movement, senses, memory and thinking."
  ],

  [
    "Robotics",
    "Robotics combines engineering and computing to design machines that can perform tasks."
  ],

  [
    "Ocean Currents",
    "Large movements of seawater help distribute heat around Earth's oceans."
  ]

];

function mysteryTopic() {

  const item =
    mysteryTopics[
      Math.floor(
        Math.random() *
        mysteryTopics.length
      )
    ];

  document.getElementById(
    "mysteryTitle"
  ).textContent = item[0];

  document.getElementById(
    "mysteryDescription"
  ).textContent = item[1];

  openPage("mysteryPage");
}


/* =========================
   QUIZ
========================= */

let quizIndex = 0;
let quizAnswered = false;
let quizLesson = null;

function startQuiz() {

  if (!selectedLesson) {

    openAITeacher();

    showToast(
      "Choose a lesson first!"
    );

    return;
  }

  startQuizForLesson(selectedLesson);
}

function startQuizForLesson(lesson) {

  selectedLesson = lesson;
  quizLesson = lesson;
  quizAnswered = false;

  openPage("quizPage");

  setupQuiz();

  prepareAITeacherForLesson();
}

function setupQuiz() {

  if (!quizLesson) {

    document.getElementById(
      "quizQuestion"
    ).innerHTML = 
      <h2>Choose a lesson first.</h2>
    ;

    return;
  }

  quizAnswered = false;

  document.getElementById(
    "quizLessonName"
  ).textContent =
    ${quizLesson.icon} ${quizLesson.title};

  document.getElementById(
    "quizQuestion"
  ).innerHTML = 
    <h2>${escapeHTML(
      quizLesson.quiz.question
    )}</h2>

    <p>
      Give a complete answer, not just one keyword.
    </p>
  ;

  document.getElementById(
    "quizAnswer"
  ).value = "";

  document.getElementById(
    "quizResult"
  ).innerHTML = "";

  prepareAITeacherForLesson();
}

function normalize(text) {

  return String(text)
    .toLowerCase()
    .replace(/[.,!?;:()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function checkQuiz() {

  if (quizAnswered) {

    showToast(
      "This question has already been checked."
    );

    return;
  }

  if (!quizLesson) {

    showToast(
      "Choose a lesson first."
    );

    return;
  }

  const userAnswer =
    normalize(
      document.getElementById(
        "quizAnswer"
      ).value
    );

  if (userAnswer.length < 10) {

    document.getElementById(
      "quizResult"
    ).innerHTML = 
      <p>❌ Your answer is too short.</p>
      <p>Please explain your answer completely.</p>
    ;

    return;
  }

  const question =
    quizLesson.quiz;

  let conceptsFound = 0;

  question.groups.forEach(
    group => {

      const found =
        group.some(
          word =>
            userAnswer.includes(
              word
            )
        );

      if (found) {
        conceptsFound++;
      }

    }
  );

  const required =
    question.groups.length;

  if (conceptsFound === required) {

    quizAnswered = true;

    state.coins += 10;
    state.sessions++;

    save();

    document.getElementById(
      "quizResult"
    ).innerHTML = 
      <h3>✅ Correct!</h3>

      <p>
        Your answer contains the important concepts.
      </p>

      <p>
        🪙 +10 TeachCoins
      </p>

      <p>
        🤖 Still confused?
        Ask the AI Teacher below.
      </p>
    ;

    updateAll();

  } else {

    const missing =
      required - conceptsFound;

    document.getElementById(
      "quizResult"
    ).innerHTML = 
      <h3>❌ Not complete yet.</h3>

      <p>
        Your answer is missing
        ${missing}
        important concept
        ${missing === 1 ? "" : "s"}.
      </p>

      <p>
        You can ask the AI Teacher below
        to explain the part you're confused about.
      </p>
    ;
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
    document.getElementById(
      "peopleList"
    );

  if (!box) return;

  box.innerHTML =
    people.map(
      person => 

        <div class="person">

          <div>

            <div style="font-size:35px">
              ${person[2]}
            </div>

            <h3>
              ${escapeHTML(person[0])}
            </h3>

            <p>
              Teaches:
              ${escapeHTML(person[1])}
            </p>

          </div>

          <button
            onclick="connectPerson('${escapeHTML(
              person[0]
            )} • ${escapeHTML(
              person[1]
            )}')"
          >
            CONNECT
          </button>

        </div>

      
    ).join("");
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
    badgeRequirements.map(
      (req, i) => {

        const isUnlocked =
          state.sessions >= req;

        if (isUnlocked) unlocked++;

        return 
          <div class="badge ${
            isUnlocked ? "" : "locked"
          }">

            <div class="badgeIcon">
              ${
                isUnlocked
                  ? badgeIcons[i]
                  : "🔒"
              }
            </div>

            <h3>
              ${badgeNames[i]}
            </h3>

            <p>
              ${req} sessions
            </p>

          </div>
        ;

      }
    ).join("");

  document.getElementById(
    "allBadges"
  ).innerHTML = html;

  document.getElementById(
    "badgesHome"
  ).innerHTML =
    html.slice(0, 1200);

  document.getElementById(
    "profileBadges"
  ).textContent =
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
    shopItems.map(
      (item, index) => {

        const owned =
          state.owned.includes(index);

        const enough =
          state.coins >= item[1];

        return 
          <div class="shopItem">

            <div style="font-size:45px">
              ${item[2]}
            </div>

            <h3>
              ${item[0]}
            </h3>

            <div class="price">
              🪙 ${item[1]}
            </div>

            <button
              class="${
                !enough && !owned
                  ? "notEnough"
                  : ""
              }"
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
        ;

      }
    ).join("");

  document.getElementById(
    "shopList"
  ).innerHTML = html;

  document.getElementById(
    "shopHome"
  ).innerHTML = html;
}

function buyItem(index) {

  const item =
    shopItems[index];

  if (
    state.owned.includes(index)
  ) {

    showToast(
      "Already owned!"
    );

    return;
  }

  if (
    state.coins < item[1]
  ) {

    showToast(
      "Not enough coins!"
    );

    return;
  }

  state.coins -= item[1];

  state.owned.push(index);

  save();

  showToast(
    "Purchased!"
  );

  updateAll();
}


/* =========================
   PROFILE
========================= */

function updateProfile() {

  document.getElementById(
    "profileName"
  ).textContent =
    state.name;

  document.getElementById(
    "profileSessions"
  ).textContent =
    state.sessions;

  document.getElementById(
    "profileCoins"
  ).textContent =
    state.coins;

  document.getElementById(
    "profileBadges"
  ).textContent =
    badgeRequirements.filter(
      x =>
        state.sessions >= x
    ).length;
}


/* =========================
   REAL WORLD MAP
========================= */

let map;
let countryLayer;

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

  map =
    L.map(
      "worldMap",
      {
        worldCopyJump: true,
        minZoom: 1.5,
        maxZoom: 7
      }
    ).setView(
      [20, 0],
      2
    );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        "&copy; OpenStreetMap contributors",
      maxZoom: 19
    }
  ).addTo(map);

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

  Object.keys(locations).forEach(
    name => {

      const marker =
        L.marker(
          locations[name]
        ).addTo(map);

      marker.bindPopup(
        <b>${name}</b><br>
        Tap for details
      );

      marker.on(
        "click",
        () => {
          showCountry(name);
        }
      );

    }
  );
}


/* =========================
   COUNTRY DETAILS
========================= */

function showCountry(name) {

  const country =
    countries[name];

  if (!country) {

    showToast(
      "Country information coming soon!"
    );

    return;
  }

  document.getElementById(
    "countryInfo"
  ).innerHTML = 

    <h2>🌎 ${name}</h2>

    <p>
      <b>Continent:</b>
      ${country.continent}
    </p>

    <p>
      <b>Capital:</b>
      ${country.capital}
    </p>

    <p>
      <b>Population:</b>
      ${country.population}
    </p>

    <p>
      <b>Language:</b>
      ${country.language}
    </p>

    <p>
      <b>Currency:</b>
      ${country.currency}
    </p>

    <p>
      <b>📚 Teachly Fact:</b>
      ${country.fact}
    </p>

  ;

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

      map.setView(
        locations[name],
        4
      );

    }
  }
}


/* =========================
   UPDATE EVERYTHING
========================= */

function updateAll() {

  document.getElementById(
    "homeCoins"
  ).textContent =
    state.coins;

  document.getElementById(
    "shopCoins"
  ).textContent =
    state.coins;

  document.getElementById(
    "welcomeText"
  ).textContent =
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

    setTimeout(
      initMap,
      100
    );
  }
}


/* =========================
   TOAST
========================= */

function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );

  toast.textContent =
    message;

  toast.style.display =
    "block";

  setTimeout(
    () => {
      toast.style.display =
        "none";
    },
    2200
  );
}


/* =========================
   INITIAL LOAD
========================= */

if (state.name) {

  document.getElementById(
    "usernameInput"
  ).value =
    state.name;

  document.getElementById(
    "welcomeText"
  ).textContent =
    "Welcome, " +
    state.name +
    "!";

  openPage(
    "homePage"
  );

} else {

  openPage(
    "namePage"
  );
}

updateAll();
