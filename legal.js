(() => {
  "use strict";
  const main = document.getElementById("legalMain");
  if (!main || !window.I18N) return;
  const pageKey = main.dataset.legalPage;
  const titleKey = { privacy: "privacy", cookies: "cookies", terms: "terms" }[pageKey];

  function render() {
    const page = window.I18N.getDictionary().legal?.[titleKey];
    if (!page) return;
    document.title = `${page.title} | ChipTuning Elvani`;
    main.replaceChildren();
    const heading = document.createElement("p");
    heading.className = "eyebrow";
    heading.textContent = "ChipTuning Elvani · Informacion ligjor";
    const title = document.createElement("h1");
    title.textContent = page.title;
    const intro = document.createElement("p");
    intro.className = "legal-intro";
    intro.textContent = page.intro;
    const note = document.createElement("aside");
    note.className = "legal-owner-note";
    note.textContent = pageKey === "cookies"
      ? "Shënim për pronarin: verifikoni inventarin e cookies dhe plotësoni fushat para publikimit."
      : "Shënim për pronarin: kjo është përmbajtje model. Plotësoni vendet e shënuara me [[...]] dhe verifikoni para publikimit.";
    const sections = document.createElement("div");
    sections.className = "legal-sections";
    page.sections.forEach(([headingText, bodyText]) => {
      const section = document.createElement("section");
      const h2 = document.createElement("h2");
      h2.textContent = headingText;
      const p = document.createElement("p");
      p.textContent = bodyText;
      section.append(h2, p);
      sections.append(section);
    });
    main.append(heading, title, intro, note, sections);
  }

  document.getElementById("legalYear").textContent = new Date().getFullYear();
  window.I18N.ready.then(render);
  window.addEventListener("elvani:languagechange", render);
})();
