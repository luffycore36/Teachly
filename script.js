const API_URL = "https://teachly-nmxh.onrender.com";

let currentUser = null;
let currentLesson = null;
let currentQuiz = null;
let currentChatUser = null;
let socket = null;
let map = null;
let currentRole = "learner";
let currentCategory = "All";


// ===============================
// LESSON DATA
// ===============================

const lessons = [

{
id:1,
title:"Fractions",
category:"Mathematics",
icon:"➗",
description:"Understand fractions and their parts.",
content:`
<h3>Fractions</h3>
<p>A fraction represents a part of a whole.</p>
<p>Example: 1/2 means one out of two equal parts.</p>
`,
quiz:{
question:"What is the numerator in 3/5?",
options:["3","5","8","2"],
answer:"3"
}
},

{
id:2,
title:"Algebra Basics",
category:"Mathematics",
icon:"📐",
description:"Learn variables and equations.",
content:`
<h3>Algebra</h3>
<p>Algebra uses symbols for unknown values.</p>
<p>x + 3 = 8 means x = 5.</p>
`,
quiz:{
question:"If x + 3 = 8, what is x?",
options:["3","5","8","11"],
answer:"5"
}
},

{
id:3,
title:"Solar System",
category:"Science",
icon:"🪐",
description:"Explore planets around the Sun.",
content:`
<h3>Solar System</h3>
<p>The Solar System contains the Sun and eight planets.</p>
`,
quiz:{
question:"How many planets are there?",
options:["7","8","9","10"],
answer:"8"
}
},

{
id:4,
title:"Photosynthesis",
category:"Science",
icon:"🌱",
description:"Learn how plants create food.",
content:`
<h3>Photosynthesis</h3>
<p>Plants use sunlight, water and carbon dioxide to create food.</p>
`,
quiz:{
question:"Which gas do plants absorb?",
options:[
"Oxygen",
"Carbon dioxide",
"Hydrogen",
"Helium"
],
answer:"Carbon dioxide"
}
}

];


// ===============================
// STARTUP
// ===============================

document.addEventListener(
"DOMContentLoaded",
()=>{

loadTheme();

loadUser();

if(currentUser){

prepareUser();

updateHome();

openPage("homePage");

}
else{

openPage("loginPage");

}

});


// ===============================
// PAGE SYSTEM
// ===============================

function openPage(id){

document
.querySelectorAll(".page")
.forEach(
page=>{
page.classList.remove("active");
}
);

const page =
document.getElementById(id);

if(page){

page.classList.add("active");

}

if(id==="aiPage")
renderLessons();

if(id==="profilePage")
updateProfile();

if(id==="savedLessonsPage")
renderSavedLessons();

if(id==="shopPage")
renderShop();

if(id==="badgesPage")
renderBadges();

if(id==="peoplePage")
loadPeople();

if(id==="mapPage")
initializeMap();

}

window.openPage = openPage;


// ===============================
// USER SYSTEM
// ===============================

function prepareUser(){

if(!currentUser)
return;

currentUser.coins =
Number(currentUser.coins ?? 100);

currentUser.completedLessons =
Array.isArray(currentUser.completedLessons)
?
currentUser.completedLessons
:
[];

currentUser.savedLessons =
Array.isArray(currentUser.savedLessons)
?
currentUser.savedLessons
:
[];

currentUser.quizCompleted =
Array.isArray(currentUser.quizCompleted)
?
currentUser.quizCompleted
:
[];

currentUser.purchasedItems =
Array.isArray(currentUser.purchasedItems)
?
currentUser.purchasedItems
:
[];

currentUser.sessions =
Number(currentUser.sessions || 0);

currentUser.role =
currentUser.role || "learner";

}


// ===============================
// SAVE USER
// ===============================

function saveUser(){

if(!currentUser)
return;

localStorage.setItem(
"teachlyUser",
JSON.stringify(currentUser)
);

}

window.saveUser = saveUser;


// ===============================
// LOAD USER
// ===============================

function loadUser(){

const saved =
localStorage.getItem(
"teachlyUser"
);

if(saved){

try{

currentUser =
JSON.parse(saved);

prepareUser();

}

catch(error){

console.error(
"USER LOAD ERROR:",
error
);

localStorage.removeItem(
"teachlyUser"
);

currentUser = null;

}

}

}


// ===============================
// LOGIN
// ===============================

async function loginUser(){

const email =
document
.getElementById("loginEmail")
.value
.trim();

const password =
document
.getElementById("loginPassword")
.value
.trim();

const message =
document.getElementById(
"authMessage"
);

if(!email || !password){

if(message)
message.textContent =
"Enter email and password";

return;

}

try{

const response =
await fetch(
`${API_URL}/api/auth/login`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

email,
password

})

});

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"Login failed"
);

currentUser =
data.user;

prepareUser();

saveUser();

updateHome();

openPage(
"homePage"
);

}

catch(error){

console.error(
"LOGIN ERROR:",
error
);

if(message)
message.textContent =
error.message ||
"Login failed";

}

}

window.loginUser =
loginUser;


// ===============================
// REGISTER
// ===============================

async function registerUserAccount(){

const username =
document
.getElementById("registerUsername")
.value
.trim();

const email =
document
.getElementById("registerEmail")
.value
.trim();

const password =
document
.getElementById("registerPassword")
.value
.trim();

const roleElement =
document.getElementById(
"registerRole"
);

const role =
roleElement
?
roleElement.value
:
"learner";

const message =
document.getElementById(
"registerMessage"
);

if(!username || !email || !password){

if(message)
message.textContent =
"Please fill all fields.";

return;

}

try{

const response =
await fetch(
`${API_URL}/api/auth/register`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

username,
email,
password,
role

})

});

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"Registration failed"
);

const verifyInput =
document.getElementById(
"verifyEmail"
);

if(verifyInput)
verifyInput.value =
email;

openPage(
"verifyPage"
);

}

catch(error){

console.error(
"REGISTER ERROR:",
error
);

if(message)
message.textContent =
error.message ||
"Registration failed";

}

}

window.registerUserAccount =
registerUserAccount;


// ===============================
// VERIFY EMAIL
// ===============================

async function verifyEmail(){

const email =
document
.getElementById("verifyEmail")
.value
.trim();

const code =
document
.getElementById("verifyCode")
.value
.trim();

const message =
document.getElementById(
"verifyMessage"
);

if(!email || !code){

if(message)
message.textContent =
"Enter your email and verification code.";

return;

}

try{

const response =
await fetch(
`${API_URL}/api/auth/verify-email`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

email,
code

})

});

const data =
await response.json();

if(!response.ok)
throw new Error(
data.error ||
"Verification failed"
);

if(message)
message.textContent =
"Email verified. Login now.";

openPage(
"loginPage"
);

}

catch(error){

console.error(
"VERIFY ERROR:",
error
);

if(message)
message.textContent =
error.message ||
"Verification failed";

}

}

window.verifyEmail =
verifyEmail;


// ===============================
// LOGOUT
// ===============================

async function logout(){

if(socket){

try{
socket.disconnect();
}
catch(error){
console.error(error);
}

socket = null;

}

try{

if(currentUser){

await fetch(
`${API_URL}/api/auth/logout`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:currentUser.email
})
}
);

}

}
catch(error){

console.warn(
"Logout request failed:",
error
);

}

currentUser = null;

localStorage.removeItem(
"teachlyUser"
);

openPage(
"loginPage"
);

}

window.logout =
logout;


// ===============================
// HOME UPDATE
// ===============================

function updateHome(){

if(!currentUser)
return;

prepareUser();

const username =
document.getElementById(
"homeUsername"
);

const welcome =
document.getElementById(
"welcomeText"
);

const coins =
document.getElementById(
"coinCount"
);

const sessions =
document.getElementById(
"sessionCount"
);

if(username)
username.textContent =
currentUser.username;

if(welcome)
welcome.textContent =
`Welcome ${currentUser.username}!`;

if(coins)
coins.textContent =
currentUser.coins;

if(sessions)
sessions.textContent =
currentUser.sessions || 0;

}

window.updateHome =
updateHome;


// ===============================
// ROLE SELECT
// ===============================

function chooseRole(role){

if(role!=="learner" &&
role!=="teacher"){

role = "learner";

}

currentRole =
role;

if(currentUser){

currentUser.role =
role;

saveUser();

}

if(role==="learner"){

openPage(
"searchPage"
);

setTimeout(
()=>{

openPage(
"peoplePage"
);

},
1200
);

}
else{

openPage(
"aiPage"
);

}

}

window.chooseRole =
chooseRole;


// ===============================
// LESSON SYSTEM
// ===============================

