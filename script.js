/* =====================================================
   TEACHLY SCRIPT.JS - PART 1/4
===================================================== */


const API_URL = "https://teachly-nmxh.onrender.com";


let currentUser = null;

let currentRole = "learner";

let currentLesson = null;

let currentQuiz = null;

let currentChatUser = null;

let socket = null;

let map = null;



/* =====================================================
   LESSON DATA
===================================================== */


const lessons = [

{
id:1,

title:"Fractions",

category:"Mathematics",

icon:"➗",

description:
"Understand fractions and their parts.",


content:`

<h3>What is a fraction?</h3>

<p>
A fraction represents a part of a whole.
</p>


<p>
Example:
<strong>1/2</strong>
means one part out of two equal parts.
</p>


<h3>Parts of a fraction</h3>


<p>
The top number is called the
<strong>numerator</strong>.
</p>


<p>
The bottom number is called the
<strong>denominator</strong>.
</p>

`,


quiz:{

question:
"What is the numerator in 3/5?",

options:[
"3",
"5",
"8",
"2"
],

answer:"3"

}

},



{
id:2,

title:"Solar System",

category:"Science",

icon:"🪐",

description:
"Explore planets around our Sun.",


content:`

<h3>The Solar System</h3>

<p>
The Solar System contains the Sun and planets orbiting it.
</p>


<ul>

<li>Mercury</li>

<li>Venus</li>

<li>Earth</li>

<li>Mars</li>

<li>Jupiter</li>

<li>Saturn</li>

<li>Uranus</li>

<li>Neptune</li>

</ul>

`,


quiz:{

question:
"How many planets are in our Solar System?",

options:[
"7",
"8",
"9",
"10"
],

answer:"8"

}

},



{
id:3,

title:"Photosynthesis",

category:"Science",

icon:"🌱",

description:
"Learn how plants create food.",


content:`

<h3>Photosynthesis</h3>

<p>
Plants create food using sunlight energy.
</p>


<p>
Plants need:
</p>


<ul>

<li>Sunlight</li>

<li>Water</li>

<li>Carbon dioxide</li>

</ul>


`,


quiz:{

question:
"What gas do plants absorb?",

options:[
"Oxygen",
"Carbon dioxide",
"Hydrogen",
"Helium"
],

answer:
"Carbon dioxide"

}

}


];





/* =====================================================
   RANDOM TOPICS FIX
===================================================== */


const mysteryTopics=[


{
title:"Why is the sky blue?",

text:
"Sunlight scatters in Earth's atmosphere, making blue light visible."
},



{
title:"How do airplanes fly?",

text:
"Airplane wings create lift by changing airflow pressure."
},



{
title:"What are black holes?",

text:
"Black holes are regions of space with extremely strong gravity."
},



{
title:"Why do seasons happen?",

text:
"Earth's tilt changes how sunlight reaches different areas."
}



];






/* =====================================================
   BADGES
===================================================== */


const badges=[


{
id:"first",

icon:"🌱",

title:"First Step",

description:
"Complete your first lesson.",

requirement:1

},



{
id:"quiz",

icon:"🏆",

title:"Quiz Starter",

description:
"Complete your first quiz.",

requirement:"quiz"

},



{
id:"session",

icon:"🤝",

title:"Connection",

description:
"Connect with another user.",

requirement:"session"

},



{
id:"shop",

icon:"🛍️",

title:"Collector",

description:
"Buy your first item.",

requirement:"shop"

}


];






/* =====================================================
   SHOP
===================================================== */


const shopItems=[


{
id:"star",

icon:"⭐",

name:"Star",

description:
"Show a star effect.",

price:50

},



{
id:"rocket",

icon:"🚀",

name:"Rocket",

description:
"Rocket profile effect.",

price:100

},



{
id:"crown",

icon:"👑",

name:"Crown",

description:
"Premium crown effect.",

price:250

}


];






/* =====================================================
   STARTUP
===================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


loadTheme();

loadUser();


renderLessons();


}
);






/* =====================================================
   USER SYSTEM
===================================================== */


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



if(!saved)
return;



currentUser =
JSON.parse(saved);



currentUser.coins =
Number(
currentUser.coins ?? 100
);



currentUser.completedLessons =
currentUser.completedLessons || [];



