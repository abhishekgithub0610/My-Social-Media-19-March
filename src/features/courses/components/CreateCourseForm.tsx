"use client";
import SelectInput from "@/shared/components/ui/SelectInput";
import TextAreaFormInput from "@/shared/components/ui/TextAreaFormInput";
import TextFormInput from "@/shared/components/ui/TextFormInput";
import { components, OptionProps } from "react-select";
import type { CreateCourseFormValues } from "../types/Course";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useRef } from "react";
import { useCreateCourse, useUpdateCourse } from "../hooks/useCourses";
import Image from "next/image";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/shared/utils/errorHandler";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
} from "react-bootstrap";

import {
  BsFacebook,
  BsInstagram,
  BsPinterest,
  BsTwitter,
} from "react-icons/bs";
import { CourseType } from "@/shared/types/CourseType";
import { useRouter } from "next/navigation";
import { CreateCourseFormValues } from "../types/course";
const TYPE_OPTIONS = [
  { label: "Daily", value: "Daily" },
  { label: "Daily+", value: "DailyPlus" },
  { label: "Weekly", value: "Weekly" },
  { label: "Weekly+", value: "WeeklyPlus" },
  { label: "Bi-Weekly", value: "BiWeekly" },
  { label: "Bi-Weekly+", value: "BiWeeklyPlus" },
  { label: "Monthly", value: "Monthly" },
  { label: "Monthly+", value: "MonthlyPlus" },
  { label: "Yearly", value: "Yearly" },
  { label: "Yearly+", value: "YearlyPlus" },
];
type OptionType = {
  label: string;
  value: string;
};
type Props = {
  initialData?: CourseType;
  isEdit?: boolean;
  onClose?: () => void;
  onSuccess?: (data: CourseType) => void;
};
const Option = (props: OptionProps<OptionType, true>) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
        style={{ marginRight: 8 }}
      />
      {props.label}
    </components.Option>
  );
};

