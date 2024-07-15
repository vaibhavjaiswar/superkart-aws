import Link from "next/link";
import SignUpForm from "./SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | SuperKart 🛒",
}

export default function SignUpPage() {
  return (
    <>
      <h2 className="mb-2 text-2xl">Sign Up</h2>
      <SignUpForm />
      <div className="py-1 text-xs text-neutral-500 text-center">
        <p>Already have an account?</p>
        <Link className="underline" href={'/login'}>Click here to login</Link>
      </div>
    </>
  )
}
