import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = ["All", "Enterprise", "Finance", "Healthcare", "Agriculture", "E-commerce"];

const projects = [
  {
    title: "Ethiopian Airlines Booking System",
    description:
      "A comprehensive flight booking platform serving millions of customers annually with real-time availability and secure payments.",
    image: "bg-gradient-to-br from-blue-600 to-cyan-600",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    category: "Enterprise",
    stats: { users: "2M+", transactions: "500K/month", uptime: "99.99%" },
    challenge: "Legacy system migration while maintaining 24/7 operations",
    solution: "Phased migration with zero-downtime deployment strategy",
  },
  {
    title: "FinTech Mobile Banking App",
    description:
      "Mobile-first banking solution with biometric authentication, real-time transactions, and AI-powered financial insights.",
    image: "bg-gradient-to-br from-green-600 to-emerald-600",
    tags: ["React Native", "GraphQL", "AWS", "ML"],
    category: "Finance",
    stats: { downloads: "100K+", rating: "4.8★", transactions: "$50M/month" },
    challenge: "Meeting strict regulatory compliance while delivering modern UX",
    solution: "Modular architecture with dedicated compliance layer",
  },
  {
    title: "AgriTech Supply Chain Platform",
    description:
      "End-to-end supply chain management connecting farmers to markets with IoT sensors and predictive analytics.",
    image: "bg-gradient-to-br from-amber-600 to-orange-600",
    tags: ["Vue.js", "Laravel", "IoT", "Analytics"],
    category: "Agriculture",
    stats: { farmers: "5K+", efficiency: "+40%", waste: "-30%" },
    challenge: "Connecting rural farmers with limited connectivity",
    solution: "Offline-first PWA with SMS fallback integration",
  },
  {
    title: "Healthcare Management System",
    description:
      "Integrated hospital management platform with patient records, scheduling, telemedicine, and pharmacy management.",
    image: "bg-gradient-to-br from-rose-600 to-pink-600",
    tags: ["Angular", "Django", "HIPAA", "AI"],
    category: "Healthcare",
    stats: { hospitals: "25+", patients: "1M+", efficiency: "+60%" },
    challenge: "HIPAA compliance across distributed hospital network",
    solution: "End-to-end encryption with role-based access control",
  },
  {
    title: "E-commerce Marketplace Platform",
    description:
      "Multi-vendor marketplace with real-time inventory, dynamic pricing, and integrated logistics management.",
    image: "bg-gradient-to-br from-indigo-600 to-purple-600",
    tags: ["Next.js", "Stripe", "Redis", "Elasticsearch"],
    category: "E-commerce",
    stats: { vendors: "500+", products: "50K+", revenue: "$2M/month" },
    challenge: "Handling flash sales with 100x traffic spikes",
    solution: "Auto-scaling infrastructure with intelligent caching",
  },
  {
    title: "Insurance Claims Automation",
    description:
      "AI-powered claims processing system reducing processing time by 80% with fraud detection capabilities.",
    image: "bg-gradient-to-br from-teal-600 to-cyan-600",
    tags: ["Python", "TensorFlow", "AWS", "Microservices"],
    category: "Finance",
    stats: { claims: "10K+/month", accuracy: "99.2%", time: "-80%" },
    challenge: "Reducing manual claims processing bottlenecks",
    solution: "ML-based document processing with human-in-the-loop verification",
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Success Stories
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore how we've helped businesses across Africa and beyond 
              transform their digital presence and achieve remarkable results.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b border-border sticky top-[72px] bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "shrink-0",
                  activeCategory === category && "bg-gradient-primary"
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.title}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                {/* Image */}
                <div className={cn("aspect-video relative", project.image)}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold opacity-90">
                        {project.title.split(" ")[0]}
                      </div>
                    </div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-white/20 text-white border-0">
                    {project.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                    {Object.entries(project.stats)
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-sm font-bold text-primary">{value}</div>
                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Be Our Next Success Story?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Let's discuss how we can help you achieve similar results for your business.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-primary">
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
