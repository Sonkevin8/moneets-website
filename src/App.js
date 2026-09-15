import React, { useEffect, useState } from 'react';
import './App.css';
import { ADMIN_EMAIL, isSupabaseConfigured, supabase } from './supabaseClient';

const ADMIN_USERNAME = 'Gemini';
const CONTENT_KEY = 'gemini-site-content';
const CSS_KEY = 'gemini-site-css';

const defaultContent = {
  navLinks: ['About', 'Services', 'Why Us', 'Contact Us'],
  mobileServicesTitle: 'Our Services',
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
  contactLabels: { email: 'Email', phone: 'Phone', location: 'Location', hours: 'Hours' },
  formNamePlaceholder: 'Your Name', formEmailPlaceholder: 'Your Email', formMessagePlaceholder: 'Describe your job or question...', formButton: 'Send Message →',
  footerCopyright: 'All Rights Reserved.',
  theme: { accent: '#fbb040', dark: '#0a1628', page: '#ffffff', text: '#16334a' },
  backgroundPhotos: [],
};

function loadValue(key, fallback) {
  try { return window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : fallback; } catch (error) { return fallback; }
}

function mergeContent(content) {
  return { ...defaultContent, ...content, contactLabels: { ...defaultContent.contactLabels, ...(content.contactLabels || {}) }, theme: { ...defaultContent.theme, ...(content.theme || {}) } };
}

function themeCss(theme) {
  return `.nav, .hero, .contact-section { --admin-accent: ${theme.accent}; --admin-dark: ${theme.dark}; }\n.nav-logo-text span, .hero-title span, .section-title span, .section-tag, .nav-links a:hover, .footer a:hover { color: ${theme.accent} !important; }\n.nav, .hero, .contact-section, .about-visual, .why-card { background-color: ${theme.dark}; }\nbody { background-color: ${theme.page}; color: ${theme.text}; }\n.stats-bar, .btn-primary { background-color: ${theme.accent}; }`;
}

