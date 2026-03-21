import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-primary opacity-95" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
      <div
        className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Ready to Transform Your Business?
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Let's Build Something{" "}
            <span className="underline decoration-wavy decoration-white/50 underline-offset-8">
              Amazing
            </span>{" "}
            Together
          </h2>

          {/* Description */}
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            From startups to enterprises, we partner with businesses to create 
            innovative solutions that drive real results. Get in touch for a 
            free consultation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-xl"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                View Our Work
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">48h</div>
              <div className="text-sm text-white/70">Response Time</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">Free</div>
              <div className="text-sm text-white/70">Initial Consultation</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
              <div className="text-sm text-white/70">Satisfaction Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
