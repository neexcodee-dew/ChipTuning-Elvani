(() => {
  "use strict";
  const STORAGE_KEY = "elvani_cookie_consent";
  const CONSENT_VERSION = "2026-11-15-v1";
  const categories = ["functional", "analytics", "marketing"];
  const optionalScripts = [];
  let saved = null;

  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch {}
  if (!isCurrentConsent(saved)) saved = null;

  function isCurrentConsent(value) {
    return !!value && value.version === CONSENT_VERSION && typeof value.timestamp === "string" &&
      value.categories?.necessary === true &&
      categories.every(category => typeof value.categories[category] === "boolean");
  }

  const layer = document.createElement("div");
  layer.className = "consent-layer";
  layer.hidden = true;
  layer.innerHTML = `
    <section class="consent-dialog" role="dialog" aria-modal="true" aria-labelledby="consentTitle" aria-describedby="consentDescription">
      <div class="consent-view consent-summary" id="consentSummary">
        <div class="consent-icon" aria-hidden="true">🍪</div>
        <div class="consent-copy">
          <p class="consent-eyebrow">${"Privatësia juaj ka rëndësi për ne"}</p>
          <h2 id="consentTitle">Privatësia juaj ka rëndësi për ne</h2>
          <p id="consentDescription">Ne përdorim ruajtje të nevojshme për funksionimin e faqes. Me pëlqimin tuaj, përdorim edhe cookies funksionale, analitike ose të marketingut. Zgjedhjen mund ta ndryshoni në çdo kohë.</p>
          <a class="consent-policy" href="privacy.html">Politika e Privatësisë</a>
        </div>
        <div class="consent-actions">
          <button type="button" class="btn btn-accent" data-consent-action="accept">Prano të gjitha</button>
          <button type="button" class="btn btn-ghost" data-consent-action="reject">Refuzo opsionalet</button>
          <button type="button" class="btn consent-customize" data-consent-action="customize">Personalizo cookies</button>
        </div>
      </div>
      <div class="consent-view consent-settings" id="consentSettings" hidden>
        <div class="consent-settings-head">
          <div class="consent-icon" aria-hidden="true">🍪</div>
          <div><p class="consent-eyebrow">${"E drejta juaj për privatësi"}</p><h2 id="settingsTitle">Cilësimet e cookies</h2></div>
        </div>
        <div class="consent-categories">
          <article class="consent-category">
            <div><h3>Cookies striktisht të nevojshme</h3><p>Të nevojshme për funksionimin bazë dhe ruajtjen e zgjedhjes suaj. Gjithmonë aktive.</p></div>
            <label class="consent-switch"><input type="checkbox" checked disabled aria-label="Cookies striktisht të nevojshme"><span class="switch-ui"></span><span class="sr-only">Gjithmonë aktive</span></label>
          </article>
          <article class="consent-category">
            <div><h3>Cookies funksionale</h3><p>Mbajnë mend gjuhën dhe cilësimet tuaja. Gjuha ruhet vetëm kur aktivizohen.</p></div>
            <label class="consent-switch"><input type="checkbox" id="consentFunctional" aria-label="Cookies funksionale"><span class="switch-ui"></span></label>
          </article>
          <article class="consent-category">
            <div><h3>Cookies analitike</h3><p>Na ndihmojnë të kuptojmë trafikun dhe përdorimin e faqes. Nuk aktivizohen pa pëlqimin tuaj.</p></div>
            <label class="consent-switch"><input type="checkbox" id="consentAnalytics" aria-label="Cookies analitike"><span class="switch-ui"></span></label>
          </article>
          <article class="consent-category">
            <div><h3>Cookies të marketingut</h3><p>Përdoren për matjen e reklamave dhe gjurmimin e marketingut. Nuk aktivizohen pa pëlqimin tuaj.</p></div>
            <label class="consent-switch"><input type="checkbox" id="consentMarketing" aria-label="Cookies të marketingut"><span class="switch-ui"></span></label>
          </article>
        </div>
        <div class="consent-settings-actions">
          <button type="button" class="btn btn-ghost" data-consent-action="back">Kthehu</button>
          <button type="button" class="btn btn-ghost" data-consent-action="reject">Refuzo opsionalet</button>
          <button type="button" class="btn btn-accent" data-consent-action="save">Ruaj zgjedhjen</button>
          <button type="button" class="btn consent-customize" data-consent-action="accept">Prano të gjitha cookies</button>
        </div>
      </div>
    </section>`;
  document.body.appendChild(layer);

  function t(source) { return window.I18N?.t(source) || source; }
  function preferencesFromToggles() {
    return {
      necessary: true,
      functional: layer.querySelector("#consentFunctional").checked,
      analytics: layer.querySelector("#consentAnalytics").checked,
      marketing: layer.querySelector("#consentMarketing").checked
    };
  }
  function writeConsent(prefs) {
    saved = {
      categories: { necessary: true, functional: !!prefs.functional, analytics: !!prefs.analytics, marketing: !!prefs.marketing },
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    layer.hidden = true;
    document.body.classList.remove("consent-open");
    window.dispatchEvent(new CustomEvent("elvani:consentchange", { detail: { ...saved, categories: { ...saved.categories } } }));
    runAllowedScripts();
  }
  function openSettings() {
    const p = saved?.categories || { functional: false, analytics: false, marketing: false };
    layer.querySelector("#consentFunctional").checked = p.functional === true;
    layer.querySelector("#consentAnalytics").checked = p.analytics === true;
    layer.querySelector("#consentMarketing").checked = p.marketing === true;
    layer.querySelector("#consentSummary").hidden = true;
    layer.querySelector("#consentSettings").hidden = false;
    layer.hidden = false;
    document.body.classList.add("consent-open");
    window.I18N?.apply(layer);
    layer.querySelector("#consentFunctional").focus();
  }
  function openNotice() {
    layer.querySelector("#consentSettings").hidden = true;
    layer.querySelector("#consentSummary").hidden = false;
    layer.hidden = false;
    document.body.classList.add("consent-open");
    window.I18N?.apply(layer);
    layer.querySelector('[data-consent-action="accept"]').focus();
  }
  function rejectOptional() { writeConsent({ functional: false, analytics: false, marketing: false }); }
  function acceptAll() { writeConsent({ functional: true, analytics: true, marketing: true }); }
  function runAllowedScripts() {
    if (!saved) return;
    for (const entry of optionalScripts) {
      if (saved.categories[entry.category] && !entry.loaded) {
        entry.loaded = true;
        entry.load();
      } else if (!saved.categories[entry.category] && entry.loaded) {
        entry.revoke?.();
        entry.loaded = false;
      }
    }
  }

  layer.addEventListener("click", event => {
    const button = event.target.closest("[data-consent-action]");
    if (!button) return;
    switch (button.dataset.consentAction) {
      case "accept": acceptAll(); break;
      case "reject": rejectOptional(); break;
      case "customize": openSettings(); break;
      case "back": openNotice(); break;
      case "save": writeConsent(preferencesFromToggles()); break;
    }
  });
  layer.addEventListener("keydown", event => {
    if (event.key !== "Tab" || layer.hidden) return;
    const focusable = [...layer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.closest("[hidden]") && element.getClientRects().length);
    if (!focusable.length) { event.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !layer.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !layer.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });
  document.addEventListener("click", event => {
    if (event.target.closest("[data-cookie-settings]")) {
      event.preventDefault();
      openSettings();
    }
  });
  window.addEventListener("elvani:consentchange", () => { saved = readSaved(); });
  function readSaved() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return isCurrentConsent(value) ? value : null;
    } catch { return null; }
  }

  // Future optional vendors must be registered here; their script is not requested before category consent.
  const consentApi = {
    version: CONSENT_VERSION,
    getConsent: () => readSaved(),
    openSettings,
    register(category, load, revoke = null) {
      if (!categories.includes(category) || typeof load !== "function") throw new TypeError("Register an optional category and a loader callback.");
      const entry = { category, load, revoke, loaded: false };
      optionalScripts.push(entry);
      runAllowedScripts();
      return () => { if (entry.loaded) entry.revoke?.(); const index = optionalScripts.indexOf(entry); if (index >= 0) optionalScripts.splice(index, 1); };
    },
    loadScript(category, src, attributes = {}) {
      let script = null;
      return this.register(category, () => {
        script = document.createElement("script");
        script.src = src;
        script.async = true;
        for (const [key, value] of Object.entries(attributes)) script.setAttribute(key, String(value));
        document.head.appendChild(script);
      }, () => { script?.remove(); script = null; });
    }
  };
  window.CookieConsent = consentApi;

  window.I18N?.ready.then(() => {
    window.I18N.apply(layer);
    const current = readSaved();
    if (!isCurrentConsent(current)) openNotice();
  });
})();
