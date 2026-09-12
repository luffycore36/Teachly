const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]");
}

app.use(cors());
app.use(express.json({ limit: "10mb" }));

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(users, null, 2)
  );
}

function makeId() {
  return crypto.randomBytes(16).toString("hex");
}

function makeToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getUserFromToken(token) {
  if (!token) return null;

  const users = readUsers();

  return users.find(
    user => user.token === token
  ) || null;
}


/* =====================================================
   BASIC TEST
===================================================== */

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Teachly server is running."
  });
});


/* =====================================================
   REGISTER
===================================================== */

app.post("/api/auth/register", (req, res) => {

  try {

    const {
      username,
      email,
      password,
      role
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Please fill in all fields."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "Password must be at least 6 characters."
      });
    }

    const users = readUsers();

    const cleanEmail =
      String(email).trim().toLowerCase();

    const cleanUsername =
      String(username).trim();

    const existingEmail =
      users.find(
        user =>
          String(user.email).toLowerCase() === cleanEmail
      );

    if (existingEmail) {
      return res.status(409).json({
        ok: false,
        message: "That email is already registered."
      });
    }

    const existingUsername =
      users.find(
        user =>
          String(user.username).toLowerCase() ===
          cleanUsername.toLowerCase()
      );

    if (existingUsername) {
      return res.status(409).json({
        ok: false,
        message: "That username is already taken."
      });
    }

    const user = {
      id: makeId(),

      username: cleanUsername,

      email: cleanEmail,

      password,

    role:
  role === "teacher"
    ? "teacher"
    : "learner",

lookingFor:
  role === "teacher"
    ? "learner"
    : "teacher",

online: false,

connectionRequests: [],

connections: [],

      verified: true,

      profileImage: "",

      tickets: 0,

      sessions: 0,

      createdAt: new Date().toISOString(),

      token: null,

      inventory: [],

      equipped: null
    };

    users.push(user);

    saveUsers(users);

    res.json({
      ok: true,
      message: "Account created successfully."
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      ok: false,
      message: "Could not create account."
    });

  }

});


/* =====================================================
   LOGIN
===================================================== */

app.post("/api/auth/login", (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required."
      });
    }

    const users = readUsers();

    const user =
      users.find(
        item =>
          String(item.email).toLowerCase() ===
          String(email).trim().toLowerCase()
      );

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Account not found."
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        ok: false,
        message: "Incorrect password."
      });
    }

    const token = makeToken();

    user.token = token;

    saveUsers(users);

    res.json({
      ok: true,

      token,

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
        tickets: user.tickets || 0,
        sessions: user.sessions || 0,
        inventory: user.inventory || [],
        equipped: user.equipped || null
      }
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      ok: false,
      message: "Login failed."
    });

  }

});


/* =====================================================
   LOGOUT
===================================================== */

app.post("/api/auth/logout", (req, res) => {

  const token =
    req.headers.authorization?.replace(
      "Bearer ",
      ""
    );

  const users = readUsers();

  const user =
    users.find(item => item.token === token);

  if (user) {
    user.token = null;
    saveUsers(users);
  }

  res.json({
    ok: true
  });

});

/* =====================================================
   PEOPLE
===================================================== */

app.get("/api/people", (req, res) => {

  const users = readUsers();

  const people = users
    .filter(user => user.verified !== false)
    .filter(user => user.online === true)
    .map(user => ({
      id: user.id,
      username: user.username,
      profileImage: user.profileImage || "",
      role: user.role || "learner",
      lookingFor:
        user.lookingFor ||
        (user.role === "teacher"
          ? "learner"
          : "teacher"),
      online: true
    }));

  res.json({
    ok: true,
    people
  });

});

/* =====================================================
   CONNECTION REQUEST
===================================================== */

