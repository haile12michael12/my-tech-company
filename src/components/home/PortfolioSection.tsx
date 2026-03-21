import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import portfolioAirlines from "@/assets/portfolio-airlines.jpg";
import portfolioFintech from "@/assets/portfolio-fintech.jpg";
import portfolioAgritech from "@/assets/portfolio-agritech.jpg";
import portfolioHealthcare from "@/assets/portfolio-healthcare.jpg";

const projects = [
  {
    title: "Ethiopian Airlines Booking System",
    description:
      "A comprehensive flight booking platform serving millions of customers annually with real-time availability and secure payments.",
    image: portfolioAirlines,
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    category: "Enterprise",
    stats: { users: "2M+", transactions: "500K/month" },
  },
  {
    title: "FinTech Mobile Banking App",
    description:
      "Mobile-first banking solution with biometric authentication, real-time transactions, and AI-powered financial insights.",
    image: portfolioFintech,
    tags: ["React Native", "GraphQL", "AWS", "ML"],
    category: "Finance",
    stats: { downloads: "100K+", rating: "4.8★" },
  },
  {
    title: "AgriTech Supply Chain Platform",
    description:
      "End-to-end supply chain management connecting farmers to markets with IoT sensors and predictive analytics.",
    image: portfolioAgritech,
    tags: ["Vue.js", "Laravel", "IoT", "Analytics"],
    category: "Agriculture",
    stats: { farmers: "5K+", efficiency: "+40%" },
  },
  {
    title: "Healthcare Management System",
    description:
      "Integrated hospital management platform with patient records, scheduling, telemedicine, and pharmacy management.",
    image: portfolioHealthcare,
    tags: ["Angular", "Django", "HIPAA", "AI"],
    category: "Healthcare",
    stats: { hospitals: "25+", patients: "1M+" },
  },
];

export function PortfolioSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Success Stories & Case Studies
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore how we've helped businesses across Africa and beyond 
            transform their digital presence.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={cn(
                "group relative bg-card rounded-2xl overflow-hidden border border-border",
                "hover:shadow-2xl hover:border-primary/20 transition-all duration-500",
                "animate-fade-up"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="aspect-[16/9] relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border-0">
                    {project.category}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-6 pt-4 border-t border-border">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-lg font-bold text-primary">{value}</div>
                      <div className="text-xs text-muted-foreground capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Hover Link */}
                <Link
                  to="/portfolio"
                  className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Button className="bg-gradient-primary w-full">
                    View Case Study
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/portfolio">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Explore All Projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