function renderLessons(category="All"){

const grid =
document.getElementById(
"lessonGrid"
);

if(!grid)
return;

const list =
category==="All"
?
lessons
:
lessons.filter(
lesson =>
lesson.category===category
);

grid.innerHTML="";

list.forEach(
lesson=>{

const card =
document.createElement(
"div"
);

card.className =
"lessonCard";

card.innerHTML = `

<div class="lessonIcon">
${lesson.icon}
</div>

<h3>
${lesson.title}
</h3>

<p>
${lesson.description}
</p>

<button onclick="openLesson(${lesson.id})">
Learn →
</button>

`;

grid.appendChild(
card
);

});

}

window.renderLessons =
renderLessons;


// ===============================
// FILTER LESSONS
// ===============================

function filterLessons(category){

currentCategory =
category;

renderLessons(
category
);

}

window.filterLessons =
filterLessons;


// ===============================
// OPEN LESSON
// ===============================

function openLesson(id){

currentLesson =
lessons.find(
lesson =>
lesson.id===id
);

if(!currentLesson)
return;

const title =
document.getElementById(
"selectedLessonTitle"
);

const category =
document.getElementById(
"selectedLessonCategory"
);

const desc =
document.getElementById(
"selectedLessonDescription"
);

const content =
document.getElementById(
"selectedLessonContent"
);

if(title)
title.textContent =
currentLesson.title;

if(category)
category.textContent =
currentLesson.category;

if(desc)
desc.textContent =
currentLesson.description;

if(content)
content.innerHTML =
currentLesson.content;

updateSaveButton();

openPage(
"selectedLessonPage"
);

}

window.openLesson =
openLesson;


// ===============================
// COMPLETE LESSON
// ===============================

function completeLesson(){

if(!currentUser ||
!currentLesson)
return;

prepareUser();

if(
!currentUser.completedLessons.includes(
currentLesson.id
)
){

currentUser.completedLessons.push(
currentLesson.id
);

currentUser.coins += 20;

saveUser();

updateHome();

renderBadges();

}

}

window.completeLesson =
completeLesson;


// ===============================
// SAVE LESSON
// ===============================

function toggleSavedLesson(){

if(!currentUser ||
!currentLesson)
return;

prepareUser();

const index =
currentUser.savedLessons.indexOf(
currentLesson.id
);

if(index>=0){

currentUser.savedLessons.splice(
index,
1
);

}
else{

currentUser.savedLessons.push(
currentLesson.id
);

}

saveUser();

updateSaveButton();

}

window.toggleSavedLesson =
toggleSavedLesson;


// ===============================
// SAVE BUTTON
// ===============================

function updateSaveButton(){

const button =
document.getElementById(
"saveLessonButton"
);

if(!button)
return;

button.textContent =
(
currentUser &&
currentLesson &&
currentUser.savedLessons.includes(
currentLesson.id
)
)
?
"★ Saved"
:
"☆ Save Lesson";

}


// ===============================
// SAVED LESSONS
// ===============================

function renderSavedLessons(){

const box =
document.getElementById(
"savedLessonList"
);

if(!box)
return;

box.innerHTML="";

const saved =
currentUser?.savedLessons || [];

if(saved.length===0){

box.innerHTML =
"<p>No saved lessons.</p>";

return;

}

saved.forEach(
id=>{

const lesson =
lessons.find(
x=>x.id===id
);

if(!lesson)
return;

box.innerHTML += `

<div class="lessonCard">

<h3>
${lesson.title}
</h3>

<p>
${lesson.description}
</p>

<button onclick="openLesson(${lesson.id})">
Open
</button>

</div>

`;

});

}

window.renderSavedLessons =
renderSavedLessons;


// ===============================
// QUIZ SYSTEM
// ===============================

function startQuiz(){

if(!currentLesson)
return;

currentQuiz =
currentLesson.quiz;

const question =
document.getElementById(
"quizQuestion"
);

const box =
document.getElementById(
"quizOptions"
);

const result =
document.getElementById(
"quizResult"
);

if(question)
question.textContent =
currentQuiz.question;

if(result)
result.textContent="";

if(!box)
return;

box.innerHTML="";

currentQuiz.options.forEach(
option=>{

const button =
document.createElement(
"button"
);

button.textContent =
option;

button.onclick =
()=>answerQuiz(option);

box.appendChild(
button
);

});

openPage(
"quizPage"
);

}

window.startQuiz =
startQuiz;


// ===============================
// ANSWER QUIZ
// ===============================

function answerQuiz(answer){

if(!currentQuiz)
return;

const result =
document.getElementById(
"quizResult"
);

if(answer===currentQuiz.answer){

if(result)
result.textContent =
"🎉 Correct!";

if(currentUser){

prepareUser();

if(
!currentUser.quizCompleted.includes(
currentLesson.id
)
){

currentUser.quizCompleted.push(
currentLesson.id
);

currentUser.coins += 10;

saveUser();

updateHome();

renderBadges();

}

}

}
else{

if(result)
result.textContent =
"❌ Try again";

}

}

window.answerQuiz =
answerQuiz;


// ===============================
// AI RESPONSE HELPER
// ===============================

async function readAIResponse(response){

const contentType =
response.headers.get(
"content-type"
) || "";

if(
!response.ok
){

if(
contentType.includes(
"application/json"
)
){

const data =
await response.json();

throw new Error(
data.error ||
`Server error ${response.status}`
);

}

const text =
await response.text();

throw new Error(
`Server returned HTML instead of JSON (${response.status}). ${text.slice(0,200)}`
);

}

if(
!contentType.includes(
"application/json"
)
){

const text =
await response.text();

throw new Error(
`Expected JSON but received HTML. ${text.slice(0,200)}`
);

}

return response.json();

}

window.readAIResponse =
readAIResponse;


// ===============================
// AI TEACHER
// ===============================

async function askAI(message){

try{

const response =
await fetch(
`${API_URL}/api/ai`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

message,

username:
currentUser?.username ||
"Student",

lesson:
currentLesson?.title ||
null

})

});

const data =
await readAIResponse(
response
);

return data.answer ||
"AI could not answer.";

}

catch(error){

console.error(
"AI ERROR:",
error
);

return "AI Teacher unavailable.";

}

}

window.askAI =
askAI;


// ===============================
// AI TEACHER CHAT
// ===============================

async function teacherAIHelp(){

const input =
document.getElementById(
"aiQuestion"
);

const chat =
document.getElementById(
"aiChat"
);

if(!input || !chat)
return;

const question =
input.value.trim();

if(!question)
return;

chat.innerHTML += `

<div class="aiMessage user">

${escapeHTML(question)}

</div>

`;

input.value="";

const answer =
await askAI(
question
);

chat.innerHTML += `

<div class="aiMessage assistant">

${escapeHTML(answer)}

</div>

`;

chat.scrollTop =
chat.scrollHeight;

}

window.teacherAIHelp =
teacherAIHelp;


// ===============================
// SAFE HTML
// ===============================

function escapeHTML(value){

return String(value)
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");

}


// ===============================
// MYSTERY TOPIC
// ===============================

function mysteryTopic(){

const topics=[

[
"Why is the sky blue?",
"Sunlight scatters in Earth's atmosphere."
],

[
"How do airplanes fly?",
"Wings create lift by changing air pressure."
],

[
"Why do seasons happen?",
"Earth's tilt changes sunlight."
],

[
"What are black holes?",
"Places with extremely strong gravity."
],

[
"How do plants grow?",
"Plants use sunlight, water and carbon dioxide."
]

];

const topic =
topics[
Math.floor(
Math.random()*topics.length
)
];

const page =
document.getElementById(
"mysteryPage"
);

if(page){

openPage(
"mysteryPage"
);

const title =
document.getElementById(
"mysteryTopicTitle"
);

const text =
document.getElementById(
"mysteryTopicText"
);

if(title)
title.textContent =
topic[0];

if(text)
text.textContent =
topic[1];

}

else{

alert(
topic[0]+"\n\n"+topic[1]
);

}

}

window.mysteryTopic =
mysteryTopic;


// ===============================
// BADGES
// ===============================

function renderBadges(){

const box =
document.getElementById(
"allBadges"
);

if(!box)
return;

const completed =
currentUser?.completedLessons?.length || 0;

const quizzes =
currentUser?.quizCompleted?.length || 0;

const badges=[

[
"🌱",
"First Lesson",
completed>=1
],

[
"📚",
"Book Collector",
completed>=5
],

[
"🧠",
"Knowledge Master",
completed>=10
],

[
"🏆",
"Quiz Starter",
quizzes>=1
],

[
"👑",
"Teachly Legend",
completed>=25
]

];

box.innerHTML="";

badges.forEach(
badge=>{

box.innerHTML += `

<div class="badge ${badge[2]?"":"locked"}">

<h2>
${badge[0]}
</h2>

<h3>
${badge[1]}
</h3>

<p>
${badge[2]?
"Unlocked ✓":
"Locked"}
</p>

</div>

`;

});

}

window.renderBadges =
renderBadges;


// ===============================
// SHOP
// ===============================

