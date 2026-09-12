const CONTINENTS={
"North America":{emoji:"🌎",info:"North America includes Canada, the United States, Mexico, Central America and the Caribbean. It spans Arctic regions to tropical climates and contains the Rocky Mountains, Great Plains and many major freshwater lakes."},
"South America":{emoji:"🌎",info:"South America is home to the Amazon Basin and Andes Mountains. It contains enormous biodiversity and landscapes ranging from tropical rainforest to high mountains and dry deserts."},
"Europe":{emoji:"🏰",info:"Europe is a continent of diverse languages, cultures and landscapes. It includes the Alps, Mediterranean regions, northern forests and many historic cities."},
"Africa":{emoji:"🦁",info:"Africa is the second-largest continent and has deserts, savannas, rainforests, mountains and long coastlines. The Sahara is the world's largest hot desert."},
"Asia":{emoji:"🏯",info:"Asia is the largest continent by area and population. It contains the Himalayas, vast deserts, tropical forests, major rivers and an extraordinary range of cultures."},
"Australia":{emoji:"🦘",info:"Australia is both a country and a continent. Its landscapes include the Outback, tropical northern areas, temperate forests and the Great Barrier Reef."},
"Antarctica":{emoji:"🧊",info:"Antarctica surrounds the South Pole and is Earth's coldest continent. It is dominated by a huge ice sheet and is home to wildlife such as penguins and seals."}
};
const LESSONS=[
["🌌","Space","Stars, gravity, orbits and galaxies.","Stars are enormous spheres of hot plasma that release energy through processes in their cores. A planet's path around a star is a curved orbit produced by the interaction of its motion and the star's gravity. Galaxies are large systems containing stars, gas, dust and dark matter. Our Solar System is part of the Milky Way.",[
{question:"A planet is moving forward while a star's gravity continually pulls it inward. According to the lesson, why can the resulting path be curved instead of straight?",options:["The planet's motion and the star's gravity act together to produce an orbit","The planet stops moving whenever gravity acts","The galaxy forces every planet to move in a circle","The planet is fixed while only the star changes position"],correct:0},
{question:"Which conclusion follows from the lesson's description of a galaxy?",options:["A galaxy can contain stars, gas, dust and dark matter","Every galaxy contains exactly one star and no other material","Galaxies are made only of planets that orbit one another","A galaxy is simply empty space between star systems"],correct:0},
{question:"If a planet kept its forward motion but the star's gravitational influence disappeared, which lesson-based change would be expected?",options:["The curved orbital path would no longer be maintained by that gravity","The planet would immediately become a star","The planet would remain on exactly the same curved orbit","The planet would stop existing"],correct:0}]],
["🧬","Biology","Cells, DNA and ecosystems.","Cells are the basic structural and functional units of living organisms. DNA stores hereditary information. An ecosystem is a system in which living organisms interact with one another and with their physical environment. This means an ecosystem includes both biological interactions and surrounding physical conditions.",[
{question:"A scientist finds a structure that carries hereditary information inside a living organism. Which lesson concept most directly describes its role?",options:["DNA, because it stores hereditary information","An ecosystem, because it contains physical conditions","A cell, because every cell is hereditary information","A habitat, because habitats store DNA"],correct:0},
{question:"Which situation best fits the lesson's definition of an ecosystem?",options:["Living organisms interacting with one another and with their physical surroundings","A single organism considered without its surroundings","A DNA molecule considered without any organism or environment","Only the non-living temperature and rainfall of an area"],correct:0},
{question:"Why can a cell be described as fundamental to living organisms according to the lesson?",options:["It is a basic structural and functional unit of living organisms","It is the largest system containing every ecosystem","It stores every environmental condition directly","It is a type of physical environment rather than a living structure"],correct:0}]],
["⚡","Physics","Forces, energy, current and motion.","A force is a push or pull that can change an object's motion. Energy is the capacity to cause change. Electric current is the flow of electric charge through a conductor. Motion describes how an object's position changes over time.",[
{question:"A moving object changes its motion after a push. Which lesson concept explains the interaction responsible for that change?",options:["Force, because a force is a push or pull that can change motion","Energy, because energy is defined as the object's position","Current, because every change in motion is electric charge","Motion, because motion is the cause of every force"],correct:0},
{question:"A wire carries moving electric charge. Which statement uses the lesson's definition most precisely?",options:["The wire has electric current because charge is flowing through a conductor","The wire has motion but therefore cannot have current","The wire has energy only if no charge is moving","The wire has a force because current means a push or pull"],correct:0},
{question:"Which pair correctly distinguishes two concepts from the lesson?",options:["Motion describes changing position over time, while energy is the capacity to cause change","Motion is the flow of charge, while energy is a type of conductor","Energy is only a push or pull, while force describes position over time","Force is the capacity to cause change, while current is an object's position"],correct:0}]],
["🌋","Earth Science","Tectonic plates, volcanoes, rocks and weather.","Earth's crust is made of moving tectonic plates. Volcanoes can form where magma reaches the surface. Rocks are commonly grouped as igneous, sedimentary and metamorphic. Weather describes short-term atmospheric conditions such as temperature, wind and rainfall.",[
{question:"A geological region contains crustal plates moving relative to one another. Which lesson idea does this support?",options:["Earth's crust is made of moving tectonic plates","All rocks form only when magma reaches the surface","Weather is responsible for moving crustal plates","The crust is a single unmoving shell"],correct:0},
{question:"A sample is being classified using the three broad rock groups named in the lesson. Which classification set is appropriate?",options:["Igneous, sedimentary and metamorphic","Metallic, gaseous and electrical","Solar, lunar and atmospheric","Hot, cold and rainy"],correct:0},
{question:"A forecast describes today's temperature, wind and rainfall. Which lesson concept is being described?",options:["Weather, because it concerns short-term atmospheric conditions","A tectonic plate, because wind moves the crust","A rock group, because rainfall creates all rocks","A volcano, because every weather event begins with magma"],correct:0}]],
["💻","Computing","Algorithms, code, networks and AI.","An algorithm is a step-by-step procedure for solving a problem or completing a task. Code expresses instructions in a programming language. Computer networks allow devices to communicate and share data. AI systems can analyze information and generate outputs based on their design and training.",[
{question:"A program's instructions are organized into a clear sequence of steps for solving a task before implementation. Which lesson concept best describes that sequence?",options:["An algorithm, because it is a step-by-step procedure for solving a problem","A network, because networks are sequences of instructions","A monitor, because a screen determines solution steps","A password, because passwords are procedures for every task"],correct:0},
{question:"Two computers exchange information and share data through connected infrastructure. Which lesson concept directly accounts for this ability?",options:["A computer network, because networks allow devices to communicate and share data","Code, because code itself is the physical connection","An algorithm, because every algorithm is automatically a network","A display, because displays transmit all computer data"],correct:0},
{question:"Which statement most closely matches the lesson's description of AI systems?",options:["They can analyze information and generate outputs based on their design and training","They generate any output without depending on design or training","They are simply physical networks connecting computers","They are algorithms that never analyze information"],correct:0}]],
["🏛️","History","Evidence, causes and historical change.","Historians use evidence such as documents, artifacts and buildings to understand the past. Civilizations can change through causes including technology, trade, conflict, migration and changes in government. Historical explanations should be based on evidence rather than guesses alone.",[
{question:"A historian finds an old building and a written record that appear to describe the same period. What lesson-based approach is strongest?",options:["Use the building and document as evidence when constructing an explanation of the past","Ignore both because historical explanations should rely on guesses","Use only a future prediction because past evidence cannot be useful","Treat the building as proof of every event that ever happened"],correct:0},
{question:"A civilization changes after new trading relationships develop. Which lesson idea provides a plausible explanation?",options:["Trade is one of the causes of historical change named in the lesson","Trade cannot affect civilizations because only weather causes change","The change happened because stars became planets","Historical change can occur only when a government disappears"],correct:0},
{question:"Why does the lesson emphasize evidence rather than guesses alone?",options:["Evidence gives historians a basis for constructing explanations about the past","Guesses are more reliable than documents and artifacts","Evidence prevents historians from considering any possible cause","Historical explanations do not require support from anything observable"],correct:0}]]
];
const BADGES=[
["🌱","First Steps","Start your Teachly journey.","first"],["📚","Curious Mind","Open your first lesson.","lesson"],["🧠","Mindcheck","Complete a successful quiz.","quiz"],["🌍","World Explorer","Explore the real world map.","world"],["🎟️","Ticket Collector","Earn tickets from learning.","tickets"],["🤝","Connector","Complete your first real-user session.","connect"],["🔭","Mystery Explorer","Discover random topics.","mystery"],["🧩","Quiz Master","Complete three successful Mindchecks.","quiz3"],["⭐","Bright Mind","Complete lessons in three subjects.","subjects3"],["🏆","Teachly Scholar","Complete five lessons.","lessons5"],["🚀","Momentum","Complete ten learning actions.","actions10"],["💡","Open Mind","Talk to the AI Teacher.","ai"]
];

