import Link from "next/link";

export default function AdminSideMenu() {
  return (
    <div>
      <h2 className="px-8 py-4 text-xl">Admin Menu</h2>
      <ul>
        <Link href="/admin">
          <li className="px-8 py-2 hover:bg-neutral-200">
            Dashboard
          </li>
        </Link>
        <Link href="/admin/add-product">
          <li className="px-8 py-2 hover:bg-neutral-200">
            Add Product
          </li>
        </Link>
        <Link href="/admin/refresh-images">
          <li className="px-8 py-2 hover:bg-neutral-200">
            Refresh Images
          </li>
        </Link>
      </ul>
    </div>
  )
}