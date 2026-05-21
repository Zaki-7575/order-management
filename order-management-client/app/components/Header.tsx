"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, UserCircle, ShoppingBag, RefreshCw, Trash2, Menu } from "lucide-react";
import { notification, Badge, Popover } from "antd";
import { useSocket } from "@/src/hook/useSocket";
import { useSidebar } from "../contexts/SidebarContext";

type NotificationItem = {
  id: string;
  type: 'NEW_ORDER' | 'STATUS_UPDATE';
  title: string;
  message: string;
  time: Date;
};

export default function Header() {
  const pathname = usePathname();
  const { socket } = useSocket();
  const { toggleSidebar } = useSidebar();
  const [unreadCount, setUnreadCount] = useState(0);
  const [history, setHistory] = useState<NotificationItem[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Play notification sound
  const playSound = () => {
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(e => console.log("Audio play prevented by browser", e));
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    if (socket) {
      const handleNewOrder = (order: any) => {
        const title = 'New Order Received! 🚀';
        const msg = `Order ${order.id.split('-')[0]} placed by store ${order.store_id} for $${order.total_amount.toFixed(2)}.`;

        notification.success({
          title,
          description: msg,
          placement: 'topRight',
          duration: 5,
        });
        playSound();

        setHistory(prev => [{
          id: Date.now().toString() + Math.random(),
          type: 'NEW_ORDER',
          title: title,
          message: msg,
          time: new Date()
        }, ...prev]);
        setUnreadCount(prev => prev + 1);
      };

      const handleStatusUpdate = (order: any) => {
        const title = 'Order Status Updated 🔄';
        const msg = `Order ${order.id.split('-')[0]} is now ${order.status}.`;

        notification.info({
          title,
          description: msg,
          placement: 'topRight',
          duration: 5,
        });
        playSound();

        setHistory(prev => [{
          id: Date.now().toString() + Math.random(),
          type: 'STATUS_UPDATE',
          title: title,
          message: msg,
          time: new Date()
        }, ...prev]);
        setUnreadCount(prev => prev + 1);
      };

      socket.on("new_order", handleNewOrder);
      socket.on("order_status_updated", handleStatusUpdate);

      return () => {
        socket.off("new_order", handleNewOrder);
        socket.off("order_status_updated", handleStatusUpdate);
      };
    }
  }, [socket]);

  const handleOpenChange = (newOpen: boolean) => {
    setPopoverOpen(newOpen);
    if (newOpen) {
      setUnreadCount(0); // Clear badge when opened
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const notificationContent = (
    <div className="w-130 flex flex-col -mx-4 -my-3">
      <div className="max-h-[350px] w-120 p-5">
        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium">No new notifications.</div>
        ) : (
          <ul className="m-0 p-0 list-none">
            {history.map(item => (
              <li key={item.id} className="flex gap-3 hover:bg-slate-50 transition-colors px-4 py-3 border-b border-slate-100 last:border-0 cursor-pointer">
                <div className="flex-shrink-0">
                  <div className={`p-2.5 rounded-full mt-1 ${item.type === 'NEW_ORDER' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    {item.type === 'NEW_ORDER' ? <ShoppingBag className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start w-full gap-2">
                    <span className="font-extrabold text-sm text-slate-800 leading-tight">{item.title}</span>
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{getTimeAgo(item.time)}</span>
                  </div>
                  <div className="mt-1">
                    <div className="text-xs text-slate-600 leading-snug font-medium">{item.message}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {history.length > 0 && (
        <div className="border-t border-slate-100 p-3 bg-slate-50 flex justify-center items-center rounded-b-lg">
          <button
            onClick={() => { setHistory([]); setUnreadCount(0); setPopoverOpen(false); }}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      )}
    </div>
  );

  let pageTitle = "Dashboard";
  if (pathname === "/create-order") pageTitle = "Create New Order";
  else if (pathname === "/orders") pageTitle = "Order Management";
  else if (pathname === "/dashboard") pageTitle = "Dashboard";

  if (!isMounted) {
    return <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-sm z-10 flex-shrink-0" />;
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-sm z-10 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-6 sm:gap-8">
        <Popover
          content={notificationContent}
          title={<div className="font-bold text-center text-slate-800 text-base pt-2 pb-3 border-b border-slate-100">Notifications</div>}
          trigger="click"
          open={popoverOpen}
          onOpenChange={handleOpenChange}
          placement="bottomRight"
          styles={{ root: { padding: 0, borderRadius: '0.75rem', overflow: 'hidden' } }}
        >
          <button
            className="text-slate-400 hover:text-blue-600 transition relative mt-1.5 cursor-pointer"
            title="View Notifications"
          >
            <Badge count={unreadCount} size="small" offset={[2, -2]}>
              <Bell className="w-5 h-5 text-slate-400 hover:text-blue-600" />
            </Badge>
          </button>
        </Popover>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer">
          <UserCircle className="w-8 h-8 text-slate-400" />
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-700">Admin User</p>
            <p className="text-xs text-slate-500">admin@ordermaster.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
