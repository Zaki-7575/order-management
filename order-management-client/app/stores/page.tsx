"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";
import { Plus, Edit, Trash2, Store } from "lucide-react";
import { getStores, createStore, updateStore, deleteStore } from "@/src/services/store.service";

export default function StoresPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  const createMutation = useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      message.success("Store created successfully");
      closeModal();
    },
    onError: (error: any) => message.error(error.message || "Failed to create store"),
  });

  const updateMutation = useMutation({
    mutationFn: updateStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      message.success("Store updated successfully");
      closeModal();
    },
    onError: (error: any) => message.error(error.message || "Failed to update store"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      message.success("Store deleted successfully");
    },
    onError: (error: any) => message.error(error.message || "Failed to delete store"),
  });

  const openModal = (store: any = null) => {
    setEditingStore(store);
    if (store) {
      form.setFieldsValue(store);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
    form.resetFields();
  };

  const handleFinish = (values: any) => {
    if (editingStore) {
      updateMutation.mutate({ id: editingStore.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: "Store ID",
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
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a: any, b: any) => (a.location || "").localeCompare(b.location || ""),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<Edit className="w-4 h-4 text-blue-500" />} onClick={() => openModal(record)} />
          <Popconfirm
            title="Delete the store"
            description="Are you sure to delete this store?"
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
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Store Management</h1>
            <p className="text-sm text-slate-500 font-medium">Manage your store locations and details</p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          className="h-10 px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
          onClick={() => openModal()}
        >
          Add Store
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={stores}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
          className="[&_.ant-table-thead_th]:!bg-slate-50 [&_.ant-table-thead_th]:!text-slate-500 [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!text-xs [&_.ant-table-thead_th]:!tracking-wider [&_.ant-table-row:hover>td]:!bg-blue-50/50"
        />
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">
            <Store className="w-5 h-5 text-blue-500" />
            {editingStore ? "Edit Store" : "Add New Store"}
          </div>
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-0 [&_.ant-modal-header]:p-6 [&_.ant-modal-header]:pb-0 [&_.ant-modal-body]:p-6"
      // closeIcon={<div className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors mt-2 mr-2"><Trash2 className="w-4 h-4 text-slate-500" /></div>}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false} size="large">
          <Form.Item
            name="name"
            label={<span className="font-bold text-slate-700">Store Name</span>}
            rules={[{ required: true, message: "Please enter the store name!" }]}
          >
            <Input placeholder="e.g. Downtown Branch" className="rounded-xl" />
          </Form.Item>
          <Form.Item
            name="location"
            label={<span className="font-bold text-slate-700">Location</span>}
            rules={[{ required: true, message: "Please enter the location!" }]}
          >
            <Input placeholder="e.g. New York, NY" className="rounded-xl" />
          </Form.Item>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <Button onClick={closeModal} className="h-11 px-6 rounded-xl font-bold text-slate-500 border-slate-200 hover:bg-slate-50">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="h-11 px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              {editingStore ? "Update Store" : "Create Store"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
