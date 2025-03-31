export class NavbarScroller {
  constructor(navbarId, logoId, scrollOffset = 80) {
    this.navbar = document.getElementById(navbarId);
    this.logo = document.getElementById(logoId);
    this.scrollOffset = scrollOffset;

    // Get header heights from CSS variables
    const rootStyles = getComputedStyle(document.documentElement);
    this.headerHeight = parseInt(
      rootStyles.getPropertyValue('--header-height'),
      10
    );
    this.headerHeightScrolled = parseInt(
      rootStyles.getPropertyValue('--header-height-scrolled'),
      10
    );

    this.handleScroll = this.handleScroll.bind(this);
    this.init();
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.scrollOffset) {
      this.navbar.classList.add('scrolled');
      this.logo.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
      this.logo.classList.remove('scrolled');
    }
  }

  init() {
    const self = this; // Capture class instance for event listeners

    window.addEventListener('scroll', function () {
      const header = document.querySelector('.nav-header');
      const scrollPosition = window.scrollY;

      // Add scrolled class after 50px of scrolling
      if (scrollPosition > 70) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Optional: progressive scaling based on scroll position
      const logo = document.querySelector('.header-logo');
      if (scrollPosition > 70) {
        const scale = Math.max(0.85, 1 - (scrollPosition - 70) / 300);
        logo.style.transform = `scale(${scale})`;
      } else {
        logo.style.transform = 'scale(1)';
      }
    });

    // Smooth scroll with header offset
    document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          history.pushState(null, null, targetId);
          return;
        }

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        // Dynamic header height calculation
        const targetPosition = targetElement.offsetTop;
        const headerHeight =
          targetPosition > self.scrollOffset
            ? self.headerHeightScrolled
            : self.headerHeight;

        window.scrollTo({
          top: targetPosition - headerHeight,
          behavior: 'smooth',
        });

        history.pushState(null, null, targetId);
      });
    });
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