currentUser.savedLessons =
currentUser.savedLessons || [];



currentUser.quizCompleted =
currentUser.quizCompleted || [];



currentUser.purchasedItems =
currentUser.purchasedItems || [];



currentUser.equippedItem =
currentUser.equippedItem || null;



currentUser.sessions =
currentUser.sessions || 0;



updateHome();


}






function updateHome(){


if(!currentUser)
return;



document
.getElementById(
"welcomeText"
)
?.replaceChildren(
document.createTextNode(
`Welcome, ${currentUser.username}`
)
);



const username =
document.getElementById(
"homeUsername"
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



if(coins)

coins.textContent =
currentUser.coins;



if(sessions)

sessions.textContent =
currentUser.sessions;



}






/* =====================================================
   PAGE NAVIGATION
===================================================== */


function openPage(id){


document
.querySelectorAll(".page")
.forEach(
page =>
page.classList.remove("active")
);



const page =
document.getElementById(id);



if(!page)
return;



page.classList.add("active");



if(id==="aiPage")
renderLessons();



if(id==="savedLessonsPage")
renderSavedLessons();



if(id==="profilePage")
updateProfile();



if(id==="badgesPage")
renderBadges();



if(id==="shopPage")
renderShop();



}



function goHome(){

openPage(
"homePage"
);

}



window.openPage=openPage;

window.goHome=goHome;

/* =====================================================
   AUTH SYSTEM
===================================================== */


async function registerUserAccount(){

const username =
document.getElementById("registerUsername")
.value.trim();


const email =
document.getElementById("registerEmail")
.value.trim();


const password =
document.getElementById("registerPassword")
.value.trim();


const role =
document.getElementById("registerRole")
.value;



const message =
document.getElementById("registerMessage");



if(!username || !email || !password){

message.textContent =
"Please fill all fields.";

return;

}



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

}
);



const data =
await response.json();



if(!response.ok){

throw new Error(
data.error ||
"Registration failed"
);

}



message.textContent =
"Account created. Verify your email.";



document.getElementById(
"verifyEmail"
).value=email;



openPage(
"verifyPage"
);



}catch(error){


message.textContent =
error.message;


}



}





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

}
);



const data =
await response.json();



if(!response.ok){

throw new Error(
data.error ||
"Verification failed"
);

}



message.textContent =
"Verified successfully. Login now.";



openPage(
"loginPage"
);



}catch(error){


message.textContent =
error.message;


}



}





async function loginUser(){


const email =
document.getElementById(
"loginEmail"
)
.value.trim();



const password =
document.getElementById(
"loginPassword"
)
.value.trim();



const message =
document.getElementById(
"authMessage"
);



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

}
);



const data =
await response.json();



if(!response.ok){

throw new Error(
data.error ||
"Login failed"
);

}



currentUser =
data.user;



currentUser.coins =
Number(
currentUser.coins ?? 100
);



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



saveUser();


updateHome();


updateProfile();


openPage(
"homePage"
);



}catch(error){


message.textContent =
error.message;


}



}



window.registerUserAccount =
registerUserAccount;


window.verifyEmail =
verifyEmail;


window.loginUser =
loginUser;





/* =====================================================
   NAME FLOW
===================================================== */


function continueToName(){


openPage(
"namePage"
);


setTimeout(()=>{


document
.getElementById(
"usernameInput"
)
?.focus();


},100);


}





function continueFromName(){


const input =
document.getElementById(
"usernameInput"
);



const username =
input.value.trim();



if(!username){

input.focus();

return;

}



currentUser={


id:
"local-" +
Date.now(),



username,



role:"learner",



coins:100,



completedLessons:[],



savedLessons:[],



quizCompleted:[],



purchasedItems:[],



equippedItem:null,



sessions:0



};



saveUser();


updateHome();


openPage(
"homePage"
);



}



window.continueToName =
continueToName;


window.continueFromName =
continueFromName;






/* =====================================================
   PROFILE
===================================================== */


