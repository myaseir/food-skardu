"use client";
import { useState } from "react";

export default function CheckoutModal({ isOpen, onClose, cartTotal }: any) {
  const [details, setDetails] = useState({ name: "", phone: "", address: "" });

  if (!isOpen) return null;

  const handleOrder = () => {
    // In a real app, this sends to a database. 
    // For now, it builds a WhatsApp/SMS message for you.
    const message = `New Order!%0A%0AClient: ${details.name}%0APhone: ${details.phone}%0AAddress: ${details.address}%0ATotal: Rs. ${cartTotal}`;
    window.open(`https://wa.me/923XXXXXXXXXX?text=${message}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black uppercase mb-6">Checkout</h2>
        
        <div className="space-y-4">
          <input placeholder="Your Name" className="w-full p-4 border rounded-xl" onChange={(e) => setDetails({...details, name: e.target.value})} />
          <input placeholder="Phone Number" className="w-full p-4 border rounded-xl" onChange={(e) => setDetails({...details, phone: e.target.value})} />
          <textarea placeholder="Delivery Address" className="w-full p-4 border rounded-xl" onChange={(e) => setDetails({...details, address: e.target.value})} />
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 p-4 font-bold text-gray-500">Cancel</button>
          <button onClick={handleOrder} className="flex-1 p-4 bg-purple-600 text-white font-black rounded-xl">Place Order (COD)</button>
        </div>
      </div>
    </div>
  );
}