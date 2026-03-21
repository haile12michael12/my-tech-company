 import React, { createContext, useContext, useState, ReactNode } from "react";
 
 export interface ServicePackage {
   id: string;
   name: string;
   tier: string;
   price: number;
   description: string;
   features: string[];
 }
 
 export interface CartItem {
   package: ServicePackage;
   quantity: number;
 }
 
 interface CartContextType {
   items: CartItem[];
   addToCart: (pkg: ServicePackage) => void;
   removeFromCart: (packageId: string) => void;
   updateQuantity: (packageId: string, quantity: number) => void;
   clearCart: () => void;
   totalItems: number;
   totalPrice: number;
 }
 
 const CartContext = createContext<CartContextType | undefined>(undefined);
 
 export function CartProvider({ children }: { children: ReactNode }) {
   const [items, setItems] = useState<CartItem[]>([]);
 
   const addToCart = (pkg: ServicePackage) => {
     setItems((prev) => {
       const existing = prev.find((item) => item.package.id === pkg.id);
       if (existing) {
         return prev.map((item) =>
           item.package.id === pkg.id
             ? { ...item, quantity: item.quantity + 1 }
             : item
         );
       }
       return [...prev, { package: pkg, quantity: 1 }];
     });
   };
 
   const removeFromCart = (packageId: string) => {
     setItems((prev) => prev.filter((item) => item.package.id !== packageId));
   };
 
   const updateQuantity = (packageId: string, quantity: number) => {
     if (quantity <= 0) {
       removeFromCart(packageId);
       return;
     }
     setItems((prev) =>
       prev.map((item) =>
         item.package.id === packageId ? { ...item, quantity } : item
       )
     );
   };
 
   const clearCart = () => setItems([]);
 
   const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
   const totalPrice = items.reduce(
     (sum, item) => sum + item.package.price * item.quantity,
     0
   );
 
   return (
     <CartContext.Provider
       value={{
         items,
         addToCart,
         removeFromCart,
         updateQuantity,
         clearCart,
         totalItems,
         totalPrice,
       }}
     >
       {children}
     </CartContext.Provider>
   );
 }
 
 export function useCart() {
   const context = useContext(CartContext);
   if (!context) {
     throw new Error("useCart must be used within a CartProvider");
   }
   return context;
 }