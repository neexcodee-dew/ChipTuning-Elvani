(() => {
  "use strict";

  // Replace a node with a clean clone so no other script can leave a second
  // click handler on it (a double toggle would open and instantly close the chat).
  function fresh(element) {
    if (!element || !element.parentNode) return element;
    const clone = element.cloneNode(true);
    element.replaceWith(clone);
    return clone;
  }

  const widget = document.querySelector(".chat-widget");
  const panel = document.getElementById("chatPanel");
  const launcher = fresh(document.getElementById("chatLauncher"));
  const closeButton = fresh(document.getElementById("chatClose"));
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  if (!widget || !panel || !launcher || !closeButton || !form || !input || !messages) return;

  const phone = "+381 63 122 2633";
  const whatsappNumber = "381631222633";
  const userLog = [];
  let missedReplies = 0;
  let isOpen = false;

  function pathValue(object, path) {
    return path.split(".").reduce((value, part) => value?.[part], object);
  }

  function chatDictionary() {
    try {
      return window.I18N?.getDictionary()?.chatbot || {};
    } catch {
      return {};
    }
  }

  function tr(path) {
    return pathValue(chatDictionary(), path) ?? path;
  }

  function format(text) {
    return String(text).replaceAll("{phone}", phone);
  }

  function whatsappLink() {
    const intro = userLog.length ? tr("whatsappHistoryPrefix") : tr("whatsappPrefix");
    const context = userLog.length ? `${intro} ${userLog.slice(-4).join(" | ")}` : intro;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(context)}`;
  }

  function scrollToLatest() {
    messages.scrollTop = messages.scrollHeight;
  }

  function toggleChat(force) {
    isOpen = typeof force === "boolean" ? force : !isOpen;

    // The panel state is set first, so nothing below can stop it from opening.
    panel.classList.toggle("open", isOpen);
    panel.setAttribute("aria-hidden", String(!isOpen));
    launcher.setAttribute("aria-expanded", String(isOpen));

    try {
      launcher.setAttribute("aria-label", tr(isOpen ? "close" : "open"));
      panel.setAttribute("aria-label", tr("panelLabel"));
      closeButton.setAttribute("aria-label", tr("close"));
    } catch { /* labels are optional */ }

    if (isOpen) {
      scrollToLatest();
      setTimeout(() => input.focus({ preventScroll: true }), 350);
    }
  }

  function makeAction(actionKey) {
    const action = pathValue(chatDictionary(), `actions.${actionKey}`);
    if (!action) return null;

    let element;
    if (action.whatsapp) {
      element = document.createElement("a");
      element.href = whatsappLink();
      element.target = "_blank";
      element.rel = "noopener noreferrer";
      element.className = "wa";
    } else if (action.href) {
      element = document.createElement("a");
      element.href = action.href;
      element.addEventListener("click", () => toggleChat(false));
    } else {
      element = document.createElement("button");
      element.type = "button";
      element.addEventListener("click", () => ask(tr(`questions.${action.question}`)));
    }
    element.textContent = action.label;
    element.setAttribute("aria-label", action.label);
    return element;
  }

  function renderBotMessage(message) {
    const responseKey = message.dataset.chatResponse;
    const responseText = responseKey === "welcome" ? tr("welcome") : tr(`responses.${responseKey}`);
    message.textContent = format(responseText);

    const actionKeys = (message.dataset.chatActions || "").split(",").filter(Boolean);
    if (!actionKeys.length) return;
    const actionBox = document.createElement("div");
    actionBox.className = "chat-actions";
    actionKeys.forEach(key => {
      const action = makeAction(key);
      if (action) actionBox.appendChild(action);
    });
    message.appendChild(actionBox);
  }

  function renderLanguage() {
    widget.querySelectorAll("[data-chat-copy]").forEach(element => {
      element.textContent = tr(element.dataset.chatCopy);
    });

    widget.querySelectorAll("[data-chat-quick]").forEach(element => {
      const key = element.dataset.chatQuick;
      const option = pathValue(chatDictionary(), `quickReplies.${key}`);
      if (!option) return;
      element.textContent = option.label;
      element.setAttribute("aria-label", option.label);
      if (option.href) element.href = option.href;
    });

    input.placeholder = tr("inputPlaceholder");
    input.setAttribute("aria-label", tr("inputLabel"));
    form.querySelector('button[type="submit"]')?.setAttribute("aria-label", tr("sendLabel"));
    panel.setAttribute("aria-label", tr("panelLabel"));
    closeButton.setAttribute("aria-label", tr("close"));
    launcher.setAttribute("aria-label", tr(isOpen ? "close" : "open"));
    messages.querySelectorAll(".chat-message.bot[data-chat-response]").forEach(renderBotMessage);
    messages.querySelectorAll(".chat-typing").forEach(element => {
      element.setAttribute("aria-label", tr("typing"));
      const description = element.querySelector(".sr-only");
      if (description) description.textContent = tr("typing");
    });
  }

  function addUserMessage(text) {
    const message = document.createElement("div");
    message.className = "chat-message user";
    message.setAttribute("data-no-i18n", "");
    message.textContent = text;
    messages.appendChild(message);
    scrollToLatest();
  }

  function addBotMessage(responseKey, actionKeys = []) {
    const message = document.createElement("div");
    message.className = "chat-message bot";
    message.dataset.chatResponse = responseKey;
    message.dataset.chatActions = actionKeys.join(",");
    messages.appendChild(message);
    renderBotMessage(message);
    scrollToLatest();
  }

  const normalize = value => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const routes = [
    [/^(pershendetje|tungjatjeta|miredita|mirembrema|ckemi|hello|hi|hey|ciao|zdravo|dobar dan|dobro jutro)\b/, "greeting", ["services", "price", "book"]],
    [/faleminderit|rrofsh|flm|thanks|thank you|hvala/, "thanks", ["book", "whatsapp"]],
    [/cmim|kushton|pagese|euro|oferte|price|how much|cost|cena|kosta/, "price", ["whatsapp", "form"]],
    [/termin|rezerv|caktoj|takim|appointment|book|schedule|zakaz|termina/, "appointment", ["form", "whatsapp"]],
    [/working hours|opening hours|hours|orar|hapur|mbyllur|kur punoni|ora sa|radno vreme|otvoreno/, "hours", ["whatsapp"]],
    [/where are you|location|address|map|ku jeni|adres|lokacion|vendndodh|ku gjendeni|turi|harta|gde se|lokacija|mapa/, "location", ["form", "whatsapp"]],
    [/phone|number|call|telefon|numri|numer|thirr|whatsapp|instagram|kontakt/, "contact", ["whatsapp", "book"]],
    [/stage\s*2|stage dy/, "stage2", ["price", "calculator", "whatsapp"]],
    [/stage\s*1|stage nje/, "stage1", ["price", "calculator", "stage2"]],
    [/\bstage\b/, "stageGeneral", ["stage1", "stage2"]],
    [/chip|ecu|remap|programim/, "chip", ["stage1", "stage2", "calculator"]],
    [/dpf|filter/, "dpf", ["diagnostics", "whatsapp"]],
    [/egr/, "egr", ["diagnostics", "whatsapp"]],
    [/adblue|scr/, "adblue", ["whatsapp", "form"]],
    [/dsg|tcu|gearbox|transmission|menjac|kuti|automatik/, "gearbox", ["price", "whatsapp"]],
    [/diagnos|dtc|fault|warning|check engine|defekt|problem|llambe|gabim|kontroll|dijagnost|gres|kvar/, "diagnostics", ["book", "whatsapp"]],
    [/coding|kodim|kodiranj/, "coding", ["whatsapp", "form"]],
    [/sa hp|sa kal|fuqi|kalkulator|calculator|performance|potential|torque|power|sa nm|performanse/, "calculator", ["calculator", "whatsapp"]],
    [/garanci|warranty|risk|safe|safety|damage|demton|demtim|ostec|bezbed/, "safety", ["whatsapp", "book"]],
    [/services|service|offer|provide|usluge|nudite|sherbim|ofroni|bëni|beni|cfare be|what do you offer/, "services", ["stage1", "stage2", "diagnostics"]]
  ];

  function answer(text) {
    const normalized = normalize(text);
    for (const [pattern, response, actions] of routes) {
      if (pattern.test(normalized)) {
        missedReplies = 0;
        return { response, actions };
      }
    }
    missedReplies += 1;
    return missedReplies >= 2
      ? { response: "escalate", actions: ["whatsapp"] }
      : { response: "fallback", actions: ["services", "price", "book"] };
  }

  function ask(text) {
    const messageText = String(text || "").trim();
    if (!messageText) {
      addBotMessage("empty");
      return;
    }
    addUserMessage(messageText);
    userLog.push(messageText);

    const typing = document.createElement("div");
    typing.className = "chat-message bot chat-typing";
    typing.setAttribute("role", "status");
    typing.setAttribute("aria-label", tr("typing"));
    typing.innerHTML = '<i></i><i></i><i></i><span class="sr-only"></span>';
    typing.querySelector(".sr-only").textContent = tr("typing");
    messages.appendChild(typing);
    scrollToLatest();

    let result;
    try { result = answer(messageText); }
    catch { result = { response: "error", actions: ["whatsapp"] }; }
    setTimeout(() => {
      typing.remove();
      addBotMessage(result.response, result.actions);
    }, 700);
  }

  widget.addEventListener("click", event => {
    const option = event.target.closest("[data-chat-quick]");
    if (!option) return;
    const item = pathValue(chatDictionary(), `quickReplies.${option.dataset.chatQuick}`);
    if (!item) return;
    if (item.whatsapp) {
      event.preventDefault();
      window.open(whatsappLink(), "_blank", "noopener,noreferrer");
    } else if (item.question) {
      event.preventDefault();
      ask(tr(`questions.${item.question}`));
    } else if (item.href) {
      toggleChat(false);
    }
  });

  launcher.addEventListener("click", () => toggleChat());
  closeButton.addEventListener("click", () => toggleChat(false));
  document.addEventListener("keydown", event => { if (event.key === "Escape" && isOpen) toggleChat(false); });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const text = input.value;
    input.value = "";
    if (!text.trim()) { input.focus(); addBotMessage("empty"); return; }
    ask(text);
  });
  panel.querySelector("#chatWaLink")?.addEventListener("click", function () { this.href = whatsappLink(); });
  window.addEventListener("elvani:languagechange", renderLanguage);

  try {
    const ready = window.I18N?.ready;
    if (ready && typeof ready.then === "function") ready.then(renderLanguage).catch(() => {});
    else renderLanguage();
  } catch { /* the chat still works without translations */ }
})();