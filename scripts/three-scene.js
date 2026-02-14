import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { gsap } from 'gsap';

export function initThreeScene() {
    const canvas = document.querySelector('#webgl-canvas');

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap at 1.5 for performance on mobile
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const blueSpot = new THREE.SpotLight(0x00f2ea, 10);
    blueSpot.position.set(-5, 0, 5);
    blueSpot.lookAt(0, 0, 0);
    scene.add(blueSpot);

    const purpleSpot = new THREE.SpotLight(0xff0050, 10);
    purpleSpot.position.set(5, -5, 5);
    purpleSpot.lookAt(0, 0, 0);
    scene.add(purpleSpot);

    // --- Starfield Particles ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Spread particles wide
        posArray[i] = (Math.random() - 0.5) * 25;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- Definitions ---
    const colors = {
        'deeppurple': { frame: 0x3b3141, back: 0x4a3b52, accent: 0x6e5c75 },
        'gold': { frame: 0xfae7cf, back: 0xf5e1c8, accent: 0xffd700 },
        'silver': { frame: 0xf5f5f5, back: 0xffffff, accent: 0xe0e0e0 },
        'spaceblack': { frame: 0x1b1b1b, back: 0x222222, accent: 0x333333 }
    };

    // --- Materials (Default: Silver) ---
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: colors.silver.frame,
        metalness: 1.0,
        roughness: 0.1,
        envMapIntensity: 2.5
    });

    const backMaterial = new THREE.MeshStandardMaterial({
        color: colors.silver.back,
        metalness: 0.1,
        roughness: 0.5
    });

    const ringMaterial = new THREE.MeshStandardMaterial({
        color: colors.silver.frame,
        metalness: 1.0,
        roughness: 0.1
    });

    const innerLensMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.0 });


    // --- Apple Logo Helper (High Fidelity) ---
    function drawAppleLogo(ctx, x, y, scale, color) {
        ctx.fillStyle = color;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        ctx.beginPath();
        // Offset to center the path roughly
        const offX = -12;
        const offY = -15;

        // Leaf
        ctx.moveTo(12 + offX, 5 + offY);
        ctx.bezierCurveTo(12 + offX, 5 + offY, 10 + offX, 12 + offY, 5 + offX, 12 + offY);
        ctx.bezierCurveTo(9 + offX, 7 + offY, 12 + offX, 0 + offY, 12 + offX, 0 + offY);
        ctx.bezierCurveTo(12 + offX, 0 + offY, 15 + offX, 3 + offY, 15 + offX, 8 + offY);
        ctx.bezierCurveTo(15 + offX, 8 + offY, 15 + offX, 9 + offY, 12 + offX, 5 + offY);
        ctx.fill();

        // Apple Body using SVG path data approximation
        ctx.beginPath();
        ctx.moveTo(12.2 + offX, 14 + offY); // Top of body (right side before bite)
        ctx.bezierCurveTo(10 + offX, 14 + offY, 8 + offX, 16 + offY, 5 + offX, 16 + offY); // Top Left curve (start)
        ctx.bezierCurveTo(-2 + offX, 16 + offY, -6 + offX, 22 + offY, -6 + offX, 30 + offY); // Left side
        ctx.bezierCurveTo(-6 + offX, 39 + offY, -1 + offX, 48 + offY, 5 + offX, 48 + offY); // Bottom Left
        ctx.bezierCurveTo(7 + offX, 48 + offY, 9 + offX, 46 + offY, 12 + offX, 46 + offY); // Bottom Left-Center
        ctx.bezierCurveTo(15 + offX, 46 + offY, 17 + offX, 48 + offY, 20 + offX, 48 + offY); // Bottom Right-Center
        ctx.bezierCurveTo(25 + offX, 48 + offY, 29 + offX, 41 + offY, 29 + offX, 35 + offY); // Bottom Right
        ctx.bezierCurveTo(29 + offX, 34 + offY, 25 + offX, 31 + offY, 25 + offX, 27 + offY); // Right bite curve start
        ctx.bezierCurveTo(25 + offX, 22 + offY, 29 + offX, 20 + offY, 30 + offX, 19 + offY); // Right bite curve end
        ctx.bezierCurveTo(28 + offX, 16 + offY, 26 + offX, 14 + offY, 22 + offX, 14 + offY); // Top Right
        ctx.bezierCurveTo(20 + offX, 14 + offY, 18 + offX, 16 + offY, 16 + offX, 16 + offY); // Bite indent top
        ctx.bezierCurveTo(14 + offX, 16 + offY, 13 + offX, 14 + offY, 12.2 + offX, 14 + offY); // Close loop
        ctx.fill();

        ctx.restore();
    }

    // --- Screen Texture (Front) ---
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const ctx = screenCanvas.getContext('2d');

    function drawScreen(logoColor = '#ffffff') {
        // Gradient BG
        const gradient = ctx.createLinearGradient(0, 0, 512, 1024);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 1024);

        // Draw Apple Logo centered
        drawAppleLogo(ctx, 256, 512, 5, logoColor);

        if (screenTexture) screenTexture.needsUpdate = true;
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    drawScreen(); // Init

    const screenMaterial = new THREE.MeshStandardMaterial({
        map: screenTexture,
        metalness: 0.5,
        roughness: 0.2,
        emissive: 0xffffff,
        emissiveMap: screenTexture,
        emissiveIntensity: 0.15
    });

    // --- Back Logo Texture (Decal) ---
    // We'll create a dedicated plane for the logo on the back
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 256; logoCanvas.height = 256;
    const lCtx = logoCanvas.getContext('2d');
    lCtx.clearRect(0, 0, 256, 256);
    drawAppleLogo(lCtx, 128, 128, 3.5, '#ffffff'); // White Logo

    const logoTexture = new THREE.CanvasTexture(logoCanvas);
    const logoPlaneMat = new THREE.MeshStandardMaterial({
        map: logoTexture,
        transparent: true,
        metalness: 1.0, // Metallic to shine like mirror
        roughness: 0.1,
        color: 0xdddddd
    });


    // --- iPhone Model Group ---
    const mainGroup = new THREE.Group(); // This will be moved by ScrollTrigger
    scene.add(mainGroup);

    const iPhoneGroup = new THREE.Group(); // This will float/spin locally
    mainGroup.add(iPhoneGroup);
    // Float Animation
    gsap.to(iPhoneGroup.position, {
        y: 0.15,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
    });

    // 1. Frame
    const frameGeometry = new RoundedBoxGeometry(3.6, 7.2, 0.4, 4, 0.5);
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    iPhoneGroup.add(frame);

    // 2. Screen
    const screenGeometry = new RoundedBoxGeometry(3.4, 7.0, 0.02, 4, 0.4);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.21;
    iPhoneGroup.add(screen);

    // 3. Back Plate
    const backPlateGeom = new RoundedBoxGeometry(3.4, 7.0, 0.02, 4, 0.4);
    const backPlate = new THREE.Mesh(backPlateGeom, backMaterial);
    backPlate.position.z = -0.211;
    backPlate.rotation.y = Math.PI;
    iPhoneGroup.add(backPlate);

    // 3b. Back Logo
    const logoPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), logoPlaneMat);
    logoPlane.position.set(0, 0.5, -0.222); // Slightly above back plate
    logoPlane.rotation.y = Math.PI;
    iPhoneGroup.add(logoPlane);

    // 4. Camera Bump
    const bumpGeometry = new RoundedBoxGeometry(1.6, 1.6, 0.1, 4, 0.3);
    const bump = new THREE.Mesh(bumpGeometry, backMaterial);
    bump.position.set(0.8, 2.4, -0.24);
    iPhoneGroup.add(bump);

    // 5. Lenses
    const lensGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 32);
    function addLens(x, y, z) {
        const l = new THREE.Mesh(lensGeometry, ringMaterial);
        l.position.set(x, y, z);
        l.rotation.x = Math.PI / 2;
        iPhoneGroup.add(l);
        const l_in = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.16, 32), innerLensMaterial);
        l_in.position.copy(l.position); l_in.rotation.x = Math.PI / 2; iPhoneGroup.add(l_in);
    }
    // Silver Triangle Layout
    addLens(0.4, 2.8, -0.32);
    addLens(0.4, 2.0, -0.32);
    addLens(1.2, 2.4, -0.32);


    // --- Interaction Logic ---
    window.changeTheme = (colorName) => {
        const c = colors[colorName];
        if (!c) return;

        console.log('Changing theme to:', colorName);

        // Animate Color Change
        gsap.to(frameMaterial.color, { r: new THREE.Color(c.frame).r, g: new THREE.Color(c.frame).g, b: new THREE.Color(c.frame).b, duration: 0.5 });
        gsap.to(backMaterial.color, { r: new THREE.Color(c.back).r, g: new THREE.Color(c.back).g, b: new THREE.Color(c.back).b, duration: 0.5 });
        gsap.to(ringMaterial.color, { r: new THREE.Color(c.frame).r, g: new THREE.Color(c.frame).g, b: new THREE.Color(c.frame).b, duration: 0.5 });

        // Crazy Spin
        const currentY = iPhoneGroup.rotation.y;
        gsap.to(iPhoneGroup.rotation, {
            y: currentY + Math.PI * 2,
            duration: 1.2,
            ease: 'back.out(2)' // Crazy overshoot
        });

        // Pulse Scale
        gsap.timeline()
            .to(iPhoneGroup.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.2 })
            .to(iPhoneGroup.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    };

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate Particles
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;

        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, model: mainGroup };
}
