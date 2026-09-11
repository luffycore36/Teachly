const API_URL = "https://teachly-nmxh.onrender.com";

let currentUser = null;
let currentRole = "learner";
let currentLesson = null;
let currentQuiz = null;
let currentChatUser = null;
let socket = null;
let map = null;


const lessons = [

{
id:1,
title:"Fractions",
category:"Mathematics",
icon:"➗",
description:"Understand fractions and their parts.",
content:`
<h3>What is a fraction?</h3>
<p>A fraction represents a part of a whole.</p>

<p>
Example:
<strong>1/2</strong>
means one part out of two equal parts.
</p>

<h3>Parts of a fraction</h3>

<p>
Top number = Numerator
</p>

<p>
Bottom number = Denominator
</p>
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

<p>
Algebra uses letters to represent unknown values.
</p>

<p>
Example:
<strong>x + 5 = 10</strong>
</p>

<p>
x = 5
</p>
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
description:"Explore planets around our Sun.",
content:`
<h3>Solar System</h3>

<p>
The Solar System contains the Sun and planets.
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
question:"How many planets are in our Solar System?",
options:["7","8","9","10"],
answer:"8"
}
},


{
id:4,
title:"Photosynthesis",
category:"Science",
icon:"🌱",
description:"Learn how plants make food.",
content:`
<h3>Photosynthesis</h3>

<p>
Plants create food using sunlight.
</p>

<ul>
<li>Sunlight</li>
<li>Water</li>
<li>Carbon dioxide</li>
</ul>
`,
quiz:{
question:"What gas do plants absorb?",
options:[
"Oxygen",
"Carbon dioxide",
"Hydrogen",
"Helium"
],
answer:"Carbon dioxide"
}
},


{
id:5,
title:"Grammar Basics",
category:"English",
icon:"✍️",
description:"Learn sentence rules.",
content:`
<h3>Grammar</h3>

<p>
Grammar controls how sentences are formed.
</p>

<h3>Nouns</h3>
<p>
Names of people, places and things.
</p>

<h3>Verbs</h3>
<p>
Actions or states.
</p>
`,
quiz:{
question:"Which word is a verb in 'Birds fly'?",
options:[
"Birds",
"fly",
"the",
"none"
],
answer:"fly"
}
},


{
id:6,
title:"Ancient Egypt",
category:"History",
icon:"🏺",
description:"Discover Ancient Egypt.",
content:`
<h3>Ancient Egypt</h3>

<p>
Ancient Egypt developed near the Nile River.
</p>

<p>
It is famous for pyramids and pharaohs.
</p>
`,
quiz:{
question:"Which river was important to Egypt?",
options:[
"Nile",
"Amazon",
"Ganges",
"Danube"
],
answer:"Nile"
}
}

];



const mysteryTopics=[

[
"Why is the sky blue?",
"Light scatters through Earth's atmosphere."
],

[
"How do airplanes fly?",
"Wings create lift by moving air."
],

[
"Why do we have seasons?",
"Earth's tilt changes sunlight angles."
],

[
"What is a black hole?",
"A region of space with extremely strong gravity."
]

];




document.addEventListener(
"DOMContentLoaded",
()=>{

loadTheme();

showStartScreen();

}
);



function showStartScreen(){

currentUser=null;

openPage("introPage");

}



function openPage(id){

document
.querySelectorAll(".page")
.forEach(page=>{

page.classList.remove("active");

});


const page=document.getElementById(id);


if(page){

page.classList.add("active");

}



if(id==="aiPage"){

renderLessons();

}


if(id==="profilePage"){

updateProfile();

}


if(id==="badgesPage"){

renderBadges();

}


if(id==="shopPage"){

renderShop();

}


if(id==="mapPage"){

initializeMap();

}


if(id==="peoplePage"){

loadPeople();

}

}



window.openPage=openPage;



function continueToName(){

openPage("loginPage");

}


window.continueToName=continueToName;



function saveUser(){

if(currentUser){

localStorage.setItem(
"teachlySession",
JSON.stringify(currentUser)
);

}

}



function loadUser(){

const saved=
localStorage.getItem(
"teachlySession"
);


if(saved){

currentUser=
JSON.parse(saved);

currentRole=
currentUser.role ||
"learner";

return true;

}


return false;

}



