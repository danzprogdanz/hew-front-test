// assets/js/main.js
import { NavbarScroller } from './components/navbar-scroller.js';
import { GalleryModal } from './components/modal.js';
import { LeadForm } from './components/lead-form.js';
import { CountdownTimer } from './components/countdown.js';
import { TestimonialsCarousel } from './components/testimonials-carousel.js';
import { Carousel } from './components/hero-carousel.js'; // Add this line

class App {
  constructor() {
    this.initComponents();
  }

  initComponents() {
    // Navigation
    this.navbar = new NavbarScroller('nav-header', 'logo', 70);

    // Modals
    this.initGalleryModal();

    // Forms
    this.initLeadForm();

    // Interactive Elements
    this.initCarousels();
    this.initTestimonialsCarousel();
    this.initCountdown();
  }

  initGalleryModal() {
    const galleryItems = Array.from(
      document.querySelectorAll('.gallery-item img')
    );
    this.galleryModal = new GalleryModal('#galleryModal', galleryItems);

    document.querySelectorAll('.gallery-item img').forEach((img, index) => {
      img.addEventListener('click', () => this.galleryModal.open(index));
    });
  }

  initLeadForm() {
    this.leadForm = new LeadForm('#leadForm', {
      onSubmit: (formData) => {
        // Start transition
        const splitLayout = document.querySelector('.split-layout');
        splitLayout.classList.add('slide-out');

        const loadingOverlay = document.querySelector('.loading-overlay');
        loadingOverlay.classList.add('active');

        // After transition completes
        splitLayout.addEventListener(
          'transitionend',
          () => {
            // iam do this delay to have time to display loading
            this.showWelcomeMessage(formData.name);

            setTimeout(() => {
              document.getElementById('leadCapture').style.display = 'none';
            }, 1000);

            setTimeout(() => {
              loadingOverlay.classList.remove('active');
              document.getElementById('productPage').style.display = 'block';
              splitLayout.classList.remove('slide-out'); // Reset here if needed
            }, 1000);
          },
          { once: true }
        );
      },
      onError: (errors) => {
        console.error('Form errors:', errors);
      },
    });
  }

  showWelcomeMessage(name) {
    const heroSection = document.getElementById('hero');

    // Create welcome message element
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for your interest!</p>
    `;

    // Add to hero section
    heroSection.prepend(welcomeDiv); // Add at the top
    // OR: heroSection.appendChild(welcomeDiv); // Add at the bottom

    // Optional: Add fade-in animation
    setTimeout(() => welcomeDiv.classList.add('visible'), 100);
  }

  initTestimonialsCarousel() {
    this.testimonialsCarousel = new TestimonialsCarousel(
      '.testimonials__carousel'
    );
  }

  initCarousels() {
    // Initialize hero carousel with proper selector
    this.heroCarousel = new Carousel('.hero__carousel', {
      autoPlay: true,
      interval: 7000,
      pauseOnHover: true,
    });
  }

  initCountdown() {
    // Update selector to match new HTML structure
    this.countdown = new CountdownTimer('.countdown__timer', {
      minutes: 15,
      seconds: 0,
      onComplete: () => {
        console.log('Countdown complete!');
        const ctaButton = document.querySelector('.countdown__cta');
        if (ctaButton) {
          ctaButton.disabled = true;
          ctaButton.textContent = 'Oferta Expirada';
        }
      },
    });
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();

  // Make available for debugging if needed
  window.app = app;
});
