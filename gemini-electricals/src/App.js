
import React from 'react';
import './App.css';

function App() {
  return (
    <div>
      {/* HEADER */}
      <header style={{backgroundColor: "#102b3f", color: "#fff", padding: "20px 0"}}>
        <div style={{maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Gemini Electricals</h1>
          <nav>
            <a href="#about" style={{color: "#fff", margin: '0 12px'}}>About</a>
            <a href="#services" style={{color: "#fff", margin: '0 12px'}}>Services</a>
            <a href="#contact" style={{color: "#fff", margin: '0 12px'}}>Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{background: "#e8f0fe", padding: "60px 0", textAlign: "center"}}>
        <h2>Quality Electrical Work, Every Time</h2>
        <p>Registered, reliable, and local. Serving Auckland for all residential and commercial electrical needs.</p>
        <a href="#contact" style={{background: "#fbb040", color: "#102b3f", padding: "12px 28px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold"}}>Request a Quote</a>
      </section>

      {/* ABOUT */}
      <section id="about" style={{maxWidth: '900px', margin: '40px auto', padding: '0 20px'}}>
        <h3>About Gemini Electricals</h3>
        <p>
          Gemini Electricals is a locally owned and operated business, delivering top-tier electrical solutions throughout Auckland. 
          Our registered electrician specializes in both residential and commercial projects, prioritizing safety, quality, and customer satisfaction.
        </p>
      </section>

      {/* SERVICES */}
      <section id="services" style={{background: "#f0f0f0", padding: "40px 0"}}>
        <div style={{maxWidth: '900px', margin: '0 auto', padding: '0 20px'}}>
          <h3>Our Services</h3>
          <ul style={{columns: 2, listStyleType: "square", fontSize: 17}}>
            <li>House Rewiring</li>
            <li>New Installations</li>
            <li>Commercial Fitouts</li>
            <li>Lighting Upgrades</li>
            <li>Switchboard Upgrades</li>
            <li>Electrical Repairs</li>
            <li>Safety Inspections</li>
            <li>24/7 Emergency Callouts</li>
          </ul>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{maxWidth: '900px', margin: '40px auto', padding: '0 20px'}}>
        <h3>Contact Us</h3>
        <p>Email: <a href="mailto:info@geminielectricals.co.nz">info@geminielectricals.co.nz</a></p>
        <p>Phone: <a href="tel:+64210123456">021 012 3456</a></p>
        <p>Or use our <a href="mailto:info@geminielectricals.co.nz">email form</a> to get a free quote!</p>
      </section>

      {/* FOOTER */}
      <footer style={{background: "#102b3f", color: "#fff", textAlign: "center", padding: "15px 0", marginTop: 40}}>
        &copy; {new Date().getFullYear()} Gemini Electricals. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;