async function loginUser(){

const email=
document.getElementById(
"loginEmail"
).value.trim();


const password=
document.getElementById(
"loginPassword"
).value;



const message=
document.getElementById(
"authMessage"
);



try{


const response=
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



const data=
await response.json();



if(!response.ok){

throw new Error(
data.error ||
"Login failed"
);

}



currentUser=data.user;


saveUser();


updateHome();


openPage(
"homePage"
);



}
catch(error){


message.textContent=
error.message;


}



}



window.loginUser=loginUser;

async function loginUser() {

  const email =
    document.getElementById("loginEmail")?.value.trim();

  const password =
    document.getElementById("loginPassword")?.value.trim();

  const message =
    document.getElementById("authMessage");


  if (!email || !password) {

    if (message)
      message.textContent =
        "Enter email and password.";

    return;

  }


  try {

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


    if (!response.ok){

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


    currentUser.equippedItem =
      currentUser.equippedItem || null;


    saveUser();


    updateHome();

    updateProfile();


    openPage("homePage");


  }

  catch(error){

    if(message)
      message.textContent =
        error.message;

  }

}




async function registerUserAccount(){

  const username =
    document.getElementById(
      "registerUsername"
    )?.value.trim();


  const email =
    document.getElementById(
      "registerEmail"
    )?.value.trim();


  const password =
    document.getElementById(
      "registerPassword"
    )?.value.trim();


  const role =
    document.getElementById(
      "registerRole"
    )?.value;



  const message =
    document.getElementById(
      "registerMessage"
    );



  if(
    !username ||
    !email ||
    !password
  ){

    if(message)
      message.textContent =
        "Fill all fields.";

    return;

  }



  try{


    const response =
      await fetch(
        `${API_URL}/api/register`,
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
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



    document.getElementById(
      "verifyEmail"
    ).value =
      email;



    openPage(
      "verifyPage"
    );



  }


  catch(error){

    if(message)
      message.textContent =
        error.message;

  }


}




async function verifyEmail(){

  const email =
    document.getElementById(
      "verifyEmail"
    )?.value.trim();


  const code =
    document.getElementById(
      "verifyCode"
    )?.value.trim();


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
            "Content-Type":
              "application/json"
          },


          body:
            JSON.stringify({
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



    if(message)
      message.textContent =
        "Verified! Login now.";



    openPage(
      "loginPage"
    );


  }


  catch(error){

    if(message)
      message.textContent =
        error.message;

  }

}




function saveUser(){

  if(!currentUser)
    return;


  localStorage.setItem(
    "teachlyUser",
    JSON.stringify(
      currentUser
    )
  );

}




function loadUser(){

  const saved =
    localStorage.getItem(
      "teachlyUser"
    );


  if(!saved)
    return;



  try{


    currentUser =
      JSON.parse(
        saved
      );


    updateHome();

    updateProfile();


  }

  catch{

    localStorage.removeItem(
      "teachlyUser"
    );

  }

}





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




function openPage(id){

  document
    .querySelectorAll(
      ".page"
    )
    .forEach(
      page =>
      page.classList.remove(
        "active"
      )
    );


  const page =
    document.getElementById(
      id
    );


  if(page)
    page.classList.add(
      "active"
    );


  if(id==="aiPage")
    renderLessons();


  if(id==="profilePage")
    updateProfile();


  if(id==="shopPage")
    renderShop();


  if(id==="badgesPage")
    renderBadges();


  if(id==="savedLessonsPage")
    renderSavedLessons();


  if(id==="mapPage")
    initializeMap();


}





function continueToName(){

  openPage(
    "loginPage"
  );

}



window.loginUser =
loginUser;


window.registerUserAccount =
registerUserAccount;


window.verifyEmail =
verifyEmail;


window.openPage =
openPage;


window.logout =
logout;


window.continueToName =
continueToName;

function renderLessons(category="All"){

const grid =
document.getElementById(
"lessonGrid"
);

if(!grid)
return;


let filtered =
category==="All"
?
lessons
:
lessons.filter(
l=>l.category===category
);



grid.innerHTML="";



filtered.forEach(
lesson=>{


const card =
document.createElement(
"div"
);


card.className =
"lessonCard";



card.innerHTML=`

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



grid.appendChild(card);



});


}





function filterLessons(category){

renderLessons(category);

}




function openLesson(id){

currentLesson =
lessons.find(
l=>l.id===id
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

if(!currentUser || !currentLesson)
return;



currentUser.completedLessons =
currentUser.completedLessons || [];



if(
!currentUser.completedLessons.includes(
currentLesson.id
)
){

currentUser.completedLessons.push(
currentLesson.id
);



currentUser.lessonsCompleted =
currentUser.completedLessons.length;



currentUser.coins =
Number(
currentUser.coins || 0
)+20;



saveUser();


updateHome();

renderBadges();


alert(
"Lesson completed +20 coins"
);


}

}




function toggleSavedLesson(){

if(
!currentUser ||
!currentLesson
)
return;



currentUser.savedLessons =
currentUser.savedLessons || [];



const index =
currentUser.savedLessons.indexOf(
currentLesson.id
);



if(index>-1){

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




function updateSaveButton(){

const button =
document.getElementById(
"saveLessonButton"
);



if(!button)
return;



const saved =
currentUser?.savedLessons
?.includes(
currentLesson?.id
);



button.textContent =
saved
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



const saved =
currentUser?.savedLessons || [];



if(saved.length===0){

box.innerHTML=
"<p>No saved lessons yet.</p>";

return;

}




saved.forEach(id=>{


const lesson =
lessons.find(
l=>l.id===id
);



if(!lesson)
return;



const card =
document.createElement(
"div"
);



card.className=
"lessonCard";



card.innerHTML=`

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
Open
</button>

`;



box.appendChild(card);



});


}





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

const result =
document.getElementById(
"quizResult"
);



if(answer===currentQuiz.answer){


result.textContent=
"🎉 Correct!";



if(currentUser){


currentUser.quizCompleted =
currentUser.quizCompleted || [];



if(
!currentUser.quizCompleted.includes(
currentLesson.id
)
){


currentUser.quizCompleted.push(
currentLesson.id
);



currentUser.coins =
Number(
currentUser.coins||0
)+10;



saveUser();

updateHome();

renderBadges();


}


}


}

else{


result.textContent=
"❌ Try again";


}



}




function mysteryTopic(){


const topics=[


[
"Why is the sky blue?",
"Because sunlight scatters in Earth's atmosphere."
],


[
"How do airplanes fly?",
"Wings create lift by moving air."
],


[
"Why do seasons happen?",
"Earth's tilt changes sunlight angles."
],


[
"What are black holes?",
"Regions of space with extremely strong gravity."
],


[
"How do plants grow?",
"They use sunlight, water and carbon dioxide."
]


];



const topic =
topics[
Math.floor(
Math.random()*topics.length
)
];



openPage(
"mysteryPage"
);



document.getElementById(
"mysteryTopicTitle"
).textContent =
topic[0];



document.getElementById(
"mysteryTopicText"
).textContent =
topic[1];


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

window.startQuiz =
startQuiz;

window.mysteryTopic =
mysteryTopic;

window.renderSavedLessons =
renderSavedLessons;

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

}

);



const data =
await response.json();



return data.answer ||
"Sorry, I could not answer.";


}

catch{

return
"AI Teacher is unavailable.";

}


}




async function teacherAIHelp(){

const input =
document.getElementById(
"aiQuestion"
);


const box =
document.getElementById(
"aiChat"
);



if(!input || !box)
return;



const question =
input.value.trim();



if(!question)
return;



box.innerHTML +=
`

<div class="aiMessage user">
${question}
</div>

`;



input.value="";



const answer =
await askAI(question);



box.innerHTML +=
`

<div class="aiMessage assistant">
${answer}
</div>

`;



}





function renderBadges(){

const box =
document.getElementById(
"allBadges"
);



if(!box)
return;



const lessonsDone =
currentUser?.completedLessons?.length || 0;



const quizzes =
currentUser?.quizCompleted?.length || 0;



const sessions =
currentUser?.sessions || 0;



const items=[


[
"🌱",
"First Step",
lessonsDone>=1
],


[
"📚",
"Bookworm",
lessonsDone>=5
],


[
"🧠",
"Knowledge Builder",
lessonsDone>=10
],


[
"🏆",
"Quiz Starter",
quizzes>=1
],


[
"🎯",
"Quiz Master",
quizzes>=5
],


[
"🤝",
"Connector",
sessions>=1
]

];



box.innerHTML="";



items.forEach(
badge=>{


const div =
document.createElement(
"div"
);



div.className =
badge[2]
?
"badge"
:
"badge locked";



div.innerHTML=
`

<h2>
${badge[0]}
</h2>

<h3>
${badge[1]}
</h3>


<p>
${badge[2]
?"Unlocked ✓"
:"Locked"}
</p>

`;



box.appendChild(div);


});


}





function renderShop(){

const box =
document.getElementById(
"shopList"
);



if(!box)
return;



const products=[


["🟣","Purple Glow",50],

["⭐","Star Badge",75],

["🚀","Rocket",100],

["🔥","Fire Effect",150],

["👑","Crown",250],

["💎","Diamond",500],

["🌌","Galaxy",750],

["🏆","Champion",1000],

["⚡","Legend",2500]

];



box.innerHTML="";



products.forEach(
item=>{


const bought =
currentUser?.purchasedItems
?.includes(
item[1]
);



const div =
document.createElement(
"div"
);



div.className =
"shopItem";



div.innerHTML=
`

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

${bought?"Equip":"Buy"}

</button>

`;



box.appendChild(div);


});


}





function buyItem(name,price){

if(!currentUser)
return;



currentUser.purchasedItems =
currentUser.purchasedItems || [];



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


currentUser.coins-=price;


currentUser.purchasedItems.push(
name
);


currentUser.equippedItem =
name;


}



saveUser();

updateHome();

renderShop();

updateProfile();


}




function previewAvatar(event){

const file =
event.target.files[0];


if(!file)
return;



const reader =
new FileReader();



reader.onload =
e=>{


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


};



reader.readAsDataURL(
file
);


}





function uploadAvatar(){

const img =
document.getElementById(
"avatarPreview"
);



if(
!img ||
!img.src
)
return;



if(currentUser){


currentUser.profileImage =
img.src;



saveUser();


updateProfile();


}


}





function updateProfile(){

if(!currentUser)
return;



document.getElementById(
"profileName"
).textContent =
currentUser.username;



document.getElementById(
"profileLessons"
).textContent =
currentUser.completedLessons?.length || 0;



document.getElementById(
"profileSessions"
).textContent =
currentUser.sessions || 0;



document.getElementById(
"profileCoins"
).textContent =
currentUser.coins || 0;



const avatar =
document.getElementById(
"profileAvatar"
);



if(avatar){


avatar.innerHTML =
currentUser.profileImage
?
`<img src="${currentUser.profileImage}">`
:
"👤";


}


}





function initializeMap(){

if(typeof L==="undefined")
return;



const element =
document.getElementById(
"worldMap"
);



if(!element)
return;



if(map)
return;



map =
L.map(
"worldMap"
)
.setView(
[20,0],
2
);



L.tileLayer(

"https://tile.openstreetmap.org/{z}/{x}/{y}.png"

)
.addTo(map);


}





async function loadPeople(){

const list =
document.getElementById(
"peopleList"
);



if(!list)
return;



try{


const res =
await fetch(
`${API_URL}/api/people`
);



const users =
await res.json();



list.innerHTML="";



users.forEach(
person=>{


if(
person.id===currentUser?.id
)
return;



list.innerHTML +=
`

<div class="person">

<h3>
${person.username}
</h3>

<p>
${person.role}
</p>


<button onclick="connectToPerson(${JSON.stringify(person)})">
Connect
</button>


</div>

`;

});


}

catch{

list.innerHTML =
"Unable to load users.";

}


}





function connectSocket(){

if(
typeof io==="undefined"
)
return;



socket =
io(API_URL);



socket.on(
"private-message",
data=>{


addChatMessage(
data.message,
false
);


});


}





function addChatMessage(
text,
mine
){

const box =
document.getElementById(
"chatMessages"
);



if(!box)
return;



box.innerHTML +=
`

<div class="message ${mine?"me":""}">
${text}
</div>

`;


}





function sendMessage(){

const input =
document.getElementById(
"messageInput"
);



if(!input)
return;



const msg =
input.value.trim();



if(!msg)
return;



addChatMessage(
msg,
true
);



if(socket){

socket.emit(
"private-message",
{
message:msg
}
);

}



input.value="";


}





document.addEventListener(
"DOMContentLoaded",
()=>{


loadUser();


renderLessons();


updateProfile();


}
);



window.teacherAIHelp =
teacherAIHelp;

window.renderBadges =
renderBadges;

window.renderShop =
renderShop;

window.buyItem =
buyItem;

window.previewAvatar =
previewAvatar;

window.uploadAvatar =
uploadAvatar;

window.sendMessage =
sendMessage;

window.loadPeople =
loadPeople;

window.initializeMap =
initializeMap;
