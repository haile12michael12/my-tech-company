import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroDashboard from "@/assets/hero-dashboard.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">
                Trusted by 500+ businesses worldwide
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Your Business with{" "}
              <span className="text-gradient">Innovative Technology</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              We build cutting-edge software solutions that drive growth, 
              enhance efficiency, and position your business for success 
              in the digital age.
            </p>

            {/* Feature List */}
            <div className="flex flex-wrap gap-4 mb-8">
              {["Custom Development", "Cloud Solutions", "AI Integration"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-gradient">500+</div>
                  <div className="text-sm text-muted-foreground">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient">50+</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient">98%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Main Card */}
              <div className="glass rounded-2xl p-4 shadow-xl">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img 
                    src={heroDashboard} 
                    alt="NovaTech Dashboard Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 glass rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Project Completed</div>
                    <div className="text-xs text-muted-foreground">Just now</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -left-4 glass rounded-xl p-4 shadow-lg animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card"
                      />
                    ))}
                  </div>
                  <div className="text-sm font-medium">+12 Team Members Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
