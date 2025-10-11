interface NewsArticleSchemaProps {
  article: {
    title: string;
    cover_image?: string;
    published_at?: string;
    updated_at?: string;
    excerpt?: string;
    author_id?: string;
  };
}

export const NewsArticleSchema = ({ article }: NewsArticleSchemaProps) => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "image": article.cover_image || "https://www.car-hunter.com.ua/og-image.jpg",
      "datePublished": article.published_at,
      "dateModified": article.updated_at || article.published_at,
      "description": article.excerpt,
      "author": {
        "@type": "Person",
        "name": "CarHunter Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "CarHunter™",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.car-hunter.com.ua/logo.png"
        }
      }
    })}
  </script>
);
