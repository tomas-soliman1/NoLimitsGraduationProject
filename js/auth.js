function sess(){
 var s=get('cs',null);
 if(s&&s.role=='admin')return s;
 if(s&&s.role=='student'&&users()[s.email])return s;
 return null;
}
function me(){var s=sess();return s&&s.role=='student'?s.email:null}
function myp(id){var p=prog(),e=me();return e&&p[e]&&p[e][id]?p[e][id]:null}
function myTx(id){var y=txns(),e=me();return e&&y[e]&&y[e][id]?y[e][id]:null}

var mode='in',loginMsg='',redirect=null;

/* كارد دخول/تسجيل الطالب — بيظهر في نص الصفحة الرئيسية */
function authCard(){
 var up=mode=='up';
 return '<div class="auth" onkeydown="if(event.key===\'Enter\')go()"><h2>دخول الطالب</h2>'+
  '<p class="mu" style="margin:0 0 6px;font-size:.9rem">سجّل دخولك علشان تشترك في الكورسات وتتابع تقدّمك.</p>'+
  (loginMsg?'<div class="msg show in" role="status">'+esc(loginMsg)+'</div>':'')+
  '<div class="tabs"><button class="'+(up?'g':'')+'" onclick="mode=\'in\';renderAuth()">دخول</button><button class="'+(up?'':'g')+'" onclick="mode=\'up\';renderAuth()">حساب جديد</button></div>'+
  (up?'<input id="n" placeholder="الاسم" autocomplete="name">':'')+
  '<input id="e" type="email" placeholder="البريد الإلكتروني" autocomplete="email">'+
  (up?'<div class="r2"><input id="ag" type="text" inputmode="numeric" maxlength="3" placeholder="السن" style="width:34%" autocomplete="off"><input id="ph" type="tel" inputmode="numeric" dir="ltr" class="ltr" placeholder="رقم التليفون 01xxxxxxxxx" maxlength="16" autocomplete="tel"></div>':'')+
  pw('p','كلمة السر (6 أحرف على الأقل)')+
  '<div class="err" id="er" role="alert"></div>'+
  '<button style="width:100%" onclick="go()">'+(up?'إنشاء حساب':'دخول')+'</button></div>';
}
/* صفحة الدخول (بتتفتح من زرار الـ nav) */
function authPage(){view='auth';$('app').innerHTML='<div id="authbox">'+authCard()+'</div>'}
function renderAuth(){var b=$('authbox');if(b)b.innerHTML=authCard()}

function go(){
 var er=$('er'),u=users(),e=$('e').value.trim().toLowerCase(),p=$('p').value,n='',age=0,ph='';
 if(mode=='up'){
  n=$('n').value.trim();
  if(!n){er.textContent='اكتب اسمك';return}
  if(!okName(n)){er.textContent=NAME_ERR;return}
 }
 if(!/^\S+@\S+\.\S+$/.test(e)){er.textContent='اكتب بريد إلكتروني صحيح';return}
 if(mode=='up'){
  if(!okAge($('ag').value)){er.textContent='اكتب سنّك صح (من '+AGE_MIN+' لـ '+AGE_MAX+' سنة)';return}
  ph=normPhone($('ph').value);
  if(!okPhone(ph)){er.textContent='اكتب رقم تليفون مصري صحيح (11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015)';return}
  age=+toEn($('ag').value).trim();
 }
 if(p.length<6){er.textContent='كلمة السر لازم 6 أحرف على الأقل';return}
 var h=enc(p);
 if(mode=='up'){
  if(u[e]){er.textContent='البريد ده مسجل قبل كده، سجّل دخول';return}
  u[e]={name:n,pw:h,age:age,phone:ph};save('cu',u);
 }else if(!u[e]||u[e].pw!==h){er.textContent='البريد أو كلمة السر غلط';return}
 save('cs',{role:'student',email:e});
 var to=redirect||'courses';redirect=null;loginMsg='';
 location.hash=to;route(true);
}

