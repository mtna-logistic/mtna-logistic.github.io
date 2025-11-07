// Helpers
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

// Footer year
$('#year') && ($('#year').textContent = new Date().getFullYear());

// Mobile menu
const menuBtn = $('.menu-toggle');
const nav = $('.nav-links');
if (menuBtn && nav){
  menuBtn.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    menuBtn.setAttribute('aria-expanded', (!open).toString());
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 960){ nav.style.display = 'none'; menuBtn.setAttribute('aria-expanded','false'); }
  }));
}

// Form -> mailto
const form = $('#quote-form');
if (form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    const subject = `[Devis] ${d.from||''} → ${d.to||''} • ${d.vehicle||''}`.trim();
    const body = `
Nom / Société: ${d.name||''}
Email: ${d.email||''}
Téléphone: ${d.phone||''}

Départ: ${d.from||''}
Arrivée: ${d.to||''}
Véhicule: ${d.vehicle||''}
Date souhaitée: ${d.date||''}

Notes:
${d.notes||''}

RGPD: j’accepte d'être recontacté pour ce devis.
`.trim();
    window.location.href = `mailto:contact@mtna-logistic.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

/* ====================== Cookies ====================== */
const COOKIE_NAME = 'mtna_cookie_prefs';
const banner = $('.cookie-banner');
const modal  = $('.cookie-modal');
const reader = $('.cookie-read');
const readableBox = $('#cookie-readable');
const analyticsCb = $('#cookie-analytics');

const open  = el => el?.removeAttribute('hidden');
const close = el => el?.setAttribute('hidden','');

function parseCookie(){
  const raw = document.cookie.split('; ').find(x => x.startsWith(COOKIE_NAME+'='));
  if(!raw) return null;
  try{ return JSON.parse(decodeURIComponent(raw.split('=')[1])); }catch{ return null; }
}
function setCookie(prefs){
  const val = encodeURIComponent(JSON.stringify(prefs));
  const exp = new Date(); exp.setFullYear(exp.getFullYear()+1);
  document.cookie = `${COOKIE_NAME}=${val}; Expires=${exp.toUTCString()}; Path=/; SameSite=Lax`;
}
function deleteCookie(){
  document.cookie = `${COOKIE_NAME}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
}
function prefsToHtml(p){
  if(!p) return `<p>(aucun consentement enregistré)</p>`;
  const dt = new Date(p.ts || Date.now()).toLocaleString();
  return `
    <ul>
      <li><strong>Nécessaires :</strong> ${p.necessary ? 'activés' : 'désactivés'} (toujours actifs)</li>
      <li><strong>Mesure d’audience (anonyme) :</strong> ${p.analytics ? 'activée' : 'désactivée'}</li>
      <li><strong>Enregistré le :</strong> ${dt}</li>
    </ul>
    <p class="tiny muted">Ce site ne dépose aucun cookie publicitaire ni de reciblage.</p>
  `;
}

// Afficher la bannière si pas de préférence
const existing = parseCookie();
if (!existing) open(banner);

// Pré-remplir la modale
function syncModalFromPrefs(){
  const p = parseCookie();
  if (analyticsCb){
    analyticsCb.checked = !!p?.analytics;
  }
}

// Bouton footer "Cookies"
$('[data-open-cookies]')?.addEventListener('click', (e) => {
  e.preventDefault();
  syncModalFromPrefs();
  open(modal);
});

// Bannière
$('[data-cookie-accept]')?.addEventListener('click', () => {
  setCookie({necessary:true, analytics:true, ts:Date.now()});
  close(banner);
});
$('[data-cookie-custom]')?.addEventListener('click', () => {
  close(banner);
  syncModalFromPrefs();
  open(modal);
});

// Modale : actions
$('[data-cookie-save]')?.addEventListener('click', () => {
  const analytics = analyticsCb?.checked || false;
  setCookie({necessary:true, analytics, ts:Date.now()});
  close(modal);
});
$('[data-cookie-close]')?.addEventListener('click', () => close(modal));
$('[data-cookie-refuse]')?.addEventListener('click', () => {
  setCookie({necessary:true, analytics:false, ts:Date.now()});
  close(modal);
});
$('[data-cookie-reset]')?.addEventListener('click', () => {
  deleteCookie();
  close(modal);
  open(banner); // redemande le choix
});

// Lecture lisible
$('[data-open-cookie-read]')?.addEventListener('click', () => {
  const prefs = parseCookie();
  if (readableBox) readableBox.innerHTML = prefsToHtml(prefs);
  open(reader);
});
$('[data-close-cookie-read]')?.addEventListener('click', () => close(reader));
