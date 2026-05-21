"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from "antd";
import { Plus, Edit, Trash2, Box, IndianRupee } from "lucide-react";
import { getItems, createItem, updateItem, deleteItem } from "@/src/services/item.service";

export default function ItemsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: items, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      message.success("Menu created successfully");
      closeModal();
    },
    onError: (error: any) => message.error(error.message || "Failed to create item"),
  });

  const updateMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      message.success("Menu updated successfully");
      closeModal();
    },
    onError: (error: any) => message.error(error.message || "Failed to update item"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      message.success("Menu deleted successfully");
    },
    onError: (error: any) => message.error(error.message || "Failed to delete menu"),
  });

  const openModal = (item: any = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleFinish = (values: any) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: "Item ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <span className="font-mono text-xs text-slate-500">{text.split('-')[0]}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="font-bold text-slate-800">{text}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a: any, b: any) => (a.category || "").localeCompare(b.category || ""),
      render: (text: string) => text ? <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">{text}</span> : <span className="text-slate-400 italic">None</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a: any, b: any) => a.price - b.price,
      render: (price: number) => <span className="font-bold text-emerald-600">${price.toFixed(2)}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<Edit className="w-4 h-4 text-fuchsia-500" />} onClick={() => openModal(record)} />
          <Popconfirm
            title="Delete the menu"
            description="Are you sure to delete this menu?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<Trash2 className="w-4 h-4" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-fuchsia-50 flex items-center justify-center text-fuchsia-600">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Menu Management</h1>
            <p className="text-sm text-slate-500 font-medium">Manage your menu catalog, categories, and prices</p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          className="h-10 px-6 rounded-xl font-bold bg-fuchsia-600 hover:bg-fuchsia-700 border-0 shadow-md shadow-fuchsia-500/20 text-white"
          onClick={() => openModal()}
        >
          Add Menu
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={items}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
          className="[&_.ant-table-thead_th]:!bg-slate-50 [&_.ant-table-thead_th]:!text-slate-500 [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!text-xs [&_.ant-table-thead_th]:!tracking-wider [&_.ant-table-row:hover>td]:!bg-fuchsia-50/50"
        />
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">
            <Box className="w-5 h-5 text-fuchsia-500" />
            {editingItem ? "Edit Menu" : "Add New Menu"}
          </div>
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-0 [&_.ant-modal-header]:p-6 [&_.ant-modal-header]:pb-0 [&_.ant-modal-body]:p-6"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false} size="large">
          <Form.Item
            name="name"
            label={<span className="font-bold text-slate-700">Menu Name</span>}
            rules={[{ required: true, message: "Please enter the menu name!" }]}
          >
            <Input placeholder="e.g. Classic Cheeseburger" className="rounded-xl" />
          </Form.Item>
          <Form.Item
            name="category"
            label={<span className="font-bold text-slate-700">Category</span>}
            rules={[{ required: true, message: "Please enter the category!" }]}
          >
            <Input placeholder="e.g. Burgers" className="rounded-xl" />
          </Form.Item>
          <Form.Item
            name="price"
            label={<span className="font-bold text-slate-700">Price</span>}
            rules={[
              { required: true, message: "Please enter the price!" },
              {
                validator: async (_, value) => {
                  if (value !== undefined && value !== null && value <= 0) {
                    return Promise.reject(new Error("Price must be greater than 0"));
                  }
                },
              },
            ]}
          >
            <InputNumber
              min={0}
              step={0.01}
              prefix={<span className="text-slate-400 font-bold">$</span>}
              style={{ width: '100%' }}
              className="rounded-xl"
              placeholder="0.00"
            />
          </Form.Item>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <Button onClick={closeModal} className="h-11 px-6 rounded-xl font-bold text-slate-500 border-slate-200 hover:bg-slate-50">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="h-11 px-6 rounded-xl font-bold bg-fuchsia-600 hover:bg-fuchsia-700 border-0 shadow-md shadow-fuchsia-500/20 text-white"
            >
              {editingItem ? "Update Menu" : "Create Menu"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
