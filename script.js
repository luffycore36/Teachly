/* =====================================================
   TEACHLY
   MAIN FRONTEND SCRIPT
===================================================== */

const API_URL = "https://teachly-nmxh.onrender.com";

let currentRole = "";
let currentPerson = "";
let currentUser = null;
let selectedLesson = null;
let currentQuiz = null;
let currentLessonCategory = "All";


/* =====================================================
   STATE
===================================================== */

let state = JSON.parse(
    localStorage.getItem("teachlyState") || "{}"
);

state.name = state.name || "";
state.coins = Number(state.coins || 0);
state.sessions = Number(state.sessions || 0);
state.badges = state.badges || [];
state.owned = state.owned || [];

function save() {
    localStorage.setItem(
        "teachlyState",
        JSON.stringify(state)
    );

    updateUI();
}


/* =====================================================
   HELPERS
===================================================== */

function $(id) {
    return document.getElementById(id);
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

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
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

    const page = $(pageId);

    if (page) {
        page.classList.add("active");
    }

    if (pageId === "peoplePage") {
        loadPeople();
    }

    if (pageId === "badgesPage") {
        loadBadges();
    }

    if (pageId === "shopPage") {
        loadShop();
    }

    if (pageId === "profilePage") {
        loadProfile();
    }

    if (pageId === "mapPage") {
        loadMap();
    }
}


function goHome() {
    openPage("homePage");
}


/* =====================================================
   START
===================================================== */

function startTeachly() {

    const input = $("usernameInput");

    const name = input?.value.trim();

    if (!name) {
        showToast("Please enter a username.");
        return;
    }

    state.name = name;

    save();

    if ($("welcomeText")) {
        $("welcomeText").textContent =
            `Welcome, ${name}! 👋`;
    }

    openPage("homePage");

    loadLessons();
}


/* =====================================================
   UI
===================================================== */

function updateUI() {

    const coinElements = [
        $("homeCoins"),
        $("shopCoins"),
        $("shopPageCoins"),
        $("profileCoins")
    ];

    coinElements.forEach(element => {

        if (element) {
            element.textContent = state.coins;
        }

    });

    if ($("profileName")) {
        $("profileName").textContent =
            state.name || "User";
    }

    if ($("profileSessions")) {
        $("profileSessions").textContent =
            state.sessions;
    }

    if ($("profileBadges")) {
        $("profileBadges").textContent =
            state.badges.length;
    }

    if ($("welcomeText") && state.name) {
        $("welcomeText").textContent =
            `Welcome, ${state.name}! 👋`;
    }
}


/* =====================================================
   LESSON LIBRARY
===================================================== */