function renderShop(){

const box =
document.getElementById(
"shopList"
);

if(!box)
return;

const items=[

["🟣","Purple Glow",50],
["⭐","Star Effect",100],
["🔥","Fire Aura",250],
["👑","Royal Crown",500],
["💎","Diamond Aura",1000],
["⚡","Lightning Aura",3000]

];

box.innerHTML="";

items.forEach(
item=>{

const owned =
currentUser?.purchasedItems?.includes(
item[1]
);

box.innerHTML += `

<div class="shopItem">

<h2>
${item[0]}
</h2>

<h3>
${item[1]}
</h3>

<p>
💰 ${item[2]}
</p>

<button
onclick="buyItem('${escapeHTML(item[1])}',${item[2]})"
>

${owned?"Equip":"Buy"}

</button>

</div>

`;

});

}

window.renderShop =
renderShop;


// ===============================
// BUY SHOP ITEM
// ===============================

function buyItem(name,price){

if(!currentUser)
return;

prepareUser();

if(
currentUser.purchasedItems.includes(
name
)
){

currentUser.equippedItem =
name;

}
else{

if(
currentUser.coins < price
){

alert(
"Not enough coins"
);

return;

}

currentUser.coins -= price;

currentUser.purchasedItems.push(
name
);

currentUser.equippedItem =
name;

}

saveUser();

updateHome();

renderShop();

}

window.buyItem =
buyItem;


// ===============================
// AVATAR PREVIEW
// ===============================

function previewAvatar(event){

const file =
event.target.files?.[0];

if(!file)
return;

const reader =
new FileReader();

reader.onload =
e=>{

const preview =
document.getElementById(
"avatarPreview"
);

if(preview){

preview.src =
e.target.result;

preview.style.display =
"block";

}

};

reader.readAsDataURL(
file
);

}

window.previewAvatar =
previewAvatar;


// ===============================
// UPLOAD AVATAR
// ===============================

function uploadAvatar(){

const preview =
document.getElementById(
"avatarPreview"
);

if(
!preview ||
!currentUser ||
!preview.src
)
return;

currentUser.profileImage =
preview.src;

saveUser();

updateProfile();

}

window.uploadAvatar =
uploadAvatar;


// ===============================
// PROFILE
// ===============================

function updateProfile(){

if(!currentUser)
return;

const name =
document.getElementById(
"profileName"
);

const coins =
document.getElementById(
"profileCoins"
);

const lessonsCompleted =
document.getElementById(
"profileLessons"
);

if(name)
name.textContent =
currentUser.username;

if(coins)
coins.textContent =
currentUser.coins;

if(lessonsCompleted)
lessonsCompleted.textContent =
currentUser.completedLessons.length;

const avatar =
document.getElementById(
"profileAvatar"
);

if(
avatar &&
currentUser.profileImage
){

avatar.src =
currentUser.profileImage;

}

}

window.updateProfile =
updateProfile;


// ===============================
// PEOPLE / REAL REGISTERED USERS
// ===============================

async function loadPeople(){

const container =
document.getElementById(
"peopleList"
);

if(!container)
return;

container.innerHTML = `
<p>Finding real registered Teachly users...</p>
`;

try{

const response =
await fetch(
`${API_URL}/api/people`
);

const data =
await readAIResponse(
response
);

const users =
Array.isArray(data.people)
?
data.people
:
[];

const myUsername =
String(
currentUser?.username || ""
)
.trim()
.toLowerCase();

const wantedRole =
currentRole==="learner"
?
"teacher"
:
"learner";

const matches =
users.filter(
user=>{

const username =
String(
user.username || ""
)
.trim()
.toLowerCase();

return(
username &&
username!==myUsername &&
user.role===wantedRole
);

});

container.innerHTML="";

if(!matches.length){

container.innerHTML = `

<div class="emptyState">

<h3>
No ${wantedRole} available
</h3>

<p>
There are no registered ${wantedRole}s available right now.
</p>

${
currentRole==="learner"
?
`
<button onclick="openAITeacher()">
Learn with AI Teacher
</button>
`
:
`
<button onclick="goHome()">
Back Home
</button>
`
}

</div>

`;

return;

}

matches.forEach(
person=>{

const card =
document.createElement(
"div"
);

card.className =
"personCard";

const avatar =
person.profileImage ||
"https://via.placeholder.com/80";

card.innerHTML = `

<img
src="${avatar}"
alt="Profile"
class="personAvatar"
>

<h3>
${escapeHTML(person.username)}
</h3>

<p>
${escapeHTML(person.role || "Teachly user")}
</p>

<button>
Connect
</button>

`;

const button =
card.querySelector(
"button"
);

button.onclick =
()=>connectToPerson(
person
);

container.appendChild(
card
);

});

}

catch(error){

console.error(
"PEOPLE ERROR:",
error
);

container.innerHTML = `

<div class="emptyState">

<h3>
Unable to find users
</h3>

<p>
Please try again later.
</p>

<button onclick="loadPeople()">
Try Again
</button>

</div>

`;

}

}

window.loadPeople =
loadPeople;


// ===============================
// CONNECT TO PERSON
// ===============================

function connectToPerson(person){

if(!currentUser)
return;

currentChatUser =
person;

currentUser.sessions =
Number(currentUser.sessions || 0) + 1;

saveUser();

updateHome();

const name =
person.username ||
"Teachly User";

openChat(
name
);

}

window.connectToPerson =
connectToPerson;


// ===============================
// CHAT
// ===============================

function openChat(name){

const chatPage =
document.getElementById(
"chatPage"
);

const chatTitle =
document.getElementById(
"chatUserName"
);

if(chatTitle)
chatTitle.textContent =
name;

if(chatPage){

openPage(
"chatPage"
);

}
else{

alert(
`Connected with ${name}`
);

}

}

window.openChat =
openChat;


// ===============================
// HOME NAVIGATION
// ===============================

function goHome(){

openPage(
"homePage"
);

updateHome();

}

window.goHome =
goHome;


// ===============================
// AI TEACHER PAGE
// ===============================

function openAITeacher(){

openPage(
"aiPage"
);

}

window.openAITeacher =
openAITeacher;


// ===============================
// THEME
// ===============================

function loadTheme(){

const savedTheme =
localStorage.getItem(
"teachlyTheme"
) ||
"light";

document.documentElement
.setAttribute(
"data-theme",
savedTheme
);

document.body
.classList.toggle(
"dark",
savedTheme==="dark"
);

}

window.loadTheme =
loadTheme;


function toggleTheme(){

const current =
localStorage.getItem(
"teachlyTheme"
) ||
"light";

const next =
current==="dark"
?
"light"
:
"dark";

localStorage.setItem(
"teachlyTheme",
next
);

document.documentElement
.setAttribute(
"data-theme",
next
);

document.body
.classList.toggle(
"dark",
next==="dark"
);

}

window.toggleTheme =
toggleTheme;


// ===============================
// MAP
// ===============================

function initializeMap(){

const mapElement =
document.getElementById(
"map"
);

if(!mapElement)
return;

if(
typeof L==="undefined"
){

console.warn(
"Leaflet is not loaded."
);

return;

}

if(map){

setTimeout(
()=>{
map.invalidateSize();
},
100
);

return;

}

map =
L.map(
mapElement
).setView(
[13.0827,80.2707],
10
);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution:
"&copy; OpenStreetMap contributors"
}
).addTo(map);

}

window.initializeMap =
initializeMap;


// ===============================
// REFRESH DATA
// ===============================

function refreshData(){

if(!currentUser)
return;

prepareUser();

updateHome();

updateProfile();

renderBadges();

renderShop();

}

window.refreshData =
refreshData;


// ===============================
// GLOBAL ERROR LOGGING
// ===============================

window.addEventListener(
"error",
event=>{

console.error(
"Teachly JavaScript Error:",
event.error || event.message
);

}
);


// ===============================
// FINAL LOAD MESSAGE
// ===============================

console.log(
"Teachly Final JS Loaded 🚀"
);

/* =====================================================
   TEACHLY — PART 2/3
   LESSONS • QUIZ • AI • MYSTERY • BADGES • SHOP
   PROFILE • PEOPLE • CHAT • LEARNSPHERE
===================================================== */


/* =====================================================
   LESSON SYSTEM
===================================================== */

let currentCategory = "All";


function renderLessons(category = "All") {

    const grid =
        document.getElementById("lessonGrid");

    if (!grid) return;


    const filtered =
        category === "All"
            ? lessons
            : lessons.filter(
                lesson =>
                    lesson.category === category
            );


    grid.innerHTML = "";


    filtered.forEach(lesson => {

        const completed =
            currentUser &&
            currentUser.completedLessons &&
            currentUser.completedLessons.includes(
                lesson.id
            );


        const card =
            document.createElement("div");

        card.className = "lessonCard";


        card.innerHTML = `

            <div class="lessonIcon">
                ${lesson.icon}
            </div>

            <h3>
                ${escapeHTML(lesson.title)}
            </h3>

            <p>
                ${escapeHTML(lesson.description)}
            </p>

            <button
                onclick="openLesson(${lesson.id})"
            >
                ${completed ? "Review →" : "Learn →"}
            </button>

        `;


        grid.appendChild(card);

    });

}


