import React, { useEffect, useState } from 'react';
import './App.css';
import { ADMIN_EMAIL, isSupabaseConfigured, supabase } from './supabaseClient';

const ADMIN_USERNAME = 'Gemini';
const CONTENT_KEY = 'gemini-site-content';
const CSS_KEY = 'gemini-site-css';

const defaultContent = {
  navLinks: ['About', 'Services', 'Why Us', 'Contact Us'],
  brand: 'Gemini Electrical',
  badge: "Auckland's Trusted Electricians",
  heroTitle: 'Quality Electrical Work,', heroAccent: 'Every Time.',
  heroDescription: 'Registered, reliable, and local. Serving Auckland for all residential and commercial electrical needs - from rewires to emergency callouts.',
  primaryCta: 'Request a Free Quote', secondaryCta: 'View Our Services',
  stats: [['5+', 'Years Experience'], ['100+', 'Projects Completed'], ['100%', 'Registered Tradesmen'], ['24/7', 'Emergency Response']],
  aboutTag: 'Who We Are', aboutTitle: "Auckland's Local Electrical Experts",
  aboutDescription: 'Gemini Electricals is a locally owned and operated business delivering top-tier electrical solutions throughout Auckland.',
  aboutText: "Our registered electrician specialises in both residential and commercial projects, prioritising safety, quality, and customer satisfaction on every job. Whether it's a small repair or a full commercial fitout, we bring the same commitment to excellence.",
  aboutPoints: ['Fully registered and licensed electricians', 'Competitive, transparent pricing', 'On time, every time - we respect your schedule', 'All work backed by a workmanship guarantee', 'Servicing all of Auckland and surrounding areas'],
  servicesTag: 'What We Do', servicesTitle: 'Our Services', servicesDescription: 'From routine maintenance to major installations, we cover all aspects of residential and commercial electrical work.',
  services: [['🏠', 'House Rewiring', 'Full residential rewiring services to bring your home up to current safety standards.'], ['⚡', 'New Installations', 'Expert installation of new electrical systems for renovations, extensions, and new builds.'], ['🏢', 'Commercial Fitouts', 'End-to-end electrical solutions for retail, office, and industrial commercial spaces.'], ['💡', 'Lighting Upgrades', 'Energy-efficient LED and smart lighting upgrades for every room and outdoor area.'], ['🔌', 'Switchboard Upgrades', 'Modern switchboard replacements and upgrades for improved safety and capacity.'], ['🔧', 'Electrical Repairs', 'Fast, reliable fault-finding and repair for all electrical issues, big or small.'], ['🛡️', 'Safety Inspections', 'Comprehensive electrical inspections and certificates to keep your property compliant.'], ['🚨', '24/7 Emergency Callouts', 'Round-the-clock emergency response for urgent electrical faults and hazards.']],
  whyTag: 'Why Choose Us', whyTitle: 'The Gemini Difference', whyDescription: "We're not just electricians - we're your long-term electrical partner.",
  reasons: [['🏆', 'Licensed & Registered', 'All our work is carried out by fully licensed electricians, ensuring every job meets New Zealand safety standards.'], ['⚙️', 'Quality Workmanship', 'We take pride in clean, tidy, and reliable electrical work - done right the first time, every time.'], ['📞', 'Always Available', "Electrical emergencies don't keep business hours. Our team is on call 24/7 for urgent situations."]],
  contactTag: 'Get In Touch', contactTitle: 'Request a Free Quote', contactDescription: "Ready to get started? Reach out today - we'll get back to you promptly.",
  email: 'mail@geminielectrical.co.nz', phone: '027 342 5539', location: 'Auckland, New Zealand', hours: 'Mon-Fri 7am-6pm & 24/7 Emergencies',
};

function loadValue(key, fallback) {
  try { return window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : fallback; } catch (error) { return fallback; }
}

function mergeContent(content) {
  return { ...defaultContent, ...content };
}

