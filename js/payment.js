var payMethod='card';
var receiptBase64='';

function pay(id){
 var c=findCourse(id);if(!c)return;
 payMethod='card';
 receiptBase64='';
 var m=document.createElement('div');m.className='mo';m.id='mo';
 m.innerHTML='<div class="md"><div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">💳 بوابة الدفع الآمنة</h3><span style="font-weight:800;color:var(--pr)">'+c.price+' ج.م</span></div><p class="mu" style="margin:4px 0 10px;font-size:.86rem">الاشتراك في: <b>'+esc(c.title)+'</b></p>'+
  '<div class="pm-tabs">'+
   '<div class="pm-tab active" id="tab-card" onclick="setPayTab(\'card\',\''+id+'\')"><span>💳</span>بطاقة بنكية</div>'+
   '<div class="pm-tab" id="tab-wallet" onclick="setPayTab(\'wallet\',\''+id+'\')"><span>📱</span>محفظة كاش</div>'+
   '<div class="pm-tab" id="tab-instapay" onclick="setPayTab(\'instapay\',\''+id+'\')"><span>⚡</span>إنستا باي</div>'+
   '<div class="pm-tab" id="tab-fawry" onclick="setPayTab(\'fawry\',\''+id+'\')"><span>🏪</span>فوري</div>'+
  '</div>'+
  '<div id="pay-body"></div>'+
  '<div class="err" id="pe"></div>'+
  '<button class="g" style="width:100%;margin-top:8px" onclick="closePay()">إلغاء العملية</button>'+
  '<div class="secure-badge">🔒 اتصال مشفّر بالكامل 256-bit SSL</div></div>';
 document.body.appendChild(m);
 renderPayBody(id);
}

function setPayTab(method,id){
 payMethod=method;
 ['card','wallet','instapay','fawry'].forEach(function(t){
  var el=$('tab-'+t);if(el)el.className='pm-tab'+(t===method?' active':'');
 });
 $('pe').textContent='';
 renderPayBody(id);
}

function renderPayBody(id){
 var c=findCourse(id),b=$('pay-body');
 if(payMethod==='card'){
  b.innerHTML=
   '<div style="position:relative"><input id="cn" placeholder="رقم البطاقة (16 رقم)" maxlength="19" inputmode="numeric" oninput="formatCard(this)"><span id="ctype" style="position:absolute;left:12px;top:14px;font-size:.8rem;font-weight:800;color:var(--pr)"></span></div>'+
   '<input id="ch" placeholder="اسم حامل البطاقة (كما هو مدوّن على البطاقة)">'+
   '<div class="r2"><input id="ce" placeholder="MM/YY" maxlength="5" oninput="formatExp(this)"><input id="cc" placeholder="CVV" maxlength="3" type="password" inputmode="numeric"></div>'+
   '<button id="pb" style="width:100%;margin-top:6px" onclick="processCardPay(\''+id+'\')">ادفع الآن '+c.price+' ج.م</button>';
 }else if(payMethod==='wallet'){
  b.innerHTML=
   '<div class="pay-info">ادفع مباشرة عبر <b>فودافون كاش / اتصالات كاش / أورنج كاش / WE Pay</b></div>'+
   '<input id="wnum" placeholder="رقم المحفظة (مثال: 010xxxxxxxx)" maxlength="11" inputmode="numeric">'+
   '<div id="otp-area" style="display:none"><input id="wotp" placeholder="أدخل كود التحقق المرسل لهاتفك (6 أرقام)" maxlength="6" inputmode="numeric"></div>'+
   '<button id="pb" style="width:100%;margin-top:6px" onclick="processWalletPay(\''+id+'\')">إرسال كود التأكيد</button>';
 }else if(payMethod==='instapay'){
  b.innerHTML=
   '<div class="pay-info">حوّل مبلغ <b>'+c.price+' ج.م</b> عبر تطبيق <b>InstaPay</b> إلى العنوان التالي:'+
    '<div class="copy-box"><span dir="ltr">nolimitsteam@instapay</span><button type="button" class="sm g" onclick="copyTxt(\'nolimitsteam@instapay\',this)">نسخ</button></div>'+
   '</div>'+
   '<input id="ipsender" placeholder="عنوان إنستا باي الخاص بك أو رقم الهاتف المحوّل منه">'+
   '<label style="display:block;font-size:.82rem;color:var(--mu);margin-top:6px">ارفع صورة إيصال التحويل (Screenshot):</label>'+
   '<input type="file" id="ipfile" accept="image/*" onchange="handleReceiptFile(this)" style="padding:7px;font-size:.85rem">'+
   '<button id="pb" style="width:100%;margin-top:6px" onclick="processInstaPay(\''+id+'\')">تأكيد وإرسال الإيصال</button>';
 }else if(payMethod==='fawry'){
  var fawryCode='998'+Math.floor(1000000+Math.random()*9000000);
  b.innerHTML=
   '<div class="pay-info">توجه لأقرب ماكينة <b>فوري (Fawry)</b> واطلب خدمة مدفوعات التاجر بكود الدفع التالي (صالح لمدة 24 ساعة):'+
    '<div class="copy-box"><b dir="ltr" id="fcode">'+fawryCode+'</b><button type="button" class="sm g" onclick="copyTxt(\''+fawryCode+'\',this)">نسخ الكود</button></div>'+
   '</div>'+
   '<button id="pb" style="width:100%;margin-top:6px" onclick="processFawryPay(\''+id+'\',\''+fawryCode+'\')">تأكيد حجز الكود والمتابعة</button>';
 }
}