window.renderLessons = renderLessons;



function filterLessons(category) {

    currentCategory =
        category || "All";

    renderLessons(currentCategory);

}


window.filterLessons = filterLessons;



/* =====================================================
   OPEN LESSON
===================================================== */

function openLesson(id) {

    const lesson =
        lessons.find(
            item => item.id === Number(id)
        );


    if (!lesson) {

        showToast(
            "Lesson not found."
        );

        return;
    }


    currentLesson =
        lesson;


    const header =
        document.getElementById(
            "selectedLessonHeader"
        );


    const title =
        document.getElementById(
            "selectedLessonTitle"
        );


    const category =
        document.getElementById(
            "selectedLessonCategory"
        );


    const description =
        document.getElementById(
            "selectedLessonDescription"
        );


    const content =
        document.getElementById(
            "selectedLessonContent"
        );


    if (header) {

        header.textContent =
            lesson.title;

    }


    if (title) {

        title.textContent =
            `${lesson.icon} ${lesson.title}`;

    }


    if (category) {

        category.textContent =
            lesson.category;

    }


    if (description) {

        description.textContent =
            lesson.description;

    }


    if (content) {

        content.innerHTML =
            lesson.content;

    }


    updateSaveButton();


    openPage(
        "selectedLessonPage"
    );

}


window.openLesson =
    openLesson;



/* =====================================================
   COMPLETE LESSON
===================================================== */

function completeLesson() {

    if (
        !currentUser ||
        !currentLesson
    ) {

        showToast(
            "Please choose a lesson first."
        );

        return;
    }


    prepareUser();


    const alreadyCompleted =
        currentUser.completedLessons.includes(
            currentLesson.id
        );


    if (alreadyCompleted) {

        showToast(
            "Lesson already completed."
        );

        return;
    }


    currentUser.completedLessons.push(
        currentLesson.id
    );


    currentUser.coins =
        Number(currentUser.coins || 0) +
        20;


    saveUser();


    updateHome();

    updateProfile();

    renderLessons();

    renderBadges();


    showToast(
        "Lesson completed! +20 💰"
    );

}


window.completeLesson =
completeLesson;



/* =====================================================
   SAVED LESSONS
===================================================== */

function toggleSavedLesson() {

    if (
        !currentUser ||
        !currentLesson
    ) {

        return;
    }


    prepareUser();


    const index =
        currentUser.savedLessons.indexOf(
            currentLesson.id
        );


    if (index === -1) {

        currentUser.savedLessons.push(
            currentLesson.id
        );

        showToast(
            "Lesson saved ⭐"
        );

    }
    else {

        currentUser.savedLessons.splice(
            index,
            1
        );

        showToast(
            "Lesson removed from saved lessons."
        );

    }


    saveUser();

    updateSaveButton();

    renderSavedLessons();

}


window.toggleSavedLesson =
toggleSavedLesson;



function updateSaveButton() {

    const button =
        document.getElementById(
            "saveLessonButton"
        );


    if (!button) return;


    const saved =
        currentUser &&
        currentLesson &&
        Array.isArray(
            currentUser.savedLessons
        ) &&
        currentUser.savedLessons.includes(
            currentLesson.id
        );


    button.textContent =
        saved
            ? "★ Saved"
            : "☆ Save Lesson";

}


window.updateSaveButton =
updateSaveButton;



function renderSavedLessons() {

    const box =
        document.getElementById(
            "savedLessonList"
        );


    if (!box) return;


    prepareUser();


    const saved =
        currentUser
            ? currentUser.savedLessons
            : [];


    box.innerHTML = "";


    if (!saved.length) {

        box.innerHTML = `

            <div class="emptyState">

                <h3>
                    📚 No saved lessons
                </h3>

                <p>
                    Save lessons here so
                    you can return to them later.
                </p>

            </div>

        `;

        return;
    }


    saved.forEach(id => {

        const lesson =
            lessons.find(
                item => item.id === id
            );


        if (!lesson) return;


        box.innerHTML += `

            <div class="lessonCard">

                <div class="lessonIcon">
                    ${lesson.icon}
                </div>

                <h3>
                    ${escapeHTML(lesson.title)}
                </h3>

                <p>
                    ${escapeHTML(lesson.description)}
                </p>

                <button
                    onclick="openLesson(${lesson.id})"
                >
                    Open →
                </button>

            </div>

        `;

    });

}


window.renderSavedLessons =
renderSavedLessons;



/* =====================================================
   QUIZ SYSTEM
===================================================== */

function startQuiz() {

    if (!currentLesson) {

        showToast(
            "Choose a lesson first!"
        );

        openPage("aiPage");

        return;
    }


    startQuizForLesson(
        currentLesson
    );

}


window.startQuiz =
startQuiz;



function startQuizForLesson(lesson) {

    if (!lesson) {

        showToast(
            "Lesson unavailable."
        );

        return;
    }


    currentLesson =
        lesson;


    currentQuiz =
        lesson.quiz;


    const name =
        document.getElementById(
            "quizLessonName"
        );


    const question =
        document.getElementById(
            "quizQuestion"
        );


    const options =
        document.getElementById(
            "quizOptions"
        );


    const result =
        document.getElementById(
            "quizResult"
        );


    if (name) {

        name.textContent =
            `${lesson.icon} ${lesson.title}`;

    }


    if (question) {

        question.textContent =
            lesson.quiz.question;

    }


    if (options) {

        options.innerHTML = "";


        lesson.quiz.options.forEach(
            option => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =
                    option;


                button.onclick =
                    () =>
                        answerQuiz(option);


                options.appendChild(
                    button
                );

            }
        );

    }


    if (result) {

        result.textContent = "";

    }


    openPage(
        "quizPage"
    );

}


window.startQuizForLesson =
startQuizForLesson;



function answerQuiz(answer) {

    if (
        !currentQuiz ||
        !currentLesson
    ) {

        return;
    }


    const result =
        document.getElementById(
            "quizResult"
        );


    if (!result) return;


    if (
        String(answer).trim().toLowerCase() ===
        String(currentQuiz.answer)
            .trim()
            .toLowerCase()
    ) {

        result.innerHTML = `

            <div class="quizSuccess">

                🎉 <strong>Correct!</strong>

                <p>
                    Great job. You understood
                    the lesson.
                </p>

            </div>

        `;


        prepareUser();


        if (
            !currentUser.quizCompleted.includes(
                currentLesson.id
            )
        ) {

            currentUser.quizCompleted.push(
                currentLesson.id
            );


            currentUser.coins =
                Number(currentUser.coins || 0) +
                10;


            saveUser();


            updateHome();

            updateProfile();

            renderBadges();


            showToast(
                "Quiz completed! +10 💰"
            );

        }

    }
    else {

        result.innerHTML = `

            <div class="quizWrong">

                ❌ <strong>Not quite.</strong>

                <p>
                    Try again and think about
                    what you learned.
                </p>

            </div>

        `;

    }

}


window.answerQuiz =
answerQuiz;



function finishQuiz() {

    if (!currentQuiz) {

        showToast(
            "Start a quiz first."
        );

        return;
    }


    openPage(
        "selectedLessonPage"
    );

}


window.finishQuiz =
finishQuiz;



/* =====================================================
   AI RESPONSE HELPER
===================================================== */

async function readAIResponse(
    response
) {

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";


    if (!response.ok) {

        if (
            contentType.includes(
                "application/json"
            )
        ) {

            const data =
                await response.json();


            throw new Error(
                data.error ||
                `Server error ${response.status}`
            );

        }


        const text =
            await response.text();


        throw new Error(
            `Server returned HTML instead of JSON (${response.status}). ${text.slice(0, 200)}`
        );

    }


    if (
        !contentType.includes(
            "application/json"
        )
    ) {

        const text =
            await response.text();


        throw new Error(
            `Expected JSON but received HTML. ${text.slice(0, 200)}`
        );

    }


    return response.json();

}


window.readAIResponse =
readAIResponse;



/* =====================================================
   AI TEACHER
===================================================== */

async function askAI(message) {

    if (!message) {

        return "Please ask me something.";

    }


    try {

        const lessonContext =
            currentLesson
                ? `
Current lesson:
${currentLesson.title}

Description:
${currentLesson.description}

Content:
${stripHTML(
    currentLesson.content
)}
`
                : "";


        const response =
            await fetch(
                `${API_URL}/api/ai`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            message:
                                `${message}

${lessonContext}

You are Teachly AI Teacher.
Explain things clearly and simply.
Help the student understand rather than
just giving unexplained answers.`,

                            username:
                                currentUser?.username ||
                                "Student",

                            lesson:
                                currentLesson?.title ||
                                null
                        })
                }
            );


        const data =
            await readAIResponse(
                response
            );


        return (
            data.answer ||
            "AI could not answer."
        );

    }
    catch (error) {

        console.error(
            "AI ERROR:",
            error
        );


        return (
            "Sorry, I couldn't reach the AI right now. " +
            error.message
        );

    }

}


