var cfm=null,openC={},sqv='';

/* تأكيد داخل الكارد نفسه (بدل confirm) */
function ask(t,id){cfm={t:t,id:id};if(t=='s')renderStudents();else admin()}
function noAsk(){var o=cfm;cfm=null;if(o&&o.t=='s')renderStudents();else admin()}
function cfmBox(text,yes,label){
 return '<div class="msg show wn" role="alert"><div>'+text+'</div><div class="act" style="margin-top:6px"><button class="sm dg" onclick="'+yes+'">'+label+'</button><button class="sm g" onclick="noAsk()">إلغاء</button></div></div>';
}
function tg(el){openC[el.dataset.id]=el.open}

function admin(){
 view='admin';
 var cs=courses(),u=users(),p=prog(),y=txns(),em=Object.keys(u),enr=0,rev=0,fin=0,pendingList=[];
 em.forEach(function(e){
  Object.keys(p[e]||{}).forEach(function(id){
   if(findCourse(id)){enr++;if(p[e][id].length==L.length)fin++}
  });
  Object.keys(y[e]||{}).forEach(function(id){
   var t=y[e][id],c=findCourse(id);
   if(c){
    if(t.status==='paid')rev+=t.amount;
    else if(t.status==='pending')pendingList.push({email:e,name:u[e].name,courseId:id,courseTitle:c.title,tx:t});
   }
  });
 });
 function st(ic,t,v){return '<div class="st">'+ic+'<b>'+v+'</b><span class="mu">'+t+'</span></div>'}
 var h='<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><h2>🛠️ لوحة الأدمن</h2><button onclick="courseModal()">+ إضافة كورس جديد</button></div>';
 h+='<div class="stats">'+st('👥','الطلاب المسجلين',em.length)+st('📚','إجمالي الكورسات',cs.length)+st('📝','الاشتراكات النشطة',enr)+st('💰','الإيرادات المؤكدة (ج.م)',rev)+st('⏳','طلبات دفع معلقة',pendingList.length)+'</div>';

 if(pendingList.length){
  h+='<div class="box" style="border-color:var(--wn);margin-bottom:20px"><h3 style="margin-top:0;color:var(--wn)">⏳ طلبات دفع بانتظار المراجعة والتفعيل ('+pendingList.length+')</h3><div class="tw"><table><tr><th>الطالب</th><th>الكورس</th><th>الطريقة</th><th>التفاصيل / الإيصال</th><th>الإجراء</th></tr>';
  pendingList.forEach(function(item){
   var eq=q(item.email),key=eq+'|'+item.courseId;
   var proofHtml=item.tx.receipt?'<button class="sm g" onclick="viewReceiptImg(\''+eq+'\',\''+item.courseId+'\')">🖼️ عرض الإيصال</button>':'<span class="mu">كود مرجعي: '+esc(item.tx.ref||'—')+'</span>';
   h+='<tr><td><b>'+esc(item.name)+'</b><br><small class="mu" dir="ltr">'+esc(item.email)+'</small></td><td>'+esc(item.courseTitle)+'<br><b>'+item.tx.amount+' ج.م</b></td><td>'+esc(item.tx.method)+'</td><td>'+proofHtml+'</td><td><div class="act"><button class="sm ok" onclick="approveTx(\''+eq+'\',\''+item.courseId+'\')">تفعيل ✓</button><button class="sm dg" onclick="ask(\'tx\',\''+key+'\')">رفض ✕</button></div></td></tr>';
   if(cfm&&cfm.t=='tx'&&cfm.id==key)h+='<tr><td colspan="5">'+cfmBox('رفض طلب الدفع ده؟ هيتشال الطلب من القائمة.','rejectTx(\''+eq+'\',\''+item.courseId+'\')','أيوه، ارفض')+'</td></tr>';
  });
  h+='</table></div></div>';
 }

 /* ===== إدارة الطلاب ===== */
 h+='<h3>إدارة الطلاب ('+em.length+')</h3><div class="box"><input id="sq" type="search" placeholder="🔍 ابحث بالاسم أو الإيميل أو رقم التليفون" oninput="sqv=this.value;renderStudents()" aria-label="بحث في الطلاب" style="margin-top:0"><div class="msg" id="snote" role="status"></div><div id="stu"></div></div>';

 /* ===== إدارة الكورسات ===== */
 h+='<h3>إدارة الكورسات وطلابها</h3>';
 if(!cs.length)h+='<div class="box mu">لا توجد كورسات حالياً. اضغط على "إضافة كورس جديد".</div>';
 cs.forEach(function(c){
  var rows=em.filter(function(e){return p[e]&&p[e][c.id]}),sum=0;
  var t=rows.map(function(e){
   var d=p[e][c.id].length,pc=Math.round(d/L.length*100);sum+=pc;
   var method=(y[e]&&y[e][c.id])?y[e][c.id].method:'—';
   return '<tr><td>'+esc(u[e].name)+'</td><td dir="ltr">'+esc(e)+'</td><td>'+esc(method)+'</td><td>'+d+' من '+L.length+'</td><td><div class="bar"><i style="width:'+pc+'%"></i></div>'+pc+'%</td></tr>';
  }).join('');
  var asking=cfm&&cfm.t=='c'&&cfm.id==c.id;
  var statusTag=c.available?'<span class="tag av">Available</span>':'<span class="tag un">Unavailable</span>';
  var btns='<button class="sm '+(c.available?'g':'ok')+'" onclick="event.preventDefault();toggleCourse(\''+c.id+'\')">'+(c.available?'Set Unavailable':'Set Available')+'</button>'+
   '<button class="sm g" onclick="event.preventDefault();toggleFeat(\''+c.id+'\')">'+(c.featured?'⭐ مميز':'☆ تمييز')+'</button>'+
   '<button class="sm" onclick="event.preventDefault();courseModal(\''+c.id+'\')">تعديل</button>'+
   '<button class="sm dg" onclick="event.preventDefault();ask(\'c\',\''+c.id+'\')">حذف</button>';
  h+='<details class="box" data-id="'+c.id+'" ontoggle="tg(this)"'+(openC[c.id]||asking?' open':'')+'><summary><div><b>'+esc(c.icon)+' '+esc(c.title)+'</b> ('+c.price+' ج.م) — '+rows.length+' طالب'+(rows.length?' (متوسط التقدم '+Math.round(sum/rows.length)+'%)':'')+'</div><div class="act">'+statusTag+btns+'</div></summary>'+
   (asking?cfmBox('حذف كورس "'+esc(c.title)+'" نهائياً؟ هيتحذف معاه تقدّم الطلاب فيه.','delCourse(\''+c.id+'\')','أيوه، احذف'):'')+
   '<p class="mu" style="margin:8px 0 0">'+esc(c.desc)+'</p><p class="mu" style="margin:2px 0 0">🎂 '+ageLabel(c)+'</p>'+
   (rows.length?'<div class="tw"><table><tr><th>الطالب</th><th>البريد</th><th>طريقة الدفع</th><th>المحاضرات</th><th>التقدم</th></tr>'+t+'</table></div>':'<p class="mu">مفيش طلاب مسجلين لسه.</p>')+'</details>';
 });
 $('app').innerHTML=h;
 $('sq').value=sqv;
 renderStudents();
}

