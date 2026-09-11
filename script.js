const API_URL = "https://teachly-nmxh.onrender.com";

let currentUser = null;
let currentLesson = null;
let currentQuiz = null;
let currentChatUser = null;
let socket = null;
let map = null;
let currentRole = "learner";


const lessons = [
{
id:1,
title:"Fractions",
category:"Mathematics",
icon:"➗",
description:"Understand fractions and their parts.",
content:"<h3>Fractions</h3><p>A fraction represents a part of a whole.</p>",
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
content:"<h3>Algebra</h3><p>Algebra uses symbols for unknown values.</p>",
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
content:"<h3>Solar System</h3><p>The Sun and eight planets form our solar system.</p>",
quiz:{
question:"How many planets are there?",
options:["7","8","9","10"],
answer:"8"
}
}
];



document.addEventListener(
"DOMContentLoaded",
()=>{

loadTheme();

loadUser();

if(currentUser){

updateHome();

openPage("homePage");

}

else{

openPage("introPage");

}

}
);



function openPage(id){

document
.querySelectorAll(".page")
.forEach(
page=>{
page.classList.remove("active");
}
);


const target =
document.getElementById(id);


if(target){

target.classList.add("active");

}


if(id==="profilePage")
updateProfile();


if(id==="aiPage")
renderLessons();


if(id==="savedLessonsPage")
renderSavedLessons();


if(id==="shopPage")
renderShop();


if(id==="badgesPage")
renderBadges();


if(id==="mapPage")
initializeMap();


if(id==="peoplePage")
loadPeople();

}



window.openPage = openPage;



function goHome(){

openPage("homePage");

}


window.goHome = goHome;



function continueToName(){

openPage("loginPage");

}


window.continueToName = continueToName;



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



function prepareUser(){

if(!currentUser)
return;


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


}



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



window.loginUser = loginUser;



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



window.registerUserAccount =
registerUserAccount;

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






function toggleTheme(){

document.body.classList.toggle(
"lightMode"
);



localStorage.setItem(
"teachlyTheme",
document.body.classList.contains(
"lightMode"
)
?
"light"
:
"dark"
);


}



window.toggleTheme =
toggleTheme;






function loadTheme(){

const theme =
localStorage.getItem(
"teachlyTheme"
);



if(theme==="light"){

document.body.classList.add(
"lightMode"
);

}


}



window.loadTheme =
loadTheme;






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
currentUser.sessions;



if(coins)
coins.textContent =
currentUser.coins;



const avatar =
document.getElementById(
"profileAvatar"
);



if(avatar){

if(currentUser.profileImage){

avatar.innerHTML =
`
<img
src="${currentUser.profileImage}"
style="
width:100%;
height:100%;
border-radius:50%;
object-fit:cover;
">
`;

}

else{

avatar.innerHTML =
"👤";

}


}



}



window.updateProfile =
updateProfile;






function previewAvatar(event){

const file =
event.target.files[0];


if(!file)
return;



const reader =
new FileReader();



reader.onload =
function(e){

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



if(!preview)
return;



if(!currentUser)
return;



currentUser.profileImage =
preview.src;



saveUser();


updateProfile();


}



window.uploadAvatar =
uploadAvatar;

function renderLessons(category = "All") {

    const grid = document.getElementById("lessonGrid");

    if (!grid) return;

    const filtered =
        category === "All"
        ? lessons
        : lessons.filter(
            lesson => lesson.category === category
        );

    grid.innerHTML = "";

    filtered.forEach(lesson => {

        const card = document.createElement("div");

        card.className = "lessonCard";

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

        grid.appendChild(card);

    });

}


window.renderLessons = renderLessons;



function filterLessons(category){

    currentCategory = category;

    renderLessons(category);

}


window.filterLessons = filterLessons;



function openLesson(id){

    const lesson =
    lessons.find(
        item => item.id === id
    );


    if(!lesson) return;


    currentLesson = lesson;


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



    if(header)
        header.textContent = lesson.title;


    if(title)
        title.textContent = lesson.title;


    if(category)
        category.textContent = lesson.category;


    if(description)
        description.textContent =
        lesson.description;


    if(content)
        content.innerHTML =
        lesson.content;


    updateSaveButton();


    openPage(
        "selectedLessonPage"
    );

}



window.openLesson = openLesson;



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


        updateProfile();


        renderBadges();


        alert(
            "Lesson completed +20 coins!"
        );

    }

}



