import moment from 'moment';
import * as yup from 'yup';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDateRange = (
  startDate: moment.Moment | null,
  endDate: moment.Moment | null
): ValidationError | null => {
  if (startDate && endDate && startDate.isAfter(endDate)) {
    return {
      field: 'dateRange',
      message: '開始日は終了日より前の日付を選択してください',
    };
  }
  return null;
};

export const validateCustomerName = (name: string): ValidationError | null => {
  if (name.length > 50) {
    return {
      field: 'customerName',
      message: '顧客名は50文字以内で入力してください',
    };
  }

  const invalidChars = /[<>{}[\]\\]/;
  if (invalidChars.test(name)) {
    return {
      field: 'customerName',
      message: '顧客名に使用できない文字が含まれています',
    };
  }

  return null;
};

export const validateFilterForm = (
  startDate: moment.Moment | null,
  endDate: moment.Moment | null,
  customerName: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const dateRangeError = validateDateRange(startDate, endDate);
  if (dateRangeError) {
    errors.push(dateRangeError);
  }

  const customerNameError = validateCustomerName(customerName);
  if (customerNameError) {
    errors.push(customerNameError);
  }

  return errors;
};

// XSS対策のためのサニタイズ関数
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// 共通のバリデーションスキーマ
export const commonValidationSchemas = {
  email: yup
    .string()
    .email('有効なメールアドレスを入力してください')
    .required('メールアドレスは必須です')
    .max(255, 'メールアドレスは255文字以内で入力してください'),

  password: yup
    .string()
    .required('パスワードは必須です')
    .min(8, 'パスワードは8文字以上で入力してください')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'パスワードは大文字、小文字、数字、特殊文字を含める必要があります'
    ),

  name: yup
    .string()
    .required('名前は必須です')
    .max(100, '名前は100文字以内で入力してください')
    .matches(/^[ぁ-んァ-ン一-龥a-zA-Z\s]+$/, '名前は日本語または英語で入力してください'),

  phone: yup
    .string()
    .matches(/^[0-9-]+$/, '電話番号は数字とハイフンのみ使用できます')
    .max(20, '電話番号は20文字以内で入力してください'),

  price: yup
    .number()
    .required('価格は必須です')
    .min(0, '価格は0以上で入力してください')
    .max(999999, '価格は999,999円以内で入力してください'),

  duration: yup
    .number()
    .required('所要時間は必須です')
    .min(1, '所要時間は1分以上で入力してください')
    .max(480, '所要時間は480分以内で入力してください'),

  description: yup
    .string()
    .max(1000, '説明は1000文字以内で入力してください'),
};

// バリデーションエラーメッセージの型
export interface ValidationError {
  field: string;
  message: string;
}

// バリデーションエラーの変換関数
export const convertYupErrorToValidationError = (error: yup.ValidationError): ValidationError[] => {
  return error.inner.map((err: yup.ValidationError) => ({
    field: err.path || 'unknown',
    message: err.message,
  }));
}; 