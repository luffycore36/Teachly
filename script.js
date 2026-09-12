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

}else{

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
// REGISTRATION
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
// EMAIL VERIFICATION
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
// HOME DASHBOARD
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
// ROLE SELECTION
// ===============================

async function chooseRole(role){

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

if(role==="learner"){

if(title)
title.textContent =
"Finding a teacher...";

if(text)
text.textContent =
"Looking for a real registered teacher volunteer";

}
else{

if(title)
title.textContent =
"Finding a learner...";

if(text)
text.textContent =
"Looking for a real registered learner volunteer";

}

setTimeout(
async ()=>{

try{

const response =
await fetch(
`${API_URL}/api/people`
);

const contentType =
response.headers.get("content-type") || "";

let data;

if(contentType.includes("application/json")){

data = await response.json();

}
else{

const html =
await response.text();

throw new Error(
`Server returned HTML instead of JSON. ${html.slice(0,200)}`
);

}

if(!response.ok){

throw new Error(
data.error ||
"Unable to find users."
);

}

const users =
Array.isArray(data.people)
?
data.people
:
[];

const currentUsername =
String(
currentUser?.username || ""
)
.trim()
.toLowerCase();

const matches =
users.filter(
user=>
user.username &&
String(user.username)
.trim()
.toLowerCase()
!== currentUsername &&
user.role ===
(
role==="learner"
?
"teacher"
:
"learner"
)
);

if(!matches.length){

if(role==="learner"){

showToast(
"No registered teacher volunteer is available."
);

setTimeout(
()=>{

const useAI =
confirm(
"No registered teacher volunteer is available.\n\nDo you want AI to teach you?"
);

if(useAI){

openAITeacher();

}
else{

goHome();

}

},
500
);

}
else{

showToast(
"No registered learner volunteer is available."
);

setTimeout(
goHome,
1200
);

}

return;

}

const person =
matches[0];

currentChatUser =
person;

if(currentUser){

currentUser.sessions =
Number(currentUser.sessions || 0) + 1;

saveUser();
updateHome();

}

openChat(
`${person.username} • ${person.role || "Teachly user"}`
);

}

catch(error){

console.error(
"MATCHING ERROR:",
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

// ===============================
// LESSON LIBRARY
// ===============================

function renderLessons(category="All"){

const grid =
document.getElementById(
"lessonGrid"
);

if(!grid)
return;

currentCategory = category;

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

const completed =
currentUser &&
currentUser.completedLessons.includes(
lesson.id
);

const saved =
currentUser &&
currentUser.savedLessons.includes(
lesson.id
);

const card =
document.createElement("div");

card.className =
"lesson-card";

card.innerHTML = `
<div class="lesson-icon">${lesson.icon}</div>

<h3>${escapeHTML(lesson.title)}</h3>

<p>${escapeHTML(lesson.description)}</p>

<div class="lesson-category">
${escapeHTML(lesson.category)}
</div>

<div class="lesson-actions">

<button
onclick="openLesson(${lesson.id})"
>
${completed ? "Review Lesson" : "Start Lesson"}
</button>

<button
class="save-lesson-button"
onclick="toggleSavedLesson(${lesson.id})"
title="Save lesson"
>
${saved ? "🔖" : "🔖"}
</button>

</div>
`;

grid.appendChild(card);

});

}

window.renderLessons =
renderLessons;


// ===============================
// LESSON FILTERS
// ===============================

function filterLessons(category){

currentCategory =
category;

document
.querySelectorAll(
"[data-category]"
)
.forEach(button=>{

button.classList.remove(
"active"
);

if(
button.dataset.category ===
category
){

button.classList.add(
"active"
);

}

});

renderLessons(category);

}

window.filterLessons =
filterLessons;


// ===============================
// OPEN LESSON
// ===============================

function openLesson(id){

const lesson =
lessons.find(
item =>
item.id === Number(id)
);

if(!lesson)
return;

currentLesson =
lesson;

const title =
document.getElementById(
"lessonTitle"
);

const content =
document.getElementById(
"lessonContent"
);

const category =
document.getElementById(
"lessonCategory"
);

if(title)
title.textContent =
lesson.icon + " " + lesson.title;

if(category)
category.textContent =
lesson.category;

if(content)
content.innerHTML =
lesson.content;

updateLessonButtons();

openPage(
"lessonPage"
);

}

window.openLesson =
openLesson;


// ===============================
// LESSON ACTIONS
// ===============================

function updateLessonButtons(){

if(!currentLesson)
return;

const completeButton =
document.getElementById(
"completeLessonButton"
);

const saveButton =
document.getElementById(
"saveLessonButton"
);

const completed =
currentUser &&
currentUser.completedLessons.includes(
currentLesson.id
);

const saved =
currentUser &&
currentUser.savedLessons.includes(
currentLesson.id
);

if(completeButton){

completeButton.textContent =
completed
?
"Lesson Completed ✓"
:
"Complete Lesson";

}

if(saveButton){

saveButton.textContent =
saved
?
"🔖 Saved"
:
"🔖 Save Lesson";

}

}


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

currentUser.coins += 25;

saveUser();
updateHome();

showToast(
"Lesson completed! +25 💰"
);

}
else{

showToast(
"This lesson is already completed."
);

}

updateLessonButtons();

}

window.completeLesson =
completeLesson;


// ===============================
// SAVE LESSON
// ===============================

function toggleSavedLesson(id){

if(!currentUser)
return;

prepareUser();

const lessonId =
Number(id);

const index =
currentUser.savedLessons.indexOf(
lessonId
);

if(index === -1){

currentUser.savedLessons.push(
lessonId
);

showToast(
"Lesson saved 🔖"
);

}
else{

currentUser.savedLessons.splice(
index,
1
);

showToast(
"Lesson removed from saved lessons."
);

}

saveUser();

updateLessonButtons();

if(
document.getElementById(
"lessonGrid"
)
){

renderLessons(
currentCategory
);

}

}

window.toggleSavedLesson =
toggleSavedLesson;


// ===============================
// SAVED LESSONS
// ===============================

function renderSavedLessons(){

const grid =
document.getElementById(
"savedLessonGrid"
);

if(!grid)
return;

if(
!currentUser ||
!currentUser.savedLessons.length
){

grid.innerHTML = `
<div class="empty-state">
<h3>No saved lessons yet</h3>
<p>Save lessons you want to return to later.</p>
</div>
`;

return;

}

const saved =
lessons.filter(
lesson =>
currentUser.savedLessons.includes(
lesson.id
)
);

grid.innerHTML = "";

saved.forEach(
lesson=>{

const card =
document.createElement("div");

card.className =
"lesson-card";

card.innerHTML = `
<div class="lesson-icon">
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
Open Lesson
</button>

<button
onclick="toggleSavedLesson(${lesson.id})"
>
Remove 🔖
</button>
`;

grid.appendChild(card);

});

}

window.renderSavedLessons =
renderSavedLessons;


// ===============================
// QUIZ SYSTEM
// ===============================

function startQuiz(){

if(!currentLesson){

showToast(
"Choose a lesson first!"
);

openPage(
"aiPage"
);

return;

}

startQuizForLesson(
currentLesson
);

}

window.startQuiz =
startQuiz;


function startQuizForLesson(lesson){

if(!lesson ||
!lesson.quiz){

showToast(
"This lesson does not have a quiz yet."
);

return;

}

currentLesson =
lesson;

currentQuiz = {
lessonId: lesson.id,
question: lesson.quiz.question,
options: lesson.quiz.options,
answer: lesson.quiz.answer
};

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

if(question)
question.textContent =
currentQuiz.question;

if(result)
result.textContent = "";

if(options){

options.innerHTML = "";

currentQuiz.options.forEach(
option=>{

const button =
document.createElement(
"button"
);

button.className =
"quiz-option";

button.textContent =
option;

button.onclick =
()=>answerQuiz(option);

options.appendChild(
button
);

});

}

openPage(
"quizPage"
);

}

window.startQuizForLesson =
startQuizForLesson;


// ===============================
// QUIZ ANSWERS
// ===============================

function answerQuiz(answer){

if(!currentQuiz)
return;

const buttons =
document.querySelectorAll(
".quiz-option"
);

buttons.forEach(
button=>{
button.disabled = true;

if(
button.textContent ===
currentQuiz.answer
){

button.classList.add(
"correct"
);

}

if(
button.textContent ===
answer &&
answer !==
currentQuiz.answer
){

button.classList.add(
"wrong"
);

}

});

const result =
document.getElementById(
"quizResult"
);

if(
answer ===
currentQuiz.answer
){

if(result)
result.textContent =
"Correct! 🎉";

if(
currentUser &&
!currentUser.quizCompleted.includes(
currentQuiz.lessonId
)
){

currentUser.quizCompleted.push(
currentQuiz.lessonId
);

currentUser.coins += 15;

saveUser();
updateHome();

showToast(
"Correct answer! +15 💰"
);

}

}
else{

if(result)
result.textContent =
"Not quite. Keep learning!";

}

}

window.answerQuiz =
answerQuiz;


// ===============================
// QUIZ COMPLETION
// ===============================

function finishQuiz(){

if(!currentQuiz){

goHome();

return;

}

openPage(
"lessonPage"
);

}

window.finishQuiz =
finishQuiz;


// ===============================
// AI RESPONSE HANDLER
// ===============================

async function readAIResponse(response){

const contentType =
response.headers.get(
"content-type"
) || "";

if(!response.ok){

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


// ===============================
// AI TEACHER REQUEST
// ===============================

async function askAI(message){

if(!message ||
!String(message).trim()){

return;

}

const cleanMessage =
String(message).trim();

renderAIMessage(
"student",
cleanMessage
);

const input =
document.getElementById(
"aiInput"
);

if(input)
input.value = "";

const loadingId =
"ai-loading-" +
Date.now();

renderAIMessage(
"teacher",
"Thinking... 🤔",
loadingId
);

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

message:
cleanMessage,

username:
currentUser?.username ||
"Student",

lesson:
currentLesson
?
currentLesson.title
:
"General Learning"

})

});

const data =
await readAIResponse(
response
);

const answer =
data.answer ||
data.response ||
data.message ||
data.output ||
"Sorry, I couldn't generate an answer.";

removeAIMessage(
loadingId
);

renderAIMessage(
"teacher",
answer
);

}
catch(error){

console.error(
"AI ERROR:",
error
);

removeAIMessage(
loadingId
);

renderAIMessage(
"teacher",
"Sorry, I couldn't reach the AI right now. Please try again."
);

}

}

