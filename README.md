# Om Function Hall And Gardens

Premium wedding and event venue website built with React + Vite.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
om-function-hall/
├── public/
│   ├── index.html      # SEO-optimized HTML with JSON-LD schemas
│   ├── robots.txt      # Search engine crawling rules
│   └── sitemap.xml     # XML sitemap for SEO
├── src/
│   ├── App.jsx         # Main React component
│   ├── App.css         # All styles (CSS variables, animations, responsive)
│   └── main.jsx        # React entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── .gitignore
```

## Features

- Fully responsive design (mobile, tablet, desktop)
- Scroll-triggered animations
- WhatsApp booking integration
- Google Maps embedded
- SEO optimized with structured data (JSON-LD)
- Floating action buttons (WhatsApp + Call)
- Contact form with validation
- Beautiful gold/cream color scheme

## Customization

Update these values in `src/App.jsx`:

```javascript
const PHONE = "+919876543210";      // Your phone number
const WHATSAPP = "919876543210";    // WhatsApp number (no + symbol)
const EMAIL = "your@email.com";     // Your email
```

Also update the same values in `public/index.html` for SEO.

## Deployment to GitHub Pages

1. Update `vite.config.js` base path if needed:
   ```javascript
   base: '/your-repo-name/',
   ```

2. Deploy:
   ```bash
   npm run build
   npm run deploy
   ```

## Tech Stack

- React 18
- Vite 6
- CSS3 (CSS Variables, Flexbox, Grid)
- Google Fonts (Playfair Display, DM Sans)

## Developer

Developed by **Shreenath Chakinala**

## License

All rights reserved - Om Function Hall And Gardens, Kuravi.
