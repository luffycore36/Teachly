/* =====================================================
   TEACHLY FRONTEND AUTHENTICATION
   Username + Password only
===================================================== */

let currentUser = null;

const USERS_KEY = "teachlyUsers";
const SESSION_KEY = "teachlyCurrentUser";


/* =====================================================
   BADGES
===================================================== */

const badges = [
    { name: "Starter", sessions: 5, icon: "🥉" },
    { name: "Learner", sessions: 15, icon: "🥉" },
    { name: "Explorer", sessions: 50, icon: "🥈" },
    { name: "Knowledge Seeker", sessions: 75, icon: "🥈" },
    { name: "Skill Builder", sessions: 100, icon: "🥇" },
    { name: "Mentor", sessions: 150, icon: "🥇" },
    { name: "Expert", sessions: 250, icon: "🏆" },
    { name: "Master", sessions: 500, icon: "🏆" },
    { name: "Legend", sessions: 750, icon: "💎" },
    { name: "Teachly Champion", sessions: 1000, icon: "👑" }
];


/* =====================================================
   STORAGE
===================================================== */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(USERS_KEY)
        ) || [];

    } catch {

        return [];

    }
}


function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


/* =====================================================
   AUTH MODE
===================================================== */

function setAuthMode(mode) {

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");

    const loginTab =
        document.getElementById("loginTab");

    const signupTab =
        document.getElementById("signupTab");


    loginForm.classList.toggle(
        "hidden",
        mode !== "login"
    );

    signupForm.classList.toggle(
        "hidden",
        mode !== "signup"
    );


    loginTab.classList.toggle(
        "active",
        mode === "login"
    );

    signupTab.classList.toggle(
        "active",
        mode === "signup"
    );


    showAuthMessage("");

}


/* =====================================================
   MESSAGE
===================================================== */

function showAuthMessage(message) {

    document.getElementById(
        "authMessage"
    ).textContent = message;

}


/* =====================================================
   REGISTER
===================================================== */

function register(event) {

    event.preventDefault();


    const username =
        document
            .getElementById("signupUsername")
            .value
            .trim();


    const password =
        document
            .getElementById("signupPassword")
            .value;


    const confirmPassword =
        document
            .getElementById("signupPasswordConfirm")
            .value;


    if (!username) {

        showAuthMessage(
            "Please enter a username."
        );

        return;

    }


    if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {

        showAuthMessage(
            "Username must be 3–30 characters and use only letters, numbers, _, . or -."
        );

        return;

    }


    if (password.length < 8) {

        showAuthMessage(
            "Password must contain at least 8 characters."
        );

        return;

    }


    if (password !== confirmPassword) {

        showAuthMessage(
            "Passwords do not match."
        );

        return;

    }


    const users = getUsers();


    /*
       Username comparison is case-insensitive.
       Example:
       Luffy
       luffy
       LUFFY

       These are treated as the same username.
    */

    const usernameTaken =
        users.some(
            user =>
                user.username.toLowerCase() ===
                username.toLowerCase()
        );


    if (usernameTaken) {

        showAuthMessage(
            "Username is already taken"
        );

        return;

    }


    const user = {

        id:
            crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now().toString(),

        username,

        password,

        sessions: 0,

        tickets: 0,

        streak: 0,

        earnedBadges: [],

        ownedEffects: [],

        equippedEffect: "",

        profileImage: ""

    };


    users.push(user);

    saveUsers(users);


    showAuthMessage(
        "Account created successfully! You can now log in."
    );


    document
        .getElementById("signupForm")
        .reset();


    setTimeout(() => {

        setAuthMode("login");

        document
            .getElementById("loginUsername")
            .value = username;

    }, 500);

}


/* =====================================================
   LOGIN
===================================================== */

function login(event) {

    event.preventDefault();


    const username =
        document
            .getElementById("loginUsername")
            .value
            .trim();


    const password =
        document
            .getElementById("loginPassword")
            .value;


    if (!username || !password) {

        showAuthMessage(
            "Please enter your username and password."
        );

        return;

    }


    const users = getUsers();


    const user =
        users.find(
            item =>
                item.username.toLowerCase() ===
                    username.toLowerCase() &&
                item.password === password
        );


    if (!user) {

        showAuthMessage(
            "Username or password is incorrect."
        );

        return;

    }


    currentUser = user;


    localStorage.setItem(
        SESSION_KEY,
        user.id
    );


    finishLogin();

}


/* =====================================================
   FINISH LOGIN
===================================================== */

