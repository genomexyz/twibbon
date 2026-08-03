/**
 * PK LPDP 280 - Interactive Static Twibbon Generator
 * Features:
 * - Direct Drag & Drop / Touch Pan photo
 * - Scroll Wheel & Pinch-to-Zoom
 * - High-Resolution Export (1080x1080)
 * - Pure Static / No Backend Required
 */

document.addEventListener('DOMContentLoaded', () => {
    // Canvas & Context Setup
    const canvas = document.getElementById('twibbon-canvas');
    const ctx = canvas.getContext('2d');
    const canvasWrapper = document.getElementById('canvas-wrapper');
    const canvasPlaceholder = document.getElementById('canvas-placeholder');
    const gestureHint = document.getElementById('gesture-hint');

    // UI Control Elements
    const photoInput = document.getElementById('photo-input');
    const frameInput = document.getElementById('frame-input');
    const btnChangeFrame = document.getElementById('btn-change-frame');
    const dropzone = document.getElementById('dropzone');
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
    const CANVAS_HEIGHT = 1080;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Image & Frame State
    let userImage = null;
    let frameImage = new Image();
    let isFrameLoaded = false;

    // User Image Transform State
    const transform = {
        x: 0,          // Offset X relative to canvas center
        y: 0,          // Offset Y relative to canvas center
        scale: 1,      // Scale factor
        baseScale: 1,  // Base scale calculated to cover aperture
        rotation: 0,   // Rotation angle in degrees
        flipH: 1,      // 1 or -1
        flipV: 1       // 1 or -1
    };

    // Interaction State
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;
    let touchStartDist = 0;
    let touchStartScale = 1;
    let hasInteractedWithPhoto = false;

    // Default Frame Sources (fallback sequence)
    const FRAME_SOURCES = [
        'assets/frame.svg',
        'assets/frame.png'
    ];

    // Load Frame Image
    function loadFrame(sourceIndex = 0) {
        if (sourceIndex >= FRAME_SOURCES.length) {
            console.warn('Frame assets not found, generating default frame...');
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
        frameImage.onerror = () => {
            // Try next frame source
            loadFrame(sourceIndex + 1);
        };
        frameImage.src = src;
    }

    // Dynamic Fallback Frame if assets/frame.png fails to load
    function generateFallbackFrame() {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = CANVAS_WIDTH;
        offCanvas.height = CANVAS_HEIGHT;
        const oCtx = offCanvas.getContext('2d');

        // Outer Dark Navy Fill
        oCtx.fillStyle = '#06172E';
        oCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Center cutout aperture
        oCtx.globalCompositeOperation = 'destination-out';
        oCtx.beginPath();
        oCtx.roundRect(80, 160, 920, 760, 32);
        oCtx.fill();

        // Outer decorations
        oCtx.globalCompositeOperation = 'source-over';
        
        // Gold border around aperture
        oCtx.strokeStyle = '#D4AF37';
        oCtx.lineWidth = 10;
        oCtx.strokeRect(80, 160, 920, 760);

        // Header Title
        oCtx.fillStyle = '#D4AF37';
        oCtx.font = 'bold 28px sans-serif';
        oCtx.textAlign = 'center';
        oCtx.fillText('PK LPDP 280', CANVAS_WIDTH / 2, 70);

        // Subtitle
        oCtx.fillStyle = '#FFFFFF';
        oCtx.font = '18px sans-serif';
        oCtx.fillText('PERSIAPAN KEBERANGKATAN', CANVAS_WIDTH / 2, 110);

        // Footer Text
        oCtx.fillStyle = '#FFFFFF';
        oCtx.font = 'bold 36px sans-serif';
        oCtx.fillText('BERDAYA, MENGINSPIRASI & MENGABDI', CANVAS_WIDTH / 2, 980);

        oCtx.fillStyle = '#D4AF37';
        oCtx.font = 'bold 20px sans-serif';
        oCtx.fillText('#GARDANANAWA280 — INDONESIA 2025', CANVAS_WIDTH / 2, 1030);

        const img = new Image();
        img.onload = () => {
            frameImage = img;
            isFrameLoaded = true;
            renderCanvas();
        };
        img.src = offCanvas.toDataURL('image/png');
    }

    // Initial Frame Load Call
    loadFrame();

    // Redraw Canvas Layer by Layer
    function renderCanvas() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // LAYER 1: User Uploaded Photo (Bottom)
        if (userImage) {
            ctx.save();
            // Translate to center of canvas + offsets
            const centerX = CANVAS_WIDTH / 2 + transform.x;
            const centerY = CANVAS_HEIGHT / 2 + transform.y;
            ctx.translate(centerX, centerY);

            // Apply Rotation
            ctx.rotate((transform.rotation * Math.PI) / 180);

            // Apply Scale & Flip
            const scaleX = transform.scale * transform.flipH;
            const scaleY = transform.scale * transform.flipV;
            ctx.scale(scaleX, scaleY);

            // High Quality Scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw image centered
            const drawW = userImage.width;
            const drawH = userImage.height;
            ctx.drawImage(userImage, -drawW / 2, -drawH / 2, drawW, drawH);

            ctx.restore();
        }

        // LAYER 2: Frame Overlay (Top)
        if (isFrameLoaded && frameImage) {
            ctx.drawImage(frameImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }

    // Auto-fit user image so it nicely covers the frame aperture
    function autoFitImage() {
        if (!userImage) return;

        // Target viewport area inside frame (~80% of canvas)
        const targetSize = CANVAS_WIDTH * 0.85;
        const scaleX = targetSize / userImage.width;
        const scaleY = targetSize / userImage.height;

        // Cover fit scale
        transform.baseScale = Math.max(scaleX, scaleY);
        transform.scale = transform.baseScale;
        transform.x = 0;
        transform.y = 0;
        transform.rotation = 0;
        transform.flipH = 1;
        transform.flipV = 1;

        updateZoomUI();
        renderCanvas();
    }

    // Update Zoom Slider & Badge UI
    function updateZoomUI() {
        if (!userImage) return;
        const percent = Math.round((transform.scale / transform.baseScale) * 100);
        zoomSlider.value = percent;
        zoomValue.textContent = `${percent}%`;
    }

    // Set Zoom Percentage from Slider / Buttons
    function setZoomPercent(percent) {
        if (!userImage) return;
        const clampedPercent = Math.max(10, Math.min(300, percent));
        transform.scale = (clampedPercent / 100) * transform.baseScale;
        updateZoomUI();
        renderCanvas();
    }

    // Frame Input selection
    if (btnChangeFrame && frameInput) {
        btnChangeFrame.addEventListener('click', () => frameInput.click());
        frameInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (evt) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        frameImage = img;
                        isFrameLoaded = true;
                        renderCanvas();
                        alert('Frame Twibbon berhasil diperbarui!');
                    };
                    img.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Photo File Upload Handler
    function handleImageFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Silakan pilih file gambar (JPG, PNG, WEBP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                userImage = img;
                autoFitImage();

                // UI Updates
                canvasPlaceholder.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    canvasPlaceholder.classList.add('hidden');
                }, 300);

                gestureHint.classList.remove('hidden');
                btnDownload.disabled = false;

                statusText.textContent = 'Foto siap disesuaikan. Drag/pinch untuk atur posisi.';
                statusIndicator.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Convert Screen Event Coordinates to Canvas Coordinate Space
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

    // Calculate distance between two touches for pinch-to-zoom
    function getTouchDistance(e) {
        if (e.touches.length < 2) return 0;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // === INTERACTIVE MOUSE & TOUCH EVENT LISTENERS ===

    // Mouse Down / Touch Start
    function onPointerDown(e) {
        if (!userImage) return;

        if (e.touches && e.touches.length === 2) {
            // Multi-touch pinch zoom
            isDragging = false;
            touchStartDist = getTouchDistance(e);
            touchStartScale = transform.scale;
            return;
        }

        isDragging = true;
        canvas.classList.add('is-dragging');

        const coords = getCanvasCoordinates(e);
        startX = coords.x;
        startY = coords.y;
        initialX = transform.x;
        initialY = transform.y;

        if (!hasInteractedWithPhoto) {
            hasInteractedWithPhoto = true;
            gestureHint.classList.add('opacity-0');
            setTimeout(() => gestureHint.classList.add('hidden'), 500);
        }
    }

    // Mouse Move / Touch Move
    function onPointerMove(e) {
        if (!userImage) return;

        // Handle Pinch Zoom
        if (e.touches && e.touches.length === 2) {
            e.preventDefault();
            const currentDist = getTouchDistance(e);
            if (touchStartDist > 0 && currentDist > 0) {
                const zoomFactor = currentDist / touchStartDist;
                transform.scale = Math.max(transform.baseScale * 0.1, Math.min(transform.baseScale * 3, touchStartScale * zoomFactor));
                updateZoomUI();
                renderCanvas();
            }
            return;
        }

        // Handle Drag Pan
        if (!isDragging) return;
        e.preventDefault();

        const coords = getCanvasCoordinates(e);
        const deltaX = coords.x - startX;
        const deltaY = coords.y - startY;

        transform.x = initialX + deltaX;
        transform.y = initialY + deltaY;

        renderCanvas();
    }

    // Mouse Up / Touch End
    function onPointerUp(e) {
        isDragging = false;
        canvas.classList.remove('is-dragging');
        touchStartDist = 0;
    }

    // Mouse Wheel Zoom
    function onWheel(e) {
        if (!userImage) return;
        e.preventDefault();

        const zoomSensitivity = 0.0015;
        const zoomDelta = -e.deltaY * zoomSensitivity;
        
        let currentPercent = Math.round((transform.scale / transform.baseScale) * 100);
        currentPercent += zoomDelta * 100;
        
        setZoomPercent(currentPercent);
    }

    // Attach Canvas Event Listeners
    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchcancel', onPointerUp);

    canvas.addEventListener('wheel', onWheel, { passive: false });

    // === UI CONTROLS EVENT LISTENERS ===

    // File Input change
    photoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
        }
    });

    // Dropzone Drag & Drop
    dropzone.addEventListener('click', () => photoInput.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-lpdp-gold', 'bg-slate-800');
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-lpdp-gold', 'bg-slate-800');
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-lpdp-gold', 'bg-slate-800');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageFile(e.dataTransfer.files[0]);
        }
    });

    // Zoom Slider Input
    zoomSlider.addEventListener('input', (e) => {
        setZoomPercent(parseInt(e.target.value, 10));
    });

    // Zoom Buttons
    btnZoomIn.addEventListener('click', () => {
        const currentPercent = Math.round((transform.scale / transform.baseScale) * 100);
        setZoomPercent(currentPercent + 10);
    });

    btnZoomOut.addEventListener('click', () => {
        const currentPercent = Math.round((transform.scale / transform.baseScale) * 100);
        setZoomPercent(currentPercent - 10);
    });

    // Rotate Controls
    btnRotateLeft.addEventListener('click', () => {
        if (!userImage) return;
        transform.rotation = (transform.rotation - 90) % 360;
        renderCanvas();
    });

    btnRotateRight.addEventListener('click', () => {
        if (!userImage) return;
        transform.rotation = (transform.rotation + 90) % 360;
        renderCanvas();
    });

    // Flip Horizontal Control
    btnFlipH.addEventListener('click', () => {
        if (!userImage) return;
        transform.flipH *= -1;
        renderCanvas();
    });

    // Reset Position Button
    btnReset.addEventListener('click', () => {
        if (!userImage) return;
        autoFitImage();
    });

    // Download High-Res Image Button
    btnDownload.addEventListener('click', () => {
        if (!userImage) return;

        // Show downloading state
        const downloadText = document.getElementById('download-text');
        const originalText = downloadText.textContent;
        downloadText.textContent = 'Memproses Canvas...';
        btnDownload.disabled = true;

        setTimeout(() => {
            try {
                // Generate PNG at full 1080x1080 native resolution
                const dataURL = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.download = 'twibbon-pk-lpdp-280.png';
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                downloadText.textContent = 'Berhasil Diunduh!';
                setTimeout(() => {
                    downloadText.textContent = originalText;
                    btnDownload.disabled = false;
                }, 2000);
            } catch (err) {
                console.error('Export error:', err);
                alert('Gagal mengunduh gambar. Silakan coba klik kanan pada gambar canvas dan pilih "Simpan Gambar sebagai..."');
                downloadText.textContent = originalText;
                btnDownload.disabled = false;
            }
        }, 150);
    });

});