app.post("/api/connect", (req, res) => {

  try {

    const token =
      req.headers.authorization?.replace(
        "Bearer ",
        ""
      );

    const {
      targetUserId
    } = req.body;

    const users = readUsers();

    const sender =
      users.find(
        user => user.token === token
      );

    if (!sender) {
      return res.status(401).json({
        ok: false,
        message: "Please log in."
      });
    }

    const target =
      users.find(
        user => user.id === targetUserId
      );

    if (!target) {
      return res.status(404).json({
        ok: false,
        message: "User not found."
      });
    }

    if (sender.id === target.id) {
      return res.status(400).json({
        ok: false,
        message: "You cannot connect with yourself."
      });
    }

    target.connectionRequests =
      Array.isArray(target.connectionRequests)
        ? target.connectionRequests
        : [];

    sender.connections =
      Array.isArray(sender.connections)
        ? sender.connections
        : [];

    const alreadyRequested =
      target.connectionRequests.some(
        request =>
          request.fromId === sender.id
      );

    if (alreadyRequested) {
      return res.status(400).json({
        ok: false,
        message: "Connection request already sent."
      });
    }

    target.connectionRequests.push({
      fromId: sender.id,
      username: sender.username,
      role: sender.role,
      createdAt: new Date().toISOString()
    });

    saveUsers(users);

    const targetSocket =
      onlineUsers.get(target.id);

    if (targetSocket) {

      io.to(targetSocket).emit(
        "connection-request",
        {
          fromId: sender.id,
          username: sender.username,
          role: sender.role
        }
      );

    }

    res.json({
      ok: true,
      message: "Connection request sent!"
    });

  } catch (error) {

    console.error(
      "CONNECT ERROR:",
      error
    );

    res.status(500).json({
      ok: false,
      message: "Could not send connection request."
    });

  }

});

/* =====================================================
   AVATAR
===================================================== */

app.post("/api/auth/avatar", (req, res) => {

  try {

    const token =
      req.headers.authorization?.replace(
        "Bearer ",
        ""
      );

    const { image } = req.body;

    if (!token || !image) {
      return res.status(400).json({
        ok: false,
        message: "Avatar data is missing."
      });
    }

    const users = readUsers();

    const user =
      users.find(item => item.token === token);

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Not logged in."
      });
    }

    user.profileImage = image;

    saveUsers(users);

    res.json({
      ok: true,
      profileImage: image
    });

  } catch (error) {

    console.error("AVATAR ERROR:", error);

    res.status(500).json({
      ok: false,
      message: "Could not save avatar."
    });

  }

});


/* =====================================================
   SHOP
===================================================== */

app.post("/api/shop/buy", (req, res) => {

  try {

    const token =
      req.headers.authorization?.replace(
        "Bearer ",
        ""
      );

    const {
      item,
      price
    } = req.body;

    const users = readUsers();

    const user =
      users.find(
        entry => entry.token === token
      );

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Please log in."
      });
    }

    const cost = Number(price);

    if (!item || !Number.isFinite(cost)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid shop item."
      });
    }

    const coins = user.tickets || 0;

    if (coins < cost) {
      return res.status(400).json({
        ok: false,
        message: "Not enough TeachCoins."
      });
    }

    user.tickets = coins - cost;

    user.inventory =
      Array.isArray(user.inventory)
        ? user.inventory
        : [];

    if (!user.inventory.includes(item)) {
      user.inventory.push(item);
    }

    saveUsers(users);

    res.json({
      ok: true,
      tickets: user.tickets,
      inventory: user.inventory,
      message: "Item purchased!"
    });

  } catch (error) {

    console.error("SHOP BUY ERROR:", error);

    res.status(500).json({
      ok: false,
      message: "Could not purchase item."
    });

  }

});


/* =====================================================
   EQUIP SHOP ITEM
===================================================== */

app.post("/api/shop/equip", (req, res) => {

  try {

    const token =
      req.headers.authorization?.replace(
        "Bearer ",
        ""
      );

    const { item } = req.body;

    const users = readUsers();

    const user =
      users.find(
        entry => entry.token === token
      );

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Please log in."
      });
    }

    user.inventory =
      Array.isArray(user.inventory)
        ? user.inventory
        : [];

    if (
      item &&
      !user.inventory.includes(item)
    ) {
      return res.status(400).json({
        ok: false,
        message: "You do not own this item."
      });
    }

    user.equipped = item || null;

    saveUsers(users);

    res.json({
      ok: true,
      equipped: user.equipped
    });

  } catch (error) {

    console.error("EQUIP ERROR:", error);

    res.status(500).json({
      ok: false,
      message: "Could not equip item."
    });

  }

});


/* =====================================================
   AI TEACHER
===================================================== */

