import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPage from "./landing";
import dotenv from "dotenv";

dotenv.config();

export default async function HomePage() {
  const { userId } = auth();
  if (userId) {
    redirect(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL!);
  }
  return <LandingPage />;
}
