    // set year


    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Header hide-on-scroll-down / show-on-scroll-up + scrolled style
    (function(){ 
      const header = document.getElementById('siteHeader'); 
      let lastScroll = window.scrollY || 0; 
      let ticking = false; 
      const threshold = 40; 
  
      function onScroll(){ 
        lastScroll = window.scrollY || 0; 
        if(!ticking){ 
          requestAnimationFrame(update); 
          ticking=true; 
        } 
      } 
  
      let prev = window.scrollY || 0; 
      function update(){ 
        const current = window.scrollY || 0; 
  
        if(current <= 0){ 
          header.classList.remove('hidden'); 
          header.classList.remove('scrolled'); 
        } else { 
          if(current > prev && current > 80){ 
            header.classList.add('hidden'); 
          } else if(current < prev){ 
            header.classList.remove('hidden'); 
            if(current > threshold) header.classList.add('scrolled'); 
            else header.classList.remove('scrolled'); 
          } 
          if(current <= threshold){ 
            header.classList.remove('scrolled'); 
          } 
        } 
        prev = current; 
        ticking = false; 
      } 
  
      window.addEventListener('scroll', onScroll, {passive:true}); 
      if(window.scrollY > threshold) header.classList.add('scrolled'); 
    })();
  
    // Mobile menu toggle
    const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobile(){
mobileMenu.classList.remove('open');
mobileMenu.setAttribute('aria-hidden','true');
}
function openMobile(){
mobileMenu.classList.add('open');
mobileMenu.setAttribute('aria-hidden','false');
}

if(burger){
burger.addEventListener('click', ()=>{
  if(mobileMenu.classList.contains('open')) closeMobile();
  else openMobile();
});
}

// close on overlay click
mobileMenu.addEventListener('click', (e)=>{
if(e.target === mobileMenu) closeMobile();
});

// smooth scroll for anchor links (закриває меню після переходу)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
a.addEventListener('click', function(e){
  const href = this.getAttribute('href');
  if(href.length > 1){
    e.preventDefault();
    const el = document.querySelector(href);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    closeMobile();
  }
})
});
(function () {
const scrollHint = document.querySelector('.scroll-hint');
if (!scrollHint) return;

const targetSelector = scrollHint.dataset.target || '#asortyment';
const target = document.querySelector(targetSelector);

const hide = () => scrollHint.classList.add('hidden');
const show = () => scrollHint.classList.remove('hidden');

// Клік: плавний скрол і приховування
scrollHint.addEventListener('click', (e) => {
  e.preventDefault();
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollBy({ top: 300, behavior: 'smooth' });
  }
  hide();
});

// Прагнемо уникнути дуже частого виклику onScroll — використовуємо requestAnimationFrame
let ticking = false;
const threshold = 8; // налаштовуй під "хоч чучуть"

const handleScroll = () => {
  // Показати якщо на самому верху (<= threshold), інакше ховати
  if (window.scrollY <= threshold) {
    show();
  } else {
    hide();
  }
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

// Початковий стан при завантаженні сторінки
if (window.scrollY > threshold) {
  hide();
} else {
  show();
}
})();


// ---- 4 sector
(function(){
const gallery = document.getElementById('photoGallery');
const photoBtns = Array.from(gallery.querySelectorAll('.photo-btn'));
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const btnClose = lightbox.querySelector('.lb-close');
const btnPrev = lightbox.querySelector('.lb-prev');
const btnNext = lightbox.querySelector('.lb-next');

// Побудуємо масив шляхів: беремо data-large якщо є, інакше src
const images = photoBtns.map(btn => {
  return btn.dataset.large || (btn.querySelector('img') && btn.querySelector('img').src) || '';
});

function isLightboxAllowed(){
// раніше було: return window.innerWidth > 767;
return true;
}


let currentIndex = 0;

function openLightbox(index){
  if (!isLightboxAllowed()) return;
  currentIndex = index;
  lbImage.src = images[currentIndex];
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  btnClose.focus();
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lbImage.src = '';
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

function showNext(){
  currentIndex = (currentIndex + 1) % images.length;
  lbImage.src = images[currentIndex];
}
function showPrev(){
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lbImage.src = images[currentIndex];
}

// Обробник кліку по фото
photoBtns.forEach((btn, i) => {
  btn.addEventListener('click', (e) => {
    // Якщо мобайл — не відкриваємо лайтбокс (фото вже full width)
    if (!isLightboxAllowed()){
      return;
    }
    e.preventDefault();
    openLightbox(i);
  });

  // Доступність: Enter/Space теж відкриває
  btn.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && isLightboxAllowed()){
      e.preventDefault();
      openLightbox(i);
    }
  });
});

// Lightbox controls
btnClose.addEventListener('click', closeLightbox);
btnNext.addEventListener('click', showNext);
btnPrev.addEventListener('click', showPrev);

