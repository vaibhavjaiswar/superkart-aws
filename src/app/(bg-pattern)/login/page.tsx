import Link from "next/link";
import LoginForm from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | SuperKart 🛒",
}

export default function LoginPage() {
  return (
    <>
      <h2 className="mb-2 text-2xl">Login</h2>
      <LoginForm />
      <div className="py-1 text-xs text-neutral-500 text-center">
        <p>Don&apos;t have an account?</p>
        <Link className="underline" href={'/signup'}>Click here to sign up</Link>
      </div>
    </>
  )
}
