"use client";

import {
  currentYear,
  developedBy,
  developedByLink,
} from "@/shared/constants/appConstants";
import Link from "next/link";
import { Alert, Button, FormCheck } from "react-bootstrap";
import TextFormInput from "@/shared/components/ui/TextFormInput";
import PasswordFormInput from "@/shared/components/ui/PasswordFormInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLogin } from "@/features/account/hooks/useAccount";

type LoginFormValues = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginForm = () => {
  const { mutate, isPending, error } = useLogin();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };
  const apiErrorMessage =
    (error as any)?.response?.data?.error?.message ||
    (error as any)?.response?.data?.message ||
    "Unable to login. Please try again.";
  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      {/* CHANGED: Backend API Error (Instagram/Facebook style) */}
      {error && (
        <Alert
          variant="danger"
          className="py-2 px-3 small mb-3 border rounded-3"
        >
          {apiErrorMessage}
        </Alert>
      )}
      <TextFormInput
        name="email"
        control={control}
        placeholder="Enter email"
        containerClassName="mb-3 input-group-lg"
      />

      <PasswordFormInput
        name="password"
        control={control}
        placeholder="Enter password"
        containerClassName="mb-3"
      />

      <div className="mb-3 d-sm-flex justify-content-between">
        <FormCheck label="Remember me?" />
        <Link href="/forgot-password">Forgot password?</Link>
      </div>

      <div className="d-grid">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </div>

      <p className="mt-3 text-center">
        ©{currentYear}{" "}
        <a target="_blank" href={developedByLink}>
          {developedBy}
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
