import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Package, Bell, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface InventoryItem {
  id: string;
  partNumber: string;
  name: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface OrderNotification {
  id: string;
  orderNumber: string;
  partName: string;
  quantity: number;
  buyer: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

export default function SupplierDashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Mock data for inventory
  const [inventory] = useState<InventoryItem[]>([
    { id: '1', partNumber: 'BX-2150', name: 'Bendix Air Compressor', price: 520.00, stock: 45, status: 'In Stock' },
    { id: '2', partNumber: 'HD-9921', name: 'Heavy Duty Alternator', price: 395.00, stock: 12, status: 'Low Stock' },
    { id: '3', partNumber: 'SAC-101', name: 'Standard Brake Pad Set', price: 85.00, stock: 0, status: 'Out of Stock' },
    { id: '4', partNumber: 'FL-400S', name: 'Motorcraft Oil Filter', price: 12.50, stock: 150, status: 'In Stock' },
    { id: '5', partNumber: 'D1044', name: 'Ceramic Brake Pads', price: 45.00, stock: 8, status: 'Low Stock' },
  ]);

  // Mock data for orders
  const [orders] = useState<OrderNotification[]>([
    { id: '1', orderNumber: 'ORD-8821', partName: 'Bendix Air Compressor', quantity: 2, buyer: 'Fleet Solutions Inc.', date: '2026-03-13', status: 'Pending' },
    { id: '2', orderNumber: 'ORD-8820', partName: 'Heavy Duty Alternator', quantity: 1, buyer: 'Mike\'s Garage', date: '2026-03-12', status: 'Shipped' },
    { id: '3', orderNumber: 'ORD-8819', partName: 'Motorcraft Oil Filter', quantity: 24, buyer: 'City Transit Auth', date: '2026-03-10', status: 'Delivered' },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate CSV processing
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 shadow-glass border border-white/10 text-white text-[9px] font-black mb-4 tracking-[0.2em] uppercase"
            >
              <Package className="text-brand-primary" size={10} />
              Supplier Core
            </motion.div>
            <h1 className="text-3xl lg:text-4xl font-display font-black text-white tracking-tight uppercase">
              Supplier Dashboard
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="tactile-card p-6 border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center">
                  <Upload className="text-brand-primary" size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Catalog Upload</h2>
                  <p className="text-xs text-zinc-400">Update inventory via CSV</p>
                </div>
              </div>

              <div className="relative group">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploading}
                />
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isUploading ? 'border-brand-primary/50 bg-brand-primary/5' : 'border-white/10 bg-white/5 group-hover:border-brand-primary/30 group-hover:bg-white/10'}`}>
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="animate-spin text-brand-primary mb-3" size={32} />
                      <p className="text-sm font-bold text-white">Processing CSV...</p>
                      <p className="text-xs text-zinc-400 mt-1">Updating inventory records</p>
                    </div>
                  ) : uploadSuccess ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="text-emerald-400 mb-3" size={32} />
                      <p className="text-sm font-bold text-white">Upload Successful</p>
                      <p className="text-xs text-zinc-400 mt-1">Inventory updated</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileSpreadsheet className="text-zinc-500 mb-3 group-hover:text-brand-primary transition-colors" size={32} />
                      <p className="text-sm font-bold text-white">Drag & Drop CSV</p>
                      <p className="text-xs text-zinc-400 mt-1">or click to browse</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3">
                <AlertCircle className="text-blue-400 shrink-0" size={16} />
                <p className="text-xs text-blue-200/70 leading-relaxed">
                  CSV must include: Part Number, Name, Price, and Stock Quantity. Maximum file size is 50MB.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="tactile-card p-4 border-white/10">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Parts</p>
                <p className="text-2xl font-display font-black text-white">1,248</p>
              </div>
              <div className="tactile-card p-4 border-white/10">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Low Stock</p>
                <p className="text-2xl font-display font-black text-amber-400">24</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Orders Section */}
            <div className="tactile-card p-6 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center">
                    <Bell className="text-brand-primary" size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                    <p className="text-xs text-zinc-400">Latest purchase requests</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-brand-primary hover:text-white transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-zinc-400">{order.orderNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white">{order.partName} <span className="text-zinc-500 font-normal">x{order.quantity}</span></p>
                      <p className="text-xs text-zinc-400 mt-1">{order.buyer} • {order.date}</p>
                    </div>
                    {order.status === 'Pending' && (
                      <button className="tactile-btn-light py-2 px-4 text-xs whitespace-nowrap">
                        Process Order
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Section */}
            <div className="tactile-card p-6 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center">
                    <Package className="text-brand-primary" size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Current Inventory</h2>
                    <p className="text-xs text-zinc-400">Top selling items</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-brand-primary hover:text-white transition-colors">
                  Manage Catalog
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Part Number</th>
                      <th className="pb-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Name</th>
                      <th className="pb-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Price</th>
                      <th className="pb-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stock</th>
                      <th className="pb-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 font-mono text-zinc-400">{item.partNumber}</td>
                        <td className="py-3 font-medium text-white">{item.name}</td>
                        <td className="py-3 text-zinc-300">${item.price.toFixed(2)}</td>
                        <td className="py-3 text-zinc-300">{item.stock}</td>
                        <td className="py-3 text-right">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                            item.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-400' :
                            item.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