function BackgroundCarousel({ photos }) {
  const [activePhoto, setActivePhoto] = useState(0);
  useEffect(() => {
    if (photos.length < 2) return undefined;
    const timer = window.setInterval(() => setActivePhoto(photo => (photo + 1) % photos.length), 6000);
    return () => window.clearInterval(timer);
  }, [photos.length]);
  return <div className="hero-background-carousel" aria-hidden="true">{photos.map((photo, index) => <img className={index === activePhoto ? 'active' : ''} key={photo} src={photo} alt="" />)}</div>;
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
    style.textContent = `${themeCss(content.theme)}\n${customCss}`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [customCss, content.theme]);

  if (isAdmin) return <AdminPanel content={content} setContent={setContent} customCss={customCss} setCustomCss={setCustomCss} onExit={() => { window.history.pushState({}, '', '/'); setIsAdmin(false); }} />;

  const navLinks = content.navLinks.map((label, index) => ({ href: ['#about', '#services', '#why-us', '#contact'][index], label }));
  const closeMenu = () => setMenuOpen(false);
  const handleChange = event => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = event => { event.preventDefault(); window.location.href = `mailto:${content.email}?subject=Quote Request from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message + '\n\nReply to: ' + form.email)}`; };
  const splitTitle = value => { const words = value.split(' '); return <>{words.slice(0, -1).join(' ')} <span>{words.at(-1)}</span></>; };

  return (
    <div>
      <nav className="nav"><a href="#hero" className="nav-logo" onClick={closeMenu}><span className="nav-logo-icon">⚡</span><span className="nav-logo-text">{content.brand.split(' ')[0]} <span>{content.brand.split(' ').slice(1).join(' ')}</span></span></a><div className="nav-links">{navLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}<a href="#contact" className="nav-cta">{content.primaryCta}</a></div><button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(open => !open)} aria-label="Toggle menu"><span /><span /><span /></button></nav>
      <div className={`mobile-menu${menuOpen ? ' active' : ''}`}><button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">✕</button><div className="mobile-menu-logo"><span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px #fbb040)' }}>⚡</span><span style={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem' }}>{content.brand}</span></div><nav className="mobile-menu-links">{navLinks.map(link => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>)}</nav><div className="mobile-menu-services"><p className="mobile-menu-services-title">{content.mobileServicesTitle}</p>{content.services.map(service => <a key={service[1]} href="#services" className="mobile-menu-service-item" onClick={closeMenu}><span>{service[0]}</span>{service[1]}</a>)}</div><a href="#contact" className="btn-primary mobile-menu-cta" onClick={closeMenu}>{content.primaryCta}</a><div className="mobile-menu-contact"><a href={`tel:${content.phone.replace(/\D/g, '')}`}>📞 {content.phone}</a><a href={`mailto:${content.email}`}>✉ {content.email}</a></div></div>
      {menuOpen && <div className="mobile-menu-backdrop" onClick={closeMenu} />}
      <section className="hero" id="hero"><BackgroundCarousel photos={content.backgroundPhotos} /><div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}><div className="hero-badge">{content.badge}</div><h1 className="hero-title">{content.heroTitle}<br /><span>{content.heroAccent}</span></h1><p className="hero-sub">{content.heroDescription}</p><div className="hero-buttons"><a href="#contact" className="btn-primary">{content.primaryCta}</a><a href="#services" className="btn-secondary">{content.secondaryCta}</a></div></div></section>
      <div className="stats-bar">{content.stats.map(stat => <div className="stat-item" key={stat[1]}><div className="stat-number">{stat[0]}</div><div className="stat-label">{stat[1]}</div></div>)}</div>
      <section className="section" id="about"><div className="section-inner"><span className="section-tag">{content.aboutTag}</span><h2 className="section-title">{splitTitle(content.aboutTitle)}</h2><p className="section-desc">{content.aboutDescription}</p><div className="about-grid"><div className="about-visual">⚡</div><div><p className="about-copy">{content.aboutText}</p><ul className="about-checkmarks">{content.aboutPoints.map(point => <li key={point}><span className="check-icon">✓</span>{point}</li>)}</ul></div></div></div></section>
      <section className="section services-section" id="services"><div className="section-inner"><span className="section-tag">{content.servicesTag}</span><h2 className="section-title">{splitTitle(content.servicesTitle)}</h2><p className="section-desc">{content.servicesDescription}</p><div className="services-grid">{content.services.map(service => <div className="service-card" key={service[1]}><span className="service-icon">{service[0]}</span><h4>{service[1]}</h4><p>{service[2]}</p></div>)}</div></div></section>
      <section className="section" id="why-us"><div className="section-inner why-section-inner"><span className="section-tag">{content.whyTag}</span><h2 className="section-title">{splitTitle(content.whyTitle)}</h2><p className="section-desc">{content.whyDescription}</p><div className="why-grid">{content.reasons.map(reason => <div className="why-card" key={reason[1]}><div className="why-icon">{reason[0]}</div><h4>{reason[1]}</h4><p>{reason[2]}</p></div>)}</div></div></section>
      <section className="section contact-section" id="contact"><div className="section-inner"><span className="section-tag">{content.contactTag}</span><h2 className="section-title">{splitTitle(content.contactTitle)}</h2><p className="section-desc">{content.contactDescription}</p><div className="contact-grid"><div><ContactItem icon="📧" title={content.contactLabels.email} type="email">{content.email}</ContactItem><ContactItem icon="📞" title={content.contactLabels.phone} type="phone">{content.phone}</ContactItem><ContactItem icon="📍" title={content.contactLabels.location}>{content.location}</ContactItem><ContactItem icon="🕐" title={content.contactLabels.hours}>{content.hours}</ContactItem></div><form className="contact-form" onSubmit={handleSubmit}><input type="text" name="name" placeholder={content.formNamePlaceholder} value={form.name} onChange={handleChange} required /><input type="email" name="email" placeholder={content.formEmailPlaceholder} value={form.email} onChange={handleChange} required /><textarea name="message" placeholder={content.formMessagePlaceholder} value={form.message} onChange={handleChange} required /><button type="submit" className="btn-primary">{content.formButton}</button></form></div></div></section>
      <footer className="footer"><div className="footer-top">{navLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}<a href={`tel:${content.phone.replace(/\D/g, '')}`}>{content.phone}</a></div><div className="footer-divider" /><div>&copy; {new Date().getFullYear()} {content.brand}. {content.footerCopyright}</div><a className="admin-entry" href="/admin" title="Admin login" aria-label="Admin login">•</a></footer>
    </div>
  );
}

