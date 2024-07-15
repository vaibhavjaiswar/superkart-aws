import type { Metadata } from "next";
import AdminSideMenu from "./AdminSideMenu";

export const metadata: Metadata = {
  title: "Admin | SuperKart 🛒",
  description: "Administrator of SuperKart 🛒 a online e-commerce web application project",
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-full flex justify-start items-start">
      <div className="self-stretch shadow-xl">
        <AdminSideMenu />
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}
