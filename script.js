/* =========================================================
   ChipTuning Elvani — front-end logic
   ⚙️  NDRYSHO KONFIGURIMIN KËTU:
   ========================================================= */
const CONFIG = {
  phone:      "+381631222633",
  phoneLabel: "+381 63 122 2633",
  whatsapp:   "+381631222633",   // WA: vetëm numra (pastrohet automatikisht)
  email:      "info@chiptuning-elvani.com",
  address:    "Fshati Turi, Serbi"
};

CONFIG.whatsapp = String(CONFIG.whatsapp).replace(/\D/g, "");
if (CONFIG.whatsapp.length < 10) console.error("❌ CONFIG.whatsapp nuk është valid.");

function waUrl(message = "") {
  const base = `https://wa.me/${CONFIG.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/* ---------- Config në faqe ---------- */
document.querySelectorAll("#phoneLink, #callBtn").forEach(el => {
  el.href = `tel:${CONFIG.phone}`;
  if (el.id === "phoneLink") el.textContent = CONFIG.phoneLabel;
});
const emailLink = document.getElementById("emailLink");
if (emailLink) { emailLink.href = `mailto:${CONFIG.email}`; emailLink.textContent = CONFIG.email; }
const addressText = document.getElementById("addressText");
if (addressText) addressText.textContent = CONFIG.address;
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const waFloat = document.getElementById("waFloat");
function updateWaLink() {
  if (waFloat) waFloat.href = waUrl(window.I18N?.t("Përshëndetje, dua të rezervoj një termin.") || "Përshëndetje, dua të rezervoj një termin.");
}
updateWaLink();
window.I18N?.ready.then(updateWaLink);
window.addEventListener("elvani:languagechange", updateWaLink);

/* ---------- Nav ---------- */
const nav = document.getElementById("nav");
if (nav) window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 40));

const navToggle = document.getElementById("navToggle");
const navLinks  = document.getElementById("navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
}

const sections = [...document.querySelectorAll("main section[id]")];
const linkMap = {};
if (navLinks) navLinks.querySelectorAll("a").forEach(a => { linkMap[a.getAttribute("href").slice(1)] = a; });
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      Object.values(linkMap).forEach(l => l.classList.remove("active"));
      linkMap[e.target.id]?.classList.add("active");
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => obs.observe(s));

/* ---------- Shërbimet + popup me detaje ---------- */
// [ikona, titulli, përshkrim i shkurtër, përshkrim i gjatë, pikat kryesore, shërbimi në formular]
const SERVICES = [
  ["⚡","Stage 1 ECU Remapping","Kalibrim i softuerit për vetura standarde — më shumë fuqi, çift dhe ngasje më e këndshme.",
    "Optimizim i softuerit të ECU-së për vetura standarde, pa ndryshime hardware. Parametrat e karburantit, presionit të turbos dhe ndezjes përshtaten për të përmirësuar përgjigjen e motorit.",
    ["Më shumë fuqi dhe çift (rezultati varet nga motori)","Ngasje më e butë dhe përgjigje më e mirë e gazit","Vlerësohet gjendja teknike para punës"],"Stage 1"],
  ["🔥","Stage 2 Performance Tuning","Përshtatje e personalizuar për vetura me pjesë të ndryshuara: downpipe, marrje ajri, intercooler.",
    "Për vetura që kanë pjesë të ndryshuara, si downpipe, marrje ajri ose intercooler. Programi përshtatet me pjesët e montuara në veturën tënde.",
    ["Përshtatje sipas hardware-it të montuar","Kërkon gjendje të mirë teknike të motorit","Rezultatet varen nga pjesët dhe motori"],"Stage 2"],
  ["⚙️","ECU Optimization","Rikalibrim i karburantit, presionit të turbos dhe ndezjes për fuqi dhe efikasitet të balancuar.",
    "Rikalibrim i të dhënave në ECU, që synon një balancë mes fuqisë dhe efikasitetit sipas nevojave të tua.",
    ["Karburanti, presioni i turbos dhe ndezja","Balancë mes fuqisë dhe efikasitetit","Përshtatet me veturën dhe përdorimin tënd"],"ECU Remapping"],
  ["🧪","DPF Zgjidhje","Diagnostikim dhe zgjidhje të miratuara, aty ku lejohet me ligj.",
    "Diagnostikim i filtrit të grimcave (DPF) dhe zgjidhje të miratuara, aty ku lejohet me ligj.",
    ["Gjetja e shkakut të problemit","Zgjidhje në përputhje me rregullat","Këshillim para çdo ndërhyrjeje"],"DPF Diagnostikim / Riparim"],
  ["🔧","EGR Zgjidhje","Diagnostikim dhe zgjidhje në përputhje me rregullat, aty ku lejohet me ligj.",
    "Diagnostikim i valvulës dhe sistemit EGR, me zgjidhje në përputhje me rregullat, aty ku lejohet me ligj.",
    ["Gjetja e shkakut të problemit","Zgjidhje në përputhje me rregullat","Këshillim para çdo ndërhyrjeje"],"EGR Diagnostikim / Riparim"],
  ["💧","AdBlue Diagnostikim","Diagnostikim dhe riparim i saktë i sistemeve AdBlue/SCR.",
    "Diagnostikim dhe riparim i sistemit AdBlue/SCR, që zvogëlon emisionet e veturave me dizel.",
    ["Leximi i gabimeve dhe mesazheve","Gjetja e shkakut të defektit","Udhëzime për riparimin"],"Diagnostikim Automobilistik"],
  ["🖥️","DTC Diagnostikim","Lexim, interpretim dhe udhëzime riparimi për kodet e gabimit.",
    "Leximi dhe interpretimi i kodeve të gabimit (DTC) që ruan vetura, për të kuptuar çfarë po ndodh.",
    ["Leximi i kodeve nga modulet","Shpjegim i qartë i shkakut të mundshëm","Udhëzime për riparim"],"Diagnostikim Automobilistik"],
  ["🔍","Diagnostikim i Veturës","Kontroll i plotë i motorit, transmisionit dhe elektronikës.",
    "Kontroll i përgjithshëm i gjendjes së veturës: motori, transmisioni dhe sistemet elektronike.",
    ["Kontroll i sistemeve elektronike","Pasqyrë e gjendjes së veturës","Rekomandim për hapat e ardhshëm"],"Diagnostikim Automobilistik"],
  ["⚙️","DSG / TCU Tuning","Ndërrime më të shpejta e më të buta dhe përballim më i mirë i çiftit në kutitë automatike.",
    "Optimizim i njësisë së kutisë automatike (TCU), për ndërrime më të shpejta dhe më të buta dhe përballim më të mirë të çiftit.",
    ["Ndërrime më të shpejta dhe më të buta","Përballim më i mirë i çiftit","Për kuti DSG dhe automatike të tjera"],"DSG / TCU Tuning"],
  ["🏁","Optimizim i Performancës","Paketa të përshtatura për qëllimet e tua, në mënyrë të besueshme.",
    "Paketë e përshtatur sipas qëllimit tënd: bashkë vendosim çfarë ka kuptim për veturën tënde.",
    ["Këshillim para se të vendosim","Zgjidhje sipas veturës dhe qëllimit","Rezultate të kontrolluara"],"Chip Tuning"]
];

const servicesGrid = document.getElementById("servicesGrid");
if (servicesGrid) {
  servicesGrid.innerHTML = SERVICES.map(([icon, title, desc], i) => `
    <article class="card service-card reveal" data-svc="${i}" tabindex="0" role="button"
             aria-haspopup="dialog" aria-label="${title}">
      <div class="service-icon" aria-hidden="true">${icon}</div>
      <h3>${title}</h3>
      <p>${desc}</p>
      <span class="link-arrow">Mëso më shumë <span aria-hidden="true">→</span></span>
    </article>`).join("");

  /* --- Popup --- */
  const st = document.createElement("style");
  st.textContent = `
    .svc-modal{position:fixed;inset:0;z-index:10000;display:none;place-items:center;padding:20px;background:rgba(3,5,9,.82);backdrop-filter:blur(6px)}
    .svc-modal.open{display:grid;animation:svcFade .2s ease}
    .svc-box{position:relative;width:min(560px,100%);max-height:calc(100vh - 40px);overflow-y:auto;padding:34px 32px 28px;background:#10151e;border-top:3px solid #ff3b30;box-shadow:0 30px 90px rgba(0,0,0,.7);clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))}
    .svc-close{position:absolute;top:10px;right:14px;width:40px;height:40px;border:0;background:none;color:#fff;font-size:28px;cursor:pointer}
    .svc-close:hover{color:#ff6a3d}
    .svc-ico{display:grid;place-items:center;width:56px;height:56px;margin-bottom:16px;background:rgba(47,128,255,.14);font-size:1.8rem}
    .svc-box h3{font-family:var(--font-head);font-size:1.6rem;margin-bottom:12px;padding-right:30px}
    .svc-box p{color:#b9c1cf;line-height:1.8;margin-bottom:16px}
    .svc-box ul{list-style:none;margin:0 0 18px;padding:0}
    .svc-box li{position:relative;padding-left:26px;margin-bottom:10px;color:#dbe2ee;font-size:.95rem}
    .svc-box li::before{content:"";position:absolute;left:0;top:.5em;width:13px;height:7px;border-left:2px solid #ff3b30;border-bottom:2px solid #ff3b30;transform:rotate(-45deg)}
    .svc-note{font-size:.8rem!important;color:#7f8a9c!important;margin-bottom:20px!important}
    .svc-actions{display:flex;flex-wrap:wrap;gap:10px}
    @keyframes svcFade{from{opacity:0}to{opacity:1}}
    @media(prefers-reduced-motion:reduce){.svc-modal.open{animation:none}}
    @media(max-width:520px){.svc-box{padding:28px 20px 22px}.svc-actions .btn{width:100%}}`;
  document.head.appendChild(st);

  const modal = document.createElement("div");
  modal.className = "svc-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="svc-box" role="dialog" aria-modal="true" aria-labelledby="svcTitle">
      <button type="button" class="svc-close" aria-label="Mbyll">×</button>
      <div class="svc-ico" id="svcIco" aria-hidden="true"></div>
      <h3 id="svcTitle"></h3>
      <p id="svcText"></p>
      <ul id="svcList"></ul>
      <p class="svc-note">Rezultatet varen nga vetura dhe gjendja e saj teknike dhe nuk janë të garantuara.</p>
      <div class="svc-actions">
        <button type="button" class="btn btn-accent" id="svcBook">Rezervo termin</button>
        <a class="btn btn-wa" id="svcWa" target="_blank" rel="noopener noreferrer">Pyet në WhatsApp</a>
      </div>
    </div>`;
  document.body.appendChild(modal);

  let lastFocus = null, current = null;
  const closeBtn = modal.querySelector(".svc-close");

  function openSvc(i, trigger) {
    const [icon, title, , long, points, formValue] = SERVICES[i];
    current = formValue;
    lastFocus = trigger;
    modal.querySelector("#svcIco").textContent = icon;
    modal.querySelector("#svcTitle").textContent = title;
    modal.querySelector("#svcText").textContent = long;
    modal.querySelector("#svcList").innerHTML = points.map(p => `<li>${p}</li>`).join("");
    modal.querySelector("#svcWa").href = waUrl(`${window.I18N?.t("Përshëndetje, dua informacione për:") || "Përshëndetje, dua informacione për:"} ${window.I18N?.t(title) || title}`);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function closeSvc() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocus?.focus?.();
  }

  servicesGrid.addEventListener("click", e => {
    const card = e.target.closest(".service-card");
    if (card) openSvc(Number(card.dataset.svc), card);
  });
  servicesGrid.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".service-card");
    if (card) { e.preventDefault(); openSvc(Number(card.dataset.svc), card); }
  });
  closeBtn.addEventListener("click", closeSvc);
  modal.addEventListener("click", e => { if (e.target === modal) closeSvc(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSvc(); });

  modal.querySelector("#svcBook").addEventListener("click", () => {
    const sel = document.getElementById("c_service");
    if (sel && current) sel.value = current;      // zgjedh shërbimin automatikisht në formular
    lastFocus = null;
    closeSvc();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------- Galeria ----------
   Vendosi fotot e tua në: assets/gallery/gallery-1.jpg … gallery-9.jpg
   Nëse një foto mungon, shfaqet kutia me emrin "Foto N". */
const GALLERY = Array.from({ length: 9 }, (_, i) => `assets/gallery/gallery-${i + 1}.jpg`);
const galleryGrid = document.getElementById("galleryGrid");
if (galleryGrid) {
  galleryGrid.innerHTML = GALLERY.map((src, i) => `
    <button class="gal-item" data-index="${i}" aria-label="Hap fotografinë ${i + 1}">
      <span>Foto ${i + 1}</span>
      <img src="${src}" alt="Fotografi ${i + 1} nga puna jonë" loading="lazy"
           style="position:absolute;inset:0" onerror="this.remove()">
    </button>`).join("");
}

const lightbox = document.getElementById("lightbox");
const lbImg = lightbox ? lightbox.querySelector("img") : null;
if (galleryGrid && lightbox && lbImg) {
  galleryGrid.addEventListener("click", e => {
    const btn = e.target.closest(".gal-item");
    if (!btn || !btn.querySelector("img")) return;   // pa foto → nuk hapet
    const i = Number(btn.dataset.index);
    lbImg.src = GALLERY[i];
    lbImg.alt = `Fotografi ${i + 1}`;
    lightbox.classList.add("open");
  });
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox || e.target.classList.contains("lb-close")) lightbox.classList.remove("open");
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") lightbox.classList.remove("open"); });
}

/* ---------- Kalkulatori ---------- */
const brandSel  = document.getElementById("brand");
const modelSel  = document.getElementById("model");
const engineSel = document.getElementById("engine");
const hpInput   = document.getElementById("hp");
const stageSel  = document.getElementById("stage");
const resultBox = document.getElementById("calcResult");

if (brandSel && modelSel && engineSel && hpInput && stageSel && resultBox) {
  const V = () => window.VEHICLES || {};
  Object.keys(V()).forEach(b => brandSel.add(new Option(b, b)));

  brandSel.addEventListener("change", () => {
    modelSel.innerHTML = '<option value="">Zgjidh modelin</option>';
    engineSel.innerHTML = '<option value="">Zgjidh motorin</option>';
    hpInput.value = ""; stageSel.value = "";
    modelSel.disabled = !brandSel.value;
    engineSel.disabled = hpInput.disabled = stageSel.disabled = true;
    resultBox.innerHTML = '<p class="muted center">Vazhdo zgjedhjen…</p>';
    Object.keys(V()[brandSel.value] || {}).forEach(m => modelSel.add(new Option(m, m)));
  });

  modelSel.addEventListener("change", () => {
    engineSel.innerHTML = '<option value="">Zgjidh motorin</option>';
    hpInput.value = ""; stageSel.value = "";
    const data = V()[brandSel.value]?.[modelSel.value];
    engineSel.disabled = !data;
    hpInput.disabled = stageSel.disabled = true;
    if (data) data.engines.forEach(en => engineSel.add(new Option(en, en)));
  });

  engineSel.addEventListener("change", () => {
    const data = V()[brandSel.value]?.[modelSel.value];
    if (!data || !engineSel.value) return;
    const m = engineSel.value.match(/(\d+)\s*hp/i);
    hpInput.value = m ? m[1] : data.base_hp;
    hpInput.disabled = stageSel.disabled = false;
    stageSel.value = "";
    resultBox.innerHTML = '<p class="muted center">Zgjidh Stage për të parë vlerësimin.</p>';
  });

  hpInput.addEventListener("input", computeResult);
  stageSel.addEventListener("change", computeResult);

  function computeResult() {
    const hp = Number(hpInput.value);
    const stage = stageSel.value;
    if (!hp || !stage) {
      resultBox.innerHTML = '<p class="muted center">Plotëso HP dhe Stage.</p>';
      return;
    }
    const data = V()[brandSel.value]?.[modelSel.value] || {};
    const tqMatch = engineSel.value.match(/(\d+)\s*nm/i);   // çifti merret nga motori
    const baseTq = tqMatch ? Number(tqMatch[1]) : (data.base_tq || Math.round(hp * 2));
    const mult = stage === "1" ? { hp: 1.20, tq: 1.25 } : { hp: 1.30, tq: 1.35 };
    const newHp = Math.round(hp * mult.hp);
    const newTq = Math.round(baseTq * mult.tq);

    resultBox.innerHTML = `
      <h3 style="margin:0 0 .4em;font-family:var(--font-head)">${window.I18N?.t("Vlerësim Stage") || "Vlerësim Stage"} ${stage}</h3>
      <p class="result-headline">+${newHp - hp} HP</p>
      <div class="result-row"><span>HP origjinale</span><strong>${hp} HP</strong></div>
      <div class="result-row"><span>HP e vlerësuar</span><strong>${newHp} HP</strong></div>
      <div class="result-row"><span>Shtesa e fuqisë</span><strong>+${newHp - hp} HP (+${Math.round((newHp / hp - 1) * 100)}%)</strong></div>
      <div class="result-row"><span>Çifti origjinal</span><strong>${baseTq} Nm</strong></div>
      <div class="result-row"><span>Çifti i vlerësuar</span><strong>${newTq} Nm</strong></div>
      <p class="muted small" style="margin-top:1em">⚠️ Vlerësime ilustruese — jo të garantuara. Rezultatet reale varen nga vetura, motori dhe gjendja.</p>`;
  }
}

/* ---------- Formulari → WhatsApp ---------- */
const contactForm = document.getElementById("contactForm");
const formStatus  = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    formStatus.textContent = "";
    formStatus.classList.remove("error");

    const f = new FormData(contactForm);
    const g = k => (f.get(k) || "").toString().trim();
    const name = g("name"), phone = g("phone"), email = g("email"), brand = g("brand"),
          model = g("model"), engine = g("engine"),
          service = contactForm.querySelector('[name="service"]')?.selectedOptions?.[0]?.textContent?.trim() || g("service"),
          message = g("message");

    const tr = source => window.I18N?.t(source) || source;
    const errs = [];
    if (!name) errs.push(tr("Emri mungon"));
    if (!/^[0-9+\s()\-]{6,25}$/.test(phone)) errs.push(tr("Telefoni nuk është valid"));
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errs.push(tr("Email nuk është valid"));
    if (!brand || !model) errs.push(tr("Marka dhe modeli janë të detyrueshme"));
    if (!service) errs.push(tr("Zgjidh një shërbim"));

    if (errs.length) {
      formStatus.textContent = "❌ " + errs.join(" · ");
      formStatus.classList.add("error");
      return;
    }

    const lines = [
      `*${window.I18N?.t("Rezervim i ri — ChipTuning Elvani") || "Rezervim i ri — ChipTuning Elvani"}*`, "",
      `👤 ${window.I18N?.t("Emri:") || "Emri:"} ${name}`, `📞 ${window.I18N?.t("Telefon:") || "Telefon:"} ${phone}`,
      email ? `✉️ ${window.I18N?.t("Email:") || "Email:"} ${email}` : "", "",
      `🚗 ${window.I18N?.t("Vetura:") || "Vetura:"} ${brand} ${model}${engine ? " — " + engine : ""}`,
      `🔧 ${window.I18N?.t("Shërbimi:") || "Shërbimi:"} ${service}`,
      message ? `\n💬 ${window.I18N?.t("Mesazh:") || "Mesazh:"}\n${message}` : ""
    ].filter(Boolean);

    formStatus.textContent = "✅ Po hapet WhatsApp me mesazhin tënd…";
    window.open(waUrl(lines.join("\n")), "_blank", "noopener");
    contactForm.reset();
  });
}

/* ---------- Reveal ---------- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

/* ---------- Numëruesit (vetëm për elementet me data-target) ----------
   Më parë shfaqte "NaN" te ECU / DPF / TCU kur faqja bënte scroll. */
function animateCounter(el) {
  const target = Number(el.dataset.target);
  if (!target) return;
  const dur = 1600, start = performance.now();
  (function step(t) {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
const statsEl = document.querySelector(".stats");
if (statsEl) {
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".stat-num[data-target]").forEach(animateCounter);
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  statsObs.observe(statsEl);
}
