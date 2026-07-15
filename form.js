/* Electrize - free-estimate wizard (9 steps) + reviews renderer.
   Demo build: on submit it routes to the thank-you page. No data is stored
   or sent anywhere. Swap testimonials for the client's live reviews. */
(function () {
  var TOTAL = 9;
  var BLUE = "#2563eb";
  var PHONE = "(310) 408-3448";
  var mount = document.getElementById("estimate-form");

  var state = {
    step: 1,
    serviceType: "", situation: "", isHomeowner: "", timeline: "",
    hasOtherEstimates: "", propertyAddress: "", bestCallbackTime: "",
    firstName: "", lastName: "", email: "", phone: "", city: "",
    smsConsent1: false, smsConsent2: false
  };

  var OPT = "flex items-center justify-between px-4 py-3.5 rounded-lg border text-left text-sm font-medium transition-all cursor-pointer";
  var INPUT = "w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#2563eb] transition-colors bg-white placeholder-gray-400 text-gray-800";
  var LABEL = "text-xs font-bold uppercase tracking-wide text-gray-700 block mb-1";

  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]; }); }

  function optionButton(label, selected, emoji) {
    var cls = OPT + (selected
      ? " border-[#2563eb] bg-blue-50 text-[#2563eb]"
      : " border-gray-200 bg-white text-gray-800 hover:border-blue-300");
    var ring = "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 " +
      (selected ? "border-[#2563eb]" : "border-gray-400");
    var dot = selected ? '<span class="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>' : "";
    var left = emoji
      ? '<span class="flex items-center gap-3"><span class="text-lg" aria-hidden="true">' + emoji + '</span><span>' + esc(label) + '</span></span>'
      : '<span>' + esc(label) + '</span>';
    return '<button type="button" data-opt="' + esc(label) + '" class="' + cls + '">' +
      left + '<span class="' + ring + '">' + dot + '</span></button>';
  }

  function questionStep(question, field, opts) {
    var html = '<div class="flex flex-col gap-2 fade-in">' +
      '<p class="text-sm font-bold text-[#1a1a1a]">' + esc(question) + '</p>';
    for (var i = 0; i < opts.length; i++) {
      var o = opts[i];
      if (typeof o === "string") html += optionButton(o, state[field] === o);
      else html += optionButton(o.label, state[field] === o.label, o.emoji);
    }
    return html + '</div>';
  }

  function progressBar() {
    var pct = Math.round(state.step / TOTAL * 100);
    return '<div><div class="flex justify-between text-xs text-gray-500 mb-1.5">' +
      '<span>Step ' + state.step + ' of ' + TOTAL + '</span><span>' + pct + '% complete</span></div>' +
      '<div class="w-full bg-gray-200 rounded-full h-1.5">' +
      '<div class="h-1.5 rounded-full transition-all duration-500" style="width:' + pct + '%;background:' + BLUE + '"></div>' +
      '</div></div>';
  }

  var CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M20 6 9 17l-5-5"></path></svg>';

  function consentRow(field, marketing) {
    var checked = state[field];
    var box = "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors " +
      (checked ? "bg-[#2563eb] border-[#2563eb]" : "border-gray-400 bg-white");
    var word = marketing ? "Marketing and Promotional" : "Automated Reminders and Service Based";
    return '<label class="flex items-start gap-3 cursor-pointer">' +
      '<button type="button" data-consent="' + field + '" class="' + box + '">' + (checked ? CHECK : "") + '</button>' +
      '<span class="text-xs text-gray-600 leading-relaxed">I agree to receive ' + word +
      ' messages from Electrize' + (marketing ? "" : ",") + ' at the phone number provided above. ' +
      "This agreement isn't a condition of any purchase. Msg &amp; data rates may apply, message frequencies vary. " +
      'Text <strong>HELP</strong> to <strong>' + PHONE + '</strong> for assistance, reply <strong>STOP</strong> or OUT to opt out or unsubscribe at any time.</span></label>';
  }

  function continueButton(disabled) {
    return '<button type="button" data-continue="1"' + (disabled ? " disabled" : "") +
      ' class="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40" style="background:' + BLUE + '">Continue <span aria-hidden="true">&rarr;</span></button>';
  }

  function stepBody() {
    switch (state.step) {
      case 1: return questionStep("What type of electrical work do you need?", "serviceType", [
        { label: "Panel Upgrade", emoji: "⚡" },
        { label: "EV Charger Installation", emoji: "🔌" },
        { label: "Wiring or Rewiring", emoji: "🔧" },
        { label: "Lighting or Ceiling Fans", emoji: "💡" },
        { label: "New Construction", emoji: "🏗️" },
        { label: "Not Sure / Need Assessment", emoji: "🤔" }
      ]);
      case 2: return questionStep("What best describes your situation?", "situation",
        ["Flickering lights or dead outlets", "Adding new circuits or outlets", "Need more electrical capacity", "Planning a remodel or new build", "Just need an inspection"]);
      case 3: return questionStep("Are you the homeowner?", "isHomeowner", ["Yes", "No"]);
      case 4: return questionStep("How soon do you need this done?", "timeline",
        ["ASAP", "In the Next Few Weeks", "Within 30 Days", "Just Planning Ahead"]);
      case 5: return questionStep("Have you received any other electrical estimates?", "hasOtherEstimates", ["Yes", "No"]);
      case 6: return '<div class="flex flex-col gap-3 fade-in"><div>' +
        '<label class="' + LABEL + '">Property Address <span class="text-red-500">*</span></label>' +
        '<p class="text-xs text-gray-500 mb-2">(helps us check local permit requirements before your visit)</p>' +
        '<input type="text" data-field="propertyAddress" value="' + esc(state.propertyAddress) + '" placeholder="123 Main St, Torrance, CA" class="' + INPUT + '" />' +
        '</div>' + continueButton(!state.propertyAddress) + '</div>';
      case 7: return questionStep("When is the best time to give you a call back?", "bestCallbackTime",
        ["Morning", "Afternoon", "Evening"]);
      case 8: return '<div class="flex flex-col gap-3 fade-in"><div>' +
        '<label class="' + LABEL + '">What city is the property in? <span class="text-red-500">*</span></label>' +
        '<input type="text" data-field="city" value="' + esc(state.city) + '" placeholder="Torrance" class="' + INPUT + '" />' +
        '</div>' + continueButton(!state.city) + '</div>';
      case 9:
        var canSubmit = state.firstName && state.lastName && state.email && state.phone;
        return '<div class="flex flex-col gap-4 fade-in">' +
          '<div><p class="text-xs font-bold uppercase tracking-widest mb-1" style="color:#ebad25">Step 9 · Almost Done!</p>' +
          '<p class="text-lg font-bold text-[#1a1a1a]" style="font-family:var(--font-heading)">Where should we send your free estimate?</p>' +
          "<p class=\"text-xs text-gray-500 mt-1\">Enter your details below and we'll call you within 24 hours.</p></div>" +
          '<div class="grid grid-cols-2 gap-3">' +
          '<div><label class="' + LABEL + '">First Name <span class="text-red-500">*</span></label>' +
          '<input type="text" data-field="firstName" value="' + esc(state.firstName) + '" placeholder="John" class="' + INPUT + '" /></div>' +
          '<div><label class="' + LABEL + '">Last Name <span class="text-red-500">*</span></label>' +
          '<input type="text" data-field="lastName" value="' + esc(state.lastName) + '" placeholder="Smith" class="' + INPUT + '" /></div></div>' +
          '<div><label class="' + LABEL + '">Phone Number <span class="text-red-500">*</span></label>' +
          '<input type="tel" data-field="phone" value="' + esc(state.phone) + '" placeholder="(310) 555-1234" class="' + INPUT + '" /></div>' +
          '<div><label class="' + LABEL + '">Email Address <span class="text-red-500">*</span></label>' +
          '<input type="email" data-field="email" value="' + esc(state.email) + '" placeholder="john@email.com" class="' + INPUT + '" /></div>' +
          consentRow("smsConsent1", false) + consentRow("smsConsent2", true) +
          '<button type="button" data-submit="1"' + (canSubmit ? "" : " disabled") +
          ' class="mt-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40" style="background:' + BLUE + '">Get My Free Estimate <span aria-hidden="true">&rarr;</span></button>' +
          '<p class="text-xs text-gray-400 text-center">No obligation · Free estimate · Licensed &amp; insured</p></div>';
    }
    return "";
  }

  function render() {
    if (!mount) return;
    var back = state.step > 1
      ? '<button type="button" data-back="1" class="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors self-start"><span aria-hidden="true">&larr;</span> Back</button>'
      : "";
    mount.innerHTML =
      '<div class="flex flex-col gap-5">' +
      '<div class="text-center">' +
      '<h3 class="text-lg font-bold text-[#1a1a1a] leading-snug" style="font-family:var(--font-heading)">Request A Free Electrical Estimate</h3>' +
      "<p class=\"text-sm text-gray-500 mt-1.5 leading-relaxed\">Tell us about your project and we'll get you a fast, no-obligation estimate from a licensed electrician.</p></div>" +
      progressBar() + stepBody() + back +
      '</div>';
    wire();
  }

  function advance() { state.step = Math.min(state.step + 1, TOTAL); render(); }
  function goBack() { state.step = Math.max(state.step - 1, 1); render(); }

  function wire() {
    mount.querySelectorAll("[data-opt]").forEach(function (b) {
      b.addEventListener("click", function () {
        var field = { 1: "serviceType", 2: "situation", 3: "isHomeowner", 4: "timeline",
          5: "hasOtherEstimates", 7: "bestCallbackTime" }[state.step];
        state[field] = b.getAttribute("data-opt");
        render();
        setTimeout(advance, 220);
      });
    });
    mount.querySelectorAll("[data-field]").forEach(function (inp) {
      inp.addEventListener("input", function () {
        state[inp.getAttribute("data-field")] = inp.value;
        var cont = mount.querySelector("[data-continue]");
        if (cont) cont.disabled = !(state.step === 6 ? state.propertyAddress : state.city);
        var sub = mount.querySelector("[data-submit]");
        if (sub) sub.disabled = !(state.firstName && state.lastName && state.email && state.phone);
      });
    });
    var cont = mount.querySelector("[data-continue]");
    if (cont) cont.addEventListener("click", function () { if (!cont.disabled) advance(); });
    mount.querySelectorAll("[data-consent]").forEach(function (c) {
      c.addEventListener("click", function () { state[c.getAttribute("data-consent")] = !state[c.getAttribute("data-consent")]; render(); });
    });
    var sub = mount.querySelector("[data-submit]");
    if (sub) sub.addEventListener("click", function () {
      if (sub.disabled) return;
      window.location.href = "thank-you.html"; // demo: no capture
    });
    var back = mount.querySelector("[data-back]");
    if (back) back.addEventListener("click", goBack);
  }

  render();

  /* ---- Testimonials (placeholder, swap for live reviews) ---- */
  var grid = document.getElementById("reviews-grid");
  if (grid) {
    var STAR = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" stroke-width="2" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>';
    var stars = STAR + STAR + STAR + STAR + STAR;
    var reviews = [
      { name: "Michael R.", city: "Torrance, CA", text: "Upgraded our old 100-amp panel to 200 amps and installed a Level 2 EV charger the same day. Clean work, fair flat-rate price, and they pulled all the permits. Highly recommend." },
      { name: "Sarah L.", city: "Redondo Beach, CA", text: "We had flickering lights and a few dead outlets for months. Their electrician found the issue fast, rewired the affected circuits, and explained everything. Professional and on time." },
      { name: "David P.", city: "Palos Verdes, CA", text: "Used Electrize for the electrical on our home remodel. Great communication, always on schedule, and the inspector passed everything on the first try. Would use again." }
    ];
    grid.innerHTML = reviews.map(function (r) {
      return '<div class="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white p-6 flex flex-col gap-4">' +
        '<div class="flex gap-0.5">' + stars + '</div>' +
        '<p class="text-gray-600 text-sm leading-relaxed italic">"' + r.text + '"</p>' +
        '<div class="mt-auto"><p class="font-semibold text-[#1a1a1a] text-sm">' + r.name + '</p>' +
        '<p class="text-xs text-gray-500">' + r.city + '</p></div></div>';
    }).join("");
  }
})();
