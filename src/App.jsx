import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Authentic project assets located under public/
const VIDEO_SRC = '/videos/khaosan-tropical.mp4';
const POSTER_SRC = '/images/poster.jpg';
const LOGO_SRC = '/images/khaosan-logo.png';
const ARTWORK_CARD_SRC = '/images/khaosan-artwork-card.jpg';
const COMPANY_CARD_SRC = '/images/khaosan-company-card.jpg';
const GALLERY_HORIZON_SRC = '/images/gallery-tropical-horizon.jpg';
const GALLERY_PALM_SRC = '/images/gallery-palm-breeze.jpg';
const GALLERY_SAND_SRC = '/images/gallery-golden-sand.jpg';

// Video timing constants from frame-level analysis:
// 0.0s - 0.35s: Warm-beige opening frame.
// 0.35s - 1.85s: Video reveal of the tropical beach scene & leaf entrance.
// 2.0s - 7.8s: Established tropical beach scene with green leaves swaying naturally.
const LOOP_START = 2.0;
const LOOP_END = 7.8;

export default function App() {
  const [isTransitionDone, setIsTransitionDone] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // References for animation coordination
  const floatingLogoRef = useRef(null);
  const headerLogoTargetRef = useRef(null);
  const videoRef = useRef(null);
  const watermarkMaskRef = useRef(null);
  const loaderContainerRef = useRef(null);
  const animStartedRef = useRef(false);

  // Opening animation: Centered logo smoothly transitions into the header logo position
  const runOpeningAnimation = () => {
    if (animStartedRef.current) return;
    animStartedRef.current = true;

    // 1. Immediately fade out interactive loader capsule
    gsap.to('.opening-loader', {
      opacity: 0,
      y: 12,
      duration: 0.35,
      ease: 'power2.in',
    });

    // 2. Smoothly decrease opacity of watermark camouflage mask as tropical beach footage reveals
    gsap.to('.watermark-camouflage', {
      opacity: 0,
      duration: 1.4,
      delay: 0.35,
      ease: 'power2.out',
    });

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsTransitionDone(true);
      return;
    }

    const floatingEl = floatingLogoRef.current;
    const targetEl = headerLogoTargetRef.current;

    if (!floatingEl || !targetEl) {
      setIsTransitionDone(true);
      return;
    }

    // Measure exact geometry
    const targetRect = targetEl.getBoundingClientRect();
    const currentRect = floatingEl.getBoundingClientRect();

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const currentCenterX = currentRect.left + currentRect.width / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;

    const deltaX = targetCenterX - currentCenterX;
    const deltaY = targetCenterY - currentCenterY;
    const scaleFactor = targetRect.width / currentRect.width;

    const tl = gsap.timeline({
      delay: 0.35, // Align precisely with video reveal
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        setIsTransitionDone(true);
      },
    });

    // Animate floating logo into the exact header logo slot
    tl.to(floatingEl, {
      x: deltaX,
      y: deltaY,
      scale: scaleFactor,
      duration: 1.6,
      force3D: true,
    })
      // Reveal header navigation links & booking CTA as logo approaches destination
      .to(
        '.header-fade-in',
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.6'
      )
      // Reveal hero headline, copy, and booking buttons
      .to(
        '.hero-fade-in',
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power2.out',
        },
        '-=0.7'
      );
  };

  // Safe playback start
  const startPlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = true;
      await video.play();
      setAutoplayBlocked(false);
      runOpeningAnimation();
    } catch (err) {
      console.warn('Autoplay restricted by browser policy:', err);
      setAutoplayBlocked(true);
      runOpeningAnimation();
    }
  };

  // Interactive entry click handler (allows user to immediately explore anytime)
  const handleInteractiveEnter = () => {
    if (animStartedRef.current) return;
    setLoadProgress(100);
    setIsVideoLoaded(true);
    startPlayback();
  };

  // Video loading & buffering lifecycle with interactive progress coordination
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const handleTimeUpdate = () => {
      // Loop the established tropical swaying scene once the initial opening has completed
      if (video.currentTime >= LOOP_END) {
        video.currentTime = LOOP_START;
      }
    };

    let progressTimer = null;
    let autoStartTimer = null;
    let currentPct = 0;

    const getBufferPct = () => {
      if (video.buffered.length > 0 && video.duration > 0) {
        const end = video.buffered.end(video.buffered.length - 1);
        return Math.round((end / video.duration) * 100);
      }
      return 0;
    };

    // Smooth progress timer coordinating with real buffering state
    progressTimer = setInterval(() => {
      if (animStartedRef.current) {
        clearInterval(progressTimer);
        return;
      }

      const bufferPct = getBufferPct();
      let target = Math.max(bufferPct, 35);

      if (video.readyState >= 3) {
        target = 100;
      } else if (video.readyState >= 2) {
        target = Math.max(target, 80);
      }

      if (currentPct < target) {
        currentPct += Math.max(1, Math.round((target - currentPct) * 0.22));
      }

      if (currentPct >= 100 && (video.readyState >= 3 || bufferPct >= 80)) {
        currentPct = 100;
        setLoadProgress(100);
        setIsVideoLoaded(true);
        clearInterval(progressTimer);

        // Auto-start once loaded after a brief satisfying pause
        autoStartTimer = setTimeout(() => {
          if (!animStartedRef.current) {
            startPlayback();
          }
        }, 500);
      } else {
        setLoadProgress(Math.min(96, currentPct));
      }
    }, 45);

    const handleCanPlay = () => {
      if (video.readyState >= 3) {
        setIsVideoLoaded(true);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('canplay', handleCanPlay);

    if (video.readyState >= 3) {
      setIsVideoLoaded(true);
    }

    // Visibility change handling
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        if (video.currentTime < LOOP_START || video.currentTime >= LOOP_END) {
          video.currentTime = LOOP_START;
        }
        video.play().catch(console.warn);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(autoStartTimer);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (floatingLogoRef.current) {
        gsap.killTweensOf(floatingLogoRef.current);
      }
      gsap.killTweensOf('.opening-loader');
      gsap.killTweensOf('.watermark-camouflage');
      gsap.killTweensOf('.header-fade-in');
      gsap.killTweensOf('.hero-fade-in');
    };
  }, []);

  // Track scroll position to ensure sticky header displays beautifully on manual scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
        gsap.set('.header-fade-in', { opacity: 1, y: 0 });
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Copy address to clipboard helper for travelers
  const handleCopyAddress = () => {
    const addressText = '92 Soi Rambutri, Talat Yot, Phra Nakhon, Bangkok 10200';
    navigator.clipboard.writeText(addressText).then(() => {
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 3000);
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F5EE] text-[#16373F] font-sans antialiased selection:bg-[#E7D4B3] selection:text-[#16373F]">
      {/* =========================================================================
          1. HEADER (Boutique Deep Tropical Green with Warm Beige Accents & Navigation)
          ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isTransitionDone || isScrolled
            ? 'bg-[#16373F]/95 backdrop-blur-md border-b border-[#E7D4B3]/30 shadow-lg shadow-[#16373F]/20'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Header Brand Area (Target for opening logo animation) */}
          <a
            href="#top"
            className="flex items-center gap-3.5 group cursor-pointer"
            aria-label="The Khaosan Poshtel - Back to top"
          >
            {/* Target logo container slot */}
            <div
              ref={headerLogoTargetRef}
              className="relative w-12 h-12 sm:w-13 sm:h-13 flex-shrink-0 flex items-center justify-center"
            >
              {/* Actual image asset revealed once transition completes */}
              <img
                src={LOGO_SRC}
                alt="The Khaosan Poshtel"
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  isTransitionDone || isScrolled ? 'opacity-100' : 'opacity-0'
                }`}
                draggable={false}
              />
            </div>

            {/* Brand Typography */}
            <div
              className={`flex flex-col transition-opacity duration-500 ${
                isTransitionDone || isScrolled ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="font-display font-bold tracking-wider text-base sm:text-lg text-[#E7D4B3] leading-tight group-hover:text-[#FAF8F5] transition-colors">
                THE KHAOSAN POSHTEL
              </span>
              <span className="font-sans text-[10px] tracking-widest uppercase text-[#E7D4B3]/75 font-medium">
                Bangkok · Boutique Hostel
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {['About', 'Stay', 'Experience', 'Location', 'Gallery'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="header-fade-in opacity-0 font-medium text-sm tracking-wide text-[#E7D4B3]/85 hover:text-[#FAF8F5] transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E7D4B3] hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Header CTA Button */}
          <div className="hidden md:flex items-center">
            <a
              href="#book"
              className="header-fade-in opacity-0 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#E7D4B3] text-[#16373F] text-sm font-semibold tracking-wide shadow-sm hover:bg-[#FAF8F5] hover:shadow-md active:scale-98 transition-all duration-200"
            >
              Book Your Stay
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg text-[#E7D4B3] hover:bg-[#E7D4B3]/15 transition-all ${
              isTransitionDone || isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#16373F] border-b border-[#E7D4B3]/30 px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col space-y-4">
              {['About', 'Stay', 'Experience', 'Location', 'Gallery'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display font-medium text-base text-[#E7D4B3] hover:text-[#FAF8F5] py-2 border-b border-[#E7D4B3]/15"
                >
                  {item}
                </a>
              ))}
              <div className="pt-3">
                <a
                  href="#book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#E7D4B3] text-[#16373F] text-sm font-semibold tracking-wide shadow-md hover:bg-[#FAF8F5]"
                >
                  Book Your Stay
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          OPENING FLOATING LOGO & INTERACTIVE LUXURY LOADER
          ========================================================================= */}
      {!isTransitionDone && !isScrolled && (
        <div
          onClick={handleInteractiveEnter}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 cursor-pointer"
        >
          {/* Centered Logo Emblem */}
          <div
            ref={floatingLogoRef}
            className="w-[280px] sm:w-[360px] md:w-[420px] max-w-[82vw] h-auto will-change-transform group transition-transform duration-300 hover:scale-102"
            style={{
              filter: 'drop-shadow(0 14px 30px rgba(22, 55, 63, 0.28)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))',
            }}
            title="Click anywhere to enter The Khaosan Poshtel"
          >
            <img
              src={LOGO_SRC}
              alt="The Khaosan Poshtel Opening Emblem"
              className="w-full h-auto object-contain select-none pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Interactive Luxury Loading Capsule */}
          <div
            ref={loaderContainerRef}
            className="opening-loader mt-8 flex flex-col items-center select-none"
            onClick={(e) => {
              e.stopPropagation();
              handleInteractiveEnter();
            }}
          >
            <button
              type="button"
              className="group relative flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#16373F]/90 backdrop-blur-md border border-[#E7D4B3]/40 shadow-xl hover:bg-[#16373F] hover:border-[#E7D4B3] hover:scale-103 active:scale-98 transition-all duration-300 cursor-pointer"
            >
              {/* Spinner or ready indicator */}
              <div className="relative w-5 h-5 flex items-center justify-center">
                {loadProgress < 100 ? (
                  <svg className="w-5 h-5 animate-spin text-[#E7D4B3]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E7D4B3] group-hover:scale-125 transition-transform" />
                )}
              </div>

              {/* Status Text & Progress */}
              <div className="flex flex-col text-left">
                <span className="font-sans text-xs tracking-wider font-semibold text-[#E7D4B3] uppercase">
                  {loadProgress < 100 ? `Loading Sanctuary · ${loadProgress}%` : 'Enter The Poshtel →'}
                </span>
                <span className="text-[10px] text-[#E7D4B3]/75 font-normal">
                  {loadProgress < 100 ? 'Preparing your tropical retreat' : 'Click anywhere to begin'}
                </span>
              </div>
            </button>

            {/* Fine Golden Progress Line */}
            <div className="w-48 sm:w-56 h-1 mt-3 bg-[#16373F]/30 backdrop-blur-sm rounded-full overflow-hidden border border-[#E7D4B3]/20">
              <div
                className="h-full bg-gradient-to-r from-[#E7D4B3] via-[#FAF8F5] to-[#E7D4B3] transition-all duration-300 rounded-full"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. HERO SECTION (Full-bleed tropical video, balanced composition, welcoming copy)
          ========================================================================= */}
      <section
        id="top"
        className="relative w-full h-screen min-h-[640px] flex items-end justify-center overflow-hidden bg-[#E7D4B3] pt-20"
      >
        {/* Full-bleed background video without decorative zoom or transform */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          className="hero-video absolute inset-0 z-0 pointer-events-none select-none"
        />

        {/* Camouflage block over Gemini watermark during full-screen opening */}
        <div
          ref={watermarkMaskRef}
          className="watermark-camouflage absolute pointer-events-none z-10"
          style={{
            right: '5%',
            bottom: '10%',
            width: '240px',
            height: '170px',
            background: 'radial-gradient(ellipse at center, #E4D0AD 0%, #E4D0AD 55%, rgba(228, 208, 173, 0) 100%)',
            opacity: isTransitionDone ? 0 : 1,
            transition: 'opacity 1.2s ease-out',
          }}
          aria-hidden="true"
        />

        {/* Static poster fallback for reduced motion preference */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none hidden motion-reduce:block"
          style={{ backgroundImage: `url(${POSTER_SRC})` }}
        />

        {/* Gentle natural gradient overlay to ensure text readability while keeping beach scene clear */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(248, 245, 238, 0.1) 0%, rgba(22, 55, 63, 0.0) 30%, rgba(22, 55, 63, 0.5) 80%, rgba(22, 55, 63, 0.75) 100%)',
          }}
        />

        {/* Hero Foreground Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 text-center flex flex-col items-center">
          <div className="hero-fade-in opacity-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/85 backdrop-blur-sm border border-[#E7D4B3]/60 mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#2A5542] animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#16373F]">
              Soi Rambuttri · Bangkok
            </span>
          </div>

          <h1 className="hero-fade-in opacity-0 font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F8F5EE] drop-shadow-md max-w-3xl leading-[1.15]">
            A Tropical Sanctuary in Old Town Bangkok
          </h1>

          <p className="hero-fade-in opacity-0 mt-4 sm:mt-5 text-base sm:text-lg text-[#F8F5EE]/90 max-w-2xl font-normal leading-relaxed drop-shadow-sm">
            Where island serenity meets Bangkok’s historic pulse. Experience thoughtful boutique comfort, lush palm-framed relaxation, and vibrant community steps from Khaosan Road.
          </p>

          <div className="hero-fade-in opacity-0 mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="#book"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E7D4B3] text-[#16373F] font-semibold text-sm tracking-wide shadow-lg hover:bg-[#F2ECE1] hover:scale-102 active:scale-98 transition-all duration-200"
            >
              Book Your Stay
            </a>
            <a
              href="#about"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/20 backdrop-blur-md text-[#F8F5EE] border border-white/40 font-medium text-sm tracking-wide hover:bg-white/30 transition-all duration-200"
            >
              Explore The Poshtel
            </a>
          </div>
        </div>

        {/* Autoplay fallback control */}
        {autoplayBlocked && (
          <div className="absolute top-28 right-6 z-30">
            <button
              onClick={startPlayback}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#16373F]/90 text-[#F8F5EE] border border-[#E7D4B3]/40 text-xs font-medium shadow-md hover:bg-[#16373F]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Play Video</span>
            </button>
          </div>
        )}

        {/* Downward scroll indicator */}
        <a
          href="#about"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-[#F8F5EE]/70 hover:text-[#F8F5EE] transition-colors p-2"
          aria-label="Scroll to About section"
        >
          <svg className="w-5 h-5 animate-bounce stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/* =========================================================================
          3. ABOUT SECTION (Authentic boutique hospitality & tropical identity)
          ========================================================================= */}
      <section id="about" className="py-24 sm:py-32 bg-[#F8F5EE] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column: Authentic Artwork Card */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-[#F2ECE1] border border-[#E7D4B3]/60 group">
                <img
                  src={ARTWORK_CARD_SRC}
                  alt="The Khaosan Poshtel Emblem on textured paper"
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-500"
                />
                <div className="p-6 bg-[#FFFFFF]/90 backdrop-blur-xs border-t border-[#E7D4B3]/40">
                  <p className="font-display font-semibold text-sm text-[#16373F]">
                    The Khaosan Poshtel Brand Artwork
                  </p>
                  <p className="text-xs text-[#63787D] mt-1">
                    Celebrating tropical travel, freedom, and communal warmth in Phra Nakhon.
                  </p>
                </div>
              </div>
            </div>

            {/* Text Narrative Column */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-3">
                Boutique Hospitality & Island Ease
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#16373F] leading-tight">
                Where Bangkok’s Historic Soul Meets Tropical Serenity
              </h2>
              <div className="w-16 h-1 bg-[#E7D4B3] mt-5 mb-8 rounded-full" />

              <p className="text-base sm:text-lg text-[#16373F]/80 leading-relaxed font-normal mb-6">
                Nestled along the tree-lined pedestrian pathway of Soi Rambuttri, just moments from the world-famous Khaosan Road, <strong>The Khaosan Poshtel</strong> redefines boutique hostel living. We offer travelers an oasis of calm—warm sand tones, natural greenery, and thoughtful design that lets you recharge between Bangkok adventures.
              </p>

              <p className="text-base text-[#16373F]/75 leading-relaxed font-normal mb-10">
                Operated by <strong>RK Hospitality Company Limited</strong>, our poshtel is built around hospitality, comfort, and community. Whether returning from ancient riverside temples or exploring lively night markets, you will find a relaxed haven to share stories, unwind, and feel right at home.
              </p>

              {/* Three Core Brand Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E7D4B3]/50">
                <div>
                  <h3 className="font-display font-semibold text-base text-[#16373F] mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E7D4B3]" />
                    Tropical Calm
                  </h3>
                  <p className="text-xs text-[#63787D] leading-relaxed">
                    Warm woods, sand palettes, and airy spaces designed for peaceful restoration.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-[#16373F] mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2A5542]" />
                    Social Spirit
                  </h3>
                  <p className="text-xs text-[#63787D] leading-relaxed">
                    Inviting communal spaces that inspire connection and shared exploration.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-[#16373F] mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D96B50]" />
                    Old Town Heart
                  </h3>
                  <p className="text-xs text-[#63787D] leading-relaxed">
                    Prime Rambuttri address steps from cultural landmarks, street food, and river ferries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. STAY SECTION (Inviting accommodation grounded only in confirmed details)
          ========================================================================= */}
      <section id="stay" className="py-24 sm:py-32 bg-[#F2ECE1] border-y border-[#E7D4B3]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-3">
              Accommodation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#16373F]">
              Thoughtfully Designed Rest
            </h2>
            <div className="w-16 h-1 bg-[#16373F] mx-auto mt-4 mb-6 rounded-full" />
            <p className="text-base text-[#16373F]/80 leading-relaxed font-normal">
              Every space at The Khaosan Poshtel is crafted to balance restful privacy with a welcoming social atmosphere. Natural textures, crisp linens, and modern boutique amenities ensure restorative sleep in the center of Bangkok.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Private Room Card */}
            <div className="bg-[#FFFFFF] rounded-2xl p-8 sm:p-10 shadow-soft border border-[#E7D4B3]/50 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7D4B3]/40 text-[#16373F] text-xs font-semibold mb-6">
                  Private Sanctuary
                </div>
                <h3 className="font-display text-2xl font-bold text-[#16373F] mb-3">
                  Boutique Private Rooms
                </h3>
                <p className="text-sm text-[#16373F]/75 leading-relaxed mb-6 font-normal">
                  Serene private rooms curated for couples, solo travelers, and digital wanderers seeking calm solitude after days exploring Bangkok. Finished with warm sand tones, clean lines, and peaceful natural light.
                </p>
                <ul className="space-y-3 mb-8 text-xs text-[#16373F]/85 font-medium">
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Individual climate control & air-conditioning
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Ensuite private bathroom with hot rain shower
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Crisp hotel-grade linens and plush pillows
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    High-speed Wi-Fi and dedicated charging points
                  </li>
                </ul>
              </div>
              <a
                href="#book"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#16373F] text-[#F8F5EE] text-sm font-medium hover:bg-[#2A5542] transition-colors"
              >
                Inquire for Private Rooms
              </a>
            </div>

            {/* Social Pod Dormitory Card */}
            <div className="bg-[#FFFFFF] rounded-2xl p-8 sm:p-10 shadow-soft border border-[#E7D4B3]/50 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#2A5542]/15 text-[#2A5542] text-xs font-semibold mb-6">
                  Social & Connected
                </div>
                <h3 className="font-display text-2xl font-bold text-[#16373F] mb-3">
                  Curated Pod Dormitories
                </h3>
                <p className="text-sm text-[#16373F]/75 leading-relaxed mb-6 font-normal">
                  Thoughtfully designed shared dorms engineered for comfort, security, and quiet rest. Each pod provides personal space with dedicated privacy curtains and lockable storage.
                </p>
                <ul className="space-y-3 mb-8 text-xs text-[#16373F]/85 font-medium">
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Custom pod beds with blackout privacy curtains
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Personal reading light and universal power outlets
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Secure under-bed luggage lockers
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Spotless shared bathrooms maintained continuously
                  </li>
                </ul>
              </div>
              <a
                href="#book"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#E7D4B3] text-[#16373F] text-sm font-semibold hover:bg-[#D4BF9A] transition-colors"
              >
                Inquire for Dorm Beds
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. EXPERIENCE AND AMENITIES (Modest, authentic general copy)
          ========================================================================= */}
      <section id="experience" className="py-24 sm:py-32 bg-[#F8F5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-3">
              Life at the Poshtel
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#16373F]">
              Warm Hospitality & Everyday Ease
            </h2>
            <div className="w-16 h-1 bg-[#E7D4B3] mx-auto mt-4 mb-6 rounded-full" />
            <p className="text-base text-[#16373F]/80 leading-relaxed font-normal">
              Designed around effortless travel: relaxed communal spaces, friendly assistance, and the essentials you need to explore Bangkok comfortably.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Amenity 1 */}
            <div className="bg-[#FFFFFF] p-7 rounded-2xl border border-[#E7D4B3]/40 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-[#E7D4B3]/40 flex items-center justify-center mb-5 text-[#16373F]">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#16373F] mb-2">
                Tropical Courtyard
              </h3>
              <p className="text-xs text-[#63787D] leading-relaxed font-normal">
                Breezy open spaces surrounded by natural greenery to read, enjoy morning coffee, or work remotely with reliable Wi-Fi.
              </p>
            </div>

            {/* Amenity 2 */}
            <div className="bg-[#FFFFFF] p-7 rounded-2xl border border-[#E7D4B3]/40 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-[#2A5542]/15 flex items-center justify-center mb-5 text-[#2A5542]">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#16373F] mb-2">
                Social Community
              </h3>
              <p className="text-xs text-[#63787D] leading-relaxed font-normal">
                A naturally welcoming vibe where solo travelers and friends meet, share itineraries, and explore the city together.
              </p>
            </div>

            {/* Amenity 3 */}
            <div className="bg-[#FFFFFF] p-7 rounded-2xl border border-[#E7D4B3]/40 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-[#E7D4B3]/40 flex items-center justify-center mb-5 text-[#16373F]">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#16373F] mb-2">
                Secure Storage
              </h3>
              <p className="text-xs text-[#63787D] leading-relaxed font-normal">
                Safe baggage storage prior to check-in or post checkout so you can discover Bangkok unencumbered by bags.
              </p>
            </div>

            {/* Amenity 4 */}
            <div className="bg-[#FFFFFF] p-7 rounded-2xl border border-[#E7D4B3]/40 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-[#D96B50]/15 flex items-center justify-center mb-5 text-[#D96B50]">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#16373F] mb-2">
                Local Travel Tips
              </h3>
              <p className="text-xs text-[#63787D] leading-relaxed font-normal">
                Authentic neighborhood recommendations for canal boats, street food stalls, quiet riverside temples, and night strolls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. LOCATION SECTION (Exact supplied address & confirmed company entity)
          ========================================================================= */}
      <section id="location" className="py-24 sm:py-32 bg-[#F2ECE1] border-t border-[#E7D4B3]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Official Credentials Card from assets */}
            <div className="lg:col-span-6">
              <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 shadow-elevated border border-[#E7D4B3]/60">
                <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-2">
                  Official Property Record
                </span>
                <h3 className="font-display text-2xl font-bold text-[#16373F] mb-4">
                  The Khaosan Poshtel
                </h3>

                <div className="rounded-xl overflow-hidden mb-6 border border-[#E7D4B3]/40 shadow-xs">
                  <img
                    src={COMPANY_CARD_SRC}
                    alt="The Khaosan Poshtel Official Address and Company Information"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="space-y-3 text-sm text-[#16373F]/85 border-t border-[#E7D4B3]/40 pt-5">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#2A5542] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-[#16373F]">Address:</p>
                      <p className="text-sm text-[#63787D]">
                        92 Soi Rambutri, Talat Yot, Phra Nakhon, Bangkok 10200
                      </p>
                      <p className="text-xs text-[#63787D] mt-0.5">
                        (Talat Yot Subdistrict, Phra Nakhon District)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <svg className="w-5 h-5 text-[#16373F] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="font-semibold text-[#16373F]">Operating Company:</p>
                      <p className="text-sm text-[#63787D]">
                        RK Hospitality Company Limited (RK Hospitality Co., Ltd.)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#E7D4B3]/40 flex flex-wrap gap-3">
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E7D4B3]/50 text-[#16373F] hover:bg-[#E7D4B3] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>{addressCopied ? 'Address Copied!' : 'Copy Address for Taxi / Map'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Neighborhood Narrative Column */}
            <div className="lg:col-span-6">
              <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-3">
                Prime Old Town Bangkok
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#16373F] mb-6">
                Charming Soi Rambuttri, Moments from Khaosan
              </h2>

              <p className="text-base text-[#16373F]/80 leading-relaxed font-normal mb-8">
                Soi Rambuttri is renowned as the more relaxed, bohemian counterpart to Khaosan Road. Shaded by mature banyan and palm trees, it offers open-air cafes, acoustic music lounges, artisan street carts, and a vibrant international traveler scene right outside our doors.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E7D4B3]/40 shadow-xs">
                  <h4 className="font-display font-semibold text-sm text-[#16373F] mb-1">
                    Khaosan Road (2-minute walk)
                  </h4>
                  <p className="text-xs text-[#63787D]">
                    Bangkok's legendary backpacker hub filled with lively night markets, pad thai carts, and electric social energy.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E7D4B3]/40 shadow-xs">
                  <h4 className="font-display font-semibold text-sm text-[#16373F] mb-1">
                    Wat Chana Songkhram & Historic Temples (3-minute walk)
                  </h4>
                  <p className="text-xs text-[#63787D]">
                    A serene Ayutthaya-era royal temple offering quiet morning walks, bells, and golden Buddha shrines.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E7D4B3]/40 shadow-xs">
                  <h4 className="font-display font-semibold text-sm text-[#16373F] mb-1">
                    Phra Arthit Chao Phraya River Pier (6-minute walk)
                  </h4>
                  <p className="text-xs text-[#63787D]">
                    Hop on the express riverboat for direct scenic transit to the Grand Palace, Wat Arun, and Chinatown.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. GALLERY SECTION (Authentic project images & footage stills)
          ========================================================================= */}
      <section id="gallery" className="py-24 sm:py-32 bg-[#F8F5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-3">
              Visual Ambiance
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#16373F]">
              Atmosphere & Tropical Identity
            </h2>
            <div className="w-16 h-1 bg-[#E7D4B3] mx-auto mt-4 mb-6 rounded-full" />
            <p className="text-base text-[#16373F]/80 leading-relaxed font-normal">
              A curated look into the artwork, credentials, and tropical footage that define The Khaosan Poshtel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gallery Item 1: High-Res Brand Artwork */}
            <div className="rounded-2xl overflow-hidden shadow-soft bg-[#FFFFFF] border border-[#E7D4B3]/50 group flex flex-col justify-between">
              <div className="h-68 overflow-hidden bg-[#F2ECE1] flex items-center justify-center p-4">
                <img
                  src={ARTWORK_CARD_SRC}
                  alt="The Khaosan Poshtel Tropical Badge Artwork"
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 border-t border-[#E7D4B3]/30">
                <h4 className="font-display font-semibold text-sm text-[#16373F]">
                  Brand Emblem & Identity
                </h4>
                <p className="text-xs text-[#63787D] mt-1">
                  Art-directed badge depicting sunset, palm trees, torches, and backpacker spirit.
                </p>
              </div>
            </div>

            {/* Gallery Item 2: Palm Canopy Footage Still */}
            <div className="rounded-2xl overflow-hidden shadow-soft bg-[#FFFFFF] border border-[#E7D4B3]/50 group flex flex-col justify-between">
              <div className="h-68 overflow-hidden">
                <img
                  src={GALLERY_PALM_SRC}
                  alt="Lush green palm fronds framing blue skies"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 border-t border-[#E7D4B3]/30">
                <h4 className="font-display font-semibold text-sm text-[#16373F]">
                  Tropical Palm Canopy & Coast
                </h4>
                <p className="text-xs text-[#63787D] mt-1">
                  Natural green foliage and serene coastal light inspiring our courtyard palette.
                </p>
              </div>
            </div>

            {/* Gallery Item 3: Official Brand Record & Location Card */}
            <div className="rounded-2xl overflow-hidden shadow-soft bg-[#FFFFFF] border border-[#E7D4B3]/50 group flex flex-col justify-between">
              <div className="h-68 overflow-hidden bg-[#F2ECE1] flex items-center justify-center p-4">
                <img
                  src={COMPANY_CARD_SRC}
                  alt="The Khaosan Poshtel Official Brand Identity and Address"
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 border-t border-[#E7D4B3]/30">
                <h4 className="font-display font-semibold text-sm text-[#16373F]">
                  Official Property Credentials
                </h4>
                <p className="text-xs text-[#63787D] mt-1">
                  RK Hospitality Company Limited operating record at 92 Soi Rambutri, Bangkok.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. BOOKING INQUIRY DRAWER/SECTION (Clearly marked demo booking action)
          ========================================================================= */}
      <section id="book" className="py-24 sm:py-32 bg-[#16373F] text-[#F8F5EE] relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 30%, #E7D4B3 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#E7D4B3] block mb-3">
            Plan Your Bangkok Adventure
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F8F5EE]">
            Book Your Stay at The Khaosan Poshtel
          </h2>
          <div className="w-16 h-1 bg-[#E7D4B3] mx-auto mt-5 mb-6 rounded-full" />
          <p className="text-base text-[#F8F5EE]/80 max-w-2xl mx-auto font-normal leading-relaxed mb-12">
            Experience our tropical boutique haven on Soi Rambuttri. Select your preferred dates below to check availability for private rooms and social pods.
          </p>

          {/* Interactive Demo Reservation Box */}
          <div className="bg-[#FFFFFF] text-[#16373F] rounded-2xl p-6 sm:p-10 shadow-2xl text-left border border-[#E7D4B3]/30">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E7D4B3]/40">
              <div>
                <h3 className="font-display font-bold text-xl text-[#16373F]">
                  Reservation Inquiry
                </h3>
                <p className="text-xs text-[#63787D] mt-0.5">
                  92 Soi Rambutri, Talat Yot, Phra Nakhon, Bangkok 10200
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E7D4B3]/40 text-[#16373F] text-xs font-semibold">
                Demo Booking System
              </span>
            </div>

            {bookingSubmitted ? (
              <div className="py-8 text-center bg-[#F8F5EE] rounded-xl border border-[#2A5542]/30 p-6">
                <div className="w-12 h-12 rounded-full bg-[#2A5542] text-[#F8F5EE] mx-auto flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-display font-bold text-xl text-[#16373F] mb-2">
                  Inquiry Received
                </h4>
                <p className="text-sm text-[#63787D] max-w-md mx-auto mb-6">
                  Thank you for your interest! In the production release, this action connects directly to The Khaosan Poshtel live reservation engine.
                </p>
                <button
                  type="button"
                  onClick={() => setBookingSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#16373F] text-[#F8F5EE] text-xs font-medium hover:bg-[#2A5542] transition-colors"
                >
                  Make Another Inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBookingSubmitted(true);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#16373F] mb-1.5">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-10-15"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7D4B3] text-sm text-[#16373F] focus:outline-none focus:ring-2 focus:ring-[#16373F]/30 bg-[#F8F5EE]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#16373F] mb-1.5">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-10-18"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7D4B3] text-sm text-[#16373F] focus:outline-none focus:ring-2 focus:ring-[#16373F]/30 bg-[#F8F5EE]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#16373F] mb-1.5">
                      Accommodation Type
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7D4B3] text-sm text-[#16373F] focus:outline-none focus:ring-2 focus:ring-[#16373F]/30 bg-[#F8F5EE]"
                    >
                      <option>Boutique Private Room</option>
                      <option>Curated Social Pod Dorm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#16373F] mb-1.5">
                      Guests
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7D4B3] text-sm text-[#16373F] focus:outline-none focus:ring-2 focus:ring-[#16373F]/30 bg-[#F8F5EE]"
                    >
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3+ Group Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-[#63787D]">
                    * Note: This is an interactive demo of the booking flow.
                  </p>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#16373F] text-[#F8F5EE] text-sm font-semibold tracking-wide hover:bg-[#2A5542] shadow-md transition-colors cursor-pointer"
                  >
                    Check Availability (Demo)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FOOTER (Brand name, address, operating company, confirmed details)
          ========================================================================= */}
      <footer className="bg-[#0D242A] text-[#F8F5EE]/80 py-16 border-t border-[#E7D4B3]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F8F5EE]/10">
            {/* Brand column */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={LOGO_SRC}
                  alt="The Khaosan Poshtel Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="font-display font-bold text-lg text-[#F8F5EE] tracking-wide">
                  THE KHAOSAN POSHTEL
                </span>
              </div>
              <p className="text-xs text-[#F8F5EE]/70 max-w-md leading-relaxed font-normal">
                A refined tropical boutique poshtel nestled along Soi Rambuttri in historic Phra Nakhon, Bangkok.
              </p>
              <div className="pt-2 text-xs text-[#E7D4B3] space-y-1">
                <p>
                  <strong className="text-[#F8F5EE]">Operating Entity:</strong> RK Hospitality Company Limited
                </p>
                <p>
                  <strong className="text-[#F8F5EE]">Address:</strong> 92 Soi Rambutri, Talat Yot, Phra Nakhon, Bangkok 10200
                </p>
              </div>
            </div>

            {/* Quick in-page navigation anchors */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-display font-semibold text-xs tracking-widest uppercase text-[#E7D4B3]">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                {['About', 'Stay', 'Experience', 'Location', 'Gallery'].map((sec) => (
                  <li key={sec}>
                    <a
                      href={`#${sec.toLowerCase()}`}
                      className="hover:text-[#F8F5EE] transition-colors"
                    >
                      {sec}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inquiries */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-display font-semibold text-xs tracking-widest uppercase text-[#E7D4B3]">
                Reservations
              </h4>
              <p className="text-xs text-[#F8F5EE]/70 leading-relaxed font-normal">
                Online bookings for The Khaosan Poshtel will launch through RK Hospitality Co., Ltd.
              </p>
              <a
                href="#book"
                className="inline-block mt-2 text-xs font-semibold text-[#E7D4B3] hover:text-[#F8F5EE] underline underline-offset-4 transition-colors"
              >
                Inquire About Availability &rarr;
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F8F5EE]/50 gap-4">
            <p>© 2026 The Khaosan Poshtel. All rights reserved.</p>
            <p>92 Soi Rambutri, Talat Yot Subdistrict, Phra Nakhon District, Bangkok 10200</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
