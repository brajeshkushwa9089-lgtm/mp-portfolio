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
       3. IMMERSIVE 3D SPACE UNIVERSE & ROTATING PLANET
       Combining ONLY two primary visual concepts:
       1) Cinematic Moving 3D Universe (multi-depth starfield,
          forward-motion hyperspace travel, purple-blue nebula clouds)
       2) Glowing Rotating 3D Planet with Atmospheric Edges,
          Multiple Orbital Rings & Satellite Particles
       ===================================================== */
    function init3DSpaceUniverse() {
        const spaceCanvas = document.getElementById("space-3d-canvas") || document.getElementById("neural-canvas");
        if (!spaceCanvas) return;

        if (typeof THREE === "undefined") {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof THREE !== "undefined") {
                    clearInterval(checkInterval);
                    init3DSpaceUniverse();
                } else if (attempts > 30) {
                    clearInterval(checkInterval);
                }
            }, 100);
            return;
        }

        // --- SCENE, CAMERA & RENDERER ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x030712, 0.0012);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(0, 0, 48);

        const renderer = new THREE.WebGLRenderer({
            canvas: spaceCanvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        // --- PROCEDURAL TEXTURES ---
        // 1. Glowing Circular Star Particle Sprite
        function createStarTexture() {
            const size = 64;
            const c = document.createElement("canvas");
            c.width = size;
            c.height = size;
            const ctx = c.getContext("2d");
            const center = size / 2;
            const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
            grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
            grad.addColorStop(0.2, "rgba(235, 245, 255, 0.95)");
            grad.addColorStop(0.45, "rgba(139, 92, 246, 0.45)");
            grad.addColorStop(0.75, "rgba(6, 182, 212, 0.15)");
            grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(center, center, center, 0, Math.PI * 2);
            ctx.fill();
            return new THREE.CanvasTexture(c);
        }
        const starTexture = createStarTexture();

        // 2. Cosmic Nebula Cloud Texture (Electric Violet & Cyan)
        function createNebulaTexture(colorInner, colorOuter) {
            const size = 256;
            const c = document.createElement("canvas");
            c.width = size;
            c.height = size;
            const ctx = c.getContext("2d");
            const center = size / 2;
            const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
            grad.addColorStop(0.0, colorInner);
            grad.addColorStop(0.4, colorOuter);
            grad.addColorStop(0.8, "rgba(30, 27, 75, 0.05)");
            grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(center, center, center, 0, Math.PI * 2);
            ctx.fill();
            return new THREE.CanvasTexture(c);
        }
        const nebulaTexViolet = createNebulaTexture("rgba(124, 58, 237, 0.20)", "rgba(67, 56, 202, 0.10)");
        const nebulaTexCyan = createNebulaTexture("rgba(6, 182, 212, 0.16)", "rgba(30, 58, 138, 0.08)");

        // 3. High-Detail Procedural Planet Surface Texture
        function createPlanetTexture() {
            const width = 1024;
            const height = 512;
            const c = document.createElement("canvas");
            c.width = width;
            c.height = height;
            const ctx = c.getContext("2d");

            // Base deep midnight navy to abyss gradient
            const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
            baseGrad.addColorStop(0.0, "#030612");
            baseGrad.addColorStop(0.3, "#0a1130");
            baseGrad.addColorStop(0.5, "#0d1a45");
            baseGrad.addColorStop(0.7, "#09102b");
            baseGrad.addColorStop(1.0, "#02040d");
            ctx.fillStyle = baseGrad;
            ctx.fillRect(0, 0, width, height);

            // Oceanic & energy bands
            for (let i = 0; i < 22; i++) {
                const y = (i / 22) * height;
                const bandH = Math.sin((i / 22) * Math.PI) * 40 + 12;
                const grad = ctx.createLinearGradient(0, y, 0, y + bandH);
                const isCyan = i % 3 === 0;
                const isViolet = i % 2 === 0;
                const color = isCyan ? "rgba(6, 182, 212, " : (isViolet ? "rgba(139, 92, 246, " : "rgba(79, 70, 229, ");
                grad.addColorStop(0.0, color + "0.0)");
                grad.addColorStop(0.5, color + (Math.random() * 0.35 + 0.15) + ")");
                grad.addColorStop(1.0, color + "0.0)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, y - 4, width, bandH);
            }

            // Continental landmasses & energy clusters
            for (let cIdx = 0; cIdx < 32; cIdx++) {
                const cx = Math.random() * width;
                const cy = Math.random() * height;
                const r = Math.random() * 85 + 30;
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                grad.addColorStop(0.0, "rgba(167, 139, 250, 0.50)");
                grad.addColorStop(0.35, "rgba(124, 58, 237, 0.28)");
                grad.addColorStop(0.75, "rgba(6, 182, 212, 0.14)");
                grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            }

            // High-tech energetic latitude lines & grid lattice
            ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
            ctx.lineWidth = 1;
            for (let lat = 35; lat < height; lat += 35) {
                ctx.beginPath();
                ctx.moveTo(0, lat);
                ctx.lineTo(width, lat);
                ctx.stroke();
            }
            for (let lon = 70; lon < width; lon += 70) {
                ctx.beginPath();
                ctx.moveTo(lon, 0);
                ctx.lineTo(lon, height);
                ctx.stroke();
            }

            // Luminous cyber energy nodes
            for (let n = 0; n < 45; n++) {
                const nx = Math.random() * width;
                const ny = Math.random() * height;
                ctx.fillStyle = "rgba(165, 243, 252, 0.85)";
                ctx.beginPath();
                ctx.arc(nx, ny, Math.random() * 2 + 1, 0, Math.PI * 2);
                ctx.fill();
            }

            const tex = new THREE.CanvasTexture(c);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            return tex;
        }
        const planetTexture = createPlanetTexture();

        // 4. Planetary Ring Texture (1D Radial Striation)
        function createRingTexture() {
            const size = 512;
            const c = document.createElement("canvas");
            c.width = size;
            c.height = 1;
            const ctx = c.getContext("2d");
            const grad = ctx.createLinearGradient(0, 0, size, 0);
            grad.addColorStop(0.0, "rgba(0, 0, 0, 0)");
            grad.addColorStop(0.12, "rgba(139, 92, 246, 0.35)");
            grad.addColorStop(0.25, "rgba(6, 182, 212, 0.85)");
            grad.addColorStop(0.38, "rgba(124, 58, 237, 0.40)");
            grad.addColorStop(0.48, "rgba(10, 15, 35, 0.10)");
            grad.addColorStop(0.60, "rgba(167, 139, 250, 0.90)");
            grad.addColorStop(0.72, "rgba(6, 182, 212, 0.70)");
            grad.addColorStop(0.85, "rgba(79, 70, 229, 0.45)");
            grad.addColorStop(0.95, "rgba(139, 92, 246, 0.20)");
            grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, size, 1);
            return new THREE.CanvasTexture(c);
        }
        const ringTexture = createRingTexture();

        // --- 1. CINEMATIC MOVING 3D UNIVERSE ---
        const universeGroup = new THREE.Group();
        scene.add(universeGroup);

        // A. Distant Deep-Field Starfield
        const deepStarCount = 1800;
        const deepStarGeo = new THREE.BufferGeometry();
        const deepStarPos = new Float32Array(deepStarCount * 3);
        const deepStarColors = new Float32Array(deepStarCount * 3);

        for (let i = 0; i < deepStarCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 280 + Math.random() * 750;

            deepStarPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            deepStarPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            deepStarPos[i * 3 + 2] = r * Math.cos(phi);

            const rnd = Math.random();
            if (rnd < 0.45) {
                deepStarColors[i * 3] = 0.94; deepStarColors[i * 3 + 1] = 0.96; deepStarColors[i * 3 + 2] = 1.0;
            } else if (rnd < 0.75) {
                deepStarColors[i * 3] = 0.65; deepStarColors[i * 3 + 1] = 0.52; deepStarColors[i * 3 + 2] = 0.98;
            } else {
                deepStarColors[i * 3] = 0.18; deepStarColors[i * 3 + 1] = 0.75; deepStarColors[i * 3 + 2] = 0.95;
            }
        }
        deepStarGeo.setAttribute("position", new THREE.BufferAttribute(deepStarPos, 3));
        deepStarGeo.setAttribute("color", new THREE.BufferAttribute(deepStarColors, 3));

        const deepStarMat = new THREE.PointsMaterial({
            size: 1.6,
            map: starTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const deepStarfield = new THREE.Points(deepStarGeo, deepStarMat);
        universeGroup.add(deepStarfield);

        // B. Forward-Motion Hyperspace Starfield (Simulating Traveling Through Space)
        const warpCount = 1200;
        const warpGeo = new THREE.BufferGeometry();
        const warpPositions = new Float32Array(warpCount * 3);
        const warpColors = new Float32Array(warpCount * 3);

        for (let i = 0; i < warpCount; i++) {
            warpPositions[i * 3] = (Math.random() - 0.5) * 550;
            warpPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
            warpPositions[i * 3 + 2] = -650 + Math.random() * 750;

            const isCyan = Math.random() > 0.42;
            warpColors[i * 3] = isCyan ? 0.20 : 0.68;
            warpColors[i * 3 + 1] = isCyan ? 0.78 : 0.48;
            warpColors[i * 3 + 2] = 1.0;
        }
        warpGeo.setAttribute("position", new THREE.BufferAttribute(warpPositions, 3));
        warpGeo.setAttribute("color", new THREE.BufferAttribute(warpColors, 3));

        const warpMat = new THREE.PointsMaterial({
            size: 1.8,
            map: starTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.88,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const warpStarfield = new THREE.Points(warpGeo, warpMat);
        universeGroup.add(warpStarfield);

        // C. Subtle Purple-Blue Nebula Clouds
        const nebulaGroup = new THREE.Group();
        for (let i = 0; i < 10; i++) {
            const isCyan = i % 2 === 0;
            const nebMat = new THREE.SpriteMaterial({
                map: isCyan ? nebulaTexCyan : nebulaTexViolet,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const sprite = new THREE.Sprite(nebMat);
            const scale = 260 + Math.random() * 200;
            sprite.scale.set(scale, scale, 1);
            sprite.position.set(
                (Math.random() - 0.5) * 450,
                (Math.random() - 0.5) * 300,
                -380 + Math.random() * 250
            );
            nebulaGroup.add(sprite);
        }
        universeGroup.add(nebulaGroup);

        // --- 2. GLOWING ROTATING 3D PLANET WITH ORBITAL RINGS ---
        const planetGroup = new THREE.Group();
        scene.add(planetGroup);

        // A. Planet Sphere Body
        const planetRadius = 10.5;
        const planetGeom = new THREE.SphereGeometry(planetRadius, 64, 64);
        const planetMat = new THREE.MeshStandardMaterial({
            map: planetTexture,
            roughness: 0.58,
            metalness: 0.28,
            emissive: new THREE.Color(0x0a1033),
            emissiveIntensity: 0.45
        });
        const planetMesh = new THREE.Mesh(planetGeom, planetMat);
        planetGroup.add(planetMesh);

        // B. Glowing Violet & Cyan Atmospheric Edge (Fresnel Atmosphere)
        const atmosphereGeom = new THREE.SphereGeometry(planetRadius * 1.055, 64, 64);
        const atmosphereMat = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vec3 viewDir = normalize(-vPosition);
                    float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
                    float intensity = pow(fresnel, 2.5);
                    vec3 cyan = vec3(0.04, 0.76, 0.94);
                    vec3 violet = vec3(0.58, 0.28, 0.98);
                    vec3 glow = mix(cyan, violet, intensity * 0.72);
                    gl_FragColor = vec4(glow, intensity * 0.90);
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false
        });
        const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
        planetGroup.add(atmosphereMesh);

        // C. Primary Planetary Ring with Radial Mapping
        const ringInner = 16.2;
        const ringOuter = 25.5;
        const ringGeom = new THREE.RingGeometry(ringInner, ringOuter, 96, 4);
        // Remap UV coordinates so radial distance maps cleanly across the 1D ring gradient
        const rPos = ringGeom.attributes.position;
        const rUvs = ringGeom.attributes.uv;
        for (let i = 0; i < rPos.count; i++) {
            const rx = rPos.getX(i);
            const ry = rPos.getY(i);
            const radius = Math.sqrt(rx * rx + ry * ry);
            const u = Math.min(Math.max((radius - ringInner) / (ringOuter - ringInner), 0), 1);
            rUvs.setXY(i, u, 0.5);
        }
        rUvs.needsUpdate = true;

        const ringMat = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.88,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const primaryRing = new THREE.Mesh(ringGeom, ringMat);
        primaryRing.rotation.x = Math.PI * 0.38;
        primaryRing.rotation.z = Math.PI * 0.08;
        planetGroup.add(primaryRing);

        // D. Secondary Gyroscopic Energy Ring (contrasting angle)
        const gyroInner = 13.2;
        const gyroOuter = 14.2;
        const gyroGeom = new THREE.RingGeometry(gyroInner, gyroOuter, 72, 2);
        const gyroMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const gyroRing = new THREE.Mesh(gyroGeom, gyroMat);
        gyroRing.rotation.x = Math.PI * 0.65;
        gyroRing.rotation.y = Math.PI * 0.22;
        planetGroup.add(gyroRing);

        // E. Outer Subtle Orbital Torus Filament
        const torusGeom = new THREE.TorusGeometry(28, 0.08, 16, 120);
        const torusMat = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.40,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const outerTorus = new THREE.Mesh(torusGeom, torusMat);
        outerTorus.rotation.x = Math.PI * 0.42;
        planetGroup.add(outerTorus);

        // F. Tiny Luminous Particles Moving Along Orbital Paths
        const satelliteCount = 180;
        const satGeo = new THREE.BufferGeometry();
        const satPositions = new Float32Array(satelliteCount * 3);
        const satColors = new Float32Array(satelliteCount * 3);
        const satRadii = new Float32Array(satelliteCount);
        const satAngles = new Float32Array(satelliteCount);
        const satSpeeds = new Float32Array(satelliteCount);

        for (let i = 0; i < satelliteCount; i++) {
            const r = ringInner + Math.random() * (ringOuter - ringInner);
            const a = Math.random() * Math.PI * 2;
            satRadii[i] = r;
            satAngles[i] = a;
            satSpeeds[i] = (0.0035 + Math.random() * 0.0055) * (Math.random() < 0.15 ? -1 : 1);

            satPositions[i * 3] = Math.cos(a) * r;
            satPositions[i * 3 + 1] = Math.sin(a) * r;
            satPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

            const isCyan = Math.random() > 0.45;
            satColors[i * 3] = isCyan ? 0.08 : 0.68;
            satColors[i * 3 + 1] = isCyan ? 0.82 : 0.45;
            satColors[i * 3 + 2] = 1.0;
        }
        satGeo.setAttribute("position", new THREE.BufferAttribute(satPositions, 3));
        satGeo.setAttribute("color", new THREE.BufferAttribute(satColors, 3));

        const satMat = new THREE.PointsMaterial({
            size: 1.5,
            map: starTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.92,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const orbitalSatellites = new THREE.Points(satGeo, satMat);
        primaryRing.add(orbitalSatellites);

        // --- 3. LIGHTING ---
        // Distant cosmic star directional light
        const dirLight = new THREE.DirectionalLight(0xdbeafe, 2.0);
        dirLight.position.set(-45, 35, 45);
        scene.add(dirLight);

        // Violet atmospheric rim light
        const rimLight = new THREE.PointLight(0x8b5cf6, 1.4, 160);
        rimLight.position.set(25, -12, -22);
        scene.add(rimLight);

        // Ambient midnight-navy light
        const ambLight = new THREE.AmbientLight(0x0a1030, 0.55);
        scene.add(ambLight);

        // --- 4. RESPONSIVE COMPOSITION & POSITIONING ---
        let basePosY = 2.2;
        function updatePlanetLayout() {
            const width = window.innerWidth;
            if (width < 768) {
                // Mobile: centered in upper hero background so text remains 100% legible
                basePosY = 9.2;
                planetGroup.position.set(0, basePosY, -8);
                planetGroup.scale.set(0.70, 0.70, 0.70);
            } else if (width < 992) {
                // Tablet: slightly offset to right
                basePosY = 4.0;
                planetGroup.position.set(11, basePosY, -3);
                planetGroup.scale.set(0.85, 0.85, 0.85);
            } else {
                // Desktop: complements hero content, framing avatar on right side
                basePosY = 2.2;
                planetGroup.position.set(16.5, basePosY, 0);
                planetGroup.scale.set(1.0, 1.0, 1.0);
            }
        }
        updatePlanetLayout();

        // --- 5. INTERACTIONS: MOUSE PARALLAX & SCROLL DYNAMICS ---
        const mouse = { x: 0, y: 0 };
        window.addEventListener("mousemove", (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // --- 6. ANIMATION LOOP ---
        let animationFrameId = null;
        let clock = new THREE.Clock();

        function animateSpaceScene() {
            const delta = Math.min(clock.getDelta(), 0.1);
            const time = clock.getElapsedTime();

            if (!prefersReducedMotion) {
                // Planet & Rings continuous smooth rotation
                planetMesh.rotation.y += 0.0028;
                gyroRing.rotation.z += 0.0035;
                primaryRing.rotation.z -= 0.0008;

                // Move satellites along orbital path
                const satPosArr = satGeo.attributes.position.array;
                for (let i = 0; i < satelliteCount; i++) {
                    satAngles[i] += satSpeeds[i];
                    satPosArr[i * 3] = Math.cos(satAngles[i]) * satRadii[i];
                    satPosArr[i * 3 + 1] = Math.sin(satAngles[i]) * satRadii[i];
                }
                satGeo.attributes.position.needsUpdate = true;

                // Natural forward-motion universe flight
                const warpArr = warpGeo.attributes.position.array;
                const starSpeed = 0.36;
                for (let i = 0; i < warpCount; i++) {
                    warpArr[i * 3 + 2] += starSpeed;
                    if (warpArr[i * 3 + 2] > camera.position.z + 30) {
                        warpArr[i * 3 + 2] = -650;
                        warpArr[i * 3] = (Math.random() - 0.5) * 550;
                        warpArr[i * 3 + 1] = (Math.random() - 0.5) * 400;
                    }
                }
                warpGeo.attributes.position.needsUpdate = true;

                // Slow subtle celestial drift
                deepStarfield.rotation.y -= 0.0003;
                nebulaGroup.rotation.z = Math.sin(time * 0.05) * 0.04;
            }

            // Mouse parallax with smooth camera damping
            const targetCamX = mouse.x * 3.2;
            const targetCamY = mouse.y * 2.2;
            camera.position.x += (targetCamX - camera.position.x) * 0.045;
            camera.position.y += (targetCamY - camera.position.y) * 0.045;

            // Scroll parallax: smoothly changes camera angle and planet elevation
            const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
            const scrollFraction = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
            if (!prefersReducedMotion) {
                planetGroup.position.y = basePosY + (scrollFraction * 12);
                planetGroup.rotation.y = scrollFraction * Math.PI * 1.5;
            }

            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animateSpaceScene);
        }

        // --- 7. EVENT LISTENERS & RESOURCE OPTIMIZATION ---
        window.addEventListener("resize", () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            updatePlanetLayout();
        });

        // Tab visibility pause to preserve battery and GPU
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                clock.start();
                animationFrameId = requestAnimationFrame(animateSpaceScene);
            }
        });

        if (prefersReducedMotion) {
            renderer.render(scene, camera);
        } else {
            animateSpaceScene();
        }
    }
    init3DSpaceUniverse();


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