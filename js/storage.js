var G=["#6366f1,#312e81","#f59e0b,#b45309","#10b981,#065f46","#ec4899,#9d174d","#06b6d4,#155e75","#ef4444,#991b1b","#8b5cf6,#5b21b6","#84cc16,#3f6212","#f97316,#9a3412","#14b8a6,#115e59","#3b82f6,#1e3a8a","#a855f7,#6b21a8","#eab308,#854d0e","#64748b,#1e293b","#d946ef,#86198f"];

var INIT_C=[
 ["برمجة بايثون","🐍","تعلم البرمجة من الصفر بلغة بايثون السهلة."],
 ["تطوير الويب","🌐","HTML وCSS وJavaScript لبناء مواقعك."],
 ["تصميم الجرافيك","🎨","أساسيات التصميم وصناعة الهويات البصرية."],
 ["الذكاء الاصطناعي","🤖","مدخل مبسط لعالم AI والتعلم الآلي."],
 ["تحليل البيانات","📊","حلل البيانات واستخرج منها قرارات."],
 ["اللغة الإنجليزية","🗣️","محادثة وقواعد لمستوى أفضل كل يوم."],
 ["التسويق الرقمي","📣","إعلانات وسوشيال ميديا ونمو المبيعات."],
 ["الأمن السيبراني","🔐","احمِ نفسك وأنظمتك من الاختراق."],
 ["تطبيقات الموبايل","📱","ابنِ تطبيقات أندرويد وiOS."],
 ["المونتاج والفيديو","🎬","من التصوير للمونتاج وصناعة المحتوى."],
 ["الأعمال وريادتها","💼","ابدأ مشروعك وأدره بشكل صحيح."],
 ["الموسيقى","🎹","أساسيات النظرية والعزف الأول."],
 ["الرياضيات","🧮","اختصر الطريق لفهم الرياضيات بسهولة."],
 ["الشبكات","🛰️","أساسيات الشبكات والاتصالات."],
 ["التصوير الفوتوغرافي","📷","الإضاءة والتكوين واحتراف الكاميرا."]
];

var L=["مقدمة عن %","الأساسيات الأولى","التطبيق العملي","مفاهيم متقدمة","مشروع تطبيقي","المراجعة والاختبار"];
var ADMIN={u:"NoLimitsTeam",p:"NoLimits1"};

var $=function(i){return document.getElementById(i)};
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}

var mem={};
function get(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return mem[k]||d}}
function save(k,v){mem[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}

function courses(){
 var c=get('cc',null);
 if(!c){
  c=INIT_C.map(function(x,i){return {id:String(i),title:x[0],icon:x[1],desc:x[2],price:150+(i%5)*50,available:true,g:i%G.length}});
  save('cc',c);
 }
 return c;
}
function findCourse(id){return courses().find(function(x){return x.id===String(id)})}
function users(){return get('cu',{})}
function prog(){return get('cp',{})}
function txns(){return get('cy',{})}