/* ==========================================================================
   Rana's Maths Lessons — shared sounds, mascots and helpers
   --------------------------------------------------------------------------
   Every lesson loads this file. It adds a small floating Home button and
   gives new lessons one shared toolkit:

     RM.sound.click() / correct() / wrong() / win() / pop()
     RM.say("Great job!")              read text aloud (lang optional: "ar")
     RM.mascot("owl")                  SVG text for a cartoon character
     RM.placeMascot(el, "owl")         put a character inside an element
     RM.cheer(el)                      bounce a mascot + correct sound
     RM.confetti()                     confetti burst for a finished game
     RM.check(button, isRight)         colour an answer tile + play a sound
     RM.muted / RM.setMuted(true)      shared mute (remembered per device)

   Characters: owl (Ollie), bear (Bobo), frog (Hoppy), robot (Zip).
   ========================================================================== */
(function () {
  "use strict";
  if (window.RM) return;

  // Where is the site root? Work it out from this script's own address.
  var me = document.currentScript ||
    Array.prototype.slice.call(document.scripts).filter(function (s) { return /shared\/theme\.js/.test(s.src); })[0];
  var ROOT = me ? me.src.replace(/shared\/theme\.js.*$/, "") : "";

  // ---------- Mute setting (per device) ----------
  var muted = false;
  try { muted = localStorage.getItem("rm-muted") === "1"; } catch (e) {}

  // ---------- Sounds (made in the browser, no files needed) ----------
  var ctx = null;
  function audio() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, type, vol) {
    var c = audio(); if (!c || muted) return;
    var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + start;
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  var sound = {
    click: function () { tone(660, 0, 0.08, "triangle", 0.15); },
    pop: function () { tone(880, 0, 0.06, "sine", 0.2); tone(1320, 0.05, 0.08, "sine", 0.15); },
    correct: function () { tone(523, 0, 0.12, "triangle"); tone(659, 0.1, 0.12, "triangle"); tone(784, 0.2, 0.22, "triangle"); },
    wrong: function () { tone(330, 0, 0.18, "sawtooth", 0.12); tone(247, 0.16, 0.26, "sawtooth", 0.12); },
    win: function () {
      [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(f, i * 0.12, 0.2, "triangle", 0.22); });
    }
  };

  // ---------- Read aloud ----------
  function say(text, lang) {
    if (muted || !("speechSynthesis" in window)) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang === "ar" ? "ar-SA" : (lang || "en-US");
      u.rate = 0.9; u.pitch = 1.1;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ---------- Cartoon characters ----------
  var EYES = '<circle cx="-14" cy="0" r="9" fill="#fff"/><circle cx="14" cy="0" r="9" fill="#fff"/>' +
             '<circle cx="-12" cy="1" r="4.5" fill="#2a2440"/><circle cx="16" cy="1" r="4.5" fill="#2a2440"/>' +
             '<circle cx="-10.5" cy="-1" r="1.5" fill="#fff"/><circle cx="17.5" cy="-1" r="1.5" fill="#fff"/>';
  var MASCOTS = {
    owl: { name: "Ollie the Owl", svg:
      '<ellipse cx="60" cy="68" rx="38" ry="42" fill="#8b5cf6"/>' +
      '<ellipse cx="60" cy="80" rx="24" ry="26" fill="#ddd0ff"/>' +
      '<path d="M26 34 L36 14 L46 32 Z M94 34 L84 14 L74 32 Z" fill="#8b5cf6"/>' +
      '<g transform="translate(60 52)">' + EYES + '</g>' +
      '<path d="M54 62 L60 72 L66 62 Z" fill="#ffc83d"/>' +
      '<path d="M48 108 l-6 8 M54 108 l0 9 M66 108 l0 9 M72 108 l6 8" stroke="#ffc83d" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="40" y="18" width="40" height="8" rx="3" fill="#2a2440"/><rect x="50" y="8" width="20" height="12" rx="2" fill="#2a2440"/>' +
      '<path d="M78 22 q8 6 6 16" stroke="#ffc83d" stroke-width="3" fill="none"/><circle cx="84" cy="39" r="3" fill="#ffc83d"/>' },
    bear: { name: "Bobo the Bear", svg:
      '<circle cx="30" cy="30" r="14" fill="#b7793f"/><circle cx="90" cy="30" r="14" fill="#b7793f"/>' +
      '<circle cx="30" cy="30" r="7" fill="#f2c69b"/><circle cx="90" cy="30" r="7" fill="#f2c69b"/>' +
      '<circle cx="60" cy="64" r="44" fill="#c98a4b"/>' +
      '<g transform="translate(60 54)">' + EYES + '</g>' +
      '<ellipse cx="60" cy="80" rx="18" ry="14" fill="#f2c69b"/>' +
      '<ellipse cx="60" cy="74" rx="6" ry="4.5" fill="#2a2440"/>' +
      '<path d="M52 84 q8 7 16 0" stroke="#2a2440" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<circle cx="34" cy="74" r="6" fill="#ff8fab" opacity=".6"/><circle cx="86" cy="74" r="6" fill="#ff8fab" opacity=".6"/>' },
    frog: { name: "Hoppy the Frog", svg:
      '<circle cx="38" cy="34" r="17" fill="#3fbf6a"/><circle cx="82" cy="34" r="17" fill="#3fbf6a"/>' +
      '<ellipse cx="60" cy="72" rx="48" ry="38" fill="#3fbf6a"/>' +
      '<g transform="translate(38 33)"><circle r="10" fill="#fff"/><circle cx="2" cy="1" r="5" fill="#2a2440"/><circle cx="3.5" cy="-1" r="1.6" fill="#fff"/></g>' +
      '<g transform="translate(82 33)"><circle r="10" fill="#fff"/><circle cx="2" cy="1" r="5" fill="#2a2440"/><circle cx="3.5" cy="-1" r="1.6" fill="#fff"/></g>' +
      '<path d="M32 74 q28 22 56 0" stroke="#1f7a42" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="60" cy="96" rx="26" ry="10" fill="#bff0cd"/>' +
      '<circle cx="26" cy="68" r="6" fill="#ff8fab" opacity=".55"/><circle cx="94" cy="68" r="6" fill="#ff8fab" opacity=".55"/>' },
    robot: { name: "Zip the Robot", svg:
      '<line x1="60" y1="8" x2="60" y2="24" stroke="#6b6585" stroke-width="4"/><circle cx="60" cy="8" r="6" fill="#ef4f5f"/>' +
      '<rect x="20" y="24" width="80" height="62" rx="18" fill="#5cc8ff"/>' +
      '<rect x="30" y="36" width="60" height="34" rx="12" fill="#e8f7ff"/>' +
      '<g transform="translate(60 52)">' + EYES + '</g>' +
      '<rect x="46" y="74" width="28" height="6" rx="3" fill="#2a2440"/>' +
      '<rect x="34" y="88" width="52" height="26" rx="10" fill="#3d7bff"/>' +
      '<circle cx="50" cy="101" r="4" fill="#ffc83d"/><circle cx="60" cy="101" r="4" fill="#2bb673"/><circle cx="70" cy="101" r="4" fill="#ef4f5f"/>' +
      '<rect x="12" y="44" width="8" height="22" rx="4" fill="#6b6585"/><rect x="100" y="44" width="8" height="22" rx="4" fill="#6b6585"/>' }
  };
  function mascot(name) {
    var m = MASCOTS[name] || MASCOTS.owl;
    return '<svg viewBox="0 0 120 120" role="img" aria-label="' + m.name + '">' + m.svg + '</svg>';
  }
  function placeMascot(el, name) {
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) return null;
    el.classList.add("rm-mascot");
    el.innerHTML = mascot(name || el.getAttribute("data-mascot") || "owl");
    return el;
  }
  function cheer(el) {
    if (typeof el === "string") el = document.querySelector(el);
    sound.correct();
    if (!el) return;
    el.classList.remove("is-happy"); void el.offsetWidth; el.classList.add("is-happy");
  }

  // ---------- Confetti ----------
  function confetti(n) {
    var box = document.createElement("div");
    box.className = "rm-confetti";
    var colors = ["#ff8a3d", "#2bb673", "#3d7bff", "#b44cff", "#ffc83d", "#ff6fb1"];
    for (var i = 0; i < (n || 80); i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
      p.style.animationDelay = Math.random() * 0.4 + "s";
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 3800);
  }

  // ---------- Answer checking helper ----------
  function check(btn, isRight) {
    if (btn) {
      btn.classList.remove("is-correct", "is-wrong"); void btn.offsetWidth;
      btn.classList.add(isRight ? "is-correct" : "is-wrong");
    }
    (isRight ? sound.correct : sound.wrong)();
    return isRight;
  }

  function setMuted(v) {
    muted = !!v; window.RM.muted = muted;
    try { localStorage.setItem("rm-muted", muted ? "1" : "0"); } catch (e) {}
    if (muted && "speechSynthesis" in window) speechSynthesis.cancel();
    var b = document.querySelector(".rm-dock [data-rm-mute]");
    if (b) { b.textContent = muted ? "🔇" : "🔊"; b.title = muted ? "Sound off" : "Sound on"; }
  }

  // ---------- Floating Home button (every page except the home page) ----------
  function dock() {
    if (document.body.hasAttribute("data-rm-no-dock") || document.querySelector(".rm-dock")) return;
    var d = document.createElement("nav");
    d.className = "rm-dock";
    d.setAttribute("aria-label", "Lesson library");
    d.innerHTML = '<a href="' + ROOT + 'index.html" title="All lessons" aria-label="Back to all lessons">🏠</a>';
    // New template lessons ask for the shared mute button with data-rm-sound on <body>.
    if (document.body.hasAttribute("data-rm-sound")) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("data-rm-mute", "");
      b.addEventListener("click", function () { setMuted(!muted); });
      d.appendChild(b);
    }
    document.body.appendChild(d);
    setMuted(muted);
  }

  window.RM = {
    root: ROOT, muted: muted, setMuted: setMuted,
    sound: sound, say: say,
    mascot: mascot, placeMascot: placeMascot, mascots: Object.keys(MASCOTS), cheer: cheer,
    confetti: confetti, check: check
  };

  function ready() {
    dock();
    Array.prototype.forEach.call(document.querySelectorAll("[data-mascot]"), function (el) { placeMascot(el); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