window.askAI =
askAI;


// ===============================
// AI CHAT MESSAGE RENDERING
// ===============================

function renderAIMessage(
sender,
message,
id=null
){

const container =
document.getElementById(
"aiMessages"
);

if(!container)
return;

const messageElement =
document.createElement(
"div"
);

messageElement.className =
sender === "teacher"
?
"ai-message teacher-message"
:
"ai-message student-message";

if(id)
messageElement.id =
id;

messageElement.innerHTML = `
<div class="ai-message-content">
${formatAIText(message)}
</div>
`;

container.appendChild(
messageElement
);

container.scrollTop =
container.scrollHeight;

}


// ===============================
// REMOVE AI MESSAGE
// ===============================

function removeAIMessage(id){

const element =
document.getElementById(id);

if(element)
element.remove();

}


// ===============================
// AI TEXT FORMATTER
// ===============================

function formatAIText(text){

if(text === null ||
text === undefined)
return "";

let value =
String(text);

value =
escapeHTML(value);

value =
value.replace(
/\*\*(.*?)\*\*/g,
"<strong>$1</strong>"
);

value =
value.replace(
/`([^`]+)`/g,
"<code>$1</code>"
);

value =
value.replace(
/\n/g,
"<br>"
);

return value;

}


// ===============================
// PREPARE AI TEACHER
// ===============================

function prepareAITeacherForLesson(){

const container =
document.getElementById(
"aiMessages"
);

if(!container)
return;

container.innerHTML = "";

if(currentLesson){

renderAIMessage(
"teacher",
`Hi! I'm your AI Teacher. Let's learn about ${currentLesson.title}. Ask me anything! 📚`
);

}
else{

renderAIMessage(
"teacher",
"Hi! I'm your AI Teacher. What would you like to learn today? 🧠"
);

}

}

window.prepareAITeacherForLesson =
prepareAITeacherForLesson;


// ===============================
// OPEN AI TEACHER
// ===============================

function openAITeacher(){

openPage(
"aiPage"
);

if(!currentLesson){

currentLesson = null;

}

prepareAITeacherForLesson();

}

window.openAITeacher =
openAITeacher;


// ===============================
// AI HELP
// ===============================

function teacherAIHelp(){

const input =
document.getElementById(
"aiInput"
);

if(!input)
return;

const message =
input.value.trim();

if(!message){

showToast(
"Type a question first."
);

return;

}

askAI(
message
);

}

window.teacherAIHelp =
teacherAIHelp;


// ===============================
// QUICK AI QUESTIONS
// ===============================

function askAIQuick(question){

askAI(
question
);

}

window.askAIQuick =
askAIQuick;


// ===============================
// MYSTERY TOPIC
// ===============================

const mysteryTopics = [

"Why is the sky blue?",
"How do airplanes fly?",
"How does the human brain learn?",
"Why do stars shine?",
"How does electricity work?",
"What causes rain?",
"How do computers understand instructions?",
"Why do we have seasons?",
"How do volcanoes form?",
"How does the internet work?",
"Why does the Moon appear to change shape?",
"How do plants grow?"

];


function mysteryTopic(){

const topic =
mysteryTopics[
Math.floor(
Math.random() *
mysteryTopics.length
)
];

openAITeacher();

setTimeout(
()=>{

askAI(
`Teach me about this mystery topic in a simple and interesting way: ${topic}`
);

},
100
);

}

window.mysteryTopic =
mysteryTopic;


// ===============================
// BADGES
// ===============================

const badges = [

{
id:"firstLesson",
icon:"🌱",
name:"First Lesson",
description:"Complete your first lesson.",
check:user =>
user.completedLessons.length >= 1
},

{
id:"bookCollector",
icon:"📚",
name:"Book Collector",
description:"Complete 3 lessons.",
check:user =>
user.completedLessons.length >= 3
},

{
id:"knowledgeMaster",
icon:"🧠",
name:"Knowledge Master",
description:"Complete every available lesson.",
check:user =>
user.completedLessons.length >= lessons.length
},

{
id:"quizBeginner",
icon:"🏆",
name:"Quiz Beginner",
description:"Complete your first quiz.",
check:user =>
user.quizCompleted.length >= 1
},

{
id:"quizExpert",
icon:"⭐",
name:"Quiz Expert",
description:"Complete 3 quizzes.",
check:user =>
user.quizCompleted.length >= 3
},

{
id:"connector",
icon:"🤝",
name:"Connector",
description:"Complete your first learning session.",
check:user =>
Number(user.sessions || 0) >= 1
},

{
id:"lessonSaver",
icon:"🔖",
name:"Lesson Saver",
description:"Save your first lesson.",
check:user =>
user.savedLessons.length >= 1
},

{
id:"shopExplorer",
icon:"🛍️",
name:"Shop Explorer",
description:"Purchase your first shop item.",
check:user =>
user.purchasedItems.length >= 1
},

{
id:"teachlyLegend",
icon:"👑",
name:"Teachly Legend",
description:"Complete 5 lessons and 3 quizzes.",
check:user =>
user.completedLessons.length >= 5 &&
user.quizCompleted.length >= 3
}

];


// ===============================
// BADGE DISPLAY
// ===============================

function renderBadges(){

const container =
document.getElementById(
"badgesGrid"
);

if(!container)
return;

prepareUser();

container.innerHTML = "";

badges.forEach(
badge=>{

const unlocked =
badge.check(
currentUser
);

const card =
document.createElement(
"div"
);

card.className =
unlocked
?
"badge-card unlocked"
:
"badge-card locked";

card.innerHTML = `
<div class="badge-icon">
${unlocked ? badge.icon : "🔒"}
</div>

