require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const nodemailer = require("nodemailer");
const OpenAI = require("openai");


/* =========================================================
   APP
========================================================= */

const app =
  express();

const server =
  http.createServer(app);


const io =
  new Server(
    server,
    {
      cors: {
        origin: "*",
        methods: [
          "GET",
          "POST"
        ]
      }
    }
  );


app.use(
  cors()
);

app.use(
  express.json({
    limit: "5mb"
  })
);


/* =========================================================
   DATA
========================================================= */

const dataDirectory =
  path.join(
    __dirname,
    "data"
  );

const usersFile =
  path.join(
    dataDirectory,
    "users.json"
  );


if (
  !fs.existsSync(
    dataDirectory
  )
) {

  fs.mkdirSync(
    dataDirectory,
    {
      recursive: true
    }
  );

}


if (
  !fs.existsSync(
    usersFile
  )
) {

  fs.writeFileSync(
    usersFile,
    "[]"
  );

}


function readUsers() {

  try {

    const text =
      fs.readFileSync(
        usersFile,
        "utf8"
      );

    const users =
      JSON.parse(
        text
      );

    return Array.isArray(users)
      ? users
      : [];

  } catch (error) {

    console.error(
      "Could not read users:",
      error
    );

    return [];

  }

}


function writeUsers(users) {

  fs.writeFileSync(
    usersFile,
    JSON.stringify(
      users,
      null,
      2
    )
  );

}


/* =========================================================
   SESSIONS
========================================================= */

const sessions =
  new Map();


function createToken() {

  return crypto
    .randomBytes(32)
    .toString("hex");

}


function publicUser(user) {

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profileImage:
      user.profileImage || "",
    role:
      user.role || "learner",
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


function authenticated(
  req,
  res,
  next
) {

  const header =
    req.headers.authorization || "";

  const token =
    header.startsWith("Bearer ")
      ? header.slice(7)
      : "";


  const userId =
    sessions.get(
      token
    );


  if (!userId) {

    return res
      .status(401)
      .json({
        error:
          "Authentication required."
      });

  }


  const users =
    readUsers();

  const user =
    users.find(
      item =>
        item.id ===
        userId
    );


  if (!user) {

    return res
      .status(401)
      .json({
        error:
          "User session is invalid."
      });

  }


  req.user =
    user;

  req.token =
    token;

  next();

}


/* =========================================================
   EMAIL
========================================================= */

let transporter = null;


if (
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS
) {

  transporter =
    nodemailer.createTransport({
      host:
        process.env.EMAIL_HOST,

      port:
        Number(
          process.env.EMAIL_PORT ||
          587
        ),

      secure:
        process.env.EMAIL_SECURE ===
        "true",

      auth: {
        user:
          process.env.EMAIL_USER,

        pass:
          process.env.EMAIL_PASS
      }

    });

}


/* =========================================================
   REGISTER
========================================================= */

app.post(
  "/api/auth/register",
  async (
    req,
    res
  ) => {

    try {

      const {
        username,
        email,
        password,
        role
      } = req.body;


      if (
        !username ||
        !email ||
        !password
      ) {

        return res
          .status(400)
          .json({
            error:
              "Username, email and password are required."
          });

      }


      if (
        password.length <
        6
      ) {

        return res
          .status(400)
          .json({
            error:
              "Password must contain at least 6 characters."
          });

      }


      const users =
        readUsers();


      const normalizedEmail =
        email
          .trim()
          .toLowerCase();


      if (
        users.some(
          user =>
            user.email ===
            normalizedEmail
        )
      ) {

        return res
          .status(409)
          .json({
            error:
              "An account with that email already exists."
          });

      }


      if (
        users.some(
          user =>
            user.username
              .toLowerCase() ===
            username
              .trim()
              .toLowerCase()
        )
      ) {

        return res
          .status(409)
          .json({
            error:
              "That username is already taken."
          });

      }


      const verificationCode =
        String(
          Math.floor(
            100000 +
            Math.random() *
            900000
          )
        );


      const passwordHash =
        await bcrypt.hash(
          password,
          10
        );


      const user = {

        id:
          crypto
            .randomUUID(),

        username:
          username.trim(),

        email:
          normalizedEmail,

        passwordHash,

        role:
          role === "teacher"
            ? "teacher"
            : "learner",

        verified:
          false,

        verificationCode,

        profileImage:
          "",

        tickets:
         100000,

        sessions:
          0,

        streak:
          0,

        earnedBadges:
          [],

        ownedEffects:
          [],

        equippedEffect:
          ""

      };


      users.push(
        user
      );

      writeUsers(
        users
      );


      if (transporter) {

        await transporter.sendMail({

          from:
            process.env.EMAIL_FROM ||
            process.env.EMAIL_USER,

          to:
            user.email,

          subject:
            "Teachly verification code",

          text:
            `Your Teachly verification code is ${verificationCode}.`

        });

      }


      const response = {
        message:
          "Verification code created. Check your email.",
        userId:
          user.id
      };


      /*
       * Development convenience:
       * if email is not configured, return the code.
       * Remove DEV mode before public production use.
       */

      if (!transporter) {

        response.developmentCode =
          verificationCode;

      }


      return res.json(
        response
      );

    } catch (error) {

      console.error(
        "REGISTER ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Registration failed."
        });

    }

  }
);


