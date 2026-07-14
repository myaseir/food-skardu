import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Meal Bear Skardu | Food Delivery in Skardu, Gilgit-Baltistan",
  description:
    "Order food delivery in Skardu from top local restaurants including Yak & Bull, MFC, Pizza King, and Skyway Pizza. Fast delivery to homes, offices, and hotel rooms. Cash on Delivery.",
  alternates: {
    canonical: "https://www.mealbear.pk",
  },
};

export default function Home() {
  return <HomeClient />;
}