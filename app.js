// محتوى تجريبي لليوم الأول. سنضيف الأيام 2 إلى 100 في المراحل التالية.
const lessons = {
  1: [
    {en:"Apple",pron:"آبُل",ar:"تفاحة",sentence:"I eat an apple every morning.",translation:"أنا آكل تفاحة كل صباح.",options:["تفاحة","منزل","ماء","كتاب"],correct:"تفاحة"},
    {en:"House",pron:"هاوس",ar:"منزل",sentence:"This is my house.",translation:"هذا منزلي.",options:["صديق","منزل","طعام","شارع"],correct:"منزل"},
    {en:"Water",pron:"ووتر",ar:"ماء",sentence:"I drink water every day.",translation:"أشرب الماء كل يوم.",options:["قهوة","حليب","ماء","عصير"],correct:"ماء"},
    {en:"Book",pron:"بُك",ar:"كتاب",sentence:"I read a book.",translation:"أنا أقرأ كتاباً.",options:["قلم","كتاب","باب","كرسي"],correct:"كتاب"},
    {en:"Friend",pron:"فريند",ar:"صديق",sentence:"He is my best friend.",translation:"هو أفضل صديق لي.",options:["أخ","جار","صديق","أستاذ"],correct:"صديق"}
  ]
};
const saved = JSON.parse(localStorage.getItem("english100Progress") || '{"done":[],"dayDone":[]}');
let qIndex=0, answered=false;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("english100Progress",JSON.stringify(saved));updateProgress()}
function updateProgress(){const count=saved.done.length; $("learnedCount").textContent=count;$("percent").textContent=Math.round(count/500*100)+"%";$("progressFill").style.width=(count/500*100)+"%";$("dayCount").textContent="1 / 100"}
function renderWords(){ $("wordList").innerHTML=lessons[1].map((w,i)=>{const done=saved.done.includes(w.en);return `<article class="word-card"><div class="word-top"><div class="english">${w.en}</div><div class="pron">${w.pron}</div></div><div class="meaning">${w.ar}</div><div class="example"><div class="sentence">${w.sentence}</div><div class="translation">${w.translation}</div></div><div class="word-actions"><button class="listen" data-say="${w.en}">🔊 استمع للنطق</button><button class="mark ${done?'done':''}" data-word="${w.en}">${done?'✓ تم الحفظ':'علّمتها كمحفوظة'}</button></div></article>`}).join("")}
function renderQuestion(){const w=lessons[1][qIndex];answered=false;$("question").textContent=`ما معنى كلمة ${w.en}؟`;$("answers").innerHTML=w.options.map(o=>`<button class="answer">${o}</button>`).join("");$("feedback").textContent="";$("nextQuestion").disabled=true;[...$("answers").children].forEach(btn=>btn.addEventListener("click",()=>{if(answered)return;answered=true;const ok=btn.textContent===w.correct;btn.classList.add(ok?"correct":"wrong");$("feedback").textContent=ok?"إجابة صحيحة، أحسنت! 🎉":`الإجابة الصحيحة هي: ${w.correct}`;[...$("answers").children].forEach(b=>{b.disabled=true;if(b.textContent===w.correct)b.classList.add("correct")});$("nextQuestion").disabled=false}))}
document.addEventListener("click",e=>{const say=e.target.closest("[data-say]");if(say&&"speechSynthesis"in window){const u=new SpeechSynthesisUtterance(say.dataset.say);u.lang="en-US";speechSynthesis.speak(u)}const mark=e.target.closest("[data-word]");if(mark){const word=mark.dataset.word;const i=saved.done.indexOf(word);if(i>=0)saved.done.splice(i,1);else saved.done.push(word);save();renderWords()}});
$("nextQuestion").addEventListener("click",()=>{qIndex=(qIndex+1)%lessons[1].length;renderQuestion()});
$("completeDay").addEventListener("click",()=>{const all=lessons[1].every(w=>saved.done.includes(w.en));$("completeMessage").textContent=all?"ممتاز! أكملت كلمات اليوم الأول. سنفتح اليوم التالي عند إضافة محتواه.":"علّم الكلمات الخمس كمحفوظة أولاً، ثم أعد المحاولة."});
renderWords();renderQuestion();updateProgress();
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
