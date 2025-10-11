import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  cover_image?: string;
  published_at?: string;
}

export const NewsCarousel = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from("news")
        .select("id, slug, title, excerpt, cover_image, published_at")
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(4);

      if (data) {
        setNews(data);
      }
    };
    fetchNews();
  }, []);

  if (news.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2">
              Новини та статті
            </h2>
            <p className="text-muted-foreground">
              Актуальна інформація про світ електромобілів
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {news.map((item) => (
              <div key={item.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                <Link to={`/news/${item.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                    {item.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        {item.published_at &&
                          new Date(item.published_at).toLocaleDateString("uk-UA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    {item.excerpt && (
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3">
                          {item.excerpt}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/news">
              Всі новини
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
