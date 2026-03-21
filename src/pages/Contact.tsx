import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "info@novatech.com",
    link: "mailto:info@novatech.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+251 91 123 4567",
    link: "tel:+251911234567",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "Bole Road, Addis Ababa, Ethiopia",
    link: "#",
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon - Fri: 9:00 AM - 6:00 PM",
    link: "#",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Form submission logic would go here
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Start a Conversation
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a project in mind? We'd love to hear about it. Get in touch 
              and let's discuss how we can help transform your business.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((item) => (
              <a
                key={item.title}
                href={item.link}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Send Us a Message</h2>
                  <p className="text-sm text-muted-foreground">
                    We'll get back to you within 24 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+251 91 123 4567"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Interested In *</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        setFormData({ ...formData, service: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Development</SelectItem>
                        <SelectItem value="mobile">Mobile App Development</SelectItem>
                        <SelectItem value="cloud">Cloud Solutions</SelectItem>
                        <SelectItem value="ai">AI & Machine Learning</SelectItem>
                        <SelectItem value="security">Cybersecurity</SelectItem>
                        <SelectItem value="analytics">Data Analytics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Project Budget</Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) =>
                        setFormData({ ...formData, budget: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k+">$100,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Project Details *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project, goals, and timeline..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-primary">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map & Schedule */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">Bole Road, Addis Ababa</p>
                  </div>
                </div>
              </div>

              {/* Schedule Meeting */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Schedule a Meeting</h2>
                    <p className="text-sm text-muted-foreground">
                      Book a free consultation call
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Prefer to discuss your project in person? Schedule a 30-minute 
                  consultation with one of our experts.
                </p>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-5 h-5 mr-2" />
                  View Available Times
                </Button>
              </div>

              {/* FAQ Link */}
              <div className="bg-muted/50 rounded-2xl p-6 text-center">
                <p className="text-muted-foreground mb-2">
                  Have questions? Check our
                </p>
                <Button variant="link" className="text-primary font-semibold">
                  Frequently Asked Questions →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
