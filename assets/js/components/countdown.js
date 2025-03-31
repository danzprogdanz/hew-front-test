// assets/js/components/countdown.js
export class CountdownTimer {
  #timerElement;
  #minutesElement;
  #secondsElement;
  #endTime;
  #intervalId;
  #options;

  constructor(selector, options = {}) {
    // Initialize options FIRST
    this.#options = {
      minutes: 15,
      seconds: 0,
      onComplete: () => {},
      ...options,
    };

    // Then initialize DOM elements
    this.#timerElement = document.querySelector(selector);

    if (!this.#timerElement) {
      console.error(`Countdown element not found with selector: ${selector}`);
      return;
    }

    this.#minutesElement = this.#timerElement.querySelector('#minutes');
    this.#secondsElement = this.#timerElement.querySelector('#seconds');

    if (!this.#minutesElement || !this.#secondsElement) {
      console.error('Time elements not found in countdown timer');
      return;
    }

    this.#initialize();
  }

  #initialize() {
    const startTime = Date.now();
    this.#endTime =
      startTime + this.#options.minutes * 60000 + this.#options.seconds * 1000;

    this.#updateDisplay();
    this.#startCountdown();
  }

  #startCountdown() {
    this.#intervalId = setInterval(() => {
      const currentTime = Date.now();
      const remaining = this.#endTime - currentTime;

      if (remaining <= 0) {
        this.#handleComplete();
        return;
      }

      this.#updateDisplay(remaining);
    }, 1000);
  }

  #updateDisplay(remaining) {
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    this.#minutesElement.textContent = String(minutes).padStart(2, '0');
    this.#secondsElement.textContent = String(seconds).padStart(2, '0');

    // Update ARIA live region
    this.#timerElement.setAttribute(
      'aria-label',
      `${minutes} minutos e ${seconds} segundos restantes`
    );

    // Add visual feedback when updating
    this.#animateNumberUpdate();
  }

  #animateNumberUpdate() {
    this.#minutesElement.style.transform = 'scale(1.1)';
    this.#secondsElement.style.transform = 'scale(1.1)';

    setTimeout(() => {
      this.#minutesElement.style.transform = 'scale(1)';
      this.#secondsElement.style.transform = 'scale(1)';
    }, 150);
  }

  #handleComplete() {
    clearInterval(this.#intervalId);
    this.#timerElement.classList.add('countdown-complete');
    this.#options.onComplete();

    // Update final display state
    this.#minutesElement.textContent = '00';
    this.#secondsElement.textContent = '00';
    this.#timerElement.setAttribute('aria-label', 'Promoção encerrada');
  }

  destroy() {
    clearInterval(this.#intervalId);
    this.#timerElement.removeAttribute('aria-label');
  }
}
