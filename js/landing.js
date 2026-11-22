var si=0;
var SL=[
 {bg:'#312e81,#4f46e5',e:'🎓',t:'اتعلّم من غير حدود',p:'كورسات في البرمجة والتصميم واللغات والأعمال، وكلها بتبدأ معاك من الصفر.',b:'شوف الكورسات',h:'courses'},
 {bg:'#115e59,#0f766e',e:'💳',t:'ادفع بالطريقة اللي تريحك',p:'بطاقة بنكية أو محفظة كاش أو إنستا باي أو فوري — اختار اللي مناسبك.',b:'ابدأ دلوقتي',h:'student'},
 {bg:'#7c2d12,#c2410c',e:'🎯',t:'كورسات على قد سنّك',p:'دوّر باسم الكورس أو بسنّك، وهتلاقي الكورس اللي يناسبك.',b:'دوّر على كورس',h:'courses'}
];

function slider(logged){
 var s='<section class="sl" aria-roledescription="carousel" aria-label="عروض المنصة" onmouseenter="stopSlider()" onmouseleave="startSlider()" onfocusin="stopSlider()" onfocusout="startSlider()">';
 SL.forEach(function(x,i){
  var h=(i==1&&logged)?'courses':x.h,b=(i==1&&logged)?'تصفح الكورسات':x.b;
  s+='<div class="sld'+(i==0?' on':'')+'" style="background:linear-gradient(135deg,'+x.bg+')"><div class="sx"><h1>'+x.t+'</h1><p>'+x.p+'</p><button onclick="location.hash=\''+h+'\'">'+b+'</button></div><div class="se" aria-hidden="true">'+x.e+'</div></div>';
 });
 s+='<button class="sa pv" aria-label="السابق" onclick="slide(-1)">›</button><button class="sa nx" aria-label="التالي" onclick="slide(1)">‹</button><div class="sdots">';
 SL.forEach(function(x,i){s+='<button aria-label="شريحة '+(i+1)+'" class="'+(i==0?'on':'')+'" onclick="slide('+i+'-si)"></button>'});
 return s+'</div></section>';
}
function slide(d){
 var s=document.querySelectorAll('.sld'),t=document.querySelectorAll('.sdots button');
 if(!s.length)return;
 s[si].classList.remove('on');t[si].classList.remove('on');
 si=(si+d+s.length)%s.length;
 s[si].classList.add('on');t[si].classList.add('on');
}
function startSlider(){
 stopSlider();
 if(view!=='home'||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;
 tmr=setInterval(function(){slide(1)},5500);
}
function stopSlider(){clearInterval(tmr);tmr=null}

function home(){
 view='home';si=0;
 var s=sess(),all=courses().filter(function(c){return c.available}),
  ft=all.filter(function(c){return c.featured}).slice(0,4),
  rest=all.filter(function(c){return !c.featured});
 var h=slider(!!s);

 h+=statsSection(all);

 h+='<section class="sec" id="about"><h2>من نحن</h2><div class="ab"><div><p>Coursera Plus منصة تعليمية بالعربي بتجمع كورسات البرمجة والتصميم واللغات والأعمال في مكان واحد. بنركّز على الشرح المبسّط، والتسجيل السهل، وطرق دفع بتستخدمها كل يوم.</p><p class="mu">المنصة من تطوير فريق NoLimitsTeam كمشروع تخرج.</p></div><div>'+
  '<div class="fct"><b>ابدأ من الصفر</b><span class="mu">كل كورس بيمشي معاك درس بدرس من الأساسيات.</span></div>'+
  '<div class="fct"><b>ادفع زي ما تحب</b><span class="mu">بطاقة بنكية، محفظة كاش، إنستا باي أو فوري.</span></div>'+
  '<div class="fct"><b>تابع تقدّمك</b><span class="mu">بتشوف نسبة إنجازك في كل كورس بتشترك فيه.</span></div></div></div></section>';

 if(ft.length)h+='<section class="sec"><div class="sh"><h2>أبرز الكورسات</h2></div><div class="grid">'+ft.map(cardHtml).join('')+'</div></section>';

 h+='<section class="sec"><div class="sh"><h2>الكورسات</h2><button class="g sm" onclick="location.hash=\'courses\'">عرض كل الكورسات ('+all.length+')</button></div>'+
  (rest.length?'<div class="grid">'+rest.slice(0,6).map(cardHtml).join('')+'</div>':(all.length?'':'<div class="box mu">لا توجد كورسات متاحة حالياً.</div>'))+'</section>';

h+='<section class="sec" id="reviews"><h2>آراء الطلاب</h2><div id="rvs">'+reviewsHtml()+'</div></section>';
 $('app').innerHTML=h;
 startSlider();countUp();
}

/* ===== إحصائيات (من بيانات المنصة الفعلية) ===== */
function statsSection(all){
 var mn=99,mx=0;
 all.forEach(function(c){if(c.minAge<mn)mn=c.minAge;if(c.maxAge>mx)mx=c.maxAge});
 function st(n,t){return '<div class="hs"><b class="cn" data-to="'+n+'">'+n+'</b><span class="mu">'+t+'</span></div>'}
 return '<section class="sec"><div class="hstats">'+st(all.length,'كورس متاح')+st(all.length*L.length,'درس تعليمي')+st(4,'طرق دفع مختلفة')+
  '<div class="hs"><b dir="ltr">'+(all.length?mn+'–'+mx:'—')+'</b><span class="mu">سنة: الأعمار اللي بنغطيها</span></div></div></section>';
}
function countUp(){
 var els=document.querySelectorAll('.cn');
 if(!els.length||!('IntersectionObserver' in window)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;
 var io=new IntersectionObserver(function(en){
  en.forEach(function(x){
   if(!x.isIntersecting)return;io.unobserve(x.target);
   var el=x.target,to=+el.dataset.to,t0=null;
   function f(t){if(!t0)t0=t;var k=Math.min((t-t0)/900,1);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)}
   el.textContent='0';requestAnimationFrame(f);
  });
 },{threshold:.4});
 els.forEach(function(e){io.observe(e)});
}

/* ===== آراء الطلاب ===== */
var SEED_R=[
 {name:'Poula Asaad',age:17,course:'برمجة بايثون',rate:5,text:'كنت فاكرة البرمجة صعبة، بس الدروس بسيطة ومترتبة وفهمت من أول كورس.'},
 {name:'Kareem Mohamed',age:11,course:'اللغة الإنجليزية',rate:5,text:'بقيت أتكلم إنجليزي مع أصحابي، والدروس قصيرة ومش بتملّ.'},
 {name:'Tomass Suliman',age:24,course:'تطوير الويب',rate:4,text:'الكورس مرتب وبيوصّلك لمشروع تطبيقي، وطرق الدفع كانت سهلة عليا.'},
 {name:'Donia Ahmed',age:29,course:'التسويق الرقمي',rate:5,text:'المحتوى عملي، وقدرت أطبّقه على صفحة مشروعي من أول أسبوع.'},
 {name:'Habiba Omar',age:29,course:'الذكاء الاصطناعي',rate:5,text:'الكورس جميل و مفيد جدا'}
];
var rv=5;
function stars(n){return '<span class="stars" role="img" aria-label="'+n+' من 5">'+'★'.repeat(n)+'☆'.repeat(5-n)+'</span>'}
function reviewsHtml(){
 var mine=get('cr',[]).slice().reverse(),list=mine.concat(SEED_R).slice(0,6),e=me();
 var h='<div class="rg">'+list.map(function(r){
  return '<figure class="rc">'+stars(r.rate)+'<blockquote>'+esc(r.text)+'</blockquote><figcaption><b>'+esc(r.name)+'</b>'+(r.age?' — '+r.age+' سنة':'')+(r.course?'<br><span class="mu">'+esc(r.course)+'</span>':'')+'</figcaption></figure>';
 }).join('')+'</div>';
 if(e){
  h+='<div class="box rf"><b>شاركنا رأيك</b><div class="pick" id="stp" role="group" aria-label="التقييم">'+[1,2,3,4,5].map(function(i){return '<button type="button" class="'+(i<=rv?'on':'')+'" aria-label="'+i+' نجوم" onclick="setStar('+i+')">★</button>'}).join('')+'</div>'+
   '<textarea id="rt" maxlength="200" rows="3" placeholder="اكتب رأيك في المنصة (10 أحرف على الأقل)"></textarea><div class="msg" id="rvm" role="status" aria-live="polite"></div><button onclick="addReview()">أضف رأيك</button></div>';
 }else h+='<div class="box mu">عايز تشاركنا رأيك؟ <a class="lnk" href="#student">سجّل دخولك</a> وأضف رأيك.</div>';
 return h;
}
function setStar(n){rv=n;document.querySelectorAll('#stp button').forEach(function(b,i){b.className=i<n?'on':''})}
function addReview(){
 var e=me(),t=$('rt').value.trim(),u=users()[e];
 if(t.length<10){say('rvm','اكتب رأيك في 10 أحرف على الأقل.','er',4000);return}
 var all=get('cr',[]),old=all.findIndex(function(r){return r.email===e}),
  r={email:e,name:u.name,age:u.age,rate:rv,text:t};
 if(old>-1)all.splice(old,1);
 all.push(r);save('cr',all);
 $('rvs').innerHTML=reviewsHtml();
 say('rvm',old>-1?'تم تحديث رأيك ✓':'شكراً! تم إضافة رأيك ✓','ok',4000);
}