<h3>
${escapeHTML(badge.name)}
</h3>

<p>
${escapeHTML(badge.description)}
</p>

<span>
${unlocked ? "Unlocked ✓" : "Locked"}
</span>
`;

container.appendChild(
card
);

});

}

window.renderBadges =
renderBadges;


// ===============================
// SHOP DATA
// ===============================

const shopProducts = [

{
id:"purpleGlow",
name:"Purple Glow",
icon:"🟣",
price:50,
description:"Give your profile a glowing purple effect."
},

{
id:"starEffect",
name:"Star Effect",
icon:"⭐",
price:100,
description:"Add a sparkling star effect."
},

{
id:"rocketEffect",
name:"Rocket Effect",
icon:"🚀",
price:150,
description:"Show your learning speed with a rocket effect."
},

{
id:"fireAura",
name:"Fire Aura",
icon:"🔥",
price:250,
description:"Unlock a fiery profile aura."
},

{
id:"royalCrown",
name:"Royal Crown",
icon:"👑",
price:500,
description:"Show everyone your Teachly royalty."
},

{
id:"diamondAura",
name:"Diamond Aura",
icon:"💎",
price:1000,
description:"Unlock a premium diamond aura."
},

{
id:"galaxyEffect",
name:"Galaxy Effect",
icon:"🌌",
price:2000,
description:"Unlock a galaxy-inspired effect."
},

{
id:"lightningAura",
name:"Lightning Aura",
icon:"⚡",
price:3000,
description:"Unlock an electric lightning aura."
},

{
id:"championEffect",
name:"Champion Effect",
icon:"🏆",
price:5000,
description:"Display the champion profile effect."
},

{
id:"rainbowAura",
name:"Rainbow Aura",
icon:"🌈",
price:7500,
description:"Unlock the rainbow profile effect."
}

];


// ===============================
// SHOP DISPLAY
// ===============================

function renderShop(){

const container =
document.getElementById(
"shopGrid"
);

if(!container)
return;

prepareUser();

container.innerHTML = "";

shopProducts.forEach(
product=>{

const purchased =
currentUser.purchasedItems.includes(
product.id
);

const card =
document.createElement(
"div"
);

card.className =
"shop-card";

card.innerHTML = `
<div class="shop-icon">
${product.icon}
</div>