const CreateCourseForm = ({ initialData, isEdit = false }: Props) => {
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const isPending = isCreating || isUpdating;
  const router = useRouter();
  const createFormSchema: yup.ObjectSchema<CreateCourseFormValues> = yup.object(
    {
      courseImage: yup
        .mixed<File>()
        .nullable()
        .test("fileRequired", "Course image is required", function (value) {
          if (isEdit) return true;
          return !!value;
        }),
      courseName: yup.string().required("Course name is required"),

      displayName: yup.string().required("Display name is required"),

      email: yup
        .string()
        .transform((v) => (v === "" ? undefined : v))
        .nullable()
        .email("Please enter a valid email"),

      url: yup
        .string()
        .transform((v) => (v === "" ? undefined : v))
        .nullable()
        .url("Please enter a valid URL"),

      phoneNo: yup
        .number()
        .typeError("Phone number must be a valid number")
        .required("Phone number is required"),

      aboutCourse: yup
        .string()
        .max(300, "Maximum 300 characters allowed")
        .required("About course is required"),

      category: yup.string().required("Please select a category"),
      type: yup
        .array()
        .of(yup.string().required())
        .min(1, "Please select at least one type")
        .required("Type is required"),
    },
  );
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateCourseFormValues>({
    resolver: yupResolver(createFormSchema),
    defaultValues: {
      type: [],
    },
  });
  const imagePreview =
    preview ||
    (initialData?.courseImageUrl
      ? `http://localhost:7120/${initialData.courseImageUrl}`
      : null);

  useEffect(() => {
    if (initialData) {
      reset({
        courseName: initialData.courseName,
        displayName: initialData.displayName,
        email: initialData.email,
        url: initialData.url,
        phoneNo: initialData.phoneNo ? Number(initialData.phoneNo) : undefined,
        aboutCourse: initialData.aboutCourse,
        category: initialData.category,
        type: initialData.types || [],
      });
    }
  }, [initialData, reset]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    setValue("courseImage", file, { shouldValidate: true });

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };
  const onSubmit = (data: CreateCourseFormValues) => {
    const formData = new FormData();

    formData.append("courseName", data.courseName);
    formData.append("displayName", data.displayName);

    if (data.email) formData.append("email", data.email);
    if (data.url) formData.append("url", data.url);
    if (data.phoneNo) formData.append("phoneNo", String(data.phoneNo));

    formData.append("aboutCourse", data.aboutCourse);
    formData.append("category", data.category);

    if (data.courseImage instanceof File) {
      formData.append("courseImage", data.courseImage);
    }

    data.type.forEach((t, i) => {
      formData.append(`Types[${i}]`, t);
    });
    if (isEdit && initialData?.id) {
      updateCourse(
        { id: initialData.id, formData },
        {
          onSuccess: () => {
            toast.success("Course updated successfully 🚀");

            router.push(`/profile/course?courseId=${initialData.id}`);
          },
          onError: (err: unknown) => {
            toast.error(getErrorMessage(err));
          },
        },
      );
    } else {
      createCourse(formData, {
        onSuccess: () => {
          toast.success("Course created successfully 🚀");
          reset();
          setPreview(null);
        },
        onError: (err: unknown) => {
          toast.error(getErrorMessage(err));
        },
      });
    }
  };
  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <h1 className="h4 card-title mb-0">
          {isEdit ? "Edit Course" : "Create a course"}
        </h1>
      </CardHeader>
      <CardBody>
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
          {" "}
          <Col xs={12} className="text-center">
            <label className="form-label d-block">Course Profile Photo</label>

            <div
              className="border rounded-circle d-flex align-items-center justify-content-center mx-auto"
              style={{
                width: 120,
                height: 120,
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Course preview"
                  width={120}
                  height={120}
                  unoptimized
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              ) : (
                <span>Upload</span>
              )}
            </div>
            {errors.courseImage && (
              <div className="text-danger mt-2">
                {errors.courseImage.message}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Col>
          <Col xs={12}>
            <TextFormInput<CreateCourseFormValues>
              name="courseName"
              label="Course name"
              placeholder="Course name (Required)"
              required
              control={control}
            />
            <small>Name that describes what the course is about.</small>
          </Col>
          <TextFormInput<CreateCourseFormValues>
            name="displayName"
            label="Display name"
            placeholder="Display name (Required)"
            control={control}
            required
            containerClassName="col-sm-6 col-lg-4"
          />
          <TextFormInput<CreateCourseFormValues>
            name="email"
            label="Email"
            placeholder="Email (Required)"
            control={control}
            containerClassName="col-sm-6 col-lg-4"
          />
          <Col sm={6} lg={4}>
            <SelectInput<CreateCourseFormValues>
              name="category"
              control={control}
              label="Category (required)"
              required
              options={[
                { label: "Comedy", value: "comedy" },
                { label: "Technology", value: "technology" },
                { label: "Education", value: "education" },
                { label: "Entertainment", value: "entertainment" },
                { label: "Hotel", value: "hotel" },
                { label: "Travel", value: "travel" },
                { label: "Influencer", value: "influencer" },
                { label: "Health", value: "health" },
                { label: "Health Specialist", value: "health-specialist" },
                { label: "Motivation", value: "motivation" },
                { label: "Sports", value: "sports" },
              ]}
            />
          </Col>
          <Col xs={12}>
            <label className="form-label">
              Type <span className="text-danger">*</span>
            </label>

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  options={TYPE_OPTIONS}
                  value={TYPE_OPTIONS.filter((opt) =>
                    field.value?.includes(opt.value),
                  )}
                  onChange={(val) => {
                    const values = val ? val.map((v) => v.value) : [];
                    field.onChange(values);
                  }}
                />
              )}
            />

            {errors.type && (
              <div className="text-danger mt-1">{errors.type.message}</div>
            )}
          </Col>
          <TextFormInput
            name="url"
            label="Website URL"
            placeholder="https://stackbros.in"
            control={control}
            containerClassName="col-sm-6"
          />
          <TextFormInput
            name="phoneNo"
            label="Phone number"
            placeholder="Phone number (Required)"
            control={control}
            required
            containerClassName="col-lg-6"
          />
          <Col xs={12}>
            <TextAreaFormInput
              name="aboutCourse"
              label="About course "
              rows={3}
              required
              placeholder="Description (Required)"
              control={control}
            />
            <small>Character limit: 300</small>
          </Col>
          <hr />
          <Col xs={12}>
            <CardTitle className="mb-0">Social Links</CardTitle>
          </Col>
          <Col sm={6}>
            <label className="form-label">Facebook</label>
            <div className="input-group">
              <span className="input-group-text border-0">
                {" "}
                <BsFacebook className="text-facebook" />{" "}
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="https://www.facebook.com"
              />
            </div>
          </Col>
          <Col sm={6}>
            <label className="form-label">Twitter</label>
            <div className="input-group">
              <span className="input-group-text border-0">
                {" "}
                <BsTwitter className="text-twitter" />{" "}
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="https://www.twitter.com"
              />
            </div>
          </Col>
          <Col sm={6}>
            <label className="form-label">Instagram</label>
            <div className="input-group">
              <span className="input-group-text border-0">
                {" "}
                <BsInstagram className="text-instagram" />{" "}
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="https://www.instagram.com"
              />
            </div>
          </Col>
          <Col sm={6}>
            <label className="form-label">Pinterest</label>
            <div className="input-group">
              <span className="input-group-text border-0">
                {" "}
                <BsPinterest className="text-pinterest" />{" "}
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="https://www.pinterest.com"
              />
            </div>
          </Col>
          <Col xs={12} className="text-end">
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Course"
                  : "Create a course"}
            </Button>
          </Col>
        </form>
      </CardBody>
    </Card>
  );
};
export default CreateCourseForm;
