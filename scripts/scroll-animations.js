import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations(sceneControls, lenis) {
    const { model, camera, scene } = sceneControls;

    // --- 1. Initial Intro Animation ---
    // Float the phone in
    gsap.from(model.position, {
        y: -10,
        duration: 2,
        ease: 'power3.out'
    });
    // Text reveal
    gsap.from('.hero-title span', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5
    });

    // --- 2. Scroll Interaction (The Core Logic) ---
    // Responsive Animations using gsap.matchMedia()
    let mm = gsap.matchMedia();

    // --- DESKTOP (Width >= 800px) ---
    mm.add("(min-width: 800px)", () => {
        // Initial State
        model.scale.set(1, 1, 1);

        const scrollTL = gsap.timeline({
            scrollTrigger: {
                trigger: '.scroll-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5
            }
        });

        // Hero -> Features: Rotate to side
        scrollTL.to(model.rotation, { y: Math.PI * 0.5, x: 0.2, duration: 1 }, 'feature start')
            .to(model.position, { x: 1.5, z: -2, duration: 1 }, 'feature start')
            // Features -> Experience
            .to(model.rotation, { y: Math.PI, x: 0, duration: 1 }, 'experience')
            .to(model.position, { x: 0, z: 0, duration: 1 }, 'experience')
            // Experience -> Gallery
            .to(model.rotation, { y: Math.PI * 2, duration: 1 }, 'gallery')
            .to(model.position, { y: 0, scale: 0.8, duration: 1 }, 'gallery');
    });

    // --- MOBILE (Width < 800px) ---
    mm.add("(max-width: 799px)", () => {
        // Initial State: Smaller for mobile
        model.scale.set(0.7, 0.7, 0.7);
        model.position.set(0, 0, 0);

        const scrollTL = gsap.timeline({
            scrollTrigger: {
                trigger: '.scroll-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5
            }
        });

        // Hero -> Features: Move phone slightly right and DEEP back to act as background
        scrollTL.to(model.rotation, { y: Math.PI * 0.25, x: 0.1, duration: 1 }, 'feature start')
            .to(model.position, { x: 1, y: 1, z: -5, duration: 1 }, 'feature start') // Move up and back
            // Features -> Experience: Bring back center but small
            .to(model.rotation, { y: Math.PI, x: 0, duration: 1 }, 'experience')
            .to(model.position, { x: 0, y: 0.5, z: 0, duration: 1 }, 'experience')
            // Experience -> Gallery
            .to(model.rotation, { y: Math.PI * 2, duration: 1 }, 'gallery')
            .to(model.position, { y: -1, scale: 0.6, duration: 1 }, 'gallery');
    });


    // --- 3. UI Element Animations ---

    // Feature Cards Stagger (Updated with Crazy Tilt)
    // Feature Cards Stagger (Updated with Stunning Pop-in)
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features',
            start: 'top 70%', // Start earlier
            toggleActions: 'play none none reverse'
        },
        y: 100,
        scale: 0.9,
        rotationX: -15, // Tilt back
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'back.out(1.2)' // Pop effect
    });

    // Parallax Effect for Experience Section (Background vs Content)
    gsap.to('.experience-text', {
        scrollTrigger: {
            trigger: '.experience',
            start: 'top bottom',
            scrub: true
        },
        y: -50,
        ease: 'none'
    });

    // --- 4. Micro-Interactions (Tilt on Move) ---
    // Subtle Camera Parallax
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        // Move camera slightly opposite to mouse
        gsap.to(camera.position, {
            x: x * 0.5,
            y: -y * 0.5,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Update ScrollTrigger when Lenis scrolls
    // lenis.on('scroll', ScrollTrigger.update); 
}
