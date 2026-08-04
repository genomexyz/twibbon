/**
 * LGM Editor — 7 Halaman WYSIWYG untuk Life Grand Map
 * Adaptasi dari LGMCakra dengan tema PK LPDP 280
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
    const minH = 80; // minimum height in pixels
    el.style.height = Math.max(minH, el.scrollHeight) + "px";
  }

  /* ---------- Palet warna ---------- */
  const COLOR = {
    titleDefault: "#2e6368",
    titleText: "#daa520",
    bodyDefault: "#f6e6c5",
    titleMulberry: "#61313e",
    titleTextGold: "#f7c64b",
    bodySelf: "#e8c0b3",
  };

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
    7: withBase("frame-08.png"),
  };

  /* ---------- PAGES ---------- */
  const PAGES = [
    /* 1) SELF POTENTIAL — flow 1 kolom */
    {
      name: "Self Potential & Development Identification",
      type: "flow",
      bg: FRAME[1],
      flow: {
        cols: 1,
        gapPct: 1,
        leftPct: 5.5,
        topPct: 23,
        widthPct: 89.5,
        padXPct: 0,
        padYPct: 0,
        lock: true,
        anchor: { mode: "manual" },
      },
      boxes: [
        { id: "p1a", label: "Skill 1", fs: 20, lh: 1.35, style: { bodyBg: COLOR.bodySelf, titleColor: "#f6e6c5" } },
        { id: "p1b", label: "Skill 2", fs: 20, lh: 1.35, style: { bodyBg: COLOR.bodySelf, titleColor: "#f6e6c5" } },
        { id: "p1c", label: "Skill 3", fs: 20, lh: 1.35, style: { bodyBg: COLOR.bodySelf, titleColor: "#f6e6c5" } },
        { id: "p1d", label: "Skill 4", fs: 20, lh: 1.35, style: { bodyBg: COLOR.bodySelf, titleColor: "#f6e6c5" } },
      ],
    },

    /* 2) STUDY PLAN (1–4) */
    {
      name: "Study Plan & Academic Achievement (1–4)",
      type: "flow",
      bg: FRAME[2],
      flow: {
        cols: 2,
        gapPct: 2,
        leftPct: 4,
        topPct: 21,
        widthPct: 93,
        padXPct: 2,
        padYPct: 2,
        lock: true,
        anchor: { mode: "manual" },
      },
      boxes: [
        { id: "p2a", label: "1st Term", fs: 20, lh: 1.35, val: "" },
        { id: "p2b", label: "2nd Term", fs: 20, lh: 1.35, val: "" },
        { id: "p2c", label: "3rd Term", fs: 20, lh: 1.35, val: "" },
        { id: "p2d", label: "4th Term", fs: 20, lh: 1.35, val: "" },
      ],
    },

    /* 3) STUDY PLAN (5–8) */
    {
      name: "Study Plan & Academic Achievement (5–8)",
      type: "flow",
      bg: FRAME[3],
      flow: {
        cols: 2,
        gapPct: 2,
        leftPct: 4,
        topPct: 21,
        widthPct: 93,
        padXPct: 2,
        padYPct: 2,
        lock: true,
        anchor: { mode: "manual" },
      },
      boxes: [
        { id: "p3a", label: "5th Term", fs: 20, lh: 1.35, val: "" },
        { id: "p3b", label: "6th Term", fs: 20, lh: 1.35, val: "" },
        { id: "p3c", label: "7th Term", fs: 20, lh: 1.35, val: "" },
        { id: "p3d", label: "8th Term", fs: 20, lh: 1.35, val: "" },
      ],
    },

    /* 4) LIFE GRAND MAP (2025–2035) */
    {
      name: "Life Grand Map (2025–2035)",
      type: "flow",
      bg: FRAME[4],
      flow: {
        cols: 2,
        gapPct: 2,
        leftPct: 4,
        topPct: 37,
        widthPct: 93,
        padXPct: 2,
        padYPct: 2,
        lock: true,
        anchor: { mode: "manual" },
      },
      boxes: [
        {
          id: "p4a",
          label: "2025 – 2030",
          fs: 22,
          lh: 1.35,
          val: "",
          style: { titleBg: COLOR.titleMulberry, titleColor: COLOR.titleTextGold },
        },
        {
          id: "p4b",
          label: "2030 – 2035",
          fs: 22,
          lh: 1.35,
          val: "",
          style: { titleBg: COLOR.titleMulberry, titleColor: COLOR.titleTextGold },
        },
      ],
    },

    /* 5) LIFE GRAND MAP (2035–Beyond) */
    {
      name: "Life Grand Map (2035–Beyond)",
      type: "flow",
      bg: FRAME[5],
      flow: {
        cols: 2,
        gapPct: 2,
        leftPct: 4,
        topPct: 37,
        widthPct: 93,
        padXPct: 2,
        padYPct: 2,
        lock: true,
        anchor: { mode: "manual" },
      },
      boxes: [
        {
          id: "p5a",
          label: "2035 – 2040",
          fs: 22,
          lh: 1.35,
          val: "",
          style: { titleBg: COLOR.titleMulberry, titleColor: COLOR.titleTextGold },
        },
        {
          id: "p5b",
          label: "2040 – Beyond",
          fs: 22,
          lh: 1.35,
          val: "",
          style: { titleBg: COLOR.titleMulberry, titleColor: COLOR.titleTextGold },
        },
      ],
    },

    /* 6) GRAND GOALS & PLANS */
    {
      name: "Grand Goals & Plans",
      type: "flow",
      bg: FRAME[6],
      flow: {
        cols: 1,
        gapPct: 3,
        leftPct: 4,
        topPct: 21,
        widthPct: 93,
        padXPct: 2,
        padYPct: 2,
        lock: true,
        anchor: { mode: "manual" },
      },
      boxes: [
        { id: "p6a", label: "Contribution Plans", fs: 24, lh: 1.36, val: "" },
        { id: "p6b", label: "Personal Grand Plans", fs: 24, lh: 1.36, val: "" },
      ],
    },

    /* 7) COVER */
    { name: "CAKRA NAWASENA — Cover", type: "abs", bg: FRAME[7], boxes: [] },
  ];

  /* ---------- Instruksi per halaman ---------- */
  const PAGE_INSTR = [
    "Langkah 1 dari 7: Identifikasi & Deskripsi Potensi Diri. Isi Heading (judul) dan Description pada setiap box.",
    "Langkah 2 dari 7: Rencana Studi & Akademik (S2). Uraikan rencana studi dan target akademik untuk empat semester pertama.",
    "Langkah 3 dari 7: Rencana Studi & Akademik (S3). Lanjutkan pemaparan untuk empat semester terakhir.",
    "Langkah 4 dari 7: Peta Jalan Hidup (Jangka Menengah). Tuliskan visi & rencana konkret 5–10 tahun ke depan.",
    "Langkah 5 dari 7: Peta Jalan Hidup (Jangka Panjang). Proyeksikan impian dan rencana besar 10 tahun ke atas.",
    "Langkah 6 dari 7: Rencana Kontribusi & Tujuan Utama. Rangkum rencana kontribusi serta tujuan besar pribadi.",
    "Langkah 7 dari 7: Halaman Sampul (Cover). Tidak ada isian; periksa kembali halaman sebelumnya atau unduh hasilnya.",
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
  const CHAR_LIMIT = 900;
  function updateCharCount(id, text) {
    const el = document.getElementById("wc_" + id);
    if (!el) return;
    const n = (text || "").length;
    const pct = Math.round((n / CHAR_LIMIT) * 100);
    let colorClass = "text-slate-500";
    if (n > CHAR_LIMIT) colorClass = "text-rose-400 font-bold";
    else if (pct >= 85) colorClass = "text-amber-400";
    else if (pct >= 60) colorClass = "text-lpdp-gold";
    el.className = "text-[11px] " + colorClass;
    el.textContent = n + " / " + CHAR_LIMIT + " chars";
  }

  /* ---------- Dynamic body font scaling ---------- */
  function setBoxBodyFontSize(outEl, text, scaleFactor) {
    if (!outEl) return;
    const charCount = (text || "").length;
    // Base body font: 17px scaled to stage, min 12px for readability
    const baseFs = Math.max(12, 17 * scaleFactor);
    // Gentle reduction as text grows: at 900 chars, scale ~0.76
    const scale = Math.max(0.72, 1 - (charCount / 3200));
    const finalFs = baseFs * scale;
    outEl.style.fontSize = finalFs.toFixed(2) + "px";
  }

  /* ---------- Remove box ---------- */
  function toggleBoxDisabled(pageIndex, boxIndex) {
    const pg = PAGES[pageIndex];
    if (!pg || !Array.isArray(pg.boxes)) return;
    const box = pg.boxes[boxIndex];
    box.disabled = !box.disabled;
    renderPage(pageIndex);
  }

  /* ---------- Form Standar ---------- */
  function makeStdFormGroup(pageIndex, boxIndex, boxDef) {
    const grp = document.createElement("div");
    grp.className = "bg-slate-900/60 border border-slate-700 rounded-xl p-3";

    const idTitle = "ttl_" + boxDef.id;
    const idText = "in_" + boxDef.id;

    const isDisabled = boxDef.disabled;
    grp.className = isDisabled
      ? "bg-slate-900/30 border border-slate-800 rounded-xl p-3 opacity-60"
      : "bg-slate-900/60 border border-slate-700 rounded-xl p-3";

    grp.innerHTML =
      '<label class="block text-xs ' + (isDisabled ? 'text-slate-600' : 'text-slate-400') + ' mb-1 font-medium">Heading</label>' +
      '<input id="' + idTitle + '" ' + (isDisabled ? 'disabled ' : '') + 'class="w-full bg-slate-950 border ' + (isDisabled ? 'border-slate-800 text-slate-600' : 'border-slate-700 text-slate-100') + ' rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lpdp-gold transition-colors" type="text" value="' +
      (boxDef.label || "").replace(/"/g, "&quot;") +
      '"/\>' +
      '<label class="block text-xs ' + (isDisabled ? 'text-slate-600' : 'text-slate-400') + ' mb-1 font-medium mt-2">Description</label>' +
      '<textarea id="' + idText + '" ' + (isDisabled ? 'disabled ' : '') + 'maxlength="' + CHAR_LIMIT + '" class="w-full bg-slate-950 border ' + (isDisabled ? 'border-slate-800 text-slate-600' : 'border-slate-700 text-slate-100') + ' rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lpdp-gold transition-colors resize-none overflow-hidden" rows="4" placeholder="Tulis konten..."></textarea>' +
      '<div class="flex justify-between items-center mt-2">' +
      '<small class="text-[11px] text-slate-500" id="wc_' + boxDef.id + '"></small>' +
      '<button type="button" class="px-2 py-1 rounded-md border ' + (isDisabled ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10' : 'border-rose-500/40 text-rose-400 hover:bg-rose-500/10') + ' text-[11px] transition-colors" data-toggle="' + boxIndex + '">' + (isDisabled ? 'Enable' : 'Disable') + '</button>' +
      "</div>";

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
      setBoxBodyFontSize(outEl, boxDef.val, k());
    });

    const inpTitle = grp.querySelector("#" + CSS.escape(idTitle));
    inpTitle.addEventListener("input", (e) => {
      boxDef.label = e.target.value;
      const titleEl = document.getElementById("title_" + boxDef.id);
      if (titleEl) titleEl.textContent = boxDef.label || "";
    });

    const btnToggle = grp.querySelector("[data-toggle]");
    btnToggle.addEventListener("click", () => {
      toggleBoxDisabled(pageIndex, boxIndex);
    });

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

    stage.querySelectorAll(".lgm-overlay-abs, .lgm-flow-wrap").forEach((n) => n.remove());
    if (inputs) inputs.innerHTML = "";

    if (PAGES[i].type === "abs") {
      const s = k();
      PAGES[i].boxes.forEach((b) => {
        if (!b.disabled) {
          const el = document.createElement("div");
          el.className = "lgm-overlay-abs lgm-box";
          el.style.left = b.x * s + "px";
          el.style.top = b.y * s + "px";
          el.style.width = b.w * s + "px";
          el.style.fontSize = b.fs * s + "px";
          el.style.lineHeight = b.lh;

          const st = b.style || {};
          if (st.shadow) el.style.setProperty("--shadow", st.shadow);
          if (st.titleBg) el.style.setProperty("--title-bg", st.titleBg);
          if (st.titleColor) el.style.setProperty("--title-color", st.titleColor);
          if (st.bodyBg) el.style.setProperty("--body-bg", st.bodyBg);
          if (st.bodyBorder) el.style.setProperty("--body-border", st.bodyBorder);
          if (st.bodyPadX !== undefined) el.style.setProperty("--body-pad-x", st.bodyPadX * s + "px");
          if (st.bodyPadY !== undefined) el.style.setProperty("--body-pad-y", st.bodyPadY * s + "px");
          if (st.height) el.style.height = st.height * s + "px";

          const title = document.createElement("div");
          title.className = "lgm-box-title";
          title.id = "title_" + b.id;
          title.textContent = b.label;

          const out = document.createElement("div");
          out.className = "lgm-box-body";
          out.id = "out_" + b.id;
          out.textContent = b.val || "";
          setBoxBodyFontSize(out, b.val, s);

          el.append(title, out);
          stage.appendChild(el);
        }

        const grp = makeStdFormGroup(i, PAGES[i].boxes.indexOf(b), b);
        inputs.appendChild(grp);
      });
    } else {
      const f = PAGES[i].flow;
      const s = k();
      const toPxW = (p) => p * 10.8 * s + "px";
      const toPxH = (p) => p * 13.5 * s + "px";

      let leftPx = toPxW(f.leftPct);
      let topPx = toPxH(f.topPct);

      if (f.anchor && f.anchor.mode === "first-box-xy" && PAGES[i].boxes?.[f.anchor.boxIndex || 0]) {
        const b0 = PAGES[i].boxes[f.anchor.boxIndex || 0];
        if (typeof b0.x === "number" && typeof b0.y === "number") {
          leftPx = b0.x * s + "px";
          topPx = b0.y * s + "px";
        }
      }

      const wrap = document.createElement("div");
      wrap.className = "lgm-flow-wrap";
      wrap.style.setProperty("--cols", f.cols);
      wrap.style.setProperty("--gap-px", toPxW(f.gapPct));
      wrap.style.setProperty("--padX-px", toPxW(f.padXPct));
      wrap.style.setProperty("--padY-px", toPxH(f.padYPct));
      wrap.style.setProperty("--left-px", leftPx);
      wrap.style.setProperty("--top-px", topPx);
      wrap.style.setProperty("--w-px", toPxW(f.widthPct));

      PAGES[i].boxes.forEach((b) => {
        if (!b.disabled) {
          const card = document.createElement("div");
          card.className = "lgm-box";
          card.style.fontSize = b.fs * s + "px";
          card.style.lineHeight = b.lh;

          const st = b.style || {};
          if (st.shadow) card.style.setProperty("--shadow", st.shadow);
          if (st.titleBg) card.style.setProperty("--title-bg", st.titleBg);
          if (st.titleColor) card.style.setProperty("--title-color", st.titleColor);
          if (st.bodyBg) card.style.setProperty("--body-bg", st.bodyBg);
          if (st.bodyBorder) card.style.setProperty("--body-border", st.bodyBorder);
          if (st.bodyPadX !== undefined) card.style.setProperty("--body-pad-x", st.bodyPadX * s + "px");
          if (st.bodyPadY !== undefined) card.style.setProperty("--body-pad-y", st.bodyPadY * s + "px");

          const title = document.createElement("div");
          title.className = "lgm-box-title";
          title.id = "title_" + b.id;
          title.textContent = b.label;

          const out = document.createElement("div");
          out.className = "lgm-box-body";
          out.id = "out_" + b.id;
          out.textContent = b.val || "";
          setBoxBodyFontSize(out, b.val, s);

          card.append(title, out);
          wrap.appendChild(card);
        }

        const grp = makeStdFormGroup(i, PAGES[i].boxes.indexOf(b), b);
        inputs.appendChild(grp);
      });

      stage.appendChild(wrap);
    }

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
  window.addEventListener("resize", () => renderPage(cur));

  /* ---------- LocalStorage ---------- */
  const KEY = "lgm_pk280_v1";

  function saveState() {
    const data = PAGES.map((p) => {
      const { boxes, flow, name, type } = p;
      return { name, type, boxes, flow };
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
          if (savPg.flow && curPg.flow) curPg.flow = { ...curPg.flow, ...savPg.flow };
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

  /* ---------- Export ---------- */
  async function renderCanvasSafe() {
    try {
      await bgImg.decode();
    } catch (e) {}
    stage.classList.add("exporting");
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
