const observerOptions = {
  threshold: 0.14
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((section) => {
  revealObserver.observe(section);
});

const staggerGroups = document.querySelectorAll(".cards .stagger, .workflow .stagger, .moving-gallery.stagger");
staggerGroups.forEach((item, index) => {
  item.style.transitionDelay = `${(index % 4) * 90}ms`;
  revealObserver.observe(item);
});

const form = document.getElementById("registrationForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    formMessage.textContent = "Please complete all fields with valid information.";
    formMessage.style.color = "#b83a19";
    return;
  }

  formMessage.textContent = "Registration submitted successfully. Our team will contact you soon.";
  formMessage.style.color = "#0f7a6c";
  form.reset();
});
