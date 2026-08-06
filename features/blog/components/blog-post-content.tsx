import { getTranslations } from "next-intl/server"

import LegalSidebar from "@/components/shared/legal-sidebar"
import BlogPostCta from "@/features/blog/components/blog-post-cta"
import {
  injectBlogHeadingIds,
  type BlogPostView,
} from "@/features/blog/services/blogs"
import { cn } from "@/lib/utils"

type BlogPostContentProps = {
  post: BlogPostView
}

export default async function BlogPostContent({ post }: BlogPostContentProps) {
  const t = await getTranslations("Blog.post")
  const { contentHtml, headings } = injectBlogHeadingIds(post.contentHtml)

  const sidebarItems =
    headings.length > 0
      ? headings
      : [{ id: "blog-content", label: t("tocTitle") }]

  return (
    <div className="bg-white py-10 md:py-14">
      <section className="container">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-8">
          <div
            id={headings.length > 0 ? undefined : "blog-content"}
            className={cn(
              "prose prose-neutral max-w-none text-foreground",
              "prose-headings:font-bold prose-headings:text-foreground",
              "prose-p:text-muted-foreground prose-p:leading-relaxed",
              "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
              "prose-li:text-muted-foreground",
            )}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <aside className="order-first flex flex-col gap-4 lg:sticky lg:top-28 lg:order-0 lg:self-start">
            <LegalSidebar
              title={t("tocTitle")}
              items={sidebarItems}
              className="rounded-3xl border border-border/60 bg-white shadow-none"
            />
            <BlogPostCta />
          </aside>
        </div>
      </section>
    </div>
  )
}
