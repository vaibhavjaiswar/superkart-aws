import { Metadata } from "next"
import AdminAddProductForm from "./AdminAddProduct"

export const metadata: Metadata = {
  title: "Add Product | SuperKart 🛒",
}

export default function AdminAddProductPage() {
  return (
    <section className="global-responsive-px py-4">
      <h2 className="mb-4 text-2xl">Add New Product</h2>
      <AdminAddProductForm />
    </section>
  )
}