function App() {
  const [content, setContent] = useState(() => mergeContent(loadValue(CONTENT_KEY, defaultContent)));
  const [customCss, setCustomCss] = useState(() => loadValue(CSS_KEY, ''));
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');

  useEffect(() => {
    const handlePopState = () => setIsAdmin(window.location.pathname === '/admin');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    supabase.from('site_content').select('content, custom_css').eq('id', 1).maybeSingle().then(({ data }) => {
      if (active && data) {
        setContent(mergeContent(data.content));
        setCustomCss(data.custom_css || '');
      }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'admin-custom-css';
    style.textContent = customCss;
    document.head.appendChild(style);
    return () => style.remove();
  }, [customCss]);

  if (isAdmin) return <AdminPanel content={content} setContent={setContent} customCss={customCss} setCustomCss={setCustomCss} onExit={() => { window.history.pushState({}, '', '/'); setIsAdmin(false); }} />;

  const navLinks = content.navLinks.map((label, index) => ({ href: ['#about', '#services', '#why-us', '#contact'][index], label }));
  const closeMenu = () => setMenuOpen(false);
  const handleChange = event => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = event => { event.preventDefault(); window.location.href = `mailto:${content.email}?subject=Quote Request from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message + '\n\nReply to: ' + form.email)}`; };
  const splitTitle = value => { const words = value.split(' '); return <>{words.slice(0, -1).join(' ')} <span>{words.at(-1)}</span></>; };

  return (
    <div>
      <nav className="nav"><a href="#hero" className="nav-logo" onClick={closeMenu}><span className="nav-logo-icon">⚡</span><span className="nav-logo-text">{content.brand.split(' ')[0]} <span>{content.brand.split(' ').slice(1).join(' ')}</span></span></a><div className="nav-links">{navLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}<a href="#contact" className="nav-cta">{content.primaryCta}</a></div><button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(open => !open)} aria-label="Toggle menu"><span /><span /><span /></button></nav>
      <div className={`mobile-menu${menuOpen ? ' active' : ''}`}><button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">✕</button><div className="mobile-menu-logo"><span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px #fbb040)' }}>⚡</span><span style={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem' }}>{content.brand}</span></div><nav className="mobile-menu-links">{navLinks.map(link => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>)}</nav><div className="mobile-menu-services"><p className="mobile-menu-services-title">Our Services</p>{content.services.map(service => <a key={service[1]} href="#services" className="mobile-menu-service-item" onClick={closeMenu}><span>{service[0]}</span>{service[1]}</a>)}</div><a href="#contact" className="btn-primary mobile-menu-cta" onClick={closeMenu}>{content.primaryCta}</a><div className="mobile-menu-contact"><a href={`tel:${content.phone.replace(/\D/g, '')}`}>📞 {content.phone}</a><a href={`mailto:${content.email}`}>✉ {content.email}</a></div></div>
      {menuOpen && <div className="mobile-menu-backdrop" onClick={closeMenu} />}
      <section className="hero" id="hero"><div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}><div className="hero-badge">{content.badge}</div><h1 className="hero-title">{content.heroTitle}<br /><span>{content.heroAccent}</span></h1><p className="hero-sub">{content.heroDescription}</p><div className="hero-buttons"><a href="#contact" className="btn-primary">{content.primaryCta}</a><a href="#services" className="btn-secondary">{content.secondaryCta}</a></div></div></section>
      <div className="stats-bar">{content.stats.map(stat => <div className="stat-item" key={stat[1]}><div className="stat-number">{stat[0]}</div><div className="stat-label">{stat[1]}</div></div>)}</div>
      <section className="section" id="about"><div className="section-inner"><span className="section-tag">{content.aboutTag}</span><h2 className="section-title">{splitTitle(content.aboutTitle)}</h2><p className="section-desc">{content.aboutDescription}</p><div className="about-grid"><div className="about-visual">⚡</div><div><p className="about-copy">{content.aboutText}</p><ul className="about-checkmarks">{content.aboutPoints.map(point => <li key={point}><span className="check-icon">✓</span>{point}</li>)}</ul></div></div></div></section>
      <section className="section services-section" id="services"><div className="section-inner"><span className="section-tag">{content.servicesTag}</span><h2 className="section-title">{splitTitle(content.servicesTitle)}</h2><p className="section-desc">{content.servicesDescription}</p><div className="services-grid">{content.services.map(service => <div className="service-card" key={service[1]}><span className="service-icon">{service[0]}</span><h4>{service[1]}</h4><p>{service[2]}</p></div>)}</div></div></section>
      <section className="section" id="why-us"><div className="section-inner why-section-inner"><span className="section-tag">{content.whyTag}</span><h2 className="section-title">{splitTitle(content.whyTitle)}</h2><p className="section-desc">{content.whyDescription}</p><div className="why-grid">{content.reasons.map(reason => <div className="why-card" key={reason[1]}><div className="why-icon">{reason[0]}</div><h4>{reason[1]}</h4><p>{reason[2]}</p></div>)}</div></div></section>
      <section className="section contact-section" id="contact"><div className="section-inner"><span className="section-tag">{content.contactTag}</span><h2 className="section-title">{splitTitle(content.contactTitle)}</h2><p className="section-desc">{content.contactDescription}</p><div className="contact-grid"><div><ContactItem icon="📧" title="Email">{content.email}</ContactItem><ContactItem icon="📞" title="Phone">{content.phone}</ContactItem><ContactItem icon="📍" title="Location">{content.location}</ContactItem><ContactItem icon="🕐" title="Hours">{content.hours}</ContactItem></div><form className="contact-form" onSubmit={handleSubmit}><input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required /><input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required /><textarea name="message" placeholder="Describe your job or question..." value={form.message} onChange={handleChange} required /><button type="submit" className="btn-primary">Send Message →</button></form></div></div></section>
      <footer className="footer"><div className="footer-top"><a href="#about">About</a><a href="#services">Services</a><a href="#why-us">Why Us</a><a href="#contact">Contact</a><a href={`tel:${content.phone.replace(/\D/g, '')}`}>{content.phone}</a></div><div className="footer-divider" /><div>&copy; {new Date().getFullYear()} {content.brand}. All Rights Reserved.</div><a className="admin-entry" href="/admin" title="Admin login" aria-label="Admin login">•</a></footer>
    </div>
  );
}