function formatCard(el){
 var v=el.value.replace(/\D/g,'').slice(0,16);
 el.value=v.replace(/(.{4})/g,'$1 ').trim();
 var ct=$('ctype');
 if(/^4/.test(v))ct.textContent='VISA';
 else if(/^5[1-5]/.test(v)||/^2[2-7]/.test(v))ct.textContent='MasterCard';
 else if(/^5078/.test(v))ct.textContent='Meeza 🇪🇬';
 else ct.textContent='';
}

function formatExp(el){
 var v=el.value.replace(/\D/g,'').slice(0,4);
 if(v.length>=3)el.value=v.slice(0,2)+'/'+v.slice(2);
 else el.value=v;
}

function copyTxt(txt,btn){
 navigator.clipboard.writeText(txt);
 var old=btn.textContent;btn.textContent='تم النسخ ✓';setTimeout(function(){btn.textContent=old},1500);
}

function handleReceiptFile(input){
 var file=input.files&&input.files[0];if(!file)return;
 var reader=new FileReader();
 reader.onload=function(e){receiptBase64=e.target.result};
 reader.readAsDataURL(file);
}

function processCardPay(id){
 var c=findCourse(id),er=$('pe'),now=new Date();
 var n=$('cn').value.replace(/\s/g,''),ch=$('ch').value.trim(),ex=/^(0[1-9]|1[0-2])\/(\d\d)$/.exec($('ce').value);
 if(!/^\d{16}$/.test(n)){er.textContent='رقم البطاقة يجب أن يكون 16 رقماً';return}
 if(ch.length<3){er.textContent='اكتب اسم حامل البطاقة بشكل صحيح';return}
 if(!ex){er.textContent='تاريخ الانتهاء بصيغة MM/YY';return}
 var yr=2000+Number(ex[2]);
 if(yr<now.getFullYear()||(yr==now.getFullYear()&&Number(ex[1])<now.getMonth()+1)){er.textContent='البطاقة منتهية الصلاحية';return}
 if(!/^\d{3}$/.test($('cc').value)){er.textContent='رمز CVV المكون من 3 أرقام مطلوب';return}

 er.textContent='';
 $('pb').disabled=true;$('pb').textContent='⏳ جاري الاتصال بالبنك (3D Secure)...';
 setTimeout(function(){
  var ref='TXN-'+Date.now().toString().slice(-8);
  completeEnrollment(id,{
   amount:c.price,
   method:'بطاقة بنكية (•••• '+n.slice(-4)+')',
   status:'paid',
   ref:ref,
   date:new Date().toISOString()
  },true);
 },1800);
}

var generatedOtp='';
function processWalletPay(id){
 var c=findCourse(id),er=$('pe'),num=$('wnum').value.trim();
 if(!/^01[0125]\d{8}$/.test(num)){er.textContent='أدخل رقم هاتف مصري صحيح (11 رقم)';return}
 er.textContent='';
 if($('otp-area').style.display==='none'){
  generatedOtp=String(Math.floor(100000+Math.random()*900000));
  $('pb').disabled=true;$('pb').textContent='⏳ جاري إرسال رسالة التأكيد...';
  setTimeout(function(){
   $('pb').disabled=false;
   $('otp-area').style.display='block';
   $('pb').textContent='تأكيد الدفع ('+c.price+' ج.م)';
   alert('📩 رسالة محفظة الكاش:\nكود تأكيد عملية الدفع بمبلغ '+c.price+' ج.م هو: '+generatedOtp);
  },1000);
 }else{
  var otp=$('wotp').value.trim();
  if(otp!==generatedOtp){er.textContent='كود التحقق غير صحيح (الكود المرسل: '+generatedOtp+')';return}
  $('pb').disabled=true;$('pb').textContent='⏳ جاري خصم الرصيد وتفعيل الكورس...';
  setTimeout(function(){
   var ref='WLT-'+Date.now().toString().slice(-8);
   completeEnrollment(id,{
    amount:c.price,
    method:'محفظة إلكترونية ('+num+')',
    status:'paid',
    ref:ref,
    date:new Date().toISOString()
   },true);
  },1400);
 }
}

