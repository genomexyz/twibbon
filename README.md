# 🎓 Twibbon & Life Grand Map Generator PK LPDP 280

A modern, fast, and 100% static web-based **Twibbon & Life Grand Map (LGM) Generator** created for **Persiapan Keberangkatan (PK) LPDP Angkatan 280**.

Unlike traditional twibbon generators that require shift buttons to adjust photos, this application features **direct drag & drop panning**, **mouse wheel zoom**, and **pinch-to-zoom** directly on the interactive canvas, alongside **dynamic free-text awardee bio overlays** (no database required) and **Life Grand Map (LGM)** diagram poster support!

![PK LPDP 280 Twibbon](assets/frame.svg)

---

## ✨ Features

- 👆 **Interactive Direct Dragging**: Click/touch and drag your profile photo or Life Grand Map diagram left, right, up, or down directly on the canvas.
- 🔍 **Smooth Zoom & Pinch**: Use mouse scroll wheel or 2-finger pinch gesture on mobile devices to resize images.
- 📝 **Dynamic Awardee Bio Text Overlay**:
  - **Nama Lengkap & Gelar**
  - **Program Studi**
  - **Universitas / Perguruan Tinggi**
  - **Jenjang Studi** (*Magister Dalam Negeri, Magister Luar Negeri, Doktor Dalam Negeri, Doktor Luar Negeri, or Custom*)
  - **Negara Tujuan**
  - *No database needed! Completely client-side and free-text input.*
- 🗺️ **Dual Mode (Profile Twibbon & Life Grand Map)**:
  - **Tab 1: Twibbon Foto Profil**: Combine awardee photo + PK LPDP 280 frame + bio overlay.
  - **Tab 2: Life Grand Map (LGM)**: Combine Life Grand Map roadmap diagram + LGM frame header + bio overlay.
- 🔄 **Rotation & Flip Controls**: Rotate photo by 90 degrees or mirror horizontally with a single click.
- ⚡ **100% Static & Client-Side**: No backend or database required! Runs entirely inside the browser.
- 🚀 **GitHub Pages Ready**: Host on GitHub Pages or any static CDN.
- 🎨 **High-Resolution Export**: Download crystal clear 1080x1080 px PNG files ready for Instagram, LinkedIn, and social media.

---

## 📁 Project Structure

```
twibbon_web/
├── index.html        # Main HTML web page
├── styles.css        # Custom CSS styles
├── app.js            # Core interactive canvas logic, text renderer & event handlers
├── assets/
│   ├── frame.svg     # PK LPDP 280 Twibbon frame (SVG template)
│   └── frame.png     # Official PK LPDP 280 Twibbon frame (PNG with transparent hole)
└── README.md         # Documentation & deployment guide
```

---

## 🎨 How to Update the Twibbon Frame Design

To replace the default frame with your official batch design created in Canva, Photoshop, or Figma:

1. Export your design as a **1080x1080 px PNG image** with a **transparent background** where the user's photo should appear.
2. Save or replace the file in `assets/frame.png` or `assets/frame.svg`.
3. Push changes to GitHub. The generator will automatically load your new frame!

> **Note**: Users can also click the *"Ganti File Frame PNG / SVG"* button on the web page to test custom frame files directly in their browser.

---

## 🚀 How to Deploy to GitHub Pages

Follow these simple steps to host this web app on GitHub Pages for free:

### Step 1: Create a GitHub Repository
1. Log in to [GitHub](https://github.com) and create a new public repository (e.g., `twibbon-pklpdp280`).
2. Push all files (`index.html`, `styles.css`, `app.js`, `assets/`, `README.md`) to the `main` branch.

### Step 2: Enable GitHub Pages
1. On your GitHub repository page, go to **Settings** -> **Pages** (under Code and automation).
2. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` branch and `/ (root)` folder.
3. Click **Save**.
4. Within 1-2 minutes, GitHub Pages will deploy your site at:
   `https://<your-username>.github.io/<repository-name>/`

---

## 📜 License

Created for PK LPDP 280. Open source & free to use for LPDP awardees.
