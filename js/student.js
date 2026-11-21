function list(){
 var cs=courses().filter(function(c){return c.available});
 var h='<h2>الكورسات المتاحة</h2>';
 if(!cs.length){$('app').innerHTML=h+'<div class="box mu">لا توجد كورسات متاحة حالياً.</div>';return}
 h+='<div class="grid">';
 cs.forEach(function(c){
  var p=myp(c.id),tx=myTx(c.id),b='';
  if(p)b='<span class="bd">مسجّل ✓ '+Math.round(p.length/L.length*100)+'%</span>';
  else if(tx&&tx.status==='pending')b='<span class="bd pend">⏳ قيد المراجعة</span>';
  h+='<div class="c" onclick="location.hash=\'course-'+c.id+'\'"><div class="po" style="background:linear-gradient(135deg,'+G[c.g]+')">'+esc(c.icon)+b+'</div><div class="cb"><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p>'+(p||(tx&&tx.status==='pending')?'':'<p><b>'+c.price+' ج.م</b></p>')+'</div></div>';
 });
 $('app').innerHTML=h+'</div>';
}

function course(id){
 var c=findCourse(id);
 if(!c||!c.available){list();return}
 var p=myp(id),tx=myTx(id),done=p||[],pct=Math.round(done.length/L.length*100),nxt=0;
 while(done.indexOf(nxt)>-1&&nxt<L.length)nxt++;
 var h='<button class="g" onclick="location.hash=\'courses\'">→ رجوع للكورسات</button><div class="hero" style="margin-top:14px;background:linear-gradient(135deg,'+G[c.g]+')"><div class="e">'+esc(c.icon)+'</div><div><h1>'+esc(c.title)+'</h1><p>'+esc(c.desc)+'</p></div></div><div class="box">';
 if(p){
  h+='<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><b>✅ أنت مسجّل في الكورس</b>'+(tx?'<button class="sm g" onclick="showReceiptModal(\''+id+'\')">🧾 عرض فاتورة الدفع</button>':'')+'</div><div class="bar"><i style="width:'+pct+'%"></i></div><div class="mu">أنجزت '+done.length+' من '+L.length+' دروس ('+pct+'%) — '+(nxt<L.length?'وصلت لحد: الدرس '+(nxt+1)+' ('+L[nxt].replace('%',esc(c.title))+')':'🎉 خلصت الكورس كله')+'</div>';
 }else if(tx&&tx.status==='pending'){
  h+='<b>⏳ طلب اشتراكك قيد المراجعة</b><p class="mu" style="margin:4px 0 8px">تم استلام طلب الدفع عبر <b>'+esc(tx.method)+'</b> (رقم المرجع: <code>'+esc(tx.ref)+'</code>). سيتم تفعيل الكورس فور تأكيد العملية من الإدارة.</p><button class="sm g" onclick="showReceiptModal(\''+id+'\')">🧾 تفاصيل الطلب</button>';
 }else{
  h+='<b>أنت لسه مش مسجّل في الكورس ده</b><p class="mu" style="margin:4px 0 10px">تقدر تشوف المحتوى، وسجّل الآن بأكثر من طريقة دفع آمنة.</p><button onclick="pay(\''+id+'\')">سجّل في الكورس — '+c.price+' ج.م</button>';
 }
 h+='</div><div class="box"><h3 style="margin-top:0">محتوى الكورس</h3>';
 L.forEach(function(t,k){var d=done.indexOf(k)>-1;
  h+='<div class="les'+(d?' d':'')+(p&&k==nxt?' cur':'')+'"><span>'+(d?'✔ ':'▶ ')+'الدرس '+(k+1)+': '+t.replace('%',esc(c.title))+'</span>'+(d?'<span class="mu">تم</span>':'<button class="'+(p?'ok':'g')+'" onclick="mark(\''+id+'\','+k+')">'+(p?'تم الدرس':'🔒 سجّل للبدء')+'</button>')+'</div>'});
 $('app').innerHTML=h+'</div>';
}

function mark(id,k){
 if(!myp(id)){
  var tx=myTx(id);
  if(tx&&tx.status==='pending'){alert('طلب اشتراكك قيد المراجعة حالياً وسيتم فتح الدروس فور التفعيل.');return}
  pay(id);return;
 }
 var p=prog(),e=me();if(p[e][id].indexOf(k)<0)p[e][id].push(k);save('cp',p);course(id);
}