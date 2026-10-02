"use client";
import SelectInput from "@/shared/components/ui/SelectInput";
import TextAreaFormInput from "@/shared/components/ui/TextAreaFormInput";
import TextFormInput from "@/shared/components/ui/TextFormInput";
import type { CreatePageFormValues } from "../types/page";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useRef } from "react";
import { useCreatePage, useUpdatePage } from "../hooks/usePages";
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
import { PageType } from "@/shared/types/PageType";
import { useRouter } from "next/navigation";
const TYPE_OPTIONS = [
  { label: "All", value: "All", enumValue: 0 },
  { label: "Daily", value: "Daily", enumValue: 1 },
  { label: "Daily+", value: "DailyPlus", enumValue: 2 },
  { label: "Weekly", value: "Weekly", enumValue: 3 },
  { label: "Weekly+", value: "WeeklyPlus", enumValue: 4 },
  { label: "Fifteen Days", value: "FifteenDays", enumValue: 5 },
  { label: "Fifteen Days+", value: "FifteenDaysPlus", enumValue: 6 },
  { label: "Monthly", value: "Monthly", enumValue: 7 },
  { label: "Monthly+", value: "MonthlyPlus", enumValue: 8 },
  { label: "Yearly", value: "Yearly", enumValue: 9 },
];
type OptionType = {
  label: string;
  value: string;
  enumValue: number;
};
type Props = {
  initialData?: PageType;
  isEdit?: boolean;
  onClose?: () => void;
  onSuccess?: (data: PageType) => void;
};
const getInitialType = (
  typeValue?: string | number | (string | number)[] | null,
) => {
  const types = Array.isArray(typeValue)
    ? typeValue
    : typeValue === null || typeValue === undefined
      ? []
      : [typeValue];
  const normalizedTypes = types.map((type) => {
    if (typeof type === "number" || /^\d+$/.test(type)) {
      const numericValue = Number(type);
      return TYPE_OPTIONS.find((option) => option.enumValue === numericValue)
        ?.value;
    }

    return TYPE_OPTIONS.find(
      (option) => option.value.toLowerCase() === type.toLowerCase(),
    )?.value;
  });

  return (
    TYPE_OPTIONS.find((option) => normalizedTypes.includes(option.value))
      ?.value ?? ""
  );
};

const CreatePageForm = ({ initialData, isEdit = false }: Props) => {
  const { mutate: createPage, isPending: isCreating } = useCreatePage();
  const { mutate: updatePage, isPending: isUpdating } = useUpdatePage();
  const isPending = isCreating || isUpdating;
  const router = useRouter();
  const createFormSchema: yup.ObjectSchema<CreatePageFormValues> = yup.object({
    pageImage: yup
      .mixed<File>()
      .nullable()
      .test("fileRequired", "Page image is required", function (value) {
        if (isEdit) return true;
        return !!value;
      }),
    pageName: yup.string().required("Page name is required"),

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

    aboutPage: yup
      .string()
      .max(300, "Maximum 300 characters allowed")
      .required("About page is required"),

    category: yup.string().required("Please select a category"),
    type: yup.string().required("Please select a type"),
  });
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePageFormValues>({
    resolver: yupResolver(createFormSchema),
    defaultValues: {
      type: "",
    },
  });
  const imagePreview =
    preview ||
    (initialData?.pageImageUrl
      ? `http://localhost:7120/${initialData.pageImageUrl}`
      : null);

  useEffect(() => {
    if (initialData) {
      reset({
        pageName: initialData.pageName,
        displayName: initialData.displayName,
        email: initialData.email,
        url: initialData.url,
        phoneNo: initialData.phoneNo ? Number(initialData.phoneNo) : undefined,
        aboutPage: initialData.aboutPage,
        category: initialData.category,
        type: getInitialType(initialData.pageType ?? initialData.types),
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
    setValue("pageImage", file, { shouldValidate: true });

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };
  const onSubmit = (data: CreatePageFormValues) => {
    const formData = new FormData();

    formData.append("pageName", data.pageName);
    formData.append("displayName", data.displayName);

    if (data.email) formData.append("email", data.email);
    if (data.url) formData.append("url", data.url);
    if (data.phoneNo) formData.append("phoneNo", String(data.phoneNo));

    formData.append("aboutPage", data.aboutPage);
    formData.append("category", data.category);

    if (data.pageImage instanceof File) {
      formData.append("pageImage", data.pageImage);
    }

    formData.append("type", data.type);
    if (isEdit && initialData?.id) {
      updatePage(
        { id: initialData.id, formData },
        {
          onSuccess: () => {
            toast.success("Page updated successfully 🚀");

            router.push(`/profile/page?pageId=${initialData.id}`);
          },
          onError: (err: unknown) => {
            console.log("Error updating page:", err);
            toast.error(getErrorMessage(err));
          },
        },
      );
    } else {
      createPage(formData, {
        onSuccess: () => {
          toast.success("Page created successfully 🚀");
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
          {isEdit ? "Edit Page" : "Create a page"}
        </h1>
      </CardHeader>
      <CardBody>
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
          {" "}
          <Col xs={12} className="text-center">
            <label className="form-label d-block">Page Profile Photo</label>

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
                  alt="Page preview"
                  width={120}
                  height={120}
                  unoptimized
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              ) : (
                <span>Upload</span>
              )}
            </div>
            {errors.pageImage && (
              <div className="text-danger mt-2">{errors.pageImage.message}</div>
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
            <TextFormInput<CreatePageFormValues>
              name="pageName"
              label="Page name"
              placeholder="Page name (Required)"
              required
              control={control}
            />
            <small>Name that describes what the page is about.</small>
          </Col>
          <TextFormInput<CreatePageFormValues>
            name="displayName"
            label="Display name"
            placeholder="Display name (Required)"
            control={control}
            required
            containerClassName="col-sm-6 col-lg-4"
          />
          <TextFormInput<CreatePageFormValues>
            name="email"
            label="Email"
            placeholder="Email (Required)"
            control={control}
            containerClassName="col-sm-6 col-lg-4"
          />
          <Col sm={6} lg={4}>
            <SelectInput<CreatePageFormValues>
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
                <>
                  <Select<OptionType, false>
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(option) => field.onChange(option?.value ?? "")}
                    options={TYPE_OPTIONS}
                    value={
                      TYPE_OPTIONS.find(
                        (option) => option.value === field.value,
                      ) ?? null
                    }
                    isClearable
                  />
                  {field.value && (
                    <div
                      className="d-flex flex-wrap gap-3 mt-2"
                      aria-live="polite"
                    >
                      {TYPE_OPTIONS.slice(
                        TYPE_OPTIONS.findIndex(
                          (option) => option.value === field.value,
                        ),
                      ).map((option) => (
                        <label
                          className="form-check d-flex align-items-center gap-2 mb-0"
                          key={option.value}
                        >
                          <input
                            className="form-check-input mt-0"
                            type="checkbox"
                            checked
                            disabled
                            readOnly
                          />
                          <span className="form-check-label">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </>
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
              name="aboutPage"
              label="About page"
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
                  ? "Update Page"
                  : "Create a page"}
            </Button>
          </Col>
        </form>
      </CardBody>
    </Card>
  );
};
export default CreatePageForm;
