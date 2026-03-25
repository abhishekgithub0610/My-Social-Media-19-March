"use client";
import SelectInput from "@/shared/components/ui/SelectInput";
import TextAreaFormInput from "@/shared/components/ui/TextAreaFormInput";
import TextFormInput from "@/shared/components/ui/TextFormInput";
import type { CreatePageFormValues } from "../types/page";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useState, useRef } from "react";
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
const CreatePageForm = () => {
  const createFormSchema: yup.ObjectSchema<CreatePageFormValues> = yup.object({
    pageImage: yup.mixed<File>().required("Page image is required"),

    pageName: yup.string().required("Page name is required"),

    displayName: yup.string().required("Display name is required"),

    // ✅ optional email (valid if provided)
    email: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .email("Please enter a valid email"),

    // ✅ optional URL
    url: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .url("Please enter a valid URL"),

    // ✅ optional phone
    phoneNo: yup
      .number()
      .transform((v, originalValue) => (originalValue === "" ? null : v))
      .nullable()
      .typeError("Phone number must be a valid number"),

    aboutPage: yup
      .string()
      .max(300, "Maximum 300 characters allowed")
      .required("About page is required"),

    category: yup.string().required("Please select a category"),
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // optional validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    setValue("pageImage", file, { shouldValidate: true });
    setValue("pageImage", file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreatePageFormValues>({
    resolver: yupResolver(createFormSchema),
  });
  const onSubmit = async (data: CreatePageFormValues) => {
    console.log("FORM DATA:", data);

    const formData = new FormData();

    formData.append("pageName", data.pageName);
    formData.append("displayName", data.displayName);
    if (data.email) {
      formData.append("email", data.email);
    }
    if (data.url) {
      formData.append("url", data.url);
    }
    formData.append("phoneNo", String(data.phoneNo));
    formData.append("aboutPage", data.aboutPage);

    // 🔥 image
    formData.append("pageImage", data.pageImage);

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("SUCCESS:", result);
    } catch (err) {
      console.error("ERROR:", err);
    }
  };
  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <h1 className="h4 card-title mb-0">Create a page</h1>
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
              {preview ? (
                <img
                  src={preview}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
              ]}
            />
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
            <Button variant="primary" type="submit" className="mb-0">
              Create a page
            </Button>
          </Col>
        </form>
      </CardBody>
    </Card>
  );
};
export default CreatePageForm;
