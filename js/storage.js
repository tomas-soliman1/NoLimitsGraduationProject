var G=["#6366f1,#312e81","#f59e0b,#b45309","#10b981,#065f46","#ec4899,#9d174d","#06b6d4,#155e75","#ef4444,#991b1b","#8b5cf6,#5b21b6","#84cc16,#3f6212","#f97316,#9a3412","#14b8a6,#115e59","#3b82f6,#1e3a8a","#a855f7,#6b21a8","#eab308,#854d0e","#64748b,#1e293b","#d946ef,#86198f"];

/* [الاسم, الأيقونة, الوصف, أقل سن, أكبر سن, مميز؟] */
var INIT_C=[
 ["برمجة بايثون","🐍","تعلم البرمجة من الصفر بلغة بايثون السهلة.",10,17,true],
 ["تطوير الويب","🌐","HTML وCSS وJavaScript لبناء مواقعك.",13,25,true],
 ["تصميم الجرافيك","🎨","أساسيات التصميم وصناعة الهويات البصرية.",8,14,false],
 ["الذكاء الاصطناعي","🤖","مدخل مبسط لعالم AI والتعلم الآلي.",15,30,true],
 ["تحليل البيانات","📊","حلل البيانات واستخرج منها قرارات.",18,45,false],
 ["اللغة الإنجليزية","🗣️","محادثة وقواعد لمستوى أفضل كل يوم.",8,12,true],
 ["التسويق الرقمي","📣","إعلانات وسوشيال ميديا ونمو المبيعات.",18,40,false],
 ["الأمن السيبراني","🔐","احمِ نفسك وأنظمتك من الاختراق.",16,30,false],
 ["تطبيقات الموبايل","📱","ابنِ تطبيقات أندرويد وiOS.",14,25,false],
 ["المونتاج والفيديو","🎬","من التصوير للمونتاج وصناعة المحتوى.",12,20,false],
 ["الأعمال وريادتها","💼","ابدأ مشروعك وأدره بشكل صحيح.",18,50,false],
 ["الموسيقى","🎹","أساسيات النظرية والعزف الأول.",6,10,false],
 ["الرياضيات","🧮","اختصر الطريق لفهم الرياضيات بسهولة.",10,15,false],
 ["الشبكات","🛰️","أساسيات الشبكات والاتصالات.",17,35,false],
 ["التصوير الفوتوغرافي","📷","الإضاءة والتكوين واحتراف الكاميرا.",12,40,false]
];

var L=["مقدمة عن %","الأساسيات الأولى","التطبيق العملي","مفاهيم متقدمة","مشروع تطبيقي","المراجعة والاختبار"];
var ADMIN={u:"NoLimitsTeam",p:"NoLimits1"};
var AGE_MIN=6,AGE_MAX=80;

/* حالة عامة بين الملفات */
var view='',tmr=null;

var $=function(i){return document.getElementById(i)};
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
/* ترميز آمن لاستخدام النصوص (زي الإيميل) جوه onclick */
function q(s){return encodeURIComponent(s).replace(/'/g,'%27')}
function dec(s){return decodeURIComponent(s)}

/* رسالة صغيرة داخل الكارد (بدل alert). k: in | ok | wn | er — ms: اختفاء تلقائي */
var sayT={};
function say(id,t,k,ms){
 var e=$(id);if(!e)return;
 clearTimeout(sayT[id]);
 e.className='msg show '+(k||'in');e.textContent=t;
 if(ms)sayT[id]=setTimeout(function(){var x=$(id);if(x)x.className='msg'},ms);
}

/* أرقام عربية -> إنجليزية */
function toEn(s){return String(s==null?'':s).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632}).replace(/[۰-۹]/g,function(d){return d.charCodeAt(0)-1776})}
/* رقم تليفون مصري: يقبل 010.. أو +2010.. أو 002010.. */
function normPhone(s){
 var p=toEn(s).replace(/[\s\-().]/g,'');
 var m=/^(?:\+20|0020|20)0?(1[0125]\d{8})$/.exec(p);
 return m?'0'+m[1]:p;
}
function okPhone(p){return /^01[0125]\d{8}$/.test(p)}
function okAge(s){s=toEn(s).trim();return /^\d{1,3}$/.test(s)&&+s>=AGE_MIN&&+s<=AGE_MAX}
/* الاسم لازم يبدأ بحرف (عربي أو إنجليزي) ومفيهوش أرقام */
function okName(n){n=n.trim();return n.length>=2&&/^\p{L}[\p{L}\p{M}\s.'\-]*$/u.test(n)}
var NAME_ERR='الاسم لازم يبدأ بحروف ومينفعش يحتوي على أرقام';
function ageLabel(c){return c.minAge<=AGE_MIN&&c.maxAge>=AGE_MAX?'كل الأعمار':'من '+c.minAge+' لـ '+c.maxAge+' سنة'}

var mem={};
function get(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return mem[k]||d}}
function save(k,v){mem[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}

function courses(){
 var c=get('cc',null),ch=false;
 if(!c){
  c=INIT_C.map(function(x,i){return {id:String(i),title:x[0],icon:x[1],desc:x[2],minAge:x[3],maxAge:x[4],featured:x[5],price:150+(i%5)*50,available:true,g:i%G.length}});
  ch=true;save('cv',2);
 }else{
  /* ترقية بيانات قديمة محفوظة قبل إضافة السن والمميز */
  c.forEach(function(x,i){
   if(x.minAge===undefined){x.minAge=10;x.maxAge=60;ch=true}
   if(x.featured===undefined){x.featured=i<4;ch=true}
  });
  /* تحديث مرة واحدة: الكورسات الأصلية اللي لسه على السن القديم (10–60) تاخد الأعمار الجديدة */
  if(get('cv',0)<2){
   c.forEach(function(x){var o=INIT_C[+x.id];if(o&&x.id===String(+x.id)&&x.minAge===10&&x.maxAge===60&&x.title===o[0]){x.minAge=o[3];x.maxAge=o[4];ch=true}});
   save('cv',2);
  }
 }
 if(ch)save('cc',c);
 return c;
}
function findCourse(id){return courses().find(function(x){return x.id===String(id)})}
function users(){return get('cu',{})}
function prog(){return get('cp',{})}
function txns(){return get('cy',{})}