app.post("/api/ai", async (req, res) => {

  try {

    const {
      message,
      lesson
    } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        ok: false,
        message: "Please ask a question."
      });
    }

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        message:
          "AI is not configured yet. Add OPENAI_API_KEY to your Render environment variables."
      });
    }

    const lessonContext =
      lesson
        ? `
Current lesson:
Title: ${lesson.title || ""}
Category: ${lesson.category || ""}
Description: ${lesson.description || ""}
Content:
${lesson.content || ""}
`
        : "";

    const systemPrompt = `
You are Teachly AI Teacher.

Your job is to answer the student's questions clearly,
accurately and helpfully.

Rules:

- Answer the actual question.
- Do not randomly change the subject.
- Explain difficult ideas in simple language.
- Give examples when useful.
- If the student asks for a definition, define it first.
- If the student asks how something works, explain the steps.
- If the student asks a math question, show the reasoning clearly.
- If the student asks about the current lesson, use the lesson context.
- If you are unsure about something, say so rather than inventing facts.
- Keep answers appropriate for students.
- Do not claim you performed actions you cannot perform.

${lessonContext}
`;

    const response =
      await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization":
              `Bearer ${apiKey}`
          },

          body: JSON.stringify({
            model:
              process.env.OPENAI_MODEL ||
              "gpt-5-mini",

            instructions:
              systemPrompt,

            input:
              String(message).trim(),

            max_output_tokens: 1000
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      console.error(
        "OPENAI ERROR:",
        data
      );

      return res.status(500).json({
        ok: false,
        message:
          data?.error?.message ||
          "The AI service returned an error."
      });

    }

    let answer =
      data.output_text || "";

    if (!answer && Array.isArray(data.output)) {

      answer =
        data.output
          .flatMap(item =>
            Array.isArray(item.content)
              ? item.content
              : []
          )
          .map(content =>
            content.text || ""
          )
          .filter(Boolean)
          .join("\n");

    }

    if (!answer) {
      answer =
        "I couldn't generate an answer right now.";
    }

    res.json({
      ok: true,
      answer
    });

  } catch (error) {

    console.error(
      "AI SERVER ERROR:",
      error
    );

    res.status(500).json({
      ok: false,
      message:
        "Teachly AI could not be reached."
    });

  }

});


/* =====================================================
   SOCKET.IO
===================================================== */

const onlineUsers = new Map();

io.on("connection", socket => {

  console.log(
    "Socket connected:",
    socket.id
  );


socket.on("authenticate", token => {

  const user =
    getUserFromToken(token);

  if (!user) {
    socket.emit("auth-error", {
      message: "Invalid session."
    });

    return;
  }

  socket.userId = user.id;

  onlineUsers.set(
    user.id,
    socket.id
  );

  const users = readUsers();

  const storedUser =
    users.find(
      item => item.id === user.id
    );

  if (storedUser) {
    storedUser.online = true;
    saveUsers(users);
  }

  socket.emit("authenticated", {
    id: user.id,
    username: user.username
  });

  io.emit("people-updated");

});


  socket.on(
    "private-message",
    data => {

      if (!socket.userId) {
        return;
      }

      const {
        to,
        message
      } = data || {};

      if (!to || !message) {
        return;
      }

      const targetSocket =
        onlineUsers.get(to);

      if (targetSocket) {

        io.to(targetSocket).emit(
          "private-message",
          {
            from: socket.userId,
            message: String(message)
          }
        );

      }

    }
  );


socket.on("disconnect", () => {

  if (socket.userId) {

    onlineUsers.delete(
      socket.userId
    );

    const users = readUsers();

    const user =
      users.find(
        item => item.id === socket.userId
      );

    if (user) {
      user.online = false;
      saveUsers(users);
    }

    io.emit("people-updated");
  }

  console.log(
    "Socket disconnected:",
    socket.id
  );

});


/* =====================================================
   STATIC FRONTEND
   IMPORTANT:
   This MUST stay AFTER API ROUTES.
===================================================== */

app.use(
  express.static(__dirname)
);


/* =====================================================
   START SERVER
===================================================== */

server.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Teachly server running on port ${PORT}`
    );

  }
);


      async function connectToUser(userId) {

  try {

    const token =
      localStorage.getItem("teachlyToken");

    const response =
      await fetch(
        "https://teachly-nmxh.onrender.com/api/connect",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization":
              `Bearer ${token}`
          },

          body: JSON.stringify({
            targetUserId: userId
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      alert(data.message || "Could not connect.");
      return;
    }

    alert("✅ Connection request sent!");

  } catch (error) {

    console.error(
      "CONNECT ERROR:",
      error
    );

    alert(
      "Could not connect right now."
    );
  }
}