window.askAI =
askAI;



function renderAIMessage(
    text,
    type = "ai"
) {

    const chat =
        document.getElementById(
            "aiTeacherMessages"
        );


    if (!chat) return;


    const bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        type === "user"
            ? "aiBubble userBubble"
            : "aiBubble";


    if (type === "user") {

        bubble.textContent =
            text;

    }
    else {

        bubble.innerHTML =
            formatAIText(text);

    }


    chat.appendChild(
        bubble
    );


    chat.scrollTop =
        chat.scrollHeight;

}


window.renderAIMessage =
renderAIMessage;



function formatAIText(text) {

    return escapeHTML(
        text || ""
    )
        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )
        .replace(
            /\n\n/g,
            "<br><br>"
        )
        .replace(
            /\n/g,
            "<br>"
        );

}


window.formatAIText =
formatAIText;



function prepareAITeacherForLesson() {

    if (!currentLesson) return;


    const label =
        document.getElementById(
            "aiTeacherLessonLabel"
        );


    if (label) {

        label.textContent =
            `Lesson: ${currentLesson.title}`;

    }


    const chat =
        document.getElementById(
            "aiTeacherMessages"
        );


    if (!chat) return;


    chat.innerHTML = `

        <div class="aiBubble">

            <strong>
                👋 I'm ready to help.
            </strong>

            <p>
                We're studying
                <strong>
                    ${escapeHTML(
                        currentLesson.title
                    )}
                </strong>.
            </p>

            <p>
                Ask me a question about
                this lesson.
            </p>

        </div>

    `;

}


window.prepareAITeacherForLesson =
prepareAITeacherForLesson;



function openAITeacher() {

    openPage(
        "aiPage"
    );


    if (currentLesson) {

        prepareAITeacherForLesson();

    }

}


window.openAITeacher =
openAITeacher;



async function teacherAIHelp() {

    const input =
        document.getElementById(
            "aiQuestion"
        );


    if (!input) return;


    const question =
        input.value.trim();


    if (!question) {

        showToast(
            "Type a question first."
        );

        return;
    }


    renderAIMessage(
        question,
        "user"
    );


    input.value = "";


    const thinking =
        document.createElement(
            "div"
        );


    thinking.className =
        "aiBubble";


    thinking.textContent =
        "🤖 Thinking...";


    const chat =
        document.getElementById(
            "aiTeacherMessages"
        );


    if (chat) {

        chat.appendChild(
            thinking
        );

        chat.scrollTop =
            chat.scrollHeight;

    }


    const answer =
        await askAI(
            question
        );


    if (
        thinking &&
        thinking.parentNode
    ) {

        thinking.remove();

    }


    renderAIMessage(
        answer,
        "ai"
    );

}


window.teacherAIHelp =
teacherAIHelp;



function askAIQuick(
    question
) {

    const input =
        document.getElementById(
            "aiQuestion"
        );


    if (!input) return;


    input.value =
        question;


    teacherAIHelp();

}


window.askAIQuick =
askAIQuick;



/* =====================================================
   MYSTERY TOPIC
===================================================== */

const mysteryTopics = [

    {
        title:
            "Black Holes",

        text:
            "Black holes are regions of space where gravity is extremely strong."
    },

    {
        title:
            "Deep Ocean",

        text:
            "The deep ocean is a huge environment with unusual animals, pressure and very little sunlight."
    },

    {
        title:
            "Antarctica",

        text:
            "Antarctica is Earth's southernmost continent and contains most of the planet's ice."
    },

    {
        title:
            "Quantum Physics",

        text:
            "Quantum physics describes nature at very small scales such as atoms and particles."
    },

    {
        title:
            "Volcanoes",

        text:
            "Volcanoes form when magma and gases reach Earth's surface."
    },

    {
        title:
            "Human Brain",

        text:
            "The brain coordinates many functions including movement, senses, memory and thinking."
    },

    {
        title:
            "Robotics",

        text:
            "Robotics combines engineering and computing to design machines that can perform tasks."
    },

    {
        title:
            "Ocean Currents",

        text:
            "Large movements of seawater help distribute heat around Earth's oceans."
    }

];


function mysteryTopic() {

    const topic =
        mysteryTopics[
            Math.floor(
                Math.random() *
                mysteryTopics.length
            )
        ];


    const title =
        document.getElementById(
            "mysteryTitle"
        );


    const description =
        document.getElementById(
            "mysteryDescription"
        );


    const oldTitle =
        document.getElementById(
            "mysteryTopicTitle"
        );


    const oldDescription =
        document.getElementById(
            "mysteryTopicText"
        );


    if (title) {

        title.textContent =
            topic.title;

    }


    if (description) {

        description.textContent =
            topic.text;

    }


    if (oldTitle) {

        oldTitle.textContent =
            topic.title;

    }


    if (oldDescription) {

        oldDescription.textContent =
            topic.text;

    }


    openPage(
        "mysteryPage"
    );

}


window.mysteryTopic =
mysteryTopic;



/* =====================================================
   BADGES
===================================================== */

function renderBadges() {

    const boxes = [

        document.getElementById(
            "allBadges"
        ),

        document.getElementById(
            "badgesHome"
        )

    ].filter(Boolean);


    if (!boxes.length) return;


    prepareUser();


    const completed =
        currentUser?.completedLessons?.length ||
        0;


    const quizzes =
        currentUser?.quizCompleted?.length ||
        0;


    const sessions =
        currentUser?.sessions ||
        0;


    const badges = [

        [
            "🌱",
            "First Lesson",
            completed >= 1
        ],

        [
            "📚",
            "Book Collector",
            completed >= 5
        ],

        [
            "🧠",
            "Knowledge Master",
            completed >= 10
        ],

        [
            "🏆",
            "Quiz Beginner",
            quizzes >= 1
        ],

        [
            "⭐",
            "Quiz Expert",
            quizzes >= 5
        ],

        [
            "🤝",
            "Connector",
            sessions >= 1
        ],

        [
            "👑",
            "Teachly Legend",
            completed >= 25
        ]

    ];


    boxes.forEach(
        box => {

            box.innerHTML = "";


            badges.forEach(
                badge => {

                    box.innerHTML += `

                        <div
                            class="badge ${
                                badge[2]
                                    ? ""
                                    : "locked"
                            }"
                        >

                            <h2>
                                ${badge[0]}
                            </h2>

                            <h3>
                                ${escapeHTML(
                                    badge[1]
                                )}
                            </h3>

                            <p>
                                ${
                                    badge[2]
                                        ? "Unlocked ✓"
                                        : "Locked"
                                }
                            </p>

                        </div>

                    `;

                }
            );

        }
    );

}


window.renderBadges =
renderBadges;



/* =====================================================
   SHOP
===================================================== */

const shopProducts = [

    [
        "🟣",
        "Purple Glow",
        50
    ],

    [
        "⭐",
        "Star Effect",
        100
    ],

    [
        "🚀",
        "Rocket Effect",
        150
    ],

    [
        "🔥",
        "Fire Aura",
        250
    ],

    [
        "👑",
        "Royal Crown",
        500
    ],

    [
        "💎",
        "Diamond Aura",
        1000
    ],

    [
        "🌌",
        "Galaxy Effect",
        2000
    ],

    [
        "⚡",
        "Lightning Aura",
        3000
    ],

    [
        "🏆",
        "Champion Effect",
        5000
    ],

    [
        "🌈",
        "Rainbow Aura",
        7500
    ]

];


function renderShop() {

    const boxes = [

        document.getElementById(
            "shopList"
        ),

        document.getElementById(
            "shopHome"
        )

    ].filter(Boolean);


    if (!boxes.length) return;


    prepareUser();


    boxes.forEach(
        box => {

            box.innerHTML = "";


            shopProducts.forEach(
                item => {

                    const owned =
                        currentUser &&
                        currentUser.purchasedItems &&
                        currentUser.purchasedItems.includes(
                            item[1]
                        );


                    const equipped =
                        currentUser &&
                        currentUser.equippedItem ===
                        item[1];


                    box.innerHTML += `

                        <div class="shopItem">

                            <h2>
                                ${item[0]}
                            </h2>

                            <h3>
                                ${escapeHTML(
                                    item[1]
                                )}
                            </h3>

                            <p>
                                💰 ${item[2]}
                            </p>

                            <button
                                onclick="buyItem(
                                    '${escapeHTML(
                                        item[1]
                                    )}',
                                    ${item[2]}
                                )"
                            >

                                ${
                                    equipped
                                        ? "Equipped ✓"
                                        : owned
                                            ? "Equip"
                                            : "Buy"
                                }

                            </button>

                        </div>

                    `;

                }
            );

        }
    );

}