const lessons = [

    {
        id: "math-basics",
        title: "Mathematics Basics",
        category: "Mathematics",
        emoji: "➗",
        description: "Numbers, operations and basic mathematical thinking.",
        content: `
<h3>What is Mathematics?</h3>

<p>
Mathematics is the study of numbers, quantities,
patterns, shapes and logical relationships.
</p>

<h3>Basic Operations</h3>

<ul>
<li>Addition combines quantities.</li>
<li>Subtraction finds the difference.</li>
<li>Multiplication is repeated addition.</li>
<li>Division splits a quantity into equal parts.</li>
</ul>

<h3>Example</h3>

<p>
If you have 4 apples and receive 3 more:
4 + 3 = 7.
</p>

<h3>Remember</h3>

<p>
Always follow the correct order of operations
when an expression contains multiple operations.
</p>
`
    },


    {
        id: "fractions",
        title: "Fractions",
        category: "Mathematics",
        emoji: "🍕",
        description: "Understand numerators, denominators and equivalent fractions.",
        content: `
<h3>What is a Fraction?</h3>

<p>
A fraction represents part of a whole.
</p>

<p>
In 3/4, the 3 is the numerator and the 4 is
the denominator.
</p>

<h3>Equivalent Fractions</h3>

<p>
Fractions can look different while representing
the same amount.
</p>

<p>
For example, 1/2 and 2/4 represent the same value.
</p>
`
    },


    {
        id: "algebra",
        title: "Introduction to Algebra",
        category: "Mathematics",
        emoji: "🔢",
        description: "Learn variables, expressions and simple equations.",
        content: `
<h3>Variables</h3>

<p>
A variable is a symbol used to represent an unknown value.
</p>

<p>
For example:
x + 5 = 12
</p>

<p>
Here x represents the unknown number.
</p>

<h3>Solving</h3>

<p>
To solve x + 5 = 12, subtract 5 from both sides:
x = 7.
</p>
`
    },


    {
        id: "physics",
        title: "Force and Motion",
        category: "Physics",
        emoji: "🚀",
        description: "Learn how forces affect objects and motion.",
        content: `
<h3>Force</h3>

<p>
A force is a push or pull that can change an object's motion.
</p>

<h3>Motion</h3>

<p>
Motion describes a change in an object's position over time.
</p>

<h3>Newton's Laws</h3>

<p>
Newton's laws describe relationships between force,
mass and motion.
</p>

<p>
A simple form of Newton's second law is:
F = ma.
</p>
`
    },


    {
        id: "gravity",
        title: "Gravity",
        category: "Physics",
        emoji: "🌍",
        description: "Understand gravitational attraction.",
        content: `
<h3>What is Gravity?</h3>

<p>
Gravity is an attractive force between objects that have mass.
</p>

<p>
Earth's gravity pulls objects toward Earth's center.
</p>

<h3>Example</h3>

<p>
When you drop a ball, Earth's gravity causes it to
accelerate downward.
</p>
`
    },


    {
        id: "biology-cells",
        title: "Cells",
        category: "Biology",
        emoji: "🔬",
        description: "Learn about the basic unit of life.",
        content: `
<h3>Cells</h3>

<p>
A cell is the basic structural and functional unit
of living organisms.
</p>

<h3>Important Parts</h3>

<ul>
<li>Cell membrane</li>
<li>Cytoplasm</li>
<li>Nucleus</li>
<li>Mitochondria</li>
</ul>

<h3>Plant Cells</h3>

<p>
Plant cells also have structures such as a cell wall,
chloroplasts and a large central vacuole.
</p>
`
    },


    {
        id: "photosynthesis",
        title: "Photosynthesis",
        category: "Biology",
        emoji: "🌱",
        description: "How plants use light energy to make food.",
        content: `
<h3>Photosynthesis</h3>

<p>
Photosynthesis is the process by which plants use
light energy to make chemical energy stored in food.
</p>

<h3>Main Ingredients</h3>

<ul>
<li>Carbon dioxide</li>
<li>Water</li>
<li>Light energy</li>
</ul>

<p>
Chlorophyll helps plants capture light energy.
</p>
`
    },


    {
        id: "chemistry-atoms",
        title: "Atoms",
        category: "Chemistry",
        emoji: "⚛️",
        description: "Learn about protons, neutrons and electrons.",
        content: `
<h3>Atoms</h3>

<p>
Atoms are the basic units of ordinary matter.
</p>

<h3>Subatomic Particles</h3>

<ul>
<li>Protons have positive charge.</li>
<li>Neutrons have no electrical charge.</li>
<li>Electrons have negative charge.</li>
</ul>

<p>
The nucleus contains protons and neutrons.
Electrons occupy regions around the nucleus.
</p>
`
    },


    {
        id: "chemical-reactions",
        title: "Chemical Reactions",
        category: "Chemistry",
        emoji: "🧪",
        description: "Understand reactants, products and chemical change.",
        content: `
<h3>Chemical Reactions</h3>

<p>
A chemical reaction changes substances into new substances.
</p>

<h3>Reactants</h3>

<p>
Reactants are the substances present at the beginning.
</p>

<h3>Products</h3>

<p>
Products are the substances formed by the reaction.
</p>
`
    },


    {
        id: "english-grammar",
        title: "English Grammar",
        category: "English",
        emoji: "📖",
        description: "Learn sentence structure and parts of speech.",
        content: `
<h3>Parts of Speech</h3>

<ul>
<li>Nouns name people, places, things or ideas.</li>
<li>Verbs describe actions or states.</li>
<li>Adjectives describe nouns.</li>
<li>Adverbs modify verbs, adjectives or other adverbs.</li>
</ul>

<h3>Sentence</h3>

<p>
A complete sentence normally expresses a complete thought.
</p>
`
    },


    {
        id: "computer-science",
        title: "Computer Science Basics",
        category: "Computer Science",
        emoji: "💻",
        description: "Learn algorithms, programs and computational thinking.",
        content: `
<h3>Computer Science</h3>

<p>
Computer science studies computation, algorithms,
data and computer systems.
</p>

<h3>Algorithms</h3>

<p>
An algorithm is a step-by-step procedure for solving a problem.
</p>

<h3>Programming</h3>

<p>
Programming means writing instructions that a computer
can execute.
</p>
`
    },


    {
        id: "javascript",
        title: "JavaScript Basics",
        category: "Programming",
        emoji: "🟨",
        description: "Variables, functions and basic JavaScript.",
        content: `
<h3>JavaScript</h3>

<p>
JavaScript is a programming language commonly used
to make web pages interactive.
</p>

<h3>Variables</h3>

<p>
Variables store values that a program can use.
</p>

<h3>Functions</h3>

<p>
Functions group instructions that can be called when needed.
</p>
`
    },


    {
        id: "python",
        title: "Python Basics",
        category: "Programming",
        emoji: "🐍",
        description: "Learn Python variables, conditions and loops.",
        content: `
<h3>Python</h3>

<p>
Python is a general-purpose programming language
known for readable syntax.
</p>

<h3>Variables</h3>

<p>
A variable can store a value such as a number or text.
</p>

<h3>Conditions</h3>

<p>
An if statement lets a program make decisions.
</p>

<h3>Loops</h3>

<p>
Loops repeat instructions.
</p>
`
    },


    {
        id: "astronomy",
        title: "The Solar System",
        category: "Astronomy",
        emoji: "🪐",
        description: "Explore the Sun, planets and other objects.",
        content: `
<h3>The Solar System</h3>

<p>
Our Solar System contains the Sun and the objects
that orbit it.
</p>

<h3>Planets</h3>

<p>
The eight planets orbit the Sun.
They are divided broadly into terrestrial planets
and giant planets.
</p>

<h3>Gravity</h3>

<p>
Gravity plays a major role in keeping planets
in orbit around the Sun.
</p>
`
    },


    {
        id: "geography",
        title: "Geography Basics",
        category: "Geography",
        emoji: "🗺️",
        description: "Learn continents, countries, maps and physical geography.",
        content: `
<h3>Geography</h3>

<p>
Geography studies Earth's places, environments,
people and spatial relationships.
</p>

<h3>Physical Geography</h3>

<p>
Physical geography includes landforms, climate,
water and natural processes.
</p>

<h3>Human Geography</h3>

<p>
Human geography studies people and their relationship
with places and environments.
</p>
`
    }

];


