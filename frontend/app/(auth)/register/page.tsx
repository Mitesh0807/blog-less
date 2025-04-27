import { AuthForm } from "@/components/auth/auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Blog-Less",
  description: "Create a new account on Blog-Less",
};

export default function RegisterPage() {
  return <AuthForm type="register" />;
}