<h3>
${escapeHTML(product.name)}
</h3>

<p>
${escapeHTML(product.description)}
</p>

<div class="shop-price">
💰 ${product.price}
</div>

<button
onclick="buyShopItem('${product.id}')"
${purchased ? "disabled" : ""}
>
${purchased ? "Purchased ✓" : "Buy"}
</button>
`;

container.appendChild(
card
);

});

}

window.renderShop =
renderShop;


// ===============================
// BUY SHOP ITEM
// ===============================

function buyShopItem(id){

if(!currentUser)
return;

const product =
shopProducts.find(
item =>
item.id === id
);

if(!product)
return;

prepareUser();

if(
currentUser.purchasedItems.includes(
product.id
)
){

showToast(
"Item already purchased."
);

return;

}

if(
currentUser.coins <
product.price
){

showToast(
"Not enough 💰 coins."
);

return;

}

currentUser.coins -=
product.price;

currentUser.purchasedItems.push(
product.id
);

saveUser();
updateHome();
renderShop();

showToast(
`${product.name} purchased! 🎉`
);

}

window.buyShopItem =
buyShopItem;


// ===============================
// PEOPLE / REGISTERED USERS
// ===============================

async function loadPeople(){

const container =
document.getElementById(
"peopleGrid"
);

if(!container)
return;

container.innerHTML = `
<div class="loading-state">
Finding registered Teachly users...
</div>
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

