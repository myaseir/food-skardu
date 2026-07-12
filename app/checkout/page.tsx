"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import emailjs from "@emailjs/browser";
import {
  ChevronLeft,
  CheckCircle2,
  User,
  Phone,
  Hotel,
  DoorOpen,
  Receipt,
  Loader2,
  ShoppingBag,
  ChevronDown,
  PhoneCall,
  Home,
  Building,
  MapPin
} from "lucide-react";
import { SKARDU_HOTELS, SKARDU_AREAS } from "@/data/location";
import { shops } from "@/data/config";
import { calculateDeliveryFee } from "@/utils/deliveryCalculator";

export default function CheckoutPage() {
  const { items, clearCart } = useCart() as any;
  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * (item.quantity || 1),
    0
  );

  const [step, setStep] = useState<"form" | "success">("form");
  const [isSending, setIsSending] = useState(false);
  
  // Contact State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Delivery State
  const [deliveryMode, setDeliveryMode] = useState<"hotel" | "home">("hotel");
  const [locationName, setLocationName] = useState(""); // Acts as Hotel Name OR Area Name
  const [addressDetail, setAddressDetail] = useState(""); // Acts as Room No OR Complete Address
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Dynamic Delivery Calculation
  const currentShop = shops.find((s) => s.id === items[0]?.shopId);
  const deliveryFee = currentShop && locationName ? calculateDeliveryFee(currentShop, locationName) : 0;
  const total = subtotal + deliveryFee;

  // SMART FILTER: Choose the right list based on delivery mode
  const currentList = deliveryMode === "hotel" ? SKARDU_HOTELS : SKARDU_AREAS;
  const filteredLocations = Object.keys(currentList).filter((loc) =>
    loc.toLowerCase().includes(locationName.toLowerCase())
  );

  const handlePlaceOrder = async () => {
    if (!name || !phone) return alert("Please enter your name and whatsapp number.");
    
    if (!locationName || !addressDetail) {
      const errorMsg = deliveryMode === 'hotel' 
        ? "Please select your hotel and enter your room number." 
        : "Please select your area and enter your complete house address.";
      return alert(errorMsg);
    }

    setIsSending(true);

    // Format address for the email based on the delivery mode
    const finalAddress = deliveryMode === 'hotel'
      ? `HOTEL: ${locationName} | ROOM: ${addressDetail}`
      : `HOME AREA: ${locationName} | ADDRESS: ${addressDetail}`;

    const detailedItems = items
      .map(
        (i: any) =>
          (i.quantity || 1) + "x " + i.name + " (Rs. " + i.price * (i.quantity || 1) + ")"
      )
      .join("\n");

    const templateParams = {
      user_name: name,
      user_phone: phone,
      address: finalAddress,
      order_items: detailedItems,
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      total_price: total,
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setStep("success");
      clearCart();
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Empty cart guard
  if (items.length === 0 && step === "form") {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag size={48} className="text-gray-300 mb-4" />
        <h1 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          Add something delicious first, then come back to checkout.
        </p>
        <Link
          href="/"
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-purple-700 active:scale-95 transition-all"
        >
          Browse Restaurants
        </Link>
      </main>
    );
  }

  // Success Screen
  if (step === "success") {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl max-w-md w-full flex flex-col items-center animate-in zoom-in duration-500">
          <CheckCircle2 size={64} className="text-purple-600 mb-4 sm:mb-6 sm:w-20 sm:h-20" />
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 font-bold mb-5 text-sm sm:text-base">
            Your order is cooking. Thank you for choosing Food Skardu.
          </p>

          <div className="w-full flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-8 text-left">
            <div className="shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <PhoneCall size={18} className="text-white" />
            </div>
            <p className="text-purple-700 font-bold text-xs sm:text-sm leading-snug">
              You'll get a confirmation call on WhatsApp or your phone number shortly.
            </p>
          </div>

          <Link href="/" className="w-full bg-purple-600 text-white py-3.5 sm:py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-purple-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // Form Screen
  return (
    <main className="min-h-screen bg-gray-50 pb-56 md:pb-16">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-40 border-b border-gray-100">
        <Link
          href="/"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tighter text-gray-900">
          Checkout
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-2">
        {/* Left column: forms */}
        <div className="space-y-5">
          {/* Contact Details */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-black uppercase text-[13px] tracking-widest mb-4 text-gray-900">
              Contact Details
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <User
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  placeholder="Whatsapp Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </section>

          {/* Delivery Location */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-black uppercase text-[13px] tracking-widest mb-4 text-gray-900">
              Delivery Location
            </h2>

            {/* Delivery Toggle (Hotel vs Home) */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
              <button 
                onClick={() => { setDeliveryMode('hotel'); setLocationName(''); setAddressDetail(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[11px] transition-all ${deliveryMode === 'hotel' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Building size={14} /> Hotel
              </button>
              <button 
                onClick={() => { setDeliveryMode('home'); setLocationName(''); setAddressDetail(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[11px] transition-all ${deliveryMode === 'home' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Home size={14} /> Home/Office
              </button>
            </div>

            <div className="space-y-3">
              {/* Dropdown Input for Location/Area */}
              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                />
                <input
                  type="text"
                  placeholder={deliveryMode === 'hotel' ? "Search for your hotel..." : "Select Area (e.g., Sundus, Olding)..."}
                  value={locationName}
                  onChange={(e) => {
                    setLocationName(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />

                {showSuggestions && filteredLocations.length > 0 && (
                  <div className="absolute w-full bg-white border border-gray-100 shadow-xl rounded-xl z-50 max-h-52 overflow-y-auto mt-2">
                    {filteredLocations.map((loc) => (
                      <div
                        key={loc}
                        onClick={() => {
                          setLocationName(loc);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Number OR Full Address Input */}
              <div className="relative">
                <DoorOpen
                  size={17}
                  className={`absolute left-4 ${deliveryMode === 'home' ? 'top-4' : 'top-1/2 -translate-y-1/2'} text-gray-400`}
                />
                {deliveryMode === 'hotel' ? (
                  <input
                    type="text"
                    placeholder="Room Number"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  />
                ) : (
                  <textarea
                    placeholder="Complete House Address (Street, nearest landmark...)"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all h-24 resize-none"
                  />
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right column: order summary (static on desktop) */}
        <div className="hidden md:block">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-black uppercase text-[13px] tracking-widest mb-4 text-gray-900 flex items-center gap-2">
              <Receipt size={15} className="text-purple-600" />
              Order Summary
            </h2>

            <div className="space-y-2.5 mb-5 max-h-64 overflow-y-auto pr-1">
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between text-[13px] font-bold text-gray-700 gap-3"
                >
                  <span className="truncate">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="shrink-0">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-[13px] font-bold text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-[13px] font-bold text-gray-500">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="flex justify-between items-end pt-1">
                <span className="font-black text-gray-900 uppercase text-[13px] tracking-widest">
                  Total
                </span>
                <span className="text-2xl font-black text-purple-600">Rs. {total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSending}
              className="w-full mt-6 bg-purple-600 text-white py-4 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sticky summary + order bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] z-50">
        {/* Toggle header */}
        <button
          onClick={() => setShowMobileSummary((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3"
        >
          <div className="flex items-center gap-2">
            <Receipt size={15} className="text-purple-600 shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">
              {items.reduce((s: number, i: any) => s + (i.quantity || 1), 0)} items
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${showMobileSummary ? "rotate-180" : ""}`}
          />
        </button>

        {/* Expandable item list */}
        {showMobileSummary && (
          <div className="px-5 pb-2 space-y-2 max-h-40 overflow-y-auto border-t border-gray-100 pt-3">
            {items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex justify-between text-[12px] font-bold text-gray-700 gap-3"
              >
                <span className="truncate">
                  {item.quantity}x {item.name}
                </span>
                <span className="shrink-0">Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        )}

        {/* Always-visible price breakdown */}
        <div className="px-5 pt-1 pb-2 border-t border-gray-100 space-y-1">
          <div className="flex justify-between text-[12px] font-bold text-gray-500">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          <div className="flex justify-between text-[12px] font-bold text-gray-500">
            <span>Delivery Fee</span>
            <span>Rs. {deliveryFee}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">
              Total
            </span>
            <span className="text-lg font-black text-purple-600">Rs. {total}</span>
          </div>
        </div>

        {/* Order button */}
        <div className="px-4 pb-4 pt-1">
          <button
            onClick={handlePlaceOrder}
            disabled={isSending}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}