import { useState, useMemo } from "react";

import type { FormInstance } from "../../../interface/dashboard";

export type { FormInstance };

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
