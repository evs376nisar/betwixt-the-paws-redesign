/**
 * ==========================================================================
 * BETWIXT THE PAWS GROOMING LLC - LUXURY PET SPA INTERACTIVE ENGINE
 * 3D Card Parallax Tilt, Floating Bubbles Canvas, Price Calculator, Chimes
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Current Year in Footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     1. GENTLE SPA CHIME AUDIO SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */
  class SpaChimeEngine {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('btp_spa_chimes') !== 'muted';
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
        localStorage.setItem('btp_spa_chimes', this.enabled ? 'enabled' : 'muted');
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
        btn.setAttribute('title', 'Mute Gentle Spa Chimes');
      } else {
        btn.classList.add('muted');
        btn.setAttribute('title', 'Enable Gentle Spa Chimes');
      }
    }

    // Gentle warm acoustic bell
    playBell(freq = 523.25, gainVal = 0.03) {
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
        // Audio error ignore
      }
    }

    playSuccessChime() {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
      notes.forEach((f, i) => {
        setTimeout(() => {
          this.playBell(f, 0.04);
        }, i * 110);
      });
    }
  }

  const chimeEngine = new SpaChimeEngine();

  /* ==========================================================================
     2. 3D CARD PARALLAX TILT WITH WARM SPECULAR LIGHT
     ========================================================================== */
  const tiltCards = document.querySelectorAll('.card-3d-interactive');

  tiltCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      chimeEngine.playBell(440, 0.015);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const maxTilt = parseFloat(card.getAttribute('data-tilt-max')) || 8;
      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ==========================================================================
     3. FLOATING BUBBLE & PAW PRINT SPA CANVAS
     ========================================================================== */
  const canvas = document.getElementById('bubble-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let bubbles = [];
    const count = Math.min(Math.floor(window.innerWidth / 30), 40);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initBubbles();
    });

    class SpaBubble {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + Math.random() * 50;
        this.radius = Math.random() * 14 + 6;
        this.vy = -(Math.random() * 0.45 + 0.25);
        this.vx = Math.sin(Math.random() * 10) * 0.2;
        this.isPaw = Math.random() > 0.85; // Occasionally draw a tiny soft paw
        this.alpha = Math.random() * 0.35 + 0.15;
        this.hue = Math.random() > 0.5 ? 'rgba(217, 119, 6,' : 'rgba(16, 185, 129,';
      }

      update() {
        this.y += this.vy;
        this.x += Math.sin(this.y * 0.015) * 0.4;
        if (this.y < -30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        if (this.isPaw) {
          // Draw a gentle paw print
          ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
          ctx.arc(this.x - this.radius * 0.45, this.y - this.radius * 0.5, this.radius * 0.25, 0, Math.PI * 2);
          ctx.arc(this.x, this.y - this.radius * 0.7, this.radius * 0.25, 0, Math.PI * 2);
          ctx.arc(this.x + this.radius * 0.45, this.y - this.radius * 0.5, this.radius * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(194, 120, 3, ${this.alpha * 0.4})`;
          ctx.fill();
        } else {
          // Draw gentle bubble with specular reflection
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${this.hue} ${this.alpha * 0.25})`;
          ctx.strokeStyle = `${this.hue} ${this.alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();

          // Highlight dot on bubble
          ctx.beginPath();
          ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.8})`;
          ctx.fill();
        }
      }
    }

    function initBubbles() {
      bubbles = [];
      for (let i = 0; i < count; i++) {
        bubbles.push(new SpaBubble());
      }
    }

    initBubbles();

    function renderBubbles() {
      ctx.clearRect(0, 0, width, height);
      bubbles.forEach((b) => {
        b.update();
        b.draw();
      });
      requestAnimationFrame(renderBubbles);
    }
    renderBubbles();
  }

  /* ==========================================================================
     4. HEADER SCROLL & NAVIGATION
     ========================================================================== */
  const header = document.getElementById('header');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 180;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((item) => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });

  /* ==========================================================================
     5. MOBILE MENU DRAWER
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-item');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      chimeEngine.playBell(523.25, 0.03);
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    }

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     6. SERVICE CATEGORY FILTER PILL TABS
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.tab-pill');
  const spaCards = document.querySelectorAll('.spa-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      chimeEngine.playBell(587.33, 0.025);

      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      spaCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     7. SMART PET SPA PRICE & TIME ESTIMATOR
     ========================================================================== */
  const petTypeCards = document.querySelectorAll('.pet-type-card');
  const sizePillButtons = document.querySelectorAll('.size-pill-btn');
  const corePackageSelect = document.getElementById('corePackageSelect');
  const addonChecks = document.querySelectorAll('.addon-check');

  const calcPriceDisplay = document.getElementById('calcPriceDisplay');
  const calcDurationDisplay = document.getElementById('calcDurationDisplay');
  const calcGaugeFill = document.getElementById('calcGaugeFill');
  const calcBreakdownList = document.getElementById('calcBreakdownList');
  const btnTransferToWaitlist = document.getElementById('btnTransferToWaitlist');

  const packagePresets = {
    dog: [
      { id: 'bath_basic', name: 'Dog Bath & Brush Package - Basic', base: 45, time: 60 },
      { id: 'bath_deluxe', name: 'Dog Bath & Brush Package - Deluxe', base: 60, time: 90 },
      { id: 'haircut', name: 'Dog Haircut & Full Styling', base: 75, time: 90 },
      { id: 'deshedding', name: 'De-shedding Ultra Husky Package', base: 85, time: 120 }
    ],
    cat: [
      { id: 'cat_bath', name: 'Cat Bath & Brush Package', base: 60, time: 90 },
      { id: 'cat_haircut_dry', name: 'Cat Haircut (Without Bath)', base: 65, time: 60 },
      { id: 'cat_haircut_bath', name: 'Cat Haircut (With Bath)', base: 80, time: 120 }
    ]
  };

  let currentPet = 'dog';
  let currentSizeMultiplier = 1.2;
  let currentSizeName = 'Medium';

  function populatePackages(petType) {
    if (!corePackageSelect) return;
    corePackageSelect.innerHTML = '';
    const list = packagePresets[petType];
    list.forEach((p, idx) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.setAttribute('data-base', p.base);
      opt.setAttribute('data-time', p.time);
      opt.textContent = `${p.name} (~$${p.base})`;
      if (idx === 1 && petType === 'dog') opt.selected = true;
      corePackageSelect.appendChild(opt);
    });
  }

  // Switch Companion (Dog vs Cat)
  petTypeCards.forEach((btn) => {
    btn.addEventListener('click', () => {
      chimeEngine.playBell(659.25, 0.03);
      petTypeCards.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentPet = btn.getAttribute('data-pet');
      populatePackages(currentPet);
      recalculate();
    });
  });

  // Switch Pet Size
  sizePillButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      chimeEngine.playBell(587.33, 0.025);
      sizePillButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentSizeMultiplier = parseFloat(btn.getAttribute('data-multiplier'));
      currentSizeName = btn.querySelector('strong').textContent;
      recalculate();
    });
  });

  if (corePackageSelect) {
    corePackageSelect.addEventListener('change', () => {
      chimeEngine.playBell(523.25, 0.02);
      recalculate();
    });
  }

  addonChecks.forEach((addon) => {
    addon.addEventListener('change', () => {
      chimeEngine.playBell(addon.checked ? 783.99 : 440, 0.03);
      recalculate();
    });
  });

  function recalculate() {
    if (!calcPriceDisplay || !corePackageSelect) return;

    const opt = corePackageSelect.options[corePackageSelect.selectedIndex];
    if (!opt) return;

    const basePrice = parseFloat(opt.getAttribute('data-base')) || 60;
    const baseTime = parseInt(opt.getAttribute('data-time'), 10) || 90;
    const pkgName = opt.textContent.split(' (~$')[0];

    const adjustedBase = Math.round(basePrice * currentSizeMultiplier);
    let totalCost = adjustedBase;
    let totalTime = baseTime;

    let addonsAdded = [];

    addonChecks.forEach((addon) => {
      if (addon.checked) {
        const p = parseFloat(addon.getAttribute('data-price')) || 0;
        const t = parseInt(addon.getAttribute('data-time'), 10) || 0;
        const title = addon.closest('.addon-option').querySelector('.addon-title').textContent;

        totalCost += p;
        totalTime += t;
        addonsAdded.push({ title, price: p });
      }
    });

    // Smooth price animation
    animateCounter(calcPriceDisplay, parseInt(calcPriceDisplay.textContent, 10) || 0, totalCost, 300);

    // Format duration
    const hrs = Math.floor(totalTime / 60);
    const mins = totalTime % 60;
    let durStr = '';
    if (hrs > 0) durStr += `${hrs} hr `;
    if (mins > 0) durStr += `${mins} min`;
    calcDurationDisplay.textContent = durStr.trim();

    // Progress bar
    const pct = Math.min(Math.round((totalTime / 180) * 100), 100);
    calcGaugeFill.style.width = `${pct}%`;

    // Itemized receipt
    calcBreakdownList.innerHTML = `
      <div class="b-row"><span>${pkgName}</span><strong>$${adjustedBase}.00</strong></div>
      <div class="b-row"><span>Weight Factor (${currentSizeName})</span><strong>${currentSizeMultiplier}x</strong></div>
    `;

    addonsAdded.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'b-row';
      row.innerHTML = `<span>${item.title}</span><strong>+$${item.price}.00</strong>`;
      calcBreakdownList.appendChild(row);
    });
  }

  function animateCounter(el, start, end, duration) {
    if (start === end) return;
    const diff = end - start;
    let curr = start;
    const inc = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / diff)) || 15;
    const timer = setInterval(() => {
      curr += inc;
      el.textContent = curr;
      if (curr === end) clearInterval(timer);
    }, stepTime);
  }

  // Card "Estimate Price" Button Bridge
  const cardCalcButtons = document.querySelectorAll('.btn-card-calc');
  cardCalcButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      chimeEngine.playBell(783.99, 0.04);
      const pkg = btn.getAttribute('data-pkg');
      const calcSec = document.getElementById('calculator');

      calcSec.scrollIntoView({ behavior: 'smooth' });

      if (pkg.includes('Cat')) {
        const catBtn = document.querySelector('.pet-type-card[data-pet="cat"]');
        if (catBtn) catBtn.click();
      } else {
        const dogBtn = document.querySelector('.pet-type-card[data-pet="dog"]');
        if (dogBtn) dogBtn.click();
      }
    });
  });

  // Transfer Quote to Waitlist Form
  if (btnTransferToWaitlist) {
    btnTransferToWaitlist.addEventListener('click', () => {
      chimeEngine.playBell(880, 0.05);

      const opt = corePackageSelect.options[corePackageSelect.selectedIndex];
      const pkgName = opt ? opt.textContent.split(' (~$')[0] : 'Spa Package';
      const estPrice = calcPriceDisplay.textContent;
      const estTime = calcDurationDisplay.textContent;

      const waitlistSelect = document.getElementById('serviceNeeded');
      const petNotes = document.getElementById('petNotes');
      const petWeight = document.getElementById('petWeight');

      if (waitlistSelect) {
        for (let i = 0; i < waitlistSelect.options.length; i++) {
          if (waitlistSelect.options[i].text.toLowerCase().includes(pkgName.toLowerCase().slice(0, 8))) {
            waitlistSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (petWeight) {
        petWeight.value = `${currentSizeName} size class`;
      }

      if (petNotes) {
        petNotes.value = `[Transferred from Estimator]: ${pkgName} | Estimated: $${estPrice} (~${estTime}). Please let me know of your next opening!`;
      }

      const waitlistSec = document.getElementById('waitlist');
      if (waitlistSec) {
        waitlistSec.scrollIntoView({ behavior: 'smooth' });
        const waitlistCard = document.querySelector('.waitlist-luxury-card');
        if (waitlistCard) {
          waitlistCard.style.boxShadow = '0 20px 60px rgba(194, 120, 3, 0.35)';
          setTimeout(() => {
            waitlistCard.style.boxShadow = '';
          }, 1400);
        }
      }
    });
  }

  recalculate();

  /* ==========================================================================
     8. BEFORE & AFTER TRANSFORMATION SLIDER
     ========================================================================== */
  const baCard = document.getElementById('beforeAfterCard');
  const beforeLayer = document.getElementById('beforeLayer');
  const baSplitter = document.getElementById('baSplitter');

  if (baCard && beforeLayer && baSplitter) {
    let isDragging = false;

    function moveSlider(clientX) {
      const rect = baCard.getBoundingClientRect();
      let pos = clientX - rect.left;
      if (pos < 0) pos = 0;
      if (pos > rect.width) pos = rect.width;

      const pct = (pos / rect.width) * 100;
      beforeLayer.style.width = `${pct}%`;
      baSplitter.style.left = `${pct}%`;
    }

    baCard.addEventListener('mousedown', (e) => {
      isDragging = true;
      moveSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    baCard.addEventListener('touchstart', (e) => {
      isDragging = true;
      moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  /* ==========================================================================
     9. ANIMATED STATS NUMBER COUNTERS
     ========================================================================== */
  const statValues = document.querySelectorAll('.counter-value');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statValues.forEach((el) => {
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          let current = 0;
          const step = Math.max(Math.floor(target / 40), 1);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              el.textContent = target.toLocaleString();
              clearInterval(interval);
            } else {
              el.textContent = current.toLocaleString();
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsStrip = document.querySelector('.stats-counter-strip');
  if (statsStrip) {
    countObserver.observe(statsStrip);
  }

  /* ==========================================================================
     10. PET GALLERY LIGHTBOX MODAL
     ========================================================================== */
  const galleryCards = document.querySelectorAll('.pet-gallery-card');
  const modal = document.getElementById('galleryModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalBreed = document.getElementById('modalBreed');
  const modalService = document.getElementById('modalService');

  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      chimeEngine.playBell(659.25, 0.03);
      const name = card.getAttribute('data-name');
      const breed = card.getAttribute('data-breed');
      const service = card.getAttribute('data-service');
      const img = card.getAttribute('data-image');

      if (modalImage) modalImage.src = img;
      if (modalTitle) modalTitle.textContent = name;
      if (modalBreed) modalBreed.textContent = breed;
      if (modalService) modalService.textContent = service;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeZoomModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      chimeEngine.playBell(440, 0.02);
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeZoomModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeZoomModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeZoomModal();
  });

  /* ==========================================================================
     11. VIP WAITLIST FORM SUBMISSION WITH CONFETTI CELEBRATION
     ========================================================================== */
  const waitlistForm = document.getElementById('vipWaitlistForm');
  const formSuccessOverlay = document.getElementById('formSuccessOverlay');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const successTicketCode = document.getElementById('successTicketCode');

  if (waitlistForm && formSuccessOverlay) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();

      chimeEngine.playSuccessChime();

      if (window.confetti) {
        window.confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c27803', '#10b981', '#f59e0b', '#fb7185']
        });
      }

      const randomTicket = Math.floor(1000 + Math.random() * 9000);
      if (successTicketCode) {
        successTicketCode.textContent = `TICKET: #BTP-WAIT-${randomTicket}`;
      }

      formSuccessOverlay.classList.add('active');
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        formSuccessOverlay.classList.remove('active');
        waitlistForm.reset();
      });
    }
  }

  /* ==========================================================================
     12. ONE-CLICK COPY PHONE & EMAIL
     ========================================================================== */
  const copyChips = document.querySelectorAll('.btn-copy-chip');
  copyChips.forEach((btn) => {
    btn.addEventListener('click', () => {
      chimeEngine.playBell(783.99, 0.03);
      const text = btn.getAttribute('data-copy');
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = `<i data-lucide="check"></i> Copied!`;
          if (window.lucide) window.lucide.createIcons();
          setTimeout(() => {
            btn.innerHTML = original;
            if (window.lucide) window.lucide.createIcons();
          }, 2000);
        });
      }
    });
  });

});