window.completeLesson = completeLesson;




function toggleSavedLesson(){

    if(!currentUser || !currentLesson)
        return;


    prepareUser();


    const index =
    currentUser.savedLessons.indexOf(
        currentLesson.id
    );


    if(index >= 0){

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



    const saved =
    currentUser &&
    currentLesson &&
    currentUser.savedLessons.includes(
        currentLesson.id
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

        box.innerHTML =
        `
        <p>
        No saved lessons yet.
        </p>
        `;

        return;

    }



    saved.forEach(id=>{


        const lesson =
        lessons.find(
            item=>item.id===id
        );


        if(!lesson)
            return;



        box.innerHTML += `

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
                Open
            </button>

        </div>

        `;


    });


}



window.renderSavedLessons =
renderSavedLessons;





function startQuiz(){

    if(!currentLesson)
        return;


    currentQuiz =
    currentLesson.quiz;



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



    if(name)
        name.textContent =
        currentLesson.title;


    if(question)
        question.textContent =
        currentQuiz.question;



    if(options){

        options.innerHTML="";


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


                options.appendChild(
                    button
                );


            }
        );


    }



    if(result)
        result.textContent="";


    openPage(
        "quizPage"
    );


}



window.startQuiz=startQuiz;



function answerQuiz(answer){

    const result =
    document.getElementById(
        "quizResult"
    );


    if(answer === currentQuiz.answer){

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


                currentUser.coins +=10;


                saveUser();


                updateHome();

                renderBadges();

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
        "AI could not answer.";

    }

    catch(error){

        return "AI Teacher unavailable.";

    }

}



window.askAI = askAI;





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
    await askAI(question);



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







function askAIQuick(text){

    const input =
    document.getElementById(
        "aiTeacherInput"
    );


    if(input){

        input.value =
        text;

    }


}



window.askAIQuick =
askAIQuick;







function mysteryTopic(){

    const topics=[

        {
            title:"Why is the sky blue?",
            text:"Sunlight scatters through Earth's atmosphere creating the blue color."
        },

        {
            title:"How do airplanes fly?",
            text:"Air pressure and wing shape create lift."
        },

        {
            title:"Why do seasons happen?",
            text:"Earth's tilt changes how sunlight reaches different areas."
        },

        {
            title:"What are black holes?",
            text:"They are places in space with extremely strong gravity."
        },

        {
            title:"How do plants grow?",
            text:"Plants use sunlight, water and carbon dioxide."
        },

        {
            title:"How does the brain learn?",
            text:"Neurons create connections when we practice and study."
        }

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
            topic.title;


        if(text)
            text.textContent =
            topic.text;


    }

    else{

        alert(
            topic.title+
            "\n\n"+
            topic.text
        );

    }


}



window.mysteryTopic =
mysteryTopic;








function renderBadges(){

    const box =
    document.getElementById(
        "allBadges"
    );


    if(!box)
        return;



    const lessons =
    currentUser?.completedLessons?.length || 0;


    const quizzes =
    currentUser?.quizCompleted?.length || 0;


    const sessions =
    currentUser?.sessions || 0;




    const badges=[

        [
            "🌱",
            "First Lesson",
            lessons>=1
        ],

        [
            "📚",
            "Book Collector",
            lessons>=5
        ],

        [
            "🧠",
            "Knowledge Master",
            lessons>=10
        ],

        [
            "🏆",
            "Quiz Beginner",
            quizzes>=1
        ],

        [
            "⭐",
            "Quiz Expert",
            quizzes>=5
        ],

        [
            "🤝",
            "Connector",
            sessions>=1
        ],

        [
            "👑",
            "Teachly Legend",
            lessons>=25
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
                    ${
                    badge[2]
                    ?
                    "Unlocked ✓"
                    :
                    "Locked"
                    }
                </p>


            </div>

            `;


        }
    );


}



window.renderBadges =
renderBadges;








function renderShop(){

    const box =
    document.getElementById(
        "shopList"
    );


    if(!box)
        return;



    const products=[

        ["🟣","Purple Glow",50],

        ["⭐","Star Effect",100],

        ["🚀","Rocket Effect",150],

        ["🔥","Fire Aura",250],

        ["👑","Royal Crown",500],

        ["💎","Diamond Aura",1000],

        ["🌌","Galaxy Effect",2000],

        ["⚡","Lightning Aura",3000],

        ["🏆","Champion Effect",5000],

        ["🌈","Rainbow Aura",7500]

    ];



    box.innerHTML="";



    products.forEach(
        item=>{


            const owned =
            currentUser?.purchasedItems
            ?.includes(item[1]);



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

                ${
                owned
                ?
                "Equip"
                :
                "Buy"
                }

                </button>


            </div>

            `;


        }
    );


}