/* ===== الطلاب: عرض / تعديل / حذف ===== */
function renderStudents(){
 var box=$('stu');if(!box)return;
 var u=users(),p=prog(),em=Object.keys(u),s=toEn(sqv).trim().toLowerCase();
 var list=em.filter(function(e){var x=u[e];return !s||(x.name||'').toLowerCase().indexOf(s)>-1||e.indexOf(s)>-1||(x.phone||'').indexOf(s)>-1});
 if(!list.length){box.innerHTML='<p class="mu" style="margin:8px 0 0">'+(em.length?'مفيش طالب بيطابق البحث.':'لسه مفيش طلاب مسجلين.')+'</p>';return}
 var h='<div class="tw"><table><tr><th>الاسم</th><th>البريد</th><th>السن</th><th>التليفون</th><th>الكورسات</th><th>الإجراء</th></tr>';
 list.forEach(function(e){
  var x=u[e],eq=q(e),n=Object.keys(p[e]||{}).filter(function(id){return findCourse(id)}).length;
  h+='<tr><td><b>'+esc(x.name||'')+'</b></td><td dir="ltr">'+esc(e)+'</td><td>'+(x.age?esc(String(x.age)):'—')+'</td><td dir="ltr">'+(x.phone?esc(x.phone):'—')+'</td><td>'+n+'</td><td><div class="act"><button class="sm g" onclick="viewStu(\''+eq+'\')">عرض</button><button class="sm" onclick="editStu(\''+eq+'\')">تعديل</button><button class="sm dg" onclick="ask(\'s\',\''+eq+'\')">حذف</button></div></td></tr>';
  if(cfm&&cfm.t=='s'&&cfm.id==eq)h+='<tr><td colspan="6">'+cfmBox('حذف الطالب "'+esc(x.name||e)+'" نهائياً؟ هيتحذف معاه تقدّمه ومدفوعاته.','delStu(\''+eq+'\')','أيوه، احذف')+'</td></tr>';
 });
 box.innerHTML=h+'</table></div>';
}

