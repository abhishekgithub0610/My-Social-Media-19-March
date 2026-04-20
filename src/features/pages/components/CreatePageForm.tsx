"use client";
import SelectInput from "@/shared/components/ui/SelectInput";
import TextAreaFormInput from "@/shared/components/ui/TextAreaFormInput";
import TextFormInput from "@/shared/components/ui/TextFormInput";
import { components, OptionProps } from "react-select";
import type { CreatePageFormValues } from "../types/page";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useRef } from "react";
import { useCreatePage, useUpdatePage } from "../hooks/usePages";
import Image from "next/image";
import { useEffect } from "react"; // ✅ NEW
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

// const TYPE_OPTIONS = [
//   "daily",
//   "daily+",
//   "weekly",
//   "weekly+",
//   "bi-weekly",
//   "bi-weekly+",
//   "monthly",
//   "monthly+",
//   "yearly",
//   "yearly+",
// ];
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
// ✅ NEW
type Props = {
  initialData?: PageType;
  isEdit?: boolean;
  onClose?: () => void; // ✅ NEW
  onSuccess?: (data: PageType) => void; // ✅ NEW
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

// const CreatePageForm = () => {
const CreatePageForm = ({ initialData, isEdit = false }: Props) => {
  // const { mutate, isPending } = useCreatePage();
  const { mutate: createPage, isPending: isCreating } = useCreatePage();
  const { mutate: updatePage, isPending: isUpdating } = useUpdatePage();
  const isPending = isCreating || isUpdating;
  const router = useRouter();

  // const handleTypeChange = (selected: string[]) => {
  //   if (!selected.length) {
  //     setValue("type", []);
  //     return;
  //   }

  //   // find lowest index (earliest in list)
  //   const minIndex = Math.min(
  //     ...selected.map((val) => TYPE_OPTIONS.indexOf(val)),
  //   );

  //   // ✅ select from selected → end
  //   const updated = TYPE_OPTIONS.slice(minIndex);

  //   setValue("type", updated, { shouldValidate: true });
  // };
  const createFormSchema: yup.ObjectSchema<CreatePageFormValues> = yup.object({
    // pageImage: yup.mixed<File>().required("Page image is required"),
    pageImage: yup
      .mixed<File>()
      .nullable() // ✅ MUST MATCH TYPE
      .test("fileRequired", "Page image is required", function (value) {
        if (isEdit) return true;
        return !!value;
      }),
    pageName: yup.string().required("Page name is required"),

    displayName: yup.string().required("Display name is required"),

    // ✅ optional email (valid if provided)
    email: yup
      .string()
      .transform((v) => (v === "" ? undefined : v)) // ✅ FIX (no null)
      .nullable()
      .email("Please enter a valid email"),

    // ✅ optional URL
    url: yup
      .string()
      .transform((v) => (v === "" ? undefined : v)) // ✅ FIX
      .nullable()
      .url("Please enter a valid URL"),

    // ✅ optional phone
    phoneNo: yup
      .number()
      .typeError("Phone number must be a valid number")
      .required("Phone number is required"),

    aboutPage: yup
      .string()
      .max(300, "Maximum 300 characters allowed")
      .required("About page is required"),

    category: yup.string().required("Please select a category"),
    type: yup
      .array()
      .of(yup.string().required()) // ✅ FIX HERE
      .min(1, "Please select at least one type")
      .required("Type is required"),
  });
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // inside component

  const {
    control,
    handleSubmit,
    setValue,
    reset, // ✅ ADD THIS
    formState: { errors },
  } = useForm<CreatePageFormValues>({
    resolver: yupResolver(createFormSchema),
    defaultValues: {
      type: [], // ✅ IMPORTANT
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
        phoneNo: initialData.phoneNo
          ? Number(initialData.phoneNo) // ✅ FIX phone type
          : undefined,
        aboutPage: initialData.aboutPage,
        category: initialData.category,
        type: initialData.types || [],
      });
    }
  }, [initialData, reset]);
  // useEffect(() => {
  //   if (initialData) {
  //     reset({
  //       pageName: initialData.pageName,
  //       displayName: initialData.displayName,
  //       email: initialData.email,
  //       url: initialData.url,
  //       phoneNo: initialData.phoneNo,
  //       aboutPage: initialData.aboutPage,
  //       category: initialData.category,
  //       type: initialData.types || [],
  //     });

  //     // ✅ FIX: set preview properly
  //     if (initialData.pageImageUrl) {
  //       setPreview(`http://localhost:7120/${initialData.pageImageUrl}`);
  //     }
  //   }
  // }, [initialData, reset]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // optional validation
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

    // ✅ FIX: only send image if it's a File (not URL)
    if (data.pageImage instanceof File) {
      formData.append("pageImage", data.pageImage);
    }

    data.type.forEach((t, i) => {
      formData.append(`Types[${i}]`, t);
    });

    // ✅ NEW: conditional logic
    // if (isEdit && initialData?.id) {
    //   updatePage(
    //     { id: initialData.id, formData },
    //     {
    //       onSuccess: () => {
    //         toast.success("Page updated successfully 🚀");
    //       },
    //       onError: (err: unknown) => {
    //         toast.error(getErrorMessage(err));
    //       },
    //     },
    //   );
    // }
    if (isEdit && initialData?.id) {
      updatePage(
        { id: initialData.id, formData },
        {
          onSuccess: () => {
            toast.success("Page updated successfully 🚀");

            // ✅ REDIRECT AFTER SUCCESS
            router.push(`/profile/page?pageId=${initialData.id}`);
          },
          onError: (err: unknown) => {
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
  // const onSubmit = (data: CreatePageFormValues) => {
  //   const formData = new FormData();

  //   formData.append("pageName", data.pageName);
  //   formData.append("displayName", data.displayName);

  //   if (data.email) formData.append("email", data.email);
  //   if (data.url) formData.append("url", data.url);
  //   if (data.phoneNo) formData.append("phoneNo", String(data.phoneNo));

  //   formData.append("aboutPage", data.aboutPage);
  //   formData.append("category", data.category);

  //   // ✅ IMAGE (IMPORTANT)
  //   formData.append("pageImage", data.pageImage);
  //   data.type.forEach((t, i) => {
  //     formData.append(`Types[${i}]`, t); // ✅ MATCH BACKEND PROPERTY
  //   });
  //   mutate(formData, {
  //     onSuccess: () => {
  //       toast.success("Page created successfully 🚀");
  //       reset();
  //       setPreview(null);
  //     },
  //     onError: (err: unknown) => {
  //       toast.error(getErrorMessage(err as AxiosError<{ message?: string }>));
  //     },
  //   });
  // };
  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <h1 className="h4 card-title mb-0">
          {isEdit ? "Edit Page" : "Create a page"}
        </h1>
      </CardHeader>
      {/* <CardHeader className="border-0 pb-0">
        <h1 className="h4 card-title mb-0">Create a page</h1>
      </CardHeader> */}
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
              {/* {preview ? (
                <img
                  src={preview}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>Upload</span>
              )} */}
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
              required // ✅ THIS shows *
              control={control}
            />
            <small>Name that describes what the page is about.</small>
          </Col>
          <TextFormInput<CreatePageFormValues>
            name="displayName"
            label="Display name"
            placeholder="Display name (Required)"
            control={control}
            required // ✅ THIS shows *
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
              required // ✅ THIS shows *
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
                  // components={{ Option }}
                  options={TYPE_OPTIONS}
                  // options={TYPE_OPTIONS.map((item) => ({
                  //   label: item,
                  //   value: item,
                  // }))}
                  value={TYPE_OPTIONS.filter((opt) =>
                    field.value?.includes(opt.value),
                  )}
                  // value={TYPE_OPTIONS.filter((opt) =>
                  //   field.value?.includes(opt),
                  // ).map((v) => ({ label: v, value: v }))}
                  onChange={(val) => {
                    const values = val ? val.map((v) => v.value) : [];
                    field.onChange(values);
                  }}
                  // onChange={(val, actionMeta) => {
                  //   // ✅ handle clear (when user clicks cross icon)
                  //   if (actionMeta.action === "clear") {
                  //     field.onChange([]);
                  //     return;
                  //   }

                  //   // ❗ safety check
                  //   if (!actionMeta.option) return;

                  //   const clickedValue = actionMeta.option.value;
                  //   const index = TYPE_OPTIONS.indexOf(clickedValue);

                  //   // ✅ always select clicked → bottom
                  //   const updated = TYPE_OPTIONS.slice(index);

                  //   field.onChange(updated);
                  // }}
                />
                // <Select
                //   {...field}
                //   isMulti
                //   options={TYPE_OPTIONS.map((item) => ({
                //     label: item,
                //     value: item,
                //   }))}
                //   value={TYPE_OPTIONS.filter((opt) =>
                //     field.value?.includes(opt),
                //   ).map((v) => ({ label: v, value: v }))}

                //   onChange={(val) => {
                //     const values =
                //       (val as { label: string; value: string }[])?.map(
                //         (v) => v.value,
                //       ) || [];

                //     handleTypeChange(values);
                //   }}
                // />
              )}
            />

            {errors.type && (
              <div className="text-danger mt-1">{errors.type.message}</div>
            )}
          </Col>
          {/* <Col xs={12}>
            <SelectInput<CreatePageFormValues>
              name="type"
              label="Type"
              control={control}
              required
              isMulti // ✅ IMPORTANT
              options={TYPE_OPTIONS.map((item) => ({
                label: item,
                value: item,
              }))}
              onChange={(val: { label: string; value: string }[] | null) => {
                const values = val?.map((v) => v.value) || [];
                handleTypeChange(values);
              }}
            />
          </Col> */}
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
            required // ✅ ADD THIS
            containerClassName="col-lg-6"
          />
          <Col xs={12}>
            <TextAreaFormInput
              name="aboutPage"
              label="About page"
              rows={3}
              required // ✅ THIS shows *
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
            {/* <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create a page"}
            </Button> */}
          </Col>
        </form>
      </CardBody>
    </Card>
  );
};
export default CreatePageForm;
