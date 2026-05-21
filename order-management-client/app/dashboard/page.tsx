"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  TrendingUp, Archive, DollarSign, ShoppingCart, Activity, ShoppingBag 
} from "lucide-react";
import { message, Select } from "antd";
import { motion, Variants } from "framer-motion";
import { 
  fetchOrdersPerDay, 
  fetchRevenuePerStore, 
  fetchTopItems, 
  archiveOldOrders 
} from "@/src/services/analytics.service";
import { getStores } from "@/src/services/store.service";
import { getItems } from "@/src/services/item.service";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

// Framer Motion Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const [archiveType, setArchiveType] = useState('active');

  const { data: ordersPerDay, isLoading: loading1 } = useQuery({ queryKey: ["ordersPerDay", archiveType], queryFn: () => fetchOrdersPerDay(archiveType) });
  const { data: revenuePerStore, isLoading: loading2 } = useQuery({ queryKey: ["revenuePerStore", archiveType], queryFn: () => fetchRevenuePerStore(archiveType) });
  const { data: topItems, isLoading: loading3 } = useQuery({ queryKey: ["topItems", archiveType], queryFn: () => fetchTopItems(archiveType) });
  const { data: storesResponse, isLoading: loading4 } = useQuery({ queryKey: ["stores"], queryFn: () => getStores() });
  const stores = storesResponse || [];
  const { data: itemsResponse, isLoading: loading5 } = useQuery({ queryKey: ["items"], queryFn: getItems });
  const items = itemsResponse || [];

  const isLoading = loading1 || loading2 || loading3 || loading4 || loading5;

  const mappedRevenuePerStore = revenuePerStore?.map((r: any) => {
    const store = stores.find((s: any) => s.id === r.store_id);
    return {
      ...r,
      store_name: store ? store.name : r.store_id
    };
  }) || [];

  const mappedTopItems = topItems?.map((t: any) => {
    const item = items.find((i: any) => i.id === t.item_id);
    return {
      ...t,
      item_name: item ? item.name : `Deleted Item (${t.item_id.substring(0, 8)})`
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full min-h-[50vh]">
        <div className="flex items-center gap-3 text-indigo-500 font-bold">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span className="text-xl tracking-tight text-slate-600">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  // Calculate high level metrics
  const totalRevenue = revenuePerStore?.reduce((acc: number, curr: any) => acc + curr.revenue, 0) || 0;
  const totalOrdersToday = ordersPerDay?.[0]?.count || 0;

  const glassStyle = "bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 md:p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300";

  const topCards = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="w-8 h-8" />,
      blurBg: "bg-emerald-400/20 group-hover:bg-emerald-400/30",
      iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30"
    },
    {
      title: "Orders Today",
      value: totalOrdersToday,
      icon: <ShoppingCart className="w-8 h-8" />,
      blurBg: "bg-blue-400/20 group-hover:bg-blue-400/30",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30"
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-16 relative">
      
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -z-10 mix-blend-multiply pointer-events-none" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px] -z-10 mix-blend-multiply pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Dashboard Header / Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/60 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Analytics Overview</h2>
            <p className="text-sm font-bold text-slate-500">View real-time and historical data</p>
          </div>
          <div className="flex items-center gap-3">
            <Archive className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-600">Dataset:</span>
            <Select
              value={archiveType}
              onChange={(val) => setArchiveType(val)}
              options={[
                { label: 'Active Orders', value: 'active' },
                { label: 'Archived Orders', value: 'archived' }
              ]}
              className="w-48 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selector]:!bg-white font-bold"
              size="large"
            />
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topCards.map((card, index) => (
            <motion.div key={index} variants={itemVariants} className={`${glassStyle} flex items-center justify-between group overflow-hidden relative`}>
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl transition-colors ${card.blurBg}`} />
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{card.title}</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight">{card.value}</h3>
              </div>
              <div className={`w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-white relative z-10 transform group-hover:scale-105 transition-transform ${card.iconBg}`}>
                {card.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Orders Per Day Chart */}
          <motion.div variants={itemVariants} className={glassStyle}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">Orders Per Day</h2>
                  <p className="text-xs font-bold text-slate-400">Past 7 days activity</p>
                </div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={ordersPerDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                    labelFormatter={(val) => new Date(val).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    itemStyle={{ fontWeight: '900', color: '#4f46e5' }}
                  />
                  <Line type="monotone" dataKey="count" name="Orders" stroke="#6366f1" strokeWidth={4} dot={{r: 0}} activeDot={{r: 8, strokeWidth: 0, fill: '#6366f1'}} style={{ filter: 'drop-shadow(0px 8px 8px rgba(99, 102, 241, 0.3))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Revenue Per Store Chart */}
          <motion.div variants={itemVariants} className={glassStyle}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">Revenue by Store</h2>
                  <p className="text-xs font-bold text-slate-400">Total earnings breakdown</p>
                </div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={mappedRevenuePerStore} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="store_name" axisLine={false} tickLine={false} tick={false} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dx={-10} tickFormatter={(val) => `$${val}`} />
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(241, 245, 249, 0.5)'}}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: any) => [`$${Number(val || 0).toFixed(2)}`, 'Revenue']}
                    labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                    itemStyle={{ fontWeight: '900', color: '#10b981' }}
                  />
                  <Legend 
                    content={() => (
                      <div className="flex flex-wrap justify-center gap-4 pt-5">
                        {mappedRevenuePerStore?.map((entry: any, index: number) => (
                          <div key={`legend-${index}`} className="flex items-center gap-2 text-xs font-extrabold text-slate-500">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {entry.store_name}
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]} barSize={32}>
                    {mappedRevenuePerStore?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Items Pie Chart */}
          <motion.div variants={itemVariants} className={`${glassStyle} lg:col-span-2`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-fuchsia-50 rounded-xl text-fuchsia-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">Top Selling Items</h2>
                  <p className="text-xs font-bold text-slate-400">Most popular menu choices</p>
                </div>
              </div>
            </div>
            <div className="h-[350px] flex justify-center">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={mappedTopItems}
                    dataKey="total_qty"
                    nameKey="item_name"
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={140}
                    paddingAngle={8}
                    stroke="none"
                    cornerRadius={6}
                  >
                    {mappedTopItems?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0px 10px 10px ${COLORS[index % COLORS.length]}40)` }} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: any) => [val, 'Quantity Sold']}
                    itemStyle={{ fontWeight: '900' }}
                  />
                  <Legend 
                    iconType="circle" 
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: '30px', fontWeight: 800, fontSize: '13px', color: '#64748b' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