let currentUser=null, pendingUsername="";
function getAccounts(){return JSON.parse(localStorage.getItem("teachlyAccounts")||"{}")}
function setAccounts(a){localStorage.setItem("teachlyAccounts",JSON.stringify(a))}
function go(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
const el=document.getElementById(id); if(el)el.classList.add("active");
window.scrollTo(0,0); updateWallets();
if(id==="lessonsPage")renderLessons();
if(id==="peoplePage")renderPeople();
if(id==="mapPage")renderMap();
if(id==="badgesPage")renderBadges();
if(id==="shopPage")renderShop();
if(id==="profilePage")renderProfile();
}
function checkUsername(){
const input=document.getElementById("username"),msg=document.getElementById("usernameMsg");
const u=input.value.trim();
if(u.length<3){msg.textContent="Username must be at least 3 characters.";msg.className="message";return}
const accounts=getAccounts();
if(accounts[u]){
document.getElementById("signInUsername").value=u;document.getElementById("signInPassword").value="";document.getElementById("signInMsg").textContent="Username found. Sign in to continue with your saved progress.";document.getElementById("signInMsg").className="message success";go("signInPage");return}
pendingUsername=u;msg.textContent="Username available ✓";msg.className="message success";setTimeout(()=>go("passwordPage"),350);
}
function signIn(){const u=document.getElementById("signInUsername").value.trim(),pass=document.getElementById("signInPassword").value,msg=document.getElementById("signInMsg"),accounts=getAccounts();if(!accounts[u]){msg.textContent="No account exists with that username.";msg.className="message";return}if(accounts[u].password!==pass){msg.textContent="Incorrect password. Access blocked.";msg.className="message";return}currentUser={...accounts[u]};document.getElementById("signInPassword").value="";document.getElementById("welcomeText").textContent="Welcome, "+currentUser.username+"!";go("homePage");}

