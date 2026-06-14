
import React, { useState } from 'react';
import './App.css';

const services = [
  {
    icon: '🏠',
    title: 'House Rewiring',
    desc: 'Full residential rewiring services to bring your home up to current safety standards.',
  },
  {
    icon: '⚡',
    title: 'New Installations',
    desc: 'Expert installation of new electrical systems for renovations, extensions, and new builds.',
  },
  {
    icon: '🏢',
    title: 'Commercial Fitouts',
    desc: 'End-to-end electrical solutions for retail, office, and industrial commercial spaces.',
  },
  {
    icon: '💡',
    title: 'Lighting Upgrades',
    desc: 'Energy-efficient LED and smart lighting upgrades for every room and outdoor area.',
  },
  {
    icon: '🔌',
    title: 'Switchboard Upgrades',
    desc: 'Modern switchboard replacements and upgrades for improved safety and capacity.',
  },
  {
    icon: '🔧',
    title: 'Electrical Repairs',
    desc: 'Fast, reliable fault-finding and repair for all electrical issues, big or small.',
  },
  {
    icon: '🛡️',
    title: 'Safety Inspections',
    desc: 'Comprehensive electrical inspections and certificates to keep your property compliant.',
  },
  {
    icon: '🚨',
    title: '24/7 Emergency Callouts',
    desc: 'Round-the-clock emergency response for urgent electrical faults and hazards.',
  },
];

function App() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    window.location.href = `mailto:mail@geminielectrical.co.nz?subject=Quote Request from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message + '\n\nReply to: ' + form.email)}`;
  };

  return (
    <div>
      {/* ── NAV ── */}
      <nav className="nav">
        <a href="#hero" className="nav-logo">
          <span className="nav-logo-icon">⚡</span>
          <span className="nav-logo-text">Gemini <span>Electrical</span></span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#why-us">Why Us</a>
          <a href="#contact" className="nav-cta">Get a Quote</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div style={{position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto'}}>
          <div className="hero-badge">Auckland's Trusted Electricians</div>
          <h1 className="hero-title">
            Quality Electrical Work,<br /><span>Every Time.</span>
          </h1>
          <p className="hero-sub">
            Registered, reliable, and local. Serving Auckland for all residential and commercial electrical needs — from rewires to emergency callouts.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">Request a Free Quote</a>
            <a href="#services" className="btn-secondary">View Our Services</a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">5+</div>
          <div className="stat-label">Years Experience</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100+</div>
          <div className="stat-label">Projects Completed</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Registered Tradesmen</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Emergency Response</div>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section className="section" id="about">
        <div className="section-inner">
          <span className="section-tag">Who We Are</span>
          <h2 className="section-title">Auckland's Local <span>Electrical Experts</span></h2>
          <p className="section-desc">
            Gemini Electricals is a locally owned and operated business delivering top-tier electrical solutions throughout Auckland.
          </p>
          <div className="about-grid">
            <div className="about-visual">⚡</div>
            <div>
              <p style={{color: '#2d4f63', lineHeight: 1.75, fontSize: '1.02rem'}}>
                Our registered electrician specialises in both residential and commercial projects, prioritising safety, quality, and customer satisfaction on every job. Whether it's a small repair or a full commercial fitout, we bring the same commitment to excellence.
              </p>
              <ul className="about-checkmarks">
                <li><span className="check-icon">✓</span>Fully registered and licensed electricians</li>
                <li><span className="check-icon">✓</span>Competitive, transparent pricing</li>
                <li><span className="check-icon">✓</span>On time, every time — we respect your schedule</li>
                <li><span className="check-icon">✓</span>All work backed by a workmanship guarantee</li>
                <li><span className="check-icon">✓</span>Servicing all of Auckland and surrounding areas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section services-section" id="services">
        <div className="section-inner">
          <span className="section-tag">What We Do</span>
          <h2 className="section-title">Our <span>Services</span></h2>
          <p className="section-desc">
            From routine maintenance to major installations, we cover all aspects of residential and commercial electrical work.
          </p>
          <div className="services-grid">
            {services.map(s => (
              <div className="service-card" key={s.title}>
                <span className="service-icon">{s.icon}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section" id="why-us">
        <div className="section-inner" style={{textAlign: 'center'}}>
          <span className="section-tag">Why Choose Us</span>
          <h2 className="section-title" style={{margin: '0 auto 12px'}}>The Gemini <span>Difference</span></h2>
          <p className="section-desc" style={{margin: '0 auto'}}>
            We're not just electricians — we're your long-term electrical partner.
          </p>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🏆</div>
              <h4>Licensed &amp; Registered</h4>
              <p>All our work is carried out by fully licensed electricians, ensuring every job meets New Zealand safety standards.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">⚙️</div>
              <h4>Quality Workmanship</h4>
              <p>We take pride in clean, tidy, and reliable electrical work — done right the first time, every time.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">📞</div>
              <h4>Always Available</h4>
              <p>Electrical emergencies don't keep business hours. Our team is on call 24/7 for urgent situations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="section contact-section" id="contact">
        <div className="section-inner">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">Request a <span>Free Quote</span></h2>
          <p className="section-desc">
            Ready to get started? Reach out today — we'll get back to you promptly.
          </p>
          <div className="contact-grid">
            <div>
              <div className="contact-item">
                <div className="contact-icon-wrap">📧</div>
                <div>
                  <div className="contact-item-title">Email</div>
                  <div className="contact-item-value">
                    <a href="mailto:mail@geminielectrical.co.nz">mail@geminielectrical.co.nz</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon-wrap">📞</div>
                <div>
                  <div className="contact-item-title">Phone</div>
                  <div className="contact-item-value">
                    <a href="tel:+64273425539">027 342 5539</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon-wrap">📍</div>
                <div>
                  <div className="contact-item-title">Location</div>
                  <div className="contact-item-value">Auckland, New Zealand</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon-wrap">🕐</div>
                <div>
                  <div className="contact-item-title">Hours</div>
                  <div className="contact-item-value">Mon–Fri 7am–6pm &amp; 24/7 Emergencies</div>
                </div>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Describe your job or question..."
                value={form.message}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn-primary">Send Message →</button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-top">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#why-us">Why Us</a>
          <a href="#contact">Contact</a>
          <a href="tel:+64273425539">027 342 5539</a>
        </div>
        <div className="footer-divider" />
        <div>&copy; {new Date().getFullYear()} Gemini Electricals. All Rights Reserved.</div>
      </footer>
    </div>
  );
}

export default App;
