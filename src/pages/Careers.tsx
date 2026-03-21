import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  Heart,
  Zap,
  Users,
  GraduationCap,
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and gym memberships",
  },
  {
    icon: Zap,
    title: "Growth & Learning",
    description: "Annual learning budget, conference attendance, and mentorship programs",
  },
  {
    icon: Users,
    title: "Team Culture",
    description: "Regular team events, retreats, and a collaborative work environment",
  },
  {
    icon: GraduationCap,
    title: "Career Development",
    description: "Clear career paths, internal mobility, and leadership opportunities",
  },
];

const jobs = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    remote: "Hybrid",
    experience: "5+ years",
    salary: "Competitive",
    description: "Build and maintain scalable web applications using React, Node.js, and PostgreSQL.",
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
  },
  {
    title: "Mobile Developer (React Native)",
    department: "Engineering",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    remote: "Remote OK",
    experience: "3+ years",
    salary: "Competitive",
    description: "Develop cross-platform mobile applications for iOS and Android.",
    tags: ["React Native", "iOS", "Android", "JavaScript"],
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    remote: "Hybrid",
    experience: "4+ years",
    salary: "Competitive",
    description: "Manage cloud infrastructure, CI/CD pipelines, and deployment automation.",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform"],
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    remote: "Hybrid",
    experience: "3+ years",
    salary: "Competitive",
    description: "Create beautiful and intuitive user interfaces for web and mobile applications.",
    tags: ["Figma", "UI Design", "UX Research", "Prototyping"],
  },
  {
    title: "Project Manager",
    department: "Operations",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    remote: "On-site",
    experience: "4+ years",
    salary: "Competitive",
    description: "Lead project delivery, client communication, and team coordination.",
    tags: ["Agile", "Scrum", "Client Management", "Leadership"],
  },
  {
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    remote: "Remote",
    experience: "3+ years",
    salary: "Competitive",
    description: "Build and deploy machine learning models for production applications.",
    tags: ["Python", "TensorFlow", "PyTorch", "NLP"],
  },
];

const Careers = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Careers
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Mission to Transform Africa Through Technology
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We're looking for passionate individuals who want to make a real impact. 
              Join a team that values innovation, collaboration, and growth.
            </p>
            <Button size="lg" className="bg-gradient-primary">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Work at NovaTech?</h2>
            <p className="text-muted-foreground">
              We believe in taking care of our team so they can do their best work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Open Positions</h2>
              <p className="text-muted-foreground">{jobs.length} positions available</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search positions..." className="pl-10" />
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.title}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <Badge variant="outline">{job.department}</Badge>
                      <Badge className="bg-success/10 text-success border-0">
                        {job.remote}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.experience}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="bg-gradient-primary shrink-0">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We're always looking for talented individuals. Send us your resume and we'll 
            keep you in mind for future opportunities.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="outline">
              Send Your Resume
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
