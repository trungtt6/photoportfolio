import Link from 'next/link';
import { notFound } from 'next/navigation';

// Sample blog post data (in production, fetch from database)
const blogPosts = {
  "1": {
    id: 1,
    title: "Mastering Landscape Photography: 10 Essential Tips",
    content: `
      <h2>1. Scout Your Location</h2>
      <p>Before you even take out your camera, spend time scouting locations. Use apps like Google Earth or PhotoPills to plan your shots. Visit the location at different times of day to understand how the light changes.</p>
      
      <h2>2. Understand the Rule of Thirds</h2>
      <p>The rule of thirds is fundamental in landscape photography. Place your horizon line on the top or bottom third, and position key elements at the intersection points. This creates more dynamic and balanced compositions.</p>
      
      <h2>3. Use Leading Lines</h2>
      <p>Look for natural lines like rivers, paths, or mountain ridges that guide the viewer's eye through the image. These leading lines create depth and draw attention to your main subject.</p>
      
      <h2>4. Master Depth of Field</h2>
      <p>For landscapes, you typically want everything in focus. Use a smaller aperture (f/8 to f/16) and focus about one-third into the scene to maximize depth of field.</p>
      
      <h2>5. Capture the Golden Hour</h2>
      <p>The hour after sunrise and before sunset offers magical light. The soft, warm light creates long shadows and adds drama to your landscapes.</p>
      
      <h2>6. Use Filters Wisely</h2>
      <p>A circular polarizer can reduce glare and enhance colors. Neutral density filters allow for longer exposures, creating silky water effects or motion blur in clouds.</p>
      
      <h2>7. Include Foreground Interest</h2>
      <p>Adding an interesting foreground element creates depth and context. Rocks, flowers, or interesting textures can anchor your composition.</p>
      
      <h2>8. Check the Weather</h2>
      <p>Dramatic weather often creates the most compelling landscapes. Storm clouds, mist, and fog add atmosphere and mood to your images.</p>
      
      <h2>9. Shoot in RAW</h2>
      <p>RAW files capture more data and give you greater flexibility in post-processing. You can recover highlights and shadows that would be lost in JPEG files.</p>
      
      <h2>10. Post-Processing Matters</h2>
      <p>Enhance your landscapes with careful post-processing. Adjust exposure, contrast, and color to bring out the best in your images, but keep it natural.</p>
    `,
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Landscape",
    image: "/api/storage/processed/blog-landscape.jpg",
  }
};

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = blogPosts[params.id as keyof typeof blogPosts];
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          ← Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-900 text-blue-400 text-sm rounded-full">
              {post.category}
            </span>
            <span className="text-gray-500">{post.date}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{post.readTime}</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">{post.title}</h1>
        </header>

        {/* Featured Image */}
        <div className="h-96 bg-gray-800 rounded-2xl mb-12 flex items-center justify-center">
          <span className="text-gray-600">Blog Featured Image</span>
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio */}
        <div className="mt-16 p-8 bg-gray-900 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
            <div>
              <h3 className="text-xl font-bold text-white">About the Author</h3>
              <p className="text-gray-400">Professional photographer with 10+ years of experience</p>
            </div>
          </div>
          <p className="text-gray-300">
            Specializing in landscape and nature photography, I've captured stunning images around the world. 
            Through this blog, I share my experiences and techniques to help you improve your photography skills.
          </p>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">Related Posts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/2" className="group">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 group-hover:border-gray-700 transition">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                  The Golden Hour: How to Perfect Your Timing
                </h3>
                <p className="text-gray-400">Discover why the golden hour is magical for photography...</p>
              </div>
            </Link>
            <Link href="/blog/3" className="group">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 group-hover:border-gray-700 transition">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                  Post-Processing Workflow for Professional Results
                </h3>
                <p className="text-gray-400">A step-by-step guide to editing your photos like a pro...</p>
              </div>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
