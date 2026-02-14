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
    // Create a timeline that spans the entire scroll height
    const scrollTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.scroll-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5 // Smooth catch-up
        }
    });

    // Rotation Sequence
    // Hero -> Features: Rotate to side
    scrollTL.to(model.rotation, {
        y: Math.PI * 0.5, // 90 deg
        x: 0.2, // Slight tilt
        duration: 1 // Relative duration
    }, 'feature start')

        // Move phone to side to make room for cards
        .to(model.position, {
            x: 1.5, // Move right
            z: -2, // Move back slightly
            duration: 1
        }, 'feature start')

        // Features -> Experience: Rotate to back
        .to(model.rotation, {
            y: Math.PI, // 180 deg (Back)
            x: 0,
            duration: 1
        }, 'experience')

        .to(model.position, {
            x: 0, // Center again
            z: 0,
            duration: 1
        }, 'experience')

        // Experience -> Gallery: Front again but spin
        .to(model.rotation, {
            y: Math.PI * 2,
            duration: 1
        }, 'gallery')

        .to(model.position, {
            y: 0,
            scale: 0.8, // Zoom out slightly
            duration: 1
        }, 'gallery');


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
