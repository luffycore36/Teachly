
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" }));
app.use(express.static(__dirname));

/* =========================
   DATA STORAGE
========================= */

const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]");
}

function loadUsers() {
    try {
        return JSON.parse(fs.readFileSync(usersFile, "utf8"));
    } catch {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2)
    );
}

/* =========================
   SESSIONS
========================= */

const sessions = new Map();

function createSession(userId) {
    const token = crypto.randomBytes(32).toString("hex");

    sessions.set(token, {
        userId,
        createdAt: Date.now()
    });

    return token;
}

function getUserFromToken(token) {
    if (!token) return null;

    const session = sessions.get(token);

    if (!session) return null;

    const users = loadUsers();

    return users.find(
        user => user.id === session.userId
    ) || null;
}

function publicUser(user) {
    if (!user) return null;

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage || "",
        role: user.role || "",
        tickets: user.tickets || 0,
        sessions: user.sessions || 0,
        streak: user.streak || 0,
        earnedBadges: user.earnedBadges || [],
        ownedEffects: user.ownedEffects || [],
        equippedEffect: user.equippedEffect || ""
    };
}

function authenticated(req, res, next) {
    const token =
        req.headers.authorization?.replace(
            "Bearer ",
            ""
        );

    const user = getUserFromToken(token);

    if (!user) {
        return res.status(401).json({
            error: "Please log in first."
        });
    }

    req.user = user;
    req.token = token;

    next();
}

/* =========================
   EMAIL
========================= */

const transporter =
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD
        ? nodemailer.createTransport({
              service: "gmail",
              auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD
              }
          })
        : null;

/* =========================
   REGISTER
========================= */

app.post(
    "/api/auth/register",
    async (req, res) => {

        try {

            const {
                username,
                email,
                password
            } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    error:
                        "Please fill in all fields."
                });
            }

            const cleanEmail =
                email.trim().toLowerCase();

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    cleanEmail
                )
            ) {
                return res.status(400).json({
                    error:
                        "Please enter a valid email address."
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    error:
                        "Password must contain at least 8 characters."
                });
            }

            const users = loadUsers();

            const existingEmail =
                users.find(
                    user =>
                        user.email ===
                        cleanEmail
                );

            if (existingEmail) {
                return res.status(409).json({
                    error:
                        "This email is already being used. Please log in."
                });
            }

            const existingUsername =
                users.find(
                    user =>
                        user.username.toLowerCase() ===
                        username.trim().toLowerCase()
                );

            if (existingUsername) {
                return res.status(409).json({
                    error:
                        "That username is already being used."
                });
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );

            const verificationCode =
                String(
                    Math.floor(
                        100000 +
                        Math.random() *
                        900000
                    )
                );

            const user = {
                id: crypto.randomUUID(),

                username:
                    username.trim(),

                email:
                    cleanEmail,

                password:
                    hashedPassword,

                verified: false,

                verificationCode,

                verificationExpires:
                    Date.now() +
                    10 * 60 * 1000,

                profileImage: "",

                role: "",

                tickets: 0,

                sessions: 0,

                streak: 0,

                earnedBadges: [],

                ownedEffects: [],

                equippedEffect: ""
            };

            users.push(user);

            saveUsers(users);

            if (transporter) {

                await transporter.sendMail({
                    from:
                        process.env.EMAIL_USER,

                    to:
                        cleanEmail,

                    subject:
                        "Teachly verification code",

                    text:
                        `Your Teachly verification code is ${verificationCode}. It expires in 10 minutes.`
                });

            } else {

                console.log(
                    "Teachly verification code:",
                    verificationCode
                );

            }

            res.json({
                message:
                    "Verification code sent. Check your email."
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    "Unable to create account."
            });

        }

    }
);

/* =========================
   VERIFY EMAIL
========================= */

app.post(
    "/api/auth/verify-email",
    (req, res) => {

        const {
            email,
            code
        } = req.body;

        const users = loadUsers();

        const user =
            users.find(
                u =>
                    u.email ===
                    email.trim().toLowerCase()
            );

        if (!user) {
            return res.status(404).json({
                error:
                    "Account not found."
            });
        }

        if (user.verified) {
            return res.status(400).json({
                error:
                    "This email is already verified."
            });
        }

        if (
            Date.now() >
            user.verificationExpires
        ) {
            return res.status(400).json({
                error:
                    "Verification code expired. Please register again."
            });
        }

        if (
            code !==
            user.verificationCode
        ) {
            return res.status(400).json({
                error:
                    "Incorrect verification code."
            });
        }

        user.verified = true;

        delete user.verificationCode;
        delete user.verificationExpires;

        saveUsers(users);

        const token =
            createSession(user.id);

        res.json({
            token,
            user:
                publicUser(user)
        });

    }
);

