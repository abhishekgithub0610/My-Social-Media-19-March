"use client";

import {
  currentYear,
  developedBy,
  developedByLink,
} from "@/shared/constants/appConstants";
import Link from "next/link";
import { Button, FormCheck } from "react-bootstrap";
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
  const { mutate, isPending } = useLogin();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
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

// // "use client";
// // import { currentYear, developedBy, developedByLink } from "@/context/constants";
// // import Link from "next/link";
// // import { Button, FormCheck } from "react-bootstrap";
// // import TextFormInput from "@/shared/components/ui/TextFormInput";
// // import PasswordFormInput from "@/shared/components/ui/TextFormInput";

// // const LoginForm = () => {
// //   const { loading, login, control } = useSignIn();

// //   return (
// //     <form className="mt-4" onSubmit={login}>
// //       <TextFormInput
// //         name="email"
// //         type="email"
// //         placeholder="Enter email"
// //         control={control}
// //         containerClassName="mb-3 input-group-lg"
// //       />
// //       <div className="mb-3">
// //         <PasswordFormInput
// //           name="password"
// //           placeholder="Enter password"
// //           control={control}
// //           size="lg"
// //           containerClassName="w-100"
// //         />
// //       </div>
// //       <div className="mb-3 d-sm-flex justify-content-between">
// //         <div>
// //           <FormCheck type="checkbox" label="Remember me?" id="rememberCheck" />
// //         </div>
// //         <Link href="/auth-advance/forgot-pass">Forgot password?</Link>
// //       </div>
// //       <div className="d-grid">
// //         <Button
// //           variant="primary-soft"
// //           size="lg"
// //           type="submit"
// //           disabled={loading}
// //         >
// //           Login
// //         </Button>
// //       </div>
// //       <p className="mb-0 mt-3">
// //         ©{currentYear}{" "}
// //         <a target="_blank" href={developedByLink}>
// //           {developedBy}.
// //         </a>{" "}
// //         All rights reserved
// //       </p>
// //     </form>
// //   );
// // };
// // export default LoginForm;