function processInstaPay(id){
 var c=findCourse(id),er=$('pe'),sender=$('ipsender').value.trim();
 if(!sender){er.textContent='اكتب حساب إنستا باي أو الرقم المحوّل منه';return}
 if(!receiptBase64){er.textContent='يرجى إرفاق صورة إيصال التحويل للتأكيد';return}
 er.textContent='';
 $('pb').disabled=true;$('pb').textContent='⏳ جاري رفع الإيصال وتسجيل الطلب...';
 setTimeout(function(){
  var ref='INS-'+Date.now().toString().slice(-8);
  completeEnrollment(id,{
   amount:c.price,
   method:'InstaPay ⚡',
   status:'pending',
   senderInfo:sender,
   receipt:receiptBase64,
   ref:ref,
   date:new Date().toISOString()
  },false);
 },1200);
}

function processFawryPay(id,fawryCode){
 var c=findCourse(id);
 $('pb').disabled=true;$('pb').textContent='⏳ جاري تسجيل طلب الدفع...';
 setTimeout(function(){
  completeEnrollment(id,{
   amount:c.price,
   method:'Fawry 🏪',
   status:'pending',
   ref:fawryCode,
   date:new Date().toISOString()
  },false);
 },1000);
}

function completeEnrollment(id,txData,instantActivate){
 var e=me(),p=prog(),y=txns(),c=findCourse(id);
 y[e]=y[e]||{};y[e][id]=txData;save('cy',y);
 if(instantActivate){
  p[e]=p[e]||{};p[e][id]=[];save('cp',p);
 }
 var dt=new Date(txData.date).toLocaleString('ar-EG');
 $('mo').firstChild.innerHTML=
  '<div style="text-align:center">'+
   '<div style="font-size:3rem">'+(instantActivate?'✅':'⏳')+'</div>'+
   '<h3>'+(instantActivate?'تم الدفع وتفعيل الكورس بنجاح!':'تم تسجيل طلب الدفع بنجاح')+'</h3>'+
   '<p class="mu" style="font-size:.88rem">'+(instantActivate?'يمكنك الآن الوصول لجميع محاضرات الكورس فوراً':'سيتم تفعيل الكورس تلقائياً فور تأكيد استلام المبلغ من الإدارة')+'</p>'+
   '<div class="receipt">'+
    '<div><span class="mu">رقم العملية:</span><b dir="ltr">'+esc(txData.ref)+'</b></div>'+
    '<div><span class="mu">الكورس:</span><b>'+esc(c.title)+'</b></div>'+
    '<div><span class="mu">طريقة الدفع:</span><b>'+esc(txData.method)+'</b></div>'+
    '<div><span class="mu">المبلغ:</span><b>'+txData.amount+' ج.م</b></div>'+
    '<div><span class="mu">الحالة:</span><b style="color:'+(instantActivate?'var(--ok)':'var(--wn)')+'">'+(instantActivate?'مدفوع ومؤكد ✓':'قيد المراجعة ⏳')+'</b></div>'+
    '<div><span class="mu">التاريخ:</span><span>'+dt+'</span></div>'+
   '</div>'+
   '<button style="width:100%" onclick="closePay();course(\''+id+'\')">'+(instantActivate?'ابدأ التعلم الآن 🚀':'العودة لصفحة الكورس')+'</button>'+
  '</div>';
}

function showReceiptModal(id){
 var tx=myTx(id),c=findCourse(id);if(!tx||!c)return;
 var dt=new Date(tx.date).toLocaleString('ar-EG'),ok=tx.status==='paid';
 var m=document.createElement('div');m.className='mo';m.id='mo';
 m.innerHTML='<div class="md"><h3>🧾 إيصال الدفع الإلكتروني</h3>'+
  '<div class="receipt">'+
   '<div><span class="mu">رقم العملية:</span><b dir="ltr">'+esc(tx.ref)+'</b></div>'+
   '<div><span class="mu">الكورس:</span><b>'+esc(c.title)+'</b></div>'+
   '<div><span class="mu">طريقة الدفع:</span><b>'+esc(tx.method)+'</b></div>'+
   '<div><span class="mu">المبلغ:</span><b>'+tx.amount+' ج.م</b></div>'+
   '<div><span class="mu">الحالة:</span><b style="color:'+(ok?'var(--ok)':'var(--wn)')+'">'+(ok?'مدفوع ومؤكد ✓':'قيد المراجعة ⏳')+'</b></div>'+
   '<div><span class="mu">التاريخ:</span><span>'+dt+'</span></div>'+
  '</div>'+
  '<button class="g" style="width:100%" onclick="closePay()">إغلاق</button></div>';
 document.body.appendChild(m);
}

function closePay(){var m=$('mo');if(m)m.remove()}