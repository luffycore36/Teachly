let data =
  JSON.parse(localStorage.getItem("teachly")) || {
    name: "",
    email: "",
    role: "",
    coins: 100,
    sessions: 0,
    owned: [],
    effect: "",
    discoveredCountries: []
  };

data.owned ||= [];
data.discoveredCountries ||= [];

let socket = null;
let currentSession = false;
let worldMap = null;


/* ================= SAVE ================= */

function save() {

  localStorage.setItem(
    "teachly",
    JSON.stringify(data)
  );

  update();

}


/* ================= PAGE SYSTEM ================= */

function show(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen =>
      screen.classList.remove("active")
    );

  const element =
    document.getElementById(id);

  if (element) {
    element.classList.add("active");
  }

  document
    .getElementById("page1")
    .classList.remove("hidden");

  document
    .getElementById("page2")
    .classList.add("hidden");

  window.scrollTo(0, 0);

}


function goHome() {

  show(
    data.name
      ? "dashboard"
      : "welcome"
  );

}


function openWorldPage() {

  document
    .getElementById("page1")
    .classList.add("hidden");

  document
    .getElementById("page2")
    .classList.remove("hidden");

  window.scrollTo(0, 0);

  setTimeout(() => {

    if (!worldMap) {
      createWorldMap();
    } else {
      worldMap.invalidateSize();
    }

  }, 100);

}


function closeWorldPage() {

  document
    .getElementById("page2")
    .classList.add("hidden");

  document
    .getElementById("page1")
    .classList.remove("hidden");

  show(
    data.name
      ? "dashboard"
      : "welcome"
  );

}


/* ================= UPDATE ================= */

function update() {

document.getElementById("coins")
  .textContent =
  "🎫 " + data.coins;

  document.getElementById("username")
    .textContent =
    data.name || "User";

  document.getElementById("profileName")
    .textContent =
    data.name || "User";

  document.getElementById("roleText")
    .textContent =
    data.role === "teacher"
      ? "👨‍🏫 Teacher"
      : data.role === "learner"
        ? "🎓 Learner"
        : "";

}


/* ================= ACCOUNT ================= */

