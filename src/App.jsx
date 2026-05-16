import React, { useEffect, useState } from "react";

const galleryImages = [
  {
    src: "/images/gallery/State karate championship/WhatsApp Image 2026-03-22 at 17.41.10 (1).jpeg",
    alt: "State karate championship event"
  },
  {
    src: "/images/gallery/State karate championship/WhatsApp Image 2026-03-22 at 17.41.10 (2).jpeg",
    alt: "State karate championship event"
  },
  {
    src: "/images/gallery/State karate championship/WhatsApp Image 2026-03-22 at 17.41.10.jpeg",
    alt: "State karate championship event"
  },
  {
    src: "/images/gallery/State karate championship/WhatsApp Image 2026-03-22 at 17.41.11 (1).jpeg",
    alt: "State karate championship event"
  },
  {
    src: "/images/gallery/State karate championship/WhatsApp Image 2026-03-22 at 17.41.11.jpeg",
    alt: "State karate championship event"
  },
  {
    src: "/images/gallery/District shooting chamiponship/WhatsApp Image 2026-03-22 at 17.41.11 (2).jpeg",
    alt: "District shooting championship event"
  },
  {
    src: "/images/gallery/District shooting chamiponship/WhatsApp Image 2026-03-22 at 17.41.11 (3).jpeg",
    alt: "District shooting championship event"
  },
  {
    src: "/images/gallery/District shooting chamiponship/WhatsApp Image 2026-03-22 at 17.41.12 (1).jpeg",
    alt: "District shooting championship event"
  },
  {
    src: "/images/gallery/District shooting chamiponship/WhatsApp Image 2026-03-22 at 17.41.12.jpeg",
    alt: "District shooting championship event"
  },
  {
    src: "/images/gallery/district kickboxing chamionship/WhatsApp Image 2026-03-22 at 18.13.10.jpeg",
    alt: "District kickboxing championship event"
  },
  {
    src: "/images/gallery/district kickboxing chamionship/WhatsApp Image 2026-03-22 at 18.13.10 (1).jpeg",
    alt: "District kickboxing championship event"
  },
  {
    src: "/images/gallery/district kickboxing chamionship/WhatsApp Image 2026-03-22 at 18.13.11.jpeg",
    alt: "District kickboxing championship event"
  }
];

const logoPath = "/images/gallery/Logo/WhatsApp Image 2026-03-22 at 18.20.12.jpeg";

