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

// Cookies (très simple)
const COOKIE_NAME = 'mtna_cookie_prefs';
const banner = $('.cookie-banner');
const modal = $('.cookie-modal');
const reader = $('.cookie-read');
const dump = $('#cookie-dump');

const open = el => el?.removeAttribute('hidden');
const close = el => el?.setAttribute('hidden','');

const getPrefs = () => {
  const raw = document.cookie.split('; ').find(x => x.startsWith(COOKIE_NAME+'='));
  if(!raw) return null;
  try{ return JSON.parse(decodeURIComponent(raw.split('=')[1])); }catch{ return null; }
};
const setPrefs = (prefs) => {
  const val = encodeURIComponent(JSON.stringify(prefs));
  const exp = new Date(); exp.setFullYear(exp.getFullYear()+1);
  document.cookie = `${COOKIE_NAME}=${val}; Expires=${exp.toUTCString()}; Path=/; SameSite=Lax`;
};

if (!getPrefs()) open(banner);

$('[data-cookie-accept]')?.addEventListener('click', () => {
  setPrefs({necessary:true, analytics:true, ts:Date.now()}); close(banner);
});
$('[data-cookie-custom]')?.addEventListener('click', () => { close(banner); open(modal); });
$('[data-cookie-save]')?.addEventListener('click', () => {
  const analytics = $('#cookie-analytics')?.checked || false;
  setPrefs({necessary:true, analytics, ts:Date.now()}); close(modal);
});
$('[data-cookie-close]')?.addEventListener('click', () => close(modal));
$('[data-open-cookie-read]')?.addEventListener('click', () => {
  dump.textContent = document.cookie || '(aucun cookie)'; open(reader);
});
$('[data-close-cookie-read]')?.addEventListener('click', () => close(reader));