if(!response.ok){

throw new Error(
data.error ||
"Unable to load people."
);

}

const users =
Array.isArray(data.people)
?
data.people
:
[];

const username =
String(
currentUser?.username || ""
)
.trim()
.toLowerCase();

const oppositeRole =
currentRole === "teacher"
?
"learner"
:
"teacher";

const matches =
users.filter(
user =>
user.username &&
String(user.username)
.trim()
.toLowerCase()
!== username &&
user.role === oppositeRole
);

if(!matches.length){

container.innerHTML = `
<div class="empty-state">
<h3>No match available</h3>
<p>
There is currently no registered
${oppositeRole} available.
</p>
</div>
`;

return;

}

container.innerHTML = "";

matches.forEach(
person=>{

const card =
document.createElement(
"div"
);

card.className =
"person-card";

const avatar =
person.profileImage ||
"👤";

card.innerHTML = `
<div class="person-avatar">
${
avatar.startsWith("http")
?
`<img src="${escapeHTML(avatar)}" alt="Avatar">`
:
avatar
}
</div>

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
<div class="empty-state">
<h3>Could not load people</h3>
<p>Please try again later.</p>
</div>
`;

}

}

window.loadPeople =
loadPeople;


// ===============================
// CONNECT TO USER
// ===============================

function connectToPerson(person){

if(!person)
return;

currentChatUser =
person;

if(currentUser){

currentUser.sessions =
Number(
currentUser.sessions || 0
) + 1;

saveUser();
updateHome();

}

openChat(
`${person.username} • ${person.role || "Teachly user"}`
);

}

window.connectToPerson =
connectToPerson;

// ===============================
// SOCKET CHAT
// ===============================

