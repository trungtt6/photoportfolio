# Photo Portfolio Website

A modern, responsive photography portfolio website built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Designed to showcase professional HD photography with fine art prints and photo licensing capabilities.

## Features

### 📱 Pages
- **Home** - Hero section, featured photos, services overview
- **Gallery** - Responsive grid with search and category filtering
- **About** - Photographer bio, equipment, achievements
- **Contact** - Contact form with FAQ section

### 🎨 Design
- Dark, modern theme optimized for photo showcase
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional gradient accents
- Accessible UI with semantic HTML

### 🛍️ E-Commerce Ready
- Photo licensing tiers (Personal, Commercial, Extended, Exclusive)
- Digital product options (Web, Full Resolution, RAW files)
- Contact form for inquiries
- API endpoint for form submissions

### 🔧 Technical
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Validation**: Client & server-side
- **Mobile Menu**: Responsive hamburger menu
- **SEO**: Meta tags, Open Graph, sitemap ready

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   ├── gallery/      # Gallery page
│   ├── about/        # About page
│   ├── contact/      # Contact page
│   └── api/
│       └── contact/  # Contact form API
├── components/       # Reusable React components
│   ├── Header.tsx    # Navigation header
│   ├── Footer.tsx    # Footer
│   ├── GalleryCard.tsx   # Photo card
│   └── ContactForm.tsx   # Contact form
├── lib/              # Utilities & data
│   ├── photos.ts     # Sample photo data
│   └── utils.ts      # Helper functions
├── styles/
│   └── globals.css   # Tailwind + custom styles
└── types/
    └── index.ts      # TypeScript interfaces

public/
└── images/          # Image assets (placeholder)
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Environment Variables
Create `.env.local` file:
```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_SITE_NAME=Your Photo Portfolio

# Contact Form (optional - for email integration)
NEXT_PUBLIC_EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_key_here
EMAIL_FROM=photos@yoursite.com
EMAIL_TO=your-email@example.com
```

### Customization
- Update photographer info in [`src/app/about/page.tsx`](src/app/about/page.tsx)
- Modify photo data in [`src/lib/photos.ts`](src/lib/photos.ts)
- Add real images to [`public/images/`](public/images/)
- Update social links in [`src/components/Header.tsx`](src/components/Header.tsx) and [`src/components/Footer.tsx`](src/components/Footer.tsx)
- Adjust colors in [`tailwind.config.ts`](tailwind.config.ts)

## Features

### Gallery
- Responsive grid layout (1-3 columns)
- Real-time search across titles, descriptions, and tags
- Category filtering (Landscape, Portrait, Wildlife, etc.)
- Photo cards with hover effects
- Pricing and licensing info

### Contact Form
- Client and server-side validation
- Email validation
- Success/error notifications
- Accessible form fields
- Optional phone number field

### API Routes
- `/api/contact` - POST endpoint for contact form
- Form validation and error handling
- Ready for email service integration

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy with one click

### Alternative Platforms
- Netlify
- Railway
- Fly.io
- AWS Amplify

See [plan.md](plan.md) for detailed deployment instructions.

## SEO & Performance

- ✅ Meta tags and descriptions
- ✅ Open Graph tags for social sharing
- ✅ Mobile-friendly responsive design
- ✅ Performance optimized images
- ✅ Fast page loads with Next.js
- ✅ Accessibility best practices

### Lighthouse Targets
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 100

## Development

### Available Scripts
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

### Code Quality
- ESLint configuration included
- TypeScript strict mode enabled
- Consistent code formatting with Tailwind
- Semantic HTML structure

## Phase 2+ Roadmap

- [ ] Image lightbox/modal viewer
- [ ] Dark/light mode toggle
- [ ] Blog section
- [ ] Advanced search and filtering
- [ ] Shopping cart for prints
- [ ] Payment integration
- [ ] Social media integration (Instagram, 500px, Facebook)
- [ ] Print-on-demand integration
- [ ] Digital file licensing

See [plan.md](plan.md) for complete roadmap.

## License

© 2025 Photo Portfolio. All rights reserved.

## Support

For questions or issues, please contact through the contact page.

---

**Built with Next.js, React, TypeScript, and Tailwind CSS**