function adminLogin(){
 view='adminlogin';
 $('app').innerHTML='<div class="auth" onkeydown="if(event.key===\'Enter\')adminGo()"><button class="g" onclick="location.hash=\'\'">→ رجوع</button><h2>دخول الأدمن 🛠️</h2><input id="au" placeholder="اسم المستخدم" autocomplete="off">'+pw('ap','كلمة السر')+'<div class="err" id="er" role="alert"></div><button style="width:100%" onclick="adminGo()">دخول</button></div>';
}

function adminGo(){
 if($('au').value.trim()===ADMIN.u&&$('ap').value===adminPw()){save('cs',{role:'admin'});location.hash='admin';route(true)}
 else $('er').textContent='اسم المستخدم أو كلمة السر غلط';
}

function out(){save('cs',null);location.hash='';route(true)}

/* ربط الطالب بصفحة الدخول برسالة صغيرة، وبعدها يرجع للكورس */
function needLogin(id){
 redirect=id?'course-'+id:null;
 loginMsg=id?'سجّل دخولك الأول علشان تشترك وتبدأ الكورس.':'سجّل دخولك الأول علشان تكمل.';
 location.hash='student';
}

/* الهيدر: روابط التنقل + منطقة المستخدم */
function head(){
 var s=sess(),h=location.hash.slice(1),adm=s&&s.role=='admin';
 var cur=/^(courses|course-.+)$/.test(h)?'courses':(h=='about'?'about':(h==''||h=='home'?'home':''));
 function lk(x,t,hr){return '<a href="#'+hr+'"'+(cur==x?' class="on"':'')+'>'+t+'</a>'}
 $('nv').innerHTML=adm?'':lk('home','الرئيسية','')+lk('courses','الكورسات','courses')+lk('about','من نحن','about');
 $('nv').classList.remove('open');
 $('bg').hidden=!!adm;
 $('hu').innerHTML=!s?'<a class="bt sm" href="#student">دخول / حساب جديد</a>':'<span>'+(s.role=='admin'?'🛠️ أدمن':'👤 '+esc(users()[s.email].name))+'</span><button class="g" onclick="pwModal()" title="تغيير كلمة السر" aria-label="تغيير كلمة السر">🔑</button><button class="g" onclick="out()">تسجيل خروج</button>';
}
function toggleNav(){$('nv').classList.toggle('open')}

function pw(id,ph){return '<div class="pw"><input id="'+id+'" type="password" placeholder="'+ph+'"><button type="button" onclick="eye(\''+id+'\',this)" title="إظهار/إخفاء" aria-label="إظهار/إخفاء كلمة السر">👁️</button></div>'}
function eye(id,b){var x=$(id);x.type=x.type=='password'?'text':'password';b.textContent=x.type=='password'?'👁️':'🙈'}
function enc(p){return btoa(unescape(encodeURIComponent(p)))}
function adminPw(){return get('ca',ADMIN.p)}

function pwModal(){
 var m=document.createElement('div');m.className='mo';m.id='mo';
 m.innerHTML='<div class="md"><h3>🔑 تغيير كلمة السر</h3>'+pw('pc','كلمة السر الحالية')+pw('pn','الجديدة (6 أحرف على الأقل)')+pw('pf','أعد كتابة الجديدة')+'<div class="err" id="pe"></div><button style="width:100%" onclick="doChange()">حفظ</button><button class="g" style="width:100%;margin-top:8px" onclick="closePay()">إلغاء</button></div>';
 document.body.appendChild(m);
}

function doChange(){
 var s=sess(),cur=$('pc').value,n=$('pn').value,er=$('pe'),u=users();
 var ok=s.role=='admin'?cur===adminPw():u[s.email].pw===enc(cur);
 if(!ok){er.textContent='كلمة السر الحالية غلط';return}
 if(n.length<6){er.textContent='الجديدة لازم 6 أحرف على الأقل';return}
 if(n!==$('pf').value){er.textContent='كلمتين السر مش متطابقتين';return}
 if(s.role=='admin')save('ca',n);else{u[s.email].pw=enc(n);save('cu',u)}
 $('mo').firstChild.innerHTML='<div style="text-align:center"><div style="font-size:3rem">✅</div><h3>تم تغيير كلمة السر</h3><button onclick="closePay()">تمام</button></div>';
}
