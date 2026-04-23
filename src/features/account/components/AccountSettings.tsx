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
import { updateUserProfile } from "@/features/users/services/userApi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { useEffect } from "react";
import { getUserById } from "@/features/users/services/userApi";
import { changePassword } from "@/features/users/services/userApi";
import { useAuthStore } from "@/features/account/store/authStore";
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
type AccountSettingsFormValues = {
  fName: string;
  lName: string;
  userName: string;
  phoneNo: string;
  countryCode: string; // NEW
  email: string;
  overview: string;
  dateOfBirth?: string;
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

const AccountSettings = () => {
  const createFormSchema: yup.ObjectSchema<AccountSettingsFormValues> =
    yup.object({
      fName: yup.string().required("Please enter your first name"),
      lName: yup.string().required("Please enter your last name"),
      userName: yup.string().required("Please enter your username"),
      phoneNo: yup.string().required("Please enter your phone number"),
      countryCode: yup.string().required("Please select country code"),
      email: yup
        .string()
        .email("Invalid email")
        .required("Please enter your email"),
      overview: yup
        .string()
        .required("Please enter your page description")
        .max(300, "Character limit must be less than 300"),
      dateOfBirth: yup.string().optional(),
    });
  const { control, handleSubmit, setValue, reset } =
    useForm<AccountSettingsFormValues>({
      resolver: yupResolver(createFormSchema),
      defaultValues: {
        fName: "",
        lName: "",
        userName: "",
        email: "",
        overview: "",
        phoneNo: "",
        dateOfBirth: "",
        countryCode: "+91",
      },
    });
  const { user } = useAuthStore();
  const userId = user?.id;
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const onSubmitProfile = async (data: AccountSettingsFormValues) => {
    try {
      const formData = new FormData();

      formData.append("FullName", `${data.fName} ${data.lName}`);
      formData.append("UserNameSlug", data.userName);
      formData.append("PhoneNumber", data.phoneNo);
      formData.append("CountryCode", data.countryCode);
      formData.append("Email", data.email);
      formData.append("Bio", data.overview);

      if (data.dateOfBirth) {
        const formattedDate = new Date(data.dateOfBirth)
          .toISOString()
          .split("T")[0];

        formData.append("DateOfBirth", formattedDate);
      }

      if (profileFile) {
        formData.append("ProfilePicture", profileFile);
      }

      await updateUserProfile(formData);

      toast.success("Profile updated successfully 🚀");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserById(userId);

        const names = userData.fullName?.trim().split(" ") || [];

        const firstName = names[0] || "";
        const lastName = names.slice(1).join(" ");
        reset({
          fName: firstName || "",
          lName: lastName || "",
          userName: userData.userNameSlug || "",
          email: userData.email || "",
          overview: userData.bio || "",
          phoneNo: userData.phoneNumber || "",
          countryCode: userData.countryCode || "+91",
          dateOfBirth: userData.dateOfBirth || "",
        });

        if (userData.profilePicture) {
          setProfileImage(`http://localhost:7120/${userData.profilePicture}`);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, reset]);
  // ✅ FIX: handle image upload preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setProfileFile(file);

      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }
  return (
    <>
      <Card className="mb-4">
        <CardHeader className="border-0 pb-0">
          <h1 className="h5 card-title">Account Settings</h1>
          <p className="mb-0">
            He moonlights difficult engrossed it, sportsmen. Interested has all
            Devonshire difficulty gay assistance joy. Unaffected at ye of
            compliment alteration to.
          </p>
        </CardHeader>
        <CardBody>
          <form
            className="row g-3"
            onSubmit={handleSubmit(onSubmitProfile, (errors) =>
              console.log(errors),
            )}
          >
            {" "}
            <Col xs={12} className="text-center mb-3">
              {/* SHOW IMAGE */}
              <div>
                <img
                  src={profileImage || "/placeholder.jpg"}
                  alt="Profile"
                  width={120}
                  height={120}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </div>

              {/* UPLOAD INPUT */}
              <input
                type="file"
                accept="image/*"
                className="form-control mt-2"
                onChange={handleImageChange}
              />

              {/* REMOVE IMAGE OPTION */}
              <Button
                variant="link"
                onClick={() => {
                  setProfileImage(null);
                  setProfileFile(null);
                }}
              >
                Remove
              </Button>
            </Col>
            <TextFormInput
              name="fName"
              label="First name"
              placeholder="Enter first name"
              control={control}
              containerClassName="col-sm-6 col-lg-4"
            />
            <TextFormInput
              name="lName"
              label="Last name"
              placeholder="Enter last name"
              control={control}
              containerClassName="col-sm-6 col-lg-4"
            />
            <TextFormInput
              name="userName"
              label="User name"
              placeholder="Enter username"
              control={control}
              containerClassName="col-sm-6"
            />
            <Col lg={6}>
              <label className="form-label">Birthday </label>
              <DateFormInput
                name="dateOfBirth"
                control={control}
                placeholder="Select your date of birth"
                className="form-control"
              />
              {/* <DateFormInput
                placeholder="12/12/1990"
                className="form-control"
                options={{ defaultDate: "12/12/1990" }}
              /> */}
            </Col>
            <Col sm={6}>
              <label className="form-label">Phone Number</label>

              <Controller
                name="phoneNo"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country={"in"}
                    placeholder="Enter phone number"
                    value={field.value}
                    onChange={(value, country: PhoneCountryData) => {
                      field.onChange(value);
                      setValue("countryCode", `+${country.dialCode || ""}`, {
                        shouldValidate: true,
                      });
                    }}
                    inputStyle={{
                      width: "100%",
                      height: "38px", // match Bootstrap input height
                    }}
                    buttonStyle={{
                      height: "38px", // match dropdown flag button height
                    }}
                  />
                )}
              />
            </Col>
            {/* <Col sm={6}>
              <TextFormInput
                name="phoneNo"
                label="Phone number"
                control={control}
              />
              <Link className="btn btn-sm btn-dashed rounded mt-2" href="#">
                {" "}
                <BsPlusCircleDotted className="me-1" />
                Add new phone number
              </Link>
            </Col> */}
            <Col sm={6}>
              <TextFormInput
                name="email"
                label="Email"
                placeholder="Enter email address"
                control={control}
              />
              <Link className="btn btn-sm btn-dashed rounded mt-2" href="#">
                {" "}
                <BsPlusCircleDotted className="me-1" />
                Add new email address
              </Link>
            </Col>
            <Col xs={12}>
              <TextAreaFormInput
                name="overview"
                label="Overview"
                rows={4}
                placeholder="Write something about yourself"
                control={control}
              />
              <small>Character limit: 300</small>
            </Col>
            <Col xs={12} className="text-end">
              <Button
                variant="primary"
                type="submit"
                size="sm"
                className="mb-0"
              >
                Save changes
              </Button>
            </Col>
          </form>
        </CardBody>
      </Card>
      <ChangePassword />
    </>
  );
};
export default AccountSettings;