function finishAuth(){
const pass=document.getElementById("password").value,role=document.getElementById("role").value,msg=document.getElementById("passwordMsg");
if(pass.length<4){msg.textContent="Password must be at least 4 characters.";return}
const accounts=getAccounts();
if(accounts[pendingUsername]){
if(accounts[pendingUsername].password!==pass){msg.textContent="Incorrect password for this username.";return}
currentUser={...accounts[pendingUsername]};
}else{
currentUser={username:pendingUsername,password:pass,role,coins:0,avatar:"",lessons:0,badges:[],items:{},quizWins:0};
accounts[pendingUsername]=currentUser;setAccounts(accounts);
}
document.getElementById("password").value="";
go("homePage");document.getElementById("welcomeText").textContent="Welcome, "+currentUser.username+"!";
}
function updateWallets(){document.querySelectorAll("[id^=wallet]").forEach(e=>e.textContent="🎟️ "+(currentUser?.coins??0))}
function shuffleQuiz(q){const order=q.options.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}return {question:q.question,options:order.map(i=>q.options[i]),correct:order.indexOf(q.correct)};}
function showLesson(x,q){
  window.currentQuizLesson=x;
  window.currentQuizQuestion=q;
  window.currentQuizAnswered=false;
  renderQuizQuestion();
}
function renderQuizQuestion(){
  const x=window.currentQuizLesson,q=window.currentQuizQuestion;
  if(!x||!q)return;
  const options=[...q.options].map((text,i)=>({text,correct:i===q.correct})).sort(()=>Math.random()-0.5);
  window.currentQuizOptions=options;
  document.getElementById("lessonGrid").innerHTML=`<div class="panel" style="grid-column:1/-1"><div class="icon">${x[0]}</div><h2>${x[1]}</h2><p>${x[2]}</p><h3>📖 Lesson</h3><p>${x[3]}</p><h3>🧠 Mindcheck</h3><p>${q.question}</p><div id="quizOptions" class="grid">${options.map((a,i)=>`<button class="secondary" onclick="answerQuiz(${i})">${escapeHtml(a.text)}</button>`).join("")}</div><p id="quizFeedback" class="message"></p><p class="small">🎟️ Tickets are awarded only for a correct answer.</p></div>`;
}
function nextQuizQuestion(){
  const x=window.currentQuizLesson;
  if(!x)return;
  const pool=x[4].filter(q=>q!==window.currentQuizQuestion);
  window.currentQuizQuestion=(pool.length?pool:x[4])[Math.floor(Math.random()*(pool.length?pool:x[4]).length)];
  window.currentQuizAnswered=false;
  setTimeout(renderQuizQuestion,450);
}
function answerQuiz(choice){
  if(window.currentQuizAnswered)return;
  const options=window.currentQuizOptions||[],selected=options[choice];
  if(!selected)return;
  const feedback=document.getElementById("quizFeedback");
  window.currentQuizAnswered=true;
  if(!selected.correct){
    feedback.textContent="❌ Wrong answer. Moving to the next question...";
    feedback.className="message";
        document.querySelectorAll("#quizOptions button").forEach(b=>b.disabled=true);
    nextQuizQuestion();
    return;
  }
  if(!currentUser)return;
  const it=currentUser.items||{};
  let reward=5+(it.quick?2:0)+(it.quizMaster?5:0);
  currentUser.coins=(currentUser.coins||0)+reward;
  currentUser.quizWins=(currentUser.quizWins||0)+1;
  currentUser.lessons=(currentUser.lessons||0)+1;
  awardBadge("lesson");awardBadge("quiz");awardBadge("tickets");
  if(currentUser.lessons>=5)awardBadge("lessons5");
  if(currentUser.quizWins>=3)awardBadge("quiz3");
  if(currentUser.lessons>=3)awardBadge("subjects3");
  if(currentUser.quizWins>=10)awardBadge("actions10");
  saveUser();
  feedback.textContent="✅ Correct! +"+reward+" 🎟️ — next question coming up...";
  feedback.className="message success";
  document.querySelectorAll("#quizOptions button").forEach(b=>b.disabled=true);
  nextQuizQuestion();
}
function renderLessons(){document.getElementById("lessonGrid").innerHTML=LESSONS.map((x,i)=>`<div class="lesson"><div class="icon">${x[0]}</div><h3>${x[1]}</h3><p>${x[2]}</p><button class="primary" onclick="completeLesson(${i})">Open lesson</button></div>`).join("");}
function completeLesson(i){const x=LESSONS[i];const q=shuffleQuiz(x[4][Math.floor(Math.random()*x[4].length)]);showLesson(x,q);}
function renderMap(){
document.getElementById("continentButtons").innerHTML=Object.keys(CONTINENTS).map((c,i)=>`<button onclick="selectContinent('${c}')" id="btn-${i}">${CONTINENTS[c].emoji} ${c}</button>`).join("");
selectContinent("Asia");
}
function selectContinent(c){
document.querySelectorAll(".land").forEach(e=>e.classList.remove("selected"));
const id="land-"+c.toLowerCase().replaceAll(" ","");const land=document.getElementById(id);if(land)land.classList.add("selected");
document.querySelectorAll(".continents button").forEach(b=>b.classList.remove("active"));
[...document.querySelectorAll(".continents button")].find(b=>b.textContent.includes(c))?.classList.add("active");
document.getElementById("continentInfo").innerHTML=`<div class="eyebrow">${CONTINENTS[c].emoji} CONTINENT INFO</div><h2>${c}</h2><p>${CONTINENTS[c].info}</p>`;
if(currentUser){awardBadge("world");saveUser()}
}
function awardBadge(id){if(!currentUser)return;currentUser.badges=currentUser.badges||[];if(currentUser.badges.includes(id))return;currentUser.badges.push(id);const b=BADGES.find(x=>x[3]===id);if(b){const layer=document.getElementById("floatingBadges");for(let i=0;i<3;i++){const el=document.createElement("div");el.className="floatBadge";el.textContent=b[0];el.style.left=(10+Math.random()*80)+"%";el.style.animationDelay=(i*.22)+"s";layer.appendChild(el);setTimeout(()=>el.remove(),5600+i*250)}alert("🏅 Badge achieved: "+b[1]);}saveUser();}
function badgeEarned(id){return !!(currentUser?.badges||[]).includes(id)}
function renderBadges(){document.getElementById("badgeGrid").innerHTML=BADGES.map(b=>`<div class="badge"><div class="icon">${b[0]}</div><h3>${b[1]}</h3><p>${b[2]}</p><div class="small">${badgeEarned(b[3])?"✓ Earned":"○ Keep learning"}</div></div>`).join("");}
const SHOP_ITEMS=[
["✨","Glow Frame",100,"Adds a glowing frame to your profile.","frameGlow"],["👑","Royal Frame",180,"Adds a royal profile frame.","frameGold"],["🌊","Ocean Frame",140,"Adds an ocean profile frame.","frameCyan"],["🏷️","Scholar Nameplate",75,"Adds a Scholar nameplate to your profile.","scholar"],["⚡","Quick Learner",120,"Every successful Mindcheck gives +2 extra 🎟️.","quick"],["🧠","Quiz Master",220,"Every successful Mindcheck gives +5 extra 🎟️.","quizMaster"],["🎲","Mystery Boost",90,"Correct Mystery Topic answers give +3 extra 🎟️.","mysteryBoost"],["🔄","Mystery Reroll",65,"Lets you reroll the current Mystery Topic.","mysteryReroll"],["🤖","AI Spark",110,"Adds an AI-themed profile effect; it never creates currency.","aiSpark"],["🎨","Sunset Theme",80,"Changes the Teachly accent to a sunset theme.","themeSunset"],["🌊","Ocean Theme",80,"Changes the Teachly accent to an ocean theme.","themeOcean"],["🌿","Emerald Theme",80,"Changes the Teachly accent to an emerald theme.","themeEmerald"],["🌙","Midnight Theme",95,"Unlocks a darker midnight accent.","themeMidnight"],["🔥","Flame Nameplate",100,"Adds a fiery Teachly nameplate.","flamePlate"],["🪐","Cosmic Frame",200,"Adds a space-themed profile frame.","frameCosmic"],["🧊","Ice Frame",160,"Adds an icy profile frame.","frameIce"]
];
function renderShop(){const owned=currentUser?.items||{};document.getElementById("shopGrid").innerHTML=SHOP_ITEMS.map(x=>`<div class="shopitem ${owned[x[4]]?"owned":""}"><div class="icon">${x[0]}</div><h3>${x[1]}</h3><p>${x[3]}</p><strong>🎟️ ${x[2]}</strong><div class="shopAction">${owned[x[4]]?'<span class="ownedTag">✓ Owned</span>':'<button class="primary" onclick="buyItem(\''+x[4]+'\')">Buy</button>'}</div></div>`).join("");}
function buyItem(id){const item=SHOP_ITEMS.find(x=>x[4]===id);if(!item||!currentUser)return;if(currentUser.items?.[id]){alert("You already own this item.");return}if((currentUser.coins||0)<item[2]){alert("You need "+item[2]+" 🎟️.");return}currentUser.coins-=item[2];currentUser.items=currentUser.items||{};currentUser.items[id]=true;saveUser();applyCosmetics();renderShop();alert("Purchased "+item[1]+"! ✨");}
function applyCosmetics(){if(!currentUser)return;document.body.classList.remove("theme-sunset","theme-ocean","theme-emerald","theme-midnight");const it=currentUser.items||{};if(it.themeSunset)document.body.classList.add("theme-sunset");else if(it.themeOcean)document.body.classList.add("theme-ocean");else if(it.themeEmerald)document.body.classList.add("theme-emerald");else if(it.themeMidnight)document.body.classList.add("theme-midnight");const av=document.getElementById("avatar");if(av){av.classList.remove("profileFrame-glow","profileFrame-gold","profileFrame-cyan","profileFrame-cosmic","profileFrame-ice");if(it.frameGlow)av.classList.add("profileFrame-glow");if(it.frameGold)av.classList.add("profileFrame-gold");if(it.frameCyan)av.classList.add("profileFrame-cyan");if(it.frameCosmic)av.classList.add("profileFrame-cosmic");if(it.frameIce)av.classList.add("profileFrame-ice");}}
function activateShopEffects(){return;}
function renderProfile(){
document.getElementById("profileName").textContent=currentUser.username;document.getElementById("profilePlate").innerHTML=currentUser.items?.scholar?"<span class=\"nameplate\">🏅 Scholar</span>":"";
document.getElementById("profileRole").textContent=currentUser.role==="teacher"?"🧑‍🏫 Teacher":"🎓 Learner";
document.getElementById("avatar").src=currentUser.avatar||"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect width='110' height='110' rx='55' fill='%23151a40'/%3E%3Ctext x='55' y='68' text-anchor='middle' font-size='45' fill='white'%3E👤%3C/text%3E%3C/svg%3E";
}
function uploadAvatar(){
const file=document.getElementById("avatarInput").files[0],msg=document.getElementById("profileMsg");
if(!file){msg.textContent="Choose an image first.";return}
if((currentUser.coins||0)<50){msg.textContent="You need 50 🎟️ to upload a profile image.";return}
const reader=new FileReader();reader.onload=()=>{currentUser.coins-=50;currentUser.avatar=reader.result;saveUser();renderProfile();applyCosmetics();msg.textContent="Profile image uploaded for 50 🎟️.";msg.className="message success"};reader.readAsDataURL(file);
}
function saveUser(){if(!currentUser)return;const a=getAccounts();a[currentUser.username]=currentUser;setAccounts(a);updateWallets();applyCosmetics()}
async function askAI(){
const q=document.getElementById("aiInput").value.trim();if(!q)return;
const chat=document.getElementById("aiChat");chat.innerHTML+=`<div class="bubble me">${escapeHtml(q)}</div>`;document.getElementById("aiInput").value="";
let answer="I’m here. Talk to me about whatever you want — school, coding, games, ideas, stories, questions, or just something random.";
try{const response=await fetch("https://teachly-nmxh.onrender.com/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,username:currentUser?.username||"Student",lesson:null})});const data=await response.json();if(data&&data.answer)answer=String(data.answer).replace(/\bOpenAI\b/gi,"Teachly AI");}catch(e){const lower=q.toLowerCase();if(/^(hi|hello|hey|yo)\b/i.test(q))answer="Hey! 👋 What’s going on?";else if(/joke|funny/i.test(q))answer="Why did the computer get cold? Because it left its Windows open. 😄";else if(/thank|thanks/i.test(q))answer="Anytime! 😎";else if(/math|equation|algebra/i.test(q))answer="Sure — send me the exact problem and I’ll work through it with you.";else if(/photosynthesis/i.test(q))answer="Photosynthesis is how plants use light energy to make stored chemical energy from water and carbon dioxide, releasing oxygen.";}
chat.innerHTML+=`<div class="bubble">${escapeHtml(answer)}</div>`;chat.scrollTop=chat.scrollHeight;if(currentUser){awardBadge("ai");saveUser()}
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function connectWithAI(){
  go("aiTeacherPage");
}
async function openConnect(role){
  go("peoplePage");
  const aiBtn=document.getElementById("learnerAIButton"); if(aiBtn) aiBtn.style.display=role==="learner"?"block":"none";
  document.getElementById("peopleTitle").textContent=role==="learner"?"Find a Teacher":"Find a Learner";
  document.getElementById("peopleIntro").textContent=role==="learner"?"Searching now for real teachers who are looking for learners...":"Searching now for real learners who are looking for teachers...";
  document.getElementById("peopleGrid").innerHTML="<div class='person panel' style='grid-column:1/-1'><div class='icon'>🔎</div><h3>Searching now...</h3><p>Finding real Teachly users who match your request.</p></div>";
  document.getElementById("connectAction").innerHTML=role==="learner"
    ? `<div class="connectNotice" style="margin-bottom:16px"><h3>🤖 Connect with AI Teacher</h3><p>Prefer an AI Teacher? You can connect directly without waiting for a real teacher.</p><button class="primary" onclick="connectWithAI()">Connect with AI Teacher</button></div>`
    : "";
  try{
    const r=await fetch("https://teachly-nmxh.onrender.com/api/people",{cache:"no-store"});
    if(!r.ok)throw new Error("People request failed");
    const d=await r.json();
    const people=Array.isArray(d)?d:(Array.isArray(d.people)?d.people:Array.isArray(d.users)?d.users:[]);
    const wantedRole=role==="learner"?"teacher":"learner";
    const matches=people.filter(p=>{
      const uname=String(p.username??p.name??p.user?.username??"").trim();
      if(!uname||uname.toLowerCase()===String(currentUser?.username||"").toLowerCase())return false;
      const pr=String(p.role??p.userRole??p.user?.role??p.type??"").toLowerCase().trim();
      const lookingRaw=p.lookingFor??p.looking_for??p.seeking??p.wants??p.availabilityFor??p.availableFor??p.preference??p.preferences??"";
      const looking=Array.isArray(lookingRaw)?lookingRaw.join(" ").toLowerCase():String(lookingRaw).toLowerCase();
      const available=p.available!==false&&p.isAvailable!==false&&p.status!=="offline"&&p.online!==false;
      const roleMatches=pr===wantedRole||pr.includes(wantedRole);
      const seekingMatches=!looking||looking.includes(role)||looking.includes(wantedRole)||looking.includes(role==="learner"?"learn":"teach");
      return available&&roleMatches&&seekingMatches;
    });
    if(matches.length){
      document.getElementById("peopleIntro").textContent=role==="learner"?"Teachers who are looking for learners are available to connect.":"Learners who are looking for teachers are available to connect.";
      document.getElementById("peopleGrid").innerHTML=matches.map(p=>{
        const name=String(p.username??p.name??p.user?.username??"Teachly user");
        const looking=String(p.lookingFor??p.looking_for??p.seeking??p.wants??p.availabilityFor??p.availableFor??"Available to connect");
        return `<div class="person"><div class="icon">${role==="learner"?"🧑‍🏫":"🎓"}</div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(looking)}</p><button class="primary" onclick="startSession(${JSON.stringify(name)})">Connect</button></div>`;
      }).join("");
    }else showAIFallback(role);
  }catch(e){showAIFallback(role);}
}
function showAIFallback(role){
  document.getElementById("peopleGrid").innerHTML="";
  document.getElementById("peopleIntro").textContent="No matching real user is available right now.";
  if(role==="learner"){
    document.getElementById("connectAction").innerHTML=`<div class="connectNotice"><h3>No real teacher found</h3><p>We searched for a real Teachly teacher first. You can connect with the AI Teacher instead.</p><button class="primary" onclick="connectWithAI()">Connect with AI Teacher</button><button class="secondary" style="margin-top:10px" onclick="go('homePage')">No, go back</button></div>`;
  }else{
    document.getElementById("connectAction").innerHTML=`<div class="connectNotice"><h3>No learner available</h3><p>No real learner looking for a teacher is available right now.</p><button class="secondary" onclick="go('homePage')">Go back</button></div>`;
  }
}
function startSession(username){
  document.getElementById("connectAction").innerHTML=`<div class="connectNotice"><h3>Connected with ${escapeHtml(username||"a Teachly user")}</h3><p>Your connection is ready. Complete the session when you are finished.</p><button class="primary" onclick="finishSession()">Complete session</button></div>`;
}
function finishSession(){
  if(currentUser){awardBadge("connect");saveUser();}
  alert("Session complete! Your progress was saved.");
  go("homePage");
}
function randomTopic(){
  const x=LESSONS[Math.floor(Math.random()*LESSONS.length)];
  const q=x[4][Math.floor(Math.random()*x[4].length)];
  window.currentMystery={lesson:x,quiz:q,answered:false};
  document.getElementById("mysteryModal")?.remove();
  const options=[...q.options].map((text,i)=>({text,correct:i===q.correct})).sort(()=>Math.random()-0.5);
  window.currentMystery.options=options;
  const modal=document.createElement("div");modal.id="mysteryModal";modal.className="mysteryModal";
  modal.innerHTML=`<div class="mysteryCard"><div class="eyebrow">🎲 MYSTERY TOPIC</div><div class="icon">${x[0]}</div><h2>${x[1]}</h2><p>${x[3]}</p><h3>Mindcheck</h3><p>${q.question}</p><div id="mysteryOptions" class="grid">${options.map((o,i)=>`<button class="secondary" onclick="answerMystery(${i})">${escapeHtml(o.text)}</button>`).join("")}</div><p id="mysteryFeedback" class="message"></p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button class="secondary" onclick="document.getElementById('mysteryModal')?.remove()">Close</button>${currentUser?.items?.mysteryReroll?`<button class="secondary" onclick="randomTopic()">🔄 Reroll</button>`:""}</div></div>`;
  document.body.appendChild(modal);
  if(currentUser){awardBadge("mystery");saveUser();}
}
function answerMystery(choice){
  const m=window.currentMystery;if(!m||m.answered)return;
  const selected=m.options?.[choice],feedback=document.getElementById("mysteryFeedback");
  if(!selected)return;
  m.answered=true;
  document.querySelectorAll("#mysteryOptions button").forEach(b=>b.disabled=true);
  if(!selected.correct){
    feedback.textContent="❌ Wrong answer. Moving to another mystery question...";
    feedback.className="message";
    setTimeout(randomTopic,650);
    return;
  }
  if(currentUser){
    const it=currentUser.items||{};
    let reward=5+(it.quick?2:0)+(it.quizMaster?5:0)+(it.mysteryBoost?3:0);
    currentUser.coins=(currentUser.coins||0)+reward;
    currentUser.quizWins=(currentUser.quizWins||0)+1;
    awardBadge("quiz");awardBadge("tickets");saveUser();
    feedback.textContent="✅ Correct! +"+reward+" 🎟️ — next mystery coming up...";
    feedback.className="message success";
    setTimeout(randomTopic,650);
  }
}
window.addEventListener("load",()=>{go("welcomePage");applyCosmetics()});
