import type React from "react"
import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const metadata: Metadata = {
  title: "Panel de Administración | EduApp",
  description: "Panel de administración para gestionar cursos, usuarios y contenido de EduApp",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 px-4 md:px-6">{children}</div>
      </div>
    </div>
  )
}
