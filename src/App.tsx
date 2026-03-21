import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import ClientPortal from "./pages/ClientPortal";
import Packages from "./pages/Packages";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminTickets from "./pages/admin/AdminTickets";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/invoices" element={<AdminInvoices />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