window.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Якщо під час перегляду змінився розмір в менший (мобайл) — закрити
window.addEventListener('resize', () => {
  if (!isLightboxAllowed() && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

// Підказка: якщо хочеш сувору стабільність розташування (щоб контролювати позиції по рядках/колонках)
// замість CSS columns можу додати Masonry (JS) або grid-layout з плагіном — скажи і пришлю варіант.
})();

(function(){
// Центр міста Чортків (приблизно)
const cityCenter = [49.01888, 25.7962];

// Маркери: координати та дані магазинів
// Якщо маєш точні координати — заміни їх тут.
const stores = [
  {
    title: 'м. Чортків, вул. Шевченка, 12',
    coords: [49.0185, 25.7969],
    phone: '+38 050 377 3737'
  },
  {
    title: 'м. Чортків, вул. Степана Бандери, 9',
    coords: [49.0190, 25.7951],
    phone: '+38 098 000 0282'
  }
];

// Ініціалізація карти
const map = L.map('map', {
  center: cityCenter,
  zoom: 13,
  scrollWheelZoom: false, // вимкнути скрол карти щоб не заважав сторінці
  zoomControl: true
});

// Шар OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Додаємо маркери
stores.forEach((s) => {
  const m1 = L.marker([49.01852, 25.7969]).addTo(map).bindPopup('м. Чортків, вул. Шевченка, 12<br><a href="tel:+380503773737">+38 050 377 3737</a>');
const m2 = L.marker([49.0190, 25.7951]).addTo(map).bindPopup('м. Чортків, вул. Степана Бандери, 9<br><a href="tel:+380980000282">+38 098 000 0282</a>');

// щоб карта показувала обидва маркери
const group = new L.featureGroup([m1, m2]);
map.fitBounds(group.getBounds().pad(0.35));
map.zoomOut();

});

// Якщо хочеш, щоб карта автоматично підлаштовувалась під всі маркери:
const group = new L.featureGroup(stores.map(s => L.marker(s.coords)));
map.fitBounds(group.getBounds().pad(0.35)); // додає трохи простору навколо
})();
/* --- JS: carousel, stars, and review injection --- */
(function(){
// ---- ЗАМІНИ цей масив на реальні відгуки з Google (ім'я, date, rating 1-5, text, optional avatarUrl) ----
const reviews = [
  { name: "Олександр Волосацький", date: "2025-01-15", rating: 5, text: "Супер!", avatarUrl: "" },
  { name: "Anastasiia Pozdniakova", date: "2025-01-14", rating: 5, text: "Супер квіти) стоять тижнями, ніби вчора поставила. Дякую дівчатам за ніжні букети)", avatarUrl: "" },
  { name: "Ангеліна Алексєйчук", date: "2025-01-14", rating: 5, text: "Дуже задоволена замовленням, все зробили швидко та якісно!", avatarUrl: "" },
  { name: "Інга П", date: "2024-12-20", rating: 4, text: "Гарні букети, але доставку можна пришвидшити.", avatarUrl: "" },
  { name: "Марія", date: "2024-11-01", rating: 5, text: "Дякую! Квіти на свято були чудові.", avatarUrl: "" }
];
// ---------------------------------------------------------------------------------------

const carousel = document.getElementById('reviewsCarousel');
const dotsWrap = document.getElementById('reviewsDots');
const avgStarsEl = document.getElementById('avgStars');
const avgValueEl = document.getElementById('avgValue');
const reviewsCountEl = document.getElementById('reviewsCount');
const prevBtn = document.querySelector('.rc-prev');
const nextBtn = document.querySelector('.rc-next');

// compute average rating
const avg = (reviews.reduce((s,r) => s + (r.rating||0), 0) / (reviews.length || 1));
const avgRounded = Math.round(avg * 10) / 10;

// render avg stars (5 stars with partial)
function renderAvgStars(container, value){
  container.innerHTML = '';
  const full = Math.floor(value);
  const half = (value - full) >= 0.5;
  for (let i=1;i<=5;i++){
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('width','20');
    svg.setAttribute('height','20');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d','M12 .587l3.668 7.431L23.6 9.75l-5.8 5.643L19.335 24 12 19.771 4.665 24l1.535-8.607L0.4 9.75l7.932-1.732z');
    path.setAttribute('fill', i <= full ? '#F6BE2D' : (i === full+1 && half ? 'url(#grad)' : '#E6E6E6'));
    svg.appendChild(path);
    container.appendChild(svg);
  }
}

// render stars inside card (integer)
function createStarsElem(n){
  const wrap = document.createElement('div');
  wrap.className = 'card-stars';
  for (let i=0;i<5;i++){
    const s = document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('viewBox','0 0 24 24');
    s.setAttribute('width','16');
    s.setAttribute('height','16');
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d','M12 .587l3.668 7.431L23.6 9.75l-5.8 5.643L19.335 24 12 19.771 4.665 24l1.535-8.607L0.4 9.75l7.932-1.732z');
    p.setAttribute('fill', i < n ? '#F6BE2D' : '#E6E6E6');
    s.appendChild(p);
    wrap.appendChild(s);
  }
  return wrap;
}

// build slides
function buildSlides(){
  const track = document.createElement('div');
  track.className = 'reviews-track';
  reviews.forEach((r, i) => {
    const slide = document.createElement('article');
    slide.className = 'review-card';
    slide.setAttribute('role','group');
    slide.setAttribute('aria-roledescription','slide');
    slide.setAttribute('aria-label', `${r.name} — ${r.rating} зірок`);

    // head
    const head = document.createElement('div');
    head.className = 'rev-head';
    const avatar = document.createElement('div');
    avatar.className = 'rev-avatar';
    if (r.avatarUrl) {
      const img = document.createElement('img');
      img.src = r.avatarUrl;
      img.alt = r.name;
      img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover';
      avatar.appendChild(img);
    } else {
      avatar.textContent = (r.name || 'U').slice(0,1).toUpperCase();
    }
    const info = document.createElement('div'); info.className='rev-info';
    const nm = document.createElement('div'); nm.className='rev-name'; nm.textContent = r.name || 'Імʼя';
    const dt = document.createElement('div'); dt.className='rev-date'; dt.textContent = r.date || '';
    info.appendChild(nm); info.appendChild(dt);
    head.appendChild(avatar); head.appendChild(info);

    // stars
    const stars = createStarsElem(Math.round(r.rating || 0));

    // text
    const txt = document.createElement('div'); txt.className='rev-text'; txt.textContent = r.text || '';

    slide.appendChild(head);
    slide.appendChild(stars);
    slide.appendChild(txt);

    track.appendChild(slide);
  });

  // duplicate slides at end/start for smoother transition if desired (not required)
  carousel.innerHTML = '';
  carousel.appendChild(track);

  // dots
  dotsWrap.innerHTML = '';
  const pages = Math.ceil(reviews.length / slidesPerView());
  for (let i=0;i<pages;i++){
    const d = document.createElement('button');
    d.className = 'reviews-dot';
    d.type='button';
    d.dataset.index = i;
    d.addEventListener('click', () => { goToPage(i); resetAutoplay(); });
    dotsWrap.appendChild(d);
  }
  updateDots(0);
}

// slide logic
let pageIndex = 0;
let autoplayTimer = null;

function slidesPerView(){
  const w = window.innerWidth;
  if (w <= 640) return 1;
  if (w <= 1000) return 2;
  return 3;
}

function updateTrackPosition(){
  const track = carousel.querySelector('.reviews-track');
  if (!track) return;
  const spv = slidesPerView();
  const card = track.querySelector('.review-card');
  if (!card) return;
  const gap = 20; // matches CSS gap
  const cardWidth = card.getBoundingClientRect().width;
  const move = pageIndex * (cardWidth + gap) * spv;
  track.style.transform = `translateX(-${move}px)`;
  updateDots(pageIndex);
}

function numPages(){
  return Math.ceil(reviews.length / slidesPerView());
}

function goToPage(idx){
  const pages = numPages();
  if (idx < 0) idx = pages - 1;
  if (idx >= pages) idx = 0;
  pageIndex = idx;
  updateTrackPosition();
}

function prevPage(){
  goToPage(pageIndex - 1);
}
function nextPage(){
  goToPage(pageIndex + 1);
}

function updateDots(idx){
  const nodes = Array.from(dotsWrap.children);
  nodes.forEach((d,i)=> d.classList.toggle('active', i === idx));
}

// autoplay
function startAutoplay(){
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    nextPage();
  }, 4500);
}
function stopAutoplay(){ if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

// attach controls
prevBtn.addEventListener('click', () => { prevPage(); resetAutoplay(); });
nextBtn.addEventListener('click', () => { nextPage(); resetAutoplay(); });

// recalc on resize
let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    buildSlides();
    pageIndex = 0;
    updateTrackPosition();
    startAutoplay();
  }, 260);
});

// render avg stars and values
(function(){
  avgStarsEl.innerHTML = '';
  // simple stars using filled/unfilled based on rounded average
  for (let i=1;i<=5;i++){
    const s = document.createElement('span');
    s.innerHTML = i <= Math.round(avg) ? '★' : '☆';
    s.style.color = i <= Math.round(avg) ? '#F6BE2D' : '#E0E0E0';
    s.style.fontSize = '20px';
    s.style.marginRight = '4px';
    avgStarsEl.appendChild(s);
  }
  avgValueEl.textContent = avgRounded.toFixed(1);
  reviewsCountEl.textContent = reviews.length;
})();

// init
buildSlides();
updateTrackPosition();
startAutoplay();

// pause autoplay on hover/focus
carousel.addEventListener('mouseenter', stopAutoplay);
carousel.addEventListener('mouseleave', startAutoplay);
carousel.addEventListener('focusin', stopAutoplay);
carousel.addEventListener('focusout', startAutoplay);
})();
