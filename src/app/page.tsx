"use client"; // 确保这是一个客户端组件

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox"; // 导入 Checkbox

import { validateForm } from '../utils/validation';

// 定义表单数据的类型
interface FormData {
  companyName: string;
  phoneCode: string;
  phoneNumber: string;
  companyAddress: string;
  billingAddress: string;
  productType: string;
  load: string;
  cabinWidth: string;
  cabinHeight: string;
  customLoad: number;
  customCabinWidth: number;
  customCabinHeight: number;
  sameBillingAddress: boolean; // 这个字段用来跟踪账单地址是否与公司地址相同
}

export default function Home() {
  const form = useForm<FormData>({
    defaultValues: {
      companyName: '',
      phoneCode: '',
      phoneNumber: '',
      companyAddress: '',
      billingAddress: '',
      productType: '',
      load: '',
      cabinWidth: '',
      cabinHeight: '',
      customLoad: 0,
      customCabinWidth: 0,
      customCabinHeight: 0,
      sameBillingAddress: false, // 默认账单地址与公司地址不同
    },
  });

  const onSubmit = async (formData: FormData) => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Form submitted successfully');
      } else {
        alert('Form submission failed');
      }
    } else {
      // 如果有验证错误，将错误信息设置到表单中
      Object.entries(validationErrors).forEach(([key, value]) => {
        form.setError(key as keyof FormData, { type: 'manual', message: value });
      });
    }
  };

  // 监听 productType 的变化
  const productType = form.watch("productType");
  const selectedLoad = form.watch("load");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Company Name */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem style={{ marginBottom: 20 }}>
              <FormLabel>Company Name</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Code */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <FormField
            control={form.control}
            name="phoneCode"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Phone Code (No need to input '+')</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Phone Number</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Company Address */}
        <FormField
          control={form.control}
          name="companyAddress"
          render={({ field }) => (
            <FormItem style={{ marginBottom: 20 }}>
              <FormLabel>Company Address</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Same Billing Address */}
        <FormField
          control={form.control}
          name="sameBillingAddress"
          render={({ field }) => (
            <FormItem>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FormLabel>Billing Address is the same as Company Address?</FormLabel>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="custom-checkbox"/>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Billing Address */}
        {!form.watch("sameBillingAddress") && (
          <FormField
            control={form.control}
            name="billingAddress"
            render={({ field }) => (
              <FormItem style={{ marginBottom: 20 }}>
                <FormLabel>Billing Address</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Product Type */}
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem style={{ marginBottom: 20 }}>
              <FormLabel>Product Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="客梯">客梯</SelectItem>
                  <SelectItem value="自动扶梯">自动扶梯</SelectItem>
                  <SelectItem value="自动人行道">自动人行道</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Load, Cabin Width, Cabin Depth 仅在 productType === "客梯" 时显示 */}
        {productType === "客梯" && (
          <>
            {/* Load */}
            <FormField
            control={form.control}
            name="load"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load (kg)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Load" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="630">630</SelectItem>
                    <SelectItem value="1000">1000</SelectItem>
                    <SelectItem value="1250">1250</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {selectedLoad === "custom" && (
                  <FormField
                  control={form.control}
                  name="customLoad"
                    render={({ field }) => (
                    <>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Enter custom load"
                        />
                    <FormMessage />
                    </>
                  )}
                />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

            {/* Cabin Width */}
            <FormField
  control={form.control}
  name="cabinWidth"
  render={({ field }) => {
    // 根据 load 的值动态设置 cabinWidth 的默认值和选项
    const load = form.watch("load");
    const customLoad = form.watch("customLoad");

    // 判断 load 的值（包括自定义值）
    const effectiveLoad = load === 'custom' ? customLoad : load;
    let defaultValue = '';
    let options: string[] = [];

    if (effectiveLoad == 630) {
      defaultValue = '1100';
      options = ['1100'];
    } else if (effectiveLoad == 1000) {
      defaultValue = '1200';
      options = ['1200'];
    } else if (effectiveLoad == 1250) {
      defaultValue = '1200';
      options = ['1200', '1600'];
    }


    return (
      <FormItem>
        <FormLabel>Cabin Width (mm)</FormLabel>
        {options.length > 0 ?(
          <Select
            onValueChange={field.onChange}
            value={field.value || defaultValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Cabin Width" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        ): (
          <FormField
           control={form.control}
           name="customCabinWidth"
             render={({ field }) => (
             <>
             <Input
               type="number"
               {...field}
               placeholder="Enter custom cabin width"
                 />
             <FormMessage />
             </>
           )}
         />)
        }
        {field.value === 'custom' && (
           <FormField
           control={form.control}
           name="customCabinWidth"
             render={({ field }) => (
             <>
             <Input
               type="number"
               {...field}
               placeholder="Enter custom cabin width"
                 />
             <FormMessage />
             </>
           )}
         />
        )}
        <FormMessage />
      </FormItem>
    );
  }}
/>

            {/* Cabin Depth */}
            <FormField
  control={form.control}
  name="cabinHeight"
  render={({ field }) => {
    const load = form.watch("load");
    const customLoad = form.watch("customLoad");
    const cabinWidth = form.watch("cabinWidth");

    // 判断 load 的值（包括自定义值）
    const effectiveLoad = load === 'custom' ? customLoad : load;

    let defaultValue = '';
    let options: string[] = [];

    if (effectiveLoad == 630) {
      defaultValue = '1400';
      options = ['1400'];
    } else if (effectiveLoad == 1000) {
      defaultValue = '2100';
      options = ['2100'];
    } else if (effectiveLoad == 1250) {
      if (cabinWidth == '1200') {
        defaultValue = '2100';
        options = ['2100'];
      } else if (cabinWidth == '1600') {
        defaultValue = '1400';
        options = ['1400'];
      }
    }

    return (
      <FormItem>
        <FormLabel>Cabin Height (mm)</FormLabel>
        {options.length > 0 ? (
          <Select
            onValueChange={field.onChange}
            value={field.value || defaultValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Cabin Height" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        ) 
        : (
          <FormField
          control={form.control}
          name="customCabinHeight"
            render={({ field }) => (
            <>
            <Input
              type="number"
              {...field}
              placeholder="Enter custom cabin height"
                />
            <FormMessage />
            </>
          )}
        />)}
        {field.value === 'custom' && (
         <FormField
         control={form.control}
         name="customCabinHeight"
           render={({ field }) => (
           <>
           <Input
             type="number"
             {...field}
             placeholder="Enter custom cabin height"
               />
           <FormMessage />
           </>
         )}
       />
        )}
        <FormMessage />
      </FormItem>
    );
  }}
/>
          </>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