/* =========================================================
   VERIFY EMAIL
========================================================= */

app.post(
  "/api/auth/verify-email",
  (
    req,
    res
  ) => {

    const {
      email,
      code
    } =
      req.body;


    if (
      !email ||
      !code
    ) {

      return res
        .status(400)
        .json({
          error:
            "Email and verification code are required."
        });

    }


    const users =
      readUsers();


    const user =
      users.find(
        item =>
          item.email ===
          email
            .trim()
            .toLowerCase()
      );


    if (!user) {

      return res
        .status(404)
        .json({
          error:
            "Account not found."
        });

    }


    if (
      String(
        user.verificationCode
      ) !==
      String(code)
    ) {

      return res
        .status(400)
        .json({
          error:
            "Incorrect verification code."
        });

    }


    user.verified =
      true;

    delete user.verificationCode;


    writeUsers(
      users
    );


    const token =
      createToken();


    sessions.set(
      token,
      user.id
    );


    return res.json({
      message:
        "Email verified.",
      token,
      user:
        publicUser(user)
    });

  }
);


/* =========================================================
   LOGIN
========================================================= */

app.post(
  "/api/auth/login",
  async (
    req,
    res
  ) => {

    try {

      const {
        email,
        password
      } =
        req.body;


      if (
        !email ||
        !password
      ) {

        return res
          .status(400)
          .json({
            error:
              "Email and password are required."
          });

      }


      const users =
        readUsers();


      const user =
        users.find(
          item =>
            item.email ===
            email
              .trim()
              .toLowerCase()
        );


      if (!user) {

        return res
          .status(401)
          .json({
            error:
              "Invalid email or password."
          });

      }


      const valid =
        await bcrypt.compare(
          password,
          user.passwordHash
        );


      if (!valid) {

        return res
          .status(401)
          .json({
            error:
              "Invalid email or password."
          });

      }


      if (!user.verified) {

        return res
          .status(403)
          .json({
            error:
              "Please verify your email first."
          });

      }


      const token =
        createToken();


      sessions.set(
        token,
        user.id
      );


      return res.json({

        message:
          "Login successful.",

        token,

        user:
          publicUser(user)

      });


    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Login failed."
        });

    }

  }
);


/* =========================================================
   LOGOUT
========================================================= */

app.post(
  "/api/auth/logout",
  authenticated,
  (
    req,
    res
  ) => {

    sessions.delete(
      req.token
    );

    res.json({
      message:
        "Logged out."
    });

  }
);


/* =========================================================
   REAL PEOPLE
========================================================= */

app.get(
  "/api/people",
  (
    req,
    res
  ) => {

    const users =
      readUsers();


    const people =
      users
        .filter(
          user =>
            user.verified ===
            true
        )
        .map(
          publicUser
        );


    res.json({
      people
    });

  }
);


/* =========================================================
   AVATAR
========================================================= */

app.post(
  "/api/auth/avatar",
  authenticated,
  (
    req,
    res
  ) => {

    const {
      profileImage
    } =
      req.body;


    if (
      typeof profileImage !==
      "string"
    ) {

      return res
        .status(400)
        .json({
          error:
            "Invalid profile image."
        });

    }


    const users =
      readUsers();


    const user =
      users.find(
        item =>
          item.id ===
          req.user.id
      );


    user.profileImage =
      profileImage;


    writeUsers(
      users
    );


    res.json({
      user:
        publicUser(user)
    });

  }
);


/* =========================================================
   SHOP
========================================================= */

const shopProducts = {

  ring: {
    price: 30
  },

  spark: {
    price: 45
  },

  crown: {
    price: 70
  }

};