window.renderShop =
renderShop;

function buyItem(name,price){

    if(!currentUser)
        return;


    prepareUser();



    if(
        currentUser.purchasedItems.includes(name)
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

    updateProfile();

    renderShop();


}



window.buyItem =
buyItem;








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



    reader.readAsDataURL(file);


}



window.previewAvatar =
previewAvatar;







function uploadAvatar(){

    const preview =
    document.getElementById(
        "avatarPreview"
    );


    if(
        !preview ||
        !preview.src
    )
        return;



    if(currentUser){

        currentUser.profileImage =
        preview.src;


        saveUser();


        updateProfile();

    }


}



window.uploadAvatar =
uploadAvatar;







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
        currentUser.sessions;



    if(coins)
        coins.textContent =
        currentUser.coins;



    const avatar =
    document.getElementById(
        "profileAvatar"
    );



    if(avatar){


        if(currentUser.profileImage){

            avatar.innerHTML = `

            <img 
            src="${currentUser.profileImage}"
            class="profileImage">

            `;

        }
        else{

            avatar.innerHTML =
            "👤";

        }


    }


}



window.updateProfile =
updateProfile;








async function loadPeople(){

    const list =
    document.getElementById(
        "peopleList"
    );


    if(!list)
        return;



    try{


        const response =
        await fetch(
            `${API_URL}/api/people`
        );



        const users =
        await response.json();



        list.innerHTML="";



        if(
            !Array.isArray(users) ||
            users.length===0
        ){

            list.innerHTML =
            `
            <p>
            No Teachly users found.
            </p>
            `;

            return;

        }



        users.forEach(
            person=>{


                if(
                    person.username ===
                    currentUser?.username
                )
                    return;



                list.innerHTML += `

                <div class="personCard">


                    <h3>
                    ${person.username}
                    </h3>


                    <p>
                    Teachly User
                    </p>


                    <button onclick='connectToPerson(${JSON.stringify(person)})'>

                    Connect

                    </button>


                </div>

                `;


            }
        );


    }

    catch(error){

        list.innerHTML =
        `
        <p>
        Unable to load users.
        </p>
        `;

    }


}



window.loadPeople =
loadPeople;








function connectToPerson(person){

    currentChatUser =
    person;



    openPage(
        "chatPage"
    );



    const title =
    document.getElementById(
        "chatTitle"
    );


    if(title)
        title.textContent =
        person.username;



    connectSocket();


}



window.connectToPerson =
connectToPerson;







function connectSocket(){

    if(socket)
        return;



    if(typeof io === "undefined")
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


        }
    );


}



window.connectSocket =
connectSocket;







function addChatMessage(text,mine){

    const box =
    document.getElementById(
        "chatMessages"
    );


    if(!box)
        return;



    box.innerHTML += `

    <div class="message ${mine?"me":""}">
        ${text}
    </div>

    `;



    box.scrollTop =
    box.scrollHeight;


}



window.addChatMessage =
addChatMessage;








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



    if(socket){

        socket.emit(
            "private-message",
            {
                message
            }
        );

    }



    input.value="";


}



window.sendMessage =
sendMessage;








function addEmoji(emoji){

    const input =
    document.getElementById(
        "messageInput"
    );


    if(input){

        input.value += emoji;

    }


}



window.addEmoji =
addEmoji;