window.renderShop =
renderShop;



function buyItem(
    name,
    price
) {

    if (!currentUser) {

        showToast(
            "Please login first."
        );

        return;
    }


    prepareUser();


    const owned =
        currentUser.purchasedItems.includes(
            name
        );


    if (owned) {

        currentUser.equippedItem =
            name;


        saveUser();

        renderShop();

        showToast(
            `${name} equipped!`
        );

        return;
    }


    if (
        currentUser.coins <
        Number(price)
    ) {

        showToast(
            "Not enough 💰 coins."
        );

        return;
    }


    currentUser.coins -=
        Number(price);


    currentUser.purchasedItems.push(
        name
    );


    currentUser.equippedItem =
        name;


    saveUser();


    updateHome();

    updateProfile();

    renderShop();


    showToast(
        `${name} purchased!`
    );

}


window.buyItem =
buyItem;


/* =====================================================
   PROFILE / AVATAR
===================================================== */

function previewAvatar(event) {

    const file =
        event?.target?.files?.[0];


    if (!file) return;


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showToast(
            "Please select an image."
        );

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            const preview =
                document.getElementById(
                    "avatarPreview"
                );


            if (preview) {

                preview.src =
                    e.target.result;

                preview.style.display =
                    "block";

            }

        };


    reader.readAsDataURL(
        file
    );

}


window.previewAvatar =
previewAvatar;



function uploadAvatar() {

    if (!currentUser) {

        showToast(
            "Please login first."
        );

        return;
    }


    const preview =
        document.getElementById(
            "avatarPreview"
        );


    if (
        !preview ||
        !preview.src ||
        preview.src ===
            window.location.href
    ) {

        showToast(
            "Choose an avatar first."
        );

        return;
    }


    currentUser.profileImage =
        preview.src;


    saveUser();

    updateProfile();


    showToast(
        "Avatar updated!"
    );

}


window.uploadAvatar =
uploadAvatar;



function updateProfile() {

    if (!currentUser) return;


    prepareUser();


    const name =
        document.getElementById(
            "profileName"
        );


    const lessonsCount =
        document.getElementById(
            "profileLessons"
        );


    const sessions =
        document.getElementById(
            "profileSessions"
        );


    const coins =
        document.getElementById(
            "profileCoins"
        );


    if (name) {

        name.textContent =
            currentUser.username;

    }


    if (lessonsCount) {

        lessonsCount.textContent =
            currentUser.completedLessons.length;

    }


    if (sessions) {

        sessions.textContent =
            currentUser.sessions;

    }


    if (coins) {

        coins.textContent =
            currentUser.coins;

    }


    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    if (avatar) {

        if (
            currentUser.profileImage
        ) {

            avatar.innerHTML = `

                <img
                    src="${currentUser.profileImage}"
                    class="profileImage"
                    alt="Profile avatar"
                >

            `;

        }
        else {

            avatar.textContent =
                "👤";

        }

    }

}


window.updateProfile =
updateProfile;



/* =====================================================
   REAL REGISTERED PEOPLE
===================================================== */