function createAccount() {

  const name =
    document
      .getElementById("name")
      .value
      .trim();

  const email =
    document
      .getElementById("email")
      .value
      .trim();

  if (!name || !email) {

    alert(
      "Please enter your name and email."
    );

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


/* ================= REAL PEOPLE ================= */

function people() {

  show("people");

  connectSocket();

}


function connectSocket() {

  if (socket) return;

  if (typeof io === "undefined") {

    setStatus(
      "Online service is unavailable.",
      "error"
    );

    return;

  }

  socket = io();


  socket.on("connect", () => {

    setStatus(
      "🟢 Online matching is ready.",
      "success"
    );

  });


  socket.on("connect_error", () => {

    setStatus(
      "Unable to connect to the online service.",
      "error"
    );

  });


  socket.on(
    "matchFound",
    matchFound
  );


  socket.on(
    "noUsersFound",
    noVolunteer
  );


  socket.on(
    "sessionMessage",
    message => {

      addMessage(
        message.username,
        message.message,
        message.username === data.name
      );

    }
  );


  socket.on(
    "partnerLeft",
    () => {

      addMessage(
        "Teachly",
        "The other person left the session.",
        false
      );

    }
  );

}


function findPeople() {

  const topic =
    document
      .getElementById("topicInput")
      .value
      .trim();

  if (!data.role) {

    alert(
      "Please choose Learn or Teach first."
    );

    return;

  }

  if (!topic) {

    alert(
      "Enter a topic first."
    );

    return;

  }

  connectSocket();

  if (!socket) return;

  setStatus(
    "🔎 Looking for a real volunteer...",
    "success"
  );

  socket.emit(
    "findUser",
    {
      username: data.name,
      role: data.role,
      topic: topic
    }
  );

}


function matchFound(info) {

  currentSession = true;

  document
    .getElementById("onlineChatArea")
    .classList.remove("hidden");

  document
    .getElementById("partnerName")
    .textContent =
    info.partner.username;

  document
    .getElementById("partnerRole")
    .textContent =
    info.partner.role;

  document
    .getElementById("onlineChat")
    .innerHTML = "";

  addMessage(
    "Teachly",
    "🎉 You are connected to a real person!",
    false
  );

}


function noVolunteer() {

  const message =
    "Unable to find volunteer connecting to AI instead";

  setStatus(
    message,
    "error"
  );

  const answer =
    confirm(
      message +
      "\n\nConnect to AI instead?\n\nOK = Yes\nCancel = No"
    );

  if (answer) {

    openAI();

  } else {

    setStatus(
      "No volunteer found. Try another topic.",
      ""
    );

  }

}


/*
  Connect this function to your existing
  AI screen/API if your project already has one.
*/

function openAI() {

  const aiScreen =
    document.getElementById("aiSection");

  if (aiScreen) {

    show("aiSection");

    return;

  }

  alert(
    "AI Mode needs to be connected to your existing AI screen/API."
  );

}


function sendOnlineMessage() {

  const input =
    document.getElementById("onlineInput");

  const message =
    input.value.trim();

  if (
    !message ||
    !socket ||
    !currentSession
  ) return;

  socket.emit(
    "sessionMessage",
    {
      username: data.name,
      message: message
    }
  );

  input.value = "";

}


function sendEmoji(emoji) {

  if (
    socket &&
    currentSession
  ) {

    socket.emit(
      "sessionMessage",
      {
        username: data.name,
        message: emoji
      }
    );

  }

}


function addMessage(
  username,
  message,
  own
) {

  const chat =
    document.getElementById(
      "onlineChat"
    );

  const div =
    document.createElement("div");

  div.className =
    "message " +
    (
      own
        ? "userMessage"
        : "otherMessage"
    );

  div.innerHTML = `
    <b>${escapeHTML(username)}</b>
    <p>${escapeHTML(message)}</p>
  `;

  chat.appendChild(div);

  chat.scrollTop =
    chat.scrollHeight;

}


function leaveSession() {

  if (socket && currentSession) {

    socket.emit(
      "leaveSession"
    );

  }

  currentSession = false;

  document
    .getElementById(
      "onlineChatArea"
    )
    .classList.add("hidden");

  data.sessions += 1;

  data.coins += 10;

  save();

  setStatus(
    "✅ Session complete! +10 🪙 coins",
    "success"
  );

}


function setStatus(
  message,
  type
) {

  const element =
    document.getElementById(
      "onlineStatus"
    );

  element.textContent =
    message;

  element.className =
    "status " +
    type;

}


/* ================= MYSTERY ================= */

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
    .textContent =
    "Tap Reveal Topic!";

}


function randomTopic() {

  const random =
    topics[
      Math.floor(
        Math.random() *
        topics.length
      )
    ];

  document.getElementById("topic")
    .textContent =
    random;

}


/* ================= SHOP ================= */

const shopItems = [

  {
    name: "Fire",
    icon: "🔥",
    price: 73,
    description:
      "Fire profile effect"
  },

  {
    name: "Void",
    icon: "🌌",
    price: 146,
    description:
      "Void profile effect"
  },

  {
    name: "Wind",
    icon: "🌪️",
    price: 58,
    description:
      "Wind profile effect"
  },

  {
    name: "Lightning",
    icon: "⚡",
    price: 219,
    description:
      "Lightning profile effect"
  },

  {
    name: "Ice",
    icon: "❄️",
    price: 91,
    description:
      "Ice profile effect"
  },

  {
    name: "Galaxy",
    icon: "✨",
    price: 175,
    description:
      "Galaxy profile effect"
  },

  {
    name: "Nature",
    icon: "🌿",
    price: 64,
    description:
      "Nature profile effect"
  },

  {
    name: "Emoji Pack",
    icon: "😀",
    price: 45,
    description:
      "Extra chat emojis"
  }

];


function shop() {

  document
    .getElementById("shopItems")
    .innerHTML =
    shopItems
      .map(item => {

        const owned =
          data.owned.includes(
            item.name
          );

        return `

          <div class="item">

            <div class="itemIcon">
              ${item.icon}
            </div>

            <h3>
              ${item.name}
            </h3>

            <p>
              ${item.description}
            </p>

            <strong>
              🎫 ${item.price}
            </strong>

            <button
              onclick="
                buy('${item.name}')
              "
            >
              ${
                owned
                  ? "Equip"
                  : "Buy for 🎫 " +
                    item.price
              }
            </button>

          </div>

        `;

      })
      .join("");

  show("shop");

}


function buy(name) {

  const item =
    shopItems.find(
      x => x.name === name
    );

  if (!item) return;


  /* ALREADY OWNED */

  if (
    data.owned.includes(
      name
    )
  ) {

    data.effect =
      name;

    save();

    alert(
      item.icon +
      " " +
      name +
      " equipped!"
    );

    shop();

    return;

  }


  /* NOT ENOUGH COINS */

  if (
    data.coins <
    item.price
  ) {

    alert(
      "Unable to buy product"
    );

    return;

  }


  /* PURCHASE */

  data.coins -=
    item.price;

  data.owned.push(
    name
  );

  data.effect =
    name;

  save();

  alert(
    item.icon +
    " " +
    name +
    " bought!"
  );

  shop();

}


/* ================= PROFILE ================= */

function profile() {

  document
    .getElementById("stats")
    .textContent =
    data.sessions +
    " completed sessions • 🎫 " +
    data.coins +
    " coins";


  const effect =
    shopItems.find(
      x =>
        x.name ===
        data.effect
    );


  document
    .getElementById(
      "profileEffect"
    )
    .textContent =
    effect
      ? effect.icon
      : "👤";


  document
    .getElementById(
      "ownedItems"
    )
    .innerHTML =
    data.owned.length
      ? data.owned
          .map(
            x =>
              `<span class="owned">${x}</span>`
          )
          .join("")
      : "<p>No shop items yet.</p>";


  show("profile");

}


/* ================= BADGES ================= */

const badges = [

  ["Starter", 5, "🥉"],
  ["Learner", 15, "🥉"],
  ["Explorer", 50, "🥈"],
  ["Knowledge Seeker", 75, "🥈"],
  ["Skill Builder", 100, "🥇"],
  ["Mentor", 150, "🥇"],
  ["Expert", 250, "🏆"],
  ["Master", 500, "🏆"],
  ["Legend", 750, "💎"],
  ["Teachly Champion", 1000, "👑"]

];


function badgesPage() {

  document
    .getElementById("badgeGrid")
    .innerHTML =
    badges
      .map(badge => {

        const earned =
          data.sessions >=
          badge[1];

        return `

          <div
            class="
              badge
              ${earned
                ? "earned"
                : "locked"}
            "
          >

            <div class="badgeIcon">
              ${badge[2]}
            </div>

            <b>
              ${badge[0]}
            </b>

            <small>
              ${badge[1]} sessions
            </small>

            <span>
              ${
                earned
                  ? "✅ Earned"
                  : "🔒 Locked"
              }
            </span>

          </div>

        `;

      })
      .join("");

  show("badgesPage");

}


/* ================= WORLD DATA ================= */

const countries = {

  India: {
    flag: "🇮🇳",
    capital: "New Delhi",
    language: "Hindi + many regional languages",
    currency: "Indian Rupee (INR)",
    continent: "Asia",

    places: [

      [
        "Taj Mahal",
        "🕌",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80",
        "A famous white-marble monument in Agra and one of India's best-known landmarks."
      ],

      [
        "Bollywood",
        "🎬",
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
        "India's Hindi-language film industry, centered largely in Mumbai."
      ],

      [
        "Indian Cuisine",
        "🍛",
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
        "India is famous for diverse regional foods, spices, curries, breads and sweets."
      ],

      [
        "Culture & Festivals",
        "🎉",
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
        "India has a huge variety of traditions and celebrations, including Diwali and Holi."
      ]

    ]
  },


  France: {
    flag: "🇫🇷",
    capital: "Paris",
    language: "French",
    currency: "Euro (EUR)",
    continent: "Europe",

    places: [

      [
        "Eiffel Tower",
        "🗼",
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
        "An iconic Paris landmark built for the 1889 World's Fair."
      ],

      [
        "Louvre",
        "🎨",
        "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=80",
        "One of the world's most famous museums."
      ],

      [
        "French Cuisine",
        "🥐",
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
        "France is famous for breads, pastries, cheeses and regional dishes."
      ]

    ]
  },


  Japan: {
    flag: "🇯🇵",
    capital: "Tokyo",
    language: "Japanese",
    currency: "Yen (JPY)",
    continent: "Asia",

    places: [

      [
        "Mount Fuji",
        "🗻",
        "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=900&q=80",
        "Japan's highest mountain and an iconic symbol of the country."
      ],

      [
        "Tokyo",
        "🏙️",
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
        "A major global city known for technology, food and culture."
      ],

      [
        "Anime & Manga",
        "🎌",
        "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=900&q=80",
        "Japan is a major center for animated storytelling and comics."
      ]

    ]
  },


  Egypt: {
    flag: "🇪🇬",
    capital: "Cairo",
    language: "Arabic",
    currency: "Egyptian Pound (EGP)",
    continent: "Africa",

    places: [

      [
        "Pyramids of Giza",
        "🔺",
        "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=80",
        "Ancient pyramids near Cairo and among the world's most famous archaeological sites."
      ],

      [
        "Nile River",
        "🌊",
        "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=80",
        "A major river central to Egypt's geography and history."
      ]

    ]
  },


  Brazil: {
    flag: "🇧🇷",
    capital: "Brasília",
    language: "Portuguese",
    currency: "Brazilian Real (BRL)",
    continent: "South America",

    places: [

      [
        "Amazon Rainforest",
        "🌳",
        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80",
        "A vast tropical rainforest with extraordinary biodiversity."
      ],

      [
        "Christ the Redeemer",
        "🗿",
        "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=80",
        "A monumental statue overlooking Rio de Janeiro."
      ]

    ]
  },


  Australia: {
    flag: "🇦🇺",
    capital: "Canberra",
    language: "English is most widely spoken",
    currency: "Australian Dollar (AUD)",
    continent: "Oceania",

    places: [

      [
        "Great Barrier Reef",
        "🐠",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
        "The world's largest coral reef system."
      ],

      [
        "Sydney Opera House",
        "🎭",
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d6?auto=format&fit=crop&w=900&q=80",
        "A famous performing arts building in Sydney."
      ]

    ]
  },


  Canada: {
    flag: "🇨🇦",
    capital: "Ottawa",
    language: "English and French",
    currency: "Canadian Dollar (CAD)",
    continent: "North America",

    places: [

      [
        "Niagara Falls",
        "💦",
        "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=900&q=80",
        "A spectacular group of waterfalls on the Canada–US border."
      ],

      [
        "Banff",
        "🏔️",
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=900&q=80",
        "A famous mountain destination in the Canadian Rockies."
      ]

    ]
  },


  Italy: {
    flag: "🇮🇹",
    capital: "Rome",
    language: "Italian",
    currency: "Euro (EUR)",
    continent: "Europe",

    places: [

      [
        "Colosseum",
        "🏛️",
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
        "An ancient Roman amphitheater and major historic landmark."
      ],

      [
        "Venice",
        "🚤",
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80",
        "A city famous for canals, bridges and historic architecture."
      ],

      [
        "Italian Cuisine",
        "🍕",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
        "Known worldwide for pasta, pizza, gelato and many regional foods."
      ]

    ]
  },


  China: {
    flag: "🇨🇳",
    capital: "Beijing",
    language: "Mandarin Chinese",
    currency: "Renminbi (CNY)",
    continent: "Asia",

    places: [

      [
        "Great Wall",
        "🧱",
        "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80",
        "A historic system of fortifications stretching across northern China."
      ],

      [
        "Forbidden City",
        "🏯",
        "https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=900&q=80",
        "A historic imperial palace complex in Beijing."
      ]

    ]
  },


  Mexico: {
    flag: "🇲🇽",
    capital: "Mexico City",
    language: "Spanish is most widely spoken",
    currency: "Mexican Peso (MXN)",
    continent: "North America",

    places: [

      [
        "Chichén Itzá",
        "🏛️",
        "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=900&q=80",
        "A famous Maya archaeological site on the Yucatán Peninsula."
      ],

      [
        "Mexican Cuisine",
        "🌮",
        "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=80",
        "Known for tacos, maize-based foods, spices and many regional traditions."
      ]

    ]
  }

};


/* ================= MAP ================= */

function createWorldMap() {

  if (worldMap) return;

  worldMap =
    L.map(
      "worldMap",
      {
        minZoom: 1,
        maxZoom: 6
      }
    ).setView(
      [20, 0],
      2
    );


  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        "© OpenStreetMap contributors"
    }
  ).addTo(worldMap);


  fetch(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  )
    .then(response =>
      response.json()
    )
    .then(world => {

      const geo =
        topojson.feature(
          world,
          world.objects.countries
        );


      L.geoJSON(
        geo,
        {

          style: {
            color: "#7d8cff",
            weight: 1,
            fillColor: "#5364c9",
            fillOpacity: .5
          },


          onEachFeature:
            function(
              feature,
              layer
            ) {

              const name =
                feature.properties.name;

              layer.bindTooltip(
                name
              );


              layer.on({

                mouseover:
                  function(event) {

                    event.target.setStyle({
                      fillColor:
                        "#9a80ff",
                      fillOpacity:
                        .8
                    });

                  },


                mouseout:
                  function(event) {

                    event.target.setStyle({
                      fillColor:
                        "#5364c9",
                      fillOpacity:
                        .5
                    });

                  },


                click:
                  function() {

                    selectCountry(
                      name
                    );

                  }

              });

            }

        }

      ).addTo(worldMap);

    })

    .catch(() => {

      document
        .getElementById(
          "countryPanel"
        )
        .innerHTML =
        `
        <div class="emptyCountry">
          ❌ Unable to load the world map.
          Check your internet connection.
        </div>
        `;

    });

}


