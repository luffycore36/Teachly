let data = JSON.parse(
  localStorage.getItem("teachly")
) || {
  name: "",
  email: "",
  role: "",
  coins: 100,
  sessions: 0,
  owned: [],
  effect: ""
};

function save() {
  localStorage.setItem(
    "teachly",
    JSON.stringify(data)
  );

  update();
}

function show(id) {

  document.querySelectorAll(".screen")
    .forEach(x => x.classList.remove("active"));

  document.getElementById(id)
    .classList.add("active");

  window.scrollTo(0, 0);
}

function update() {

  document.getElementById("coins")
    .textContent = "🪙 " + data.coins;

  document.getElementById("username")
    .textContent = data.name || "User";

  document.getElementById("profileName")
    .textContent = data.name || "User";

  document.getElementById("role")
    .textContent =
    data.role === "teacher"
      ? "👨‍🏫 Teacher"
      : "🎓 Learner";
}

function createAccount() {

  let name =
    document.getElementById("name").value.trim();

  let email =
    document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("Please enter your name and email.");
    return;
  }

  data.name = name;
  data.email = email;

  save();

  show("role");
}

function chooseRole(role) {

  data.role = role;

  save();

  show("dashboard");
}

function people() {

  let users = [

    {
      name: "Arun",
      role: "👨‍🏫 Teacher",
      subject: "Python"
    },

    {
      name: "Maya",
      role: "👩‍🏫 Teacher",
      subject: "Maths"
    },

    {
      name: "Kavin",
      role: "🎓 Learner",
      subject: "Science"
    },

    {
      name: "Sara",
      role: "👩‍🏫 Teacher",
      subject: "English"
    }

  ];

  document.getElementById("peopleList")
    .innerHTML = users.map(user => `

      <div class="person">

        <div>
          <b>${user.name}</b>
          <br>
          <small>
            ${user.role} • ${user.subject}
          </small>
        </div>

        <button onclick="request('${user.name}')">
          Request
        </button>

      </div>

    `).join("");

  show("people");
}

function request(name) {

  alert(
    "Session request sent to " +
    name +
    "! 👥"
  );
}

const topics = [

  "🌍 Why do we have seasons?",
  "💧 The water cycle",
  "✈️ How airplanes fly",
  "🌱 How plants make food",
  "🌋 How volcanoes form",
  "☀️ The Solar System",
  "⚙️ How gravity works",
  "🌊 Interesting ocean animals",
  "💻 Basic coding logic",
  "🐝 Why bees are important"

];

function mystery() {

  show("mystery");

  document.getElementById("topic")
    .textContent = "Tap Reveal Topic!";
}

function randomTopic() {

  let topic =
    topics[
      Math.floor(
        Math.random() * topics.length
      )
    ];

  document.getElementById("topic")
    .textContent = topic;
}

let shopItems = [

  {
    name: "Fire",
    icon: "🔥",
    price: 73
  },

  {
    name: "Void",
    icon: "🌌",
    price: 146
  },

  {
    name: "Wind",
    icon: "🌪️",
    price: 58
  },

  {
    name: "Lightning",
    icon: "⚡",
    price: 219
  },

  {
    name: "Ice",
    icon: "❄️",
    price: 91
  },

  {
    name: "Galaxy",
    icon: "✨",
    price: 175
  },

  {
    name: "Nature",
    icon: "🌿",
    price: 64
  },

  {
    name: "Emoji Pack",
    icon: "😀",
    price: 45
  }

];

function shop() {

  let html = "";

  shopItems.forEach(item => {

    let owned =
      data.owned.includes(item.name);

    html += `

      <div class="item">

        <div class="itemIcon">
          ${item.icon}
        </div>

        <h3>${item.name}</h3>

        <p>
          🪙 ${item.price}
        </p>

        <button
          onclick="buy('${item.name}')">

          ${owned ? "Equip" : "Buy"}

        </button>

      </div>

    `;

  });

  document.getElementById("shopItems")
    .innerHTML = html;

  show("shop");
}

function buy(name) {

  let item =
    shopItems.find(x => x.name === name);

  if (data.owned.includes(name)) {

    data.effect = name;

    save();

    alert(
      item.icon +
      " " +
      name +
      " equipped!"
    );

    return;
  }

  if (data.coins < item.price) {

    alert(
      "You don't have enough coins! 🪙"
    );

    return;
  }

  data.coins -= item.price;

  data.owned.push(name);

  data.effect = name;

  save();

  alert(
    item.icon +
    " " +
    name +
    " bought!"
  );

  shop();
}

function profile() {

  document.getElementById("stats")
    .textContent =
    data.sessions +
    " completed sessions • 🪙 " +
    data.coins +
    " coins";

  let milestones = [

    [1, "🌱 Starter"],
    [10, "⭐ Rising Star"],
    [50, "🥉 Bronze"],
    [100, "🥈 Silver"],
    [250, "🥇 Gold"],
    [500, "💎 Diamond"],
    [1000, "👑 Master"],
    [2500, "🔥 Legend"],
    [5000, "⚡ Elite"],
    [10000, "🌟 Teachly Titan"]

  ];

  let badges = "";

  milestones.forEach(x => {

    if (data.sessions >= x[0]) {

      badges +=
        `<span class="badge">
          ${x[1]}<br>
          ${x[0]} sessions
        </span>`;

    }

  });

  if (!badges) {

    badges =
      "<p>Complete your first session to unlock 🌱 Starter!</p>";

  }

  document.getElementById("badges")
    .innerHTML = badges;

  let effect =
    shopItems.find(
      x => x.name === data.effect
    );

  document.getElementById("profileEffect")
    .textContent =
    effect ? effect.icon : "👤";

  show("profile");
}

function world() {
  show("world");
}

function place(name) {

  let information = {

    "North America":
      "🏔️ Explore mountains, wildlife and famous places.",

    "South America":
      "🌳 Explore the Amazon rainforest and amazing wildlife.",

    "Europe":
      "🏰 Explore history, art and famous landmarks.",

    "Africa":
      "🦁 Explore wildlife, deserts and different cultures.",

    "Asia":
      "🏯 Explore history, technology, food and cultures.",

    "Australia":
      "🦘 Explore unique wildlife, reefs and natural places."

  };

  document.getElementById("placeInfo")
    .innerHTML = `

      <h3>🌍 ${name}</h3>

      <p>
        ${information[name]}
      </p>

      <h4>⭐ Special Things</h4>

      <button onclick="alert('More content coming! 📚')">
        📚 Learn More
      </button>

    `;
}

update();
