# Local Testing Checklist

## Server Status
✅ **Dev Server Running** on http://localhost:3000

## Page Tests

### 1. Home Page (/)
- [ ] Hero section displays with title "Capturing Moments"
- [ ] Hero CTA buttons ("Explore Gallery", "Get in Touch") are clickable
- [ ] Featured Work section shows 3 photos
- [ ] Services section displays all 3 services
- [ ] Bottom CTA section visible

### 2. Gallery Page (/gallery)
- [ ] Gallery grid displays all 6 photos
- [ ] Search bar is functional
- [ ] Category filter buttons work
- [ ] Photos can be filtered by category
- [ ] "All Photos" button resets filters
- [ ] Featured badges visible on featured photos
- [ ] Price information displays

### 3. About Page (/about)
- [ ] Photographer bio section displays
- [ ] Equipment list visible
- [ ] Achievements statistics show
- [ ] Social media links present
- [ ] Contact CTA button works

### 4. Contact Page (/contact)
- [ ] Contact form displays all fields
- [ ] Search field (name) accepts input
- [ ] Email field validates email
- [ ] Subject field accepts input
- [ ] Message textarea accepts input
- [ ] Phone field is optional
- [ ] Submit button is clickable
- [ ] Form validation works (try submitting empty)
- [ ] FAQ section displays

## Navigation Tests

### Header/Navigation
- [ ] Logo links to home page
- [ ] Desktop menu shows all 4 links
- [ ] Mobile menu button appears on small screens
- [ ] Mobile menu opens/closes
- [ ] All nav links work

### Footer
- [ ] Footer displays with all sections
- [ ] Quick Links section visible
- [ ] Legal links present
- [ ] Social links present
- [ ] Copyright year correct

## Styling/Responsive Tests

### Desktop (1920px)
- [ ] Layout looks professional
- [ ] All sections properly spaced
- [ ] Gradients and effects visible
- [ ] Hover effects work on buttons and cards
- [ ] Text readable

### Tablet (768px)
- [ ] Menu responsive
- [ ] Gallery grid adjusts to 2 columns
- [ ] Text sizes readable
- [ ] Images scale properly

### Mobile (375px)
- [ ] Hamburger menu appears
- [ ] Gallery grid shows 1 column
- [ ] All text readable
- [ ] Buttons tap-able
- [ ] No horizontal overflow

## Form Testing

### Contact Form
1. **Validation Tests:**
   - [ ] Required field indicators visible (*)
   - [ ] Submit empty form - shows error
   - [ ] Submit with invalid email - shows error
   - [ ] Submit with missing message - shows error

2. **Valid Submission:**
   - [ ] Fill all fields
   - [ ] Click Submit
   - [ ] Success message appears
   - [ ] Form clears after submission

## API Testing

### Contact Form Endpoint (/api/contact)
- [ ] POST request works
- [ ] Validates input server-side
- [ ] Returns success response
- [ ] Returns error for invalid data

## Performance Checks

### Speed
- [ ] Home page loads quickly
- [ ] Gallery loads without lag
- [ ] Navigation smooth between pages
- [ ] No console errors

### Console
- [ ] Open DevTools (F12)
- [ ] Check Console tab
- [ ] No red errors
- [ ] No TypeScript errors

## Visual Tests

### Colors & Theme
- [ ] Dark theme consistent
- [ ] Blue accent color (#0284c7) consistent
- [ ] Purple gradient visible in hero
- [ ] Text contrast readable

### Animations
- [ ] Fade-in animation on home hero
- [ ] Hover effects on buttons
- [ ] Smooth transitions on menu
- [ ] Hover lift effect on cards

### Images
- [ ] Placeholder images display
- [ ] Image containers have correct aspect ratios
- [ ] Responsive sizing works

## SEO Tests

### Meta Tags
- [ ] Open DevTools > Network
- [ ] Check HTML response
- [ ] Page titles correct
- [ ] Meta descriptions present

### Open Graph
- [ ] og:title present
- [ ] og:description present
- [ ] og:image present

## Browser Compatibility

### Chrome/Edge
- [ ] All features work

### Firefox
- [ ] All features work

### Safari (if available)
- [ ] All features work

## Known Issues / Notes

(Leave empty if all tests pass)

---

## Test Summary

**Overall Status:** [ ] PASS  [ ] FAIL

**Issues Found:**
(List any issues discovered during testing)

**Next Steps:**
- [ ] Fix any issues
- [ ] Retest
- [ ] Deploy to Vercel