/* =========================
   LOGIN
========================= */

app.post(
    "/api/auth/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;

            const users = loadUsers();

            const user =
                users.find(
                    u =>
                        u.email ===
                        email.trim().toLowerCase()
                );

            if (!user) {
                return res.status(401).json({
                    error:
                        "Email or password is incorrect."
                });
            }

            const passwordCorrect =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordCorrect) {
                return res.status(401).json({
                    error:
                        "Email or password is incorrect."
                });
            }

            if (!user.verified) {
                return res.status(403).json({
                    error:
                        "Please verify your email before logging in."
                });
            }

            const token =
                createSession(user.id);

            res.json({
                token,
                user:
                    publicUser(user)
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    "Unable to log in."
            });

        }

    }
);

/* =========================
   LOGOUT
========================= */

app.post(
    "/api/auth/logout",
    authenticated,
    (req, res) => {

        sessions.delete(req.token);

        res.json({
            message:
                "Logged out successfully."
        });

    }
);

/* =========================
   AVATAR
========================= */

app.post(
    "/api/auth/avatar",
    authenticated,
    (req, res) => {

        const {
            image
        } = req.body;

        if (!image) {
            return res.status(400).json({
                error:
                    "No image received."
            });
        }

        if (image.length > 4_000_000) {
            return res.status(400).json({
                error:
                    "Image is too large."
            });
        }

        const users = loadUsers();

        const user =
            users.find(
                u =>
                    u.id ===
                    req.user.id
            );

        user.profileImage = image;

        saveUsers(users);

        res.json({
            user:
                publicUser(user)
        });

    }
);

/* =========================
   SHOP
========================= */

const products = {
    ring: 30,
    spark: 45,
    crown: 70
};

app.post(
    "/api/shop/buy",
    authenticated,
    (req, res) => {

        const {
            id
        } = req.body;

        if (!products[id]) {
            return res.status(400).json({
                error:
                    "Unable to buy product"
            });
        }

        const users = loadUsers();

        const user =
            users.find(
                u =>
                    u.id ===
                    req.user.id
            );

        user.ownedEffects =
            user.ownedEffects || [];

        /*
          Already owned:
          don't charge again.
        */

        if (
            user.ownedEffects.includes(id)
        ) {

            user.equippedEffect = id;

            saveUsers(users);

            return res.json({
                user:
                    publicUser(user)
            });

        }

        if (
            (user.tickets || 0) <
            products[id]
        ) {
            return res.status(400).json({
                error:
                    "Unable to buy product"
            });
        }

        user.tickets -= products[id];

        user.ownedEffects.push(id);

        user.equippedEffect = id;

        saveUsers(users);

        res.json({
            user:
                publicUser(user)
        });

    }
);

/* =========================
   EQUIP
========================= */

app.post(
    "/api/shop/equip",
    authenticated,
    (req, res) => {

        const {
            id
        } = req.body;

        const users = loadUsers();

        const user =
            users.find(
                u =>
                    u.id ===
                    req.user.id
            );

        if (
            !user.ownedEffects?.includes(id)
        ) {
            return res.status(400).json({
                error:
                    "You do not own this effect."
            });
        }

        user.equippedEffect = id;

        saveUsers(users);

        res.json({
            user:
                publicUser(user)
        });

    }
);

/* =========================
   AI
========================= */

let openai = null;

if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey:
            process.env.OPENAI_API_KEY
    });
}

app.post(
    "/api/ai",
    authenticated,
    async (req, res) => {

        try {

            const {
                message
            } = req.body;

            if (!message) {
                return res.status(400).json({
                    error:
                        "Please enter a question."
                });
            }

            if (!openai) {
                return res.status(500).json({
                    error:
                        "AI is not configured yet."
                });
            }

            const response =
                await openai.responses.create({
                    model:
                        process.env.OPENAI_MODEL ||
                        "gpt-5.6-luna",

                    instructions:
                        "You are Teachly AI, a friendly tutor. Explain clearly, adapt to the learner, use examples, and encourage understanding. Do not pretend to be a real human teacher.",

                    input:
                        message
                });

            res.json({
                answer:
                    response.output_text
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    "AI could not respond right now."
            });

        }

    }
);

/* =========================
   MULTIPLAYER MATCHING
========================= */

const waitingUsers = new Map();
const rooms = new Map();

