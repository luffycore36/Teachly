require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const OpenAI = require("openai");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);


/* =====================================================
   CORS
===================================================== */

app.use(
    cors({
        origin: true,
        credentials: true
    })
);


/* =====================================================
   JSON
===================================================== */

app.use(
    express.json({
        limit: "5mb"
    })
);


/* =====================================================
   DATA
===================================================== */

const DATA_DIR =
    path.join(__dirname, "data");

const USERS_FILE =
    path.join(DATA_DIR, "users.json");


if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
        recursive: true
    });
}


if (!fs.existsSync(USERS_FILE)) {

    fs.writeFileSync(
        USERS_FILE,
        "[]"
    );

}


function readUsers() {

    try {

        return JSON.parse(
            fs.readFileSync(
                USERS_FILE,
                "utf8"
            )
        );

    } catch {

        return [];

    }
}


function saveUsers(users) {

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(
            users,
            null,
            2
        )
    );
}


/* =====================================================
   PUBLIC USER
===================================================== */

function publicUser(user) {

    if (!user) {
        return null;
    }

    return {
        id:
            user.id,

        username:
            user.username,

        profileImage:
            user.profileImage || "",

        role:
            user.role || "",

        tickets:
            user.tickets || 0,

        sessions:
            user.sessions || 0,

        streak:
            user.streak || 0,

        earnedBadges:
            user.earnedBadges || [],

        ownedEffects:
            user.ownedEffects || [],

        equippedEffect:
            user.equippedEffect || ""
    };
}


/* =====================================================
   HEALTH
===================================================== */

app.get(
    "/api/health",
    (req, res) => {

        res.json({
            ok: true,
            service: "Teachly"
        });

    }
);


/* =====================================================
   AI TEST
===================================================== */

app.get(
    "/api/ai-test",
    (req, res) => {

        res.json({
            ok: true,
            service: "Teachly AI API"
        });

    }
);


/* =====================================================
   REAL REGISTERED USERS
===================================================== */

app.get(
    "/api/people",
    (req, res) => {

        try {

            const users =
                readUsers();


            /*
             * Only return safe public information.
             *
             * Passwords, verification codes,
             * tokens, etc. are NEVER returned.
             */

            const people =
                users
                    .filter(
                        user =>
                            user &&
                            user.username &&
                            (
                                user.verified === undefined ||
                                user.verified === true
                            )
                    )
                    .map(
                        user => ({
                            id:
                                user.id,

                            username:
                                user.username,

                            profileImage:
                                user.profileImage || "",

                            role:
                                user.role || "",

                            sessions:
                                Number(
                                    user.sessions || 0
                                ),

                            streak:
                                Number(
                                    user.streak || 0
                                ),

                            earnedBadges:
                                user.earnedBadges || []
                        })
                    );


            res.json(
                people
            );

        } catch (error) {

            console.error(
                "PEOPLE ERROR:",
                error
            );

            res.status(500).json({
                error:
                    "Could not load Teachly users."
            });

        }

    }
);


/* =====================================================
   AI
===================================================== */

let openai = null;


if (
    process.env.OPENAI_API_KEY
) {

    openai =
        new OpenAI({
            apiKey:
                process.env.OPENAI_API_KEY
        });

}


app.post(
    "/api/ai",
    async (req, res) => {

        try {

            const {
                message,
                lesson
            } = req.body;


            if (
                !message ||
                !String(message).trim()
            ) {

                return res.status(400).json({
                    error:
                        "Please enter a question."
                });

            }


            if (!openai) {

                return res.status(500).json({
                    error:
                        "AI is not configured yet. Check OPENAI_API_KEY in Render."
                });

            }


            const lessonTitle =
                lesson?.title ||
                "General learning";


            const lessonCategory =
                lesson?.category ||
                "General";


            const lessonDescription =
                lesson?.description ||
                "";


            const lessonContent =
                lesson?.content ||
                "";


            const response =
                await openai.responses.create({

                    model:
                        process.env.OPENAI_MODEL ||
                        "gpt-5.6-luna",


                    instructions: `

You are Teachly AI Teacher,
a friendly educational tutor.

The learner is currently studying:

TITLE:
${lessonTitle}

CATEGORY:
${lessonCategory}

DESCRIPTION:
${lessonDescription}

LESSON MATERIAL:
${lessonContent}


Your job is to help the learner understand
the subject.

Rules:

- Explain things clearly.
- Base your answer on the selected lesson
  whenever possible.
- If the learner asks a related question,
  explain the connection.
- If the learner asks something unrelated,
  you may still help them.
- Explain difficult ideas step by step.
- Give simple examples.
- Use headings and bullet points when useful.
- Help the learner understand instead of
  simply dumping an answer.
- Keep explanations appropriate for a
  school learner.
- Never pretend to be a real human.
- Do not claim to know things that are not
  supported by the question or lesson.
- If the learner is confused, explain it
  in a simpler way.

`,


                    input:
                        String(
                            message
                        ).trim()

                });


            const answer =
                response.output_text ||
                "I couldn't generate an answer right now.";


            res.json({
                answer:
                    answer
            });


        } catch (error) {

            console.error(
                "AI ERROR:",
                error
            );


            res.status(500).json({
                error:
                    error?.message ||
                    "AI could not respond right now."
            });

        }

    }
);


/* =====================================================
   SIMPLE REGISTER
   ===================================================== */

