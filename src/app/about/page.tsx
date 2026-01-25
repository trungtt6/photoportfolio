export default function AboutPage() {
  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">About Me</h1>
          <p className="text-gray-400">Professional photographer with a passion for capturing moments</p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="bg-gray-800 rounded-lg aspect-square flex items-center justify-center text-gray-500">
              [Photographer Portrait]
            </div>

            {/* Bio Text */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">My Story</h2>
              <p className="text-gray-400 mb-4 leading-relaxed">
                With over 10 years of professional photography experience, I have dedicated my career to capturing
                the raw beauty of nature and architecture through my lens.
              </p>
              <p className="text-gray-400 mb-4 leading-relaxed">
                My work has been featured in numerous publications and exhibitions worldwide. I specialize in landscape,
                nature, and architectural photography, with a particular focus on creating images that evoke emotion
                and wonder.
              </p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Every photograph is a story waiting to be told. My mission is to share these stories with you through
                stunning prints and digital licenses.
              </p>

              <div className="flex gap-4 flex-wrap">
                <a
                  href="#"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Instagram
                </a>
                <a href="#" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  Facebook
                </a>
                <a href="#" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  500px
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="bg-gray-900 border-t border-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">My Equipment</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📷 Camera</h3>
              <ul className="text-gray-400 space-y-2">
                <li>• Canon EOS R5</li>
                <li>• Nikon Z9</li>
                <li>• Sony A7R V</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🔭 Lenses</h3>
              <ul className="text-gray-400 space-y-2">
                <li>• Canon RF 24-70mm f/2.8</li>
                <li>• Canon RF 70-200mm f/2.8</li>
                <li>• Canon RF 15-35mm f/2.8</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🖥️ Post-Processing</h3>
              <ul className="text-gray-400 space-y-2">
                <li>• Adobe Lightroom Classic</li>
                <li>• Adobe Photoshop</li>
                <li>• Capture One</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Achievements</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { number: '500+', label: 'Photos Sold' },
              { number: '50+', label: 'Exhibitions' },
              { number: '100+', label: 'Publications' },
              { number: '10+', label: 'Years Experience' },
            ].map((achievement, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-6 text-center hover-lift">
                <div className="text-4xl font-bold text-blue-400 mb-2">{achievement.number}</div>
                <p className="text-gray-400">{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Have a Project in Mind?</h2>
          <p className="text-blue-100 mb-6">Get in touch to discuss custom photography or licensing options</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Contact Me
          </a>
        </div>
      </div>
    </div>
  );
}
