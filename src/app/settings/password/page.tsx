"use client";
import DateFormInput from "@/shared/components/ui/DateFormInput";
import PasswordFormInput from "@/shared/components/ui/PasswordFormInput";
import TextAreaFormInput from "@/shared/components/ui/TextAreaFormInput";
import TextFormInput from "@/shared/components/ui/TextFormInput";
import PasswordStrengthMeter from "@/shared/components/ui/PasswordStrengthMeter";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Link from "next/link";
import { useState } from "react";
import {
  changePassword,
  updateUserProfile,
} from "@/features/users/services/userApi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
} from "react-bootstrap";
import { BsPlusCircleDotted } from "react-icons/bs";
import * as yup from "yup";
type PhoneCountryData = {
  dialCode?: string;
  countryCode?: string;
  name?: string;
};
type ChangePasswordFormValues = {
  currentPass: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword = () => {
  const resetPasswordSchema = yup.object({
    currentPass: yup.string().required("Please enter current Password"),

    newPassword: yup
      .string()
      .min(8, "Password must be minimum 8 characters")
      .required("Please enter Password"),

    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });

  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmitPassword = async (data: ChangePasswordFormValues) => {
    try {
      await changePassword({
        currentPassword: data.currentPass,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      toast.success("Password updated successfully 🚀");
      reset(); // recommended
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    }
  };
  const passwordValue = useWatch({
    control,
    name: "newPassword",
    defaultValue: "",
  });

  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <CardTitle>Change your password</CardTitle>
        <p className="mb-0">
          See resolved goodness felicity shy civility domestic had but.
        </p>
      </CardHeader>
      <CardBody>
        <form className="row g-3" onSubmit={handleSubmit(onSubmitPassword)}>
          <PasswordFormInput
            name="currentPass"
            label="Current password"
            placeholder="Enter current password"
            control={control}
            containerClassName="col-12"
          />
          <Col xs={12}>
            <PasswordFormInput
              name="newPassword"
              label="New password"
              placeholder="Enter new password"
              control={control}
            />
            <div className="mt-2">
              <PasswordStrengthMeter password={passwordValue} />{" "}
            </div>
          </Col>
          <PasswordFormInput
            name="confirmPassword"
            label="Confirm password"
            placeholder="Confirm new password"
            control={control}
            containerClassName="col-12"
          />
          <Col xs={12} className="text-end">
            <Button variant="primary" type="submit" className="mb-0">
              Update password
            </Button>
          </Col>
        </form>
      </CardBody>
    </Card>
  );
};

export default ChangePassword;
