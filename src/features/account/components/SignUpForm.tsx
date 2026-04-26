"use client";
import PasswordFormInput from "@/shared/components/ui/PasswordFormInput";
import TextFormInput from "@/shared/components/ui/TextFormInput";
import PasswordStrengthMeter from "@/shared/components/ui/PasswordStrengthMeter";
import { useRouter } from "next/navigation";
import {
  currentYear,
  developedBy,
  developedByLink,
} from "@/shared/constants/appConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, FormCheck } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form"; // ✅ FIX: import SubmitHandler
import * as yup from "yup";
import { useRegister } from "@/features/account/hooks/useAccount";
// ✅ FIX: Strongly typed form values
type SignUpFormValues = {
  name: string;
  email: string;
  userNameSlug: string;
  password: string;
  confirmPassword: string;
};
// ✅ FIX: Move schema OUTSIDE component (prevents re-creation on every render)
const signUpSchema: yup.ObjectSchema<SignUpFormValues> = yup.object({
  name: yup.string().required("Name is required"),
  userNameSlug: yup
    .string()
    .required("Username slug is required")
    .min(3, "Username slug must be at least 3 characters")
    .matches(
      /^[a-z0-9-_]+$/,
      "Only lowercase letters, numbers, hyphen and underscore are allowed",
    ),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required") // ✅ FIX: was missing required
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const SignUpForm = () => {
  const [firstPassword, setFirstPassword] = useState<string>("");

  const { mutate, isPending } = useRegister();

  // // const signUpSchema = yup.object({
  // //   name: yup.string().required("Name is required"),
  // //   email: yup.string().email().required(),
  // //   password: yup.string().required(),
  // //   confirmPassword: yup
  // //     .string()
  // //     .oneOf([yup.ref("password")], "Passwords must match"),
  // // });

  // ✅ FIX: Proper typing applied
  const { control, handleSubmit, watch } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: "",
      userNameSlug: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ✅ FIX: cleaner way to watch password (no getValues needed)
  const passwordValue = watch("password");
  // const { control, handleSubmit, watch, getValues } = useForm<SignUpFormValues>(
  //   {
  //     resolver: yupResolver(signUpSchema),
  //   },
  // );
  // const { control, handleSubmit, watch, getValues } = useForm({
  //   resolver: yupResolver(signUpSchema),
  // });

  useEffect(() => {
    setFirstPassword(passwordValue);
  }, [passwordValue]);

  // useEffect(() => {
  //   setFirstPassword(getValues().password);
  // }, [watch("password")]);
  const router = useRouter();
  // ✅ FIX: NO ANY — fully typed submit handler
  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    // //const onSubmit = (data: any) => {
    mutate(
      {
        email: data.email,
        password: data.password,
        name: data.name, // ✅ FIX: was using email split (bad practice)
        userNameSlug: data.userNameSlug, // ✅ Added
        role: "User",
      },
      {
        onSuccess: () => {
          alert("Registered successfully ✅");
          router.push("/sign-in"); // redirect here
        },
        // ✅ FIX: typed error instead of any
        onError: (err: unknown) => {
          // //onError: (err: any) => {
          console.error(err);
          alert("Registration failed ❌");
        },
      },
    );
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3 text-start">
        <TextFormInput<SignUpFormValues> // ✅ FIX: generic added
          name="name"
          control={control}
          placeholder="Enter name"
        />
        {/* <TextFormInput
          name="email"
          control={control}
          placeholder="Enter email"
        /> */}
      </div>
      {/* Username Slug */}
      <div className="mb-3 text-start">
        <TextFormInput<SignUpFormValues>
          name="userNameSlug"
          control={control}
          placeholder="Enter username (example: john_doe)"
        />
      </div>
      <div className="mb-3 text-start">
        <TextFormInput<SignUpFormValues>
          name="email"
          control={control}
          placeholder="Enter email"
        />
      </div>
      <div className="mb-3 position-relative">
        <PasswordFormInput<SignUpFormValues> // ✅ FIX generic added
          name="password"
          control={control}
          placeholder="Enter new password"
        />
        <div className="mt-2">
          <PasswordStrengthMeter password={firstPassword} />
        </div>
      </div>

      <PasswordFormInput<SignUpFormValues> // ✅ FIX generic added
        name="confirmPassword"
        control={control}
        placeholder="Confirm password"
      />

      <div className="mb-3 text-start">
        <FormCheck label="Keep me signed in" />
      </div>

      <div className="d-grid">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Sign me up"}
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
