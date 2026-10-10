/* =========================================================
   BRAJESH KUSHWAHA - PREMIUM CREATIVE AI PORTFOLIO
   Interactive Engine, Canvas Particles, Audio Synthesizer,
   AI Prompt Studio, 3D Tilt, and Developer Console
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. PAGE LOADER
       ===================================================== */
    const loader = document.getElementById("loader");
    const hideLoader = () => {
        if (loader) {
            loader.classList.add("hide");
        }
    };
    window.addEventListener("load", hideLoader);
    setTimeout(hideLoader, 1000); // Fallback guarantee


    /* =====================================================
       2. WEB AUDIO API SYNTHESIZER (UI SOUND FX)
       ===================================================== */
    let audioCtx = null;
    let soundEnabled = localStorage.getItem("portfolio-sound") === "true";
    const soundToggle = document.getElementById("sound-toggle");

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    function updateSoundToggleUI() {
        if (!soundToggle) return;
        if (soundEnabled) {
            soundToggle.classList.add("active");
            soundToggle.innerHTML = '<i class="fas fa-volume-high"></i>';
            soundToggle.setAttribute("title", "Sound Effects: ON (Click to mute)");
        } else {
            soundToggle.classList.remove("active");
            soundToggle.innerHTML = '<i class="fas fa-volume-xmark"></i>';
            soundToggle.setAttribute("title", "Sound Effects: OFF (Click to unmute)");
        }
    }
    updateSoundToggleUI();

    if (soundToggle) {
        soundToggle.addEventListener("click", () => {
            initAudio();
            soundEnabled = !soundEnabled;
            localStorage.setItem("portfolio-sound", soundEnabled ? "true" : "false");
            updateSoundToggleUI();
            if (soundEnabled) {
                playChime();
                showToast("🔊 UI Audio enabled!");
            } else {
                showToast("🔇 UI Audio muted");
            }
        });
    }

    // Sound generator functions
    function playPop(freq = 600, duration = 0.05) {
        if (!soundEnabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.debug(e);
        }
    }

    function playChime() {
        if (!soundEnabled || !audioCtx) return;
        try {
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const start = audioCtx.currentTime + (idx * 0.04);
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.03, start);
                gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(start);
                osc.stop(start + 0.18);
            });
        } catch (e) {
            console.debug(e);
        }
    }

    function playSuccess() {
        if (!soundEnabled || !audioCtx) return;
        try {
            const notes = [440, 554.37, 659.25, 880]; // A major
            notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const start = audioCtx.currentTime + (idx * 0.05);
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.04, start);
                gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(start);
                osc.stop(start + 0.25);
            });
        } catch (e) {
            console.debug(e);
        }
    }

    // Attach interaction listener for audio context unlock
    document.addEventListener("pointerdown", () => initAudio(), { once: true });


    /* =====================================================
       3. THE THINKING MACHINE — V2
       A Signature 3D Computational Sculpture for a CSE (AI) Portfolio
       - Flowing parametric curves & precision filaments
       - Translucent graphite & glass-like faceted surfaces
       - Interconnected geometric ribbons & mathematical contour lines
       - Sparse cyan & violet compute nodes with glint flares
       - 3-Phase Continuous Signature Animation Cycle:
         Phase A (Observe) -> Phase B (Compute) -> Phase C (Resolve)
       - Interactive pointer spotlight, mouse parallax, and scroll dynamics
       ===================================================== */
    function initThinkingMachineSculpture() {
        const canvas = document.getElementById("space-3d-canvas") || document.getElementById("neural-canvas");
        if (!canvas) return;

        if (typeof THREE === "undefined") {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof THREE !== "undefined") {
                    clearInterval(checkInterval);
                    initThinkingMachineSculpture();
                } else if (attempts > 30) {
                    clearInterval(checkInterval);
                }
            }, 100);
            return;
        }

        // --- WEBGL CONTEXT & RENDERER INITIALIZATION ---
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            });
        } catch (e) {
            console.warn("WebGL not supported, falling back gracefully.", e);
            return;
        }

        const scene = new THREE.Scene();
        // Deep obsidian atmospheric depth
        scene.fog = new THREE.FogExp2(0x02040a, 0.0018);

        const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 52);

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;

        // --- LIGHTING ---
        // 1. Soft Midnight Navy Ambient Fill
        const ambientLight = new THREE.AmbientLight(0x081126, 0.75);
        scene.add(ambientLight);

        // 2. Computational Key Light (Luminous Electric Cyan)
        const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
        keyLight.position.set(-28, 32, 38);
        scene.add(keyLight);

        // 3. Mathematical Rim Light (Muted Violet)
        const rimLight = new THREE.DirectionalLight(0x8b5cf6, 1.6);
        rimLight.position.set(32, -24, -20);
        scene.add(rimLight);

        // 4. Dynamic Interactive Pointer Spotlight (Follows Cursor in 3D)
        const pointerLight = new THREE.PointLight(0x22d3ee, 1.9, 52);
        pointerLight.position.set(12, 2, 22);
        scene.add(pointerLight);

        // --- PROCEDURAL GLOW SPRITE TEXTURE ---
        function createGlowSpriteTexture() {
            const size = 64;
            const c = document.createElement("canvas");
            c.width = size;
            c.height = size;
            const ctx = c.getContext("2d");
            const center = size / 2;
            const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
            grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
            grad.addColorStop(0.2, "rgba(165, 243, 252, 0.95)");
            grad.addColorStop(0.5, "rgba(34, 211, 238, 0.35)");
            grad.addColorStop(0.75, "rgba(139, 92, 246, 0.12)");
            grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(center, center, center, 0, Math.PI * 2);
            ctx.fill();
            return new THREE.CanvasTexture(c);
        }
        const glowSpriteTexture = createGlowSpriteTexture();

        // --- SCULPTURE ROOT GROUP ---
        const sculptureGroup = new THREE.Group();
        scene.add(sculptureGroup);

        // --- PARAMETRIC MATHEMATICS ENGINE ---
        // Spine curve evaluated continuously along longitudinal parameter u in [0, 1]
        function getSpinePosition(u, t, morph) {
            let x = -20 + (32 * u) + (7.5 * Math.sin(u * Math.PI * 1.5)) - (4.5 * Math.sin(u * Math.PI * 3.0) * (u > 0.6 ? 1 : 0));
            let y = -15 + (18 * u) + (19 * Math.pow(u, 2.2)) + (3.2 * Math.sin(u * Math.PI * 1.8));
            let z = -5 + (12 * Math.sin(u * Math.PI * 1.4)) - (10 * Math.sin(u * Math.PI * 2.8) * Math.max(0, u - 0.45));

            // Subtle harmonic breathing (Phase A)
            const breath = Math.sin(t * 0.75 + u * 2.2) * 0.35;
            x += breath * 0.55;
            y += breath * 0.75;

            // Computational morphing (Phase B)
            if (morph > 0.0005) {
                x += morph * 3.2 * Math.sin(u * Math.PI * 2.5);
                y += morph * 2.2 * Math.cos(u * Math.PI * 2.0);
                z += morph * 4.2 * Math.sin(u * Math.PI * 1.8);
            }
            return { x, y, z };
        }

        // Longitudinal slice frames cached per frame for 60fps performance
        const NUM_STEPS = 90;
        let sliceFrames = [];

        function computeSliceFrames(t, morph) {
            const eps = 0.005;
            sliceFrames = [];
            for (let i = 0; i < NUM_STEPS; i++) {
                const u = i / (NUM_STEPS - 1);
                const pPrev = getSpinePosition(Math.max(0, u - eps), t, morph);
                const pNext = getSpinePosition(Math.min(1, u + eps), t, morph);
                const pos = getSpinePosition(u, t, morph);

                const dx = pNext.x - pPrev.x;
                const dy = pNext.y - pPrev.y;
                const dz = pNext.z - pPrev.z;
                const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
                const Tx = dx / len, Ty = dy / len, Tz = dz / len;

                let upX = 0, upY = 0, upZ = 1;
                if (Math.abs(Tz) > 0.95) { upX = 0; upY = 1; upZ = 0; }

                // B0 = T x up
                let b0X = Ty * upZ - Tz * upY;
                let b0Y = Tz * upX - Tx * upZ;
                let b0Z = Tx * upY - Ty * upX;
                const b0Len = Math.sqrt(b0X * b0X + b0Y * b0Y + b0Z * b0Z) || 1;
                b0X /= b0Len; b0Y /= b0Len; b0Z /= b0Len;

                // N0 = B0 x T
                let n0X = b0Y * Tz - b0Z * Ty;
                let n0Y = b0Z * Tx - b0X * Tz;
                let n0Z = b0X * Ty - b0Y * Tx;
                const n0Len = Math.sqrt(n0X * n0X + n0Y * n0Y + n0Z * n0Z) || 1;
                n0X /= n0Len; n0Y /= n0Len; n0Z /= n0Len;

                // Continuous signature twist
                const twist = u * Math.PI * 2.2 + 0.35 * Math.sin(u * Math.PI) + morph * 0.60 * Math.sin(u * Math.PI);
                const cosT = Math.cos(twist), sinT = Math.sin(twist);

                // T x B0
                const tbX = Ty * b0Z - Tz * b0Y;
                const tbY = Tz * b0X - Tx * b0Z;
                const tbZ = Tx * b0Y - Ty * b0X;
                const Bx = b0X * cosT + tbX * sinT;
                const By = b0Y * cosT + tbY * sinT;
                const Bz = b0Z * cosT + tbZ * sinT;

                // T x N0
                const tnX = Ty * n0Z - Tz * n0Y;
                const tnY = Tz * n0X - Tx * n0Z;
                const tnZ = Tx * n0Y - Ty * n0X;
                const Nx = n0X * cosT + tnX * sinT;
                const Ny = n0Y * cosT + tnY * sinT;
                const Nz = n0Z * cosT + tnZ * sinT;

                // Dynamic width with laminar expansion and inflection waist
                const width = 2.8 + 12.5 * Math.pow(Math.sin(u * Math.PI), 1.25) + 3.0 * Math.sin(u * Math.PI * 2.0) + morph * 3.6 * Math.sin(u * Math.PI);
                const sinU = Math.sin(u * Math.PI);

                sliceFrames.push({
                    u,
                    pos,
                    Bx, By, Bz,
                    Nx, Ny, Nz,
                    width,
                    halfW: width * 0.5,
                    sinU
                });
            }
        }

        // --- LAYER 1: PRIMARY COMPUTATIONAL MANIFOLD (36 PRECISION FILAMENTS) ---
        const NUM_FILAMENTS = 36;
        const filamentLines = [];
        const filamentGeos = [];

        const filamentGroup = new THREE.Group();
        sculptureGroup.add(filamentGroup);

        for (let k = 0; k < NUM_FILAMENTS; k++) {
            const v = (k / (NUM_FILAMENTS - 1)) * 2 - 1; // [-1, 1]
            const absV = Math.abs(v);

            // Pre-allocate buffer geometry
            const posArray = new Float32Array(NUM_STEPS * 3);
            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
            filamentGeos.push(geo);

            // Color tuning matching reference visual language
            let col = 0x22d3ee;
            let opacity = 0.85;

            if (absV <= 0.35) {
                // Core luminous cyan strands
                col = 0x38bdf8;
                opacity = 0.95;
            } else if (absV <= 0.72) {
                // Intermediate cyan-indigo strands
                col = 0x06b6d4;
                opacity = 0.75;
            } else {
                // Perimeter muted violet / indigo contour threads
                col = 0xa78bfa;
                opacity = 0.55;
            }

            const mat = new THREE.LineBasicMaterial({
                color: col,
                transparent: true,
                opacity: opacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const line = new THREE.Line(geo, mat);
            line.userData = { v, vSq: v * v, baseOpacity: opacity };
            filamentLines.push(line);
            filamentGroup.add(line);
        }

        // --- LAYER 2: TRANSLUCENT GRAPHITE & GLASS-LIKE RIBBON MESH ---
        // Connects core filaments across middle parameter space
        const MESH_U_STEPS = 45;
        const MESH_V_STEPS = 10;
        const meshTotalVerts = MESH_U_STEPS * MESH_V_STEPS;
        const meshPosArray = new Float32Array(meshTotalVerts * 3);
        const meshIndices = [];

        for (let iu = 0; iu < MESH_U_STEPS - 1; iu++) {
            for (let iv = 0; iv < MESH_V_STEPS - 1; iv++) {
                const a = iu * MESH_V_STEPS + iv;
                const b = (iu + 1) * MESH_V_STEPS + iv;
                const c = (iu + 1) * MESH_V_STEPS + (iv + 1);
                const d = iu * MESH_V_STEPS + (iv + 1);
                meshIndices.push(a, b, d);
                meshIndices.push(b, c, d);
            }
        }

        const ribbonMeshGeo = new THREE.BufferGeometry();
        ribbonMeshGeo.setAttribute("position", new THREE.BufferAttribute(meshPosArray, 3));
        ribbonMeshGeo.setIndex(meshIndices);

        const graphiteGlassMat = new THREE.MeshStandardMaterial({
            color: 0x0a1628,
            roughness: 0.16,
            metalness: 0.88,
            transparent: true,
            opacity: 0.32,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        const ribbonMesh = new THREE.Mesh(ribbonMeshGeo, graphiteGlassMat);
        sculptureGroup.add(ribbonMesh);

        // --- LAYER 3: SECONDARY INTERWOVEN LATENT RIBBON (18 FILAMENTS) ---
        const NUM_LATENT = 18;
        const latentGeos = [];
        const latentLines = [];
        const latentGroup = new THREE.Group();
        sculptureGroup.add(latentGroup);

        for (let l = 0; l < NUM_LATENT; l++) {
            const lv = (l / (NUM_LATENT - 1)) * 2 - 1;
            const posArray = new Float32Array(NUM_STEPS * 3);
            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
            latentGeos.push(geo);

            const mat = new THREE.LineBasicMaterial({
                color: l % 2 === 0 ? 0x8b5cf6 : 0xa78bfa,
                transparent: true,
                opacity: 0.45,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const line = new THREE.Line(geo, mat);
            line.userData = { lv };
            latentLines.push(line);
            latentGroup.add(line);
        }

        // --- LAYER 4: ORTHOGONAL MATHEMATICAL CONTOUR RIBS ---
        const NUM_RIBS = 18;
        const RIB_V_STEPS = 25;
        const ribGeos = [];
        const ribLines = [];
        const ribGroup = new THREE.Group();
        sculptureGroup.add(ribGroup);

        for (let r = 0; r < NUM_RIBS; r++) {
            const uFrac = 0.08 + (r / (NUM_RIBS - 1)) * 0.84;
            const posArray = new Float32Array(RIB_V_STEPS * 3);
            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
            ribGeos.push(geo);

            const mat = new THREE.LineBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.30,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const line = new THREE.Line(geo, mat);
            line.userData = { uFrac };
            ribLines.push(line);
            ribGroup.add(line);
        }

        // --- LAYER 5: SPARSE CYAN & VIOLET COMPUTE NODES ---
        const NODE_DEFS = [
            { u: 0.10, v: 0.00, color: 0x22d3ee },
            { u: 0.18, v: -0.35, color: 0xa78bfa },
            { u: 0.26, v: 0.28, color: 0x22d3ee },
            { u: 0.34, v: -0.22, color: 0x38bdf8 },
            { u: 0.42, v: 0.45, color: 0xa78bfa }, // Crest swell
            { u: 0.50, v: 0.00, color: 0x22d3ee },
            { u: 0.58, v: -0.42, color: 0xa78bfa }, // Twist waist
            { u: 0.66, v: 0.25, color: 0x22d3ee },
            { u: 0.74, v: -0.28, color: 0x38bdf8 },
            { u: 0.82, v: 0.38, color: 0xa78bfa }, // Ascending loop
            { u: 0.90, v: -0.12, color: 0x22d3ee },
            { u: 0.96, v: 0.00, color: 0xa78bfa }
        ];

        const computeNodes = [];
        const nodeGroup = new THREE.Group();
        sculptureGroup.add(nodeGroup);

        const nodeGeom = new THREE.OctahedronGeometry(0.38, 0);

        NODE_DEFS.forEach((def) => {
            const nodeMat = new THREE.MeshStandardMaterial({
                color: 0x050e1f,
                emissive: new THREE.Color(def.color),
                emissiveIntensity: 0.9,
                roughness: 0.18,
                metalness: 0.92
            });

            const mesh = new THREE.Mesh(nodeGeom, nodeMat);

            // Attached luminous glint sprite (matches reference image flare)
            const spriteMat = new THREE.SpriteMaterial({
                map: glowSpriteTexture,
                color: def.color,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(1.9, 1.9, 1);
            mesh.add(sprite);

            mesh.userData = {
                u: def.u,
                v: def.v,
                color: def.color,
                baseEmissive: 0.9,
                sprite: sprite
            };

            computeNodes.push(mesh);
            nodeGroup.add(mesh);
        });

        // --- LAYER 6: LUMINOUS SIGNAL PACKETS (COMPUTE TRAVELERS) ---
        const NUM_SIGNALS = 8;
        const signalSprites = [];
        const signalGroup = new THREE.Group();
        sculptureGroup.add(signalGroup);

        for (let s = 0; s < NUM_SIGNALS; s++) {
            const isCyan = s % 2 === 0;
            const sigMat = new THREE.SpriteMaterial({
                map: glowSpriteTexture,
                color: isCyan ? 0x22d3ee : 0xa78bfa,
                transparent: true,
                opacity: 0.0,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(sigMat);
            sprite.scale.set(2.4, 2.4, 1);
            sprite.userData = {
                filamentIdx: Math.floor(6 + (s / NUM_SIGNALS) * 24),
                delay: s * 0.10,
                speed: 1.1 + (s % 3) * 0.12
            };
            signalSprites.push(sprite);
            signalGroup.add(sprite);
        }

        // Helper to evaluate 3D point on manifold at arbitrary u, v from cached slices
        function sampleManifoldPoint(u, v) {
            const clampedU = Math.min(Math.max(u, 0), 1);
            const stepFloat = clampedU * (NUM_STEPS - 1);
            const idxA = Math.floor(stepFloat);
            const idxB = Math.min(idxA + 1, NUM_STEPS - 1);
            const f = stepFloat - idxA;

            const slA = sliceFrames[idxA];
            const slB = sliceFrames[idxB];
            if (!slA || !slB) return { x: 0, y: 0, z: 0 };

            // Lerp slice values
            const posX = slA.pos.x + (slB.pos.x - slA.pos.x) * f;
            const posY = slA.pos.y + (slB.pos.y - slA.pos.y) * f;
            const posZ = slA.pos.z + (slB.pos.z - slA.pos.z) * f;

            const Bx = slA.Bx + (slB.Bx - slA.Bx) * f;
            const By = slA.By + (slB.By - slA.By) * f;
            const Bz = slA.Bz + (slB.Bz - slA.Bz) * f;

            const Nx = slA.Nx + (slB.Nx - slA.Nx) * f;
            const Ny = slA.Ny + (slB.Ny - slA.Ny) * f;
            const Nz = slA.Nz + (slB.Nz - slA.Nz) * f;

            const halfW = slA.halfW + (slB.halfW - slA.halfW) * f;
            const sinU = slA.sinU + (slB.sinU - slA.sinU) * f;
            const camber = (1.0 - v * v) * 1.35 * sinU;

            return {
                x: posX + (v * halfW * Bx) + (camber * Nx),
                y: posY + (v * halfW * By) + (camber * Ny),
                z: posZ + (v * halfW * Bz) + (camber * Nz)
            };
        }

        // --- RESPONSIVE COMPOSITION & POSITIONING ---
        let basePosY = 0.5;
        let baseRotX = 0.05;
        let baseRotY = -0.15;
        let isMobileScreen = false;

        function updateSculptureLayout() {
            const width = window.innerWidth;
            if (width < 768) {
                // Mobile: centered in upper hero background, text remains 100% legible
                isMobileScreen = true;
                basePosY = 4.8;
                baseRotX = 0.10;
                baseRotY = -0.10;
                sculptureGroup.position.set(0, basePosY, -10);
                sculptureGroup.scale.set(0.65, 0.65, 0.65);
            } else if (width < 992) {
                // Tablet: offset right
                isMobileScreen = false;
                basePosY = 1.8;
                baseRotX = 0.08;
                baseRotY = -0.12;
                sculptureGroup.position.set(7.5, basePosY, -4);
                sculptureGroup.scale.set(0.82, 0.82, 0.82);
            } else {
                // Desktop: frames hero typography on right half
                isMobileScreen = false;
                basePosY = 0.5;
                baseRotX = 0.05;
                baseRotY = -0.15;
                sculptureGroup.position.set(12.5, basePosY, 0);
                sculptureGroup.scale.set(1.0, 1.0, 1.0);
            }
        }
        updateSculptureLayout();

        // --- INTERACTIONS: MOUSE PARALLAX & POINTER SPOTLIGHT ---
        const mouse = { x: 0, y: 0 };
        window.addEventListener("mousemove", (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // --- 3-PHASE CONTINUOUS SIGNATURE ANIMATION LOOP ---
        let animationFrameId = null;
        const clock = new THREE.Clock();

        function updateGeometryBuffers(time, morphFactor, computeProgress, isComputePhase) {
            // 1. Compute and cache slice frames for this time sample
            computeSliceFrames(time, morphFactor);

            // 2. Update Primary Filaments
            for (let k = 0; k < NUM_FILAMENTS; k++) {
                const line = filamentLines[k];
                const v = line.userData.v;
                const vSq = line.userData.vSq;
                const posArr = filamentGeos[k].attributes.position.array;

                for (let i = 0; i < NUM_STEPS; i++) {
                    const sl = sliceFrames[i];
                    const camber = (1.0 - vSq) * 1.35 * sl.sinU;
                    posArr[i * 3 + 0] = sl.pos.x + (v * sl.halfW * sl.Bx) + (camber * sl.Nx);
                    posArr[i * 3 + 1] = sl.pos.y + (v * sl.halfW * sl.By) + (camber * sl.Ny);
                    posArr[i * 3 + 2] = sl.pos.z + (v * sl.halfW * sl.Bz) + (camber * sl.Nz);
                }
                filamentGeos[k].attributes.position.needsUpdate = true;
            }

            // 3. Update Translucent Graphite & Glass Ribbon Mesh
            const meshPos = ribbonMeshGeo.attributes.position.array;
            for (let iu = 0; iu < MESH_U_STEPS; iu++) {
                const u = 0.06 + (iu / (MESH_U_STEPS - 1)) * 0.88;
                for (let iv = 0; iv < MESH_V_STEPS; iv++) {
                    const v = -0.42 + (iv / (MESH_V_STEPS - 1)) * 0.84;
                    const pt = sampleManifoldPoint(u, v);
                    const idx = (iu * MESH_V_STEPS + iv) * 3;
                    meshPos[idx + 0] = pt.x;
                    meshPos[idx + 1] = pt.y;
                    meshPos[idx + 2] = pt.z;
                }
            }
            ribbonMeshGeo.attributes.position.needsUpdate = true;
            ribbonMeshGeo.computeVertexNormals();

            // 4. Update Secondary Interwoven Latent Filaments
            for (let l = 0; l < NUM_LATENT; l++) {
                const lv = latentLines[l].userData.lv;
                const posArr = latentGeos[l].attributes.position.array;
                const phaseOffset = l * 0.28;

                for (let i = 0; i < NUM_STEPS; i++) {
                    const sl = sliceFrames[i];
                    const harmonicWave = Math.sin(sl.u * Math.PI * 3.5 + time * 0.8 + phaseOffset) * 1.8;
                    const crossV = (lv * 0.6) + (harmonicWave * 0.25);
                    const camber = (1.0 - crossV * crossV) * 1.1 * sl.sinU;

                    posArr[i * 3 + 0] = sl.pos.x + (crossV * sl.halfW * sl.Bx) + (camber * sl.Nx) + (sl.Nx * harmonicWave * 0.6);
                    posArr[i * 3 + 1] = sl.pos.y + (crossV * sl.halfW * sl.By) + (camber * sl.Ny) + (sl.Ny * harmonicWave * 0.6);
                    posArr[i * 3 + 2] = sl.pos.z + (crossV * sl.halfW * sl.Bz) + (camber * sl.Nz) + (sl.Bz * harmonicWave * 0.6);
                }
                latentGeos[l].attributes.position.needsUpdate = true;
            }

            // 5. Update Orthogonal Mathematical Contour Ribs
            for (let r = 0; r < NUM_RIBS; r++) {
                const u = ribLines[r].userData.uFrac;
                const posArr = ribGeos[r].attributes.position.array;
                for (let iv = 0; iv < RIB_V_STEPS; iv++) {
                    const v = (iv / (RIB_V_STEPS - 1)) * 2 - 1;
                    const pt = sampleManifoldPoint(u, v);
                    posArr[iv * 3 + 0] = pt.x;
                    posArr[iv * 3 + 1] = pt.y;
                    posArr[iv * 3 + 2] = pt.z;
                }
                ribGeos[r].attributes.position.needsUpdate = true;
            }

            // 6. Update Compute Nodes
            computeNodes.forEach((node) => {
                const pt = sampleManifoldPoint(node.userData.u, node.userData.v);
                node.position.set(pt.x, pt.y, pt.z);

                // Flaring during Compute Phase when signals pass
                let flare = 0;
                if (isComputePhase) {
                    const distToCompute = Math.abs(computeProgress * 1.15 - node.userData.u);
                    if (distToCompute < 0.12) {
                        flare = Math.cos((distToCompute / 0.12) * Math.PI * 0.5);
                    }
                }

                node.material.emissiveIntensity = node.userData.baseEmissive + flare * 2.2;
                const s = 1.9 + flare * 1.5;
                node.userData.sprite.scale.set(s, s, 1);
            });

            // 7. Update Luminous Signal Packets
            signalSprites.forEach((sprite) => {
                if (isComputePhase) {
                    const uProg = (computeProgress * sprite.userData.speed) - sprite.userData.delay;
                    if (uProg >= 0.05 && uProg <= 0.95) {
                        const v = (sprite.userData.filamentIdx / (NUM_FILAMENTS - 1)) * 2 - 1;
                        const pt = sampleManifoldPoint(uProg, v);
                        sprite.position.set(pt.x, pt.y, pt.z);
                        const edgeFade = Math.sin(Math.min(Math.max((uProg - 0.05) / 0.90, 0), 1) * Math.PI);
                        sprite.material.opacity = 0.95 * edgeFade;
                    } else {
                        sprite.material.opacity = 0.0;
                    }
                } else {
                    sprite.material.opacity = 0.0;
                }
            });
        }

        function animateSculptureScene() {
            const time = clock.getElapsedTime();

            // --- 3-PHASE SIGNATURE ENGINE ---
            // Period: 18 seconds
            const cycleTime = time % 18.0;
            let morphFactor = 0;
            let computeProgress = 0;
            let isComputePhase = false;

            if (cycleTime < 6.5) {
                // PHASE A — OBSERVE (0s - 6.5s)
                // Structure breathes subtly, minimal movement, soft ambient lighting
                morphFactor = 0.0;
                isComputePhase = false;
                keyLight.intensity = 2.2;
                pointerLight.intensity = 1.9;
            } else if (cycleTime < 13.5) {
                // PHASE B — COMPUTE (6.5s - 13.5s)
                // Luminous signals travel along selected curves.
                // Connected regions illuminate in sequence.
                // Geometric layers shift into a new configuration.
                isComputePhase = true;
                computeProgress = (cycleTime - 6.5) / 7.0; // [0, 1]
                morphFactor = Math.sin(computeProgress * Math.PI);
                keyLight.intensity = 2.2 + morphFactor * 0.8;
                pointerLight.intensity = 1.9 + morphFactor * 0.9;
            } else {
                // PHASE C — RESOLVE (13.5s - 18.0s)
                // Structure briefly settles into a balanced geometric arrangement,
                // then smoothly returns to its initial state.
                isComputePhase = false;
                const resolveProgress = (cycleTime - 13.5) / 4.5; // [0, 1]
                const easeOut = Math.pow(1 - resolveProgress, 2);
                morphFactor = easeOut * 0.22;
                keyLight.intensity = 2.2 + easeOut * 0.2;
                pointerLight.intensity = 1.9 + easeOut * 0.2;
            }

            if (!prefersReducedMotion) {
                updateGeometryBuffers(time, morphFactor, computeProgress, isComputePhase);
            }

            // Mouse parallax with smooth camera damping
            const targetCamX = mouse.x * 3.6;
            const targetCamY = mouse.y * 2.4;
            camera.position.x += (targetCamX - camera.position.x) * 0.045;
            camera.position.y += (targetCamY - camera.position.y) * 0.045;

            // Pointer Spotlight smooth tracking in 3D
            const targetLightX = (mouse.x * 24) + (isMobileScreen ? 0 : 8);
            const targetLightY = (mouse.y * 18) + (isMobileScreen ? 4 : 1);
            pointerLight.position.x += (targetLightX - pointerLight.position.x) * 0.08;
            pointerLight.position.y += (targetLightY - pointerLight.position.y) * 0.08;

            // Pointer proximity tilt on sculpture
            const targetTiltX = baseRotX + (mouse.y * 0.06);
            const targetTiltY = baseRotY + (mouse.x * 0.08);
            sculptureGroup.rotation.x += (targetTiltX - sculptureGroup.rotation.x) * 0.05;
            sculptureGroup.rotation.y += (targetTiltY - sculptureGroup.rotation.y) * 0.05;

            // Scroll Parallax: gradually rotates sculpture and reveals internal layers
            const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
            const scrollFraction = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
            sculptureGroup.rotation.y += scrollFraction * 0.95;
            sculptureGroup.rotation.x += scrollFraction * 0.22;
            sculptureGroup.position.y = basePosY + (scrollFraction * 5.5);

            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animateSculptureScene);
        }

        // --- EVENT LISTENERS & RESOURCE OPTIMIZATIONS ---
        window.addEventListener("resize", () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            updateSculptureLayout();
        });

        // Tab visibility pause to preserve battery and GPU
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                clock.start();
                animationFrameId = requestAnimationFrame(animateSculptureScene);
            }
        });

        if (prefersReducedMotion) {
            updateGeometryBuffers(0, 0, 0, false);
            renderer.render(scene, camera);
        } else {
            animateSculptureScene();
        }
    }
    initThinkingMachineSculpture();



    /* =====================================================
       4. DARK / LIGHT MODE
       ===================================================== */
    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            playPop(750);
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");

            localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

            showToast(isLight ? "☀️ Clean Light Mode enabled" : "🌙 Deep Cyber Dark Mode enabled");
        });
    }


    /* =====================================================
       5. MOBILE MENU
       ===================================================== */
    const mobileMenuBtn = document.getElementById("menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            playPop(500);
            navMenu.classList.toggle("active");
            mobileMenuBtn.classList.toggle("active");
        });

        const navLinks = navMenu.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                mobileMenuBtn.classList.remove("active");
            });
        });
    }


    /* =====================================================
       6. TYPING ANIMATION
       ===================================================== */
    const typingElement = document.getElementById("typing-text");
    const typingWords = [
        "Artificial Intelligence Systems",
        "Full-Stack Web Engineering",
        "Python & Automation Pipelines",
        "Data Structures & Algorithms",
        "Generative AI & API Integrations",
        "Computer Science Solutions"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
        if (!typingElement) return;

        const currentWord = typingWords[wordIndex];

        if (!deleting) {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentWord.length) {
                deleting = true;
                setTimeout(typeEffect, 1600);
                return;
            }
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % typingWords.length;
            }
        }

        setTimeout(typeEffect, deleting ? 50 : 95);
    }
    typeEffect();


    /* =====================================================
       7. 3D TILT EFFECT & SPOTLIGHT GLOW
       ===================================================== */
    const tiltElements = document.querySelectorAll("[data-tilt]");
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchDevice) {
        tiltElements.forEach(el => {
            el.addEventListener("mousemove", (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Spotlight coordinates
                el.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
                el.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);

                // 3D perspective tilt
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -7;
                const rotateY = ((x - centerX) / centerX) * 7;

                el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            el.addEventListener("mouseleave", () => {
                el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            });
        });
    }


    /* =====================================================
       8. SKILL CATEGORY FILTERS & COUNTERS
       ===================================================== */
    const skillFilterBtns = document.querySelectorAll(".skill-filter-btn");
    const skillCards = document.querySelectorAll(".skill-card");

    skillFilterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            playPop(620);
            skillFilterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.skillFilter;
            skillCards.forEach(card => {
                const cat = card.dataset.category;
                if (filter === "all" || cat === filter) {
                    card.style.display = "block";
                    setTimeout(() => card.classList.add("visible"), 30);
                } else {
                    card.style.display = "none";
                    card.classList.remove("visible");
                }
            });
        });
    });

    // Skill counters animation
    const skillCounters = document.querySelectorAll(".skill-counter");
    const skillBars = document.querySelectorAll(".skill-progress > span");
    let skillsAnimated = false;

    function animateSkills() {
        if (skillsAnimated) return;
        skillsAnimated = true;

        skillCounters.forEach(counter => {
            const target = parseInt(counter.dataset.target || 0);
            let current = 0;
            const duration = 1200;
            const stepTime = 20;
            const increment = target / (duration / stepTime);

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.round(current);
            }, stepTime);
        });

        skillBars.forEach(bar => {
            const progress = bar.dataset.progress || 0;
            setTimeout(() => {
                bar.style.width = progress + "%";
            }, 150);
        });
    }

    const skillsSection = document.querySelector("#skills");
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                }
            });
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    }


    /* =====================================================
       9. PROJECT FILTER
       ===================================================== */
    const filterButtons = document.querySelectorAll(".project-filters [data-filter]");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            playPop(600);
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;
            projectCards.forEach(card => {
                const categories = (card.dataset.category || "").split(" ");
                if (filter === "all" || categories.includes(filter)) {
                    card.style.display = "flex";
                    setTimeout(() => card.classList.add("visible"), 50);
                } else {
                    card.style.display = "none";
                }
            });
        });
    });


    /* =====================================================
       10. INTERACTIVE AI PROMPT STUDIO & LAB
       ===================================================== */
    const archetypePresets = {
        neural3d: {
            title: "3D Stylized Character Diffusion",
            basePrompt: "Vibrant hyper-expressive 3D synthetic character, charismatic facial gesture, stylized tech backdrop with warm incandescent lanterns, Pixar and DreamWorks octane render aesthetic, vibrant cinematic lighting, highly detailed character texture, 8k resolution",
            aspect: "--ar 9:16",
            lighting: "volumetric neon rim light, moody chiaroscuro",
            camera: "shot on 35mm anamorphic lens, f/1.8 shallow depth of field",
            engine: "Midjourney v6.1",
            negative: "deformed fingers, distorted mouth, realistic human skin, oversaturated blur, low quality, pixelated, watermark",
            tip: "Use seed consistency '--seed 88201' across scenes to keep character features identical throughout video sequences."
        },
        cinematic: {
            title: "Moody Trading Noir Concept",
            basePrompt: "Cinematic vertical portrait of an intense day trader surrounded by glowing multi-monitor green candlesticks, dark cyberpunk trading desk at 3 AM, reflective glass desk, drifting smoke particles, neon financial charts bokeh, realistic skin pores, photorealistic film grain",
            aspect: "--ar 9:16",
            lighting: "volumetric neon rim light, moody chiaroscuro",
            camera: "macro close-up eye focus, 85mm portrait prime",
            engine: "Midjourney v6.1",
            negative: "amateur photo, artificial plastic look, blown highlights, cluttered text, red candlesticks, extra hands",
            tip: "Pair with Runway Gen-3 Alpha camera push-in speed ramping for an ultra-viral 9:16 vertical hook."
        },
        cyberpunk: {
            title: "Cyberpunk 2099 Avatar",
            basePrompt: "Cybernetic Indian AI software engineer with glowing synaptic ocular implant, holographic translucent IDE code projection floating mid-air, rainy high-tech megalopolis night skyline, wet asphalt reflections, hyper-detailed mechanical neural collar, raytraced UE5 style",
            aspect: "--ar 16:9",
            lighting: "cyber-magenta and emerald reflections",
            camera: "dynamic low-angle heroic perspective",
            engine: "Flux.1 Schnell",
            negative: "low-poly, 2D illustration, disfigured limbs, blur, duplicate face, watermark, logo",
            tip: "Export with Flux.1 Schnell for razor-sharp mechanical and circuitry line detail without prompt bleeding."
        },
        photoreal: {
            title: "Hyper-Real 8K Portrait",
            basePrompt: "High-fashion commercial editorial portrait of a confident young tech creator, genuine micro-expression, natural skin texture with subtle subsurface scattering, tailored dark blazer, soft studio gradient backdrop, studio strobe keylight, Hasselblad H6D-100c medium format crispness",
            aspect: "--ar 1:1",
            lighting: "studio softbox commercial key light",
            camera: "macro close-up eye focus, 85mm portrait prime",
            engine: "Midjourney v6.1",
            negative: "airbrushed, cartoon, 3D CGI, mannequin, porcelain skin, fake eyes, lowres",
            tip: "Add '--stylize 250 --v 6.1' for an authentic cinematic editorial sheen without surreal artifacts."
        }
    };

    let activeArchetype = "neural3d";
    const archetypeButtons = document.querySelectorAll(".archetype-btn");
    const aspectSelect = document.getElementById("prompt-aspect");
    const lightingSelect = document.getElementById("prompt-lighting");
    const cameraSelect = document.getElementById("prompt-camera");
    const engineSelect = document.getElementById("prompt-engine");

    const promptDisplayText = document.getElementById("prompt-display-text");
    const badgeEngine = document.getElementById("badge-engine");
    const promptNegative = document.getElementById("prompt-negative");
    const promptTip = document.getElementById("prompt-tip");
    const copyPromptBtn = document.getElementById("copy-prompt-btn");

    function renderPrompt() {
        const preset = archetypePresets[activeArchetype];
        if (!preset || !promptDisplayText) return;

        const aspect = aspectSelect ? aspectSelect.value : preset.aspect;
        const lighting = lightingSelect ? lightingSelect.value : preset.lighting;
        const camera = cameraSelect ? cameraSelect.value : preset.camera;
        const engine = engineSelect ? engineSelect.value : preset.engine;

        const fullPrompt = `${preset.basePrompt}, ${camera}, ${lighting} ${aspect} --v 6.1 --style raw`;

        promptDisplayText.textContent = fullPrompt;
        if (badgeEngine) badgeEngine.textContent = engine;
        if (promptNegative) promptNegative.textContent = preset.negative;
        if (promptTip) promptTip.textContent = preset.tip;
    }

    archetypeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            playPop(700);
            archetypeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeArchetype = btn.dataset.archetype;

            const preset = archetypePresets[activeArchetype];
            if (preset) {
                if (aspectSelect) aspectSelect.value = preset.aspect;
                if (lightingSelect) lightingSelect.value = preset.lighting;
                if (cameraSelect) cameraSelect.value = preset.camera;
                if (engineSelect) engineSelect.value = preset.engine;
            }
            renderPrompt();
        });
    });

    [aspectSelect, lightingSelect, cameraSelect, engineSelect].forEach(select => {
        if (select) {
            select.addEventListener("change", () => {
                playPop(550);
                renderPrompt();
            });
        }
    });

    if (copyPromptBtn) {
        copyPromptBtn.addEventListener("click", () => {
            if (!promptDisplayText) return;
            const textToCopy = `/imagine prompt: ${promptDisplayText.textContent}\n--no ${promptNegative ? promptNegative.textContent : ""}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                playSuccess();
                showToast("✨ AI Prompt copied to clipboard!");
                copyPromptBtn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
                setTimeout(() => {
                    copyPromptBtn.innerHTML = '<i class="fas fa-copy"></i> <span>Copy Prompt</span>';
                }, 2000);
            }).catch(() => {
                showToast("Unable to copy to clipboard.");
            });
        });
    }

    // AI Render Simulation
    const simulateAiBtn = document.getElementById("simulate-ai-btn");
    const aiRenderProgress = document.getElementById("ai-render-progress");
    const aiProgressBar = document.getElementById("ai-progress-bar");
    const aiProgressLabel = document.getElementById("ai-progress-label");

    if (simulateAiBtn) {
        simulateAiBtn.addEventListener("click", () => {
            playChime();
            if (!aiRenderProgress || !aiProgressBar || !aiProgressLabel) return;

            simulateAiBtn.disabled = true;
            simulateAiBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Synthesizing...</span>';
            aiRenderProgress.style.display = "block";
            aiProgressBar.style.width = "0%";

            const stages = [
                { pct: 20, label: "⚡ Initializing Neural Latent Canvas (Step 1/5)... 20%" },
                { pct: 50, label: "🪄 Applying Multi-Seed Character Consistency... 50%" },
                { pct: 80, label: "💡 Injecting Volumetric Rim Lighting & Camera Vectors... 80%" },
                { pct: 100, label: "✨ Rendering 8K High-Resolution Output Complete! 100%" }
            ];

            let stageIdx = 0;
            const stepInterval = setInterval(() => {
                if (stageIdx < stages.length) {
                    const st = stages[stageIdx];
                    aiProgressBar.style.width = st.pct + "%";
                    aiProgressLabel.textContent = st.label;
                    playPop(400 + (st.pct * 4));
                    stageIdx++;
                } else {
                    clearInterval(stepInterval);
                    playSuccess();
                    showToast("🎉 Neural Diffusion Simulation Completed!");
                    simulateAiBtn.disabled = false;
                    simulateAiBtn.innerHTML = '<i class="fas fa-check"></i> <span>Render Tested!</span>';
                    setTimeout(() => {
                        simulateAiBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> <span>Test Render</span>';
                        aiRenderProgress.style.display = "none";
                    }, 2800);
                }
            }, 320);
        });
    }

    renderPrompt();


    /* =====================================================
       11. PROJECT CASE STUDY MODAL
       ===================================================== */
    const projectData = {
        1: {
            title: "Generative AI Multimodal Pipeline",
            tag: "AI Systems Engineering",
            img: "bk.png",
            desc: "An end-to-end automated software pipeline integrating LLM script reasoning, Stable Diffusion / Midjourney visual diffusion, ElevenLabs neural speech synthesis, and FFmpeg video rendering.",
            tech: ["Python API", "Midjourney v6", "Runway Gen-3", "ElevenLabs API", "FFmpeg"],
            highlights: [
                "Engineered automated script-to-visual generation pipeline for rapid asset synthesis",
                "Built persistent seed anchoring library maintaining character consistency across 100+ render passes",
                "Automated multi-track audio processing and waveform synchronization",
                "Custom visual asset compiler optimized for high-throughput mobile video rendering"
            ],
            link: "https://github.com/brajeshkushwa9089-lgtm"
        },
        2: {
            title: "AI Content Creation & Automation Systems",
            tag: "Workflow Architecture",
            img: "Ai content.png",
            desc: "Custom generative AI frameworks designed to accelerate creative ideation, thumbnail synthesis, script generation, and repetitive video rendering tasks by up to 10x.",
            tech: ["Python Automation", "MidJourney API", "RunwayML", "Prompt Engineering", "No-Code Workflows"],
            highlights: [
                "Script-to-Storyboard automated pipeline generating visual references in seconds",
                "Automated aspect ratio conversion (16:9 widescreen to 9:16 vertical) with generative inpainting",
                "High-speed thumbnail generation system testing multiple visual variants for maximum CTR"
            ],
            link: "https://github.com/brajeshkushwa9089-lgtm"
        },
        3: {
            title: "Neural Video Synthesis & Optical Engine",
            tag: "Computer Vision & Rendering",
            img: "cin.png",
            desc: "A stylized vertical video synthesis concept exploring neural motion vectors, anamorphic optical camera simulation, volumetric lighting shaders, and speed ramping.",
            tech: ["Generative AI", "Computer Vision", "Python APIs", "Optical Physics", "Color Grading"],
            highlights: [
                "Anamorphic 35mm lens simulation creating ultra-cinematic shallow depth of field",
                "Algorithmic lighting control: contrast-enhanced color spaces for risk vs. execution visual cues",
                "Frame-accurate motion sync and camera speed ramping"
            ],
            link: "https://github.com/brajeshkushwa9089-lgtm"
        },
        4: {
            title: "Interactive AI Portfolio Website",
            tag: "Full-Stack Web Development",
            img: "inter.png",
            desc: "A bespoke, responsive web application handcrafted to showcase generative AI work, interactive prompt engineering recipes, Web Audio synthesizers, and real-time developer terminal tooling.",
            tech: ["HTML5", "Modern CSS Glassmorphism", "JavaScript ES6+", "Web Audio API", "HTML5 Canvas"],
            highlights: [
                "Zero heavy UI frameworks: 100% vanilla JavaScript for ultra-fast 60fps/120fps performance",
                "Interactive Canvas particle network reacting to cursor physics",
                "Embedded Web Audio synthesizer generating procedural retro-futuristic sound feedback",
                "Developer terminal console emulator accessible via Ctrl+K keyboard shortcut"
            ],
            link: "https://github.com/brajeshkushwa9089-lgtm"
        },
        5: {
            title: "Hostel Research & Expense Tracker",
            tag: "Full-Stack Web Application",
            img: "hostal.png",
            desc: "A comprehensive full-stack web application designed for students to research, compare, and manage hostel accommodations along with real-time monthly expense tracking, MVC architecture, and Supabase PostgreSQL database.",
            tech: ["React.js", "Node.js", "Express.js", "Supabase PostgreSQL", "Tailwind CSS"],
            highlights: [
                "Full-stack architecture: Routes -> Controllers -> Services -> Models -> Supabase PostgreSQL",
                "Search nearby hostels by city, area, college, or pincode with side-by-side comparison",
                "Real-time student expense logging, category analytics, and monthly budget tracking",
                "Secure authentication, favorites saving, and responsive mobile-first design"
            ],
            link: "https://fix-hostel-tracker-login--jeebrajesh42.replit.app"
        },
        6: {
            title: "HostelTracker Discovery & Explorer",
            tag: "Frontend Web Architecture",
            img: "hostal 1.png",
            desc: "An intuitive student hostel discovery and comparison web portal deployed on Vercel, enabling students to filter nearby hostels by maximum rent budget, sort by highest ratings, compare amenities, and estimate monthly living costs.",
            tech: ["React.js", "Tailwind CSS", "Supabase", "Vite", "Vercel Cloud"],
            highlights: [
                "Dynamic URL parameter filtering (e.g. maxRent=25000 & sort=highest_rating) for shareable search states",
                "Interactive hostel comparison engine for pricing, ratings, and student amenities",
                "Estimated monthly living cost calculator integrated into the discovery workflow",
                "Modern responsive UI engineered with Tailwind CSS and deployed on Vercel edge network"
            ],
            link: "https://hostal-reseacher-frontend.vercel.app/explore?maxRent=25000&sort=highest_rating"
        },
        7: {
            title: "SpendWise (TeenTrack) — Expense Tracker",
            tag: "FinTech Web Application",
            img: "spinwesa.png",
            desc: "A smart teenager & student expense tracking platform engineered to visualize personal money flow with interactive charts, set budgets, and provide smart spending suggestions.",
            tech: ["React.js", "Node.js", "Express.js", "Supabase PostgreSQL", "Tailwind CSS"],
            highlights: [
                "Interactive money-flow visualization with donut and bar charts for spending patterns",
                "Smart AI-style suggestions analyzing food, transport, and entertainment expenses",
                "Full-stack Node.js & Express backend integrated with Supabase PostgreSQL database",
                "Seamless Dark and Light mode UI transitions deployed on Vercel"
            ],
            link: "https://teen-tracker-frontend-three.vercel.app/"
        }
    };

    const projectModal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-project-title");
    const modalTag = document.getElementById("modal-project-tag");
    const modalImg = document.getElementById("modal-project-img");
    const modalDesc = document.getElementById("modal-project-desc");
    const modalTech = document.getElementById("modal-project-tech");
    const modalHighlights = document.getElementById("modal-project-highlights");
    const modalLink = document.getElementById("modal-project-link");
    const modalCloseBtn = document.getElementById("project-modal-close");
    const modalDismissBtn = document.getElementById("modal-dismiss-btn");
    const modalBackdrop = document.getElementById("project-modal-backdrop");

    function openProjectModal(id) {
        const data = projectData[id];
        if (!data || !projectModal) return;

        playChime();
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalTag) modalTag.textContent = data.tag;
        if (modalImg) modalImg.src = data.img;
        if (modalDesc) modalDesc.textContent = data.desc;
        if (modalLink) modalLink.href = data.link;

        if (modalTech) {
            modalTech.innerHTML = data.tech.map(t => `<span>${t}</span>`).join("");
        }
        if (modalHighlights) {
            modalHighlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join("");
        }

        projectModal.classList.add("show");
        document.body.classList.add("no-scroll");
    }

    function closeProjectModal() {
        if (!projectModal) return;
        playPop(450);
        projectModal.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }

    document.querySelectorAll(".btn-case-study").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const id = btn.dataset.project || btn.closest(".project-card")?.dataset.projectId || 1;
            openProjectModal(id);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener("click", closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeProjectModal);


    /* =====================================================
       12. INTERACTIVE AI TERMINAL (CTRL+K)
       ===================================================== */
    const terminalModal = document.getElementById("terminal-modal");
    const cmdKBtn = document.getElementById("cmd-k-btn");
    const footerTerminalBtn = document.getElementById("footer-terminal-trigger");
    const terminalOverlay = document.getElementById("terminal-overlay");
    const terminalCloseBtn = document.getElementById("terminal-close-btn");
    const terminalCloseDot = document.getElementById("terminal-close-dot");
    const terminalForm = document.getElementById("terminal-form");
    const terminalInput = document.getElementById("terminal-input");
    const terminalOutput = document.getElementById("terminal-output");
    const terminalBody = document.getElementById("terminal-body");

    function openTerminal() {
        if (!terminalModal) return;
        playChime();
        terminalModal.classList.add("show");
        document.body.classList.add("no-scroll");
        setTimeout(() => {
            if (terminalInput) terminalInput.focus();
        }, 100);
    }

    function closeTerminal() {
        if (!terminalModal) return;
        playPop(400);
        terminalModal.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }

    if (cmdKBtn) cmdKBtn.addEventListener("click", openTerminal);
    if (footerTerminalBtn) footerTerminalBtn.addEventListener("click", openTerminal);
    if (terminalOverlay) terminalOverlay.addEventListener("click", closeTerminal);
    if (terminalCloseBtn) terminalCloseBtn.addEventListener("click", closeTerminal);
    if (terminalCloseDot) terminalCloseDot.addEventListener("click", closeTerminal);

    // Keyboard shortcut Ctrl+K / Cmd+K and ESC
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (terminalModal && terminalModal.classList.contains("show")) {
                closeTerminal();
            } else {
                openTerminal();
            }
        } else if (e.key === "Escape") {
            closeTerminal();
            closeProjectModal();
        }
    });

    // Terminal command definitions
    const terminalCommands = {
        help: () => `
<div class="terminal-line">Available commands:</div>
<div class="terminal-line"><span class="cmd-highlight">about</span>      - Who is Brajesh Kushwaha?</div>
<div class="terminal-line"><span class="cmd-highlight">skills</span>     - AI &amp; technical capabilities</div>
<div class="terminal-line"><span class="cmd-highlight">projects</span>   - Featured creative &amp; web projects</div>
<div class="terminal-line"><span class="cmd-highlight">pipeline</span>   - 5-step AI multimodal architecture</div>
<div class="terminal-line"><span class="cmd-highlight">prompt</span>     - Jump to AI Prompt Studio</div>
<div class="terminal-line"><span class="cmd-highlight">theme</span>      - Toggle light/dark mode</div>
<div class="terminal-line"><span class="cmd-highlight">resume</span>     - Download official Curriculum Vitae</div>
<div class="terminal-line"><span class="cmd-highlight">quote</span>      - Random AI inspiration quote</div>
<div class="terminal-line"><span class="cmd-highlight">contact</span>    - Direct phone &amp; email details</div>
<div class="terminal-line"><span class="cmd-highlight">matrix</span>     - Run digital rain easter egg</div>
<div class="terminal-line"><span class="cmd-highlight">clear</span>      - Clear terminal screen</div>
        `,
        about: () => `
<div class="terminal-line">🤖 <strong>Brajesh Kushwaha</strong></div>
<div class="terminal-line">Computer Science &amp; Engineering (AI) Scholar | Full-Stack AI Developer.</div>
<div class="terminal-line">Currently pursuing B.Tech in CSE (AI) at Scope Global Skills University (SGSU × NIAT).</div>
<div class="terminal-line">Specializing in Artificial Intelligence systems, Machine Learning algorithms, Python automation, and web REPLs.</div>
        `,
        skills: () => `
<div class="terminal-line">⚡ <strong>Core Competencies:</strong></div>
<div class="terminal-line">🔹 Artificial Intelligence &amp; ML: Model fine-tuning, PyTorch, Neural Diffusion [92%]</div>
<div class="terminal-line">🔹 Prompt Engineering: Multi-seed character locking, API vectors [94%]</div>
<div class="terminal-line">🔹 Python &amp; Data Engineering: Automation scripts, REST APIs, NumPy/Pandas [88%]</div>
<div class="terminal-line">🔹 Full-Stack Web Dev: JavaScript ES6+, Web Audio API, Canvas, HTML5/CSS3 [85%]</div>
<div class="terminal-line">🔹 Version Control &amp; DevOps: Git, GitHub Actions, Linux CLI [80%]</div>
        `,
        projects: () => `
<div class="terminal-line">🚀 <strong>Featured Live Web Applications &amp; AI Projects:</strong></div>
<div class="terminal-line">1. <strong>Hostel Research &amp; Expense Tracker</strong> - Full-stack login &amp; budget app (<a href="https://fix-hostel-tracker-login--jeebrajesh42.replit.app" target="_blank" style="color:var(--secondary)">Live App</a>)</div>
<div class="terminal-line">2. <strong>HostelTracker Discovery &amp; Explorer</strong> - Hostel search &amp; rent filter portal (<a href="https://hostal-reseacher-frontend.vercel.app/explore?maxRent=25000&sort=highest_rating" target="_blank" style="color:var(--secondary)">Live on Vercel</a>)</div>
<div class="terminal-line">3. <strong>SpendWise — Smart Expense Tracker</strong> - FinTech budgeting &amp; money flow UI (<a href="https://teen-tracker-frontend-three.vercel.app/" target="_blank" style="color:var(--secondary)">Live on Vercel</a>)</div>
<div class="terminal-line">4. <strong>Generative AI Multimodal Pipeline</strong> - LLM + Diffusion + Neural Voice API framework (<a href="https://github.com/brajeshkushwa9089-lgtm" target="_blank" style="color:var(--secondary)">GitHub</a>)</div>
<div class="terminal-line">5. <strong>Full-Stack Interactive REPL IDE</strong> - Web Audio, Canvas &amp; In-Browser JS Interpreter</div>
        `,
        pipeline: () => `
<div class="terminal-line">🎬 <strong>AI Systems Pipeline (5 Phases):</strong></div>
<div class="terminal-line">01. Architecture &amp; Model Selection (PyTorch &amp; HuggingFace)</div>
<div class="terminal-line">02. Prompt Engineering &amp; Latent Diffusion (Stable Diffusion / Flux)</div>
<div class="terminal-line">03. Neural Voice &amp; Audio Signal Synthesis (ElevenLabs API)</div>
<div class="terminal-line">04. Concurrency &amp; REST Integration (FastAPI / Python)</div>
<div class="terminal-line">05. Front-End Interactive Deployment (HTML5 / ES6 Web REPL)</div>
        `,
        prompt: () => {
            setTimeout(() => {
                closeTerminal();
                document.querySelector("#ai-lab")?.scrollIntoView({ behavior: "smooth" });
            }, 300);
            return '<div class="terminal-line">Navigating to AI Prompt Studio &amp; Lab...</div>';
        },
        theme: () => {
            themeToggle?.click();
            return '<div class="terminal-line">Switched display color theme.</div>';
        },
        resume: () => {
            const link = document.createElement("a");
            link.href = "Resume.pdf";
            link.download = "Resume.pdf";
            link.click();
            playSuccess();
            return '<div class="terminal-line">📄 Downloading Brajesh Kushwaha\'s CV (Resume.pdf)...</div>';
        },
        contact: () => `
<div class="terminal-line">📬 <strong>Direct Contact Info:</strong></div>
<div class="terminal-line">📧 Email: <a href="mailto:brajeshkushwa9089@gmail.com" style="color:var(--secondary)">brajeshkushwa9089@gmail.com</a></div>
<div class="terminal-line">📱 Phone: +91 91704 73679</div>
<div class="terminal-line">📍 Location: Lalitpur, Uttar Pradesh / Bhopal (SGSU)</div>
<div class="terminal-line">💻 GitHub: <a href="https://github.com/brajeshkushwa9089-lgtm" target="_blank" style="color:var(--secondary)">github.com/brajeshkushwa9089-lgtm</a></div>
        `,
        quote: () => {
            const quotes = [
                '"Generative AI doesn\'t replace human creativity — it amplifies our wildest imaginations at lightspeed."',
                '"The best prompt engineers are not just coders; they are cinematic directors speaking machine language."',
                '"Code is poetry, but AI is the symphony."',
                '"Consistency in character is the holy grail of generative animation."'
            ];
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            return `<div class="terminal-line"><em>${q}</em></div>`;
        },
        matrix: () => {
            setTimeout(() => {
                const lines = [
                    "01000010 01110010 01100001 01101010 01100101 01110011 01101000",
                    "NEURAL_LINK::ESTABLISHED [LATENCY: 0.4ms]",
                    "MIDJOURNEY_SEED_LOCK: OK",
                    "RUNWAY_GEN3_STREAM: SYNCHRONIZED",
                    "WELCOME TO THE MATRIX, VISITOR."
                ];
                lines.forEach((l, i) => {
                    setTimeout(() => {
                        const div = document.createElement("div");
                        div.className = "terminal-line";
                        div.style.color = "#22c55e";
                        div.textContent = l;
                        terminalOutput?.appendChild(div);
                        terminalBody?.scrollTo({ top: terminalBody.scrollHeight, behavior: "smooth" });
                    }, i * 200);
                });
            }, 100);
            return '<div class="terminal-line" style="color:#22c55e">Initializing Matrix Subsystem...</div>';
        },
        clear: () => {
            if (terminalOutput) terminalOutput.innerHTML = "";
            return "";
        }
    };

    function runTerminalCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        playPop(650);
        const commandEcho = document.createElement("div");
        commandEcho.className = "terminal-line";
        commandEcho.innerHTML = `<span style="color:#34d399">brajesh_ai &gt;</span> <strong>${escapeHTML(rawCmd)}</strong>`;
        terminalOutput?.appendChild(commandEcho);

        if (terminalCommands[cmd]) {
            const result = terminalCommands[cmd]();
            if (result) {
                const responseLine = document.createElement("div");
                responseLine.innerHTML = result;
                terminalOutput?.appendChild(responseLine);
            }
        } else {
            const errLine = document.createElement("div");
            errLine.className = "terminal-line";
            errLine.style.color = "#f87171";
            errLine.innerHTML = `Command not recognized: '${escapeHTML(cmd)}'. Type <span class="cmd-highlight">'help'</span> for a list of valid commands.`;
            terminalOutput?.appendChild(errLine);
        }

        if (terminalInput) terminalInput.value = "";
        terminalBody?.scrollTo({ top: terminalBody.scrollHeight, behavior: "smooth" });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    if (terminalForm) {
        terminalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (terminalInput) runTerminalCommand(terminalInput.value);
        });
    }

    document.querySelectorAll(".term-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const cmd = chip.dataset.cmd;
            if (cmd) runTerminalCommand(cmd);
        });
    });


    /* =====================================================
       13. CIRCULAR PROGRESS SCROLL-TO-TOP BUTTON
       ===================================================== */
    const scrollTopBtn = document.getElementById("scroll-top");
    const progressCircle = document.getElementById("scroll-progress-circle");
    const totalCircumference = 138.23; // 2 * PI * 22

    function updateScrollProgress() {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        if (scrollTotal > 0 && progressCircle) {
            const fraction = Math.min(Math.max(currentScroll / scrollTotal, 0), 1);
            const offset = totalCircumference - (fraction * totalCircumference);
            progressCircle.style.strokeDashoffset = offset;
        }

        if (scrollTopBtn) {
            if (currentScroll > 320) {
                scrollTopBtn.classList.add("show");
            } else {
                scrollTopBtn.classList.remove("show");
            }
        }
    }

    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            playPop(700);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* =====================================================
       14. COPY EMAIL QUICK BUTTON
       ===================================================== */
    const copyEmailBtn = document.getElementById("copy-email-btn");
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", () => {
            const email = copyEmailBtn.dataset.email || "brajeshkushwa9089@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                playSuccess();
                showToast("📋 Email copied: " + email);
                const textSpan = copyEmailBtn.querySelector(".btn-copy-text");
                if (textSpan) textSpan.textContent = "Copied!";
                setTimeout(() => {
                    if (textSpan) textSpan.textContent = "Copy Email";
                }, 2000);
            });
        });
    }


    /* =====================================================
       15. SMOOTH SCROLL FOR ANCHOR LINKS
       ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                playPop(520);
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    /* =====================================================
       16. NAVBAR SCROLL EFFECT & ACTIVE LINK SPY
       ===================================================== */
    const header = document.getElementById("header");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-menu a");

    window.addEventListener("scroll", () => {
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }
        });
    });


    /* =====================================================
       17. TOAST NOTIFICATION
       ===================================================== */
    window.showToast = function(message) {
        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toast-message");
        if (!toast) return;

        if (toastMessage) {
            toastMessage.textContent = message;
        } else {
            toast.textContent = message;
        }

        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    };


    /* =====================================================
       18. CONTACT FORM SUBMISSION
       ===================================================== */
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const message = document.getElementById("message")?.value.trim();

            if (!name || !email || !message) {
                showToast("⚠️ Please fill in all required fields.");
                return;
            }

            playSuccess();
            showToast("🚀 Thank you " + name + "! Your message was sent.");
            contactForm.reset();
        });
    }


    /* =====================================================
       19. CUSTOM CURSOR
       ===================================================== */
    const cursor = document.querySelector(".cursor");
    const cursorFollower = document.querySelector(".cursor-follower");

    if (cursor && cursorFollower && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";

            cursorFollower.style.left = e.clientX + "px";
            cursorFollower.style.top = e.clientY + "px";
        });

        const interactives = document.querySelectorAll("a, button, input, select, textarea, .project-card, .pipeline-card, .skill-card, .term-chip");
        interactives.forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursor.classList.add("cursor-hover");
                cursorFollower.classList.add("cursor-hover");
            });
            el.addEventListener("mouseleave", () => {
                cursor.classList.remove("cursor-hover");
                cursorFollower.classList.remove("cursor-hover");
            });
        });
    }


    /* =====================================================
       20. DYNAMIC GITHUB PROJECTS LOADER
       ===================================================== */
    const githubContainer = document.getElementById("github-projects");
    const githubUsername = "brajeshkushwa9089-lgtm";

    async function loadGithubProjects() {
        if (!githubContainer) return;

        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
            if (!response.ok) throw new Error("GitHub API status " + response.status);

            const projects = await response.json();
            if (!Array.isArray(projects) || projects.length === 0) {
                githubContainer.innerHTML = "<p class='github-loading'>No public repositories found yet.</p>";
                return;
            }

            githubContainer.innerHTML = "";
            projects.forEach(project => {
                const card = document.createElement("div");
                card.className = "github-card";
                card.setAttribute("data-tilt", "");
                card.innerHTML = `
                    <h3>${escapeHTML(project.name)}</h3>
                    <p>${escapeHTML(project.description || "Open-source software project.")}</p>
                    <div class="github-card-meta">
                        <span>⭐ ${project.stargazers_count}</span>
                        <span>🍴 ${project.forks_count}</span>
                        <span>${project.language || "Code"}</span>
                    </div>
                    <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">
                        View Repository →
                    </a>
                `;
                githubContainer.appendChild(card);
            });
        } catch (error) {
            githubContainer.innerHTML = `
                <div class="github-card" style="grid-column: 1/-1; text-align: center;">
                    <h3>GitHub Profile</h3>
                    <p>Explore all repositories, code samples, and web projects directly on GitHub.</p>
                    <a href="https://github.com/${githubUsername}" target="_blank" rel="noopener noreferrer">
                        Visit GitHub @${githubUsername} →
                    </a>
                </div>
            `;
        }
    }
    loadGithubProjects();


    /* =====================================================
       21. SCROLL REVEAL OBSERVER
       ===================================================== */
    const revealElements = document.querySelectorAll(
        ".section, .skill-card, .project-card, .pipeline-card, .service-card, .achievement-card"
    );

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    revealElements.forEach(el => revealObserver.observe(el));


    /* =====================================================
       22. CURRENT YEAR FOOTER UPDATE
       ===================================================== */
    const currentYearEl = document.getElementById("current-year");
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    console.log("✨ Brajesh Kushwaha AI Portfolio initialized with Canvas Neural Engine, Web Audio, Prompt Studio & Terminal Console!");
});