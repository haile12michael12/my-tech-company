import { Link } from "react-router-dom";
import {
  Globe,
  Smartphone,
  Cloud,
  Brain,
  Shield,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Custom web applications built with modern frameworks. Scalable, fast, and user-friendly solutions.",
    features: ["React & Vue.js", "Laravel & Node.js", "E-commerce Solutions"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile applications that deliver exceptional user experiences.",
    features: ["iOS & Android", "React Native", "Flutter"],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description:
      "Scalable cloud infrastructure and migration services for modern businesses.",
    features: ["AWS & Azure", "DevOps & CI/CD", "Serverless Architecture"],
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description:
      "Intelligent solutions powered by cutting-edge artificial intelligence technologies.",
    features: ["Predictive Analytics", "NLP & Chatbots", "Computer Vision"],
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description:
      "Comprehensive security solutions to protect your digital assets and data.",
    features: ["Security Audits", "Penetration Testing", "Compliance"],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description:
      "Transform raw data into actionable insights that drive business decisions.",
    features: ["Business Intelligence", "Data Visualization", "Real-time Analytics"],
    color: "from-violet-500 to-purple-500",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Technology Solutions
          </h2>
          <p className="text-muted-foreground text-lg">
            From concept to deployment, we deliver end-to-end solutions tailored 
            to your unique business needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={cn(
                "group relative bg-card rounded-2xl p-6 border border-border",
                "hover:shadow-xl hover:border-primary/20 transition-all duration-300",
                "animate-fade-up"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                  "bg-gradient-to-br",
                  service.color
                )}
              >
                <service.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Link */}
              <Link
                to="/services"
                className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                Learn more
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services">
            <Button size="lg" variant="outline">
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