app.post(
  "/api/shop/buy",
  authenticated,
  (
    req,
    res
  ) => {

    const {
      productId
    } =
      req.body;


    const product =
      shopProducts[
        productId
      ];


    if (!product) {

      return res
        .status(404)
        .json({
          error:
            "Product not found."
        });

    }


    const users =
      readUsers();


    const user =
      users.find(
        item =>
          item.id ===
          req.user.id
      );


    if (
      !Array.isArray(
        user.ownedEffects
      )
    ) {

      user.ownedEffects =
        [];

    }


    if (
      user.ownedEffects.includes(
        productId
      )
    ) {

      user.equippedEffect =
        productId;

      writeUsers(
        users
      );

      return res.json({
        user:
          publicUser(user)
      });

    }


    const tickets =
      user.tickets ||
      0;


    if (
      tickets <
      product.price
    ) {

      return res
        .status(400)
        .json({
          error:
            "Not enough coins."
        });

    }


    user.tickets =
      tickets -
      product.price;


    user.ownedEffects.push(
      productId
    );

    user.equippedEffect =
      productId;


    writeUsers(
      users
    );


    res.json({
      user:
        publicUser(user)
    });

  }
);


/* =========================================================
   EQUIP
========================================================= */

app.post(
  "/api/shop/equip",
  authenticated,
  (
    req,
    res
  ) => {

    const {
      productId
    } =
      req.body;


    const users =
      readUsers();


    const user =
      users.find(
        item =>
          item.id ===
          req.user.id
      );


    if (
      !user.ownedEffects ||
      !user.ownedEffects.includes(
        productId
      )
    ) {

      return res
        .status(400)
        .json({
          error:
            "You do not own this effect."
        });

    }


    user.equippedEffect =
      productId;


    writeUsers(
      users
    );


    res.json({
      user:
        publicUser(user)
    });

  }
);


/* =========================================================
   AI
========================================================= */

const openai =
  process.env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey:
          process.env.OPENAI_API_KEY
      })
    : null;


app.post(
  "/api/ai",
  async (
    req,
    res
  ) => {

    try {

      if (!openai) {

        return res
          .status(500)
          .json({
            error:
              "OPENAI_API_KEY is not configured on the server."
          });

      }


      const {
        message,
        lesson
      } =
        req.body;


      if (
        !message ||
        typeof message !==
        "string"
      ) {

        return res
          .status(400)
          .json({
            error:
              "A question is required."
          });

      }


      let lessonContext =
        "";


      if (
        lesson &&
        typeof lesson ===
        "object"
      ) {

        lessonContext = `

Current lesson:
Title: ${lesson.title || ""}
Category: ${lesson.category || ""}
Description: ${lesson.description || ""}
Content: ${lesson.content || ""}

`;

      }


      const response =
        await openai.responses.create({

          model:
            process.env.OPENAI_MODEL ||
            "gpt-5.6-luna",

          instructions:
            `You are Teachly AI Teacher.

Your job is to help students learn.

Rules:
- Explain clearly.
- Use age-appropriate educational language.
- Break difficult ideas into smaller steps.
- Give examples when useful.
- Do not simply give an answer when teaching a concept; explain why.
- If the student is confused, try another explanation.
- Stay focused on education.
${lessonContext}`,

          input:
            message

        });


      const answer =
        response.output_text ||
        "";


      if (!answer) {

        return res
          .status(500)
          .json({
            error:
              "The AI returned an empty response."
          });

      }


      return res.json({
        answer
      });


    } catch (error) {

      console.error(
        "OPENAI ERROR:",
        error
      );


      return res
        .status(500)
        .json({
          error:
            error.message ||
            "AI request failed."
        });

    }

  }
);


/* =========================================================
   SOCKET.IO
========================================================= */

const socketUsers =
  new Map();


io.on(
  "connection",
  socket => {

    console.log(
      "Socket connected:",
      socket.id
    );


    socket.on(
      "authSession",
      token => {

        const userId =
          sessions.get(
            token
          );


        if (!userId) {

          socket.emit(
            "authError",
            {
              error:
                "Invalid session."
            }
          );

          return;
        }


        socketUsers.set(
          socket.id,
          userId
        );


        socket.emit(
          "authSuccess"
        );

      }
    );


    socket.on(
      "sessionMessage",
      data => {

        const userId =
          socketUsers.get(
            socket.id
          );


        if (!userId) {
          return;
        }


        socket.broadcast.emit(
          "sessionMessage",
          {
            ...data,
            senderId:
              userId
          }
        );

      }
    );


    socket.on(
      "leaveSession",
      () => {

        socket.emit(
          "sessionLeft"
        );

      }
    );


    socket.on(
      "disconnect",
      () => {

        socketUsers.delete(
          socket.id
        );

        console.log(
          "Socket disconnected:",
          socket.id
        );

      }
    );

  }
);


/* =========================================================
   STATIC FILES
   ========================================================= */

app.use(
  express.static(
    __dirname
  )
);


/* =========================================================
   START SERVER
========================================================= */

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