/* =====================================================
   LESSON LOADING
===================================================== */

function loadLessons() {

    const grid = $("lessonGrid");
    const categories = $("lessonCategories");

    if (!grid || !categories) return;

    $("lessonCount").textContent = lessons.length;

    const categoryNames = [
        "All",
        ...new Set(
            lessons.map(lesson => lesson.category)
        )
    ];

    categories.innerHTML = categoryNames
        .map(category => `
            <button
                class="lessonCategoryButton"
                onclick="filterLessons('${escapeHTML(category)}')"
            >
                ${escapeHTML(category)}
            </button>
        `)
        .join("");

    renderLessons();
}


function filterLessons(category) {

    currentLessonCategory = category;

    renderLessons();
}


function renderLessons() {

    const grid = $("lessonGrid");

    if (!grid) return;

    const visibleLessons =
        currentLessonCategory === "All"
            ? lessons
            : lessons.filter(
                lesson =>
                    lesson.category === currentLessonCategory
            );

    grid.innerHTML = visibleLessons
        .map(lesson => `

            <div
                class="lessonCard"
                onclick="selectLesson('${lesson.id}')"
            >

                <div class="lessonEmoji">
                    ${lesson.emoji}
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

            </div>

        `)
        .join("");
}


/* =====================================================
   SELECT LESSON
===================================================== */

