import { redirect } from "next/navigation";

export default function Home() {
  redirect("/feed"); // or "/sign-in" if not logged in
}
