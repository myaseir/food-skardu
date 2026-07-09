"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import emailjs from '@emailjs/browser';
import { ChevronLeft, Home, Building, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart() as any;
  const total = items.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0);

  // Form State
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Delivery State
  const [deliveryType, setDeliveryType] = useState<'home' | 'hotel'>('hotel');
  const [homeAddress, setHomeAddress] = useState("");
  
  // Smart Hotel Search State
  const [hotelName, setHotelName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // The Master Hotel List
  const SKARDU_HOTELS = [
    "Rus Olive Lodge",
    "Sundus Guest house",
    "Shangrila Resort Skardu",
    "Serena Hotel Shigar",
    "Kharpocho Guest House",
    "Himalaya Hotel Skardu",
    "Dewan-e-Khas Resort"
  ];

  // Case-insensitive filter logic
  const filteredHotels = SKARDU_HOTELS.filter(hotel => 
    hotel.toLowerCase().includes(hotelName.toLowerCase())
  );

  const handlePlaceOrder = async () => {
    // Basic Validation
    if (!name || !phone) return alert("Please enter your name and phone number.");
    if (deliveryType === 'home' && !homeAddress) return alert("Please enter your home address.");
    if (deliveryType === 'hotel' && !hotelName) return alert("Please enter or select a hotel.");

    setIsSending(true);

    const finalAddress = deliveryType === 'home' 
      ? `HOME: ${homeAddress}` 
      : `HOTEL/ROOM: ${hotelName}`;

    const templateParams = {
      user_name: name,
      user_phone: phone,
      address: finalAddress,
      order_items: items.map((i: any) => i.name).join(", "),
      total_price: total,
    };

  try {
      // Pulling credentials securely from .env.local
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      
      setStep('success');
      clearCart();
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to place order. Please try again or contact support.");
    } finally {
      setIsSending(false);
    }
  };

  // SUCCESS SCREEN
  if (step === 'success') {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full flex flex-col items-center animate-in zoom-in duration-500">
          <CheckCircle2 size={80} className="text-purple-600 mb-6" />
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 font-bold mb-8">Your order is cooking. Thank you for choosing Food Skardu.</p>
          <Link href="/" className="w-full bg-purple-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-purple-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // EMPTY CART SCREEN
  if (items.length === 0 && step === 'form') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-black uppercase mb-4">Your cart is empty</h2>
        <Link href="/" className="text-purple-600 font-bold hover:underline">Start Browsing</Link>
      </div>
    );
  }

  // CHECKOUT FORM SCREEN
  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-50">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft /></Link>
        <h1 className="text-xl font-black uppercase tracking-tighter">Checkout</h1>
      </div>

      <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        
        {/* Left Column: Delivery Details */}
        <div className="space-y-6">
          
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-black uppercase mb-4 text-gray-900">Contact Details</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-purple-600 transition-colors" />
              <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-purple-600 transition-colors" />
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-black uppercase mb-4 text-gray-900">Delivery Location</h2>
            
            {/* Toggle Hotel vs Home */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">

                  <button 
                onClick={() => setDeliveryType('hotel')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${deliveryType === 'hotel' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Building size={16} /> Hotel
              </button>
              <button 
                onClick={() => setDeliveryType('home')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${deliveryType === 'home' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Home size={16} /> Home
              </button>
            
            </div>

            {/* Conditional Inputs */}
            {deliveryType === 'home' ? (
              <textarea 
                placeholder="Complete House Address (e.g. Street, Muhallah, Nearest Landmark)" 
                value={homeAddress} 
                onChange={(e) => setHomeAddress(e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-purple-600 transition-colors h-32 resize-none" 
              />
            ) : (
              <div className="space-y-4 relative">
                {/* Smart Autocomplete Input */}
                <input 
                  type="text" 
                  placeholder="Search or type hotel & room no..." 
                  value={hotelName} 
                  onChange={(e) => {
                    setHotelName(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  // The timeout ensures the user's click on a suggestion registers before the dropdown hides
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-purple-600 transition-colors" 
                />
                
                {/* Custom Dropdown Suggestions */}
                {showSuggestions && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {filteredHotels.length > 0 ? (
                      filteredHotels.map(hotel => (
                        <div 
                          key={hotel} 
                          onClick={() => {
                            setHotelName(hotel);
                            setShowSuggestions(false);
                          }}
                          className="p-4 border-b border-gray-50 last:border-0 hover:bg-purple-50 hover:text-purple-600 cursor-pointer transition-colors font-medium text-sm text-gray-700"
                        >
                          {hotel}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-gray-500 italic bg-gray-50 rounded-xl">
                        "{hotelName}" will be saved as a custom hotel.
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 pl-2">
                  Tip: Include your room number (e.g., Rus Olive Lodge - Room 102)
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-black uppercase mb-4 text-gray-900">Order Summary</h2>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
              {items.map((item: any, index: number) => (
  <div key={`${item.id}-${index}`} className="flex justify-between items-center text-sm">
    <span className="font-bold text-gray-700">
      {/* ADD THE QUANTITY HERE */}
      {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
    </span>
    <span className="font-black">Rs. {item.price * (item.quantity || 1)}</span>
  </div>
))}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-6 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-500 uppercase tracking-widest text-sm">Total to pay</span>
                <span className="text-3xl font-black text-purple-600">Rs. {total}</span>
              </div>
              <p className="text-right text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Cash on Delivery</p>
            </div>

            <button 
              disabled={isSending}
              onClick={handlePlaceOrder}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-purple-700 active:scale-95 transition-all disabled:bg-gray-400 disabled:scale-100 flex justify-center items-center gap-2"
            >
              {isSending ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}