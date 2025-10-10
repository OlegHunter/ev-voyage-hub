import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  user_name: string;
  user_avatar: string | null;
  text: string;
  rating: number | null;
  images: string[] | null;
}

export const ReviewsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl">
            Відгуки <span className="text-primary">клієнтів</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Реальні історії наших клієнтів
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {testimonial.user_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.user_name}</p>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{testimonial.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
