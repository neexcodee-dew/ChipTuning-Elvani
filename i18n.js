(() => {
  "use strict";
  const supported = ["sq", "en", "sr"];
  const dictionaries = {};
  const textSources = new WeakMap();
  const attrSources = new WeakMap();
  const STORAGE = "elvani_language";
  const CONSENT_STORAGE = "elvani_cookie_consent";
  const CONSENT_VERSION = "2026-11-15-v1";
  let language = "sq";

  function phraseFor(source) {
    const phrases = dictionaries[language]?.phrases || {};
    const normalized = source.replace(/\s+/g, " ");
    return phrases[normalized] || phrases[normalized.replace(/[^\x00-\x7F]/g, "?")];
  }

  function hasFunctionalConsent() {
    try {
      const consent = JSON.parse(localStorage.getItem(CONSENT_STORAGE) || "null");
      return consent?.version === CONSENT_VERSION && typeof consent.timestamp === "string" &&
        consent.categories?.necessary === true && consent.categories.functional === true;
    }
    catch { return false; }
  }

  function translateTextNode(node) {
    if (!node.parentElement || node.parentElement.closest("script,style,[data-no-i18n]")) return;
    if (!textSources.has(node)) textSources.set(node, node.nodeValue);
    const source = textSources.get(node);
    const trimmed = source.trim();
    if (!trimmed) return;
    const lookup = trimmed.replace(/\s+/g, " ");
    const found = phraseFor(lookup);
    const translated = found || lookup;
    if (translated !== trimmed) {
      const start = source.match(/^\s*/)?.[0] || "";
      const end = source.match(/\s*$/)?.[0] || "";
      const output = start + translated + end;
      if (node.nodeValue !== output) node.nodeValue = output;
    } else if (node.nodeValue !== source && !found) {
      node.nodeValue = source;
    }
  }

  const translatableAttributes = ["aria-label", "aria-description", "title", "placeholder", "alt", "data-chat"];
  function translateElement(element) {
    if (!(element instanceof Element) || element.closest("[data-no-i18n]")) return;
    const dict = dictionaries[language]?.attributes || {};
    for (const name of translatableAttributes) {
      if (!element.hasAttribute(name)) continue;
      let sources = attrSources.get(element);
      if (!sources) { sources = new Map(); attrSources.set(element, sources); }
      if (!sources.has(name)) sources.set(name, element.getAttribute(name));
      const source = sources.get(name);
      const fallback = source.replace(/[^\x00-\x7F]/g, "?");
      element.setAttribute(name, dict[source] || dict[fallback] || phraseFor(source) || source);
    }
  }

  function apply(root = document.body) {
    if (!root || !dictionaries[language]) return;
    if (root.nodeType === Node.TEXT_NODE) { translateTextNode(root); return; }
    if (root.nodeType === Node.ELEMENT_NODE) translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
    if (root.querySelectorAll) root.querySelectorAll("*").forEach(translateElement);
    updateLanguageButtons();
  }

  function updateLanguageButtons() {
    document.querySelectorAll("[data-language]").forEach(button => {
      const selected = button.dataset.language === language;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function updateMetadata() {
    const meta = dictionaries[language]?.meta;
    if (!meta) return;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.ogTitle || meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.ogDescription || meta.description);
  }

  function setLanguage(next) {
    if (!supported.includes(next)) return;
    if (!dictionaries[next]) { ready.then(() => setLanguage(next)); return; }
    language = next;
    document.documentElement.lang = next;
    apply(document.body);
    updateMetadata();
    try {
      if (hasFunctionalConsent()) localStorage.setItem(STORAGE, language);
      else localStorage.removeItem(STORAGE);
    } catch {}
    window.dispatchEvent(new CustomEvent("elvani:languagechange", { detail: { language } }));
  }

  async function load() {
    await Promise.all(supported.map(async code => {
      const response = await fetch(`./translations/${code}.json`, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Could not load ${code} translations`);
      dictionaries[code] = await response.json();
    }));
    let saved = null;
    if (hasFunctionalConsent()) {
      try { saved = localStorage.getItem(STORAGE); } catch {}
    }
    language = supported.includes(saved) ? saved : "sq";
    document.documentElement.lang = language;
    apply(document.body);
    updateMetadata();
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "characterData") translateTextNode(record.target);
        for (const node of record.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) apply(node);
        }
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    window.dispatchEvent(new CustomEvent("elvani:i18nready"));
  }

  const ready = load().catch(error => {
    console.error("Translation system could not start:", error);
    dictionaries.sq ||= { code: "sq", phrases: {}, attributes: {}, legal: {} };
  });

  window.I18N = {
    ready,
    get language() { return language; },
    get supported() { return [...supported]; },
    t(source) { return phraseFor(source) || source; },
    getDictionary() { return dictionaries[language] || dictionaries.sq || {}; },
    setLanguage,
    apply
  };

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-language]");
    if (button) setLanguage(button.dataset.language);
  });
  window.addEventListener("elvani:consentchange", () => {
    try {
      if (hasFunctionalConsent()) localStorage.setItem(STORAGE, language);
      else localStorage.removeItem(STORAGE);
    } catch {}
  });
})();