function connectSocket(){

if(socket)
return;

if(
typeof io === "undefined"
){

console.warn(
"Socket.IO client is not loaded."
);

return;

}

socket =
io(API_URL);

socket.on(
"connect",
()=>{

console.log(
"Teachly chat connected."
);

}
);

socket.on(
"connect_error",
error=>{

console.error(
"CHAT CONNECTION ERROR:",
error
);

}
);

socket.on(
"message",
message=>{

addChatMessage(
message,
false
);

}
);

}

window.connectSocket =
connectSocket;


// ===============================
// CHAT DISPLAY
// ===============================

function addChatMessage(
message,
own=false
){

const container =
document.getElementById(
"chatMessages"
);

if(!container)
return;

let text = "";
let username = "";

if(
typeof message === "string"
){

text = message;

}
else{

text =
message?.message ||
message?.text ||
"";

username =
message?.username ||
"";

}

if(!text)
return;

const element =
document.createElement(
"div"
);

element.className =
own
?
"chat-message own"
:
"chat-message";

element.innerHTML = `
<div class="chat-message-user">
${escapeHTML(
username ||
(
own
?
currentUser?.username ||
"You"
:
currentChatUser?.username ||
"User"
)
)}
</div>

<div class="chat-message-text">
${escapeHTML(text)}
</div>
`;

container.appendChild(
element
);

container.scrollTop =
container.scrollHeight;

}

window.addChatMessage =
addChatMessage;


// ===============================
// SEND CHAT MESSAGE
// ===============================

function sendMessage(){

const input =
document.getElementById(
"chatInput"
);

if(!input)
return;

const text =
input.value.trim();

if(!text)
return;

if(
!currentUser ||
!currentChatUser
){

showToast(
"Choose a person to chat with first."
);

return;

}

const message = {

from:
currentUser.username,

to:
currentChatUser.username,

username:
currentUser.username,

message:
text

};

if(
socket &&
socket.connected
){

socket.emit(
"message",
message
);

}
else{

addChatMessage(
message,
true
);

}

input.value = "";

}

window.sendMessage =
sendMessage;


// ===============================
// CHAT EMOJI
// ===============================

function addEmoji(emoji){

const input =
document.getElementById(
"chatInput"
);

if(!input)
return;

input.value += emoji;

input.focus();

}

window.addEmoji =
addEmoji;


// ===============================
// OPEN CHAT
// ===============================

function openChat(person){

currentChatUser = {

username:
String(person || "")
.split(" • ")[0]
.trim(),

role:
String(person || "")
.includes(" • ")
?
String(person)
.split(" • ")[1]
:
"Teachly user"

};

const title =
document.getElementById(
"chatTitle"
);

if(title){

title.textContent =
currentChatUser.username;

}

const messages =
document.getElementById(
"chatMessages"
);

if(messages)
messages.innerHTML = "";

openPage(
"chatPage"
);

connectSocket();

}

window.openChat =
openChat;


// ===============================
// CLOSE CHAT
// ===============================

function closeChat(){

currentChatUser =
null;

openPage(
"homePage"
);

}

window.closeChat =
closeChat;


// ===============================
// LEARNSPHERE MAP
// ===============================

function initializeMap(){

const mapElement =
document.getElementById(
"map"
);

if(!mapElement)
return;

if(
typeof L === "undefined"
){

console.warn(
"Leaflet is not loaded."
);

return;

}

if(map){

map.invalidateSize();

return;

}

map =
L.map(
mapElement
).setView(
[20,0],
2
);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
maxZoom:19,
attribution:"© OpenStreetMap"
}
).addTo(map);

}

window.initializeMap =
initializeMap;


// ===============================
// MAP CONTINENTS
// ===============================

function showContinent(
name,
latitude,
longitude,
zoom=4
){

if(!map)
initializeMap();

if(!map)
return;

map.setView(
[
Number(latitude),
Number(longitude)
],
zoom
);

showToast(
`Exploring ${name} 🌍`
);

}

window.showContinent =
showContinent;


// ===============================
// PROFILE AVATAR
// ===============================

