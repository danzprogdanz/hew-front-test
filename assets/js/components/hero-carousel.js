// assets/js/components/carousel.js
export class Carousel {
  constructor(selector) {
    this.carousel = document.querySelector(selector);
    this.track = this.carousel.querySelector('[data-carousel-track]');
    this.items = Array.from(
      this.carousel.querySelectorAll('[data-carousel-item]')
    );
    this.thumbs = Array.from(
      this.carousel.querySelectorAll('[data-carousel-thumb]')
    );
    this.currentIndex = 0;
    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateAriaLabels();
    this.startAutoPlay();
  }

  setupEventListeners() {
    // Navigation controls
    this.carousel
      .querySelector('[data-carousel-prev]')
      .addEventListener('click', () => this.prev());
    this.carousel
      .querySelector('[data-carousel-next]')
      .addEventListener('click', () => this.next());

    // Thumbnail navigation
    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.goTo(index));
    });

    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Adaptive image loading
    this.setupResponsiveImages();
  }

  updateAriaLabels() {
    this.items.forEach((item, index) => {
      item.setAttribute(
        'aria-label',
        `Slide ${index + 1} de ${this.items.length}`
      );
      item.setAttribute('aria-hidden', index !== this.currentIndex);
    });

    this.thumbs.forEach((thumb, index) => {
      thumb.setAttribute('aria-current', index === this.currentIndex);
    });
  }

  goTo(index) {
    this.currentIndex = (index + this.items.length) % this.items.length;

    this.items.forEach((item, i) => {
      item.classList.toggle('active', i === this.currentIndex);
    });

    this.thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === this.currentIndex);
    });

    this.updateAriaLabels();
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.next(), 7000);
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }

  setupResponsiveImages() {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const width = entry.contentRect.width;
        this.items.forEach((item) => {
          const img = item.querySelector('img');
          img.sizes = `${Math.ceil(width / 100)}vw`;
        });
      });
    });

    observer.observe(this.carousel);
  }
}
