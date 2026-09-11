// ===============================
// TEACHLY FINAL SCRIPT.JS
// PART 1/3
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


window.openPage=openPage;


// ===============================
// CONTINUE BUTTON FIX
// ===============================

function continueToName(){

openPage("loginPage");

}


window.continueToName =
continueToName;


// ===============================
// USER SYSTEM
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

message.textContent =
error.message;

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


const role =
document
.getElementById("registerRole")
.value;


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
throw new Error(
data.error ||
"Registration failed"
);


document.getElementById(
"verifyEmail"
).value =
email;


openPage(
"verifyPage"
);


}

catch(error){

message.textContent =
error.message;

}

}


window.registerUserAccount =
registerUserAccount;



// ===============================
// TEACHLY FINAL SCRIPT.JS
// PART 2/3
// ===============================


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

  function startTeachly() {
  const name = document
    .getElementById("usernameInput")
    .value
    .trim();

  if (!name) {
    showToast("Please enter your username");
    return;
  }

  state.name = name;
  save();

  document.getElementById("welcomeText").textContent =
    "Welcome, " + state.name + "!";

  openPage("homePage");
  updateAll();
}

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
throw new Error(
data.error ||
"Verification failed"
);



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


window.verifyEmail =
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


window.logout =
logout;




// ===============================
// HOME UPDATE
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
currentUser.sessions || 0;


}


window.updateHome =
updateHome;




// ===============================
// ROLE SELECT
// ===============================


function chooseRole(role){

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




function filterLessons(category){

currentCategory =
category;


renderLessons(
category
);

}


window.filterLessons =
filterLessons;





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





function toggleSavedLesson(){

if(!currentUser ||
!currentLesson)
return;



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




function answerQuiz(answer){

const result =
document.getElementById(
"quizResult"
);



if(answer===currentQuiz.answer){


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


}


}


}

else{

result.textContent =
"❌ Try again";

}


}


window.answerQuiz =
answerQuiz;


// ===============================
// TEACHLY FINAL SCRIPT.JS
// PART 3/3
// ===============================


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
await response.json();


return data.answer ||
"AI could not answer.";


}

catch{

return "AI Teacher unavailable.";

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


if(!input || !chat)
return;


const question =
input.value.trim();


if(!question)
return;



chat.innerHTML += `

<div class="aiMessage user">

${question}

</div>

`;



input.value="";



const answer =
await askAI(
question
);



chat.innerHTML += `

<div class="aiMessage assistant">

${answer}

</div>

`;



chat.scrollTop =
chat.scrollHeight;


}


window.teacherAIHelp =
teacherAIHelp;




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
currentUser?.completedLessons.length || 0;



const quizzes =
currentUser?.quizCompleted.length || 0;



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
currentUser?.purchasedItems.includes(
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


<button onclick="buyItem('${item[1]}',${item[2]})">

${owned?"Equip":"Buy"}

</button>


</div>

`;

});


}


window.renderShop =
renderShop;




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
// AVATAR
// ===============================


function previewAvatar(event){

const file =
event.target.files[0];


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




function uploadAvatar(){

const preview =
document.getElementById(
"avatarPreview"
);



if(!preview || !currentUser)
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


const lessons =
document.getElementById(
"profileLessons"
);



if(name)
name.textContent =
currentUser.username;



if(coins)
coins.textContent =
currentUser.coins;



if(lessons)
lessons.textContent =
currentUser.completedLessons.length;


}


window.updateProfile =
updateProfile;




// ===============================
// CLEAN STARTUP
// ===============================


function refreshData(){

if(!currentUser)
return;


prepareUser();

updateHome();

updateProfile();


}


window.refreshData =
refreshData;



console.log(
"Teachly Final JS Loaded 🚀"
);
