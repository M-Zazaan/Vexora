// ── VEXORA STUDIO — nav.js ────────────────────────────────────
(function () {
  var path = window.location.pathname;

  var NAV = [
    { label:'Home',      href:'/index.html',     match:'/' },
    { label:'Apps',      href:'/apps.html',      match:'/apps' },
    { label:'Changelog', href:'/changelog.html', match:'/changelog' },
    { label:'Contact',   href:'/contact.html',   match:'/contact' },
    { label:'FAQ',       href:'/faq.html',        match:'/faq' },
  ];

  function isActive(match) {
    if (match === '/') return path === '/' || path === '/index.html';
    return path.startsWith(match);
  }

  var navLinks = NAV.map(function(n) {
    return '<a href="'+n.href+'"'+(isActive(n.match)?' class="active"':'')+'>'+n.label+'</a>';
  }).join('');

  document.body.insertAdjacentHTML('afterbegin',
    '<div class="cursor" id="vxCur"></div>'+
    '<div class="cursor-ring" id="vxRing"></div>'+
    '<nav class="vx-nav" id="vxNav">'+
      '<a href="/index.html" class="vx-logo">Vexora <em>Studio</em></a>'+
      '<div class="vx-nav-links">'+navLinks+'<a href="/apps/abide/index.html" class="vx-nav-cta">Get Abide</a></div>'+
      '<button class="vx-menu-btn" id="vxMenuBtn"><span></span><span></span><span></span></button>'+
    '</nav>'+
    '<div class="vx-mobile-nav" id="vxMobile">'+
      '<button class="vx-mobile-close" id="vxClose">✕</button>'+
      NAV.map(function(n){ return '<a href="'+n.href+'">'+n.label+'</a>'; }).join('')+
      '<a href="/apps/abide/index.html" style="color:var(--accent);">Get Abide</a>'+
    '</div>'
  );

  document.body.insertAdjacentHTML('beforeend',
    '<div class="vx-footer-wrap">'+
      '<div class="vx-footer">'+
        '<div class="vx-footer-grid">'+
          '<div class="vx-footer-brand">'+
            '<a href="/index.html" class="vx-logo" style="display:block;margin-bottom:1rem;">Vexora <em>Studio</em></a>'+
            '<p>Independent mobile app studio building thoughtful apps that improve real people\'s lives.</p>'+
          '</div>'+
          '<div class="vx-footer-col"><h4>Studio</h4>'+
            '<a href="/index.html">Home</a><a href="/apps.html">Apps</a>'+
            '<a href="/changelog.html">Changelog</a><a href="/contact.html">Contact</a><a href="/faq.html">FAQ</a>'+
          '</div>'+
          '<div class="vx-footer-col"><h4>Apps</h4>'+
            '<a href="/apps/abide/index.html">Abide</a>'+
            '<a href="/apps/abide/pricing/index.html">Abide Pricing</a>'+
          '</div>'+
          '<div class="vx-footer-col"><h4>Legal</h4>'+
            '<a href="/privacy.html">Privacy Policy</a>'+
            '<a href="/terms.html">Terms of Service</a>'+
            '<a href="/refund.html">Refund Policy</a>'+
          '</div>'+
        '</div>'+
        '<div class="vx-footer-bottom">'+
          '<p>© 2025 Vexora Studio. All rights reserved.</p>'+
          '<p>Built with purpose.</p>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="vx-toast" id="vxToast"></div>'
  );

  // cursor
  var cur=document.getElementById('vxCur'),ring=document.getElementById('vxRing');
  var mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function tick(){rx+=(mx-rx)*0.1;ry+=(my-ry)*0.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick);})();
  document.querySelectorAll('a,button').forEach(function(el){
    el.addEventListener('mouseenter',function(){ring.style.width='54px';ring.style.height='54px';});
    el.addEventListener('mouseleave',function(){ring.style.width='36px';ring.style.height='36px';});
  });

  // scroll shadow
  var nav=document.getElementById('vxNav');
  window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>20);},{passive:true});

  // mobile menu
  var mob=document.getElementById('vxMobile');
  document.getElementById('vxMenuBtn').addEventListener('click',function(){mob.classList.add('open');});
  document.getElementById('vxClose').addEventListener('click',function(){mob.classList.remove('open');});
  mob.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mob.classList.remove('open');});});

  // reveal
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});

  // global toast
  window.vxToast=function(msg,type){
    var t=document.getElementById('vxToast');
    t.textContent=msg;t.className='vx-toast show'+(type?' '+type:'');
    clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('show');},3000);
  };
})();
