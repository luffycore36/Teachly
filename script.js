// ===============================
// TEACHLY FINAL SCRIPT.JS PART 1/2
// CLEAN VERSION
// ===============================

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
<p>x + 5 = 10 → x = 5</p>
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
<p>The Solar System has the Sun and eight planets.</p>
`,
quiz:{
question:"How many planets are there?",
options:["7","8","9","10"],
answer:"8"
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

openPage("introPage");

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
});


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


window.openPage=openPage;



// ===============================
// CONTINUE BUTTON FIX
// ===============================

function continueToName(){

const intro =
document.getElementById("introPage");


const login =
document.getElementById("loginPage");


if(intro)
intro.classList.remove("active");


if(login)
login.classList.add("active");


window.scrollTo(0,0);

}


window.continueToName =
continueToName;



// ===============================
// USER STORAGE
// ===============================

function prepareUser(){

if(!currentUser)
return;


currentUser.coins =
Number(currentUser.coins ?? 100);


currentUser.completedLessons =
currentUser.completedLessons || [];


currentUser.savedLessons =
currentUser.savedLessons || [];


currentUser.quizCompleted =
currentUser.quizCompleted || [];


currentUser.purchasedItems =
currentUser.purchasedItems || [];


currentUser.sessions =
currentUser.sessions || 0;

}



function saveUser(){

if(!currentUser)
return;


localStorage.setItem(
"teachlyUser",
JSON.stringify(currentUser)
);

}



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

catch{

localStorage.removeItem(
"teachlyUser"
);

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

message.textContent =
"Enter email and password";

return;

}


try{


const response =
await fetch(
`${API_URL}/api/login`,
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
throw new Error(data.error);


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

message.textContent =
error.message;

}


}


window.loginUser=loginUser;



// ===============================
// REGISTER
// ===============================


async function registerUserAccount(){

const username =
document.getElementById(
"registerUsername"
).value.trim();


const email =
document.getElementById(
"registerEmail"
).value.trim();


const password =
document.getElementById(
"registerPassword"
).value.trim();


const role =
document.getElementById(
"registerRole"
).value;


const message =
document.getElementById(
"registerMessage"
);


try{


const response =
await fetch(
`${API_URL}/api/register`,
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
throw new Error(data.error);


document.getElementById(
"verifyEmail"
).value=email;


openPage(
"verifyPage"
);


}

catch(error){

message.textContent =
error.message;

}


}


window.registerUserAccount=
registerUserAccount;


// ===============================
// VERIFY
// ===============================


async function verifyEmail(){

const email =
document.getElementById(
"verifyEmail"
).value.trim();


const code =
document.getElementById(
"verifyCode"
).value.trim();


const message =
document.getElementById(
"verifyMessage"
);


try{


const response =
await fetch(
`${API_URL}/api/verify`,
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
throw new Error(data.error);


message.textContent =
"Email verified. Login now.";


openPage(
"loginPage"
);


}

catch(error){

message.textContent =
error.message;

}

}


window.verifyEmail=
verifyEmail;



// ===============================
// LOGOUT
// ===============================


function logout(){

if(socket){

socket.disconnect();

socket=null;

}


currentUser=null;


localStorage.removeItem(
"teachlyUser"
);


openPage(
"introPage"
);

}


window.logout=logout;



// ===============================
// HOME
// ===============================

function updateHome(){

if(!currentUser)
return;


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
currentUser.sessions;


}


window.updateHome =
updateHome;








// ===============================
// TEACHLY FINAL SCRIPT.JS PART 2/2
// ===============================


// ===============================
// ROLE SYSTEM
// ===============================

function chooseRole(role){

currentRole = role;


if(currentUser){

currentUser.role = role;

saveUser();

}


if(role==="learner"){

openPage("searchPage");


setTimeout(
()=>openPage("peoplePage"),
1200
);


}
else{

openPage("aiPage");

}

}


window.chooseRole = chooseRole;



// ===============================
// THEME
// ===============================

function toggleTheme(){

document.body.classList.toggle(
"darkMode"
);


localStorage.setItem(
"teachlyTheme",
document.body.classList.contains(
"darkMode"
)
);

}


window.toggleTheme =
toggleTheme;



function loadTheme(){

if(
localStorage.getItem(
"teachlyTheme"
)==="true"
){

document.body.classList.add(
"darkMode"
);

}

}


window.loadTheme =
loadTheme;



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


const data =
category==="All"
?
lessons
:
lessons.filter(
x=>x.category===category
);


grid.innerHTML="";


data.forEach(
lesson=>{


grid.innerHTML += `