function updateProfile(){


if(!currentUser)
return;



const name =
document.getElementById(
"profileName"
);



const lessons =
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



const avatar =
document.getElementById(
"profileAvatar"
);



if(name)

name.textContent =
currentUser.username;



if(lessons)

lessons.textContent =
currentUser.completedLessons.length;



if(sessions)

sessions.textContent =
currentUser.sessions;



if(coins)

coins.textContent =
currentUser.coins;



if(avatar){


const item =
shopItems.find(
i =>
i.id === currentUser.equippedItem
);



avatar.textContent =
item
?
item.icon
:
"👤";

}



}




async function uploadAvatar(){


const file =
document
.getElementById(
"avatarUpload"
)
.files[0];



if(!file || !currentUser)
return;



const reader =
new FileReader();



reader.onload = ()=>{


currentUser.avatar =
reader.result;


saveUser();


updateProfile();


};



reader.readAsDataURL(file);


}



function previewAvatar(event){


const file =
event.target.files[0];



const preview =
document.getElementById(
"avatarPreview"
);



if(!file || !preview)
return;



preview.src =
URL.createObjectURL(file);



preview.style.display =
"block";


}



window.uploadAvatar =
uploadAvatar;


window.previewAvatar =
previewAvatar;

/* =====================================================
   SAVED LESSONS
===================================================== */