function finishLogin() {

    document
        .getElementById("authPage")
        .classList.add("hidden");


    document
        .getElementById("mainNav")
        .classList.remove("hidden");


    document
        .getElementById("navUsername")
        .textContent =
        currentUser.username;


    updateProfile();

    showPage("homePage");

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        SESSION_KEY
    );


    currentUser = null;


    document
        .getElementById("mainNav")
        .classList.add("hidden");


    document
        .querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.add("hidden")
        );


    document
        .getElementById("authPage")
        .classList.remove("hidden");


    document
        .getElementById("loginForm")
        .reset();


    showAuthMessage("");

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(id) {

    if (!currentUser) {
        return;
    }


    document
        .querySelectorAll("main > .page")
        .forEach(
            page =>
                page.classList.add("hidden")
        );


    const page =
        document.getElementById(id);


    if (page) {
        page.classList.remove("hidden");
    }


    if (id === "badgesPage") {
        renderBadges();
    }

}


/* =====================================================
   ROLE
===================================================== */

function selectRole(role) {

    if (!currentUser) {
        return;
    }


    currentUser.role = role;

    updateStoredUser();


    alert(
        `You selected ${role}.`
    );

}


/* =====================================================
   PROFILE
===================================================== */

function updateProfile() {

    if (!currentUser) {
        return;
    }


    document.getElementById(
        "profileName"
    ).textContent =
        currentUser.username;


    document.getElementById(
        "profileSessions"
    ).textContent =
        currentUser.sessions || 0;


    document.getElementById(
        "profileTickets"
    ).textContent =
        currentUser.tickets || 0;


    document.getElementById(
        "profileStreak"
    ).textContent =
        currentUser.streak || 0;


    document.getElementById(
        "sessionsStat"
    ).textContent =
        currentUser.sessions || 0;


    document.getElementById(
        "ticketsStat"
    ).textContent =
        currentUser.tickets || 0;


    document.getElementById(
        "navUsername"
    ).textContent =
        currentUser.username;


    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    if (currentUser.profileImage) {

        avatar.src =
            currentUser.profileImage;

    } else {

        /*
           Simple generated avatar using the
           first letter of the username.
        */

        avatar.src =
            createAvatar(
                currentUser.username
            );

    }


    updateAvatarEffect();

}


/* =====================================================
   AVATAR
===================================================== */

function createAvatar(username) {

    const letter =
        username
            .charAt(0)
            .toUpperCase();


    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="200"
             height="200">

            <rect
                width="200"
                height="200"
                rx="100"
                fill="#17283d"
            />

            <text
                x="100"
                y="125"
                text-anchor="middle"
                font-size="90"
                fill="white"
                font-family="Arial"
            >
                ${letter}
            </text>

        </svg>
    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* =====================================================
   EFFECT
===================================================== */

function updateAvatarEffect() {

    const effect =
        document.getElementById(
            "avatarEffect"
        );


    effect.className =
        "avatar-effect";


    if (
        currentUser &&
        currentUser.equippedEffect
    ) {

        effect.classList.add(
            currentUser.equippedEffect
        );

    }

}


/* =====================================================
   BADGES
===================================================== */

function renderBadges() {

    const grid =
        document.getElementById(
            "badgeGrid"
        );


    if (!grid) {
        return;
    }


    const sessions =
        currentUser?.sessions || 0;


    grid.innerHTML = "";


    badges.forEach(badge => {

        const unlocked =
            sessions >= badge.sessions;


        const div =
            document.createElement("div");


        div.className =
            "badge" +
            (
                unlocked
                    ? ""
                    : " locked"
            );


        div.innerHTML = `

            <div class="icon">
                ${badge.icon}
            </div>

            <h3>
                ${badge.name}
            </h3>

            <p>
                ${badge.sessions} sessions
            </p>

            <strong>
                ${unlocked ? "Unlocked" : "Locked"}
            </strong>

        `;


        grid.appendChild(div);

    });

}


/* =====================================================
   UPDATE USER
===================================================== */

function updateStoredUser() {

    if (!currentUser) {
        return;
    }


    const users =
        getUsers();


    const index =
        users.findIndex(
            user =>
                user.id ===
                currentUser.id
        );


    if (index === -1) {
        return;
    }


    users[index] =
        currentUser;


    saveUsers(users);

}


/* =====================================================
   RESTORE SESSION
===================================================== */

function restoreSession() {

    const userId =
        localStorage.getItem(
            SESSION_KEY
        );


    if (!userId) {
        return;
    }


    const users =
        getUsers();


    const user =
        users.find(
            item =>
                item.id === userId
        );


    if (!user) {

        localStorage.removeItem(
            SESSION_KEY
        );

        return;

    }


    currentUser =
        user;


    finishLogin();

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setAuthMode("login");

        restoreSession();

    }
);
