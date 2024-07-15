import Link from "next/link";
import { Metadata } from "next";
import AdminLoginForm from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login | SuperKart 🛒",
}

export default function AdminLogin() {
  return (
    <>
      <h2 className="mb-2 text-2xl">Admin Login</h2>
      <AdminLoginForm />
      <div className="py-1 text-xs text-neutral-500 text-center">
        <p>Only for Superkart Admin</p>
        <Link className="underline" href={'/login'}>Click here to login as normal user</Link>
      </div>
    </>
  )
}
