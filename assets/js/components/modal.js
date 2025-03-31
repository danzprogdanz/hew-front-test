// assets/js/components/modal.js
export class Modal {
  constructor(selector) {
    this.modal = document.querySelector(selector);
    this.init();
  }

  init() {
    this.modal.addEventListener('click', (e) => {
      if (
        e.target === this.modal ||
        e.target.classList.contains('modal-close')
      ) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open() {
    this.modal.showModal();
    document.body.style.overflow = 'hidden';
    this.modal.classList.add('fade-in');
    this.modal.classList.remove('fade-out');
  }

  close() {
    this.modal.classList.add('fade-out');
    this.modal.classList.remove('fade-in');

    setTimeout(() => {
      this.modal.close();
      document.body.style.overflow = '';
    }, 300);
  }
}

// In modal.js
export class GalleryModal extends Modal {
  constructor(selector, galleryItems) {
    super(selector);
    this.items = galleryItems;
    this.currentIndex = 0;
    this.initNavigation();
  }

  initNavigation() {
    this.modal
      .querySelector('.modal-prev')
      .addEventListener('click', () => this.prev());
    this.modal
      .querySelector('.modal-next')
      .addEventListener('click', () => this.next());
  }

  open(index = 0) {
    this.currentIndex = index;
    this.updateImage();
    super.open();
  }

  updateImage() {
    const img = this.items[this.currentIndex];
    this.modal.querySelector('.modal-image').src = img.src;
    this.modal.querySelector('.modal-image').alt = img.alt;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateImage();
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateImage();
  }
}