function ContactItem({ icon, title, type, children }) {
  const value = type === 'email' ? <a href={`mailto:${children}`}>{children}</a> : type === 'phone' ? <a href={`tel:${children.replace(/\D/g, '')}`}>{children}</a> : children;
  return <div className="contact-item"><div className="contact-icon-wrap">{icon}</div><div><div className="contact-item-title">{title}</div><div className="contact-item-value">{value}</div></div></div>;
}

function AdminPanel({ content, setContent, customCss, setCustomCss, onExit }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [draft, setDraft] = useState(JSON.stringify(content, null, 2));
  const [cssDraft, setCssDraft] = useState(customCss);
  const [easyDraft, setEasyDraft] = useState(content);
  const [themeDraft, setThemeDraft] = useState(content.theme);
  const [backgroundFiles, setBackgroundFiles] = useState([]);
  const [removedBackgroundPhotos, setRemovedBackgroundPhotos] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => { setAuthenticated(Boolean(data.session)); setCheckingSession(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setAuthenticated(Boolean(session)));
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const handleBackgroundFiles = event => setBackgroundFiles(event.detail);
    window.addEventListener('background-files-selected', handleBackgroundFiles);
    return () => window.removeEventListener('background-files-selected', handleBackgroundFiles);
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
      let backgroundPhotos = [...(easyDraft.backgroundPhotos || [])];
      if (backgroundFiles.length) {
        const uploadedPhotos = await Promise.all(backgroundFiles.map(async (file, index) => {
          if (!file) return backgroundPhotos[index] || null;
          const path = `${Date.now()}-${index}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
          const { error: uploadError } = await supabase.storage.from('site-backgrounds').upload(path, file, { upsert: true, contentType: file.type });
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('site-backgrounds').getPublicUrl(path);
          return data.publicUrl;
        }));
        backgroundPhotos = uploadedPhotos.filter(Boolean);
      }
      if (removedBackgroundPhotos.length) {
        const paths = removedBackgroundPhotos.map(photo => photo.split('/storage/v1/object/public/site-backgrounds/')[1]).filter(Boolean);
        if (paths.length) await supabase.storage.from('site-backgrounds').remove(paths);
      }
      const nextContent = { ...easyDraft, theme: themeDraft, backgroundPhotos };
      const { error } = await supabase.from('site_content').upsert({ id: 1, content: nextContent, custom_css: cssDraft, updated_at: new Date().toISOString() });
      if (error) throw error;
      setContent(mergeContent(nextContent)); setCustomCss(cssDraft); setDraft(JSON.stringify(nextContent, null, 2)); setBackgroundFiles([]); setRemovedBackgroundPhotos([]); setMessage('All changes saved.');
    } catch (error) { setMessage(error instanceof SyntaxError ? 'The content editor contains invalid JSON.' : error.message); }
  };
  const updateEasy = (field, value) => setEasyDraft(current => ({ ...current, [field]: value }));
  const updateService = (index, column, value) => setEasyDraft(current => ({ ...current, services: current.services.map((service, serviceIndex) => serviceIndex === index ? service.map((item, itemIndex) => itemIndex === column ? value : item) : service) }));
  const reset = () => { setEasyDraft(defaultContent); setThemeDraft(defaultContent.theme); setDraft(JSON.stringify(defaultContent, null, 2)); setCssDraft(''); setBackgroundFiles([]); setRemovedBackgroundPhotos([]); setMessage('Reset ready. Click Save Changes to apply it.'); };
  if (!isSupabaseConfigured) return <main className="admin-shell"><div className="admin-login"><div className="admin-mark">⚡</div><p className="admin-kicker">Gemini Electrical</p><h1>Supabase setup required</h1><p className="admin-help">Add the Supabase values from <strong>.env.example</strong> to your local environment or hosting settings before signing in.</p><button className="admin-back" type="button" onClick={onExit}>Back to website</button></div></main>;
  if (checkingSession) return <main className="admin-shell"><div className="admin-login"><h1>Loading admin...</h1></div></main>;
  if (!authenticated) return <main className="admin-shell"><form className="admin-login" onSubmit={login}><div className="admin-mark">⚡</div><p className="admin-kicker">Gemini Electrical</p><h1>Admin login</h1><p className="admin-help">Sign in to edit the website content and CSS.</p><label>Username<input autoFocus value={credentials.username} onChange={event => setCredentials({ ...credentials, username: event.target.value })} /></label><label>Password<input type="password" value={credentials.password} onChange={event => setCredentials({ ...credentials, password: event.target.value })} /></label>{message && <p className="admin-error">{message}</p>}<button className="admin-save" type="submit">Sign in</button><button className="admin-back" type="button" onClick={onExit}>Back to website</button></form></main>;
  const handleAdvancedContent = event => { const value = event.target.value; setDraft(value); try { setEasyDraft(mergeContent(JSON.parse(value))); } catch (error) { setMessage('Finish the JSON before saving.'); } };
  const handlePhotoChange = (index, file) => { const existingPhoto = easyDraft.backgroundPhotos[index]; if (existingPhoto) setRemovedBackgroundPhotos(current => [...current, existingPhoto]); setBackgroundFiles(current => { const next = [...current]; next[index] = file; return next; }); };
  const handlePhotoRemove = index => { const photo = easyDraft.backgroundPhotos[index]; if (photo) setRemovedBackgroundPhotos(current => [...current, photo]); setEasyDraft(current => ({ ...current, backgroundPhotos: current.backgroundPhotos.filter((_item, photoIndex) => photoIndex !== index) })); setBackgroundFiles(current => { const next = [...current]; next.splice(index, 1); return next; }); };
  window.__adminPhotoState = { photos: easyDraft.backgroundPhotos, onChange: handlePhotoChange, onRemove: handlePhotoRemove };
  return <main className="admin-shell"><div className="admin-editor"><header className="admin-header"><div><p className="admin-kicker">Gemini Electrical</p><h1>Easy website editor</h1></div><div><button className="admin-back" type="button" onClick={() => supabase.auth.signOut()}>Sign out</button><button className="admin-back" type="button" onClick={onExit}>View website</button></div></header><p className="admin-help">Change the words and colors below. You do not need coding experience. Click Save Changes when finished.</p><form onSubmit={save}><section className="easy-section"><h2>Main page</h2><div className="easy-grid"><EditorField label="Business name" value={easyDraft.brand} onChange={value => updateEasy('brand', value)} /><EditorField label="Hero badge" value={easyDraft.badge} onChange={value => updateEasy('badge', value)} /><EditorField label="Main headline" value={easyDraft.heroTitle} onChange={value => updateEasy('heroTitle', value)} /><EditorField label="Headline highlight" value={easyDraft.heroAccent} onChange={value => updateEasy('heroAccent', value)} /><EditorField label="Hero description" value={easyDraft.heroDescription} onChange={value => updateEasy('heroDescription', value)} area /><EditorField label="Main button" value={easyDraft.primaryCta} onChange={value => updateEasy('primaryCta', value)} /><EditorField label="Secondary button" value={easyDraft.secondaryCta} onChange={value => updateEasy('secondaryCta', value)} /></div></section><section className="easy-section"><h2>About section</h2><div className="easy-grid"><EditorField label="Section label" value={easyDraft.aboutTag} onChange={value => updateEasy('aboutTag', value)} /><EditorField label="Heading" value={easyDraft.aboutTitle} onChange={value => updateEasy('aboutTitle', value)} /><EditorField label="Description" value={easyDraft.aboutDescription} onChange={value => updateEasy('aboutDescription', value)} area /><EditorField label="About text" value={easyDraft.aboutText} onChange={value => updateEasy('aboutText', value)} area /></div></section><section className="easy-section"><h2>Services</h2>{easyDraft.services.map((service, index) => <div className="service-edit-row" key={index}><EditorField label="Icon" value={service[0]} onChange={value => updateService(index, 0, value)} /><EditorField label="Service name" value={service[1]} onChange={value => updateService(index, 1, value)} /><EditorField label="Description" value={service[2]} onChange={value => updateService(index, 2, value)} area /></div>)}</section><section className="easy-section"><h2>Contact details</h2><div className="easy-grid"><EditorField label="Email" value={easyDraft.email} onChange={value => updateEasy('email', value)} /><EditorField label="Phone" value={easyDraft.phone} onChange={value => updateEasy('phone', value)} /><EditorField label="Location" value={easyDraft.location} onChange={value => updateEasy('location', value)} /><EditorField label="Opening hours" value={easyDraft.hours} onChange={value => updateEasy('hours', value)} /><EditorField label="Contact button" value={easyDraft.formButton} onChange={value => updateEasy('formButton', value)} /></div></section><section className="easy-section"><h2>Colors</h2><div className="color-grid"><ColorField label="Accent color" value={themeDraft.accent} onChange={value => setThemeDraft({ ...themeDraft, accent: value })} /><ColorField label="Dark color" value={themeDraft.dark} onChange={value => setThemeDraft({ ...themeDraft, dark: value })} /><ColorField label="Page background" value={themeDraft.page} onChange={value => setThemeDraft({ ...themeDraft, page: value })} /><ColorField label="Text color" value={themeDraft.text} onChange={value => setThemeDraft({ ...themeDraft, text: value })} /></div></section><details className="advanced-editor"><summary>Advanced editing</summary><p className="admin-help">Use these only if you need to edit fields not shown above or add custom CSS rules.</p><label>All page content<textarea className="admin-code" value={draft} onChange={handleAdvancedContent} spellCheck="false" /></label><label>Custom CSS<textarea className="admin-code css-editor" value={cssDraft} onChange={event => setCssDraft(event.target.value)} spellCheck="false" placeholder=".hero { background: #111; }" /></label></details><div className="admin-actions"><button className="admin-save" type="submit">Save Changes</button><button className="admin-reset" type="button" onClick={reset}>Reset defaults</button>{message && <span className="admin-success">{message}</span>}</div></form></div></main>;
}

function EditorField({ label, value, onChange, area = false, photos, onPhotoChange, onPhotoRemove }) {
  const Input = area ? 'textarea' : 'input';
  const photoState = window.__adminPhotoState;
  return <label className="editor-field">{label}<Input value={value || ''} onChange={event => onChange(event.target.value)} />{(photos || label === 'Business name') && photoState && <BackgroundPhotoManager photos={photos || photoState.photos} onPhotoChange={onPhotoChange || photoState.onChange} onPhotoRemove={onPhotoRemove || photoState.onRemove} />}</label>;
}

function BackgroundPhotoManager({ photos, onPhotoChange, onPhotoRemove }) {
  return <div className="photo-manager"><small className="photo-label">Hero background photos. Replace or remove each image, then click Save Changes.</small>{Array.from({ length: 6 }, (_, index) => <div className="photo-slot" key={index}>{photos[index] ? <img src={photos[index]} alt={`Carousel ${index + 1}`} /> : <span className="photo-empty">Empty slot</span>}<span className="photo-slot-label">Photo {index + 1}</span><input className="photo-picker" type="file" accept="image/*" onChange={event => onPhotoChange(index, event.target.files[0])} />{photos[index] && <button className="photo-remove" type="button" onClick={() => onPhotoRemove(index)}>Remove</button>}</div>)}</div>;
}

function ColorField({ label, value, onChange }) {
  return <label className="color-field">{label}<span><input type="color" value={value} onChange={event => onChange(event.target.value)} /><input value={value} onChange={event => onChange(event.target.value)} /></span></label>;
}

export default App;