async function loadPeople() {

    const list =
        document.getElementById(
            "peopleList"
        );


    if (!list) return;


    list.innerHTML = `

        <div class="loadingState">

            🔎 Looking for real
            registered Teachly users...

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/api/people`
            );


        const data =
            await readAIResponse(
                response
            );


        const users =
            Array.isArray(
                data.people
            )
                ? data.people
                : Array.isArray(data)
                    ? data
                    : [];


        const currentUsername =
            String(
                currentUser?.username || ""
            )
                .trim()
                .toLowerCase();


        const oppositeRole =
            currentRole === "teacher"
                ? "learner"
                : "teacher";


        const matches =
            users.filter(
                person => {

                    const username =
                        String(
                            person.username || ""
                        )
                            .trim()
                            .toLowerCase();


                    if (
                        !username ||
                        username ===
                            currentUsername
                    ) {

                        return false;

                    }


                    if (
                        person.role &&
                        person.role !==
                            oppositeRole
                    ) {

                        return false;

                    }


                    return true;

                }
            );


        list.innerHTML = "";


        if (!matches.length) {

            list.innerHTML = `

                <div class="emptyState">

                    <h3>
                        😕 No match found
                    </h3>

                    <p>
                        There isn't a suitable
                        registered ${oppositeRole}
                        available right now.
                    </p>

                </div>

            `;

            return;
        }


        matches.forEach(
            person => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "personCard";


                const avatar =
                    person.profileImage
                        ? `
                            <img
                                src="${person.profileImage}"
                                class="personAvatar"
                                alt="Avatar"
                            >
                          `
                        : "👤";


                card.innerHTML = `

                    <div class="personAvatarWrap">
                        ${avatar}
                    </div>

                    <h3>
                        ${escapeHTML(
                            person.username
                        )}
                    </h3>

                    <p>
                        ${
                            person.role ===
                            "teacher"
                                ? "🧑‍🏫 Teacher"
                                : "🎓 Learner"
                        }
                    </p>

                    <button>
                        Connect
                    </button>

                `;


                const button =
                    card.querySelector(
                        "button"
                    );


                if (button) {

                    button.onclick =
                        () =>
                            connectToPerson(
                                person
                            );

                }


                list.appendChild(
                    card
                );

            }
        );

    }
    catch (error) {

        console.error(
            "PEOPLE ERROR:",
            error
        );


        list.innerHTML = `

            <div class="emptyState">

                <h3>
                    ⚠️ Unable to find users
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


window.loadPeople =
loadPeople;



function connectToPerson(
    person
) {

    if (!person) return;


    currentChatUser =
        person;


    if (currentUser) {

        prepareUser();


        currentUser.sessions =
            Number(
                currentUser.sessions || 0
            ) + 1;


        saveUser();

        updateHome();

        updateProfile();

        renderBadges();

    }


    openPage(
        "chatPage"
    );


    const title =
        document.getElementById(
            "chatTitle"
        );


    if (title) {

        title.textContent =
            person.username;

    }


    const messages =
        document.getElementById(
            "chatMessages"
        );


    if (messages) {

        messages.innerHTML = `

            <div class="message">

                👋 You are connected with
                <strong>
                    ${escapeHTML(
                        person.username
                    )}
                </strong>.

            </div>

        `;

    }


    connectSocket();

}


window.connectToPerson =
connectToPerson;



/* =====================================================
   SOCKET CHAT
===================================================== */

function connectSocket() {

    if (socket) return;


    if (
        typeof io ===
        "undefined"
    ) {

        console.warn(
            "Socket.IO is not loaded."
        );

        return;
    }


    try {

        socket =
            io(API_URL);


        socket.on(
            "connect",
            () => {

                console.log(
                    "Teachly socket connected."
                );

            }
        );


        socket.on(
            "private-message",
            data => {

                if (!data) return;


                addChatMessage(
                    data.message ||
                    "",
                    false
                );

            }
        );


        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Teachly socket disconnected."
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Socket error:",
            error
        );

    }

}


window.connectSocket =
connectSocket;



function addChatMessage(
    text,
    mine = false
) {

    const box =
        document.getElementById(
            "chatMessages"
        );


    if (!box) return;


    const message =
        document.createElement(
            "div"
        );


    message.className =
        `message ${
            mine ? "me" : ""
        }`;


    message.textContent =
        text || "";


    box.appendChild(
        message
    );


    box.scrollTop =
        box.scrollHeight;

}


window.addChatMessage =
addChatMessage;



function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) return;


    const message =
        input.value.trim();


    if (!message) return;


    addChatMessage(
        message,
        true
    );


    if (socket) {

        socket.emit(
            "private-message",
            {
                message
            }
        );

    }


    input.value = "";

}


window.sendMessage =
sendMessage;



function addEmoji(
    emoji
) {

    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) return;


    input.value +=
        emoji;


    input.focus();

}


window.addEmoji =
addEmoji;



/* =====================================================
   LEARNSPHERE MAP
===================================================== */

function initializeMap() {

    if (
        typeof L ===
        "undefined"
    ) {

        console.warn(
            "Leaflet is not loaded."
        );

        return;
    }


    const container =
        document.getElementById(
            "worldMap"
        );


    if (!container) return;


    if (map) {

        map.invalidateSize();

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
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 18,

            attribution:
                "© OpenStreetMap"
        }
    ).addTo(map);


    const continents = [

        {
            name:
                "Asia",

            lat:
                34,

            lng:
                100
        },

        {
            name:
                "Africa",

            lat:
                0,

            lng:
                20
        },

        {
            name:
                "Europe",

            lat:
                50,

            lng:
                10
        },

        {
            name:
                "North America",

            lat:
                40,

            lng:
                -100
        },

        {
            name:
                "South America",

            lat:
                -15,

            lng:
                -60
        },

        {
            name:
                "Australia/Oceania",

            lat:
                -25,

            lng:
                135
        },

        {
            name:
                "Antarctica",

            lat:
                -80,

            lng:
                0
        }

    ];


    continents.forEach(
        continent => {

            L.marker(
                [
                    continent.lat,
                    continent.lng
                ]
            )
                .addTo(map)
                .bindPopup(`

                    <h3>
                        ${continent.name}
                    </h3>

                    <button
                        onclick="showContinent(
                            '${continent.name}'
                        )"
                    >
                        Explore
                    </button>

                `);

        }
    );

}


window.initializeMap =
initializeMap;



function showContinent(
    name
) {

    const info =
        document.getElementById(
            "countryInfo"
        );


    if (!info) return;


    const continentInfo = {

        "Asia":
            "Largest continent. Home to diverse cultures, mountains and ancient civilizations.",

        "Africa":
            "Known for wildlife, deserts and rich history.",

        "Europe":
            "Known for art, science and historical landmarks.",

        "North America":
            "Contains many climates, cultures and ecosystems.",

        "South America":
            "Home to the Amazon rainforest and Andes mountains.",

        "Australia/Oceania":
            "Famous for unique animals and island nations.",

        "Antarctica":
            "The coldest continent covered mostly by ice."

    };


    info.innerHTML = `

        <h2>
            🌍 ${escapeHTML(name)}
        </h2>

        <p>
            ${escapeHTML(
                continentInfo[name] ||
                "Explore this continent to learn more."
            )}
        </p>

    `;

}


window.showContinent =
showContinent;



/* =====================================================
   UTILITY HELPERS
===================================================== */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value ?? ""
        );


    return div.innerHTML;

}


window.escapeHTML =
escapeHTML;



function stripHTML(
    html
) {

    const div =
        document.createElement(
            "div"
        );


    div.innerHTML =
        html || "";


    return div.textContent ||
        div.innerText ||
        "";

}


window.stripHTML =
stripHTML;



function showToast(
    message
) {

    let toast =
        document.getElementById(
            "teachlyToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "teachlyToast";


        toast.style.position =
            "fixed";

        toast.style.bottom =
            "24px";

        toast.style.left =
            "50%";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.zIndex =
            "99999";

        toast.style.padding =
            "12px 18px";

        toast.style.borderRadius =
            "12px";

        toast.style.background =
            "rgba(0,0,0,.85)";

        toast.style.color =
            "#fff";

        toast.style.fontSize =
            "14px";

        toast.style.maxWidth =
            "90%";

        toast.style.textAlign =
            "center";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.display =
        "block";


    clearTimeout(
        window.teachlyToastTimer
    );


    window.teachlyToastTimer =
        setTimeout(
            () => {

                toast.style.display =
                    "none";

            },
            2500
        );

}


window.showToast =
showToast;



/* =====================================================
   REFRESH ALL DATA
===================================================== */

function refreshData() {

    if (!currentUser) return;


    prepareUser();

    saveUser();


    updateHome();

    updateProfile();

    renderLessons();

    renderSavedLessons();

    renderBadges();

    renderShop();

}


window.refreshData =
refreshData;



/* =====================================================
   ROLE MATCHING START
===================================================== */

function startMatching(
    role
) {

    currentRole =
        role;


    if (currentUser) {

        currentUser.role =
            role;

        saveUser();

    }


    openPage(
        "searchPage"
    );


    const title =
        document.getElementById(
            "searchTitle"
        );


    const text =
        document.getElementById(
            "searchText"
        );


    if (role === "learner") {

        if (title) {

            title.textContent =
                "Finding a teacher...";

        }


        if (text) {

            text.textContent =
                "Looking for a real registered teacher volunteer.";

        }

    }
    else {

        if (title) {

            title.textContent =
                "Finding a learner...";

        }


        if (text) {

            text.textContent =
                "Looking for a real registered learner volunteer.";

        }

    }


    setTimeout(
        () => {

            loadPeople();

            openPage(
                "peoplePage"
            );

        },
        1200
    );

}


window.startMatching =
startMatching;
/* =====================================================
   TEACHLY — PART 3/3
   STARTUP • THEME • KEYBOARD • SESSION • EXPORTS
===================================================== */


/* =====================================================
   THEME SYSTEM
===================================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "teachlyTheme"
        );


    const theme =
        savedTheme ||
        currentUser?.theme ||
        "light";


    document.documentElement.setAttribute(
        "data-theme",
        theme
    );


    document.body.classList.toggle(
        "darkMode",
        theme === "dark"
    );

}


window.loadTheme =
loadTheme;



function toggleTheme() {

    const current =
        document.documentElement.getAttribute(
            "data-theme"
        ) || "light";


    const next =
        current === "dark"
            ? "light"
            : "dark";


    document.documentElement.setAttribute(
        "data-theme",
        next
    );


    document.body.classList.toggle(
        "darkMode",
        next === "dark"
    );


    localStorage.setItem(
        "teachlyTheme",
        next
    );


    if (currentUser) {

        currentUser.theme =
            next;

        saveUser();

    }


    showToast(
        next === "dark"
            ? "Dark mode enabled 🌙"
            : "Light mode enabled ☀️"
    );

}


window.toggleTheme =
toggleTheme;



/* =====================================================
   USER PREPARATION
===================================================== */

function prepareUser() {

    if (!currentUser) return;


    if (
        !Array.isArray(
            currentUser.completedLessons
        )
    ) {

        currentUser.completedLessons =
            [];

    }


    if (
        !Array.isArray(
            currentUser.savedLessons
        )
    ) {

        currentUser.savedLessons =
            [];

    }


    if (
        !Array.isArray(
            currentUser.quizCompleted
        )
    ) {

        currentUser.quizCompleted =
            [];

    }


    if (
        !Array.isArray(
            currentUser.purchasedItems
        )
    ) {

        currentUser.purchasedItems =
            [];

    }


    if (
        typeof currentUser.coins !==
        "number"
    ) {

        currentUser.coins =
            Number(
                currentUser.coins || 0
            );

    }


    if (
        typeof currentUser.sessions !==
        "number"
    ) {

        currentUser.sessions =
            Number(
                currentUser.sessions || 0
            );

    }


    if (
        !currentUser.role
    ) {

        currentUser.role =
            "learner";

    }


    if (
        !currentUser.theme
    ) {

        currentUser.theme =
            "light";

    }


    saveUser();

}


window.prepareUser =
prepareUser;



/* =====================================================
   SAVE / LOAD USER
===================================================== */

function saveUser() {

    if (!currentUser) return;


    try {

        localStorage.setItem(
            "teachlyUser",
            JSON.stringify(
                currentUser
            )
        );

    }
    catch (error) {

        console.error(
            "Unable to save user:",
            error
        );

    }

}


window.saveUser =
saveUser;



function loadUser() {

    try {

        const saved =
            localStorage.getItem(
                "teachlyUser"
            );


        if (!saved) {

            currentUser =
                null;

            return;

        }


        currentUser =
            JSON.parse(
                saved
            );


        if (
            !currentUser ||
            typeof currentUser !==
                "object"
        ) {

            currentUser =
                null;

            localStorage.removeItem(
                "teachlyUser"
            );

        }

    }
    catch (error) {

        console.error(
            "User loading error:",
            error
        );


        currentUser =
            null;


        localStorage.removeItem(
            "teachlyUser"
        );

    }

}


window.loadUser =
loadUser;



/* =====================================================
   PAGE NAVIGATION
===================================================== */

function openPage(
    pageId
) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    pages.forEach(
        page => {

            page.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            pageId
        );


    if (!target) {

        console.warn(
            "Page not found:",
            pageId
        );

        return;

    }


    target.classList.add(
        "active"
    );


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );


    if (
        pageId ===
        "homePage"
    ) {

        updateHome();

    }


    if (
        pageId ===
        "lessonsPage"
    ) {

        renderLessons(
            currentCategory
        );

    }


    if (
        pageId ===
        "savedPage"
    ) {

        renderSavedLessons();

    }


    if (
        pageId ===
        "badgesPage"
    ) {

        renderBadges();

    }


    if (
        pageId ===
        "shopPage"
    ) {

        renderShop();

    }


    if (
        pageId ===
        "profilePage"
    ) {

        updateProfile();

    }


    if (
        pageId ===
        "peoplePage"
    ) {

        loadPeople();

    }


    if (
        pageId ===
        "mapPage"
    ) {

        setTimeout(
            initializeMap,
            100
        );

    }

}


window.openPage =
openPage;



function goHome() {

    if (!currentUser) {

        openPage(
            "introPage"
        );

        return;

    }


    prepareUser();

    updateHome();

    openPage(
        "homePage"
    );

}


window.goHome =
goHome;



/* =====================================================
   HOME UPDATE
===================================================== */

function updateHome() {

    if (!currentUser) return;


    prepareUser();


    const username =
        document.getElementById(
            "homeUsername"
        );


    const welcome =
        document.getElementById(
            "welcomeText"
        );


    const coins =
        document.getElementById(
            "coinCount"
        );


    const lessons =
        document.getElementById(
            "completedCount"
        );


    const sessions =
        document.getElementById(
            "sessionCount"
        );


    if (username) {

        username.textContent =
            currentUser.username;

    }


    if (welcome) {

        welcome.textContent =
            `Welcome, ${currentUser.username}!`;

    }


    if (coins) {

        coins.textContent =
            `💰 ${currentUser.coins}`;

    }


    if (lessons) {

        lessons.textContent =
            currentUser.completedLessons.length;

    }


    if (sessions) {

        sessions.textContent =
            currentUser.sessions;

    }


    const role =
        document.getElementById(
            "userRole"
        );


    if (role) {

        role.textContent =
            currentUser.role ===
                "teacher"
                ? "🧑‍🏫 Teacher"
                : "🎓 Learner";

    }


    renderBadges();

}


window.updateHome =
updateHome;



/* =====================================================
   LOGIN / LOGOUT HELPERS
===================================================== */

function logoutUser() {

    currentUser =
        null;


    currentUserId =
        null;


    currentRole =
        "";


    currentLesson =
        null;


    currentQuiz =
        null;


    currentChatUser =
        null;


    if (socket) {

        try {

            socket.disconnect();

        }
        catch {

            // Ignore socket cleanup errors.

        }


        socket =
            null;

    }


    localStorage.removeItem(
        "teachlyUser"
    );


    openPage(
        "introPage"
    );


    showToast(
        "Logged out successfully."
    );

}


window.logoutUser =
logoutUser;



function logout() {

    logoutUser();

}


window.logout =
logout;



/* =====================================================
   LOGIN PAGE NAVIGATION
===================================================== */

function openLogin() {

    openPage(
        "loginPage"
    );

}


window.openLogin =
openLogin;



function openRegister() {

    openPage(
        "registerPage"
    );

}


window.openRegister =
openRegister;



function openPeople() {

    if (!currentUser) {

        showToast(
            "Please login first."
        );

        openPage(
            "loginPage"
        );

        return;

    }


    openPage(
        "peoplePage"
    );


    loadPeople();

}


window.openPeople =
openPeople;



/* =====================================================
   ROLE SELECTION
===================================================== */

async function chooseRole(
    role
) {

    if (
        role !==
            "teacher" &&
        role !==
            "learner"
    ) {

        role =
            "learner";

    }


    currentRole =
        role;


    if (currentUser) {

        currentUser.role =
            role;

        saveUser();

    }


    openPage(
        "searchPage"
    );


    const title =
        document.getElementById(
            "searchTitle"
        );


    const text =
        document.getElementById(
            "searchText"
        );


    if (role === "learner") {

        if (title) {

            title.textContent =
                "Finding a teacher...";

        }


        if (text) {

            text.textContent =
                "Looking for a real registered teacher volunteer.";

        }

    }
    else {

        if (title) {

            title.textContent =
                "Finding a learner...";

        }


        if (text) {

            text.textContent =
                "Looking for a real registered learner volunteer.";

        }

    }


    setTimeout(
        async () => {

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/people`
                    );


                const data =
                    await readAIResponse(
                        response
                    );


                const users =
                    Array.isArray(
                        data.people
                    )
                        ? data.people
                        : [];


                const currentUsername =
                    String(
                        currentUser?.username ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                const requiredRole =
                    role === "learner"
                        ? "teacher"
                        : "learner";


                const matches =
                    users.filter(
                        user => {

                            const username =
                                String(
                                    user.username ||
                                    ""
                                )
                                    .trim()
                                    .toLowerCase();


                            return (
                                username &&
                                username !==
                                    currentUsername &&
                                user.role ===
                                    requiredRole
                            );

                        }
                    );


                if (!matches.length) {

                    showToast(
                        `No registered ${requiredRole} volunteer is available.`
                    );


                    if (
                        role ===
                        "learner"
                    ) {

                        setTimeout(
                            () => {

                                const useAI =
                                    confirm(
                                        "No registered teacher volunteer is available.\n\nWould you like AI Teacher to teach you instead?"
                                    );


                                if (useAI) {

                                    openAITeacher();

                                }
                                else {

                                    goHome();

                                }

                            },
                            500
                        );

                    }
                    else {

                        setTimeout(
                            goHome,
                            1200
                        );

                    }


                    return;

                }


                const person =
                    matches[0];


                connectToPerson(
                    person
                );

            }
            catch (error) {

                console.error(
                    "ROLE MATCHING ERROR:",
                    error
                );


                showToast(
                    "Could not check registered users right now."
                );


                setTimeout(
                    goHome,
                    1500
                );

            }

        },
        1200
    );

}


