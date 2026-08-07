/**
 * LGM Editor — 6 Halaman WYSIWYG untuk Life Grand Map
 * Adaptasi dari LGMCakra dengan tema Amerta Karsa PK LPDP 280
 * Text overlays positioned directly on PNG templates (no visible boxes)
 */
(function () {
  "use strict";

  /* ---------- Elemen utama ---------- */
  const stage = document.getElementById("lgm-stage");
  const bgImg = document.getElementById("lgm-bg");
  const inputs = document.getElementById("lgm-inputs-area");
  const labelPg = document.getElementById("labelPg");
  const labelPg2 = document.getElementById("labelPg2");
  const lgmPageNum = document.getElementById("lgm-page-num");
  const totalPg = document.getElementById("totalPg");
  const pager = document.getElementById("pager");
  const btnPrev = document.getElementById("lgm-prev");
  const btnNext = document.getElementById("lgm-next");
  const pageInstruction = document.getElementById("pageInstruction");

  /* ---------- Util ---------- */
  let cur = 0;
  const k = () => stage.clientWidth / 1080;
  function autoSizeTA(el) {
    el.style.height = "auto";
    const minH = 80;
    el.style.height = Math.max(minH, el.scrollHeight) + "px";
  }

  /* ---------- Path BG ---------- */
  const FRAME_BASE = "assets/lgm/";
  const withBase = (name) => FRAME_BASE + name;

  /* Error load BG */
  bgImg.addEventListener("error", () => {
    console.error("[BG ERROR] Gagal memuat:", bgImg?.src);
    alert("Background tidak ditemukan:\n" + bgImg?.src + "\n\nCek nama file & path-nya.");
  });

  /* ---------- Frames ---------- */
  const FRAME = {
    1: withBase("frame-02.png"),
    2: withBase("frame-03.png"),
    3: withBase("frame-04.png"),
    4: withBase("frame-05.png"),
    5: withBase("frame-06.png"),
    6: withBase("frame-07.png"),
  };

  /*
  const CHAR_LIMIT_BOX = {
    "p1a": 192,
    "p1b": 192,
    "p1c": 192,
    "p1d": 192,
    "p2a": 637,
    "p2b": 637,
    "p3a": 506,
    "p3b": 506,
    "p4a": 483,
    "p4b": 483,
    "p5a": 400,
    "p5b": 400,
  }*/

  const CHAR_LIMIT_BOX = {
    "p1a": 306,
    "p1b": 306,
    "p1c": 306,
    "p1d": 306,
    "p2a": 1220,
    "p2b": 1220,
    "p3a": 920,
    "p3b": 920,
    "p4a": 900,
    "p4b": 900,
    "p5a": 720,
    "p5b": 720,
  }

  /* ---------- PAGES — explicit title & body positions (in 1080x1350 coords) ---------- */
  /* 
   * Pages 4-6 (indices 3,4,5) have pre-drawn titles on the template → hasTitleInput=false
   * Page 6 (Grand Goals) has purple background → bodyColor=#FFFFFF
   */
  const PAGES = [
    /* 1) SELF POTENTIAL — 4 boxes vertical */
    {
      name: "Self Potential & Development Identification",
      bg: FRAME[1],
      boxes: [
        { id: "p1a", label: "Skill 1", hasTitleInput: true,
          titlePos: { x: 90, y: 345, w: 900, h: 30 }, titleFs: 26, titleColor: "#6F3188",
          bodyPos: { x: 100, y: 406, w: 884, h: 98 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
        { id: "p1b", label: "Skill 2", hasTitleInput: true,
          titlePos: { x: 90, y: 566, w: 900, h: 30 }, titleFs: 26, titleColor: "#6F3188",
          bodyPos: { x: 100, y: 624, w: 884, h: 98 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
        { id: "p1c", label: "Skill 3", hasTitleInput: true,
          titlePos: { x: 90, y: 786, w: 900, h: 30 }, titleFs: 26, titleColor: "#6F3188",
          bodyPos: { x: 100, y: 844, w: 884, h: 98 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
        { id: "p1d", label: "Skill 4", hasTitleInput: true,
          titlePos: { x: 90, y: 1006, w: 900, h: 30 }, titleFs: 26, titleColor: "#6F3188",
          bodyPos: { x: 100, y: 1066, w: 884, h: 98 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
      ],
    },

    /* 2) STUDY PLAN (1–4) — 2x2 grid */
    {
      name: "Study Plan & Academic Achievement (1–4)",
      bg: FRAME[2],
      boxes: [
      /*  { id: "p2a", label: "1st Term", hasTitleInput: true,
          titlePos: { x: 90, y: 345, w: 430, h: 30 }, titleFs: 20, titleColor: "#6F3188",
          bodyPos: { x: 100, y: 410, w: 440, h: 340 }, bodyFs: 15, bodyColor: "#1f2937", val: "" },
        { id: "p2b", label: "2nd Term", hasTitleInput: true,
          titlePos: { x: 570, y: 345, w: 430, h: 30 }, titleFs: 20, titleColor: "#6F3188",
          bodyPos: { x: 580, y: 410, w: 440, h: 340 }, bodyFs: 15, bodyColor: "#1f2937", val: "" },
        { id: "p2c", label: "3rd Term", hasTitleInput: true,
          titlePos: { x: 90, y: 786, w: 430, h: 30 }, titleFs: 20, titleColor: "#6F3188",
          bodyPos: { x: 100, y: 850, w: 440, h: 340 }, bodyFs: 15, bodyColor: "#1f2937", val: "" },
        { id: "p2d", label: "4th Term", hasTitleInput: true,
          titlePos: { x: 570, y: 786, w: 430, h: 30 }, titleFs: 20, titleColor: "#6F3188",
          bodyPos: { x: 580, y: 850, w: 440, h: 340 }, bodyFs: 15, bodyColor: "#1f2937", val: "" }, */
          { id: "p2a", label: "1st Year", hasTitleInput: true,                                                                                                                         
          titlePos: { x: 90, y: 345, w: 940, h: 35 }, titleFs: 26, titleColor: "#6F3188",                                                                                                  
          bodyPos: { x: 100, y: 400, w: 892, h: 326 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },                                                                                         
          { id: "p2b", label: "2nd Year", hasTitleInput: true,                                                                                                                         
          titlePos: { x: 90, y: 786, w: 940, h: 35 }, titleFs: 26, titleColor: "#6F3188",                                                                                                  
          bodyPos: { x: 100, y: 844, w: 892, h: 326 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },

      ],
    },

    /* 3) STUDY PLAN (5–8) — 2x2 grid in large content area */
    /* 3) REV LIFE GRAND MAP */
    {
      name: "Study Plan & Academic Achievement (5–8)",
      bg: FRAME[3],
      /*boxes: [
        { id: "p3a", label: "5th Term", hasTitleInput: true,
          titlePos: { x: 60, y: 385, w: 440, h: 30 }, titleFs: 20, titleColor: "#6F3188",
          bodyPos: { x: 70, y: 440, w: 460, h: 430 }, bodyFs: 15, bodyColor: "#1f2937", val: "" },
        { id: "p3b", label: "6th Term", hasTitleInput: true,
          titlePos: { x: 560, y: 385, w: 440, h: 30 }, titleFs: 20, titleColor: "#6F3188",
          bodyPos: { x: 570, y: 440, w: 460, h: 430 }, bodyFs: 15, bodyColor: "#1f2937", val: "" },
        { id: "p3c", label: "7th Term", hasTitleInput: true,
          titlePos: { x: 60, y: 900, w: 440, h: 30 }, titleFs: 20, titleColor: "#6F3188",
          bodyPos: { x: 70, y: 920, w: 460, h: 430 }, bodyFs: 15, bodyColor: "#1f2937", val: "" },
        { id: "p3d", label: "8th Term", hasTitleInput: true,
          titlePos: { x: 560, y: 900, w: 440, h: 30 }, titleFs: 20, titleColor: "#6F3188",
          bodyPos: { x: 570, y: 920, w: 460, h: 430 }, bodyFs: 15, bodyColor: "#1f2937", val: "" },
      ],*/
      boxes: [
        { id: "p3a", label: "2027 – 2032", hasTitleInput: false,
          bodyPos: { x: 96, y: 446, w: 404, h: 568 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
        { id: "p3b", label: "2032 – 2037", hasTitleInput: false,
          bodyPos: { x: 624, y: 446, w: 404, h: 568 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
      ],
    },

    /* 4) LIFE GRAND MAP (2025–2035) — titles pre-drawn */
    {
      name: "Life Grand Map (2025–2035)",
      bg: FRAME[4],
      boxes: [
        { id: "p4a", label: "2035 – 2040", hasTitleInput: false,
          bodyPos: { x: 70, y: 450, w: 394, h: 568 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
        { id: "p4b", label: "2040 – Beyond", hasTitleInput: false,
          bodyPos: { x: 594, y: 450, w: 394, h: 568 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
      ],
    },

    /* 5) LIFE GRAND MAP (2035–Beyond) — titles pre-drawn */
    /* GRAND GOAL PLANS */
    {
      name: "Life Grand Map (2035–Beyond)",
      bg: FRAME[5],
      boxes: [
        { id: "p5a", label: "2035 – 2040", hasTitleInput: false,
          bodyPos: { x: 82, y: 508, w: 908, h: 196 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
        { id: "p5b", label: "2040 – Beyond", hasTitleInput: false,
          bodyPos: { x: 82, y: 854, w: 908, h: 196 }, bodyFs: 18, bodyColor: "#1f2937", val: "" },
      ],
    },

    /* 6) GRAND GOALS & PLANS — purple background, titles pre-drawn */
    {
      name: "Grand Goals & Plans",
      bg: FRAME[6],
      boxes: [/*
        { id: "p6a", label: "Contribution Plans", hasTitleInput: false,
          bodyPos: { x: 100, y: 450, w: 880, h: 310 }, bodyFs: 16, bodyColor: "#FFFFFF", val: "" },
        { id: "p6b", label: "Personal Grand Plans", hasTitleInput: false,
          bodyPos: { x: 100, y: 800, w: 880, h: 270 }, bodyFs: 16, bodyColor: "#FFFFFF", val: "" },
          */
      ],
    },
  ];

  /* ---------- Instruksi per halaman ---------- */
  const PAGE_INSTR = [
    "Langkah 1 dari 5: Identifikasi & Deskripsi Potensi Diri. Isi Heading (judul) dan Description pada setiap box.",
    "Langkah 2 dari 5: Rencana Studi & Akademik Uraikan rencana studi dan target anda. Untuk S3, edit judul jadi 1st & 2nd Year dan 3rd year and beyond",
    "Langkah 3 dari 5: Peta Jalan Hidup (Jangka Menengah). Tuliskan visi & rencana konkret 5–10 tahun ke depan. (Judul sudah pada template)",
    "Langkah 4 dari 5: Peta Jalan Hidup (Jangka Panjang). Proyeksikan impian dan rencana besar 10 tahun ke atas. (Judul sudah pada template)",
    "Langkah 5 dari 5: Rencana Kontribusi & Tujuan Utama. Rangkum rencana kontribusi serta tujuan besar pribadi. (Judul sudah pada template)",
  ];

  /* ---------- Pager ---------- */
  function buildPager() {
    if (!pager) return;
    pager.innerHTML = "";
    PAGES.forEach((p, ix) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all " +
        "border-slate-600 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-500";
      btn.title = p.name;
      btn.textContent = ix + 1;
      btn.addEventListener("click", () => renderPage(ix));
      pager.appendChild(btn);
    });
    if (totalPg) totalPg.textContent = PAGES.length;
  }

  /* ---------- Character count ---------- */
  const CHAR_LIMIT = 2000;
  function updateCharCount(id, text) {
    const el = document.getElementById("wc_" + id);
    var charlim = CHAR_LIMIT_BOX[id]
    if (!el) return;
    const n = (text || "").length;
    const pct = Math.round((n / charlim) * 100);
    let colorClass = "text-slate-500";
    if (n > charlim) colorClass = "text-rose-400 font-bold";
    else if (pct >= 85) colorClass = "text-amber-400";
    else if (pct >= 60) colorClass = "text-lpdp-gold";
    el.className = "text-[11px] " + colorClass;
//    el.textContent = n + " / " + charlim + " chars";
    el.textContent = "";
  }

  /* ---------- Form Standar ---------- */
  function makeStdFormGroup(pageIndex, boxIndex, boxDef) {
    const grp = document.createElement("div");
    grp.className = "bg-slate-900/60 border border-slate-700 rounded-xl p-3";

    const idTitle = "ttl_" + boxDef.id;
    const idText = "in_" + boxDef.id;

    let html = "";

    // Heading input only if hasTitleInput is true
    if (boxDef.hasTitleInput) {
      html +=
        '<label class="block text-xs text-slate-400 mb-1 font-medium">Heading</label>' +
        '<input id="' + idTitle + '" class="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lpdp-gold transition-colors" type="text" value="' +
        (boxDef.label || "").replace(/"/g, "&quot;") +
        '"/\>';
    }

    //console.log("CEK CHAR", CHAR_LIMIT_BOX[idText.substring(3)], idText)

    html +=
      '<label class="block text-xs text-slate-400 mb-1 font-medium ' + (boxDef.hasTitleInput ? "mt-2" : "") + '">Description</label>' +
      '<textarea id="' + idText + '" maxlength="' + CHAR_LIMIT_BOX[idText.substring(3)] + '" class="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lpdp-gold transition-colors resize-none overflow-hidden" rows="4" placeholder="Tulis konten..."></textarea>' +
      '<div class="flex justify-between items-center mt-2">' +
      '<small class="text-[11px] text-slate-500" id="wc_' + boxDef.id + '"></small>' +
      "</div>";

    grp.innerHTML = html;

    const ta = grp.querySelector("#" + CSS.escape(idText));
    ta.value = boxDef.val || "";
    autoSizeTA(ta);
    if (boxDef._taHeight) ta.style.height = boxDef._taHeight;
    updateCharCount(boxDef.id, boxDef.val || "");

    ta.addEventListener("input", (e) => {
      boxDef.val = e.target.value;
      const outEl = document.getElementById("out_" + boxDef.id);
      if (outEl) outEl.textContent = boxDef.val;
      autoSizeTA(e.target);
      boxDef._taHeight = e.target.style.height;
      updateCharCount(boxDef.id, boxDef.val);
    });

    // Title input event only if exists
    if (boxDef.hasTitleInput) {
      const inpTitle = grp.querySelector("#" + CSS.escape(idTitle));
      inpTitle.addEventListener("input", (e) => {
        boxDef.label = e.target.value;
        const titleEl = document.getElementById("title_" + boxDef.id);
        if (titleEl) titleEl.textContent = boxDef.label || "";
      });
    }

    return grp;
  }

  /* ---------- Render Page ---------- */
  function renderPage(i) {
    cur = i;
    if (labelPg) labelPg.textContent = i + 1;
    if (labelPg2) labelPg2.textContent = i + 1;
    if (lgmPageNum) lgmPageNum.textContent = i + 1;

    if (pageInstruction) pageInstruction.textContent = PAGE_INSTR[i] || "";

    const src = PAGES[i].bg || "";
    bgImg.src =
      src ||
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="%23999">BG missing</text></svg>';

    stage.querySelectorAll(".lgm-text-overlay").forEach((n) => n.remove());
    if (inputs) inputs.innerHTML = "";

    const s = k();

    PAGES[i].boxes.forEach((b) => {
      // Render title text (only if hasTitleInput is true)
      if (b.hasTitleInput && b.titlePos) {
        const titleEl = document.createElement("div");
        titleEl.className = "lgm-text-overlay";
        titleEl.id = "title_" + b.id;
        titleEl.textContent = b.label || "";
        titleEl.style.left = b.titlePos.x * s + "px";
        titleEl.style.top = b.titlePos.y * s + "px";
        titleEl.style.width = b.titlePos.w * s + "px";
        titleEl.style.maxHeight = b.titlePos.h * s + "px";
        titleEl.style.fontSize = b.titleFs * s + "px";
        titleEl.style.lineHeight = "1.2";
        titleEl.style.color = b.titleColor || "#6F3188";
        titleEl.style.fontFamily = "'Jost', sans-serif";
        titleEl.style.fontWeight = "700";
        titleEl.style.overflow = "hidden";
        titleEl.style.whiteSpace = "nowrap";
        titleEl.style.textOverflow = "ellipsis";
        titleEl.style.position = "absolute";
        titleEl.style.zIndex = "10";
        stage.appendChild(titleEl);
      }

      // Render body text
      if (b.bodyPos) {
        const out = document.createElement("div");
        out.className = "lgm-text-overlay";
        out.id = "out_" + b.id;
        out.textContent = b.val || "";
        out.style.left = b.bodyPos.x * s + "px";
        out.style.top = b.bodyPos.y * s + "px";
        out.style.width = b.bodyPos.w * s + "px";
        out.style.height = b.bodyPos.h * s + "px";
        out.style.fontSize = b.bodyFs * s + "px";
        out.style.lineHeight = "1.35";
        out.style.color = b.bodyColor || "#1f2937";
        out.style.fontFamily = "'Inter', sans-serif";
        out.style.fontWeight = "400";
        out.style.overflow = "hidden";
        out.style.whiteSpace = "pre-wrap";
        out.style.wordWrap = "break-word";
        out.style.position = "absolute";
        out.style.zIndex = "10";
        stage.appendChild(out);
      }

      const grp = makeStdFormGroup(i, PAGES[i].boxes.indexOf(b), b);
      inputs.appendChild(grp);
    });

    if (pager) {
      pager.querySelectorAll("button").forEach((a, ix) => {
        const isActive = ix === i;
        a.className = isActive
          ? "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all border-lpdp-gold/40 bg-lpdp-navy text-lpdp-gold shadow-md"
          : "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all border-slate-600 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-500";
      });
    }
  }

  /* ---------- Navigasi ---------- */
  btnPrev.onclick = () => renderPage((cur - 1 + PAGES.length) % PAGES.length);
  btnNext.onclick = () => renderPage((cur + 1) % PAGES.length);
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") btnPrev.click();
    if (e.key === "ArrowRight") btnNext.click();
  });

  /* ---------- Safe resize handler ---------- */
  let _lastStageWidth = 0;
  window.addEventListener("resize", () => {
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA") && inputs && inputs.contains(active)) {
      return;
    }
    const w = stage ? stage.clientWidth : 0;
    if (w === _lastStageWidth) return;
    _lastStageWidth = w;
    renderPage(cur);
  });

  /* ---------- LocalStorage ---------- */
  const KEY = "lgm_pk280_v2";

  function saveState() {
    const data = PAGES.map((p) => {
      const { boxes, name } = p;
      return { name, boxes };
    });
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function restoreState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length === PAGES.length) {
        for (let i = 0; i < PAGES.length; i++) {
          const curPg = PAGES[i],
            savPg = saved[i] || {};
          if (Array.isArray(savPg.boxes) && Array.isArray(curPg.boxes)) {
            curPg.boxes = curPg.boxes.map((b, idx) => ({ ...b, ...(savPg.boxes[idx] || {}) }));
          }
        }
      }
    } catch (e) {}
  }

  const btnSave = document.getElementById("lgm-save");
  if (btnSave) {
    btnSave.onclick = () => {
      saveState();
      btnSave.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Tersimpan!';
      setTimeout(() => {
        btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk mr-1"></i> Simpan (Local)';
      }, 2000);
    };
  }

  /* ---------- Export Canvas Text Overlay (pixel-perfect, no DOM text quirks) ---------- */
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split("\n");
    let cy = y;
    for (const para of paragraphs) {
      const words = para.split(" ").filter((w) => w.length > 0);
      if (words.length === 0) {
        cy += lineHeight;
        continue;
      }

      let lineWords = [];
      let lineWidth = 0;

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordW = ctx.measureText(word).width;
        const spaceW = lineWords.length > 0 ? ctx.measureText(" ").width : 0;

        if (lineWidth + spaceW + wordW > maxWidth && lineWords.length > 0) {
          // Flush current line — justified (wrapped line, not last)
          drawJustifiedLine(ctx, lineWords, x, cy, maxWidth);
          lineWords = [word];
          lineWidth = wordW;
          cy += lineHeight;
        } else {
          lineWords.push(word);
          lineWidth += spaceW + wordW;
        }
      }

      // Flush last line of paragraph — left-aligned
      if (lineWords.length > 0) {
        ctx.fillText(lineWords.join(" "), x, cy);
        cy += lineHeight;
      }
    }
  }

  function drawJustifiedLine(ctx, words, x, y, maxWidth) {
    if (words.length === 1) {
      ctx.fillText(words[0], x, y);
      return;
    }

    let totalWordsWidth = 0;
    const wordWidths = [];
    for (const w of words) {
      const ww = ctx.measureText(w).width;
      wordWidths.push(ww);
      totalWordsWidth += ww;
    }

    const extraSpace = maxWidth - totalWordsWidth;
    const gap = extraSpace / (words.length - 1);

    let cx = x;
    for (let i = 0; i < words.length; i++) {
      ctx.fillText(words[i], cx, y);
      cx += wordWidths[i] + gap;
    }
  }

  function renderExportCanvas() {
    const old = document.getElementById("lgm-export-canvas");
    if (old) old.remove();

    const canvas = document.createElement("canvas");
    canvas.id = "lgm-export-canvas";
    canvas.width = 1080;
    canvas.height = 1350;
    canvas.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;z-index:20;pointer-events:none;";

    const ctx = canvas.getContext("2d");

    PAGES[cur].boxes.forEach((b) => {
      // Title — exact coordinates from PAGES, no scaling
      if (b.hasTitleInput && b.titlePos && (b.label || "").trim()) {
        ctx.font = `bold ${b.titleFs}px "Jost", sans-serif`;
        ctx.fillStyle = b.titleColor || "#6F3188";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.save();
        ctx.beginPath();
        ctx.rect(b.titlePos.x, b.titlePos.y, b.titlePos.w, b.titlePos.h);
        ctx.clip();
        ctx.fillText(b.label, b.titlePos.x, b.titlePos.y);
        ctx.restore();
      }

      // Body — exact coordinates from PAGES, no scaling
      if (b.bodyPos && (b.val || "").trim()) {
        ctx.font = `${b.bodyFs}px "Inter", sans-serif`;
        ctx.fillStyle = b.bodyColor || "#1f2937";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.save();
        ctx.beginPath();
        ctx.rect(b.bodyPos.x, b.bodyPos.y, b.bodyPos.w, b.bodyPos.h);
        ctx.clip();
        wrapText(ctx, b.val, b.bodyPos.x, b.bodyPos.y, b.bodyPos.w, b.bodyFs * 1.35);
        ctx.restore();
      }
    });

    stage.appendChild(canvas);
    return canvas;
  }

  /* ---------- Export ---------- */
  async function renderCanvasSafe() {
    try {
      await bgImg.decode();
    } catch (e) {}
    stage.classList.add("exporting");

    // Draw pixel-perfect text onto canvas overlay, hide DOM text during export
    const exportCanvas = renderExportCanvas();
    stage.querySelectorAll(".lgm-text-overlay").forEach((el) => (el.style.display = "none"));

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    try {
      const cv = await html2canvas(stage, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      return cv;
    } finally {
      stage.classList.remove("exporting");
      // Restore DOM text, remove export canvas
      if (exportCanvas) exportCanvas.remove();
      stage.querySelectorAll(".lgm-text-overlay").forEach((el) => (el.style.display = ""));
    }
  }

  const btnExport = document.getElementById("lgm-export");
  if (btnExport) {
    btnExport.onclick = async () => {
      const originalText = btnExport.innerHTML;
      btnExport.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Memproses...';
      btnExport.disabled = true;
      try {
        const cv = await renderCanvasSafe();
        cv.toBlob((b) => saveAs(b, "page-" + (cur + 1) + ".png"));
      } catch (err) {
        console.error(err);
        alert("Gagal mengekspor halaman.");
      } finally {
        btnExport.innerHTML = originalText;
        btnExport.disabled = false;
      }
    };
  }

  const btnExportAll = document.getElementById("lgm-export-all");
  if (btnExportAll) {
    btnExportAll.onclick = async () => {
      const originalText = btnExportAll.innerHTML;
      btnExportAll.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Memproses...';
      btnExportAll.disabled = true;
      try {
        const zip = new JSZip();
        const keep = cur;
        for (let i = 0; i < PAGES.length; i++) {
          renderPage(i);
          const cv = await renderCanvasSafe();
          await new Promise((resolve) =>
            cv.toBlob((b) => {
              const fr = new FileReader();
              fr.onload = () => {
                zip.file("page-" + (i + 1) + ".png", fr.result.split(",")[1], { base64: true });
                resolve();
              };
              fr.readAsDataURL(b);
            })
          );
        }
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, "LGM-PK280-All-Pages.zip");
        renderPage(keep);
      } catch (err) {
        console.error(err);
        alert("Gagal mengekspor semua halaman.");
      } finally {
        btnExportAll.innerHTML = originalText;
        btnExportAll.disabled = false;
      }
    };
  }

  /* ---------- Init ---------- */
  let _initialized = false;
  function init() {
    if (_initialized) return;
    _initialized = true;
    restoreState();
    buildPager();
    renderPage(0);
  }

  window.lgmEditor = { init, renderPage, PAGES };
})();