function delStu(eq){
 var e=dec(eq),u=users(),p=prog(),y=txns();
 delete u[e];delete p[e];delete y[e];
 save('cu',u);save('cp',p);save('cy',y);
 cfm=null;admin();say('snote','تم حذف الطالب.','ok',3500);
}

function viewStu(eq){
 var e=dec(eq),u=users()[e];if(!u)return;
 var p=prog()[e]||{},y=txns()[e]||{},ids=Object.keys(p).concat(Object.keys(y).filter(function(id){return !p[id]}));
 var rows=ids.filter(findCourse).map(function(id){
  var c=findCourse(id),t=y[id],d=p[id]?p[id].length:0,st=p[id]?Math.round(d/L.length*100)+'%':'⏳ قيد المراجعة';
  return '<div><span>'+esc(c.icon)+' '+esc(c.title)+'</span><b>'+st+(t?' — '+esc(t.method):'')+'</b></div>';
 }).join('');
 var m=document.createElement('div');m.className='mo';m.id='mo';
 m.innerHTML='<div class="md w"><h3>👤 بيانات الطالب</h3><div class="receipt">'+
  '<div><span class="mu">الاسم:</span><b>'+esc(u.name||'')+'</b></div>'+
  '<div><span class="mu">البريد:</span><b dir="ltr">'+esc(e)+'</b></div>'+
  '<div><span class="mu">السن:</span><b>'+(u.age?esc(String(u.age)):'—')+'</b></div>'+
  '<div><span class="mu">التليفون:</span><b dir="ltr">'+(u.phone?esc(u.phone):'—')+'</b></div></div>'+
  '<h4 style="margin:12px 0 4px">الكورسات</h4>'+(rows?'<div class="receipt">'+rows+'</div>':'<p class="mu">مش مشترك في أي كورس.</p>')+
  '<div class="r2" style="margin-top:12px"><button style="flex:1" onclick="closePay();editStu(\''+eq+'\')">تعديل</button><button class="g" onclick="closePay()">إغلاق</button></div></div>';
 document.body.appendChild(m);
}

function editStu(eq){
 var e=dec(eq),u=users()[e];if(!u)return;
 var m=document.createElement('div');m.className='mo';m.id='mo';
 m.innerHTML='<div class="md"><h3>✏️ تعديل بيانات الطالب</h3>'+
  '<label class="lb" for="sn">الاسم</label><input id="sn">'+
  '<label class="lb" for="se">البريد الإلكتروني</label><input id="se" type="email" dir="ltr" class="ltr">'+
  '<div class="r2"><div style="width:34%"><label class="lb" for="sa">السن</label><input id="sa" type="text" inputmode="numeric" maxlength="3"></div><div style="flex:1"><label class="lb" for="sp">التليفون</label><input id="sp" type="tel" dir="ltr" class="ltr" maxlength="16"></div></div>'+
  '<label class="lb" for="spw">كلمة سر جديدة (سيبها فاضية لو مش عايز تغيّرها)</label>'+pw('spw','كلمة سر جديدة')+
  '<div class="err" id="sr" role="alert"></div><button style="width:100%" onclick="saveStu(\''+eq+'\')">حفظ التعديلات</button><button class="g" style="width:100%;margin-top:8px" onclick="closePay()">إلغاء</button></div>';
 document.body.appendChild(m);
 $('sn').value=u.name||'';$('se').value=e;$('sa').value=u.age||'';$('sp').value=u.phone||'';
}

