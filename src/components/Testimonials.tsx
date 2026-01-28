import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Art Director",
    company: "Creative Agency",
    content: "Absolutely stunning photography! The attention to detail and unique perspective in each shot is remarkable. Our clients love the images.",
    rating: 5,
    avatar: "/api/storage/processed/testimonial-1.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Homeowner",
    company: "Private Residence",
    content: "The landscape photographs captured the essence of our property perfectly. The quality and composition exceeded our expectations.",
    rating: 5,
    avatar: "/api/storage/processed/testimonial-2.jpg",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Editor",
    company: "Nature Magazine",
    content: "Professional, creative, and reliable. The photographs brought our publication to life with vibrant colors and compelling storytelling.",
    rating: 5,
    avatar: "/api/storage/processed/testimonial-3.jpg",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "CEO",
    company: "Tech Startup",
    content: "Outstanding work on our corporate headshots and office photography. The images perfectly reflect our brand's personality.",
    rating: 5,
    avatar: "/api/storage/processed/testimonial-4.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            What Clients Say
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Don't just take my word for it - hear what my clients have to say
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition ${
                index === 0 || index === 3 ? 'lg:transform lg:translate-y-4' : ''
              }`}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-300 mb-6">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-lg font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to work together?
          </h3>
          <p className="text-gray-400 mb-8">
            Let's create something amazing for your next project
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            Get in Touch →
          </a>
        </div>
      </div>
    </section>
  );
}