<div class="lessonCard">

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

</div>

`;


});


}


window.renderLessons =
renderLessons;



function filterLessons(category){

currentCategory =
category;

renderLessons(category);

}


window.filterLessons =
filterLessons;



function openLesson(id){

currentLesson =
lessons.find(
x=>x.id===id
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



function completeLesson(){

if(!currentUser || !currentLesson)
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


}

}


window.completeLesson =
completeLesson;



function toggleSavedLesson(){

if(!currentUser || !currentLesson)
return;


const list =
currentUser.savedLessons;


const index =
list.indexOf(
currentLesson.id
);


if(index>=0)
list.splice(index,1);

else
list.push(currentLesson.id);



saveUser();


updateSaveButton();

}


window.toggleSavedLesson =
toggleSavedLesson;



function updateSaveButton(){

const button =
document.getElementById(
"saveLessonButton"
);


if(!button)
return;


button.textContent =
currentUser?.savedLessons.includes(
currentLesson?.id
)
?
"★ Saved"
:
"☆ Save Lesson";


}



function renderSavedLessons(){

const box =
document.getElementById(
"savedLessonList"
);


if(!box)
return;


box.innerHTML="";


(currentUser?.savedLessons||[])
.forEach(id=>{


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


document.getElementById(
"quizQuestion"
).textContent =
currentQuiz.question;


const box =
document.getElementById(
"quizOptions"
);


box.innerHTML="";


currentQuiz.options.forEach(
option=>{


const btn =
document.createElement(
"button"
);


btn.textContent =
option;


btn.onclick =
()=>answerQuiz(option);


box.appendChild(btn);


});


openPage(
"quizPage"
);

}


window.startQuiz =
startQuiz;



function answerQuiz(answer){

const result =
document.getElementById(
"quizResult"
);


if(answer===currentQuiz.answer){

result.textContent =
"🎉 Correct!";


if(currentUser){

if(
!currentUser.quizCompleted.includes(
currentLesson.id
)
){

currentUser.quizCompleted.push(
currentLesson.id
);


currentUser.coins+=10;


saveUser();


updateHome();

}

}


}
else{

result.textContent =
"❌ Wrong answer";

}


}


window.answerQuiz =
answerQuiz;



// ===============================
// AI TEACHER
// ===============================


async function askAI(message){

try{


const res =
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
await res.json();


return data.answer ||
"No answer";


}
catch{

return "AI unavailable.";

}

}


window.askAI =
askAI;



async function teacherAIHelp(){

const input =
document.getElementById(
"aiQuestion"
);


const chat =
document.getElementById(
"aiChat"
);


const text =
input.value.trim();


if(!text)
return;


chat.innerHTML += `

<div class="aiMessage user">
${text}
</div>

`;


input.value="";


const answer =
await askAI(text);



chat.innerHTML += `

<div class="aiMessage assistant">
${answer}
</div>

`;

}


window.teacherAIHelp =
teacherAIHelp;



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


const count =
currentUser?.completedLessons.length||0;


box.innerHTML="";


const badges=[

["🌱","First Lesson",count>=1],

["📚","Book Collector",count>=5],

["🧠","Master",count>=10],

["👑","Legend",count>=25]

];


badges.forEach(
b=>{


box.innerHTML += `

<div class="badge ${b[2]?"":"locked"}">

<h2>
${b[0]}
</h2>

<h3>
${b[1]}
</h3>

<p>
${b[2]?"Unlocked":"Locked"}
</p>

</div>

`;

});


}


window.renderBadges =
renderBadges;



console.log(
"Teachly Part 2 loaded 🚀"
);
