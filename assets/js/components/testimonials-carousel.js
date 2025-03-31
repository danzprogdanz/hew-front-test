// assets/js/components/testimonials-carousel.js
export class TestimonialsCarousel {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    this.track = this.container.querySelector('[data-track]');
    this.items = Array.from(this.container.querySelectorAll('.testimonial'));
    this.pagination = this.container.querySelector('[data-pagination]');
    this.currentIndex = 0;
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = null;

    this.init();
  }

  init() {
    this.setupPagination();
    this.addEventListeners();
    this.updateCarousel();
  }

  setupPagination() {
    this.pagination.innerHTML = this.items
      .map(
        (_, i) => `
        <button role="tab" aria-selected="${i === 0}" 
                data-index="${i}" 
                aria-label="Slide ${i + 1}">
        </button>
      `
      )
      .join('');
  }

  addEventListeners() {
    // Touch events
    this.track.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.track.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.track.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // Mouse events
    this.track.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.track.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.track.addEventListener('mouseup', this.handleMouseEnd.bind(this));
    this.track.addEventListener('mouseleave', this.handleMouseEnd.bind(this));

    // Pagination clicks
    this.pagination.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (button) {
        this.goTo(parseInt(button.dataset.index));
      }
    });

    // Navigation buttons
    this.container
      .querySelector('.testimonials__nav--prev')
      .addEventListener('click', () => this.prev());
    this.container
      .querySelector('.testimonials__nav--next')
      .addEventListener('click', () => this.next());
  }

  handleTouchStart(e) {
    this.startPos = e.touches[0].clientX;
    this.isDragging = true;
    this.track.style.transition = 'none';
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    const currentPosition = e.touches[0].clientX;
    this.currentTranslate =
      this.prevTranslate + currentPosition - this.startPos;
    this.setSliderPosition();
  }

  handleMouseDown(e) {
    e.preventDefault();
    this.startPos = e.clientX;
    this.isDragging = true;
    this.track.style.transition = 'none';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    const currentPosition = e.clientX;
    this.currentTranslate =
      this.prevTranslate + currentPosition - this.startPos;
    this.setSliderPosition();
  }

  handleTouchEnd() {
    this.isDragging = false;
    this.handleDragEnd();
  }

  handleMouseEnd() {
    this.isDragging = false;
    this.handleDragEnd();
  }

  handleDragEnd() {
    const movedBy = this.currentTranslate - this.prevTranslate;
    if (Math.abs(movedBy) > 50) {
      movedBy > 0 ? this.prev() : this.next();
    } else {
      this.goTo(this.currentIndex);
    }
    this.track.style.transition = '';
  }

  setSliderPosition() {
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  updateCarousel() {
    const itemWidth = this.items[0].getBoundingClientRect().width;
    this.currentTranslate = -this.currentIndex * itemWidth;
    this.prevTranslate = this.currentTranslate;
    this.setSliderPosition();

    this.items.forEach((item, i) => {
      item.classList.toggle('active', i === this.currentIndex);
    });

    this.pagination.querySelectorAll('button').forEach((btn, i) => {
      btn.setAttribute('aria-selected', i === this.currentIndex);
      btn.classList.toggle('active', i === this.currentIndex);
    });
  }

  prev() {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
    this.updateCarousel();
  }

  next() {
    this.currentIndex = Math.min(this.items.length - 1, this.currentIndex + 1);
    this.updateCarousel();
  }

  goTo(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }
}
