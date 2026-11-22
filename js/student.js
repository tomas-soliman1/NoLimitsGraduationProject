var fq='',fa='';
function ageOk(c,a){return a===''||(c.minAge<=a&&a<=c.maxAge)}

/* كارد الكورس — بيتستخدم في الرئيسية وصفحة الكورسات */
function cardHtml(c){
 var p=myp(c.id),tx=myTx(c.id),b='',pend=tx&&tx.status==='pending';
 if(p)b='<span class="bd">مسجّل ✓ '+Math.round(p.length/L.length*100)+'%</span>';
 else if(pend)b='<span class="bd pend">⏳ قيد المراجعة</span>';
 return '<div class="c" tabindex="0" role="link" onclick="location.hash=\'course-'+c.id+'\'" onkeydown="if(event.key===\'Enter\')this.click()">'+
  '<div class="po" style="background:linear-gradient(135deg,'+G[c.g]+')">'+esc(c.icon)+b+(c.featured?'<span class="bd ft">⭐ مميز</span>':'')+'</div>'+
  '<div class="cb"><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p><p class="ag">🎂 '+ageLabel(c)+'</p>'+(p||pend?'':'<p><b>'+c.price+' ج.م</b></p>')+'</div></div>';
}

function list(){
 view='list';
 var s=sess(),su=s&&s.role=='student'?users()[s.email]:null,myAge=su&&su.age?su.age:'';
 $('app').innerHTML='<h2>الكورسات المتاحة</h2><div class="fb"><div class="fi">'+
  '<input id="fq" type="search" placeholder="🔍 ابحث باسم الكورس أو وصفه" oninput="fq=this.value;fill()" aria-label="بحث في الكورسات">'+
  '<input id="fa" type="text" inputmode="numeric" maxlength="3" placeholder="السن" oninput="fa=this.value;fill()" aria-label="السن">'+
  (myAge?'<button class="g sm" onclick="setAge('+myAge+')">على قد سنّي ('+myAge+')</button>':'')+
  '<button class="g sm" onclick="clearF()">مسح الفلتر</button></div><div class="mu fcount" id="fc"></div></div><div id="cg"></div>';
 $('fq').value=fq;$('fa').value=fa;fill();
}
function setAge(a){fa=String(a);$('fa').value=fa;fill()}
function clearF(){fq='';fa='';$('fq').value='';$('fa').value='';fill()}
function fill(){
 var t=fq.trim().toLowerCase(),a=fa.trim()===''?'':Number(toEn(fa));
 if(a!==''&&isNaN(a))a='';
 var all=courses().filter(function(c){return c.available}),
  cs=all.filter(function(c){return(!t||(c.title+' '+c.desc).toLowerCase().indexOf(t)>-1)&&ageOk(c,a)});
 $('fc').textContent=(t||a!=='')?'النتيجة: '+cs.length+' من '+all.length+' كورس':all.length+' كورس';
 $('cg').innerHTML=cs.length?'<div class="grid">'+cs.map(cardHtml).join('')+'</div>':
  '<div class="box mu">'+(all.length?'مفيش كورسات بتطابق البحث ده. جرّب كلمة تانية أو غيّر السن، أو <a class="lnk" onclick="clearF()">امسح الفلتر</a>.':'لا توجد كورسات متاحة حالياً.')+'</div>';
}

function course(id){
 view='course';
 var c=findCourse(id);
 if(!c||!c.available){list();return}
 var e=me(),su=e?users()[e]:null,p=myp(id),tx=myTx(id),done=p||[],pct=Math.round(done.length/L.length*100),nxt=0;
 while(done.indexOf(nxt)>-1&&nxt<L.length)nxt++;
 var h='<button class="g" onclick="location.hash=\'courses\'">→ رجوع للكورسات</button><div class="hero" style="margin-top:14px;background:linear-gradient(135deg,'+G[c.g]+')"><div class="e">'+esc(c.icon)+'</div><div><h1>'+esc(c.title)+'</h1><p>'+esc(c.desc)+'</p><p>🎂 '+ageLabel(c)+'</p></div></div><div class="box">';
 if(p){
  h+='<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><b>✅ أنت مسجّل في الكورس</b>'+(tx?'<button class="sm g" onclick="showReceiptModal(\''+id+'\')">🧾 عرض فاتورة الدفع</button>':'')+'</div><div class="bar"><i style="width:'+pct+'%"></i></div><div class="mu">أنجزت '+done.length+' من '+L.length+' دروس ('+pct+'%) — '+(nxt<L.length?'وصلت لحد: الدرس '+(nxt+1)+' ('+L[nxt].replace('%',esc(c.title))+')':'🎉 خلصت الكورس كله')+'</div>';
 }else if(tx&&tx.status==='pending'){
  h+='<b>⏳ طلب اشتراكك قيد المراجعة</b><p class="mu" style="margin:4px 0 8px">تم استلام طلب الدفع عبر <b>'+esc(tx.method)+'</b> (رقم المرجع: <code>'+esc(tx.ref)+'</code>). سيتم تفعيل الكورس فور تأكيد العملية من الإدارة.</p><button class="sm g" onclick="showReceiptModal(\''+id+'\')">🧾 تفاصيل الطلب</button>';
 }else if(!e){
  h+='<b>سجّل دخولك علشان تشترك في الكورس</b><p class="mu" style="margin:4px 0 10px">تقدر تتصفح محتوى الكورس من غير حساب، وبعد ما تدخل تقدر تشترك وتبدأ الدروس.</p><button onclick="needLogin(\''+id+'\')">دخول / حساب جديد</button>';
 }else{
  if(su&&su.age&&(su.age<c.minAge||su.age>c.maxAge))h+='<div class="msg show wn">الكورس ده مناسب لسن '+c.minAge+' – '+c.maxAge+' سنة، وسنّك المسجّل '+su.age+'. تقدر تشترك عادي لو حابب.</div>';
  h+='<b>أنت لسه مش مسجّل في الكورس ده</b><p class="mu" style="margin:4px 0 10px">تقدر تشوف المحتوى، وسجّل الآن بأكثر من طريقة دفع آمنة.</p><button onclick="pay(\''+id+'\')">سجّل في الكورس — '+c.price+' ج.م</button>';
 }
 h+='</div><div class="box"><h3 style="margin-top:0">محتوى الكورس</h3><div class="msg" id="cm" role="status" aria-live="polite"></div>';
 L.forEach(function(t,k){var d=done.indexOf(k)>-1;
  h+='<div class="les'+(d?' d':'')+(p&&k==nxt?' cur':'')+'"><span>'+(d?'✔ ':'▶ ')+'الدرس '+(k+1)+': '+t.replace('%',esc(c.title))+'</span>'+(d?'<span class="mu">تم</span>':'<button class="'+(p?'ok':'g')+'" onclick="mark(\''+id+'\','+k+')">'+(p?'تم الدرس':'🔒 سجّل للبدء')+'</button>')+'</div>'});
 $('app').innerHTML=h+'</div>';
}

function mark(id,k){
 if(!me()){needLogin(id);return}
 if(!myp(id)){
  var tx=myTx(id);
  if(tx&&tx.status==='pending'){say('cm','طلب اشتراكك قيد المراجعة حالياً وسيتم فتح الدروس فور التفعيل.','wn',5000);return}
  pay(id);return;
 }
 var p=prog(),e=me();if(p[e][id].indexOf(k)<0)p[e][id].push(k);save('cp',p);course(id);
}
