(function(){
  var root = document.documentElement;
  var storageKey = 'jordan-theme';
  var stored = null;
  try { stored = localStorage.getItem(storageKey); } catch (err) {}
  if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored);

  function currentTheme(){
    var attr = root.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  var toggles = document.querySelectorAll('[data-theme-toggle]');
  function updateToggles(){
    var t = currentTheme();
    var next = t === 'dark' ? 'light' : 'dark';
    toggles.forEach(function(btn){
      btn.textContent = t === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    });
  }
  updateToggles();
  toggles.forEach(function(btn){
    btn.addEventListener('click', function(){
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(storageKey, next); } catch (err) {}
      updateToggles();
    });
  });

  var menuOpenBtn = document.getElementById('menuOpenBtn');
  var menuCloseBtn = document.getElementById('menuCloseBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  function openMenu(){ mobileMenu.hidden = false; menuOpenBtn.setAttribute('aria-expanded','true'); }
  function closeMenu(){ mobileMenu.hidden = true; menuOpenBtn.setAttribute('aria-expanded','false'); }

  menuOpenBtn.addEventListener('click', openMenu);
  menuCloseBtn.addEventListener('click', closeMenu);
  document.querySelectorAll('[data-close-menu]').forEach(function(a){ a.addEventListener('click', closeMenu); });

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('#jordan-portfolio-root [data-reveal]');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          observer.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function(el){ observer.observe(el); });
  }

  document.querySelectorAll('#jordan-portfolio-root .flip-card').forEach(function(card){
    card.addEventListener('click', function(){ card.classList.toggle('is-flipped'); });
    card.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

  (function(){
    var stage = document.getElementById('servicesWheelStage');
    var ring = document.getElementById('servicesWheelRing');
    if (!stage || !ring) return;
    var rotation = 0;
    var velocity = prefersReduced ? 0 : 0.045;
    var dragVelocity = 0;
    var dragging = false;
    var lastX = 0;

    function getX(e){ return e.touches ? e.touches[0].clientX : e.clientX; }

    stage.addEventListener('pointerdown', function(e){
      dragging = true;
      lastX = getX(e);
      dragVelocity = 0;
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    });
    stage.addEventListener('pointermove', function(e){
      if (!dragging) return;
      var x = getX(e);
      var dx = x - lastX;
      lastX = x;
      rotation += dx * 0.35;
      dragVelocity = dx * 0.35;
    });
    function endDrag(){
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      velocity = dragVelocity;
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('wheel', function(e){
      e.preventDefault();
      velocity += e.deltaY * 0.04;
    }, { passive: false });

    var idleSpin = prefersReduced ? 0 : 0.045;
    function frame(){
      if (!dragging) {
        rotation += velocity;
        velocity *= 0.945;
        if (Math.abs(velocity) < idleSpin) velocity = (velocity < 0 ? -idleSpin : idleSpin);
      }
      ring.style.transform = 'rotateY(' + rotation + 'deg)';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  var SERVICES = [
    {
      icon: "\u25B6", tag: "Twitch \u2022 Discovery \u2022 Audience",
      title: "Twitch Channel Marketing",
      lead: "Strategic promotion and optimization designed to improve Twitch discoverability, audience reach and overall channel presence.",
      included: [
        "Full channel audit: panels, overlays, About section and branding review",
        "Category and tag optimization so the right viewers find your stream",
        "Stream schedule and format strategy built around your content",
        "Raid, host and networking plan to connect with other creators",
        "Community-building tactics that turn viewers into regulars"
      ],
      why: [
        "Better visibility in Twitch's category and search browsing",
        "More consistent conversion of new viewers into followers",
        "A stronger sense of community that keeps people coming back stream after stream"
      ]
    },
    {
      icon: "\u25B6", tag: "YouTube \u2022 SEO \u2022 Growth",
      title: "YouTube Marketing",
      lead: "Improve your YouTube presence through channel optimization, content strategy, SEO and targeted promotion.",
      included: [
        "Channel and video SEO: titles, descriptions, tags and thumbnails",
        "Content strategy aligned with what your audience is actually searching for",
        "Upload schedule and format planning",
        "Audience retention review to see where viewers drop off and why",
        "Targeted promotion to reach viewers beyond your existing subscribers"
      ],
      why: [
        "More of your videos get recommended and found through search",
        "Casual viewers convert into subscribers instead of one-time watches",
        "Views compound over time instead of every upload starting from zero"
      ]
    },
    {
      icon: "\u2702", tag: "Clips \u2022 Shorts \u2022 Editing",
      title: "Clips & Short-Form Content",
      lead: "Transform streams and long-form content into engaging clips, Shorts and social-ready content designed for wider reach.",
      included: [
        "Review of VODs and long-form content for clip-worthy moments",
        "Editing into TikTok, Shorts and Reels-ready cuts",
        "Captions, pacing and hooks optimized for retention",
        "Batch delivery on a consistent schedule",
        "Formatting tailored to each platform's specs"
      ],
      why: [
        "Turns one stream or video into 10+ pieces of content",
        "Reaches audiences who will never sit through a full VOD",
        "Short-form is currently the easiest path to being discovered by new people"
      ]
    },
    {
      icon: "\u25C6", tag: "TikTok \u2022 Instagram \u2022 Social",
      title: "Social Media Growth",
      lead: "Build a connected presence across TikTok, Instagram, X, Facebook and other platforms where your audience spends time.",
      included: [
        "Presence setup and audit across TikTok, Instagram, X and Facebook",
        "Content repurposing calendar built from your existing streams and videos",
        "Posting strategy tailored to each platform",
        "Community engagement approach to build real connection, not just followers",
        "Cross-promotion strategy linking every platform back to your main channel"
      ],
      why: [
        "Meets your audience wherever they already spend time",
        "Reduces reliance on any single platform's algorithm",
        "Builds a personal brand that's bigger than one channel"
      ]
    },
    {
      icon: "\u25CE", tag: "SEO \u2022 Keywords \u2022 Strategy",
      title: "Content & SEO Strategy",
      lead: "Optimize your content so platforms and search engines can better understand, discover and surface it to relevant audiences.",
      included: [
        "Keyword and topic research for your niche",
        "Title, description and metadata optimization",
        "Content gap analysis: what your audience is searching for that you haven't made yet",
        "Alignment with how each platform's algorithm actually surfaces content",
        "Ongoing SEO adjustments as trends and platforms change"
      ],
      why: [
        "Makes it easier for the right audience to find you organically, without paid ads",
        "Improves long-term discoverability instead of one-off spikes",
        "Compounds: content optimized today keeps working for you months later"
      ]
    },
    {
      icon: "\u25C8", tag: "Brand \u2022 Strategy \u2022 Community",
      title: "Creator Brand Growth",
      lead: "Build a stronger digital presence that connects your content, platforms, audience and personal brand.",
      included: [
        "Personal brand positioning: what makes you distinct from other creators",
        "Consistent visuals, tone and messaging across every platform",
        "Audience and community strategy",
        "A growth roadmap tailored to your specific goals and content"
      ],
      why: [
        "Turns \u201Ca creator with content\u201D into a recognizable brand people trust and return to",
        "Opens the door to sponsorships and partnerships",
        "Creates long-term value that doesn't disappear if one platform's algorithm changes"
      ]
    }
  ];

  (function(){
    var overlay = document.getElementById('serviceOverlay');
    var closeBtn = document.getElementById('serviceOverlayClose');
    var backBtn = document.getElementById('serviceOverlayBack');
    var iconEl = document.getElementById('serviceOverlayIcon');
    var tagEl = document.getElementById('serviceOverlayTag');
    var titleEl = document.getElementById('serviceOverlayTitle');
    var leadEl = document.getElementById('serviceOverlayLead');
    var includedEl = document.getElementById('serviceOverlayIncluded');
    var whyEl = document.getElementById('serviceOverlayWhy');
    if (!overlay) return;

    var checkSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    var lastFocused = null;

    function buildList(el, items){
      el.innerHTML = '';
      items.forEach(function(text){
        var li = document.createElement('li');
        li.innerHTML = checkSvg + '<span>' + text + '</span>';
        el.appendChild(li);
      });
    }

    function openService(index){
      var s = SERVICES[index];
      if (!s) return;
      iconEl.textContent = s.icon;
      tagEl.textContent = s.tag;
      titleEl.textContent = s.title;
      leadEl.textContent = s.lead;
      buildList(includedEl, s.included);
      buildList(whyEl, s.why);
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('overlay-open');
      overlay.scrollTop = 0;
      closeBtn.focus();
    }

    function closeOverlay(){
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('overlay-open');
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('#jordan-portfolio-root .service-learn-more').forEach(function(btn){
      btn.addEventListener('click', function(){
        lastFocused = btn;
        openService(parseInt(btn.getAttribute('data-service'), 10));
      });
    });

    closeBtn.addEventListener('click', closeOverlay);
    backBtn.addEventListener('click', closeOverlay);
    document.getElementById('serviceOverlayCta').addEventListener('click', closeOverlay);
    document.getElementById('serviceOverlayCta2').addEventListener('click', closeOverlay);
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeOverlay();
    });
  })();

  var form = document.getElementById('contactForm');
  if (form) {
    var formStatus = document.getElementById('formStatus');
    var formButton = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var f = e.target;
      formButton.disabled = true;
      formButton.textContent = 'SENDING...';
      formStatus.style.display = 'block';
      formStatus.style.color = 'var(--muted)';
      formStatus.textContent = 'Sending your message...';
      fetch(f.action, {
        method: 'POST',
        body: new FormData(f),
        headers: { 'Accept': 'application/json' }
      }).then(function(response){
        if (response.ok) {
          formStatus.style.color = 'var(--accent-a)';
          formStatus.textContent = "Thanks! Your message has been sent \u2014 I'll get back to you soon.";
          f.reset();
        } else {
          response.json().then(function(data){
            var msg = (data && data.errors) ? data.errors.map(function(er){ return er.message; }).join(', ') : 'Something went wrong. Please try again or email jordananthonymix@gmail.com directly.';
            formStatus.style.color = '#C2410C';
            formStatus.textContent = msg;
          }).catch(function(){
            formStatus.style.color = '#C2410C';
            formStatus.textContent = 'Something went wrong. Please try again or email jordananthonymix@gmail.com directly.';
          });
        }
      }).catch(function(){
        formStatus.style.color = '#C2410C';
        formStatus.textContent = 'Could not send right now. Please email jordananthonymix@gmail.com directly.';
      }).finally(function(){
        formButton.disabled = false;
        formButton.textContent = 'SEND PROJECT REQUEST \u2192';
      });
    });
  }

  document.querySelectorAll('a[href="index.html"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var path = location.pathname.replace(/\/+$/, '');
      var isHome = path === '' || /\/?index\.html$/.test(path);
      if (isHome) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
})();

// Chatbase AI assistant
(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="7KXvvk_R996yblbu3sAi2";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
