import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">Photography</h3>
            <p className="text-sm text-gray-500">
              Professional photography portfolio showcasing fine art prints and high-resolution digital images.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gallery" className="hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  License Info
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold mb-4">Follow</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://facebook.com" className="hover:text-white transition">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="hover:text-white transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://500px.com" className="hover:text-white transition">
                  500px
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Photo Portfolio. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-4 md:mt-0">
            Photography by Professional Photographer
          </p>
        </div>
      </div>
    </footer>
  );
}
