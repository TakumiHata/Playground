import moment from 'moment';

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