function selectLesson(id) {

    selectedLesson =
        lessons.find(
            lesson => lesson.id === id
        );

    if (!selectedLesson) return;

    const box = $("selectedLessonBox");

    box.classList.remove("hidden");

    $("selectedLessonCategory").textContent =
        selectedLesson.category;

    $("selectedLessonTitle").textContent =
        `${selectedLesson.emoji} ${selectedLesson.title}`;

    $("selectedLessonDescription").textContent =
        selectedLesson.description;

    $("selectedLessonContent").innerHTML =
        selectedLesson.content;

    $("aiTeacherLessonLabel").textContent =
        `Current lesson: ${selectedLesson.title}`;

    const quizLabel = $("quizAITeacherLesson");

    if (quizLabel) {
        quizLabel.textContent =
            `Current lesson: ${selectedLesson.title}`;
    }

    showToast(
        `${selectedLesson.title} selected!`
    );

    box.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function openAITeacher() {

    openPage("aiPage");

    if (!selectedLesson) {
        loadLessons();
    }

}


function prepareAITeacherForLesson() {

    if (!selectedLesson) {

        showToast(
            "Choose a lesson first."
        );

        return;
    }

    openAITeacher();

    setTimeout(() => {

        const input =
            $("aiTeacherInput");

        if (input) {
            input.focus();
        }

    }, 100);
}


/* =====================================================
   QUIZ
===================================================== */

function startSelectedLessonQuiz() {

    if (!selectedLesson) {

        showToast(
            "Choose a lesson first."
        );

        return;
    }

    const quizQuestions = {

        "math-basics":
            "What are the four basic arithmetic operations?",

        "fractions":
            "In the fraction 3/4, what do the numerator and denominator represent?",

        "algebra":
            "Solve x + 5 = 12.",

        "physics":
            "What is a force?",

        "gravity":
            "Why does a dropped object move toward Earth?",

        "biology-cells":
            "What is a cell?",

        "photosynthesis":
            "What is photosynthesis?",

        "chemistry-atoms":
            "Name the three main subatomic particles.",

        "chemical-reactions":
            "What are reactants and products?",

        "english-grammar":
            "What is a verb?",

        "computer-science":
            "What is an algorithm?",

        "javascript":
            "What is a JavaScript function?",

        "python":
            "What is a loop used for?",

        "astronomy":
            "What does the Solar System contain?",

        "geography":
            "What is geography?"
    };

    currentQuiz = {
        question:
            quizQuestions[selectedLesson.id] ||
            `Explain one important idea from ${selectedLesson.title}.`
    };

    $("quizLessonName").textContent =
        selectedLesson.title;

    $("quizQuestion").innerHTML = `
        <h2>
            ${escapeHTML(currentQuiz.question)}
        </h2>
    `;

    $("quizAnswer").value = "";

    $("quizResult").innerHTML = "";

    openPage("quizPage");
}


function checkQuiz() {

    if (!selectedLesson || !currentQuiz) {

        showToast(
            "Please choose a lesson first."
        );

        return;
    }

    const answer =
        $("quizAnswer").value.trim();

    if (!answer) {

        showToast(
            "Write an answer first."
        );

        return;
    }

    const lower =
        answer.toLowerCase();

    let correct = false;

    if (selectedLesson.id === "algebra") {

        correct =
            lower.includes("7");

    } else if (
        selectedLesson.id === "math-basics"
    ) {

        correct =
            lower.includes("addition") &&
            lower.includes("subtraction") &&
            lower.includes("multiplication") &&
            lower.includes("division");

    } else if (
        selectedLesson.id === "fractions"
    ) {

        correct =
            lower.includes("numerator") &&
            lower.includes("denominator");

    } else if (
        selectedLesson.id === "physics"
    ) {

        correct =
            lower.includes("push") ||
            lower.includes("pull") ||
            lower.includes("force");

    } else if (
        selectedLesson.id === "gravity"
    ) {

        correct =
            lower.includes("gravity");

    } else if (
        selectedLesson.id === "biology-cells"
    ) {

        correct =
            lower.includes("unit") &&
            lower.includes("life");

    } else if (
        selectedLesson.id === "photosynthesis"
    ) {

        correct =
            lower.includes("light") &&
            (
                lower.includes("food") ||
                lower.includes("energy")
            );

    } else if (
        selectedLesson.id === "chemistry-atoms"
    ) {

        correct =
            lower.includes("proton") &&
            lower.includes("neutron") &&
            lower.includes("electron");

    } else if (
        selectedLesson.id === "chemical-reactions"
    ) {

        correct =
            lower.includes("reactant") &&
            lower.includes("product");

    } else if (
        selectedLesson.id === "english-grammar"
    ) {

        correct =
            lower.includes("action") ||
            lower.includes("verb");

    } else if (
        selectedLesson.id === "computer-science"
    ) {

        correct =
            lower.includes("step") &&
            lower.includes("problem");

    } else if (
        selectedLesson.id === "javascript"
    ) {

        correct =
            lower.includes("function");

    } else if (
        selectedLesson.id === "python"
    ) {

        correct =
            lower.includes("repeat");

    } else if (
        selectedLesson.id === "astronomy"
    ) {

        correct =
            lower.includes("sun") &&
            lower.includes("planet");

    } else if (
        selectedLesson.id === "geography"
    ) {

        correct =
            lower.includes("earth") ||
            lower.includes("place");

    } else {

        correct = answer.length >= 10;
    }


    if (correct) {

        state.coins += 10;

        state.sessions += 1;

        save();

        $("quizResult").innerHTML = `
            <div class="successResult">
                🎉 Correct!
                <br>
                💰 +10 TeachCoins
            </div>
        `;

        showToast(
            "Correct! You earned 10 coins."
        );

    } else {

        $("quizResult").innerHTML = `
            <div class="retryResult">
                🤔 Not quite.

                <br><br>

                Try explaining the idea again,
                or ask the AI Teacher below for help.
            </div>
        `;

    }
}


/* =====================================================
   AI MESSAGE UI
===================================================== */

function addAIMessage(
    text,
    sender = "ai"
) {

    const containers = [
        $("aiTeacherMessages"),
        $("quizAIMessages")
    ];

    containers.forEach(container => {

        if (!container) return;

        const bubble =
            document.createElement("div");

        bubble.className =
            sender === "user"
                ? "userBubble"
                : "aiBubble";

        const strong =
            sender === "user"
                ? "You"
                : "🤖 AI Teacher";

        bubble.innerHTML = `
            <strong>${strong}</strong>
            <p>${escapeHTML(text)}</p>
        `;

        container.appendChild(bubble);

        container.scrollTop =
            container.scrollHeight;
    });
}


/* =====================================================
   REAL AI
===================================================== */

async function askAITeacher(customMessage = null) {

    let input =
        $("aiTeacherInput");

    if (!input) {
        input = $("quizAIInput");
    }

    let message =
        customMessage ||
        input?.value.trim();

    if (!message) {

        showToast(
            "Type a question first."
        );

        return;
    }

    if (!selectedLesson) {

        showToast(
            "Choose a lesson first."
        );

        return;
    }

    if (input) {
        input.value = "";
    }

    addAIMessage(
        message,
        "user"
    );

    addAIMessage(
        "Thinking... 🤔",
        "ai"
    );

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

                        message: message,

                        lesson: {
                            id:
                                selectedLesson.id,

                            title:
                                selectedLesson.title,

                            category:
                                selectedLesson.category,

                            description:
                                selectedLesson.description,

                            content:
                                selectedLesson.content
                        }

                    })
                }
            );


        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        if (!response.ok) {

            let errorMessage =
                `AI server error (${response.status}).`;

            if (
                contentType.includes(
                    "application/json"
                )
            ) {

                const data =
                    await response.json();

                errorMessage =
                    data.error ||
                    errorMessage;
            }

            throw new Error(
                errorMessage
            );
        }


        if (
            !contentType.includes(
                "application/json"
            )
        ) {

            const text =
                await response.text();

            console.error(
                "Expected JSON but received:",
                text.substring(0, 500)
            );

            throw new Error(
                "The AI server returned HTML instead of JSON. Check the Render API URL."
            );
        }


        const data =
            await response.json();


        if (!data.answer) {
            throw new Error(
                "AI returned no answer."
            );
        }


        // Remove "Thinking..."
        document
            .querySelectorAll(".aiBubble")
            .forEach(bubble => {

                if (
                    bubble.textContent.includes(
                        "Thinking..."
                    )
                ) {
                    bubble.remove();
                }

            });


        addAIMessage(
            data.answer,
            "ai"
        );

    } catch (error) {

        console.error(
            "AI ERROR:",
            error
        );

        document
            .querySelectorAll(".aiBubble")
            .forEach(bubble => {

                if (
                    bubble.textContent.includes(
                        "Thinking..."
                    )
                ) {
                    bubble.remove();
                }

            });

        addAIMessage(
            `Sorry, I couldn't reach the AI right now.\n\n${error.message}`,
            "ai"
        );

    }
}


