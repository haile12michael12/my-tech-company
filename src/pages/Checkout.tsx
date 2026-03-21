 import { Layout } from "@/components/layout/Layout";
 import { useState } from "react";
 import { Link, useNavigate } from "react-router-dom";
 import {
   ArrowLeft,
   Trash2,
   Minus,
   Plus,
   ShoppingBag,
   CreditCard,
   CheckCircle2,
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Separator } from "@/components/ui/separator";
 import { useCart } from "@/contexts/CartContext";
 import { toast } from "sonner";
 import { cn } from "@/lib/utils";
 
 const Checkout = () => {
   const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
   const navigate = useNavigate();
   const [step, setStep] = useState<"cart" | "details" | "confirmation">("cart");
   const [formData, setFormData] = useState({
     name: "",
     email: "",
     company: "",
     phone: "",
     notes: "",
   });
 
   const handleSubmitOrder = (e: React.FormEvent) => {
     e.preventDefault();
     // Mock order submission
     console.log("Order submitted:", { items, formData, total: totalPrice });
     setStep("confirmation");
     toast.success("Order submitted successfully!");
   };
 
   const handleNewOrder = () => {
     clearCart();
     navigate("/packages");
   };
 
   if (items.length === 0 && step !== "confirmation") {
     return (
       <Layout>
         <section className="pt-32 pb-20 min-h-[60vh] flex items-center">
           <div className="container mx-auto px-4 text-center">
             <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
             <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
             <p className="text-muted-foreground mb-6">
               Browse our service packages to get started.
             </p>
             <Link to="/packages">
               <Button className="bg-gradient-primary">View Packages</Button>
             </Link>
           </div>
         </section>
       </Layout>
     );
   }
 
   if (step === "confirmation") {
     return (
       <Layout>
         <section className="pt-32 pb-20 min-h-[60vh] flex items-center">
           <div className="container mx-auto px-4 text-center max-w-lg">
             <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="w-10 h-10 text-primary" />
             </div>
             <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
             <p className="text-muted-foreground mb-8">
               Thank you for your order. Our team will review your request and 
               contact you within 24 hours to discuss the next steps.
             </p>
             <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left">
               <h3 className="font-semibold mb-2">Order Summary</h3>
               <p className="text-sm text-muted-foreground mb-1">
                 Name: {formData.name}
               </p>
               <p className="text-sm text-muted-foreground mb-1">
                 Email: {formData.email}
               </p>
               <p className="text-sm text-muted-foreground">
                 Total: ${totalPrice.toLocaleString()}
               </p>
             </div>
             <Button onClick={handleNewOrder} className="bg-gradient-primary">
               Start New Order
             </Button>
           </div>
         </section>
       </Layout>
     );
   }
 
   return (
     <Layout>
       <section className="pt-32 pb-20">
         <div className="container mx-auto px-4">
           {/* Header */}
           <div className="mb-8">
             <Link
               to="/packages"
               className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
             >
               <ArrowLeft className="w-4 h-4 mr-1" />
               Back to Packages
             </Link>
             <h1 className="text-3xl font-bold">
               {step === "cart" ? "Your Cart" : "Order Details"}
             </h1>
           </div>
 
           {/* Steps Indicator */}
           <div className="flex items-center gap-4 mb-8">
             <div
               className={cn(
                 "flex items-center gap-2",
                 step === "cart" ? "text-primary" : "text-muted-foreground"
               )}
             >
               <div
                 className={cn(
                   "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                   step === "cart"
                     ? "bg-primary text-primary-foreground"
                     : "bg-muted"
                 )}
               >
                 1
               </div>
               <span className="text-sm font-medium">Cart</span>
             </div>
             <div className="flex-1 h-px bg-border" />
             <div
               className={cn(
                 "flex items-center gap-2",
                 step === "details" ? "text-primary" : "text-muted-foreground"
               )}
             >
               <div
                 className={cn(
                   "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                   step === "details"
                     ? "bg-primary text-primary-foreground"
                     : "bg-muted"
                 )}
               >
                 2
               </div>
               <span className="text-sm font-medium">Details</span>
             </div>
           </div>
 
           <div className="grid lg:grid-cols-3 gap-8">
             {/* Main Content */}
             <div className="lg:col-span-2">
               {step === "cart" ? (
                 <div className="bg-card rounded-2xl border border-border p-6">
                   <h2 className="text-lg font-semibold mb-4">
                     Selected Packages ({items.length})
                   </h2>
                   <div className="space-y-4">
                     {items.map((item) => (
                       <div
                         key={item.package.id}
                         className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl"
                       >
                         <div className="flex-1">
                           <h3 className="font-semibold">{item.package.name}</h3>
                           <p className="text-sm text-muted-foreground mb-2">
                             {item.package.tier} Package
                           </p>
                           <p className="font-medium">
                             ${item.package.price.toLocaleString()}
                           </p>
                         </div>
                         <div className="flex items-center gap-2">
                           <Button
                             variant="outline"
                             size="icon"
                             className="h-8 w-8"
                             onClick={() =>
                               updateQuantity(item.package.id, item.quantity - 1)
                             }
                           >
                             <Minus className="w-4 h-4" />
                           </Button>
                           <span className="w-8 text-center font-medium">
                             {item.quantity}
                           </span>
                           <Button
                             variant="outline"
                             size="icon"
                             className="h-8 w-8"
                             onClick={() =>
                               updateQuantity(item.package.id, item.quantity + 1)
                             }
                           >
                             <Plus className="w-4 h-4" />
                           </Button>
                         </div>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="text-destructive hover:text-destructive"
                           onClick={() => removeFromCart(item.package.id)}
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <form
                   onSubmit={handleSubmitOrder}
                   className="bg-card rounded-2xl border border-border p-6"
                 >
                   <h2 className="text-lg font-semibold mb-4">
                     Contact Information
                   </h2>
                   <div className="space-y-4">
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
                         <Label htmlFor="email">Email *</Label>
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
                     <div className="space-y-2">
                       <Label htmlFor="notes">Project Notes</Label>
                       <Textarea
                         id="notes"
                         placeholder="Any specific requirements or questions..."
                         rows={4}
                         value={formData.notes}
                         onChange={(e) =>
                           setFormData({ ...formData, notes: e.target.value })
                         }
                       />
                     </div>
                   </div>
                   <div className="mt-6 flex gap-3">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => setStep("cart")}
                     >
                       Back
                     </Button>
                     <Button type="submit" className="flex-1 bg-gradient-primary">
                       <CreditCard className="w-4 h-4 mr-2" />
                       Submit Order
                     </Button>
                   </div>
                 </form>
               )}
             </div>
 
             {/* Order Summary */}
             <div>
               <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                 <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                 <div className="space-y-3">
                   {items.map((item) => (
                     <div
                       key={item.package.id}
                       className="flex justify-between text-sm"
                     >
                       <span className="text-muted-foreground">
                         {item.package.name} x{item.quantity}
                       </span>
                       <span>
                         ${(item.package.price * item.quantity).toLocaleString()}
                       </span>
                     </div>
                   ))}
                 </div>
                 <Separator className="my-4" />
                 <div className="flex justify-between text-lg font-semibold">
                   <span>Total</span>
                   <span>${totalPrice.toLocaleString()}</span>
                 </div>
                 {step === "cart" && (
                   <Button
                     onClick={() => setStep("details")}
                     className="w-full mt-6 bg-gradient-primary"
                   >
                     Proceed to Details
                   </Button>
                 )}
                 <p className="text-xs text-muted-foreground mt-4 text-center">
                   You'll receive an invoice after order review
                 </p>
               </div>
             </div>
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Checkout;