export default function App() {
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    const staggerElements = Array.from(
      document.querySelectorAll(".cards .stagger, .workflow .stagger, .moving-gallery.stagger")
    );

    // Safe fallback: render content immediately so page is never blank.
    revealElements.forEach((el) => el.classList.add("is-visible"));
    staggerElements.forEach((el) => el.classList.add("is-visible"));

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observerOptions = { threshold: 0.14 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((section) => {
      observer.observe(section);
    });

    staggerElements.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * 90}ms`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setFormMessage("Please complete all fields with valid information.");
      return;
    }

    const data = new FormData(form);
    const payload = {
      fullName: data.get("fullName") || "",
      age: data.get("age") || "",
      gender: data.get("gender") || "",
      sport: data.get("sport") || "",
      district: data.get("district") || "",
      phone: data.get("phone") || ""
    };

    const getApiUrl = () => {
      // Use explicit env var if set
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }
      
      // Auto-detect for production Vercel deployment
      if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
        return window.location.origin;
      }
      
      // Default to localhost for development
      return "http://localhost:5001";
    };

    const apiBaseUrl = getApiUrl();

    try {
      setFormMessage("Submitting registration...");

      const response = await fetch(`${apiBaseUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        const errorText = Array.isArray(result.errors)
          ? result.errors.join(" | ")
          : result.message || "Registration failed";
        setFormMessage(errorText);
        return;
      }

      setFormMessage("Registration saved successfully.");
      form.reset();
    } catch (error) {
      setFormMessage(`Network error: ${error.message}`);
    }
  };

  return (
    <>
      <div className="bg-orb bg-orb-left" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-right" aria-hidden="true"></div>

      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#home" aria-label="Parakram Samiti home">
            <img src={logoPath} alt="Parakram Samiti logo" className="brand-logo" />
            <span className="brand-text">Parakram Samiti</span>
          </a>
          <nav className="nav" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#working">Working</a>
            <a href="#register">Registration</a>
            <a href="#gallery">Gallery</a>
            <a href="#leadership">Leadership</a>
          </nav>
        </div>
      </header>

      <main id="home">
        <section className="hero reveal">
          <div className="container hero-content">
            <img src={logoPath} alt="Parakram Samiti emblem" className="hero-logo" />
            <p className="eyebrow">Sports Development Authority</p>
            <h1>Parakram Samiti Regd.</h1>
            <p className="hero-intro">
              A registered sports development organization dedicated to athlete growth,
              recognized competitions, and disciplined training pathways.
            </p>
            <ul className="hero-credentials">
              <li>Registered under Trust Act, 1882 (Gov. of India)</li>
              <li>MSME (Gov. of India): UDYAM-UP-56-0049325 | ISO 9001:2015 Certified</li>
              <li>
                Conducting games recognized by Ministry of Youth Affairs and Sports (Gov. of India)
              </li>
            </ul>
            <p className="hero-copy">
              Parakram Samiti connects aspiring athletes with structured guidance, local
              opportunities, and high-performance pathways through inclusive sports programs.
            </p>
            <a className="cta" href="#register">
              Register Now
            </a>
          </div>
        </section>

        <section id="about" className="section container reveal">
          <div className="section-head">
            <h2>About The Website</h2>
            <p>
              This platform is the digital hub of Parakram Samiti, designed to simplify
              athlete registration, publish activity highlights, and maintain clear
              communication with sports communities.
            </p>
          </div>
          <div className="cards three-col">
            <article className="info-card stagger">
              <h3>Transparent Programs</h3>
              <p>
                Track camps, coaching sessions, and development activities with updates
                curated by authority coordinators.
              </p>
            </article>
            <article className="info-card stagger">
              <h3>Easy Access</h3>
              <p>
                Students, parents, and local clubs can explore opportunities and register
                with a simple verified form.
              </p>
            </article>
            <article className="info-card stagger">
              <h3>Performance Focus</h3>
              <p>
                Data-informed monitoring and mentorship help participants grow from
                grassroots levels to competitive stages.
              </p>
            </article>
          </div>
        </section>

        <section id="working" className="section container reveal">
          <div className="section-head">
            <h2>How It Works</h2>
          </div>
          <div className="workflow">
            <article className="step stagger">
              <span>01</span>
              <h3>Registration</h3>
              <p>Athletes submit core details, preferred sport, and district via the online form.</p>
            </article>
            <article className="step stagger">
              <span>02</span>
              <h3>Verification</h3>
              <p>
                The authority verifies information and maps participants to suitable batches
                and support programs.
              </p>
            </article>
            <article className="step stagger">
              <span>03</span>
              <h3>Training & Events</h3>
              <p>
                Members receive schedules, attend camps, and join district and state-level events.
              </p>
            </article>
          </div>
        </section>

        <section id="register" className="section container reveal">
          <div className="section-head">
            <h2>Registration Form</h2>
            <p>Complete the form to join Parakram Samiti initiatives.</p>
          </div>
          <form className="registration-form" onSubmit={handleSubmit} noValidate>
            <label>
              Full Name
              <input type="text" name="fullName" required />
            </label>
            <label>
              Age
              <input type="number" name="age" min="8" max="45" required />
            </label>
            <label>
              Gender
              <select name="gender" required>
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Sport Interest
              <input type="text" name="sport" required />
            </label>
            <label>
              District
              <input type="text" name="district" required />
            </label>
            <label>
              Contact Number
              <input type="tel" name="phone" pattern="[0-9]{10}" maxLength="10" required />
            </label>
            <button type="submit" className="cta secondary">
              Submit Registration
            </button>
            <p
              className="form-message"
              aria-live="polite"
              style={{ color: formMessage.includes("successfully") ? "#0f7a6c" : "#b83a19" }}
            >
              {formMessage}
            </p>
          </form>
        </section>

        <section id="gallery" className="section container reveal">
          <div className="section-head">
            <h2>Previous Gallery Of Events</h2>
            <p>Highlights from camps, championships, and outreach drives.</p>
          </div>
          <div className="moving-gallery stagger" aria-label="Moving events gallery">
            <div className="gallery-track">
              {[...galleryImages, ...galleryImages].map((image, index) => (
                <img
                  key={`${image.src}-${index}`}
                  className="gallery-photo"
                  src={image.src}
                  alt={image.alt}
                  aria-hidden={index >= galleryImages.length}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="leadership" className="section container reveal">
          <div className="section-head">
            <h2>Organization Heads</h2>
          </div>
          <div className="cards two-col">
            <article className="leader-card stagger">
              <img
                className="leader-photo"
                src="/images/President/WhatsApp Image 2026-03-22 at 17.41.09 (3).jpeg"
                alt="President of Parakram Samiti"
              />
              <h3>President</h3>
              <p className="name">Harsh Bhardwaj</p>
              <p>
                Leads strategic direction, public partnerships, and long-term sports
                development policy for Parakram Samiti.
              </p>
            </article>
            <article className="leader-card stagger">
              <img
                className="leader-photo"
                src="/images/VP/WhatsApp Image 2026-03-22 at 17.41.09 (1).jpeg"
                alt="Vice President of Parakram Samiti"
              />
              <h3>Vice President</h3>
              <p className="name">Aditya Nayaran Singh</p>
              <p>
                Oversees program execution, athlete welfare systems, and district level
                implementation frameworks.
              </p>
            </article>
          </div>

          <div className="section-head committee-head">
            <h2>Sports Committee Heads</h2>
            <p>Dedicated committee leadership for core sports verticals and support operations.</p>
          </div>
          <div className="cards four-col">
            <article className="leader-card stagger">
              <h3>Skating Head</h3>
              <p className="name">Aditya Nayaran Singh</p>
              <p>
                Leads skating talent scouting, rink training schedules, and safety standards
                for youth participants.
              </p>
            </article>
            <article className="leader-card stagger">
              <h3>Martial Arts Heads</h3>
              <p className="name">Harsh Bhardwaj</p>
              <p>
                Supervises martial arts coaching modules, discipline camps, and grading
                pathways across districts.
              </p>
            </article>
            <article className="leader-card stagger">
              <h3>Shooting Head</h3>
              <p className="name">Priyanshu Malik</p>
              <p>
                Manages shooting range preparation, technical mentorship, and event readiness
                for competitive shooters.
              </p>
            </article>
            <article className="leader-card stagger">
              <h3>Kickboxing Committee</h3>
              <p className="name">Aman Jain</p>
              <p>
                Leads kickboxing discipline planning, training coordination, and participant
                development activities.
              </p>
            </article>
          </div>
        </section>

        <section id="committee-members" className="section container reveal">
          <div className="section-head">
            <h2>Committee Members</h2>
            <p>
              Additional committee representation supporting Parakram Samiti martial arts
              programs.
            </p>
          </div>
          <div className="cards two-col">
            <article className="leader-card stagger">
              <h3>Martial Arts Committee Member</h3>
              <p className="name">Deepa Kashiya</p>
              <p>
                Supports discipline training activities, member coordination, and event
                participation planning.
              </p>
            </article>
            <article className="leader-card stagger">
              <h3>Martial Arts Committee Member</h3>
              <p className="name">Alish Prajapati</p>
              <p>
                Assists coaching support workflows, session organization, and participant
                development initiatives.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-brand">
            <img src={logoPath} alt="Parakram Samiti logo" className="footer-logo" />
            <p>Parakram Samiti | Sports Development Authority</p>
          </div>
        </div>
      </footer>
    </>
  );
}
