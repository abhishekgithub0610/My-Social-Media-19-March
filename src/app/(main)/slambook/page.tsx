import type { Metadata } from "next";
import Slambook from "@/features/slambook/components/Slambook";

export const metadata: Metadata = { title: "Slambook" };

export default function SlambookPage() {
  return <Slambook />;
}
