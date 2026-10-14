/**
 * ==========================================================================
 * PRETTY PET & BETWIXT THE PAWS — DELIGHTFUL INTERACTIVE & ANIMATION ENGINE
 * Floating Spa Bubbles, 3D Parallax Tilt, Before/After Slider, Audio Chimes
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. GENTLE SPA CHIME AUDIO SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */
  class SpaChimeEngine {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('btp_chimes') !== 'muted';
      this.initButton();
    }

    initContext() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    initButton() {
      const btn = document.getElementById('soundToggleBtn');
      if (!btn) return;
      this.updateState(btn);

      btn.addEventListener('click', () => {
        this.enabled = !this.enabled;
        localStorage.setItem('btp_chimes', this.enabled ? 'enabled' : 'muted');
        this.updateState(btn);
        if (this.enabled) {
          this.initContext();
          this.playBell(587.33); // D5 chime
        }
      });
    }

    updateState(btn) {
      if (this.enabled) {
        btn.classList.remove('muted');
        btn.innerHTML = '🔔 Sound: ON';
      } else {
        btn.classList.add('muted');
        btn.innerHTML = '🔕 Sound: OFF';
      }
    }

    playBell(freq = 523.25, gainVal = 0.035) {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) {
        // audio ignore
      }
    }

    playCelebration() {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
      notes.forEach((f, i) => {
        setTimeout(() => this.playBell(f, 0.05), i * 120);
      });
    }
  }

  const chime = new SpaChimeEngine();

  /* ==========================================================================
     2. FLOATING SPA BUBBLE & PAW PRINT BACKGROUND CANVAS
     ========================================================================== */
  const canvas = document.getElementById('bubble-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const bubbles = [];
    const bubbleCount = 28;

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 14 + 6,
        speed: Math.random() * 0.7 + 0.3,
        alpha: Math.random() * 0.25 + 0.1,
        swing: Math.random() * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
        isPaw: Math.random() > 0.65
      });
    }

    function drawPaw(x, y, size, alpha) {
      ctx.fillStyle = `rgba(217, 106, 39, ${alpha * 0.5})`;
      // Main pad
      ctx.beginPath();
      ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
      // 3 Toes
      const toeR = size * 0.25;
      ctx.beginPath();
      ctx.arc(x - size * 0.45, y - size * 0.55, toeR, 0, Math.PI * 2);
      ctx.arc(x, y - size * 0.8, toeR, 0, Math.PI * 2);
      ctx.arc(x + size * 0.45, y - size * 0.55, toeR, 0, Math.PI * 2);
      ctx.fill();
    }

    function animateBubbles() {
      ctx.clearRect(0, 0, width, height);

      bubbles.forEach(b => {
        b.y -= b.speed;
        b.x += Math.sin(b.swing) * 0.5;
        b.swing += b.swingSpeed;

        if (b.y < -30) {
          b.y = height + 30;
          b.x = Math.random() * width;
        }

        if (b.isPaw) {
          drawPaw(b.x, b.y, b.r, b.alpha);
        } else {
          // Bubble gradient
          const grad = ctx.createRadialGradient(
            b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1,
            b.x, b.y, b.r
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${b.alpha * 1.5})`);
          grad.addColorStop(0.7, `rgba(248, 180, 137, ${b.alpha * 0.4})`);
          grad.addColorStop(1, `rgba(217, 106, 39, ${b.alpha * 0.2})`);

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      requestAnimationFrame(animateBubbles);
    }
    animateBubbles();
  }

  /* ==========================================================================
     3. 3D CARD PARALLAX TILT WITH SPECULAR GLOSS
     ========================================================================== */
  const interactiveCards = document.querySelectorAll('.pp-service-card, .hero-capsule');

  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      chime.playBell(659.25, 0.02);
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (card.classList.contains('pp-service-card')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = -((y - centerY) / centerY) * 7;
        const rotateY = ((x - centerX) / centerX) * 7;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('pp-service-card')) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      }
    });
  });

  /* ==========================================================================
     4. BEFORE & AFTER FUR TRANSFORMATION SLIDER
     ========================================================================== */
  const baViewport = document.getElementById('baViewport');
  const baBeforeWrap = document.getElementById('baBeforeWrap');
  const baHandle = document.getElementById('baHandle');

  if (baViewport && baBeforeWrap && baHandle) {
    let isDragging = false;

    const setSliderPosition = clientX => {
      const rect = baViewport.getBoundingClientRect();
      let pos = (clientX - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      const pct = pos * 100;

      baBeforeWrap.style.width = `${pct}%`;
      baHandle.style.left = `${pct}%`;
    };

    baViewport.addEventListener('mousedown', e => {
      isDragging = true;
      setSliderPosition(e.clientX);
      chime.playBell(783.99, 0.02);
    });

    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    baViewport.addEventListener('touchstart', e => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', e => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  /* ==========================================================================
     5. ANIMATED STATS NUMBERS ON SCROLL
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-num');
  let statsCounted = false;

  const countUp = (el, target, suffix = '') => {
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current.toLocaleString() + suffix;
    }, 30);
  };

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'), 10) || 0;
          const suffix = num.getAttribute('data-suffix') || '';
          countUp(num, target, suffix);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.pp-stats-strip');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     6. PRICING PLAN SWITCHER (Single Visit vs VIP Spa Club - 20% OFF)
     ========================================================================== */
  window.setPricingCycle = function(mode, btn) {
    document.querySelectorAll('.pricing-toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    chime.playBell(523.25, 0.03);

    const isMember = mode === 'member';
    document.getElementById('priceBasic').innerHTML = isMember ? '$80<span>/mo</span>' : '$100<span>/visit</span>';
    document.getElementById('pricePremium').innerHTML = isMember ? '$88<span>/mo</span>' : '$110<span>/visit</span>';
    document.getElementById('priceDeluxe').innerHTML = isMember ? '$80<span>/mo</span>' : '$100<span>/visit</span>';
  };

  /* ==========================================================================
     7. FAST BOOKING WIZARD MODAL & CONFETTI
     ========================================================================== */
  const bookingModal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('modalClose');

  window.openBookingModal = function(packageChoice = '') {
    if (bookingModal) {
      bookingModal.classList.add('open');
      chime.playBell(659.25, 0.03);
      if (packageChoice) {
        const pkgSelect = document.getElementById('modalPackageSelect');
        if (pkgSelect) pkgSelect.value = packageChoice;
      }
    }
  };

  if (modalClose && bookingModal) {
    modalClose.addEventListener('click', () => {
      bookingModal.classList.remove('open');
    });

    bookingModal.addEventListener('click', e => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('open');
      }
    });
  }

  window.submitBookingModal = function(e) {
    e.preventDefault();
    const btn = document.getElementById('modalSubmitBtn');
    btn.innerHTML = 'Booking Session...';
    btn.disabled = true;

    setTimeout(() => {
      chime.playCelebration();
      if (window.confetti) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
      document.getElementById('bookingWizardForm').style.display = 'none';
      document.getElementById('bookingSuccessState').style.display = 'block';
    }, 600);
  };
});

