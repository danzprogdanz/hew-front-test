// lead-form.js
export class LeadForm {
  constructor(formSelector, { onSubmit, onError }) {
    this.form = document.querySelector(formSelector);
    this.callbacks = { onSubmit, onError };
    this.init();
  }

  init() {
    this.setupInputMasks();
    this.setupEventListeners();
    this.initLiveValidation();
  }

  setupEventListeners() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.form.addEventListener('input', this.handleInput.bind(this));
  }

  setupInputMasks() {
    const phoneInput = this.form.querySelector('#phone');
    phoneInput.addEventListener('input', this.maskPhoneNumber.bind(this));
  }

  maskPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    value = value
      .replace(/^(\d{0,2})/, '($1')
      .replace(/^(\(\d{2})(\d)/, '$1) $2')
      .replace(/(\d{5})(\d{1,4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');

    e.target.value = value;
  }

  initLiveValidation() {
    this.form.querySelectorAll('input').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });
  }

  handleInput(e) {
    if (e.target.tagName === 'INPUT') {
      this.validateField(e.target);
    }
  }

  validateField(field) {
    switch (field.id) {
      case 'name':
        return this.validateName(field);
      case 'email':
        return this.validateEmail(field);
      case 'phone':
        return this.validatePhone(field);
      default:
        return true;
    }
  }

  validateName(field) {
    const isValid = field.value.trim().length >= 3;
    this.setValidity(field, isValid, 'Por favor, insira seu nome completo');
    return isValid;
  }

  validateEmail(field) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    this.setValidity(field, isValid, 'Ops, este e-mail parece inválido. Confira, por favor!');
    return isValid;
  }

  validatePhone(field) {
    const isValid = /^\(\d{2}\) \d{5}-\d{4}$/.test(field.value);
    this.setValidity(
      field,
      isValid,
      'Ops, este telefone parece inválido. Confira, por favor!'
    );
    return isValid;
  }

  setValidity(field, isValid, message) {
    const errorElement = field.nextElementSibling;
    field.classList.toggle('invalid', !isValid);
    field.setAttribute('aria-invalid', !isValid);
    
    if (!isValid) {
      errorElement.textContent = message;
      errorElement.setAttribute('aria-live', 'polite');
    } else {
      errorElement.textContent = '';
      errorElement.removeAttribute('aria-live');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const fields = this.form.elements;
    const isValid = [
      this.validateName(fields.name),
      this.validateEmail(fields.email),
      this.validatePhone(fields.phone)
    ].every(valid => valid);

    if (!isValid) {
      this.callbacks.onError(new Error('Validation failed'));
      return;
    }

    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Trigger pre-transition animation
      this.form.classList.add('submitting');
      
      // Wait for animation frame
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Execute submit callback
      await this.callbacks.onSubmit(data);
      
    } catch (error) {
      this.form.classList.remove('submitting');
      this.callbacks.onError(error);
    }
  }
}