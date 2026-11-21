function home(){
 $('app').innerHTML='<div class="home"><div style="font-size:4rem">🎓</div><h1>أهلاً بيك في Coursera Plus</h1><p class="mu">اختار دخولك للمنصة</p><div class="roles"><div class="role" onclick="location.hash=\'student\'"><span>🎓</span><b>طالب</b><br><small>تصفح الكورسات وسجّل فيها</small></div><div class="role" onclick="location.hash=\'adminlogin\'"><span>🛠️</span><b>أدمن</b><br><small>إحصائيات المنصة وإدارة المدفوعات</small></div></div></div>';
}

function route(){
 var h=location.hash.slice(1),s=sess();head();window.scrollTo(0,0);
 if(!s){if(h=='student')auth();else if(h=='adminlogin')adminLogin();else home();return}
 if(s.role=='admin'){admin();return}
 var m=/^course-(.+)$/.exec(h);
 if(m&&findCourse(m[1]))course(m[1]);else list();
}

window.addEventListener('hashchange',route);
route();