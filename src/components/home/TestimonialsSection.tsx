import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Abebe Kebede",
    role: "CEO, Ethiopian Coffee Export",
    company: "ECE Group",
    image: "AK",
    content:
      "NovaTech transformed our entire supply chain with their innovative platform. We've seen a 40% increase in efficiency and our farmers now have direct access to global markets. Their team's understanding of local challenges combined with world-class technical expertise is unmatched.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "CTO, Global Finance Corp",
    company: "GFC International",
    image: "SJ",
    content:
      "The mobile banking app NovaTech built for us has revolutionized how our customers interact with their finances. The AI-powered insights feature has become our biggest differentiator in the market. Truly exceptional work from start to finish.",
    rating: 5,
  },
  {
    id: 3,
    name: "Dr. Alemayehu Tadesse",
    role: "Director, Unity Hospital Network",
    company: "Unity Healthcare",
    image: "AT",
    content:
      "Implementing NovaTech's healthcare management system across our 25 hospitals was seamless. The team's attention to security, compliance, and user experience has made a real difference in patient care. We've reduced administrative overhead by 60%.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it — hear from the businesses 
            we've helped succeed.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card rounded-3xl p-8 md:p-12 border border-border shadow-xl">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Quote className="w-6 h-6 text-primary-foreground" />
            </div>

            {/* Content */}
            <div className="pt-6">
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-warning fill-warning" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg md:text-xl leading-relaxed mb-8">
                "{current.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {current.image}
                  </div>
                  <div>
                    <div className="font-semibold">{current.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {current.role}
                    </div>
                    <div className="text-sm text-primary">{current.company}</div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prev}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={next}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <div className="mt-16">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by leading organizations across Africa and beyond
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            {["Company A", "Company B", "Company C", "Company D", "Company E"].map((name) => (
              <div
                key={name}
                className="w-32 h-12 bg-muted rounded-lg flex items-center justify-center font-semibold text-muted-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
