/* ==========================================================================
   VYAYAM AI Interactive & Animation Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* ---------------------------------------------------------
     1. Theme Switcher Logic
     --------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const heroDashboardImg = document.getElementById('hero-dashboard-img');
  
  // Set theme based on saved preferences or default to dark
  const savedTheme = localStorage.getItem('vyayam-theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (heroDashboardImg) heroDashboardImg.src = 'assets/dashboard-light.png';
  } else {
    document.body.classList.remove('light-theme');
    if (heroDashboardImg) heroDashboardImg.src = 'assets/dashboard-dark.png';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('vyayam-theme', currentTheme);
      
      // Update Hero Dashboard mock image source dynamically
      if (heroDashboardImg) {
        if (currentTheme === 'light') {
          heroDashboardImg.src = 'assets/dashboard-light.png';
        } else {
          heroDashboardImg.src = 'assets/dashboard-dark.png';
        }
      }
    });
  }

  /* ---------------------------------------------------------
     2. Mobile Responsive Menu
     --------------------------------------------------------- */
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== menuBtn) {
        navMenu.classList.remove('open');
      }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  /* ---------------------------------------------------------
     3. Active Scroll Indicator
     --------------------------------------------------------- */
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let currentSection = 'home';
    const scrollPosition = window.scrollY + 100; // Offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* ---------------------------------------------------------
     4. FAQ Accordion Animation
     --------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Collapse all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-content').style.maxHeight = null;
            otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = null;
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ---------------------------------------------------------
     5. Contact Form Handler & Validations
     --------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate API submit
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending Message...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast(`Thank you, ${name}! Your inquiry has been sent successfully.`, 'success');
        contactForm.reset();
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // Double click map redirect simulation
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    mapContainer.addEventListener('dblclick', () => {
      window.open('https://maps.google.com/?q=Bangalore+Gym+Automation', '_blank');
    });
  }

  /* ---------------------------------------------------------
     6. Toast Notification Generator
     --------------------------------------------------------- */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon Selection based on type
    const icon = type === 'success' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: #10B981;"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: #EF4444;"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>`;

    toast.innerHTML = `
      ${icon}
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger transition
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Remove toast after time limit
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

  // Simple Email Regex Validation Helper
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
