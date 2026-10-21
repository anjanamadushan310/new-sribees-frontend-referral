import { useState, useMemo } from "react";

export interface FormInstance<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  getFieldValue: <K extends keyof T>(name: K) => T[K];
  getFieldsValue: () => T;
  setFieldValue: <K extends keyof T>(name: K, value: T[K]) => void;
  setFieldsValue: (newValues: Partial<T>) => void;
  resetFields: () => void;
  setFieldError: (name: keyof T, error: string | undefined) => void;
  validateFields: () => Promise<T>;
  _registerValidate: (validator: () => Promise<T>) => void;
}

export function useForm<T extends Record<string, any>>(initialValues?: Partial<T>): [FormInstance<T>] {
  const [values, setValues] = useState<T>((initialValues || {}) as T);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const validatorRef = { current: null as (() => Promise<T>) | null };

  const form = useMemo<FormInstance<T>>(() => {
    return {
      values,
      errors,
      getFieldValue: (name) => values[name],
      getFieldsValue: () => values,
      setFieldValue: (name, val) => {
        setValues((prev) => ({ ...prev, [name]: val }));
        setErrors((prev) => {
          if (!prev[name]) return prev;
          const next = { ...prev };
          delete next[name];
          return next;
        });
      },
      setFieldsValue: (newVals) => {
        setValues((prev) => ({ ...prev, ...newVals }));
      },
      resetFields: () => {
        setValues((initialValues || {}) as T);
        setErrors({});
      },
      setFieldError: (name, err) => {
        setErrors((prev) => ({ ...prev, [name]: err }));
      },
      validateFields: async () => {
        if (validatorRef.current) {
          return validatorRef.current();
        }
        return values;
      },
      _registerValidate: (fn) => {
        validatorRef.current = fn;
      },
    };
  }, [values, errors, initialValues]);

  return [form];
}

export const Form = {
  useForm,
};