function saveStu(eq){
 var e=dec(eq),u=users(),p=prog(),y=txns(),er=$('sr');
 if(!u[e]){closePay();admin();return}
 var n=$('sn').value.trim(),e2=$('se').value.trim().toLowerCase(),ph=normPhone($('sp').value),npw=$('spw').value;
 if(!n){er.textContent='اكتب اسم الطالب';return}
 if(!/^\S+@\S+\.\S+$/.test(e2)){er.textContent='اكتب بريد إلكتروني صحيح';return}
 if(e2!==e&&u[e2]){er.textContent='البريد ده مستخدم لطالب تاني';return}
 if(!okAge($('sa').value)){er.textContent='السن لازم يكون من '+AGE_MIN+' لـ '+AGE_MAX+' سنة';return}
 if(!okPhone(ph)){er.textContent='اكتب رقم تليفون مصري صحيح (11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015)';return}
 if(npw&&npw.length<6){er.textContent='كلمة السر الجديدة لازم 6 أحرف على الأقل';return}
 var x=u[e];x.name=n;x.age=+toEn($('sa').value).trim();x.phone=ph;if(npw)x.pw=enc(npw);
 if(e2!==e){
  u[e2]=x;delete u[e];
  if(p[e]){p[e2]=p[e];delete p[e]}
  if(y[e]){y[e2]=y[e];delete y[e]}
  save('cp',p);save('cy',y);
 }
 save('cu',u);closePay();admin();say('snote','تم حفظ بيانات الطالب ✓','ok',3500);
}

/* ===== المدفوعات ===== */
function approveTx(eq,courseId){
 var email=dec(eq),y=txns(),p=prog();
 if(y[email]&&y[email][courseId]){
  y[email][courseId].status='paid';
  y[email][courseId].approvedAt=new Date().toISOString();
  save('cy',y);
  p[email]=p[email]||{};
  if(!p[email][courseId])p[email][courseId]=[];
  save('cp',p);
  admin();
 }
}

function rejectTx(eq,courseId){
 var email=dec(eq),y=txns();
 if(y[email]&&y[email][courseId]){delete y[email][courseId];save('cy',y)}
 cfm=null;admin();
}

function viewReceiptImg(eq,courseId){
 var email=dec(eq),y=txns(),t=y[email]&&y[email][courseId];if(!t)return;
 var m=document.createElement('div');m.className='mo';m.id='mo';
 m.innerHTML='<div class="md"><h3>🖼️ إيصال التحويل البنكي / إنستا باي</h3><p class="mu">مرسل من: <b>'+esc(t.senderInfo||'غير محدد')+'</b></p>'+
  (t.receipt?'<img alt="إيصال التحويل" src="'+t.receipt+'" style="width:100%;max-height:320px;object-fit:contain;border-radius:10px;border:1px solid var(--bd)">':'<p class="mu">لا توجد صورة مرفقة</p>')+
  '<div class="r2" style="margin-top:12px"><button class="ok" style="flex:1" onclick="closePay();approveTx(\''+eq+'\',\''+courseId+'\')">قبول وتفعيل الكورس ✓</button><button class="g" onclick="closePay()">إغلاق</button></div></div>';
 document.body.appendChild(m);
}

/* ===== الكورسات ===== */
function toggleCourse(id){
 var cs=courses(),c=cs.find(function(x){return x.id===id});
 if(c){c.available=!c.available;save('cc',cs);admin()}
}
function toggleFeat(id){
 var cs=courses(),c=cs.find(function(x){return x.id===id});
 if(c){c.featured=!c.featured;save('cc',cs);admin()}
}

