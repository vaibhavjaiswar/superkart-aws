import { Metadata } from "next"
import AdminRefreshProductImagesForm from "./AdminRefreshProductImages"

export const metadata: Metadata = {
  title: "Refresh Product Images | SuperKart 🛒",
}

export default function AdminRefreshImagesPage() {
  return (
    <section className="global-responsive-px py-4">
      <h2 className="mb-4 text-2xl">Refresh Product Images</h2>
      <AdminRefreshProductImagesForm />
    </section>
  )
}