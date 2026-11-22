var HOME_HASHES=['','home','about'];

function route(force){
 var h=location.hash.slice(1),s=sess();
 stopSlider();head();

 /* الأدمن بيشوف لوحته بس */
 if(s&&s.role=='admin'){admin();window.scrollTo(0,0);return}

 /* رابط الأدمن مخفي من الواجهة — بيتفتح من #adminlogin */
 if(h=='adminlogin'){loginMsg='';redirect=null;adminLogin();window.scrollTo(0,0);return}

 /* صفحة دخول الطالب: بتتفتح من زرار الـ nav فقط */
 if(h=='student'){
  if(s){location.hash='courses';return}
  authPage();window.scrollTo(0,0);return;
 }

 /* الرئيسية */
 if(HOME_HASHES.indexOf(h)>-1){
  if(force||view!=='home')home();else startSlider();
  var t=h=='about'?$(h):null;
  if(t)t.scrollIntoView();else window.scrollTo(0,0);
  return;
 }

 loginMsg='';redirect=null;
 var m=/^course-(.+)$/.exec(h);
 if(m&&findCourse(m[1])&&findCourse(m[1]).available)course(m[1]);
 else{if(view!=='course')fq=fa='';list()}
 window.scrollTo(0,0);
}

window.addEventListener('hashchange',function(){route()});
route(true);
