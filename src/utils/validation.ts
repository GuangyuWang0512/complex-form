import { parsePhoneNumberFromString } from 'libphonenumber-js';

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
  sameBillingAddress: boolean;
}

export function validateForm(formData: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  // 验证公司名称
  if (!formData.companyName) errors.companyName = 'Company name is required';

  // 验证电话区号
  if (!formData.phoneCode) {
    errors.phoneCode = 'Phone code is required';
  } else {
    // 确保电话区号只包含数字
    if (!/^\d+$/.test(formData.phoneCode)) {
      errors.phoneCode = 'Phone code must contain only numbers';
    }
  }

  // 验证电话号码
  if (!formData.phoneNumber) {
    errors.phoneNumber = 'Phone number is required';
  } else {
    // 确保电话号码只包含数字
    if (!/^\d+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must contain only numbers';
    } else {
      // 使用 libphonenumber-js 验证电话区号和号码的合法性
      const phoneNumberWithCode = `+${formData.phoneCode}${formData.phoneNumber}`;
      const phoneNumberObj = parsePhoneNumberFromString(phoneNumberWithCode);

      if (!phoneNumberObj || !phoneNumberObj.isValid()) {
        errors.phoneCode = 'Invalid country code';
      }
      if (
        formData.phoneNumber.length > 11 ||
        formData.phoneNumber.length < 10
      ) {
        errors.phoneNumber = 'Invalid phone number';
      }
    }
  }

  // 验证公司地址
  if (!formData.companyAddress)
    errors.companyAddress = 'Company address is required';

  // 验证产品类型
  if (!formData.productType) errors.productType = 'Product type is required';

  if (formData.sameBillingAddress === true) {
    if (!formData.billingAddress)
      errors.billingAddress = 'Billing address is required';
  }

  if (formData.customLoad) {
    //errors.customLoad = 'Custom load must be between 200 and 10,000';
    if (formData.customLoad < 200 || formData.customLoad > 10000) {
      errors.customLoad = 'Custom load must be between 200 and 10,000';
    }
  }

  if (formData.customCabinWidth) {
    if (formData.customCabinWidth < 1000 || formData.customCabinWidth > 2000) {
      errors.customCabinWidth =
        'Custom cabin width must be between 1000 and 2000';
    }
  }

  if (formData.customCabinHeight) {
    if (
      formData.customCabinHeight < 1000 ||
      formData.customCabinHeight > 2500
    ) {
      errors.customCabinHeight =
        'Custom cabin height must be between 1000 and 2500';
    }
  }
  return errors;
}
