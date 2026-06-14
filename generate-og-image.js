const sharp = require('sharp');
const path = require('path');

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#060f1d"/>
      <stop offset="55%"  stop-color="#0d2035"/>
      <stop offset="100%" stop-color="#0d3352"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#fbb040"/>
      <stop offset="100%" stop-color="#f5a000"/>
    </linearGradient>
    <radialGradient id="glow1" cx="15%" cy="75%" r="45%">
      <stop offset="0%"  stop-color="#fbb040" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#fbb040" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="85%" cy="25%" r="40%">
      <stop offset="0%"  stop-color="#1a6a9a" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#1a6a9a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Grid lines (subtle) -->
  <line x1="0" y1="1" x2="${W}" y2="1" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
  <line x1="0" y1="${H-1}" x2="${W}" y2="${H-1}" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>

  <!-- Gold accent bar top -->
  <rect x="0" y="0" width="${W}" height="6" fill="url(#gold)"/>

  <!-- Gold accent bar bottom -->
  <rect x="0" y="${H-6}" width="${W}" height="6" fill="url(#gold)"/>

  <!-- Left decorative vertical line -->
  <rect x="70" y="60" width="4" height="510" rx="2" fill="#fbb040" fill-opacity="0.35"/>

  <!-- Lightning bolt icon -->
  <text x="108" y="232" font-family="Arial" font-size="96" fill="#fbb040" opacity="0.95">&#x26A1;</text>

  <!-- Company name -->
  <text x="108" y="308"
    font-family="Arial Black, Arial" font-weight="900" font-size="72"
    fill="#ffffff" letter-spacing="-1">Gemini</text>
  <text x="108" y="390"
    font-family="Arial Black, Arial" font-weight="900" font-size="72"
    fill="url(#gold)" letter-spacing="-1">Electrical</text>

  <!-- Tagline -->
  <text x="108" y="440"
    font-family="Arial, sans-serif" font-weight="400" font-size="28"
    fill="#7aaec8" letter-spacing="0.5">Quality Electrical Work, Every Time.</text>

  <!-- Divider line -->
  <line x1="108" y1="468" x2="660" y2="468" stroke="#fbb040" stroke-opacity="0.4" stroke-width="1.5"/>

  <!-- Contact row -->
  <text x="108" y="502"
    font-family="Arial, sans-serif" font-size="24" fill="#9bbdd1">
    &#x1F4DE;  027 342 5539
  </text>
  <text x="340" y="502"
    font-family="Arial, sans-serif" font-size="24" fill="#9bbdd1">
    &#x2709;  mail@geminielectrical.co.nz
  </text>

  <!-- Badge pill: Auckland -->
  <rect x="108" y="525" width="200" height="44" rx="22" fill="#fbb040" fill-opacity="0.12" stroke="#fbb040" stroke-opacity="0.4" stroke-width="1.5"/>
  <text x="208" y="553" text-anchor="middle"
    font-family="Arial, sans-serif" font-weight="700" font-size="18"
    fill="#fbb040" letter-spacing="1.5">AUCKLAND, NZ</text>

  <!-- Right side: services list -->
  <text x="760" y="175"
    font-family="Arial, sans-serif" font-weight="700" font-size="18"
    fill="#fbb040" letter-spacing="2">OUR SERVICES</text>

  ${[
    'House Rewiring',
    'New Installations',
    'Commercial Fitouts',
    'Lighting Upgrades',
    'Switchboard Upgrades',
    'Electrical Repairs',
    'Safety Inspections',
    '24/7 Emergency Callouts',
  ].map((s, i) => `
  <circle cx="775" cy="${210 + i * 50}" r="5" fill="#fbb040"/>
  <text x="795" y="${217 + i * 50}"
    font-family="Arial, sans-serif" font-size="22"
    fill="#ccdde8">${s}</text>
  `).join('')}

  <!-- Right side bottom: registered badge -->
  <rect x="760" y="570" width="370" height="40" rx="8"
    fill="#fbb040" fill-opacity="0.1" stroke="#fbb040" stroke-opacity="0.3" stroke-width="1"/>
  <text x="945" y="596" text-anchor="middle"
    font-family="Arial, sans-serif" font-weight="700" font-size="16"
    fill="#fbb040" letter-spacing="1">&#x2713;  REGISTERED ELECTRICIAN</text>
</svg>
`;

const outPath = path.join(__dirname, 'public', 'og-image.png');

sharp(Buffer.from(svg))
  .png()
  .toFile(outPath)
  .then(() => console.log('✅  OG image saved to public/og-image.png'))
  .catch(err => { console.error('❌  Error:', err.message); process.exit(1); });
