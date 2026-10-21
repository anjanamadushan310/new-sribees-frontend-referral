/**
 * Authentication and login interfaces and types.
 */

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  loading: boolean;
  error: string | null;
  onSubmit: (values: LoginFormValues) => void;
}

export interface LoginProps {
  loading: boolean;
  error: string | null;
  onSubmit: (values: LoginFormValues) => void;
}
