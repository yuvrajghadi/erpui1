import React from 'react';
import { Form, Input as AntdInput, DatePicker, Select, InputNumber } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { FormData } from '@/types';

// Define a reusable CustomInput component with proper asterisk positioning
function CustomInput({
  type,
  name,
  label,
  prefix,
  placeholder,
  rules,
  options,
  isTextArea = false,
  isDatePicker = false,
  isSelect = false,
  isMultiSelect = false,
  maxLength,
}: {
  type?: string;
  name: string;
  label: string;
  prefix?: React.ReactNode;
  placeholder?: string;
  rules?: any[];
  options?: { label: string; value: string }[];
  isTextArea?: boolean;
  isDatePicker?: boolean;
  isSelect?: boolean;
  isMultiSelect?: boolean;
  maxLength?: number;
}) {
  // Check if field is required
  const isRequired = rules?.some(rule => rule.required);
  
  // Format label with asterisk if required
  const formattedLabel = isRequired ? `${label}*` : label;
  
  // Return the appropriate form input based on the field type
  return (
    <Form.Item 
      name={name} 
      label={formattedLabel}
      rules={rules}
      className={isRequired ? 'required-field' : ''}
    >
      {isTextArea ? (
        <AntdInput.TextArea 
          rows={3} 
          placeholder={placeholder} 
          maxLength={maxLength}
          showCount
        />
      ) : isDatePicker ? (
        <DatePicker 
          className="w-full" 
          suffixIcon={<CalendarOutlined />}
          placeholder={placeholder}
        />
      ) : isSelect || isMultiSelect ? (
        <Select 
          placeholder={placeholder}
          mode={isMultiSelect ? 'multiple' : undefined}
          allowClear
          showSearch={!isMultiSelect}
          optionFilterProp="children"
        >
          {options?.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      ) : (
        <AntdInput 
          prefix={prefix} 
          placeholder={placeholder} 
          type={type}
          maxLength={maxLength}
          showCount={maxLength ? true : false}
        />
      )}
    </Form.Item>
  );
}

export default CustomInput;