function initializeMap(){

    if(typeof L === "undefined")
        return;


    const container =
    document.getElementById(
        "worldMap"
    );


    if(!container)
        return;



    if(map){

        map.invalidateSize();

        return;

    }



    map =
    L.map(
        "worldMap"
    )
    .setView(
        [20,0],
        2
    );



    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom:18,

            attribution:
            "© OpenStreetMap"

        }

    )
    .addTo(map);



    const continents = [

        {
            name:"Asia",
            lat:34,
            lng:100
        },

        {
            name:"Africa",
            lat:0,
            lng:20
        },

        {
            name:"Europe",
            lat:50,
            lng:10
        },

        {
            name:"North America",
            lat:40,
            lng:-100
        },

        {
            name:"South America",
            lat:-15,
            lng:-60
        },

        {
            name:"Australia/Oceania",
            lat:-25,
            lng:135
        },

        {
            name:"Antarctica",
            lat:-80,
            lng:0
        }

    ];



    continents.forEach(
        continent=>{


            L.marker(
                [
                    continent.lat,
                    continent.lng
                ]
            )
            .addTo(map)
            .bindPopup(
                `
                <h3>
                ${continent.name}
                </h3>

                <button onclick="showContinent('${continent.name}')">
                Explore
                </button>
                `
            );


        }
    );


}



window.initializeMap =
initializeMap;








function showContinent(name){

    const info =
    document.getElementById(
        "countryInfo"
    );


    if(!info)
        return;



    const data={


        "Asia":
        "Largest continent. Home to diverse cultures, mountains and ancient civilizations.",


        "Africa":
        "Known for wildlife, deserts, and rich history.",


        "Europe":
        "Known for art, science, and historical landmarks.",


        "North America":
        "Contains many climates, cultures, and ecosystems.",


        "South America":
        "Home to the Amazon rainforest and Andes mountains.",


        "Australia/Oceania":
        "Famous for unique animals and island nations.",


        "Antarctica":
        "The coldest continent covered mostly by ice."

    };



    info.innerHTML = `

    <h2>
    🌍 ${name}
    </h2>


    <p>
    ${data[name]}
    </p>

    `;


}



window.showContinent =
showContinent;








function toggleTheme(){

    document.body.classList.toggle(
        "darkMode"
    );


    const dark =
    document.body.classList.contains(
        "darkMode"
    );


    localStorage.setItem(
        "teachlyTheme",
        dark
    );


}



window.toggleTheme =
toggleTheme;








function loadTheme(){

    const saved =
    localStorage.getItem(
        "teachlyTheme"
    );



    if(saved==="true"){

        document.body.classList.add(
            "darkMode"
        );

    }


}



window.loadTheme =
loadTheme;








function continueFromName(){

    const input =
    document.getElementById(
        "usernameInput"
    );


    if(input && input.value.trim()){

        localStorage.setItem(
            "guestName",
            input.value.trim()
        );

    }



    openPage(
        "loginPage"
    );


}



window.continueFromName =
continueFromName;








function goHome(){

    if(currentUser){

        updateHome();


        openPage(
            "homePage"
        );

    }

    else{

        openPage(
            "introPage"
        );

    }


}



window.goHome =
goHome;








function startApplication(){

    try{


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
                "introPage"
            );

        }



    }

    catch(error){


        console.error(
            "Teachly startup error:",
            error
        );


        openPage(
            "introPage"
        );


    }


}








document.addEventListener(
"DOMContentLoaded",
()=>{


    startApplication();


});








window.addEventListener(
"error",
event=>{


    console.error(
        "Teachly error:",
        event.error
    );


});








function refreshData(){

    if(!currentUser)
        return;


    prepareUser();


    updateHome();


    updateProfile();


}



window.refreshData =
refreshData;








function clearBrokenSession(){

    try{


        const data =
        JSON.parse(
            localStorage.getItem(
                "teachlyUser"
            )
        );



        if(!data){

            localStorage.removeItem(
                "teachlyUser"
            );

        }


    }

    catch{


        localStorage.removeItem(
            "teachlyUser"
        );


    }


}



clearBrokenSession();








console.log(
"Teachly loaded successfully 🚀"
);
