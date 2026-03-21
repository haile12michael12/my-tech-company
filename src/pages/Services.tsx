import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import {
  Globe,
  Smartphone,
  Cloud,
  Brain,
  Shield,
  BarChart3,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Custom web applications and websites built with modern technologies for optimal performance and user experience.",
    features: [
      "Custom Web Applications",
      "E-commerce Solutions",
      "Content Management Systems",
      "API Development & Integration",
      "Progressive Web Apps (PWA)",
      "Website Redesign & Optimization",
    ],
    technologies: ["React", "Vue.js", "Laravel", "Node.js", "PostgreSQL", "MongoDB"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.",
    features: [
      "iOS Native Development",
      "Android Native Development",
      "Cross-Platform Apps",
      "App Store Optimization",
      "Mobile UI/UX Design",
      "App Maintenance & Support",
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description:
      "Scalable cloud infrastructure, migration services, and DevOps solutions for modern businesses.",
    features: [
      "Cloud Migration",
      "Infrastructure as Code",
      "DevOps & CI/CD",
      "Containerization",
      "Serverless Architecture",
      "Cloud Cost Optimization",
    ],
    technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform"],
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description:
      "Intelligent solutions powered by cutting-edge artificial intelligence and machine learning technologies.",
    features: [
      "Predictive Analytics",
      "Natural Language Processing",
      "Computer Vision",
      "Recommendation Systems",
      "Chatbots & Virtual Assistants",
      "AI Strategy Consulting",
    ],
    technologies: ["TensorFlow", "PyTorch", "OpenAI", "LangChain", "Python", "R"],
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description:
      "Comprehensive security solutions to protect your digital assets, data, and reputation.",
    features: [
      "Security Audits",
      "Penetration Testing",
      "Vulnerability Assessment",
      "Compliance (GDPR, HIPAA)",
      "Security Training",
      "Incident Response",
    ],
    technologies: ["OWASP", "NIST", "ISO 27001", "SOC 2", "SIEM"],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description:
      "Transform raw data into actionable insights that drive informed business decisions.",
    features: [
      "Business Intelligence",
      "Data Visualization",
      "Real-time Analytics",
      "Data Warehousing",
      "ETL Pipelines",
      "Custom Dashboards",
    ],
    technologies: ["Power BI", "Tableau", "Looker", "Apache Spark", "Snowflake"],
    color: "from-violet-500 to-purple-500",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive Technology Solutions
            </h1>
            <p className="text-lg text-muted-foreground">
              From strategy to implementation, we deliver end-to-end technology 
              solutions tailored to your unique business challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.title}
                id={service.title.toLowerCase().split(" ")[0]}
                className={cn(
                  "grid lg:grid-cols-2 gap-12 items-center",
                  index % 2 === 1 && "lg:flex-row-reverse"
                )}
              >
                {/* Content */}
                <div className={cn(index % 2 === 1 && "lg:order-2")}>
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br",
                      service.color
                    )}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-success shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium bg-muted rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link to="/contact">
                    <Button className="bg-gradient-primary">
                      Get a Quote
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* Visual */}
                <div className={cn(index % 2 === 1 && "lg:order-1")}>
                  <div
                    className={cn(
                      "aspect-square rounded-3xl p-8 flex items-center justify-center bg-gradient-to-br",
                      service.color,
                      "opacity-90"
                    )}
                  >
                    <div className="text-center text-white">
                      <service.icon className="w-24 h-24 mx-auto mb-4 opacity-50" />
                      <div className="text-2xl font-bold">{service.title}</div>
                      <div className="text-sm opacity-75 mt-2">Service Illustration</div>
                    </div>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Let's discuss how we can help transform your business with our technology solutions.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-primary">
              Schedule a Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
