"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, PlusCircle, Package, Store, Box } from "lucide-react";
import { useSidebar } from "../contexts/SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const links = [
    // { name: "New Order", href: "/", icon: PlusCircle },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Order Management", href: "/orders", icon: ShoppingBag },
    { name: "Store Management", href: "/stores", icon: Store },
    { name: "Menu Management", href: "/items", icon: Box },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <aside className={`w-64 bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col border-r border-slate-800 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Package className="w-6 h-6 text-blue-500 mr-3 rounded-full bg-blue-500/10 p-1" />
        <span className="font-bold text-md tracking-wide">Order Management</span>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        &copy; 2026 OrderMaster
      </div>
    </aside>
    </>
  );
}
