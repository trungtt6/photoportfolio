import Link from 'next/link';
import Image from 'next/image';

// Blog posts data (in production, this would come from a database)
const blogPosts = [
  {
    id: 1,
    title: "Mastering Landscape Photography: 10 Essential Tips",
    excerpt: "Learn the key techniques for capturing stunning landscape photographs, from composition to lighting.",
    image: "/api/storage/processed/blog-landscape.jpg",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Landscape",
    featured: true,
  },
  {
    id: 2,
    title: "The Golden Hour: How to Perfect Your Timing",
    excerpt: "Discover why the golden hour is magical for photography and how to make the most of this fleeting time.",
    image: "/api/storage/processed/blog-golden-hour.jpg",
    date: "2024-01-10",
    readTime: "4 min read",
    category: "Techniques",
    featured: false,
  },
  {
    id: 3,
    title: "Post-Processing Workflow for Professional Results",
    excerpt: "A step-by-step guide to editing your photos like a pro using Lightroom and Photoshop.",
    image: "/api/storage/processed/blog-post-processing.jpg",
    date: "2024-01-05",
    readTime: "7 min read",
    category: "Editing",
    featured: false,
  },
];

const categories = ["All", "Landscape", "Portrait", "Techniques", "Editing", "Gear"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Photography Blog</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tips, techniques, and insights from my photography journey
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {blogPosts.filter((post) => post.featured).map((post) => (
          <div
            key={post.id}
            className="mb-12 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
          >
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full relative bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-600">Blog Image</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-blue-900 text-blue-400 text-xs rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.date}</span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{post.title}</h2>
                <p className="text-gray-400 mb-6">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts
            .filter((post) => !post.featured)
            .map((post) => (
              <article
                key={post.id}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition"
              >
                <div className="h-48 relative bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-600">Blog Image</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Photography Tips
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get the latest photography tips, tutorials, and insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
            />
            <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