function askAIQuick(question) {
    askAITeacher(question);
}


/* =====================================================
   AI ACTIVITY
===================================================== */

async function teacherAIHelp() {

    if (!selectedLesson) {

        showToast(
            "Choose a lesson first."
        );

        return;
    }

    const result =
        $("teacherAIResult");

    result.textContent =
        "Creating activity... 🤖";

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

                        message:
                            `Create a short interactive learning activity for this lesson.

Lesson: ${selectedLesson.title}

Make it suitable for a school learner.
Include one question and explain what the learner should do.`,

                        lesson: selectedLesson

                    })
                }
            );


        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        if (
            !response.ok ||
            !contentType.includes("application/json")
        ) {

            throw new Error(
                "AI server did not return a valid response."
            );
        }


        const data =
            await response.json();

        result.textContent =
            data.answer ||
            "No activity was generated.";

    } catch (error) {

        console.error(
            "ACTIVITY ERROR:",
            error
        );

        result.textContent =
            `Could not create the activity.\n\n${error.message}`;
    }
}


/* =====================================================
   REAL REGISTERED USERS
===================================================== */

async function getRealUsers() {

    const response =
        await fetch(
            `${API_URL}/api/people`,
            {
                method: "GET",
                headers: {
                    "Accept":
                        "application/json"
                }
            }
        );

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";

    if (!response.ok) {

        throw new Error(
            `People API error: ${response.status}`
        );
    }

    if (
        !contentType.includes(
            "application/json"
        )
    ) {

        throw new Error(
            "People API returned HTML instead of JSON."
        );
    }

    return await response.json();
}