window.chooseRole =
chooseRole;



/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            const active =
                document.querySelector(
                    ".page.active"
                );


            if (
                active &&
                active.id !==
                    "homePage" &&
                active.id !==
                    "introPage"
            ) {

                if (currentUser) {

                    goHome();

                }

            }

        }


        if (
            event.key ===
                "Enter" &&
            document.activeElement
                ?.id ===
                "aiQuestion"
        ) {

            event.preventDefault();

            teacherAIHelp();

        }


        if (
            event.key ===
                "Enter" &&
            document.activeElement
                ?.id ===
                "messageInput"
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);



/* =====================================================
   CHAT CLEANUP
===================================================== */

function closeChat() {

    if (socket) {

        try {

            socket.disconnect();

        }
        catch {

            // Ignore cleanup errors.

        }


        socket =
            null;

    }


    currentChatUser =
        null;


    goHome();

}


window.closeChat =
closeChat;



/* =====================================================
   SAFE SESSION RECOVERY
===================================================== */

function clearBrokenSession() {

    try {

        const saved =
            localStorage.getItem(
                "teachlyUser"
            );


        if (!saved) return;


        const data =
            JSON.parse(
                saved
            );


        if (
            !data ||
            typeof data !==
                "object"
        ) {

            localStorage.removeItem(
                "teachlyUser"
            );

            currentUser =
                null;

        }

    }
    catch {

        localStorage.removeItem(
            "teachlyUser"
        );


        currentUser =
            null;

    }

}


clearBrokenSession();



/* =====================================================
   START APPLICATION
===================================================== */

function startApplication() {

    try {

        loadTheme();

        loadUser();


        if (currentUser) {

            prepareUser();

            updateHome();

            updateProfile();


            openPage(
                "homePage"
            );

        }
        else {

            openPage(
                "introPage"
            );

        }

    }
    catch (error) {

        console.error(
            "Teachly startup error:",
            error
        );


        currentUser =
            null;


        openPage(
            "introPage"
        );

    }

}


window.startApplication =
startApplication;



/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        clearBrokenSession();

        loadTheme();

        loadUser();


        if (currentUser) {

            prepareUser();

            updateHome();

            updateProfile();

            renderBadges();

            renderShop();


            openPage(
                "homePage"
            );

        }
        else {

            openPage(
                "introPage"
            );

        }

    }
);



/* =====================================================
   CONTINUE BUTTON FIX
===================================================== */

window.continueToName =
function () {

    console.log(
        "Continue clicked"
    );


    const intro =
        document.getElementById(
            "introPage"
        );


    const login =
        document.getElementById(
            "loginPage"
        );


    if (intro) {

        intro.classList.remove(
            "active"
        );

    }


    if (login) {

        login.classList.add(
            "active"
        );

    }

};



/* =====================================================
   GLOBAL SAFE FUNCTIONS
===================================================== */

window.openLessons =
function () {

    openPage(
        "lessonsPage"
    );

    renderLessons(
        currentCategory
    );

};



window.openSavedLessons =
function () {

    openPage(
        "savedPage"
    );

    renderSavedLessons();

};



window.openBadges =
function () {

    openPage(
        "badgesPage"
    );

    renderBadges();

};



window.openShop =
function () {

    openPage(
        "shopPage"
    );

    renderShop();

};



window.openProfile =
function () {

    openPage(
        "profilePage"
    );

    updateProfile();

};



window.openMap =
function () {

    openPage(
        "mapPage"
    );

    setTimeout(
        initializeMap,
        100
    );

};



window.openChat =
function (person) {

    if (person) {

        currentChatUser =
            person;

    }


    openPage(
        "chatPage"
    );


    if (
        currentChatUser &&
        currentChatUser.username
    ) {

        const title =
            document.getElementById(
                "chatTitle"
            );


        if (title) {

            title.textContent =
                currentChatUser.username;

        }

    }


    connectSocket();

};



/* =====================================================
   AI TEACHER FALLBACK
===================================================== */

window.prepareAITeacherForLesson =
prepareAITeacherForLesson;


window.startQuiz =
startQuiz;


window.finishQuiz =
finishQuiz;


/* =====================================================
   FINAL INITIALIZATION
===================================================== */

console.log(
    "Teachly Final JS Loaded 🚀"
);