app.post(
    "/api/register",
    async (req, res) => {

        try {

            const {
                username,
                password,
                email
            } = req.body;


            if (
                !username ||
                !password
            ) {

                return res.status(400).json({
                    error:
                        "Username and password are required."
                });

            }


            const users =
                readUsers();


            const usernameTaken =
                users.some(
                    user =>
                        String(
                            user.username || ""
                        ).toLowerCase() ===
                        String(
                            username
                        ).toLowerCase()
                );


            if (usernameTaken) {

                return res.status(409).json({
                    error:
                        "Username already taken."
                });

            }


            const passwordHash =
                await bcrypt.hash(
                    password,
                    10
                );


            const user = {

                id:
                    crypto.randomUUID(),

                username:
                    String(username).trim(),

                email:
                    email || "",

                password:
                    passwordHash,

                verified:
                    true,

                role:
                    "",

                profileImage:
                    "",

                tickets:
                    0,

                sessions:
                    0,

                streak:
                    0,

                earnedBadges:
                    [],

                ownedEffects:
                    [],

                equippedEffect:
                    "",

                createdAt:
                    new Date().toISOString()

            };


            users.push(
                user
            );


            saveUsers(
                users
            );


            res.json({
                success:
                    true,

                user:
                    publicUser(user)
            });


        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );

            res.status(500).json({
                error:
                    "Registration failed."
            });

        }

    }
);


/* =====================================================
   SAVE USER ROLE
===================================================== */

app.post(
    "/api/profile/role",
    (req, res) => {

        try {

            const {
                username,
                role
            } = req.body;


            if (
                !username ||
                ![
                    "teacher",
                    "learner"
                ].includes(role)
            ) {

                return res.status(400).json({
                    error:
                        "Valid username and role are required."
                });

            }


            const users =
                readUsers();


            const user =
                users.find(
                    item =>
                        String(
                            item.username || ""
                        ).toLowerCase() ===
                        String(
                            username
                        ).toLowerCase()
                );


            if (!user) {

                return res.status(404).json({
                    error:
                        "User not found."
                });

            }


            user.role =
                role;


            saveUsers(
                users
            );


            res.json({
                success:
                    true,

                user:
                    publicUser(user)
            });


        } catch (error) {

            console.error(
                "ROLE ERROR:",
                error
            );

            res.status(500).json({
                error:
                    "Could not update role."
            });

        }

    }
);


/* =====================================================
   SOCKET.IO
===================================================== */

const io =
    new Server(
        server,
        {
            cors: {
                origin: true,
                credentials: true
            }
        }
    );


const waitingUsers =
    new Map();

const rooms =
    new Map();


io.on(
    "connection",
    socket => {

        console.log(
            "Socket connected:",
            socket.id
        );


        socket.on(
            "findUser",
            data => {

                const role =
                    data?.role || "";

                const topic =
                    data?.topic || "";


                const oppositeRole =
                    role === "learner"
                        ? "teacher"
                        : "learner";


                let match = null;


                for (
                    const [
                        waitingSocketId,
                        waitingUser
                    ]
                    of waitingUsers
                ) {

                    if (
                        waitingSocketId ===
                        socket.id
                    ) {
                        continue;
                    }


                    if (
                        waitingUser.role !==
                        oppositeRole
                    ) {
                        continue;
                    }


                    if (
                        topic &&
                        waitingUser.topic &&
                        waitingUser.topic !== topic
                    ) {
                        continue;
                    }


                    match = {
                        socketId:
                            waitingSocketId,

                        user:
                            waitingUser
                    };

                    break;
                }


                if (!match) {

                    waitingUsers.set(
                        socket.id,
                        {
                            role,
                            topic
                        }
                    );


                    socket.emit(
                        "searching"
                    );

                    return;
                }


                waitingUsers.delete(
                    match.socketId
                );


                const roomId =
                    crypto.randomUUID();


                rooms.set(
                    roomId,
                    [
                        socket.id,
                        match.socketId
                    ]
                );


                socket.join(
                    roomId
                );


                const matchedSocket =
                    io.sockets.sockets.get(
                        match.socketId
                    );


                if (matchedSocket) {

                    matchedSocket.join(
                        roomId
                    );

                }


                io.to(
                    roomId
                ).emit(
                    "matched",
                    {
                        roomId
                    }
                );

            }
        );


        socket.on(
            "chatMessage",
            data => {

                const roomId =
                    data?.roomId;

                const message =
                    data?.message;


                if (
                    !roomId ||
                    !message
                ) {
                    return;
                }


                io.to(
                    roomId
                ).emit(
                    "chatMessage",
                    {
                        message:
                            String(
                                message
                            )
                    }
                );

            }
        );


        socket.on(
            "disconnect",
            () => {

                waitingUsers.delete(
                    socket.id
                );


                for (
                    const [
                        roomId,
                        socketIds
                    ]
                    of rooms
                ) {

                    if (
                        socketIds.includes(
                            socket.id
                        )
                    ) {

                        rooms.delete(
                            roomId
                        );

                        break;
                    }

                }

            }
        );

    }
);


/* =====================================================
   STATIC FRONTEND
   IMPORTANT:
   APIs are above this.
===================================================== */

app.use(
    express.static(
        __dirname
    )
);


/* =====================================================
   START
===================================================== */

const PORT =
    process.env.PORT ||
    3000;


server.listen(
    PORT,
    () => {

        console.log(
            `Teachly server running on port ${PORT}`
        );

    }
);
