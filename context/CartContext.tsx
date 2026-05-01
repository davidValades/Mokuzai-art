"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 1. Definimos las interfaces de nuestros datos
export interface CartItem {
  id: string; // Usaremos el slug como ID único
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  cartTotal: number;
  cartCount: number;
}

// 2. Creamos el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Creamos el Provider que envolverá nuestra aplicación
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("mokuzai_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error al cargar la selección guardada.");
      }
    }
    setIsInitialized(true);
  }, []);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("mokuzai_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      if (existingItem) {
        // Si ya está, aumentamos la cantidad (aunque en arte exclusivo suele ser 1)
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar el carrito con elegancia
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
}