/* =====================================================
   REAL MATCHING
===================================================== */

async function chooseRole(role) {

    currentRole = role;

    openPage("searchPage");

    if (role === "learner") {

        $("searchTitle").textContent =
            "Finding a teacher...";

        $("searchText").textContent =
            "Looking for a real teacher volunteer";

    } else {

        $("searchTitle").textContent =
            "Finding a learner...";

        $("searchText").textContent =
            "Looking for a real learner volunteer";
    }


    try {

        const users =
            await getRealUsers();


        const myName =
            state.name.toLowerCase();


        let available =
            users.filter(user => {

                if (
                    !user.username ||
                    user.username.toLowerCase() === myName
                ) {
                    return false;
                }

                if (role === "learner") {

                    return (
                        user.role === "teacher" ||
                        user.role === "Teacher"
                    );

                }

                return (
                    user.role === "learner" ||
                    user.role === "Learner"
                );

            });


        /*
         * If users exist but their role has not been
         * configured yet, don't invent a fake person.
         */

        if (!available.length) {

            setTimeout(() => {

                if (role === "learner") {

                    showToast(
                        "No teacher volunteers are available right now."
                    );

                    const useAI =
                        confirm(
                            "No real teacher is available right now.\n\nWould you like the AI Teacher to help you?"
                        );

                    if (useAI) {
                        openAITeacher();
                    } else {
                        goHome();
                    }

                } else {

                    showToast(
                        "No learner volunteers are available right now."
                    );

                    setTimeout(
                        goHome,
                        1000
                    );

                }

            }, 800);

            return;
        }


        /*
         * Choose a real registered user.
         */

        const person =
            available[
                Math.floor(
                    Math.random() *
                    available.length
                )
            ];


        currentPerson =
            person.username;


        state.sessions++;

        save();


        setTimeout(() => {

            openChat(
                person.username
            );

        }, 800);


    } catch (error) {

        console.error(
            "MATCHING ERROR:",
            error
        );

        showToast(
            "Could not check real users."
        );

        setTimeout(
            goHome,
            1200
        );
    }
}


