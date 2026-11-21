function sess(){
 var s=get('cs',null);
 if(s&&s.role=='admin')return s;
 if(s&&s.role=='student'&&users()[s.email])return s;
 return null;
}
function me(){var s=sess();return s&&s.role=='student'?s.email:null}
function myp(id){var p=prog(),e=me();return e&&p[e]&&p[e][id]?p[e][id]:null}
function myTx(id){var y=txns(),e=me();return e&&y[e]&&y[e][id]?y[e][id]:null}

var mode='in';
function auth(){
 $('app').innerHTML='<div class="auth"><button class="g" onclick="location.hash=\'\'">→ رجوع</button><h2>دخول الطالب</h2><div class="tabs"><button class="'+(mode=='in'?'':'g')+'" onclick="mode=\'in\';auth()">دخول</button><button class="'+(mode=='up'?'':'g')+'" onclick="mode=\'up\';auth()">حساب جديد</button></div>'+(mode=='up'?'<input id="n" placeholder="الاسم">':'')+'<input id="e" type="email" placeholder="البريد الإلكتروني">'+pw('p','كلمة السر (6 أحرف على الأقل)')+'<div class="err" id="er"></div><button style="width:100%" onclick="go()">'+(mode=='in'?'دخول':'إنشاء حساب')+'</button></div>';
}

function go(){
 var e=$('e').value.trim().toLowerCase(),p=$('p').value,u=users(),er=$('er');
 if(!/^\S+@\S+\.\S+$/.test(e)){er.textContent='اكتب بريد إلكتروني صحيح';return}
 if(p.length<6){er.textContent='كلمة السر لازم 6 أحرف على الأقل';return}
 var h=enc(p);
 if(mode=='up'){
  var n=$('n').value.trim();if(!n){er.textContent='اكتب اسمك';return}
  if(u[e]){er.textContent='البريد ده مسجل قبل كده، سجّل دخول';return}
  u[e]={name:n,pw:h};save('cu',u);
 }else if(!u[e]||u[e].pw!==h){er.textContent='البريد أو كلمة السر غلط';return}
 save('cs',{role:'student',email:e});location.hash='courses';route();
}

function adminLogin(){
 $('app').innerHTML='<div class="auth"><button class="g" onclick="location.hash=\'\'">→ رجوع</button><h2>دخول الأدمن 🛠️</h2><input id="au" placeholder="اسم المستخدم" autocomplete="off">'+pw('ap','كلمة السر')+'<div class="err" id="er"></div><button style="width:100%" onclick="adminGo()">دخول</button></div>';
}

function adminGo(){
 if($('au').value.trim()===ADMIN.u&&$('ap').value===adminPw()){save('cs',{role:'admin'});location.hash='admin';route()}
 else $('er').textContent='اسم المستخدم أو كلمة السر غلط';
}

function out(){save('cs',null);location.hash='';route()}

function head(){
 var s=sess();
 $('hu').innerHTML=!s?'':'<span>'+(s.role=='admin'?'🛠️ أدمن':'👤 '+esc(users()[s.email].name))+'</span><button class="g" onclick="pwModal()" title="تغيير كلمة السر">🔑</button><button class="g" onclick="out()">خروج</button>';
}

function pw(id,ph){return '<div class="pw"><input id="'+id+'" type="password" placeholder="'+ph+'"><button type="button" onclick="eye(\''+id+'\',this)" title="إظهار/إخفاء">👁️</button></div>'}
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