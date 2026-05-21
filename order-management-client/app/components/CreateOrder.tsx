"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2, ShoppingBag, Store, IndianRupee, Hash, DollarSign } from "lucide-react";
import Link from "next/link";
import { createOrder } from "@/src/services/order.service";
import { getStores } from "@/src/services/store.service";
import { getItems } from "@/src/services/item.service";
import { Form, Input, InputNumber, Button, Space, Divider, message, Select } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function CreateOrder() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      form.resetFields();
      router.push("/orders");
    },
    onError: (error: any) => {
      message.error(error.message || "❌ Something went wrong");
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (allValues.items && items) {
      const total = allValues.items.reduce((sum: number, currentItem: any) => {
        if (!currentItem || !currentItem.item_id || !currentItem.qty) return sum;
        const foundMenu = items.find((m: any) => m.id === currentItem.item_id);
        const price = foundMenu ? foundMenu.price : 0;
        return sum + (price * currentItem.qty);
      }, 0);
      form.setFieldsValue({ total_amount: total });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-8 pb-20">
      <div className="max-w-7xl mx-auto w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
                <ShoppingBag className="w-8 h-8" />
                New Order
              </h1>
              <p className="text-blue-100 mt-2 font-medium text-sm sm:text-base">Create a new order for your store</p>
            </div>
            <Link href="/orders" className="bg-white/20 hover:bg-white/30 transition backdrop-blur-md px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border border-white/20 shadow-sm">
              View All Orders
            </Link>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={handleValuesChange}
            initialValues={{ items: [{ item_id: "", qty: 1 }], total_amount: 0 }}
            requiredMark={false}
            size="large"
          >
            <div className="grid grid-cols-1 gap-x-6">
              <Form.Item
                name="store_id"
                label={<span className="font-bold text-slate-700 flex items-center gap-2"><Store className="w-4 h-4 text-blue-500" /> Store</span>}
                rules={[{ required: true, message: "Please select a store" }]}
              >
                <Select
                  placeholder="Select a store"
                  className="[&_.ant-select-selector]:!rounded-xl h-10"
                  loading={storesLoading}
                  options={stores?.map((store: any) => ({ label: store.name, value: store.id })) || []}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </div>

            <Divider className="my-2 border-slate-100" />

            <div className="flex items-center gap-2 mb-4 mt-2">
              <Hash className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-extrabold text-slate-800">Order Menu Items</h2>
            </div>

            <Form.List
              name="items"
              rules={[
                {
                  validator: async (_, items) => {
                    if (!items || items.length < 1) {
                      return Promise.reject(new Error('At least one item is required'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <div className="space-y-4">
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="bg-slate-50/50 border border-slate-200 p-5 rounded-2xl relative group">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-start">
                        <Form.Item
                          name={[name, 'item_id']}
                          label={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menu Item</span>}
                          rules={[{ required: true, message: "Please select a menu item" }]}
                          className="w-full sm:flex-1 mb-0"
                        >
                          <Select
                            placeholder="Select a menu item"
                            className="[&_.ant-select-selector]:!rounded-xl h-10"
                            loading={itemsLoading}
                            options={items?.map((item: any) => {
                              const isSelected = form.getFieldValue("items")?.some((formItem: any) => formItem?.item_id === item.id && formItem?.item_id !== form.getFieldValue(["items", name, "item_id"]));
                              return {
                                label: `${item.name} ($${item.price.toFixed(2)})`,
                                value: item.id,
                                disabled: isSelected,
                              };
                            }) || []}
                            showSearch
                            optionFilterProp="label"
                          />
                        </Form.Item>

                        <Form.Item
                          name={[name, 'qty']}
                          label={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</span>}
                          rules={[
                            { required: true, message: "Required" },
                            { type: 'number', min: 1, message: "Quantity must be at least 1" }
                          ]}
                          className="w-full sm:w-28 mb-0"
                        >
                          <InputNumber min={1} precision={0} style={{ width: '100%' }} className="rounded-xl" />
                        </Form.Item>

                        <Form.Item 
                          label={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>}
                          className="w-full sm:w-32 mb-0"
                        >
                          <div className="h-10 flex items-center justify-end px-4 bg-emerald-50 rounded-xl border border-emerald-100 font-extrabold text-emerald-700">
                            <Form.Item noStyle dependencies={[['items', name, 'item_id'], ['items', name, 'qty']]}>
                              {() => {
                                const selectedId = form.getFieldValue(['items', name, 'item_id']);
                                const qty = form.getFieldValue(['items', name, 'qty']) || 0;
                                const found = items?.find((i: any) => i.id === selectedId);
                                const lineTotal = found ? found.price * qty : 0;
                                return <span>${lineTotal.toFixed(2)}</span>;
                              }}
                            </Form.Item>
                          </div>
                        </Form.Item>

                        {fields.length > 1 && (
                          <div className="sm:mt-6">
                            <Button
                              type="text"
                              danger
                              icon={<Trash2 className="w-5 h-5" />}
                              onClick={() => {
                                remove(name);
                                // Recalculate totals immediately after removing
                                setTimeout(() => handleValuesChange(null, form.getFieldsValue()), 0);
                              }}
                              className="rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 w-full sm:w-auto flex items-center justify-center h-[40px]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<Plus className="w-4 h-4" />}
                      className="rounded-2xl h-12 text-indigo-600 font-bold border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 mt-2"
                    >
                      Add Another Item
                    </Button>
                    <Form.ErrorList errors={errors} className="mt-2 text-rose-500 font-bold text-sm" />
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <div className="flex justify-end pt-6 mt-4 border-t border-slate-100">
              <Form.Item
                name="total_amount"
                label={<span className="font-extrabold text-slate-700 text-lg flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-500" /> Grand Total</span>}
                className="mb-0 text-right"
              >
                <InputNumber
                  prefix={<span className="text-emerald-500 font-extrabold">$</span>}
                  style={{ width: '100%', minWidth: '200px' }}
                  className="rounded-xl bg-emerald-50/50 border-emerald-200 text-emerald-700 text-xl font-black [&_.ant-input-number-input]:text-right"
                  placeholder="0.00"
                  readOnly
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <Button
                type="primary"
                htmlType="submit"
                loading={mutation.isPending}
                className="w-full h-14 rounded-2xl text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                icon={!mutation.isPending && <ShoppingBag className="w-5 h-5" />}
              >
                Place Order
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
