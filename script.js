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
       3. INTERACTIVE NEURAL CONSTELLATION CANVAS
       ===================================================== */
    const canvas = document.getElementById("neural-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationFrameId = null;

        const mouse = {
            x: null,
            y: null,
            radius: 140
        };

        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                    }
                }
            }

            draw() {
                const isLight = document.body.classList.contains("light-mode");
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isLight ? "rgba(124, 58, 237, 0.45)" : "rgba(6, 182, 212, 0.75)";
                ctx.fill();
            }
        }

        let particles = [];
        function initParticles() {
            particles = [];
            const count = Math.min(55, Math.floor((width * height) / 22000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            const isLight = document.body.classList.contains("light-mode");

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 115) {
                        const alpha = (1 - dist / 115) * (isLight ? 0.25 : 0.45);
                        ctx.beginPath();
                        ctx.strokeStyle = isLight
                            ? `rgba(124, 58, 237, ${alpha})`
                            : `rgba(167, 139, 250, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.55;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animateCanvas);
        }

        // Pause animation when tab is inactive to preserve CPU
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animationFrameId = requestAnimationFrame(animateCanvas);
            }
        });

        // Respect reduced motion
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            animateCanvas();
        }
    }


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