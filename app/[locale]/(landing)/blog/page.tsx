import BlogFeaturedCard from "@/features/blog/components/blog-featured-card"
import BlogHeader from "@/features/blog/components/blog-header"
import BlogLatestArticles from "@/features/blog/components/blog-latest-articles"

export default async function BlogPage() {
  return (
    <div className="container pb-16">
      <BlogHeader />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)] lg:items-stretch lg:gap-6">
        <BlogFeaturedCard />
        <BlogLatestArticles />
      </section>
    </div>
  )
}
