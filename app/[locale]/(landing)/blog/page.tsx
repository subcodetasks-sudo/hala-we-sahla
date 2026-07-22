import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import BlogArticlesSection from "@/features/blog/components/blog-articles-section"
import BlogFeaturedCard from "@/features/blog/components/blog-featured-card"
import BlogHeader from "@/features/blog/components/blog-header"
import BlogLatestArticles from "@/features/blog/components/blog-latest-articles"
import BlogMostReadSection from "@/features/blog/components/blog-most-read-section"

export default async function BlogPage() {
  const tCommon = await getTranslations("Common")
  const tFooter = await getTranslations("Footer")

  return (
    <div className="container pb-16">
      <BreadcrumbNav
        className="pt-6 md:pt-10"
        items={[
          { label: tCommon("home"), href: "/" },
          { label: tFooter("columns.quickLinks.blog") },
        ]}
      />

      <BlogHeader />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)] lg:items-stretch lg:gap-6">
        <BlogFeaturedCard />
        <BlogLatestArticles />
      </section>

      <BlogArticlesSection />

      <BlogMostReadSection />
    </div>
  )
}
