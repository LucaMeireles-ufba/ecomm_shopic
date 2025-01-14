"use client";

import { useCart } from "@/components/CartContext";

export default function NavbarCart() {
  const { cartCount } = useCart();

  if (cartCount > 0) {
    return (
      <span className="absolute -top-2 -right-2 bg-red-400 rounded-full line leading-none px-1 py-0.5 text-white inline">
        {cartCount}
      </span>
    );
  }

  return <></>;
}
