"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Store, Calendar, Plus, Eye, Edit } from "lucide-react";
import Link from "next/link";
import { Table, Select, Tag, Button, Space, Modal, Descriptions, message } from "antd";
import type { TableProps } from "antd";
import moment from "moment";
import { useSocket } from "@/src/hook/useSocket";
import { fetchOrders, updateOrderStatus } from "@/src/services/order.service";
import { getStores } from "@/src/services/store.service";

type OrderItem = {
  id: string;
  item_id: string;
  qty: number;
};

type Order = {
  id: string;
  store_id: string;
  total_amount: number;
  status: "PLACED" | "PREPARING" | "COMPLETED";
  created_at: string;
  items: OrderItem[];
};

export default function OrdersList() {
  const [storeId, setStoreId] = useState("");
  const [debouncedStoreId, setDebouncedStoreId] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<"PLACED" | "PREPARING" | "COMPLETED">("PLACED");

  const { socket, isConnected } = useSocket(debouncedStoreId || undefined);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedStoreId(storeId), 500);
    return () => clearTimeout(handler);
  }, [storeId]);

  useEffect(() => {
    if (socket) {
      const handleSocketEvent = () => {
        // Invalidate cache to refetch the orders and show new updates
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      };

      socket.on("new_order", handleSocketEvent);
      socket.on("order_status_updated", handleSocketEvent);

      return () => {
        socket.off("new_order", handleSocketEvent);
        socket.off("order_status_updated", handleSocketEvent);
      };
    }
  }, [socket, queryClient]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", debouncedStoreId, page],
    queryFn: () => fetchOrders(debouncedStoreId, page),
  });

  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setEditModalOpen(false);
      message.success("Order status updated");
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to update order status");
    }
  });

  const handleStatusSubmit = () => {
    if (selectedOrder) {
      mutation.mutate({ id: selectedOrder.id, status: editStatus });
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "PLACED": return <Tag color="orange" className="font-bold">PLACED</Tag>;
      case "PREPARING": return <Tag color="blue" className="font-bold">PREPARING</Tag>;
      case "COMPLETED": return <Tag color="green" className="font-bold">COMPLETED</Tag>;
      default: return <Tag className="font-bold">{status}</Tag>;
    }
  };

  const columns: TableProps<Order>['columns'] = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{id.split('-')[0]}...</span>,
    },
    {
      title: 'Store',
      dataIndex: 'store_id',
      key: 'store_id',
      sorter: (a, b) => {
        const storeA = stores?.find((s: any) => s.id === a.store_id)?.name || a.store_id;
        const storeB = stores?.find((s: any) => s.id === b.store_id)?.name || b.store_id;
        return storeA.localeCompare(storeB);
      },
      render: (storeId: string) => {
        const store = stores?.find((s: any) => s.id === storeId);
        const storeName = store ? store.name : storeId;
        return <Tag color="geekblue" className="font-bold text-xs px-2 py-1">{storeName}</Tag>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      sorter: (a, b) => a.total_amount - b.total_amount,
      render: (amount: number) => <span className="font-extrabold text-slate-800 text-base">${amount.toFixed(2)}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (date: string) => (
        <div className="flex items-center gap-2 font-medium text-slate-500">
          <Calendar className="w-4 h-4 text-slate-400" />
          {moment(date).format("DD-MMM-YYYY")}
        </div>
      ),
    },
    {
      title: 'Items',
      key: 'items',
      dataIndex: 'items',
      sorter: (a, b) => a.items.length - b.items.length,
      render: (items: OrderItem[]) => (
        <Tag color="purple" className="font-bold text-xs px-2 py-1">{items.length} items</Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Order) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => {
              setSelectedOrder(record);
              setDetailModalOpen(true);
            }}
            className="flex items-center"
          >
            Details
          </Button>
          <Button
            icon={<Edit className="w-4 h-4" />}
            onClick={() => {
              setSelectedOrder(record);
              setEditStatus(record.status);
              setEditModalOpen(true);
            }}
            className="flex items-center"
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // Helper to generate a deterministic mock name and price based on Item ID
  const generateItemDetails = (itemId: string) => {
    let hash = 0;
    for (let i = 0; i < itemId.length; i++) {
      hash = itemId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const products = [
      "Wireless Headphones", "Mechanical Keyboard", "Gaming Mouse",
      "USB-C Hub", "External SSD", "Monitor Stand", "Webcam",
      "Desk Pad", "Laptop Sleeve", "Bluetooth Speaker"
    ];
    const name = products[Math.abs(hash) % products.length];
    const price = ((Math.abs(hash) % 100) + 19.99);
    return { name, price };
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-8 pb-20">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              Order Management
            </h1>
          </div>

          <Link href="/create-order" className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-full text-sm font-bold border border-slate-200 shadow-sm hover:shadow transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Order
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
            </div>
            <Select
              showSearch
              allowClear
              placeholder="Filter by Store Name"
              optionFilterProp="label"
              value={storeId || undefined}
              onChange={(val) => { setStoreId(val || ""); setPage(1); }}
              options={stores?.map((store: any) => ({ label: store.name, value: store.id })) || []}
              className="w-full [&_.ant-select-selector]:!h-[50px] [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-slate-50/50 [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selection-search]:!pl-8 [&_.ant-select-selection-item]:!pl-8 [&_.ant-select-selection-item]:!pt-1.5 [&_.ant-select-selection-placeholder]:!pl-8 [&_.ant-select-selection-placeholder]:!pt-1.5"
            />
          </div>
        </div>

        {/* Orders Table (Ant Design) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-2 sm:p-4">
          {isError ? (
            <div className="p-12 text-center text-rose-500 font-bold bg-rose-50/30 rounded-2xl">
              Failed to load orders.
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={data?.data || []}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: page,
                total: data?.pagination?.totalPages ? data.pagination.totalPages * 10 : 0,
                pageSize: 10,
                onChange: (newPage) => setPage(newPage),
                showSizeChanger: false,
              }}
              scroll={{ x: 'max-content' }}
              className="w-full"
            />
          )}
        </div>

        {/* Detail Modal */}
        <Modal
          title="Order Details"
          open={detailModalOpen}
          onCancel={() => setDetailModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalOpen(false)}>
              Close
            </Button>
          ]}
          width={650}
        >
          {selectedOrder && (
            <div className="mt-8">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Order ID"><span className="font-mono">{selectedOrder.id}</span></Descriptions.Item>
                <Descriptions.Item label="Store"><Tag color="geekblue">{stores?.find((s: any) => s.id === selectedOrder.store_id)?.name || selectedOrder.store_id}</Tag></Descriptions.Item>
                <Descriptions.Item label="Date">{new Date(selectedOrder.created_at).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Status">{getStatusTag(selectedOrder.status)}</Descriptions.Item>
                <Descriptions.Item label="Total Amount"><span className="font-bold">${selectedOrder.total_amount.toFixed(2)}</span></Descriptions.Item>
              </Descriptions>

              <h3 className="font-bold text-lg mt-6 mb-3">Items Purchased</h3>
              <Table
                dataSource={selectedOrder.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  { title: 'Item ID', dataIndex: 'item_id', key: 'item_id', render: (id) => <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{id}</span> },
                  { title: 'Item Name', key: 'item_name', render: (_, record) => <span className="font-medium text-slate-700">{generateItemDetails(record.item_id).name}</span> },
                  {
                    title: 'Unit Price',
                    key: 'item_price',
                    render: (_, record) => {
                      const totalQty = selectedOrder.items.reduce((acc, item) => acc + item.qty, 0);
                      const unitPrice = totalQty > 0 ? selectedOrder.total_amount / totalQty : 0;
                      return <span className="font-bold">${unitPrice.toFixed(2)}</span>;
                    }
                  },
                  { title: 'Quantity', dataIndex: 'qty', key: 'qty', render: (qty) => <Tag color="purple">{qty}</Tag> },
                  {
                    title: 'Line Total',
                    key: 'line_total',
                    render: (_, record) => {
                      const totalQty = selectedOrder.items.reduce((acc, item) => acc + item.qty, 0);
                      const unitPrice = totalQty > 0 ? selectedOrder.total_amount / totalQty : 0;
                      return <span className="font-extrabold text-slate-800">${(unitPrice * record.qty).toFixed(2)}</span>;
                    }
                  }
                ]}
              />
            </div>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal
          title="Update Order Status"
          open={editModalOpen}
          onOk={handleStatusSubmit}
          onCancel={() => setEditModalOpen(false)}
          confirmLoading={mutation.isPending}
        >
          {selectedOrder && (
            <div className="my-6">
              <p className="mb-2 font-medium text-slate-700">Select new status for Order <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{selectedOrder.id.split('-')[0]}</span>:</p>
              <Select
                value={editStatus}
                onChange={(val) => setEditStatus(val)}
                style={{ width: '100%' }}
                size="large"
                options={[
                  { value: 'PLACED', label: 'PLACED' },
                  { value: 'PREPARING', label: 'PREPARING' },
                  { value: 'COMPLETED', label: 'COMPLETED' },
                ]}
              />
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
}
