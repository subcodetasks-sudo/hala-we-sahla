import BlogPostContent from "@/features/blog/components/blog-post-content"
import BlogPostHeader from "@/features/blog/components/blog-post-header"
import BlogRelatedSection from "@/features/blog/components/blog-related-section"

type BlogPostPageProps = {
  params: Promise<{ slug: string; locale: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await params

  return (
    <div className="pb-16">
      <BlogPostHeader />
      <BlogPostContent />
      <BlogRelatedSection />
    </div>
  )
}
