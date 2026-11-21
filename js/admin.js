function admin(){
 var cs=courses(),u=users(),p=prog(),y=txns(),em=Object.keys(u),enr=0,rev=0,fin=0,pendingList=[];
 em.forEach(function(e){
  Object.keys(p[e]||{}).forEach(function(id){
   if(findCourse(id)){
    enr++;
    if(p[e][id].length==L.length)fin++;
   }
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
 var h='<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><h2>🛠️ لوحة الأدمن</h2><button onclick="addCourseModal()">+ إضافة كورس جديد</button></div>';
 h+='<div class="stats">'+st('👥','الطلاب المسجلين',em.length)+st('📚','إجمالي الكورسات',cs.length)+st('📝','الاشتراكات النشطة',enr)+st('💰','الإيرادات المؤكدة (ج.م)',rev)+st('⏳','طلبات دفع معلقة',pendingList.length)+'</div>';

 if(pendingList.length){
  h+='<div class="box" style="border-color:var(--wn);margin-bottom:20px"><h3 style="margin-top:0;color:var(--wn)">⏳ طلبات دفع بانتظار المراجعة والتفعيل ('+pendingList.length+')</h3><div class="tw"><table><tr><th>الطالب</th><th>الكورس</th><th>الطريقة</th><th>التفاصيل / الإيصال</th><th>الإجراء</th></tr>';
  pendingList.forEach(function(item){
   var proofHtml=item.tx.receipt?'<button class="sm g" onclick="viewReceiptImg(\''+item.email+'\',\''+item.courseId+'\')">🖼️ عرض الإيصال</button>':'<span class="mu">كود مرجعي: '+esc(item.tx.ref||'—')+'</span>';
   h+='<tr><td><b>'+esc(item.name)+'</b><br><small class="mu" dir="ltr">'+esc(item.email)+'</small></td><td>'+esc(item.courseTitle)+'<br><b>'+item.tx.amount+' ج.م</b></td><td>'+esc(item.tx.method)+'</td><td>'+proofHtml+'</td><td><div class="act"><button class="sm ok" onclick="approveTx(\''+item.email+'\',\''+item.courseId+'\')">تفعيل ✓</button><button class="sm dg" onclick="rejectTx(\''+item.email+'\',\''+item.courseId+'\')">رفض ✕</button></div></td></tr>';
  });
  h+='</table></div></div>';
 }

 h+='<h3>إدارة الكورسات وطلابها</h3>';
 if(!cs.length)h+='<div class="box mu">لا توجد كورسات حالياً. اضغط على "إضافة كورس جديد".</div>';
 cs.forEach(function(c){
  var rows=em.filter(function(e){return p[e]&&p[e][c.id]}),sum=0;
  var t=rows.map(function(e){
   var d=p[e][c.id].length,pc=Math.round(d/L.length*100);sum+=pc;
   var method=(y[e]&&y[e][c.id])?y[e][c.id].method:'—';
   return '<tr><td>'+esc(u[e].name)+'</td><td dir="ltr">'+esc(e)+'</td><td>'+esc(method)+'</td><td>'+d+' من '+L.length+'</td><td><div class="bar"><i style="width:'+pc+'%"></i></div>'+pc+'%</td></tr>';
  }).join('');
  var statusTag=c.available?'<span class="tag av">Available</span>':'<span class="tag un">Unavailable</span>';
  var toggleBtn='<button class="sm '+(c.available?'g':'ok')+'" onclick="event.preventDefault();toggleCourse(\''+c.id+'\')">'+(c.available?'Set Unavailable':'Set Available')+'</button>';
  var delBtn='<button class="sm dg" onclick="event.preventDefault();delCourse(\''+c.id+'\')">حذف</button>';
  h+='<details class="box"><summary><div><b>'+esc(c.icon)+' '+esc(c.title)+'</b> ('+c.price+' ج.م) — '+rows.length+' طالب'+(rows.length?' (متوسط التقدم '+Math.round(sum/rows.length)+'%)':'')+'</div><div class="act">'+statusTag+toggleBtn+delBtn+'</div></summary>'+
   '<p class="mu" style="margin:8px 0 0">'+esc(c.desc)+'</p>'+
   (rows.length?'<div class="tw"><table><tr><th>الطالب</th><th>البريد</th><th>طريقة الدفع</th><th>المحاضرات</th><th>التقدم</th></tr>'+t+'</table></div>':'<p class="mu">مفيش طلاب مسجلين لسه.</p>')+'</details>';
 });
 $('app').innerHTML=h;
}

function approveTx(email,courseId){
 var y=txns(),p=prog();
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

function rejectTx(email,courseId){
 if(!confirm('هل تريد رفض طلب الدفع هذا؟'))return;
 var y=txns();
 if(y[email]&&y[email][courseId]){
  delete y[email][courseId];
  save('cy',y);
  admin();
 }
}

function viewReceiptImg(email,courseId){
 var y=txns(),t=y[email]&&y[email][courseId];if(!t)return;
 var m=document.createElement('div');m.className='mo';m.id='mo';
 m.innerHTML='<div class="md"><h3>🖼️ إيصال التحويل البنكي / إنستا باي</h3><p class="mu">مرسل من: <b>'+esc(t.senderInfo||'غير محدد')+'</b></p>'+
  (t.receipt?'<img src="'+t.receipt+'" style="width:100%;max-height:320px;object-fit:contain;border-radius:10px;border:1px solid var(--bd)">':'<p class="mu">لا توجد صورة مرفقة</p>')+
  '<div class="r2" style="margin-top:12px"><button class="ok" style="flex:1" onclick="closePay();approveTx(\''+email+'\',\''+courseId+'\')">قبول وتفعيل الكورس ✓</button><button class="g" onclick="closePay()">إغلاق</button></div></div>';
 document.body.appendChild(m);
}

function toggleCourse(id){
 var cs=courses(),c=cs.find(function(x){return x.id===id});
 if(c){c.available=!c.available;save('cc',cs);admin();}
}

function delCourse(id){
 var c=findCourse(id);
 if(!c||!confirm('هل أنت متأكد من حذف كورس "'+c.title+'" نهائياً؟'))return;
 var cs=courses().filter(function(x){return x.id!==id});
 save('cc',cs);
 var p=prog();
 Object.keys(p).forEach(function(e){if(p[e]&&p[e][id])delete p[e][id]});
 save('cp',p);
 admin();
}

function addCourseModal(){
 var m=document.createElement('div');m.className='mo';m.id='mo';
 m.innerHTML='<div class="md"><h3>➕ إضافة كورس جديد</h3>'+
  '<input id="ct" placeholder="اسم الكورس (مثال: تطوير الألعاب)">'+
  '<div class="r2"><input id="ci" placeholder="الأيقونة (مثال: 🎮)" style="width:45%"><input id="cp" type="number" placeholder="السعر (ج.م)" min="0"></div>'+
  '<input id="cd" placeholder="وصف مختصر للكورس">'+
  '<div class="err" id="ce"></div>'+
  '<button style="width:100%" onclick="saveNewCourse()">حفظ الكورس</button>'+
  '<button class="g" style="width:100%;margin-top:8px" onclick="closePay()">إلغاء</button></div>';
 document.body.appendChild(m);
}

function saveNewCourse(){
 var t=$('ct').value.trim(),ic=$('ci').value.trim()||'📘',pr=Number($('cp').value),d=$('cd').value.trim(),er=$('ce');
 if(!t){er.textContent='اكتب اسم الكورس';return}
 if(isNaN(pr)||pr<0||$('cp').value===''){er.textContent='اكتب سعر صحيح';return}
 if(!d){er.textContent='اكتب وصف الكورس';return}
 var cs=courses();
 cs.push({id:String(Date.now()),title:t,icon:ic,desc:d,price:pr,available:true,g:cs.length%G.length});
 save('cc',cs);
 closePay();
 admin();
}