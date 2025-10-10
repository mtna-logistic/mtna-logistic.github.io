/* ====== Utilitaires ====== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Menu mobile */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* Douceur scroll pour ancres */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      menu?.classList.remove('open');
    }
  });
});

/* ====== Envoi du formulaire via EmailJS ======
   1) Crée un compte gratuit sur https://www.emailjs.com/
   2) Ajoute un "Email Service" (SMTP OVH ou Gmail)
   3) Crée un "Email Template" avec les variables: name, email, phone, message
   4) Récupère:
      - PUBLIC_KEY
      - SERVICE_ID
      - TEMPLATE_ID
   5) Remplace les valeurs ci-dessous.
*/
const EMAILJS_PUBLIC_KEY = "REMPLACE_TON_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "REMPLACE_TON_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "REMPLACE_TON_TEMPLATE_ID";

if (typeof emailjs !== 'undefined') {
  try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {}
}

const form = document.getElementById('quoteForm');
const statusEl = document.getElementById('formStatus');

function setStatus(msg, ok=false) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#19c3d8' : '#9bb0bd';
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name:  form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim()
    };

    // Sécurité basique côté client
    if (!data.name || !data.email || !data.message) {
      setStatus("Merci de remplir les champs requis.");
      return;
    }

    setStatus("Envoi en cours…");

    // Si EmailJS non configuré -> fallback mailto
    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.startsWith("REMPLACE")) {
      window.location.href =
        `mailto:contact@mtna-logistic.com?subject=Demande de devis ` +
        `&body=Nom: ${encodeURIComponent(data.name)}%0AEmail: ${encodeURIComponent(data.email)}%0ATéléphone: ${encodeURIComponent(data.phone)}%0A%0A${encodeURIComponent(data.message)}`;
      setStatus("Votre logiciel mail s'ouvre. Si rien ne se passe, écrivez à contact@mtna-logistic.com");
      return;
    }

    try {
      const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data);
      if (res.status === 200) {
        setStatus("Message envoyé ✅ — nous revenons vers vous rapidement.", true);
        form.reset();
      } else {
        setStatus("Impossible d'envoyer maintenant. Réessayez ou écrivez à contact@mtna-logistic.com");
      }
    } catch (err) {
      setStatus("Erreur d’envoi. Utilisez l’adresse contact@mtna-logistic.com", false);
      console.error(err);
    }
  });
}