/* =====================================================
   PEOPLE LIST
===================================================== */

async function loadPeople() {

    const container =
        $("peopleList");

    if (!container) return;

    container.innerHTML = `
        <div class="noPeople">
            🔎 Loading real Teachly users...
        </div>
    `;


    try {

        const users =
            await getRealUsers();


        if (!users.length) {

            container.innerHTML = `
                <div class="noPeople">

                    <h2>
                        👥 No users yet
                    </h2>

                    <p>
                        You're one of the first Teachly users!
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
            users.map(user => {

                const avatar =
                    user.profileImage
                        ? `
                            <img
                                src="${escapeHTML(user.profileImage)}"
                                alt="Profile"
                            >
                          `
                        : "👤";


                return `

                    <div class="realPersonCard">

                        <div class="realPersonAvatar">
                            ${avatar}
                        </div>

                        <h3>
                            ${escapeHTML(user.username)}
                        </h3>

                        <p>
                            ${
                                user.role
                                    ? escapeHTML(user.role)
                                    : "Teachly member"
                            }
                        </p>

                        <p>
                            📚 Sessions:
                            ${Number(user.sessions || 0)}
                        </p>

                        <button
                            onclick="connectPerson('${escapeHTML(user.username)}')"
                        >
                            CONNECT
                        </button>

                    </div>

                `;

            }).join("");

    } catch (error) {

        console.error(
            "PEOPLE ERROR:",
            error
        );

        container.innerHTML = `
            <div class="noPeople">

                <h2>
                    ⚠️ Couldn't load users
                </h2>

                <p>
                    Please try again.
                </p>

            </div>
        `;
    }
}


function connectPerson(username) {

    currentPerson =
        username;

    state.sessions++;

    save();

    openChat(username);
}


/* =====================================================
   CHAT
===================================================== */

function openChat(person) {

    currentPerson =
        person;

    $("chatTitle").textContent =
        `Chat with ${person}`;

    $("chatMessages").innerHTML = `
        <div class="aiBubble">
            👋 You are connected with
            ${escapeHTML(person)}.
        </div>
    `;

    openPage("chatPage");
}


function sendMessage() {

    const input =
        $("messageInput");

    const message =
        input?.value.trim();

    if (!message) return;

    const messages =
        $("chatMessages");

    const bubble =
        document.createElement("div");

    bubble.className =
        "userBubble";

    bubble.innerHTML =
        `<p>${escapeHTML(message)}</p>`;

    messages.appendChild(bubble);

    input.value = "";

    messages.scrollTop =
        messages.scrollHeight;
}


function addEmoji(emoji) {

    const input =
        $("messageInput");

    if (!input) return;

    input.value += emoji;

    input.focus();
}


/* =====================================================
   BADGES
===================================================== */

const badges = [
    ["first", "🌟", "First Step", 1],
    ["learner", "📚", "Learner", 5],
    ["teacher", "🧑‍🏫", "Teacher", 10],
    ["expert", "🏆", "Expert", 25],
    ["master", "👑", "Teachly Master", 50]
];


function loadBadges() {

    const container =
        $("allBadges");

    const home =
        $("badgesHome");

    const html =
        badges.map(badge => {

            const unlocked =
                state.sessions >= badge[3];

            return `
                <div class="badgeCard ${unlocked ? "" : "locked"}">

                    <div class="badgeIcon">
                        ${badge[1]}
                    </div>

                    <h3>
                        ${badge[2]}
                    </h3>

                    <p>
                        ${badge[3]} session(s)
                    </p>

                    <span>
                        ${
                            unlocked
                                ? "Unlocked ✓"
                                : "Locked 🔒"
                        }
                    </span>

                </div>
            `;

        }).join("");


    if (container) {
        container.innerHTML = html;
    }

    if (home) {
        home.innerHTML =
            html.substring(0, 1200);
    }
}


/* =====================================================
   SHOP
===================================================== */

const shopItems = [
    ["blue", "🔵", "Blue Profile Effect", 20],
    ["star", "⭐", "Star Effect", 30],
    ["fire", "🔥", "Fire Effect", 50],
    ["crown", "👑", "Crown Effect", 100]
];


function loadShop() {

    const container =
        $("shopList");

    const home =
        $("shopHome");


    const html =
        shopItems.map(item => {

            const owned =
                state.owned.includes(item[0]);

            return `
                <div class="shopItem">

                    <div class="shopIcon">
                        ${item[1]}
                    </div>

                    <h3>
                        ${item[2]}
                    </h3>

                    <p>
                        💰 ${item[3]}
                    </p>

                    <button
                        onclick="buyShopItem('${item[0]}')"
                        ${owned ? "disabled" : ""}
                    >
                        ${
                            owned
                                ? "OWNED ✓"
                                : "BUY"
                        }
                    </button>

                </div>
            `;

        }).join("");


    if (container) {
        container.innerHTML = html;
    }

    if (home) {
        home.innerHTML = html;
    }
}


function buyShopItem(id) {

    const item =
        shopItems.find(
            item => item[0] === id
        );

    if (!item) return;

    if (state.owned.includes(id)) {

        showToast(
            "You already own this."
        );

        return;
    }

    if (state.coins < item[3]) {

        showToast(
            "Not enough TeachCoins."
        );

        return;
    }

    state.coins -= item[3];

    state.owned.push(id);

    save();

    loadShop();

    showToast(
        `${item[2]} purchased!`
    );
}


/* =====================================================
   PROFILE
===================================================== */

function loadProfile() {

    updateUI();

    if ($("profileBadges")) {
        $("profileBadges").textContent =
            state.badges.length;
    }
}


/* =====================================================
   MAP
===================================================== */

let worldMap = null;


function loadMap() {

    if (
        worldMap ||
        !window.L
    ) {
        return;
    }

    const mapElement =
        $("worldMap");

    if (!mapElement) return;

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
            maxZoom: 18
        }
    ).addTo(worldMap);


    const locations = [
        ["India", 20.5937, 78.9629],
        ["Japan", 36.2048, 138.2529],
        ["United Kingdom", 55.3781, -3.4360],
        ["United States", 37.0902, -95.7129],
        ["Australia", -25.2744, 133.7751]
    ];


    locations.forEach(
        location => {

            const marker =
                L.marker([
                    location[1],
                    location[2]
                ]).addTo(worldMap);

            marker.on(
                "click",
                () => {

                    $("countryInfo").innerHTML = `
                        <h2>🌎 ${location[0]}</h2>
                        <p>
                            Explore this location
                            and learn something new.
                        </p>
                    `;

                }
            );

        }
    );
}


/* =====================================================
   MYSTERY
===================================================== */

const mysteryTopics = [
    [
        "Black Holes",
        "Extremely dense astronomical objects with very strong gravity."
    ],
    [
        "The Human Brain",
        "The brain is the main organ of the nervous system."
    ],
    [
        "Ocean Life",
        "Oceans contain an enormous variety of living organisms."
    ],
    [
        "Volcanoes",
        "Volcanoes are openings through which molten material and gases can reach the surface."
    ]
];


function mysteryTopic() {

    const topic =
        mysteryTopics[
            Math.floor(
                Math.random() *
                mysteryTopics.length
            )
        ];


    $("mysteryTitle").textContent =
        topic[0];

    $("mysteryDescription").textContent =
        topic[1];
}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateUI();

        loadLessons();

        loadBadges();

        loadShop();


        const aiInput =
            $("aiTeacherInput");

        if (aiInput) {

            aiInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {
                        event.preventDefault();
                        askAITeacher();
                    }

                }
            );

        }


        const quizAIInput =
            $("quizAIInput");

        if (quizAIInput) {

            quizAIInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {
                        event.preventDefault();
                        askAITeacher();
                    }

                }
            );

        }


        const messageInput =
            $("messageInput");

        if (messageInput) {

            messageInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {
                        event.preventDefault();
                        sendMessage();
                    }

                }
            );

        }

    }
);
