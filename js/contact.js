/**
 * Kazi Abir Hasan Portfolio
 * Contact Form Controller using EmailJS
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  // Initialize EmailJS with public key
  try {
    if (window.emailjs) {
      emailjs.init('fJENBGk_G-2Oa9M_P');
    }
  } catch (err) {
    console.error('EmailJS initialization error:', err);
  }

  const submitBtn = document.getElementById('contact-submit-btn');
  const alertBox = document.getElementById('contact-alert');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    if (!nameInput || !emailInput || !messageInput) return;

    // Button loading state
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    alertBox.className = 'form-status-alert';
    alertBox.style.display = 'none';

    const templateParams = {
      from_name: nameInput.value.trim(),
      from_email: emailInput.value.trim(),
      subject: subjectInput ? (subjectInput.value.trim() || 'Portfolio Inquiry') : 'Portfolio Inquiry',
      message: messageInput.value.trim()
    };

    emailjs.send('service_j7hj93j', 'template_ephfhvu', templateParams)
      .then(() => {
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
        alertBox.className = 'form-status-alert success';
        alertBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. I will get back to you shortly.';
        alertBox.style.display = 'block';
        form.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
        alertBox.className = 'form-status-alert error';
        alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Something went wrong sending the message. Please write directly to abirhasanmahin228@gmail.com';
        alertBox.style.display = 'block';
      });
  });
}