/* ================= COUNTRY ================= */

const aliases = {

  "United States of America":
    "United States",

  "United Kingdom":
    "United Kingdom"

};


function selectCountry(
  rawName
) {

  const key =
    aliases[rawName] ||
    rawName;


  const country =
    countries[key];


  if (!country) {

    document
      .getElementById(
        "countryPanel"
      )
      .innerHTML =
      `
      <div class="emptyCountry">

        🌍

        <h2>
          ${escapeHTML(rawName)}
        </h2>

        <p>
          More information for this country
          will be added soon.
        </p>

      </div>
      `;

    return;

  }


  if (
    !data.discoveredCountries
      .includes(key)
  ) {

    data.discoveredCountries
      .push(key);

    data.coins += 5;

    save();

  }


  document
    .getElementById(
      "countryPanel"
    )
    .innerHTML = `

      <div class="countryHead">

        <div class="flag">
          ${country.flag}
        </div>

        <div>
          <h2>
            ${escapeHTML(rawName)}
          </h2>

          <small>
            🌍 ${country.continent}
          </small>
        </div>

      </div>


      <div class="facts">

        <div>
          <b>Capital</b>
          <span>
            ${country.capital}
          </span>
        </div>

        <div>
          <b>Language</b>
          <span>
            ${country.language}
          </span>
        </div>

        <div>
          <b>Currency</b>
          <span>
            ${country.currency}
          </span>
        </div>

        <div>
          <b>Continent</b>
          <span>
            ${country.continent}
          </span>
        </div>

      </div>


      <h3>
        ⭐ Famous For
      </h3>


      <div class="placeGrid">

        ${country.places
          .map(
            (place, index) => `

              <button
                class="placeCard"
                onclick="
                  showPlace(
                    '${key}',
                    ${index}
                  )
                "
              >

                <img
                  src="${place[2]}"
                  alt="${escapeHTML(place[0])}"
                >

                <span>
                  ${place[1]}
                  ${escapeHTML(place[0])}
                </span>

              </button>

            `
          )
          .join("")}

      </div>


      <div
        id="selectedPlace"
        class="selectedPlace"
      >

        <p>
          Click a famous place to learn more.
        </p>

      </div>

    `;

}


function showPlace(
  countryKey,
  index
) {

  const place =
    countries[
      countryKey
    ].places[index];


  document
    .getElementById(
      "selectedPlace"
    )
    .innerHTML = `

      <img
        src="${place[2]}"
        alt="${escapeHTML(place[0])}"
      >

      <div>

        <h2>
          ${place[1]}
          ${escapeHTML(place[0])}
        </h2>

        <p>
          ${escapeHTML(place[3])}
        </p>

        <p>
          💡 Keep exploring to discover more!
        </p>

      </div>

    `;

}


/* ================= SAFETY ================= */

function escapeHTML(text) {

  return String(text)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* ================= START ================= */

update();