function delCourse(id){
 var cs=courses().filter(function(x){return x.id!==id});
 save('cc',cs);
 var p=prog(),y=txns();
 Object.keys(p).forEach(function(e){if(p[e]&&p[e][id])delete p[e][id]});
 Object.keys(y).forEach(function(e){if(y[e]&&y[e][id])delete y[e][id]});
 save('cp',p);save('cy',y);
 cfm=null;delete openC[id];admin();
}

/* إضافة / تعديل كورس (لو id موجود يبقى تعديل) */
function courseModal(id){
 var c=id?findCourse(id):null;
 var m=document.createElement('div');m.className='mo';m.id='mo';
 m.innerHTML='<div class="md"><h3>'+(c?'✏️ تعديل الكورس':'➕ إضافة كورس جديد')+'</h3>'+
  '<label class="lb" for="kt">اسم الكورس</label><input id="kt" placeholder="مثال: تطوير الألعاب">'+
  '<div class="r2"><div style="width:45%"><label class="lb" for="ki">الأيقونة</label><input id="ki" placeholder="🎮"></div><div style="flex:1"><label class="lb" for="kp">السعر (ج.م)</label><input id="kp" type="number" min="0"></div></div>'+
  '<div class="r2"><div style="flex:1"><label class="lb" for="ka1">من سن</label><input id="ka1" type="text" inputmode="numeric" maxlength="3"></div><div style="flex:1"><label class="lb" for="ka2">إلى سن</label><input id="ka2" type="text" inputmode="numeric" maxlength="3"></div></div>'+
  '<label class="lb" for="kd">وصف مختصر</label><input id="kd">'+
  '<label class="chk"><input id="kf" type="checkbox"> كورس مميز (يظهر في أبرز الكورسات)</label>'+
  '<div class="err" id="ke" role="alert"></div>'+
  '<button style="width:100%" onclick="saveCourse('+(c?'\''+c.id+'\'':'')+')">'+(c?'حفظ التعديلات':'حفظ الكورس')+'</button>'+
  '<button class="g" style="width:100%;margin-top:8px" onclick="closePay()">إلغاء</button></div>';
 document.body.appendChild(m);
 $('kt').value=c?c.title:'';$('ki').value=c?c.icon:'';$('kp').value=c?c.price:'';
 $('ka1').value=c?c.minAge:AGE_MIN;$('ka2').value=c?c.maxAge:AGE_MAX;
 $('kd').value=c?c.desc:'';$('kf').checked=c?!!c.featured:false;
}

function saveCourse(id){
 var t=$('kt').value.trim(),ic=$('ki').value.trim()||'📘',pr=Number($('kp').value),d=$('kd').value.trim(),er=$('ke'),
  a1=Number(toEn($('ka1').value)),a2=Number(toEn($('ka2').value));
 if(!t){er.textContent='اكتب اسم الكورس';return}
 if($('kp').value===''||isNaN(pr)||pr<0){er.textContent='اكتب سعر صحيح';return}
 if(!okAge($('ka1').value)||!okAge($('ka2').value)){er.textContent='السن لازم يكون من '+AGE_MIN+' لـ '+AGE_MAX+' سنة';return}
 if(a1>a2){er.textContent='"من سن" لازم يكون أقل من أو يساوي "إلى سن"';return}
 if(!d){er.textContent='اكتب وصف الكورس';return}
 var cs=courses();
 if(id){
  var c=cs.find(function(x){return x.id===id});
  if(c){c.title=t;c.icon=ic;c.price=pr;c.desc=d;c.minAge=a1;c.maxAge=a2;c.featured=$('kf').checked}
 }else{
  cs.push({id:String(Date.now()),title:t,icon:ic,desc:d,price:pr,minAge:a1,maxAge:a2,featured:$('kf').checked,available:true,g:cs.length%G.length});
 }
 save('cc',cs);
 closePay();
 admin();
}