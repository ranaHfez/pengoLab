/* ==========================================================================
   Rana's Maths Lessons — the home page (index.html)
   --------------------------------------------------------------------------
   Grade tabs, lesson cards, "Who is learning?", badges, Pengo's prizes,
   the daily challenge, the learning map, certificates, the welcome tour,
   dark mode and the English / Arabic switch.
   Everything a child does is saved on this device only (localStorage).
   ========================================================================== */
(function () {
  "use strict";
  var C = window.CATALOG;
  var P = window.RM && RM.progress;
  // A browser can still hold an older shared/theme.js for a few minutes after an update.
  if (P && !P.gradeOf) P.gradeOf = function () { return ""; };
  var IMG = "shared/img/";
  var TOOLS = C.tools || [];
  var $ = function (id) { return document.getElementById(id); };

  function get(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function getJSON(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function setJSON(k, v) { set(k, JSON.stringify(v)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function href(h) { return h.split("/").map(encodeURIComponent).join("/"); }
  function isArabic(s) { return /[؀-ۿ]/.test(s); }
  function sound(n) { if (window.RM) RM.sound[n](); }
  function today(offset) {
    var d = new Date(); d.setDate(d.getDate() + (offset || 0));
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  // ======================================================================
  // Words in English and Arabic
  // ======================================================================
  // The home page is in English. (The Arabic words below are kept in case Rana wants the switch back.)
  var lang = "en";
  var WORDS = {
    en: {
      title: "Maths Lessons Library", kicker: "enVision Math · Grades 1–3", search: "🔎 Find a lesson…",
      helpBtn: "❓ How to use", langBtn: "عربي", langName: "Switch to Arabic", dark: "Dark mode", light: "Light mode",
      g: "Grade {g}", games: "Games", tools: "Student Tools", toolsNote: "Tools you can use in any lesson.",
      lessonNo: "Lesson {n}", opened: "✓ Opened", done: "⭐ Done", newRibbon: "New!",
      noLessons: "No lessons yet", noMatch: "No lessons match “{q}”.",
      who: "Who is learning today?", whoSub: "Your stars are saved on this device.",
      removeHead: "Tap a name to remove it", removeSub: "Their stars on this device will be deleted.",
      newName: "➕ New name", guest: "Just looking", removeName: "Remove a name", finished: "Done",
      firstName: "Your first name", myGrade: "My grade:", pickFriend: "Pick a friend", save: "Save", cancel: "Cancel",
      tapGrade: "👆 Tap your grade", sayTapGrade: "Tap your grade",
      hi: "Welcome back, {n}! 👋", hiNew: "Hi, {n}! 👋", sayHi: "Welcome back, {n}! I'm so happy to see you.", sayWelcome: "Welcome, {n}! Let's learn maths together.",
      sayTry: "Try again! You can do it.", sayBadge: "Wow! You earned a new badge!", sayCert: "Congratulations! You finished the whole topic!",
      stats: "✓ {o} opened · ⭐ {d} finished", whichGrade: "Which grade are you in?", notMe: "Not {n}?",
      notSaving: "Progress is not being saved.", chooseMe: "Choose my name",
      confirmRemove: "Remove {n} and their stars from this device?",
      badgesBtn: "🏅 My badges", nextPrize: "🎁 Pengo's next prize: {n} more", allPrizes: "🎉 Pengo has every prize!",
      badgesTitle: "My badges", myPengo: "My Pengo", locked: "Keep going!", close: "Close", newBadge: "New badge!",
      daily: "🎯 Daily challenge", dailyFor: "Grade {g}", dailyPick: "👆 Tap your grade to see today's challenge!", dailyRight: "Yes! Great job! 🎉", dailyWrong: "Try again! 💪",
      dailyDone: "You did today's challenge! Come back tomorrow.", streak: "🔥 {n} days in a row", streak1: "🔥 1 day — come back tomorrow!", sayGreat: "Great job!",
      list: "📋 List", map: "🗺️ Map", topicN: "Topic {n}", youAreHere: "You are here!", mapHint: "Tap a stop to see its lessons.",
      certBanner: "🏆 You opened every lesson in this topic!", certBtn: "Get my certificate",
      certTitle: "Certificate of Achievement", certFor: "This certificate is proudly given to", certDid: "for completing",
      certTeacher: "Teacher", print: "🖨️ Print",
      aboutTitle: "About the teacher",
      aboutText: "Hello! I'm T. Rana Elsisi, a primary maths teacher. I made these lessons and games so children can learn maths by playing, at school and at home. Every lesson follows the enVision Math book for Grades 1–3. Have fun learning with Pengo!",
      footer: "T. Rana Elsisi",
      tour: ["Hi! I'm Pengo 🐧 Welcome to the Maths Lessons Library!",
             "First, tap your name or add a new one. Then your stars are saved.",
             "Now pick your grade and open a lesson. Have fun!"],
      tourNext: "Next ▶", tourGo: "Let's go! 🚀", tourSkip: "Skip", tourAgain: "🐧 Show me the tour",
      helpTitle: "How to use",
      helpSteps: [
        "<b>Say who you are.</b> Tap your name. New here? Tap <b>➕ New name</b>, type your first name, pick a friend, tap your grade and tap <b>Save</b>. Your grade's lessons open for you.",
        "<b>Find a lesson.</b> Tap your grade, open a topic and tap a lesson. You can also type in the 🔎 box, or tap <b>🗺️ Map</b>.",
        "<b>Learn and play!</b> Tap 🏠 at the bottom of a lesson to come back here.",
        "<b>See your progress.</b> A lesson you opened gets <span class=\"pill done\">✓ Opened</span>. A lesson you finished gets <span class=\"pill star\">⭐ Done</span>.",
        "<b>Collect prizes.</b> Earn 🏅 badges, dress up Pengo, do the 🎯 daily challenge and print a 🏆 certificate when you finish a topic."
      ],
      helpSafe: "Keep your progress safe",
      helpTips: [
        "📱 Your stars are saved <b>on this device, in this browser</b>. Use the same one next time.",
        "🧹 Clearing the browser history, or a private window, removes your stars.",
        "👫 Sharing a tablet? Tap <b>Not …?</b> and choose your own name before you start.",
        "🧑‍🏫 Teacher on the board? Tap <b>Just looking</b> so nothing is saved.",
        "🔒 Use only your first name. Nothing is sent over the internet."
      ],
      gotIt: "Got it! 👍",
      kinds: {}
    },
    ar: {
      title: "مكتبة دروس الرياضيات", kicker: "enVision Math · الصفوف 1–3", search: "🔎 ابحث عن درس…",
      helpBtn: "❓ طريقة الاستخدام", langBtn: "English", langName: "التبديل إلى الإنجليزية", dark: "الوضع الليلي", light: "الوضع النهاري",
      g: "الصف {g}", games: "الألعاب", tools: "أدوات الطالب", toolsNote: "أدوات تستخدمها في أي درس.",
      lessonNo: "الدرس {n}", opened: "✓ فتحته", done: "⭐ أنهيته", newRibbon: "جديد!",
      noLessons: "لا توجد دروس بعد", noMatch: "لا توجد دروس تطابق “{q}”.",
      who: "من يتعلّم اليوم؟", whoSub: "نجومك تُحفظ على هذا الجهاز.",
      removeHead: "اضغط على الاسم لحذفه", removeSub: "ستُحذف نجومه من هذا الجهاز.",
      newName: "➕ اسم جديد", guest: "أتفرّج فقط", removeName: "حذف اسم", finished: "تم",
      firstName: "اسمك الأول", myGrade: "صفّي:", pickFriend: "اختر صديقًا", save: "حفظ", cancel: "إلغاء",
      tapGrade: "👆 اختر صفّك", sayTapGrade: "اختر صفّك",
      hi: "أهلاً بعودتك يا {n}! 👋", hiNew: "مرحبًا يا {n}! 👋", sayHi: "أهلاً بعودتك يا {n}! سعيدة جدًا برؤيتك.", sayWelcome: "أهلاً بك يا {n}! هيا نتعلّم الرياضيات معًا.",
      sayTry: "حاول مرة أخرى! أنت تستطيع.", sayBadge: "رائع! حصلت على وسام جديد!", sayCert: "مبروك! أنهيت الموضوع كله!",
      stats: "✓ فتحت: {o} · ⭐ أنهيت: {d}", whichGrade: "في أي صف أنت؟", notMe: "لست {n}؟",
      notSaving: "التقدّم لا يُحفظ الآن.", chooseMe: "اختر اسمي",
      confirmRemove: "حذف {n} ونجومه من هذا الجهاز؟",
      badgesBtn: "🏅 أوسمتي", nextPrize: "🎁 جائزة بينغو التالية: باقي {n}", allPrizes: "🎉 بينغو حصل على كل الجوائز!",
      badgesTitle: "أوسمتي", myPengo: "بينغو الخاص بي", locked: "استمر!", close: "إغلاق", newBadge: "وسام جديد!",
      daily: "🎯 تحدي اليوم", dailyFor: "الصف {g}", dailyPick: "👆 اختر صفّك لترى تحدي اليوم!", dailyRight: "أحسنت! 🎉", dailyWrong: "حاول مرة أخرى! 💪",
      dailyDone: "أنجزت تحدي اليوم! عُد غدًا.", streak: "🔥 أيام متتالية: {n}", sayGreat: "أحسنت!",
      list: "📋 قائمة", map: "🗺️ خريطة", topicN: "الموضوع {n}", youAreHere: "أنت هنا!", mapHint: "اضغط على محطة لترى دروسها.",
      certBanner: "🏆 فتحت كل دروس هذا الموضوع!", certBtn: "احصل على شهادتي",
      certTitle: "شهادة إنجاز", certFor: "تُمنح هذه الشهادة بكل فخر إلى", certDid: "لإتمام",
      certTeacher: "المعلمة", print: "🖨️ طباعة",
      aboutTitle: "عن المعلمة",
      aboutText: "مرحبًا! أنا المعلمة رنا السيسي، معلمة رياضيات للمرحلة الابتدائية. صمّمت هذه الدروس والألعاب ليتعلّم الأطفال الرياضيات وهم يلعبون، في المدرسة وفي البيت. كل درس يتبع كتاب enVision Math للصفوف 1–3. استمتعوا بالتعلّم مع بينغو!",
      footer: "المعلمة رنا السيسي",
      tour: ["مرحبًا! أنا بينغو 🐧 أهلاً بك في مكتبة دروس الرياضيات!",
             "أولاً، اضغط على اسمك أو أضف اسمًا جديدًا، لتُحفظ نجومك.",
             "الآن اختر صفّك وافتح درسًا. استمتع!"],
      tourNext: "التالي ◀", tourGo: "هيا بنا! 🚀", tourSkip: "تخطَّ", tourAgain: "🐧 أعد الجولة",
      helpTitle: "طريقة الاستخدام",
      helpSteps: [
        "<b>قل من أنت.</b> اضغط على اسمك. جديد هنا؟ اضغط <b>➕ اسم جديد</b>، اكتب اسمك الأول، اختر صديقًا، اختر صفّك ثم اضغط <b>حفظ</b>. ستُفتح دروس صفّك.",
        "<b>ابحث عن درس.</b> اختر صفّك، افتح موضوعًا واضغط على درس. يمكنك أيضًا الكتابة في مربع 🔎 أو الضغط على <b>🗺️ خريطة</b>.",
        "<b>تعلّم والعب!</b> اضغط 🏠 أسفل الدرس للعودة إلى هنا.",
        "<b>شاهد تقدّمك.</b> الدرس الذي فتحته يظهر عليه <span class=\"pill done\">✓ فتحته</span>، والدرس الذي أنهيته يظهر عليه <span class=\"pill star\">⭐ أنهيته</span>.",
        "<b>اجمع الجوائز.</b> اربح 🏅 الأوسمة، ألبس بينغو، حلّ 🎯 تحدي اليوم واطبع 🏆 شهادة عندما تنهي موضوعًا."
      ],
      helpSafe: "حافظ على تقدّمك",
      helpTips: [
        "📱 نجومك تُحفظ <b>على هذا الجهاز وفي هذا المتصفح</b>. استخدم نفسه في المرة القادمة.",
        "🧹 مسح سجل المتصفح أو استخدام نافذة خاصة يحذف نجومك.",
        "👫 تتشارك جهازًا لوحيًا؟ اضغط <b>لست …؟</b> واختر اسمك قبل أن تبدأ.",
        "🧑‍🏫 معلمة على السبورة؟ اضغطي <b>أتفرّج فقط</b> كي لا يُحفظ شيء.",
        "🔒 استخدم اسمك الأول فقط. لا يُرسل أي شيء عبر الإنترنت."
      ],
      gotIt: "فهمت! 👍",
      kinds: {
        "Interactive lesson": "درس تفاعلي", "Lesson plan": "خطة درس", "Games": "ألعاب", "Practice game": "لعبة تدريب",
        "Video": "فيديو", "Quiz": "اختبار", "Interactive tool": "أداة تفاعلية", "Printable PDF": "ملف للطباعة",
        "Printable poster": "ملصق للطباعة"
      }
    }
  };
  function t(key, vars) {
    var s = WORDS[lang][key]; if (s == null) s = WORDS.en[key];
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  function kindName(k) { return WORDS[lang].kinds[k] || k; }
  // "3 lessons" / "3 دروس" with the right word for each number
  var NOUNS = {
    lesson: { en: ["lesson", "lessons"], ar: ["درس", "درسان", "دروس", "درسًا"] },
    game: { en: ["game", "games"], ar: ["لعبة", "لعبتان", "ألعاب", "لعبة"] },
    tool: { en: ["tool", "tools"], ar: ["أداة", "أداتان", "أدوات", "أداة"] }
  };
  function count(n, noun) {
    var w = NOUNS[noun][lang];
    if (lang === "en") return n + " " + (n === 1 ? w[0] : w[1]);
    if (n === 1) return w[0] + " واحد" + (noun === "lesson" ? "" : "ة");
    if (n === 2) return w[1];
    return n + " " + (n >= 3 && n <= 10 ? w[2] : w[3]);
  }
  // Spoken sentences: Rana's recording if there is one (shared/voice/), otherwise the computer voice.
  function speak(id, text) {
    if (!window.RM) return;
    var l = lang === "ar" ? "ar" : undefined;
    if (RM.voice) RM.voice(id, text, l); else RM.say(text, l);
  }

  // ======================================================================
  // Grades, tabs and lesson cards
  // ======================================================================
  var GRADE = {
    1: { color: "var(--rm-g1)", art: "grade-1.jpg", alt: "Grade 1: Pengo with ten frames and a number line" },
    2: { color: "var(--rm-g2)", art: "grade-2.jpg", alt: "Grade 2: Pengo with a hundred chart, coins and a clock" },
    3: { color: "var(--rm-g3)", art: "grade-3.jpg", alt: "Grade 3: Pengo with an array of apples, 3 × 4 = 12" },
    games: { color: "var(--rm-games)", icon: "icon-game.png" },
    tools: { color: "var(--rm-pink)", icon: "icon-print.png", side: "teacher-and-pengo.jpg", sideAlt: "A teacher and Pengo looking at a hundred chart" }
  };
  function gradeLabel(k) { return k === "games" ? t("games") : k === "tools" ? t("tools") : t("g", { g: k }); }
  var KIND_ICON = { "Games": "icon-game.png", "Practice game": "icon-game.png", "Quiz": "icon-quiz.png", "Printable PDF": "icon-print.png", "Printable poster": "icon-print.png" };
  var tabs = $("tabs"), view = $("view"), search = $("search");

  var counts = { games: C.games.length, tools: TOOLS.length };
  C.grades.forEach(function (g) {
    counts[g.grade] = 0;
    g.topics.forEach(function (tp) { counts[g.grade] += tp.lessons.length; });
  });
  var keys = C.grades.map(function (g) { return String(g.grade); }).concat(["games"]).concat(TOOLS.length ? ["tools"] : []);
  var current = get("rm-home-tab", "1");
  if (P && P.current() && P.gradeOf(P.current())) current = P.gradeOf(P.current());   // start in the child's own grade
  if (keys.indexOf(current) < 0) current = "1";
  var mode = get("rm-home-view", "list") === "map" ? "map" : "list";
  var openTopic = null;

  function buildTabs() {
    tabs.innerHTML = "";
    keys.forEach(function (k) {
      var G = GRADE[k], b = document.createElement("button"), wide = !G.art;
      var n = wide ? count(counts[k], k === "games" ? "game" : "tool") : count(counts[k], "lesson");
      b.className = "pick" + (wide ? " wide" : ""); b.type = "button"; b.setAttribute("role", "tab"); b.dataset.key = k;
      b.style.setProperty("--c", G.color);
      b.setAttribute("aria-label", gradeLabel(k) + ", " + n);
      b.innerHTML = wide
        ? '<img class="ico" src="' + IMG + G.icon + '" alt=""><span class="lab">' + esc(gradeLabel(k)) + "<small>" + n + "</small></span>"
        : '<img class="art" src="' + IMG + G.art + '" alt="' + esc(G.alt) + '"><span class="lab">' + n + "</span>";
      b.onclick = function () {
        current = k; set("rm-home-tab", current); sound("click");
        search.value = ""; openTopic = null; render(); renderDaily();
        if (view.getBoundingClientRect().top > window.innerHeight * 0.75) view.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      tabs.appendChild(b);
    });
  }

  function isNew(item) {
    if (!item.added) return false;
    var days = (Date.now() - new Date(item.added + "T00:00:00").getTime()) / 864e5;
    return days >= 0 && days <= 14;
  }

  function card(item, color) {
    var rtl = isArabic(item.title) ? ' dir="rtl"' : ' dir="auto"';
    var kindText = item.kind ? kindName(item.kind) : (item.skill || "");
    var icon = KIND_ICON[item.kind] || (item.skill ? "icon-game.png" : "icon-lesson.png");
    // ⁦…⁩ keeps "5-1" in the right order inside Arabic text
    var num = item.lesson ? '<span class="pill">' + esc(t("lessonNo", { n: "⁦" + item.lesson + "⁩" })) + "</span>" : "";
    var kind = '<span class="pill kind">' + esc(kindText) + "</span>";
    var thumb = item.image ? '<img class="thumb" src="' + href(item.image) + '" alt="" loading="lazy">' : "";
    var p = mine(item), badge = "";
    if (p && p.d) badge = '<span class="pill star">' + t("done") + (p.s ? " " + p.s : "") + "</span>";
    else if (p) badge = '<span class="pill done">' + t("opened") + "</span>";
    var ribbon = isNew(item) ? '<span class="ribbon">' + t("newRibbon") + "</span>" : "";
    return '<a class="lesson" style="--c:' + color + '" href="' + href(item.href) + '">' + ribbon + thumb +
           '<span class="row"><img class="ico" src="' + IMG + icon + '" alt=""><span class="txt">' +
           '<span class="top">' + num + kind + badge + "</span><strong" + rtl + ">" + esc(item.title) + "</strong></span></span></a>";
  }

  function head(k, countText) {
    return '<div class="grade-head" style="--c:' + GRADE[k].color + '"><img src="' + IMG + 'pengo.png" alt=""><h2>' +
           esc(gradeLabel(k)) + "</h2><small>" + countText + "</small></div>";
  }

  function topicDone(tp) {
    return !!(P && P.current()) && tp.lessons.length > 0 && tp.lessons.every(function (l) { return mine(l); });
  }

  function render() {
    var q = search.value.trim().toLowerCase();
    Array.prototype.forEach.call(tabs.children, function (b) { b.setAttribute("aria-selected", String(!q && b.dataset.key === current)); });
    var html = "";
    var shown = q ? keys : [current];

    shown.forEach(function (k) {
      var G = GRADE[k];
      if (k === "games" || k === "tools") {
        var items = (k === "games" ? C.games : TOOLS).filter(function (x) {
          return !q || (x.title + " " + (x.skill || "") + " " + (x.kind || "") + " " + gradeLabel(k)).toLowerCase().indexOf(q) >= 0;
        });
        if (!items.length) return;
        var cards = '<div class="grid">' + items.map(function (x) { return card(x, G.color); }).join("") + "</div>";
        html += head(k, count(items.length, k === "games" ? "game" : "tool"));
        html += G.side
          ? '<div class="rm-card panel with-art"><img class="side" src="' + IMG + G.side + '" alt="' + esc(G.sideAlt) + '"><div><p class="panel-note">' + esc(t("toolsNote")) + "</p>" + cards + "</div></div>"
          : '<div class="rm-card panel">' + cards + "</div>";
        return;
      }
      var g = C.grades.filter(function (x) { return String(x.grade) === k; })[0];
      var n = 0;
      g.topics.forEach(function (tp) { n += tp.lessons.length; });
      if (!q) {
        html += head(k, count(n, "lesson")) +
          '<div class="viewbar" role="group"><button type="button" class="vb" data-mode="list" aria-pressed="' + (mode === "list") + '">' + t("list") +
          '</button><button type="button" class="vb" data-mode="map" aria-pressed="' + (mode === "map") + '">' + t("map") + "</button></div>";
        if (mode === "map") { html += mapHTML(g, G); return; }
      }
      var block = "", shownCount = 0;
      g.topics.forEach(function (tp) {
        var ls = tp.lessons.filter(function (l) { return !q || (l.title + " " + l.lesson + " " + tp.name + " " + l.kind).toLowerCase().indexOf(q) >= 0; });
        if (!ls.length && q) return;
        shownCount += ls.length;
        var seen = ls.filter(function (l) { return mine(l); }).length;
        var fresh = ls.some(isNew) ? '<span class="newdot">' + t("newRibbon") + "</span>" : "";
        var cert = !q && topicDone(tp)
          ? '<div class="certbar"><span>' + t("certBanner") + '</span><button class="rm-btn rm-btn--star" type="button" data-cert="' + tp.topic + '">' + t("certBtn") + "</button></div>"
          : "";
        var open = q || String(openTopic) === String(tp.topic);
        block += '<details class="topic" data-topic="' + tp.topic + '" style="--c:' + G.color + '"' + (open ? " open" : "") + '><summary>' +
                 '<span class="tnum">' + tp.topic + '</span><span class="tname" dir="auto">' + esc(tp.name) + "</span>" + fresh +
                 '<span class="tcount">' + (seen ? '<span class="mine">✓ ' + seen + "/" + ls.length + "</span>" : count(ls.length, "lesson")) +
                 '</span><span class="chev">▶</span></summary>' + cert +
                 (ls.length ? '<div class="grid">' + ls.map(function (l) { return card(l, G.color); }).join("") + "</div>"
                            : '<p class="empty">' + t("noLessons") + "</p>") + "</details>";
      });
      if (!block) return;
      if (q) html += head(k, count(shownCount, "lesson"));
      html += block;
    });

    view.innerHTML = html || '<p class="empty">' + esc(t("noMatch", { q: q })) + "</p>";
    document.body.dataset.grade = current;
    if (mode === "map" && !q) drawMapPath();
    if (openTopic != null) {
      var d = view.querySelector('details[data-topic="' + openTopic + '"]');
      if (d) d.scrollIntoView({ behavior: "smooth", block: "start" });
      openTopic = null;
    }
  }

  view.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.mode) {
      mode = b.dataset.mode; set("rm-home-view", mode); sound("click"); render(); return;
    }
    if (b.dataset.stop) {
      sound("pop"); mode = "list"; set("rm-home-view", mode); openTopic = b.dataset.stop; render(); return;
    }
    if (b.dataset.cert) { e.preventDefault(); openCertificate(b.dataset.cert); }
  });

  // ======================================================================
  // Learning map: a path of topic stops, lit up as the child goes
  // ======================================================================
  function mapHTML(g, G) {
    var here = null;
    var stops = g.topics.map(function (tp) {
      var total = tp.lessons.length, seen = tp.lessons.filter(function (l) { return mine(l); }).length;
      var state = total && seen === total ? "full" : seen ? "some" : "none";
      if (here == null && state !== "full" && total) here = tp.topic;
      var pct = total ? Math.round(seen / total * 100) : 0;
      return { tp: tp, state: state, pct: pct, seen: seen, total: total };
    });
    var html = '<div class="rm-card mapcard" style="--c:' + G.color + '"><p class="maphint">' + t("mapHint") + '</p><div class="map" id="map"><svg class="mappath" aria-hidden="true"><path/></svg><ol>';
    stops.forEach(function (s, i) {
      var isHere = P && P.current() && s.tp.topic === here;
      html += '<li class="stop ' + (i % 2 ? "right" : "left") + " " + s.state + '">' +
        '<button type="button" data-stop="' + s.tp.topic + '" aria-label="' + esc(t("topicN", { n: s.tp.topic }) + ": " + s.tp.name) + '">' +
        '<span class="dot" style="--pct:' + s.pct + '"><span>' + (s.state === "full" ? "⭐" : s.tp.topic) + "</span></span>" +
        '<span class="stoptext"><small>' + esc(t("topicN", { n: s.tp.topic })) + '</small><b dir="auto">' + esc(s.tp.name) + "</b>" +
        (P && P.current() && s.total ? "<em>✓ " + s.seen + "/" + s.total + "</em>" : "") + "</span>" +
        (isHere ? '<span class="here"><img src="' + IMG + 'pengo.png" alt=""><span>' + t("youAreHere") + "</span></span>" : "") +
        "</button></li>";
    });
    return html + "</ol></div></div>";
  }
  function drawMapPath() {
    var map = $("map"); if (!map) return;
    var box = map.getBoundingClientRect(), pts = [];
    Array.prototype.forEach.call(map.querySelectorAll(".dot"), function (d) {
      var r = d.getBoundingClientRect();
      pts.push([r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top]);
    });
    var svg = map.querySelector("svg");
    svg.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);
    var d = "";
    pts.forEach(function (p, i) {
      if (!i) { d = "M" + p[0] + " " + p[1]; return; }
      var a = pts[i - 1], my = (a[1] + p[1]) / 2;
      d += " C" + a[0] + " " + my + " " + p[0] + " " + my + " " + p[0] + " " + p[1];
    });
    svg.querySelector("path").setAttribute("d", d);
  }
  var resizeTimer;
  window.addEventListener("resize", function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawMapPath, 120); });

  // ======================================================================
  // Who is learning? + Pengo's prizes + badges
  // ======================================================================
  var who = $("who"), removing = false, adding = false, pet = "owl", newGrade = "";
  var progressNow = {};
  function mine(item) { return P && P.current() ? progressNow[P.key(RM.root + item.href)] || null : null; }
  function allItems() {
    var a = C.games.concat(TOOLS);
    C.grades.forEach(function (g) { g.topics.forEach(function (tp) { a = a.concat(tp.lessons); }); });
    return a;
  }

  // Pengo gets a new prize as the child opens more lessons.
  var PRIZES = [
    { at: 2, cls: "scarf", icon: "🎀" },
    { at: 5, cls: "medal", icon: "🏅" },
    { at: 8, cls: "hat", icon: "🎩" },
    { at: 12, cls: "balloon", icon: "🎈" },
    { at: 20, cls: "crown", icon: "👑" }
  ];
  function pengo(opened, size) {
    var has = PRIZES.filter(function (p) { return opened >= p.at; }).map(function (p) { return p.cls; });
    if (has.indexOf("crown") >= 0) has = has.filter(function (c) { return c !== "hat"; });   // the crown replaces the hat
    return '<span class="pengo ' + (size || "") + '"><img src="' + IMG + 'pengo.png" alt="Pengo">' +
      PRIZES.filter(function (p) { return has.indexOf(p.cls) >= 0; }).map(function (p) {
        return '<span class="acc ' + p.cls + '" aria-hidden="true">' + p.icon + "</span>";
      }).join("") + "</span>";
  }
  function nextPrize(opened) {
    var n = PRIZES.filter(function (p) { return p.at > opened; })[0];
    return n ? t("nextPrize", { n: n.at - opened }) + " " + n.icon : t("allPrizes");
  }

  // Each badge is one of Pengo's stickers (shared/img/sticker-*.png).
  var BADGES = [
    { id: "first", sticker: "great-job", en: "Open your first lesson", ar: "افتح أول درس", test: function (s) { return s.opened >= 1; } },
    { id: "five", sticker: "keep-going", en: "Open 5 lessons", ar: "افتح 5 دروس", test: function (s) { return s.opened >= 5; } },
    { id: "ten", sticker: "great-progress", en: "Open 10 lessons", ar: "افتح 10 دروس", test: function (s) { return s.opened >= 10; } },
    { id: "twenty", sticker: "math-star", en: "Open 20 lessons", ar: "افتح 20 درسًا", test: function (s) { return s.opened >= 20; } },
    { id: "star1", sticker: "you-did-it", en: "Finish a lesson", ar: "أنهِ درسًا", test: function (s) { return s.done >= 1; } },
    { id: "star5", sticker: "fantastic", en: "Finish 5 lessons", ar: "أنهِ 5 دروس", test: function (s) { return s.done >= 5; } },
    { id: "topic", sticker: "brilliant", en: "Open every lesson in a topic", ar: "افتح كل دروس موضوع", test: function (s) { return s.topics >= 1; } },
    { id: "gamer", sticker: "amazing", en: "Play 3 games", ar: "العب 3 ألعاب", test: function (s) { return s.games >= 3; } },
    { id: "daily", sticker: "well-done", en: "Solve a daily challenge", ar: "حلّ تحدي اليوم", test: function (s) { return s.solved >= 1; } },
    { id: "streak3", sticker: "super-effort", en: "Daily challenge 3 days in a row", ar: "تحدي اليوم 3 أيام متتالية", test: function (s) { return s.best >= 3; } },
    { id: "streak7", sticker: "so-proud", en: "Daily challenge 7 days in a row", ar: "تحدي اليوم 7 أيام متتالية", test: function (s) { return s.best >= 7; } }
  ];
  function stickerImg(name, cls) { return '<img class="' + (cls || "stk") + '" src="' + IMG + "sticker-" + name + '.png" alt="">'; }
  function stats() {
    var s = { opened: 0, done: 0, topics: 0, games: 0, solved: 0, best: 0 };
    allItems().forEach(function (x) { var p = mine(x); if (p) { s.opened++; if (p.d) s.done++; } });
    C.games.forEach(function (x) { if (mine(x)) s.games++; });
    C.grades.forEach(function (g) { g.topics.forEach(function (tp) { if (topicDone(tp)) s.topics++; }); });
    var dl = dailyData(); s.solved = dl.solved || 0; s.best = dl.best || 0;
    return s;
  }
  function earned(s) { return BADGES.filter(function (b) { return b.test(s); }).map(function (b) { return b.id; }); }

  // Celebrate any badge the child has not seen yet.
  function checkNewBadges() {
    var name = P && P.current(); if (!name) return;
    var key = "rm-badges-seen-" + name, seen = getJSON(key, null), now = earned(stats());
    if (seen == null) { setJSON(key, now); return; }   // first time: don't flood with old badges
    var fresh = now.filter(function (id) { return seen.indexOf(id) < 0; });
    if (!fresh.length) return;
    setJSON(key, now);
    var b = BADGES.filter(function (x) { return x.id === fresh[0]; })[0];
    toast(stickerImg(b.sticker, "ticon") + "<span><small>" + t("newBadge") + "</small><b>" + esc(b[lang]) + "</b></span>");
    if (window.RM) { RM.confetti(); sound("win"); }
    setTimeout(function () { speak("new-badge", t("sayBadge")); }, 900);
  }
  function toast(html) {
    var el = $("toast"); el.innerHTML = html; el.hidden = false;
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    clearTimeout(el.timer); el.timer = setTimeout(function () { el.hidden = true; }, 4200);
  }

  function renderWho() {
    if (!P) { who.hidden = true; return; }
    var name = P.current(), kids = P.students();
    progressNow = name ? P.of(name) : {};
    if (name && !removing && !adding) {
      var s = stats(), g = P.gradeOf(name);
      who.innerHTML = '<div class="me"><span class="face">' + RM.mascot(P.mascotOf(name)) + "</span>" +
        '<div class="hi"><h2>' + esc(t(s.opened ? "hi" : "hiNew", { n: name })) + "</h2><p>" +
        (g ? esc(t("g", { g: g })) + " · " : "") + esc(t("stats", { o: s.opened, d: s.done })) + "</p>" +
        '<p class="prize">' + esc(nextPrize(s.opened)) + "</p>" +
        (g ? "" : '<p class="grades"><b>' + t("whichGrade") + "</b>" + gradeButtons("") + "</p>") + "</div>" +
        '<button class="pengo-btn" type="button" data-act="badges" aria-label="' + esc(t("badgesBtn")) + '">' + pengo(s.opened, "small") + "</button>" +
        '<div class="me-btns"><button class="rm-btn rm-btn--star" type="button" data-act="badges">' + t("badgesBtn") + "</button>" +
        '<button class="rm-btn rm-btn--ghost" type="button" data-act="change">' + esc(t("notMe", { n: name })) + "</button></div></div>";
      return;
    }
    if (!name && P.chosen() && !removing && !adding) {   // "Just looking" (teacher on the board)
      who.innerHTML = '<div class="me"><div class="hi"><p>' + t("notSaving") + "</p></div>" +
        '<button class="rm-btn rm-btn--ghost" type="button" data-act="change">' + t("chooseMe") + "</button></div>";
      return;
    }
    var html = "<h2>" + (removing ? t("removeHead") : t("who")) + "</h2><p>" + (removing ? t("removeSub") : t("whoSub")) + "</p>" +
               '<div class="who-row">';
    kids.forEach(function (k) {
      html += '<button class="kid' + (removing ? " remove" : "") + '" type="button" data-kid="' + esc(k.name) + '">' +
              '<span class="face">' + RM.mascot(k.mascot) + '</span><span dir="auto">' + esc(k.name) + "</span></button>";
    });
    if (removing) html += '<button class="rm-btn rm-btn--ghost" type="button" data-act="stop">' + t("finished") + "</button>";
    else if (!adding) {
      html += '<button class="rm-btn" type="button" data-act="add">' + t("newName") + "</button>" +
              '<button class="rm-btn rm-btn--ghost" type="button" data-act="guest">' + t("guest") + "</button>" +
              (kids.length ? '<button class="rm-btn rm-btn--ghost" type="button" data-act="remove">' + t("removeName") + "</button>" : "");
    }
    html += "</div>";
    if (adding) {
      html += '<form class="new-kid" id="new-kid"><input id="kid-name" maxlength="20" autocomplete="off" dir="auto" placeholder="' + esc(t("firstName")) + '" aria-label="' + esc(t("firstName")) + '">' +
              '<span class="pets" role="group" aria-label="' + esc(t("pickFriend")) + '">' + RM.mascots.map(function (m) {
                return '<button class="pet" type="button" data-pet="' + m + '" aria-pressed="' + (m === pet) + '">' + RM.mascot(m) + "</button>";
              }).join("") + "</span>" +
              '<span class="grades" role="group" aria-label="' + esc(t("myGrade")) + '"><b>' + t("myGrade") + "</b>" + gradeButtons(newGrade) + "</span>" +
              '<button class="rm-btn" type="submit">' + t("save") + "</button>" +
              '<button class="rm-btn rm-btn--ghost" type="button" data-act="cancel">' + t("cancel") + "</button></form>";
    }
    who.innerHTML = html;
    if (adding) $("kid-name").focus();
  }

  function gradeButtons(selected) {
    return C.grades.map(function (g) {
      var k = String(g.grade);
      return '<button class="gr" type="button" data-grade-pick="' + k + '" style="--c:' + GRADE[k].color + '" aria-pressed="' +
             (k === selected) + '" aria-label="' + esc(t("g", { g: k })) + '">' + k + "</button>";
    }).join("");
  }
  function openGrade(g) {
    if (!g || !GRADE[g]) return;
    current = String(g); set("rm-home-tab", current);
  }
  function refresh() { renderWho(); renderDaily(); render(); }

  who.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var act = b.dataset.act;
    if (b.dataset.gradePick) {
      var g = b.dataset.gradePick; sound("pop");
      if (adding) {
        newGrade = g;
        Array.prototype.forEach.call(who.querySelectorAll(".gr"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        var hint = $("grade-hint"); if (hint) hint.remove();
        return;
      }
      var me = P.current();   // a child saved before grades existed picks one now
      if (me) P.add(me, P.mascotOf(me), g);
      openGrade(g); refresh(); return;
    }
    if (b.dataset.pet) {
      pet = b.dataset.pet; sound("pop");
      Array.prototype.forEach.call(who.querySelectorAll(".pet"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      return;
    }
    if (b.dataset.kid != null) {
      var n = b.dataset.kid;
      if (removing) {
        if (!confirm(t("confirmRemove", { n: n }))) return;
        P.remove(n); if (!P.students().length) removing = false;
        try { localStorage.removeItem("rm-badges-seen-" + n); localStorage.removeItem("rm-daily-" + n); } catch (x) {}
      } else { P.choose(n); openGrade(P.gradeOf(n)); sound("correct"); speak("welcome-back", t("sayHi", { n: n })); }
      refresh(); if (!removing) checkNewBadges(); return;
    }
    if (!act || b.type === "submit") return;
    if (act === "badges") { openBadges(); return; }
    sound("click");
    if (act === "change") { try { localStorage.removeItem("rm-student"); } catch (x) {} }
    if (act === "guest") P.choose(P.GUEST);
    if (act === "add") { adding = true; pet = "owl"; newGrade = ""; }
    if (act === "cancel") adding = false;
    if (act === "remove") removing = true;
    if (act === "stop") removing = false;
    refresh();
  });
  who.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("kid-name");
    if (!input.value.trim()) { input.focus(); return; }
    if (!newGrade) {
      if (!$("grade-hint")) who.querySelector(".grades").insertAdjacentHTML("afterend", '<p class="hint" id="grade-hint">' + t("tapGrade") + "</p>");
      sound("wrong"); speak("tap-grade", t("sayTapGrade")); return;
    }
    var n = P.add(input.value, pet, newGrade);
    openGrade(newGrade);
    adding = false; sound("win"); speak("welcome-new", t("sayWelcome", { n: n }));
    refresh(); checkNewBadges();
  });

  // ---------- Badges window ----------
  function openBadges() {
    sound("click");
    var s = stats(), have = earned(s);
    $("badges-body").innerHTML =
      '<div class="mypengo">' + pengo(s.opened, "big") + "<div><h3>" + t("myPengo") + "</h3><p>" + esc(nextPrize(s.opened)) + "</p>" +
      '<p class="prizes">' + PRIZES.map(function (p) {
        return '<span class="' + (s.opened >= p.at ? "got" : "") + '" title="' + p.at + '">' + p.icon + "</span>";
      }).join("") + "</p></div></div>" +
      '<ul class="badges">' + BADGES.map(function (b) {
        var ok = have.indexOf(b.id) >= 0;
        return '<li class="' + (ok ? "got" : "") + '">' + stickerImg(b.sticker, "bicon") + "<b>" + esc(b[lang]) + "</b>" +
               (ok ? "" : "<small>🔒 " + t("locked") + "</small>") + "</li>";
      }).join("") + "</ul>";
    showDialog($("badges"));
  }

  // ======================================================================
  // Daily challenge: one question a day for the child's grade
  // ======================================================================
  function dailyKey() { return "rm-daily-" + ((P && P.current()) || ""); }
  function dailyData() { return getJSON(dailyKey(), {}); }
  function rng(seed) {   // small seeded random numbers, so everyone gets the same question today
    var h = 1779033703 ^ seed.length;
    for (var i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    return function () {
      h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }
  // The daily challenge is only for a child who chose their name and their grade,
  // and it is always their own grade's challenge (browsing other grades does not change it).
  function dailyGrade() {
    var name = P && P.current();
    return (name && P.gradeOf(name)) || null;
  }
  function question(g) {
    var r = rng(today() + "-g" + g), int = function (a, b) { return a + Math.floor(r() * (b - a + 1)); };
    var a, b, text, ans, kind = r() < 0.5;
    if (g === "1") {
      if (kind) { a = int(2, 9); b = int(1, 9); text = a + " + " + b; ans = a + b; }
      else { a = int(8, 18); b = int(2, Math.min(9, a)); text = a + " − " + b; ans = a - b; }
    } else if (g === "2") {
      if (kind) { a = int(12, 59); b = int(11, 39); text = a + " + " + b; ans = a + b; }
      else { a = int(40, 99); b = int(11, a - 10); text = a + " − " + b; ans = a - b; }
    } else {
      a = int(2, 9); b = int(2, 9);
      if (kind) { text = a + " × " + b; ans = a * b; }
      else { text = (a * b) + " ÷ " + a; ans = b; }
    }
    var opts = [ans], steps = g === "3" ? [1, -1, 2, a] : g === "2" ? [1, -1, 10, -10] : [1, -1, 2, -2];
    steps.forEach(function (d) { var v = ans + d; if (v >= 0 && opts.indexOf(v) < 0 && opts.length < 4) opts.push(v); });
    while (opts.length < 4) { var v = ans + opts.length + 2; if (opts.indexOf(v) < 0) opts.push(v); }
    for (var i = opts.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp; }
    return { text: text, ans: ans, opts: opts };
  }
  function renderDaily() {
    var box = $("daily"), g = dailyGrade();
    box.hidden = !g;   // no name + grade chosen: no challenge at all
    if (!g) { box.innerHTML = ""; return; }
    var q = question(g), d = dailyData(), doneToday = d.last === today();
    box.dataset.grade = g; box.dataset.ans = q.ans;   // the answer is checked against exactly this question
    var streakNow = d.last === today() || d.last === today(-1) ? d.streak || 0 : 0;
    box.style.setProperty("--c", GRADE[g].color);
    box.innerHTML = '<div class="dhead"><h2>' + t("daily") + '</h2><span class="pill">' + esc(t("dailyFor", { g: g })) + "</span>" +
      (streakNow ? '<span class="streak">' + esc(t(streakNow === 1 && lang === "en" ? "streak1" : "streak", { n: streakNow })) + "</span>" : "") + "</div>" +
      '<div class="dbody"><p class="dq" dir="ltr">' + esc(q.text) + " = " + (doneToday ? q.ans : "?") + "</p>" +
      (doneToday ? '<p class="rm-feedback is-correct">' + t("dailyDone") + "</p>"
        : '<div class="rm-choices dchoices">' + q.opts.map(function (o) {
            return '<button class="rm-choice" type="button" data-ans="' + o + '">' + o + "</button>";
          }).join("") + '</div><p class="rm-feedback" id="dfb" aria-live="polite"></p>') + "</div>";
  }
  $("daily").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-ans]"); if (!b) return;
    var ok = Number(b.dataset.ans) === Number($("daily").dataset.ans), fb = $("dfb");
    if (window.RM) RM.check(b, ok);
    fb.className = "rm-feedback " + (ok ? "is-correct" : "is-wrong");
    fb.textContent = ok ? t("dailyRight") : t("dailyWrong");
    if (!ok) { if (window.RM && RM.sticker) RM.sticker("keep-trying"); speak("try-again", t("sayTry")); return; }
    var praise = ["great-job", "well-done", "amazing", "brilliant", "fantastic"];
    if (window.RM && RM.sticker) RM.sticker(praise[Math.floor(Math.random() * praise.length)]);
    var d = dailyData();
    if (d.last !== today()) {
      d.streak = d.last === today(-1) ? (d.streak || 0) + 1 : 1;
      d.best = Math.max(d.best || 0, d.streak); d.solved = (d.solved || 0) + 1; d.last = today();
      setJSON(dailyKey(), d);
    }
    speak("great-job", t("sayGreat"));
    setTimeout(function () { renderDaily(); renderWho(); checkNewBadges(); if (window.RM) RM.confetti(40); }, 900);
  });

  // ======================================================================
  // Certificate for a finished topic (printable)
  // ======================================================================
  function openCertificate(topicNo) {
    var name = P && P.current(); if (!name) return;
    var g = C.grades.filter(function (x) { return String(x.grade) === current; })[0];
    var tp = g && g.topics.filter(function (x) { return String(x.topic) === String(topicNo); })[0];
    if (!tp) return;
    // Rana's certificate picture with the child's name, grade and the date written on its lines.
    var date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    $("cert-body").innerHTML =
      '<div class="cert2" dir="ltr"><img src="' + IMG + 'certificate-pengo.jpg" alt="Certificate of Appreciation: Math Progress Award">' +
      '<span class="c-name" dir="auto">' + esc(name) + "</span>" +
      '<span class="c-grade">Grade ' + esc(current) + " · Topic " + esc(tp.topic) + ': <span dir="auto">' + esc(tp.name) + "</span></span>" +
      '<span class="c-date">' + esc(date) + "</span></div>";
    showDialog($("certd"));
    sound("win");
    setTimeout(function () { speak("certificate", t("sayCert")); }, 900);
  }
  $("cert-print").onclick = function () { sound("click"); window.print(); };

  // ======================================================================
  // Dialogs (How to use, badges, certificate)
  // ======================================================================
  function showDialog(d) {
    if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
    d.scrollTop = 0;
  }
  function closeDialog(d) { if (d.close) d.close(); else d.removeAttribute("open"); }
  Array.prototype.forEach.call(document.querySelectorAll("dialog"), function (d) {
    d.addEventListener("click", function (e) {
      if (e.target === d || e.target.closest("[data-close]")) { sound("click"); closeDialog(d); }
    });
  });
  function fillHelp() {
    $("help-title").textContent = t("helpTitle");
    $("help-steps").innerHTML = WORDS[lang].helpSteps.map(function (s) { return "<li>" + s + "</li>"; }).join("");
    $("help-safe").textContent = t("helpSafe");
    $("help-tips").innerHTML = WORDS[lang].helpTips.map(function (s) { return "<li>" + s + "</li>"; }).join("");
    $("help-close").textContent = t("gotIt");
    $("tour-again").textContent = t("tourAgain");
  }
  $("help-open").onclick = function () { sound("click"); showDialog($("help")); };
  $("tour-again").onclick = function () { closeDialog($("help")); startTour(); };

  // ======================================================================
  // Welcome tour (first visit)
  // ======================================================================
  var tourStep = 0;
  var TOUR_TARGETS = [null, "who", "tabs"];
  function startTour() { tourStep = 0; $("tour").hidden = false; showTourStep(); }
  function endTour() {
    $("tour").hidden = true; set("rm-tour-done", "1");
    Array.prototype.forEach.call(document.querySelectorAll(".tour-focus"), function (x) { x.classList.remove("tour-focus"); });
  }
  function showTourStep() {
    Array.prototype.forEach.call(document.querySelectorAll(".tour-focus"), function (x) { x.classList.remove("tour-focus"); });
    var target = TOUR_TARGETS[tourStep] && $(TOUR_TARGETS[tourStep]);
    if (target) { target.classList.add("tour-focus"); target.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else window.scrollTo({ top: 0, behavior: "smooth" });
    var last = tourStep === WORDS[lang].tour.length - 1;
    $("tour-text").textContent = WORDS[lang].tour[tourStep];
    $("tour-next").textContent = last ? t("tourGo") : t("tourNext");
    $("tour-skip").textContent = t("tourSkip");
    $("tour-skip").hidden = last;
    $("tour-dots").innerHTML = WORDS[lang].tour.map(function (x, i) { return "<i" + (i === tourStep ? ' class="on"' : "") + "></i>"; }).join("");
    speak("tour-" + (tourStep + 1), WORDS[lang].tour[tourStep]);
  }
  $("tour-next").onclick = function () {
    sound("click");
    if (tourStep >= WORDS[lang].tour.length - 1) { endTour(); sound("win"); return; }
    tourStep++; showTourStep();
  };
  $("tour-skip").onclick = function () { sound("click"); endTour(); };

  // ======================================================================
  // Dark mode and English / Arabic
  // ======================================================================
  var theme = get("rm-theme", "light") === "dark" ? "dark" : "light";
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    var b = $("theme-btn");
    b.textContent = theme === "dark" ? "☀️" : "🌙";
    b.title = theme === "dark" ? t("light") : t("dark");
    b.setAttribute("aria-label", b.title);
  }
  $("theme-btn").onclick = function () { theme = theme === "dark" ? "light" : "dark"; set("rm-theme", theme); sound("click"); applyTheme(); };

  function applyLang() {
    var html = document.documentElement;
    html.lang = lang; html.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = t("title");
    Array.prototype.forEach.call(document.querySelectorAll("[data-t]"), function (el) { el.textContent = t(el.getAttribute("data-t")); });
    search.placeholder = t("search"); search.setAttribute("aria-label", t("search").replace("🔎 ", ""));
    var total = 0; C.grades.forEach(function (g) { total += counts[g.grade]; });
    $("totals").textContent = count(total, "lesson") + " · " + count(C.games.length, "game") + (TOOLS.length ? " · " + count(TOOLS.length, "tool") : "");
    fillHelp(); applyTheme(); buildTabs();
  }

  // ======================================================================
  // Start
  // ======================================================================
  search.addEventListener("input", render);
  applyLang();
  try { renderWho(); } catch (e) { who.hidden = true; }   // the lessons must show even if the name box fails
  try { renderDaily(); } catch (e) { $("daily").hidden = true; }
  render();
  try { checkNewBadges(); } catch (e) {}
  if (get("rm-tour-done", "") !== "1" && !(P && P.students().length)) setTimeout(startTour, 700);
  // Coming back with the browser's Back button: show the newest ✓, ⭐ and badges.
  window.addEventListener("pageshow", function (e) { if (e.persisted) { refresh(); checkNewBadges(); } });
})();
