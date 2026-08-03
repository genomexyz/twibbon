/**
 * Demografi Map — Distribusi Awardee PK LPDP 280
 * OpenStreetMap dengan garis domisili → tujuan studi
 */
(function () {
  "use strict";

  const RUMPUN_COLORS = {
    "Humaniora & Seni": "#E63946",
    "Hukum & Kebijakan": "#F4A261",
    "Sains & Matematika": "#2A9D8F",
    "Kesehatan & Hayati": "#264653",
    "Teknik & Rekayasa": "#E9C46A",
    "IT & Komputer": "#F77F00",
    "Ekonomi & Bisnis": "#8338EC",
    "Pendidikan": "#3A86FF",
  };

  const RUMPUN_LABELS = Object.keys(RUMPUN_COLORS);

  let map = null;
  let linesLayer = null;
  let markersLayer = null;
  let _data = null;
  let _initialized = false;

  function init() {
    if (_initialized) return;
    _initialized = true;

    const container = document.getElementById("demografi-map");
    if (!container) return;

    map = L.map("demografi-map", {
      center: [-2.5, 118],
      zoom: 5,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    linesLayer = L.layerGroup().addTo(map);
    markersLayer = L.layerGroup().addTo(map);

    fetch("assets/demografi/members.json")
      .then((r) => r.json())
      .then((data) => {
        _data = data;
        renderMap();
        buildLegend();
        buildStats();
        wireToggles();
      })
      .catch((err) => {
        console.error("Gagal memuat data demografi:", err);
        container.innerHTML =
          '<div class="flex items-center justify-center h-full text-slate-400 text-sm">Gagal memuat data peta. Pastikan file assets/demografi/members.json tersedia.</div>';
      });
  }

  function renderMap() {
    if (!_data || !map) return;
    linesLayer.clearLayers();
    markersLayer.clearLayers();

    // Draw origin → destination curved lines
    _data.forEach((m) => {
      const color = RUMPUN_COLORS[m.rumpun] || "#94a3b8";
      const o = m.origin;
      const d = m.dest;
      if (!o || !d || (o.lat === 0 && o.lng === 0) || (d.lat === 0 && d.lng === 0))
        return;

      // Compute curved path (quadratic bezier with midpoint offset)
      const latlngs = computeCurve(o, d);

      const poly = L.polyline(latlngs, {
        color: color,
        weight: 1.5,
        opacity: 0.55,
        dashArray: null,
        smoothFactor: 1,
      });

      poly.bindPopup(
        `<div style="font-family:sans-serif;font-size:13px">
          <strong>${m.nama}</strong><br/>
          <span style="color:${color}">●</span> ${m.rumpun}<br/>
          <small>${m.domisili} → ${m.tujuan}</small><br/>
          <small>${m.univ}</small>
        </div>`,
        { maxWidth: 280 }
      );

      // Highlight on hover
      poly.on("mouseover", function () {
        this.setStyle({ weight: 3.5, opacity: 0.95 });
      });
      poly.on("mouseout", function () {
        this.setStyle({ weight: 1.5, opacity: 0.55 });
      });

      linesLayer.addLayer(poly);
    });

    // Draw city markers (deduplicated)
    const cityGroups = {};
    _data.forEach((m) => {
      const oKey = `${m.origin.lat.toFixed(3)},${m.origin.lng.toFixed(3)}`;
      const dKey = `${m.dest.lat.toFixed(3)},${m.dest.lng.toFixed(3)}`;
      if (!cityGroups[oKey]) cityGroups[oKey] = { loc: m.origin, name: m.domisili, count: 0, rumpuns: {} };
      if (!cityGroups[dKey]) cityGroups[dKey] = { loc: m.dest, name: m.tujuan, count: 0, rumpuns: {} };
      cityGroups[oKey].count++;
      cityGroups[oKey].rumpuns[m.rumpun] = (cityGroups[oKey].rumpuns[m.rumpun] || 0) + 1;
      cityGroups[dKey].count++;
      cityGroups[dKey].rumpuns[m.rumpun] = (cityGroups[dKey].rumpuns[m.rumpun] || 0) + 1;
    });

    Object.values(cityGroups).forEach((cg) => {
      const size = Math.min(18, 6 + Math.sqrt(cg.count) * 2.5);
      const rumpunList = Object.entries(cg.rumpuns)
        .sort((a, b) => b[1] - a[1])
        .map(([r, c]) => `<span style="color:${RUMPUN_COLORS[r]}">●</span> ${r}: ${c}`)
        .join("<br/>");

      const circle = L.circleMarker([cg.loc.lat, cg.loc.lng], {
        radius: size,
        fillColor: "#D4AF37",
        color: "#06172E",
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.75,
      });

      circle.bindPopup(
        `<div style="font-family:sans-serif;font-size:13px">
          <strong>${cg.name}</strong><br/>
          <small>Total awardee: ${cg.count}</small><br/>
          <div style="margin-top:4px">${rumpunList}</div>
        </div>`,
        { maxWidth: 260 }
      );

      markersLayer.addLayer(circle);
    });
  }

  function computeCurve(o, d) {
    // Simple quadratic bezier: compute control point offset perpendicular to line
    const steps = 20;
    const lat1 = o.lat, lng1 = o.lng;
    const lat2 = d.lat, lng2 = d.lng;

    // Distance factor for curve height
    const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
    const offset = dist * 0.25; // curve height

    // Control point: midpoint + perpendicular offset
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    // Perpendicular direction
    const dx = lng2 - lng1;
    const dy = lat2 - lat1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const perpX = (-dy / len) * offset;
    const perpY = (dx / len) * offset;

    const cLat = midLat + perpY;
    const cLng = midLng + perpX;

    const points = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Quadratic bezier: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      const lat = Math.pow(1 - t, 2) * lat1 + 2 * (1 - t) * t * cLat + Math.pow(t, 2) * lat2;
      const lng = Math.pow(1 - t, 2) * lng1 + 2 * (1 - t) * t * cLng + Math.pow(t, 2) * lng2;
      points.push([lat, lng]);
    }
    return points;
  }

  function buildLegend() {
    const legend = document.getElementById("demografi-legend");
    if (!legend) return;

    const counts = {};
    if (_data) {
      _data.forEach((m) => {
        counts[m.rumpun] = (counts[m.rumpun] || 0) + 1;
      });
    }

    legend.innerHTML = RUMPUN_LABELS.map((r) => {
      const c = RUMPUN_COLORS[r];
      const count = counts[r] || 0;
      return `
        <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 cursor-pointer hover:bg-slate-800/80 transition-colors"
             data-rumpun="${r.replace(/"/g, "&quot;")}">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full inline-block" style="background:${c}"></span>
            <span class="text-slate-200 font-medium">${r}</span>
          </div>
          <span class="text-slate-400 font-bold">${count}</span>
        </div>`;
    }).join("");

    // Click to toggle rumpun visibility
    legend.querySelectorAll("[data-rumpun]").forEach((el) => {
      el.addEventListener("click", () => {
        const rumpun = el.dataset.rumpun;
        el.classList.toggle("opacity-50");
        const active = !el.classList.contains("opacity-50");

        linesLayer.eachLayer((layer) => {
          if (layer._popup) {
            const popupContent = layer._popup.getContent();
            if (popupContent && popupContent.includes(rumpun)) {
              layer.setStyle({ opacity: active ? 0.55 : 0.05 });
            }
          }
        });
      });
    });
  }

  function buildStats() {
    const stats = document.getElementById("demografi-stats");
    if (!stats || !_data) return;

    const total = _data.length;
    const domestic = _data.filter((m) => m.negara.toLowerCase() === "indonesia").length;
    const international = total - domestic;

    // Top destinations
    const destCounts = {};
    _data.forEach((m) => {
      destCounts[m.tujuan] = (destCounts[m.tujuan] || 0) + 1;
    });
    const topDests = Object.entries(destCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    stats.innerHTML = `
      <div class="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 text-center">
        <div class="text-lg font-bold text-lpdp-gold">${total}</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wider">Total Awardee</div>
      </div>
      <div class="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 text-center">
        <div class="text-lg font-bold text-emerald-400">${domestic}</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wider">Dalam Negeri</div>
      </div>
      <div class="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 text-center">
        <div class="text-lg font-bold text-sky-400">${international}</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wider">Luar Negeri</div>
      </div>
      <div class="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 col-span-2">
        <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Top Kota Tujuan</div>
        ${topDests
          .map(
            ([city, count]) =>
              `<div class="flex justify-between items-center text-xs"><span class="text-slate-300">${city}</span><span class="text-lpdp-gold font-bold">${count}</span></div>`
          )
          .join("")}
      </div>
    `;
  }

  function wireToggles() {
    const toggleLines = document.getElementById("toggle-lines");
    const toggleMarkers = document.getElementById("toggle-markers");
    if (toggleLines) {
      toggleLines.addEventListener("change", (e) => {
        if (e.target.checked) {
          if (!map.hasLayer(linesLayer)) map.addLayer(linesLayer);
        } else {
          if (map.hasLayer(linesLayer)) map.removeLayer(linesLayer);
        }
      });
    }
    if (toggleMarkers) {
      toggleMarkers.addEventListener("change", (e) => {
        if (e.target.checked) {
          if (!map.hasLayer(markersLayer)) map.addLayer(markersLayer);
        } else {
          if (map.hasLayer(markersLayer)) map.removeLayer(markersLayer);
        }
      });
    }
  }

  window.demografiMap = { init };
})();
