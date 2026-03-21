import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Globe,
  ArrowRight,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Team member photos
import teamAlemayehu from "@/assets/team-alemayehu.jpg";
import teamSarah from "@/assets/team-sarah.jpg";
import teamYonas from "@/assets/team-yonas.jpg";
import teamMeron from "@/assets/team-meron.jpg";
import teamDaniel from "@/assets/team-daniel.jpg";
import teamTigist from "@/assets/team-tigist.jpg";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in everything we do, delivering solutions that exceed expectations.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We operate with transparency, honesty, and ethical standards in all our relationships.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe in the power of teamwork and building lasting partnerships with our clients.",
  },
  {
    icon: Globe,
    title: "Innovation",
    description: "We embrace cutting-edge technologies and creative solutions to solve complex challenges.",
  },
];

const stats = [
  { value: "2018", label: "Founded" },
  { value: "50+", label: "Team Members" },
  { value: "500+", label: "Projects Delivered" },
  { value: "15+", label: "Countries Served" },
];

const team = [
  {
    name: "Alemayehu Tadesse",
    role: "Founder & CEO",
    bio: "15+ years in software development and tech leadership",
    image: teamAlemayehu,
  },
  {
    name: "Sarah Bekele",
    role: "CTO",
    bio: "Former Google engineer, AI & cloud architecture expert",
    image: teamSarah,
  },
  {
    name: "Yonas Getachew",
    role: "VP of Engineering",
    bio: "Scaling teams and systems for high-growth startups",
    image: teamYonas,
  },
  {
    name: "Meron Hailu",
    role: "Head of Design",
    bio: "Award-winning UX designer with 10+ years experience",
    image: teamMeron,
  },
  {
    name: "Daniel Asfaw",
    role: "Head of Sales",
    bio: "Enterprise sales leader, built $50M+ pipelines",
    image: teamDaniel,
  },
  {
    name: "Tigist Worku",
    role: "Head of Operations",
    bio: "Operations excellence and process optimization",
    image: teamTigist,
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transforming Africa Through Technology
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                NovaTech Solutions is a leading technology company headquartered in 
                Addis Ababa, Ethiopia. We partner with businesses to build innovative 
                software solutions that drive growth and create lasting impact.
              </p>
              <p className="text-muted-foreground mb-8">
                Since our founding in 2018, we've helped over 500 businesses across 
                15+ countries modernize their operations, reach new markets, and 
                achieve their digital transformation goals.
              </p>
              <Link to="/contact">
                <Button className="bg-gradient-primary">
                  Work With Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <span className="text-6xl font-bold text-primary-foreground">N</span>
                  </div>
                  <p className="text-muted-foreground">Team Photo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                To empower businesses across Africa and beyond with world-class 
                technology solutions that drive growth, enhance efficiency, and 
                create positive social impact. We believe technology should be 
                accessible to all and serve as a catalyst for progress.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                To be the leading technology partner for businesses seeking digital 
                transformation in emerging markets. We envision a future where 
                African tech companies are global leaders in innovation, and we're 
                committed to making that vision a reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground">
              Our core values guide everything we do and define who we are as a company.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the Leadership
            </h2>
            <p className="text-muted-foreground">
              Our experienced team brings together decades of expertise in technology, 
              business, and innovation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="group bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-2 ring-primary/20"
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-muted-foreground">
              Our work has been recognized by leading industry organizations.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Best Tech Company 2023",
              "Innovation Award 2022",
              "Top Employer 2023",
              "Excellence in AI 2023",
            ].map((award) => (
              <div
                key={award}
                className="bg-card rounded-xl p-6 border border-border text-center"
              >
                <Award className="w-8 h-8 text-warning mx-auto mb-3" />
                <p className="font-medium">{award}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Whether you're looking to partner with us or join our team, we'd love to hear from you.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact">
              <Button className="bg-gradient-primary">
                Get in Touch
              </Button>
            </Link>
            <Link to="/careers">
              <Button variant="outline">
                View Careers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