function topicsMatch(a, b) {

    const first =
        a.toLowerCase().trim();

    const second =
        b.toLowerCase().trim();

    return (
        first === second ||
        first.includes(second) ||
        second.includes(first)
    );

}

function removeFromWaiting(socketId) {

    for (
        const [id, person]
        of waitingUsers
    ) {

        if (id === socketId) {
            waitingUsers.delete(id);
        }

    }

}

io.on(
    "connection",
    socket => {

        socket.on(
            "authSession",
            () => {

                const token =
                    socket.handshake.auth?.token;

                const user =
                    getUserFromToken(token);

                if (!user || !user.verified) {

                    socket.emit(
                        "serverMessage",
                        "Please log in with a verified account."
                    );

                    socket.disconnect();

                    return;

                }

                socket.userId =
                    user.id;

                socket.username =
                    user.username;

            }
        );

        socket.on(
            "findUser",
            ({ role, topic }) => {

                if (!socket.userId) {
                    return;
                }

                removeFromWaiting(
                    socket.id
                );

                const oppositeRole =
                    role === "teacher"
                        ? "learner"
                        : "teacher";

                for (
                    const [
                        otherId,
                        other
                    ] of waitingUsers
                ) {

                    if (
                        other.role ===
                            oppositeRole &&
                        topicsMatch(
                            topic,
                            other.topic
                        )
                    ) {

                        waitingUsers.delete(
                            otherId
                        );

                        const room =
                            crypto.randomUUID();

                        rooms.set(
                            room,
                            {
                                users: [
                                    socket.id,
                                    other.socketId
                                ],
                                topic
                            }
                        );

                        socket.join(room);

                        io.sockets.sockets
                            .get(other.socketId)
                            ?.join(room);

                        const users =
                            loadUsers();

                        const current =
                            users.find(
                                u =>
                                    u.id ===
                                    socket.userId
                            );

                        const partner =
                            users.find(
                                u =>
                                    u.id ===
                                    other.userId
                            );

                        socket.emit(
                            "matchFound",
                            {
                                room,
                                topic,
                                partner:
                                    publicUser(
                                        partner
                                    )
                            }
                        );

                        io.to(
                            other.socketId
                        ).emit(
                            "matchFound",
                            {
                                room,
                                topic,
                                partner:
                                    publicUser(
                                        current
                                    )
                            }
                        );

                        return;

                    }

                }

                waitingUsers.set(
                    socket.id,
                    {
                        socketId:
                            socket.id,

                        userId:
                            socket.userId,

                        username:
                            socket.username,

                        role,

                        topic,

                        startedAt:
                            Date.now()
                    }
                );

                socket.emit(
                    "serverMessage",
                    "Searching for a real person..."
                );

                setTimeout(
                    () => {

                        const waiting =
                            waitingUsers.get(
                                socket.id
                            );

                        if (waiting) {

                            waitingUsers.delete(
                                socket.id
                            );

                            socket.emit(
                                "noUsersFound"
                            );

                        }

                    },
                    30000
                );

            }
        );

        socket.on(
            "sessionMessage",
            ({ room, message }) => {

                if (
                    !room ||
                    !message ||
                    !rooms.has(room)
                ) {
                    return;
                }

                const session =
                    rooms.get(room);

                if (
                    !session.users.includes(
                        socket.id
                    )
                ) {
                    return;
                }

                io.to(room).emit(
                    "sessionMessage",
                    {
                        username:
                            socket.username,

                        message:
                            String(message)
                                .slice(0, 2000)
                    }
                );

            }
        );

        socket.on(
            "leaveSession",
            ({ room }) => {

                if (!room) return;

                const session =
                    rooms.get(room);

                if (!session) return;

                socket.leave(room);

                const partner =
                    session.users.find(
                        id =>
                            id !== socket.id
                    );

                if (partner) {

                    io.to(
                        partner
                    ).emit(
                        "partnerLeft"
                    );

                }

                rooms.delete(room);

            }
        );

        socket.on(
            "disconnect",
            () => {

                removeFromWaiting(
                    socket.id
                );

                for (
                    const [
                        room,
                        session
                    ] of rooms
                ) {

                    if (
                        session.users.includes(
                            socket.id
                        )
                    ) {

                        const partner =
                            session.users.find(
                                id =>
                                    id !==
                                    socket.id
                            );

                        if (partner) {

                            io.to(
                                partner
                            ).emit(
                                "partnerLeft"
                            );

                        }

                        rooms.delete(room);

                    }

                }

            }
        );

    }
);

/* =========================
   START
========================= */

server.listen(
    PORT,
    () => {

        console.log(
            `Teachly server running on port ${PORT}`
        );

    }
);
