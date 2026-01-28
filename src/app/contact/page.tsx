import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Get in Touch</h1>
          <p className="text-gray-400">Have questions about licensing or custom projects? I'd love to hear from you.</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">📧 Email</h3>
                <a href="mailto: trungtt@gmail.com" className="text-blue-400 hover:text-blue-300">
                  trungtt@gmail.com
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">📱 Phone</h3>
                <a href="https://wa.me/6594755969" className="text-blue-400 hover:text-blue-300">
                  +65 9475 5969
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">🌐 Social Media</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-blue-400 hover:text-blue-300">
                    Instagram
                  </a>
                  <a href="https://www.facebook.com/share/1EDxDMm3fh/"  className="block text-blue-400 hover:text-blue-300">
                    Facebook
                  </a>
                  <a href="https://500px.com/leicamen?type=award" className="block text-blue-400 hover:text-blue-300">
                    500px
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">📍 Location</h3>
                <p className="text-gray-400">Singapore, Singapore</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Response Time</h3>
                <p className="text-gray-400">I typically respond within 24-48 hours.</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-gray-900 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send Me a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-900 border-t border-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: 'How do licensing work?',
                answer:
                  'I offer multiple licensing tiers from personal use to exclusive rights. Each includes specific usage rights and comes with a license agreement.',
              },
              {
                question: 'What file formats do you provide?',
                answer:
                  'Digital downloads are available in JPG, TIFF, and RAW formats depending on the package selected.',
              },
              {
                question: 'Can I customize orders?',
                answer:
                  'Yes! Custom orders for specific sizes, materials, or special requests are always welcome. Contact me for details.',
              },
              {
                question: 'What is your delivery time?',
                answer:
                  'Digital files are delivered immediately upon purchase. Print orders typically ship within 5-7 business days.',
              },
              {
                question: 'Do you offer bulk discounts?',
                answer:
                  'For large orders or corporate licensing, custom pricing is available. Please reach out with your specific needs.',
              },
              {
                question: 'Can I use photos for commercial purposes?',
                answer:
                  'Yes, but you need the appropriate commercial license. Personal use licenses are non-commercial only.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