function previewAvatar(event){

const file =
event?.target?.files?.[0];

if(!file)
return;

if(
!file.type.startsWith(
"image/"
)
){

showToast(
"Please choose an image."
);

return;

}

const reader =
new FileReader();

reader.onload =
()=>{

const preview =
document.getElementById(
"avatarPreview"
);

if(preview){

preview.src =
reader.result;

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

async function uploadAvatar(){

if(!currentUser){

showToast(
"Please log in first."
);

return;

}

const input =
document.getElementById(
"avatarInput"
);

const file =
input?.files?.[0];

if(!file){

showToast(
"Choose an image first."
);

return;

}

const formData =
new FormData();

formData.append(
"avatar",
file
);

formData.append(
"username",
currentUser.username
);

try{

const response =
await fetch(
`${API_URL}/api/avatar`,
{

method:"POST",

body:formData

}
);

const data =
await readAIResponse(
response
);

if(!response.ok){

throw new Error(
data.error ||
"Avatar upload failed."
);

}

if(data.profileImage){

currentUser.profileImage =
data.profileImage;

saveUser();

}

updateProfile();

showToast(
"Avatar updated! 🎉"
);

}
catch(error){

console.error(
"AVATAR ERROR:",
error
);

showToast(
error.message ||
"Could not upload avatar."
);

}

}

window.uploadAvatar =
uploadAvatar;


// ===============================
// PROFILE DISPLAY
// ===============================

function updateProfile(){

if(!currentUser)
return;

prepareUser();

const username =
document.getElementById(
"profileUsername"
);

const email =
document.getElementById(
"profileEmail"
);

const role =
document.getElementById(
"profileRole"
);

const coins =
document.getElementById(
"profileCoins"
);

const sessions =
document.getElementById(
"profileSessions"
);

const completed =
document.getElementById(
"profileCompleted"
);

const avatar =
document.getElementById(
"avatarPreview"
);

if(username)
username.textContent =
currentUser.username || "";

if(email)
email.textContent =
currentUser.email || "";

if(role)
role.textContent =
currentUser.role || "learner";

if(coins)
coins.textContent =
currentUser.coins;

if(sessions)
sessions.textContent =
currentUser.sessions || 0;

if(completed)
completed.textContent =
currentUser.completedLessons.length;

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
// REFRESH USER DATA
// ===============================

async function refreshData(){

if(!currentUser)
return;

try{

const response =
await fetch(
`${API_URL}/api/people`
);

if(
response.ok
){

const data =
await response.json();

if(
Array.isArray(data.people)
){

window.people =
data.people;

}

}

}
catch(error){

console.warn(
"Refresh failed:",
error
);

}

updateHome();

}

window.refreshData =
refreshData;


// ===============================
// MATCHING SCREEN
// ===============================

function startMatching(){

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

if(title)
title.textContent =
"Finding a learning partner...";

if(text)
text.textContent =
"Searching registered Teachly users";

setTimeout(
()=>{

if(currentRole === "learner"){

loadPeople();

openPage(
"peoplePage"
);

}
else{

loadPeople();

openPage(
"peoplePage"
);

}

},
1200
);

}

window.startMatching =
startMatching;


// ===============================
// SAFE HTML HELPERS
// ===============================

function escapeHTML(value){

return String(
value ?? ""
)
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

window.escapeHTML =
escapeHTML;


function stripHTML(value){

const temporary =
document.createElement(
"div"
);

temporary.innerHTML =
String(value ?? "");

return temporary.textContent ||
temporary.innerText ||
"";

}

window.stripHTML =
stripHTML;


// ===============================
// TOAST NOTIFICATIONS
// ===============================

function showToast(message){

let toast =
document.getElementById(
"teachlyToast"
);

if(!toast){

toast =
document.createElement(
"div"
);

toast.id =
"teachlyToast";

toast.className =
"teachly-toast";

document.body.appendChild(
toast
);

}

toast.textContent =
message;

toast.classList.add(
"show"
);

clearTimeout(
window.teachlyToastTimer
);

window.teachlyToastTimer =
setTimeout(
()=>{

toast.classList.remove(
"show"
);

},
2500
);

}

window.showToast =
showToast;


// ===============================
// THEME SYSTEM
// ===============================

function loadTheme(){

const savedTheme =
localStorage.getItem(
"teachlyTheme"
);

const theme =
savedTheme ||
currentUser?.theme ||
"light";

document.documentElement
.setAttribute(
"data-theme",
theme
);

if(currentUser){

currentUser.theme =
theme;

}

}

window.loadTheme =
loadTheme;


function toggleTheme(){

const current =
document.documentElement
.getAttribute(
"data-theme"
) ||
"light";

const next =
current === "dark"
?
"light"
:
"dark";

document.documentElement
.setAttribute(
"data-theme",
next
);

localStorage.setItem(
"teachlyTheme",
next
);

if(currentUser){

currentUser.theme =
next;

saveUser();

}

showToast(
next === "dark"
?
"Dark mode enabled 🌙"
:
"Light mode enabled ☀️"
);

}

window.toggleTheme =
toggleTheme;


// ===============================
// NAVIGATION HELPERS
// ===============================

function goHome(){

if(currentUser){

updateHome();

openPage(
"homePage"
);

}
else{

openPage(
"loginPage"
);

}

}

window.goHome =
goHome;


function openLogin(){

openPage(
"loginPage"
);

}

window.openLogin =
openLogin;


function openRegister(){

openPage(
"registerPage"
);

}

window.openRegister =
openRegister;


function openPeople(){

currentRole =
currentUser?.role ||
"learner";

openPage(
"peoplePage"
);

}

window.openPeople =
openPeople;


function openLessons(){

openPage(
"aiPage"
);

}

window.openLessons =
openLessons;


function openSavedLessons(){

openPage(
"savedLessonsPage"
);

}

window.openSavedLessons =
openSavedLessons;


function openBadges(){

openPage(
"badgesPage"
);

}

window.openBadges =
openBadges;


function openShop(){

openPage(
"shopPage"
);

}

window.openShop =
openShop;


function openProfile(){

openPage(
"profilePage"
);

}

window.openProfile =
openProfile;


function openMap(){

openPage(
"mapPage"
);

}

window.openMap =
openMap;


// ===============================
// BROKEN SESSION RECOVERY
// ===============================

function clearBrokenSession(){

try{

localStorage.removeItem(
"teachlyUser"
);

}
catch(error){

console.error(
"SESSION CLEAR ERROR:",
error
);

}

currentUser =
null;

if(socket){

try{
socket.disconnect();
}
catch(error){
console.error(error);
}

socket = null;

}

}

window.clearBrokenSession =
clearBrokenSession;


// ===============================
// APPLICATION START
// ===============================

function startApplication(){

loadTheme();
loadUser();

if(currentUser){

prepareUser();
updateHome();
openPage(
"homePage"
);

}
else{

openPage(
"loginPage"
);

}

}

window.startApplication =
startApplication;


// ===============================
// CONTINUE FROM INTRO
// ===============================

window.continueToName =
function(){

const introPage =
document.getElementById(
"introPage"
);

const loginPage =
document.getElementById(
"loginPage"
);

if(introPage)
introPage.classList.remove(
"active"
);

if(loginPage)
loginPage.classList.add(
"active"
);

};


// ===============================
// KEYBOARD CONTROLS
// ===============================

document.addEventListener(
"keydown",
event=>{

if(
event.key === "Escape"
){

const chatPage =
document.getElementById(
"chatPage"
);

if(
chatPage &&
chatPage.classList.contains(
"active"
)
){

closeChat();

}

}

if(
event.key === "Enter" &&
document.activeElement?.id ===
"chatInput"
){

event.preventDefault();

sendMessage();

}

if(
event.key === "Enter" &&
document.activeElement?.id ===
"aiInput"
){

event.preventDefault();

teacherAIHelp();

}

}
);


// ===============================
// APPLICATION INITIALIZATION
// ===============================

document.addEventListener(
"DOMContentLoaded",
()=>{

try{

startApplication();

}
catch(error){

console.error(
"TEACHLY STARTUP ERROR:",
error
);

clearBrokenSession();

openPage(
"loginPage"
);

}

});


// ===============================
// GLOBAL FUNCTION EXPORTS
// ===============================

window.openChat =
openChat;

window.closeChat =
closeChat;

window.startMatching =
startMatching;

window.openAITeacher =
openAITeacher;

window.mysteryTopic =
mysteryTopic;

window.openLessons =
openLessons;

window.openSavedLessons =
openSavedLessons;

window.openBadges =
openBadges;

window.openShop =
openShop;

window.openProfile =
openProfile;

window.openMap =
openMap;

window.openPeople =
openPeople;

window.goHome =
goHome;


// ===============================
// TEACHLY READY
// ===============================

console.log(
"Teachly Final JS Loaded 🚀"
);
