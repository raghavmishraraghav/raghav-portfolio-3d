const pageLoader = document.getElementById('pageLoader');
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('load', () => {
  setTimeout(() => pageLoader.classList.add('hide'), 650);
});

/* Custom cursor */
if (window.matchMedia('(pointer:fine)').matches) {
  let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function cursorLoop(){
    ringX += (mouseX - ringX) * .14;
    ringY += (mouseY - ringY) * .14;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  document.querySelectorAll('a,button,.tilt-card,.skills-grid article').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

/* Scroll progress */
function updateProgress(){
  const max = document.documentElement.scrollHeight - innerHeight;
  scrollProgress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
}
addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

/* Reveal sections */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      entry.target.closest('.section')?.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Section navigation */
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${entry.target.id}`
    ));
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section => sectionObserver.observe(section));

/* Subtle hero parallax */
const hero = document.querySelector('.hero');
const heroPhoto = document.querySelector('.hero-photo');
if(hero && heroPhoto && matchMedia('(pointer:fine)').matches){
  hero.addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth - .5) * 10;
    const y = (e.clientY / innerHeight - .5) * 7;
    heroPhoto.style.transform = `scale(1.03) translate(${x * .45}px, ${y * .45}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    heroPhoto.style.transform = '';
  });
}

/* Project card tilt */
if(matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX-r.left)/r.width-.5;
      const py = (e.clientY-r.top)/r.height-.5;
      card.style.transform = `perspective(900px) rotateX(${py*-2.2}deg) rotateY(${px*2.2}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}

/* Placeholder project links */
document.querySelectorAll('.placeholder-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    alert('Replace this placeholder with your project/GitHub URL in index.html.');
  });
});

/* Theme */
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
});


/* 3D hero scene interaction */
const heroScene = document.querySelector('.hero-3d');
if(heroScene && matchMedia('(pointer:fine)').matches){
  const orbs = heroScene.querySelectorAll('.orb, .wire-cube, .floating-code');
  hero.addEventListener('mousemove', e => {
    const nx = (e.clientX / innerWidth - .5);
    const ny = (e.clientY / innerHeight - .5);
    orbs.forEach((el, i) => {
      const depth = 8 + (i % 4) * 7;
      el.style.marginLeft = `${nx * depth}px`;
      el.style.marginTop = `${ny * depth}px`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    orbs.forEach(el => {
      el.style.marginLeft = '';
      el.style.marginTop = '';
    });
  });
}