function ContactItem({ icon, title, children }) {
  return <div className="contact-item"><div className="contact-icon-wrap">{icon}</div><div><div className="contact-item-title">{title}</div><div className="contact-item-value">{title === 'Email' ? <a href={`mailto:${children}`}>{children}</a> : title === 'Phone' ? <a href={`tel:${children.replace(/\D/g, '')}`}>{children}</a> : children}</div></div></div>;
}

function AdminPanel({ content, setContent, customCss, setCustomCss, onExit }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [draft, setDraft] = useState(JSON.stringify(content, null, 2));
  const [cssDraft, setCssDraft] = useState(customCss);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => { setAuthenticated(Boolean(data.session)); setCheckingSession(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setAuthenticated(Boolean(session)));
    return () => listener.subscription.unsubscribe();
  }, []);
  const login = async event => {
    event.preventDefault();
    if (credentials.username !== ADMIN_USERNAME) { setMessage('Use Gemini as the username.'); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: credentials.password });
    if (error) setMessage('Incorrect username or password.');
  };
  const save = async event => {
    event.preventDefault();
    try {
      const nextContent = JSON.parse(draft);
      const { error } = await supabase.from('site_content').upsert({ id: 1, content: nextContent, custom_css: cssDraft, updated_at: new Date().toISOString() });
      if (error) throw error;
      setContent(mergeContent(nextContent)); setCustomCss(cssDraft); setMessage('Changes saved.');
    } catch (error) { setMessage(error instanceof SyntaxError ? 'The content editor contains invalid JSON.' : error.message); }
  };
  const reset = () => { setDraft(JSON.stringify(defaultContent, null, 2)); setCssDraft(''); setMessage('Reset ready. Click Save Changes to apply it.'); };
  if (!isSupabaseConfigured) return <main className="admin-shell"><div className="admin-login"><div className="admin-mark">⚡</div><p className="admin-kicker">Gemini Electrical</p><h1>Supabase setup required</h1><p className="admin-help">Add the Supabase values from <strong>.env.example</strong> to your local environment or hosting settings before signing in.</p><button className="admin-back" type="button" onClick={onExit}>Back to website</button></div></main>;
  if (checkingSession) return <main className="admin-shell"><div className="admin-login"><h1>Loading admin...</h1></div></main>;
  if (!authenticated) return <main className="admin-shell"><form className="admin-login" onSubmit={login}><div className="admin-mark">⚡</div><p className="admin-kicker">Gemini Electrical</p><h1>Admin login</h1><p className="admin-help">Sign in to edit the website content and CSS.</p><label>Username<input autoFocus value={credentials.username} onChange={event => setCredentials({ ...credentials, username: event.target.value })} /></label><label>Password<input type="password" value={credentials.password} onChange={event => setCredentials({ ...credentials, password: event.target.value })} /></label>{message && <p className="admin-error">{message}</p>}<button className="admin-save" type="submit">Sign in</button><button className="admin-back" type="button" onClick={onExit}>Back to website</button></form></main>;
  return <main className="admin-shell"><div className="admin-editor"><header className="admin-header"><div><p className="admin-kicker">Gemini Electrical</p><h1>Website editor</h1></div><div><button className="admin-back" type="button" onClick={() => supabase.auth.signOut()}>Sign out</button><button className="admin-back" type="button" onClick={onExit}>View website</button></div></header><p className="admin-help">Edit the page text as JSON and add CSS overrides. Changes are stored in Supabase.</p><form onSubmit={save}><label>Page content<textarea className="admin-code" value={draft} onChange={event => setDraft(event.target.value)} spellCheck="false" /></label><label>Custom CSS<textarea className="admin-code css-editor" value={cssDraft} onChange={event => setCssDraft(event.target.value)} spellCheck="false" placeholder=".hero { background: #111; }" /></label><div className="admin-actions"><button className="admin-save" type="submit">Save Changes</button><button className="admin-reset" type="button" onClick={reset}>Reset defaults</button>{message && <span className="admin-success">{message}</span>}</div></form></div></main>;
}

export default App;
