import Link from "next/link";
import FeaturedPosts from "@/components/featured-posts";
import RecommendedPosts from "@/components/recommended-posts";
import { getFeaturedPosts, getRecommendedPosts } from "@/lib/api-services";

export default async function Home() {
  const [featuredPostsResult, recommendedPostsResult] = await Promise.allSettled([
    getFeaturedPosts(),
    getRecommendedPosts(),
  ]);

  const featuredPosts =
    featuredPostsResult.status === "fulfilled" ? featuredPostsResult.value : [];
  const recommendedPosts =
    recommendedPostsResult.status === "fulfilled" ? recommendedPostsResult.value : [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-slate-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to Blog-Less
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              A modern, minimalist blogging platform where ideas flourish and
              stories come to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="bg-white text-slate-900 px-6 py-3 rounded-md font-medium hover:bg-slate-100 transition-colors"
              >
                Explore Posts
              </Link>
              <Link
                href="/register"
                className="bg-transparent text-white border border-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Start Writing
              </Link>
            </div>
          </div>
        </section>

        {featuredPosts.length > 0 && (
          <FeaturedPosts posts={featuredPosts} />
        )}

        {recommendedPosts.length > 0 && (
          <RecommendedPosts posts={recommendedPosts} />
        )}

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Your Blogging Journey Today
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Join our community of writers and share your stories with the
              world.
            </p>
            <Link
              href="/register"
              className="bg-slate-900 text-white px-6 py-3 rounded-md font-medium hover:bg-slate-800 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