function renderSavedLessons(){

const box =
document.getElementById(
"savedLessonList"
);


if(!box)
return;



box.innerHTML = "";



if(!currentUser ||
!currentUser.savedLessons.length){


box.innerHTML =
`
<p>
No saved lessons yet.
</p>
`;

return;


}



currentUser.savedLessons.forEach(id=>{


const lesson =
lessons.find(
item =>
item.id === id
);



if(!lesson)
return;



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

Open Lesson

</button>


`;



box.appendChild(card);



});


}






/* =====================================================
   LESSON SYSTEM
===================================================== */


function renderLessons(category="All"){


const grid =
document.getElementById(
"lessonGrid"
);



const count =
document.getElementById(
"lessonCount"
);



if(!grid)
return;



let filtered =
category==="All"
?
lessons
:
lessons.filter(
lesson =>
lesson.category===category
);



grid.innerHTML="";



if(count)

count.textContent =
lessons.length;



filtered.forEach(
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



<span class="lessonMiniTag">

${lesson.category}

</span>



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



grid.appendChild(card);



});


}





function filterLessons(category){


renderLessons(category);


}





function openLesson(id){


currentLesson =
lessons.find(
lesson =>
lesson.id===id
);



if(!currentLesson)
return;



document.getElementById(
"selectedLessonHeader"
).textContent =
currentLesson.title;



document.getElementById(
"selectedLessonCategory"
).textContent =
currentLesson.category;



document.getElementById(
"selectedLessonTitle"
).textContent =
currentLesson.title;



document.getElementById(
"selectedLessonDescription"
).textContent =
currentLesson.description;



document.getElementById(
"selectedLessonContent"
).innerHTML =
currentLesson.content;



updateSaveButton();



openPage(
"selectedLessonPage"
);



}





function completeLesson(){


if(!currentLesson ||
!currentUser)
return;



if(
currentUser.completedLessons.includes(
currentLesson.id
)
){


alert(
"Already completed."
);


return;


}



currentUser.completedLessons.push(
currentLesson.id
);



currentUser.coins += 20;



saveUser();


updateHome();


updateProfile();


renderBadges();



alert(
"Lesson completed! +20 💰"
);



}





function toggleSavedLesson(){


if(!currentLesson ||
!currentUser)
return;



const saved =
currentUser.savedLessons;



const index =
saved.indexOf(
currentLesson.id
);



if(index>=0){


saved.splice(
index,
1
);


}

else{


saved.push(
currentLesson.id
);


}



saveUser();



updateSaveButton();



}





function updateSaveButton(){


const button =
document.getElementById(
"saveLessonButton"
);



if(!button ||
!currentLesson ||
!currentUser)
return;



button.textContent =
currentUser.savedLessons.includes(
currentLesson.id
)
?
"★ Saved"
:
"☆ Save Lesson";



}





window.renderLessons =
renderLessons;


window.filterLessons =
filterLessons;


window.openLesson =
openLesson;


window.completeLesson =
completeLesson;


window.toggleSavedLesson =
toggleSavedLesson;






/* =====================================================
   QUIZ SYSTEM
===================================================== */


function startQuiz(){


if(!currentLesson)
return;



currentQuiz =
currentLesson.quiz;



document.getElementById(
"quizLessonName"
).textContent =
currentLesson.title;



document.getElementById(
"quizQuestion"
).textContent =
currentQuiz.question;



const box =
document.getElementById(
"quizOptions"
);



box.innerHTML="";



document.getElementById(
"quizResult"
).textContent="";



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





function answerQuiz(answer){


if(!currentQuiz ||
!currentUser)
return;



const result =
document.getElementById(
"quizResult"
);



if(answer===currentQuiz.answer){



result.textContent =
"🎉 Correct! +10 💰";



result.style.color =
"#73e6a1";



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

else{


result.textContent =
"❌ Try again!";



result.style.color =
"#ff8d9b";


}



}



window.startQuiz =
startQuiz;


window.answerQuiz =
answerQuiz;

/* =====================================================
   RANDOM TOPIC
===================================================== */


function mysteryTopic(){


const topic =
mysteryTopics[
Math.floor(
Math.random() *
mysteryTopics.length
)
];



const title =
document.getElementById(
"mysteryTopicTitle"
);



const text =
document.getElementById(
"mysteryTopicText"
);



if(title){

title.textContent =
topic[0];

}



if(text){

text.textContent =
topic[1];

}



openPage(
"mysteryPage"
);



}



window.mysteryTopic =
mysteryTopic;








/* =====================================================
   AI TEACHER
===================================================== */


async function askAI(message){


try{


const response =
await fetch(
`${API_URL}/api/ai`,
{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

message,

lesson:
currentLesson
?
currentLesson.title
:
null,

username:
currentUser
?
currentUser.username
:
"Guest"

})


}
);



const data =
await response.json();



return data.answer ||
"Sorry, I couldn't answer that.";



}

catch(error){


console.error(error);


return
"AI Teacher is unavailable right now.";


}



}







async function teacherAIHelp(){


const input =
document.getElementById(
"aiQuestion"
);



const chat =
document.getElementById(
"aiChat"
);



if(!input ||
!chat)
return;



const question =
input.value.trim();



if(!question)
return;



addAIMessage(
chat,
question,
"user"
);



input.value="";



const loading =
addAIMessage(
chat,
"Thinking...",
"assistant"
);



const answer =
await askAI(question);



loading.textContent =
answer;



}





function addAIMessage(
box,
text,
type
){


const div =
document.createElement(
"div"
);



div.className =
"aiMessage " + type;



div.textContent =
text;



box.appendChild(
div
);



box.scrollTop =
box.scrollHeight;



return div;


}





async function askAITeacher(){


const input =
document.getElementById(
"aiTeacherInput"
);



const box =
document.getElementById(
"aiTeacherMessages"
);



if(!input ||
!box)
return;



const question =
input.value.trim();



if(!question)
return;



addTeacherBubble(
box,
question,
true
);



input.value="";



const loading =
addTeacherBubble(
box,
"Thinking...",
false
);



let context="";



if(currentLesson){


context =
`Explain ${currentLesson.title} from ${currentLesson.category}. `;


}



const answer =
await askAI(
context + question
);



loading.textContent =
answer;



}





function askAIQuick(question){


const input =
document.getElementById(
"aiTeacherInput"
);



if(input){

input.value =
question;


}



askAITeacher();



}





function addTeacherBubble(
box,
text,
user
){


const div =
document.createElement(
"div"
);



div.className =
user
?
"aiBubble user"
:
"aiBubble";



div.textContent =
text;



box.appendChild(
div
);



box.scrollTop =
box.scrollHeight;



return div;


}




function openAITeacher(){


openPage(
"aiTeacherPage"
);


}



window.openAITeacher =
openAITeacher;


window.teacherAIHelp =
teacherAIHelp;


window.askAITeacher =
askAITeacher;


window.askAIQuick =
askAIQuick;








/* =====================================================
   BADGES
===================================================== */


function renderBadges(){


const box =
document.getElementById(
"allBadges"
);



if(!box)
return;



box.innerHTML="";



const lessonsDone =
currentUser
?
currentUser.completedLessons.length
:
0;



const quizzes =
currentUser
?
currentUser.quizCompleted.length
:
0;



const sessions =
currentUser
?
currentUser.sessions
:
0;



const purchases =
currentUser
?
currentUser.purchasedItems.length
:
0;



badges.forEach(
badge=>{


let unlocked=false;



if(
badge.requirement==="quiz"
)
unlocked =
quizzes>=1;



else if(
badge.requirement==="quiz5"
)
unlocked =
quizzes>=5;



else if(
badge.requirement==="session"
)
unlocked =
sessions>0;



else if(
badge.requirement==="shop"
)
unlocked =
purchases>0;



else
unlocked =
lessonsDone >=
badge.requirement;



const card =
document.createElement(
"div"
);



card.className =
unlocked
?
"badge"
:
"badge locked";



card.innerHTML = `

<div class="badgeIcon">

${badge.icon}

</div>


<h3>

${badge.title}

</h3>


<p>

${badge.description}

</p>


<strong>

${unlocked
?
"Unlocked ✓"
:
"Locked"}

</strong>

`;



box.appendChild(
card
);



});


}



window.renderBadges =
renderBadges;

/* =====================================================
   SHOP SYSTEM
===================================================== */


function renderShop(){


const box =
document.getElementById(
"shopList"
);



const coinBox =
document.getElementById(
"shopCoins"
);



if(!box)
return;



if(coinBox){

coinBox.textContent =
currentUser?.coins || 0;

}



box.innerHTML="";



shopItems.forEach(
item=>{


const purchased =
currentUser?.purchasedItems
?.includes(item.id);



const equipped =
currentUser?.equippedItem ===
item.id;



const card =
document.createElement(
"div"
);



card.className =
"shopItem";



card.innerHTML = `


<div class="shopIcon">

${item.icon}

</div>


<h2>

${item.name}

</h2>


<p>

${item.description}

</p>



<div class="price">

💰 ${item.price}

</div>



<button onclick="buyShopItem('${item.id}')">

${
equipped
?
"Equipped"
:
purchased
?
"Equip"
:
"Buy"
}

</button>


`;



box.appendChild(card);



});



}







function buyShopItem(id){


if(!currentUser)
return;



const item =
shopItems.find(
x =>
x.id===id
);



if(!item)
return;



currentUser.purchasedItems =
currentUser.purchasedItems || [];



const owned =
currentUser.purchasedItems.includes(
id
);



if(owned){


currentUser.equippedItem =
id;



saveUser();


renderShop();


updateProfile();


return;


}




if(
currentUser.coins <
item.price
){


alert(
"Not enough coins."
);



return;


}




currentUser.coins -=
item.price;



currentUser.purchasedItems.push(
id
);



currentUser.equippedItem =
id;



saveUser();



updateHome();


renderShop();


renderBadges();


updateProfile();



}



window.renderShop =
renderShop;


window.buyShopItem =
buyShopItem;








/* =====================================================
   PROFILE SYSTEM
===================================================== */


function updateProfile(){


if(!currentUser)
return;



const name =
document.getElementById(
"profileName"
);



const lessons =
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



if(name)

name.textContent =
currentUser.username;



if(lessons)

lessons.textContent =
currentUser.completedLessons.length;



if(sessions)

sessions.textContent =
currentUser.sessions || 0;



if(coins)

coins.textContent =
currentUser.coins || 0;



const avatar =
document.getElementById(
"profileAvatar"
);



if(avatar){


if(
currentUser.profileImage
){


avatar.innerHTML =
`
<img src="${currentUser.profileImage}"
style="
width:100%;
height:100%;
border-radius:50%;
object-fit:cover;
">
`;



}

else{


const item =
shopItems.find(
x =>
x.id ===
currentUser.equippedItem
);



avatar.textContent =
item
?
item.icon
:
"👤";


}


}



}








function previewAvatar(event){


const file =
event.target.files[0];



if(!file)
return;



const reader =
new FileReader();



reader.onload =
function(e){


const img =
document.getElementById(
"avatarPreview"
);



if(img){


img.src =
e.target.result;



img.style.display =
"block";


}



currentUser.profileImage =
e.target.result;



saveUser();



updateProfile();



};



reader.readAsDataURL(
file
);



}








async function uploadAvatar(){


if(!currentUser)
return;



const file =
document.getElementById(
"avatarUpload"
)
?.files[0];



if(!file)
return;



previewAvatar({
target:{
files:[file]
}
});



}



window.previewAvatar =
previewAvatar;


window.uploadAvatar =
uploadAvatar;








/* =====================================================
   SAVED LESSON PAGE LOADER
===================================================== */


function openSavedLessons(){


renderSavedLessons();


openPage(
"savedLessonsPage"
);



}



window.openSavedLessons =
openSavedLessons;

/* =====================================================
   PEOPLE CONNECTION SYSTEM
===================================================== */


async function loadPeople(){


const list =
document.getElementById(
"peopleList"
);



if(!list)
return;



list.innerHTML =
"<p>Loading Teachly users...</p>";



try{


const response =
await fetch(
`${API_URL}/api/people`
);



const people =
await response.json();



list.innerHTML="";



people.forEach(
person=>{


if(
currentUser &&
person.id ===
currentUser.id
)
return;



const card =
document.createElement(
"div"
);



card.className =
"person";



card.innerHTML = `

<div class="personInfo">


<div class="personAvatar">

${
person.profileImage
?
`
<img src="${person.profileImage}"
style="
width:100%;
height:100%;
border-radius:50%;
object-fit:cover;
">
`
:
"👤"
}

</div>



<div>

<strong>

${person.username}

</strong>


<p>

${
person.role==="teacher"
?
"🧑‍🏫 Teacher"
:
"🎓 Learner"
}

</p>


</div>


</div>



<button onclick="connectToPersonById('${person.id}')">

Connect

</button>

`;



list.appendChild(
card
);



});



}
catch(error){


console.error(error);



list.innerHTML =
"<p>Unable to load users.</p>";



}



}







async function connectToPersonById(id){


try{


const response =
await fetch(
`${API_URL}/api/people`
);



const people =
await response.json();



const person =
people.find(
x =>
x.id === id
);



if(person){

connectToPerson(
person
);

}



}
catch(error){


console.error(error);


}



}



window.loadPeople =
loadPeople;


window.connectToPersonById =
connectToPersonById;









/* =====================================================
   SOCKET CHAT SYSTEM
===================================================== */


function connectSocket(){


if(
typeof io === "undefined"
)
return;



if(socket){

socket.disconnect();

}



socket =
io(
API_URL,
{

transports:[
"websocket",
"polling"
]

}
);



socket.on(
"connect",
()=>{


socket.emit(
"join-user",
{

id:
currentUser.id

}
);


}
);





socket.on(
"private-message",
data=>{


addChatMessage(
data.message,
false
);



}
);



}





function sendMessage(){


const input =
document.getElementById(
"messageInput"
);



if(!input)
return;



const message =
input.value.trim();



if(!message)
return;



addChatMessage(
message,
true
);



if(
socket &&
currentChatUser
){


socket.emit(
"private-message",
{

to:
currentChatUser.id,


message

}
);



}



input.value="";


}





function addChatMessage(
message,
mine
){


const box =
document.getElementById(
"chatMessages"
);



if(!box)
return;



const div =
document.createElement(
"div"
);



div.className =
mine
?
"message me"
:
"message";



div.textContent =
message;



box.appendChild(
div
);



box.scrollTop =
box.scrollHeight;



}






function connectToPerson(person){


currentChatUser =
person;



if(currentUser){


currentUser.sessions =
Number(
currentUser.sessions || 0
)
+1;



saveUser();


updateHome();


renderBadges();



}



openPage(
"chatPage"
);



const title =
document.getElementById(
"chatTitle"
);



if(title)

title.textContent =
`Chat with ${person.username}`;



connectSocket();



}



window.sendMessage =
sendMessage;


window.connectToPerson =
connectToPerson;









/* =====================================================
   LOGOUT + RESET
===================================================== */


function logout(){



if(socket){


socket.disconnect();


socket=null;


}



currentUser=null;

currentRole="learner";

currentLesson=null;

currentQuiz=null;

currentChatUser=null;



localStorage.removeItem(
"teachlyUser"
);



openPage(
"loginPage"
);



}



window.logout =
logout;









/* =====================================================
   STARTUP PATCH
===================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


loadUser();


loadTheme();


renderLessons();


if(currentUser){

updateHome();

updateProfile();

renderBadges();

}



}
);
