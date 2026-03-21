 import { Layout } from "@/components/layout/Layout";
 import { Link } from "react-router-dom";
 import { Check, ShoppingCart, Star, Zap, Shield, Rocket } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { useCart, ServicePackage } from "@/contexts/CartContext";
 import { toast } from "sonner";
 import { cn } from "@/lib/utils";
 
 const packages: ServicePackage[] = [
   {
     id: "web-starter",
     name: "Web Starter",
     tier: "Basic",
     price: 2999,
     description: "Perfect for small businesses looking to establish their online presence.",
     features: [
       "5-page responsive website",
       "Basic SEO optimization",
       "Contact form integration",
       "Mobile-friendly design",
       "1 month support",
       "Basic analytics setup",
     ],
   },
   {
     id: "web-professional",
     name: "Web Professional",
     tier: "Popular",
     price: 7999,
     description: "Ideal for growing businesses needing advanced features and customization.",
     features: [
       "Up to 15 pages",
       "Advanced SEO & analytics",
       "CMS integration",
       "E-commerce ready (up to 50 products)",
       "Custom animations",
       "3 months support",
       "Performance optimization",
       "Social media integration",
     ],
   },
   {
     id: "web-enterprise",
     name: "Web Enterprise",
     tier: "Premium",
     price: 19999,
     description: "Full-scale solution for enterprises requiring complex functionality.",
     features: [
       "Unlimited pages",
       "Custom web application",
       "Advanced security features",
       "Multi-language support",
       "API integrations",
       "12 months priority support",
       "Dedicated project manager",
       "Performance & load testing",
       "Custom admin dashboard",
     ],
   },
   {
     id: "mobile-starter",
     name: "Mobile Starter",
     tier: "Basic",
     price: 9999,
     description: "Launch your mobile presence with a cross-platform app.",
     features: [
       "Cross-platform (iOS & Android)",
       "Up to 5 screens",
       "Push notifications",
       "Basic analytics",
       "App store submission",
       "1 month support",
     ],
   },
   {
     id: "mobile-professional",
     name: "Mobile Professional",
     tier: "Popular",
     price: 24999,
     description: "Feature-rich mobile app with backend integration.",
     features: [
       "Up to 15 screens",
       "User authentication",
       "Backend API integration",
       "Offline functionality",
       "In-app purchases",
       "6 months support",
       "Performance optimization",
       "A/B testing setup",
     ],
   },
   {
     id: "cloud-setup",
     name: "Cloud Setup",
     tier: "Basic",
     price: 4999,
     description: "Migrate and set up your infrastructure in the cloud.",
     features: [
       "Cloud architecture design",
       "Basic migration support",
       "CI/CD pipeline setup",
       "Monitoring & alerts",
       "Documentation",
       "1 month support",
     ],
   },
 ];
 
 const tierConfig = {
   Basic: { icon: Zap, color: "from-blue-500 to-cyan-500" },
   Popular: { icon: Star, color: "from-purple-500 to-pink-500" },
   Premium: { icon: Rocket, color: "from-orange-500 to-red-500" },
 };
 
 const Packages = () => {
   const { addToCart, totalItems } = useCart();
 
   const handleAddToCart = (pkg: ServicePackage) => {
     addToCart(pkg);
     toast.success(`${pkg.name} added to cart!`);
   };
 
   return (
     <Layout>
       {/* Hero Section */}
       <section className="pt-32 pb-20 bg-gradient-hero">
         <div className="container mx-auto px-4">
           <div className="max-w-3xl mx-auto text-center">
             <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
               Service Packages
             </span>
             <h1 className="text-4xl md:text-5xl font-bold mb-6">
               Choose Your Perfect Package
             </h1>
             <p className="text-lg text-muted-foreground mb-8">
               Transparent pricing with everything you need. Select a package that 
               fits your business goals and budget.
             </p>
             {totalItems > 0 && (
               <Link to="/checkout">
                 <Button size="lg" className="bg-gradient-primary">
                   <ShoppingCart className="w-5 h-5 mr-2" />
                   View Cart ({totalItems})
                 </Button>
               </Link>
             )}
           </div>
         </div>
       </section>
 
       {/* Packages Grid */}
       <section className="py-20">
         <div className="container mx-auto px-4">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {packages.map((pkg) => {
               const config = tierConfig[pkg.tier as keyof typeof tierConfig];
               const TierIcon = config.icon;
 
               return (
                 <div
                   key={pkg.id}
                   className={cn(
                     "relative bg-card rounded-2xl border border-border p-6 flex flex-col transition-all hover:shadow-xl hover:border-primary/30",
                     pkg.tier === "Popular" && "ring-2 ring-primary"
                   )}
                 >
                   {pkg.tier === "Popular" && (
                     <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary">
                       Most Popular
                     </Badge>
                   )}
 
                   {/* Header */}
                   <div className="mb-6">
                     <div
                       className={cn(
                         "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                         config.color
                       )}
                     >
                       <TierIcon className="w-6 h-6 text-white" />
                     </div>
                     <Badge variant="outline" className="mb-2">
                       {pkg.tier}
                     </Badge>
                     <h3 className="text-xl font-bold">{pkg.name}</h3>
                     <p className="text-sm text-muted-foreground mt-1">
                       {pkg.description}
                     </p>
                   </div>
 
                   {/* Price */}
                   <div className="mb-6">
                     <span className="text-4xl font-bold">
                       ${pkg.price.toLocaleString()}
                     </span>
                     <span className="text-muted-foreground ml-1">one-time</span>
                   </div>
 
                   {/* Features */}
                   <div className="flex-1 mb-6">
                     <ul className="space-y-3">
                       {pkg.features.map((feature) => (
                         <li key={feature} className="flex items-start gap-2">
                           <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                           <span className="text-sm">{feature}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
 
                   {/* CTA */}
                   <Button
                     onClick={() => handleAddToCart(pkg)}
                     className={cn(
                       "w-full",
                       pkg.tier === "Popular"
                         ? "bg-gradient-primary"
                         : "bg-primary"
                     )}
                   >
                     <ShoppingCart className="w-4 h-4 mr-2" />
                     Add to Cart
                   </Button>
                 </div>
               );
             })}
           </div>
         </div>
       </section>
 
       {/* Custom Solutions CTA */}
       <section className="py-20 bg-muted/30">
         <div className="container mx-auto px-4 text-center">
           <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
           <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
           <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
             Our packages don't fit your needs? Contact us for a tailored solution 
             designed specifically for your business requirements.
           </p>
           <Link to="/contact">
             <Button size="lg" variant="outline">
               Request Custom Quote
             </Button>
           </Link>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Packages;