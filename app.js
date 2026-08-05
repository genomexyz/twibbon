/**
 * PK LPDP 280 - Interactive Static Twibbon & Life Grand Map (LGM) Generator
 * Features:
 * - Direct Drag & Drop / Touch Pan photo & LGM map
 * - Scroll Wheel & Pinch-to-Zoom
 * - Dynamic Free-Text Awardee Bio Overlay (No Database required)
 * - Dual Mode: Twibbon Foto Profil & Life Grand Map (LGM)
 * - High-Resolution Export (1080x1080)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Canvas & Context Setup
    const canvas = document.getElementById('twibbon-canvas');
    const ctx = canvas.getContext('2d');
    const canvasPlaceholder = document.getElementById('canvas-placeholder');
    const placeholderIcon = document.getElementById('placeholder-icon');
    const placeholderTitle = document.getElementById('placeholder-title');
    const placeholderSub = document.getElementById('placeholder-sub');
    const placeholderUploadBtn = document.getElementById('placeholder-upload-btn');
    const placeholderBtnText = document.getElementById('placeholder-btn-text');
    const gestureHint = document.getElementById('gesture-hint');

    // UI Tab Navigation
    const tabProfile = document.getElementById('tab-profile');
    const tabLgm = document.getElementById('tab-lgm');
    const uploadCardTitle = document.getElementById('upload-card-title');
    const dropzoneLabel = document.getElementById('dropzone-label');
    const lgmDropzoneWrapper = document.getElementById('lgm-dropzone-wrapper');
    const activeTargetText = document.getElementById('active-target-text');
    const downloadDesc = document.getElementById('download-desc');
    const downloadText = document.getElementById('download-text');

    // Bio Input Elements
    const inputNama = document.getElementById('input-nama');
    const inputProdi = document.getElementById('input-prodi');
    const inputUniv = document.getElementById('input-univ');
    const selectJenjang = document.getElementById('select-jenjang');
    const inputJenjangCustom = document.getElementById('input-jenjang-custom');
    const inputNegara = document.getElementById('input-negara');
    const checkboxShowBio = document.getElementById('checkbox-show-bio');

    // Control Elements
    const photoInput = document.getElementById('photo-input');
    const lgmInput = document.getElementById('lgm-input');
    const dropzone = document.getElementById('dropzone');
    const dropzoneLgm = document.getElementById('dropzone-lgm');

    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.getElementById('zoom-value');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnRotateLeft = document.getElementById('btn-rotate-left');
    const btnRotateRight = document.getElementById('btn-rotate-right');
    const btnFlipH = document.getElementById('btn-flip-h');
    const btnReset = document.getElementById('btn-reset');
    const btnDownload = document.getElementById('btn-download');
    const statusText = document.getElementById('status-text');
    const statusIndicator = document.getElementById('status-indicator');

    // Internal High-Res Dimensions
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1350;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Active Mode: 'profile' or 'lgm'
    let activeTab = 'profile';

    // Image Assets
    let profileImage = null;
    let lgmImage = null;
    let frameImage = new Image();
    let isFrameLoaded = false;

    // Transform States for Photo & LGM
    const profileTransform = {
        x: 0,
        y: 0,
        scale: 1,
        baseScale: 1,
        rotation: 0,
        flipH: 1,
        flipV: 1
    };

    const lgmTransform = {
        x: 0,
        y: 0,
        scale: 1,
        baseScale: 1,
        rotation: 0,
        flipH: 1,
        flipV: 1
    };

    // Helper to get active transform state object
    function getActiveTransform() {
        return activeTab === 'profile' ? profileTransform : lgmTransform;
    }

    // Helper to get active image
    function getActiveImage() {
        return activeTab === 'profile' ? profileImage : lgmImage;
    }

    // Interaction State
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;
    let touchStartDist = 0;
    let touchStartScale = 1;

    // Frame Sources
    const FRAME_SOURCES = [
        'assets/frame.svg',
        'assets/frame.png'
    ];

    // Load Frame
    function loadFrame(sourceIndex = 0) {
        if (sourceIndex >= FRAME_SOURCES.length) {
            generateFallbackFrame();
            return;
        }

        const src = FRAME_SOURCES[sourceIndex];
        frameImage = new Image();
        frameImage.crossOrigin = 'anonymous';
        frameImage.onload = () => {
            isFrameLoaded = true;
            renderCanvas();
        };
        frameImage.onerror = () => loadFrame(sourceIndex + 1);
        frameImage.src = src;
    }

    // Fallback Frame Generation
    function generateFallbackFrame() {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = CANVAS_WIDTH;
        offCanvas.height = CANVAS_HEIGHT;
        const oCtx = offCanvas.getContext('2d');

        oCtx.fillStyle = '#06172E';
        oCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        oCtx.globalCompositeOperation = 'destination-out';
        oCtx.beginPath();
        oCtx.roundRect(80, 160, 920, 1030, 32);
        oCtx.fill();

        oCtx.globalCompositeOperation = 'source-over';
        oCtx.strokeStyle = '#D4AF37';
        oCtx.lineWidth = 10;
        oCtx.strokeRect(80, 160, 920, 1030);

        oCtx.fillStyle = '#D4AF37';
        oCtx.font = 'bold 28px sans-serif';
        oCtx.textAlign = 'center';
        oCtx.fillText('PK LPDP 280', CANVAS_WIDTH / 2, 70);

        const img = new Image();
        img.onload = () => {
            frameImage = img;
            isFrameLoaded = true;
            renderCanvas();
        };
        img.src = offCanvas.toDataURL('image/png');
    }

    loadFrame();

    // === TAB SWITCHING LOGIC ===
    tabProfile.addEventListener('click', () => switchTab('profile'));
    tabLgm.addEventListener('click', () => switchTab('lgm'));
    const tabDemografi = document.getElementById('tab-demografi');
    if (tabDemografi) tabDemografi.addEventListener('click', () => switchTab('demografi'));

    function switchTab(mode) {
        activeTab = mode;
        const profileStageWrapper = document.getElementById('profile-stage-wrapper');
        const lgmStageWrapper = document.getElementById('lgm-stage-wrapper');
        const demografiStageWrapper = document.getElementById('demografi-stage-wrapper');
        const profileControls = document.getElementById('profile-controls');
        const lgmControls = document.getElementById('lgm-controls');
        const demografiControls = document.getElementById('demografi-controls');

        // Reset all tabs to inactive
        tabProfile.className = 'inactive-tab flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600';
        tabLgm.className = 'inactive-tab flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600';
        if (tabDemografi) tabDemografi.className = 'inactive-tab flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600';

        // Hide all UI
        profileStageWrapper.classList.add('hidden');
        lgmStageWrapper.classList.add('hidden');
        if (demografiStageWrapper) demografiStageWrapper.classList.add('hidden');
        profileControls.classList.add('hidden');
        profileControls.classList.remove('flex');
        lgmControls.classList.add('hidden');
        lgmControls.classList.remove('flex');
        if (demografiControls) { demografiControls.classList.add('hidden'); demografiControls.classList.remove('flex'); }

        if (mode === 'profile') {
            tabProfile.className = 'active-tab flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-lpdp-gold/40 bg-lpdp-navy text-lpdp-gold shadow-md';
            profileStageWrapper.classList.remove('hidden');
            profileControls.classList.remove('hidden');
            profileControls.classList.add('flex');

            if (profileImage) {
                hidePlaceholder();
                btnDownload.disabled = false;
            } else {
                showPlaceholder('foto');
                btnDownload.disabled = true;
            }
            updateZoomUI();
            updateStatus();
            renderCanvas();
        } else if (mode === 'lgm') {
            tabLgm.className = 'active-tab flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-lpdp-gold/40 bg-lpdp-navy text-lpdp-gold shadow-md';
            lgmStageWrapper.classList.remove('hidden');
            lgmControls.classList.remove('hidden');
            lgmControls.classList.add('flex');

            if (window.lgmEditor && typeof window.lgmEditor.init === 'function') {
                window.lgmEditor.init();
            }
        } else if (mode === 'demografi') {
            if (tabDemografi) tabDemografi.className = 'active-tab flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-lpdp-gold/40 bg-lpdp-navy text-lpdp-gold shadow-md';
            if (demografiStageWrapper) demografiStageWrapper.classList.remove('hidden');
            if (demografiControls) {
                demografiControls.classList.remove('hidden');
                demografiControls.classList.add('flex');
            }
            if (window.demografiMap && typeof window.demografiMap.init === 'function') {
                window.demografiMap.init();
            }
        }
    }

    function showPlaceholder(type) {
        canvasPlaceholder.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        if (type === 'foto') {
            placeholderIcon.className = 'fa-solid fa-cloud-arrow-up';
            placeholderTitle.textContent = 'Pilih Foto Kamu';
            placeholderSub.textContent = 'Format JPG, PNG, atau WEBP. Foto dapat digeser & diperbesar secara langsung.';
            placeholderBtnText.textContent = 'Upload Foto Profil';
            placeholderUploadBtn.onclick = () => photoInput.click();
        } else {
            placeholderIcon.className = 'fa-solid fa-map-location-dot';
            placeholderTitle.textContent = 'Unggah Life Grand Map';
            placeholderSub.textContent = 'Upload file gambar diagram Life Grand Map (LGM) kamu untuk dijadikan Twibbon LGM.';
            placeholderBtnText.textContent = 'Upload Diagram LGM';
            placeholderUploadBtn.onclick = () => (lgmInput.click() || photoInput.click());
        }
    }

    function hidePlaceholder() {
        canvasPlaceholder.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            canvasPlaceholder.classList.add('hidden');
        }, 300);
    }

    function updateStatus() {
        const img = getActiveImage();
        if (img) {
            statusText.textContent = activeTab === 'profile' ? 'Foto Profil siap disesuaikan.' : 'Life Grand Map siap disesuaikan.';
            statusIndicator.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
        } else {
            statusText.textContent = activeTab === 'profile' ? 'Unggah foto profil kamu terlebih dahulu' : 'Unggah diagram Life Grand Map terlebih dahulu';
            statusIndicator.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
        }
    }

    // === CANVAS RENDER ENGINE ===
    function renderCanvas() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (activeTab === 'profile') {
            renderProfileTwibbon();
        } else {
            renderLgmTwibbon();
        }
    }

    // Render Mode 1: Twibbon Foto Profil
    function renderProfileTwibbon() {
        // 1. User Photo
        if (profileImage) {
            renderTransformedImage(profileImage, profileTransform);
        }

        // 2. Frame Overlay
        if (isFrameLoaded && frameImage) {
            ctx.drawImage(frameImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // 3. Awardee Bio Text Overlay
        if (checkboxShowBio.checked) {
            renderBioOverlayCard();
        }
    }

    // Render Mode 2: Life Grand Map (LGM)
    function renderLgmTwibbon() {
        // 1. LGM Diagram Image
        if (lgmImage) {
            renderTransformedImage(lgmImage, lgmTransform);
        } else {
            // Draw placeholder grid guide for LGM
            ctx.fillStyle = '#06172E';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            
            ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
            ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('LIFE GRAND MAP (LGM) CANVAS', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
            ctx.font = '20px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillText('Unggah diagram LGM kamu untuk memulai', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        }

        // 2. Frame / Header Border Overlay for LGM
        renderLgmFrameOverlay();

        // 3. Awardee Bio Card
        if (checkboxShowBio.checked) {
            renderBioOverlayCard();
        }
    }

    // Draw Transformed Image (Panned, Scaled, Rotated)
    function renderTransformedImage(img, t) {
        ctx.save();
        const centerX = CANVAS_WIDTH / 2 + t.x;
        const centerY = CANVAS_HEIGHT / 2 + t.y;
        ctx.translate(centerX, centerY);

        ctx.rotate((t.rotation * Math.PI) / 180);

        const scaleX = t.scale * t.flipH;
        const scaleY = t.scale * t.flipV;
        ctx.scale(scaleX, scaleY);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
        ctx.restore();
    }

    // LGM Mode Custom Frame Overlay
    function renderLgmFrameOverlay() {
        // Draw top & bottom navy header ribbons
        ctx.save();

        // Top Banner
        const topGrad = ctx.createLinearGradient(0, 0, 0, 100);
        topGrad.addColorStop(0, '#06172E');
        topGrad.addColorStop(1, 'rgba(6, 23, 46, 0.9)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, 90);

        // Gold line separator
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 90);
        ctx.lineTo(CANVAS_WIDTH, 90);
        ctx.stroke();

        // LGM Header Text
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'extrabold 26px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LIFE GRAND MAP — PK LPDP 280', CANVAS_WIDTH / 2, 42);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('LEMBAGA PENGELOLA DANA PENDIDIKAN', CANVAS_WIDTH / 2, 72);

        // Outer Gold Border
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, CANVAS_WIDTH - 8, CANVAS_HEIGHT - 8);

        ctx.restore();
    }

    // Render Awardee Bio Text Overlay on Canvas — matched to new frame.svg layout
    function renderBioOverlayCard() {
        const nama = (inputNama.value || 'Nama Lengkap').trim();
        const prodi = (inputProdi.value || 'Jurusan').trim();
        const univ = (inputUniv.value || 'Kampus Universitas').trim();

        ctx.save();
        ctx.textAlign = 'left';

        // === 1. Nama Lengkap — on purple bottom-left banner ===
        // Purple area roughly y=985..1076, x=0..~640
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        drawFitText(ctx, nama.toUpperCase(), 60, 1045, 580, 'bold 36px "Plus Jakarta Sans", sans-serif', '#FFFFFF');

        // === 2. Kampus Universitas — on gold banner below ===
        // Gold area roughly y=1076..1205
        ctx.fillStyle = '#6E3087'; // purple text on gold background
        ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
        drawFitText(ctx, univ, 60, 1115, 560, 'bold 26px "Plus Jakarta Sans", sans-serif', '#6E3087');

        // === 3. Jurusan / Prodi — on gold banner ===
        ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
        drawFitText(ctx, prodi, 60, 1155, 560, '600 22px "Plus Jakarta Sans", sans-serif', '#6E3087');

        ctx.restore();
    }

    // Helper to auto-scale text to fit maximum width
    function drawFitText(ctx, text, x, y, maxWidth, fontSpec, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = fontSpec;

        let width = ctx.measureText(text).width;
        if (width > maxWidth) {
            const scale = maxWidth / width;
            ctx.translate(x, y);
            ctx.scale(scale, 1);
            ctx.fillText(text, 0, 0);
        } else {
            ctx.fillText(text, x, y);
        }
        ctx.restore();
    }

    // === IMAGE AUTO-FIT & TRANSFORM LOGIC ===
    function autoFitActiveImage() {
        const img = getActiveImage();
        if (!img) return;

        const targetSize = CANVAS_WIDTH * (activeTab === 'profile' ? 0.85 : 0.95);
        const scaleX = targetSize / img.width;
        const scaleY = targetSize / img.height;

        const t = getActiveTransform();
        t.baseScale = Math.max(scaleX, scaleY);
        t.scale = t.baseScale;
        t.x = 0;
        t.y = 0;
        t.rotation = 0;
        t.flipH = 1;
        t.flipV = 1;

        updateZoomUI();
        renderCanvas();
    }

    function updateZoomUI() {
        const img = getActiveImage();
        if (!img) return;
        const t = getActiveTransform();
        const percent = Math.round((t.scale / t.baseScale) * 100);
        zoomSlider.value = percent;
        zoomValue.textContent = `${percent}%`;
    }

    function setZoomPercent(percent) {
        const img = getActiveImage();
        if (!img) return;
        const t = getActiveTransform();
        const clampedPercent = Math.max(10, Math.min(300, percent));
        t.scale = (clampedPercent / 100) * t.baseScale;
        updateZoomUI();
        renderCanvas();
    }

    // Handle Uploaded Image Files
    function handleProfileImageFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                profileImage = img;
                if (activeTab === 'profile') {
                    autoFitActiveImage();
                    hidePlaceholder();
                    btnDownload.disabled = false;
                }
                updateStatus();
                renderCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function handleLgmImageFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                lgmImage = img;
                if (activeTab === 'lgm') {
                    autoFitActiveImage();
                    hidePlaceholder();
                    btnDownload.disabled = false;
                }
                updateStatus();
                renderCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Coordinates conversion
    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function getTouchDistance(e) {
        if (e.touches.length < 2) return 0;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // === GESTURE LISTENERS ===
    function onPointerDown(e) {
        const img = getActiveImage();
        if (!img) return;

        const t = getActiveTransform();

        if (e.touches && e.touches.length === 2) {
            isDragging = false;
            touchStartDist = getTouchDistance(e);
            touchStartScale = t.scale;
            return;
        }

        isDragging = true;
        canvas.classList.add('is-dragging');

        const coords = getCanvasCoordinates(e);
        startX = coords.x;
        startY = coords.y;
        initialX = t.x;
        initialY = t.y;

        gestureHint.classList.add('opacity-0');
        setTimeout(() => gestureHint.classList.add('hidden'), 500);
    }

    function onPointerMove(e) {
        const img = getActiveImage();
        if (!img) return;

        const t = getActiveTransform();

        if (e.touches && e.touches.length === 2) {
            e.preventDefault();
            const currentDist = getTouchDistance(e);
            if (touchStartDist > 0 && currentDist > 0) {
                const zoomFactor = currentDist / touchStartDist;
                t.scale = Math.max(t.baseScale * 0.1, Math.min(t.baseScale * 3, touchStartScale * zoomFactor));
                updateZoomUI();
                renderCanvas();
            }
            return;
        }

        if (!isDragging) return;
        e.preventDefault();

        const coords = getCanvasCoordinates(e);
        const deltaX = coords.x - startX;
        const deltaY = coords.y - startY;

        t.x = initialX + deltaX;
        t.y = initialY + deltaY;

        renderCanvas();
    }

    function onPointerUp() {
        isDragging = false;
        canvas.classList.remove('is-dragging');
        touchStartDist = 0;
    }

    function onWheel(e) {
        const img = getActiveImage();
        if (!img) return;
        e.preventDefault();

        const t = getActiveTransform();
        const zoomSensitivity = 0.0015;
        const zoomDelta = -e.deltaY * zoomSensitivity;

        let currentPercent = Math.round((t.scale / t.baseScale) * 100);
        currentPercent += zoomDelta * 100;

        setZoomPercent(currentPercent);
    }

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchcancel', onPointerUp);

    canvas.addEventListener('wheel', onWheel, { passive: false });

    // === BIO INPUT EVENTS (REALTIME CANVAS UPDATE) ===
    [inputNama, inputProdi, inputUniv, inputJenjangCustom, inputNegara].forEach(input => {
        if (input) {
            input.addEventListener('input', renderCanvas);
        }
    });

    selectJenjang.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            inputJenjangCustom.classList.remove('hidden');
        } else {
            inputJenjangCustom.classList.add('hidden');
        }
        renderCanvas();
    });

    checkboxShowBio.addEventListener('change', renderCanvas);

    // === FILE INPUT & DROPZONE HANDLERS ===
    photoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleProfileImageFile(e.target.files[0]);
        }
    });

    lgmInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleLgmImageFile(e.target.files[0]);
        }
    });

    dropzone.addEventListener('click', () => {
        if (activeTab === 'profile') {
            photoInput.click();
        } else {
            lgmInput.click();
        }
    });

    dropzoneLgm.addEventListener('click', () => lgmInput.click());

    [dropzone, dropzoneLgm].forEach(dz => {
        dz.addEventListener('dragover', (e) => {
            e.preventDefault();
            dz.classList.add('border-lpdp-gold', 'bg-slate-800');
        });
        dz.addEventListener('dragleave', () => {
            dz.classList.remove('border-lpdp-gold', 'bg-slate-800');
        });
        dz.addEventListener('drop', (e) => {
            e.preventDefault();
            dz.classList.remove('border-lpdp-gold', 'bg-slate-800');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                if (dz === dropzoneLgm || activeTab === 'lgm') {
                    handleLgmImageFile(e.dataTransfer.files[0]);
                } else {
                    handleProfileImageFile(e.dataTransfer.files[0]);
                }
            }
        });
    });

    // Zoom Controls
    zoomSlider.addEventListener('input', (e) => setZoomPercent(parseInt(e.target.value, 10)));
    btnZoomIn.addEventListener('click', () => {
        const t = getActiveTransform();
        setZoomPercent(Math.round((t.scale / t.baseScale) * 100) + 10);
    });
    btnZoomOut.addEventListener('click', () => {
        const t = getActiveTransform();
        setZoomPercent(Math.round((t.scale / t.baseScale) * 100) - 10);
    });

    // Rotation & Flip
    btnRotateLeft.addEventListener('click', () => {
        const t = getActiveTransform();
        t.rotation = (t.rotation - 90) % 360;
        renderCanvas();
    });

    btnRotateRight.addEventListener('click', () => {
        const t = getActiveTransform();
        t.rotation = (t.rotation + 90) % 360;
        renderCanvas();
    });

    btnFlipH.addEventListener('click', () => {
        const t = getActiveTransform();
        t.flipH *= -1;
        renderCanvas();
    });

    btnReset.addEventListener('click', () => autoFitActiveImage());

    // Export Button Handler
    btnDownload.addEventListener('click', () => {
        const downloadBtnText = document.getElementById('download-text');
        const originalText = downloadBtnText.textContent;
        downloadBtnText.textContent = 'Memproses High-Res PNG...';
        btnDownload.disabled = true;

        setTimeout(() => {
            try {
                const dataURL = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                const filename = activeTab === 'profile' ? 'twibbon-profil-pklpdp280.png' : 'life-grand-map-pklpdp280.png';
                link.download = filename;
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                downloadBtnText.textContent = 'Berhasil Diunduh!';
                setTimeout(() => {
                    downloadBtnText.textContent = originalText;
                    btnDownload.disabled = false;
                }, 2000);
            } catch (err) {
                console.error('Export error:', err);
                alert('Gagal mengunduh. Silakan coba klik kanan pada canvas dan pilih "Simpan Gambar Sebagai..."');
                downloadBtnText.textContent = originalText;
                btnDownload.disabled = false;
            }
        }, 150);
    });

    // Initialize profile mode on page load
    switchTab('profile');

});
