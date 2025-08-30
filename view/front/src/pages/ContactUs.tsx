import { Contact } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { submitContactForm } from "../services/service";

// Define the form data interface
interface ContactFormData {
  name: string;
  email: string;
  mobile: string;
  company: string;
  title: string;
  message: string;
}

// Yup validation schema
const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .min(10, "Mobile number must be at least 10 digits"),
  company: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters"),
  title: yup
    .string()
    .required("Job title is required")
    .min(2, "Job title must be at least 2 characters"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters"),
});

export default function ContactForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
  }>({ type: null});

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange", // Validate on change for better UX
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null });

    try {
      // Replace this with your actual API call
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("company", data.company);
      formData.append("title", data.title);
      formData.append("message", data.message);
      const response = await submitContactForm(formData);
      const result = response.data;

      if (!result || !result.success) {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus({
        type: "success",
      
      });
      reset(); // Clear the form
    } catch (error) {
      setSubmitStatus({
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus({ type: null }); // Reset status after 5 seconds
      }
      , 5000); // Adjust the timeout as needed
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white md:flex md:rounded-lg md:overflow-hidden">
        {/* Left: Contact Info (only side-by-side on desktop) */}
        <div className="hidden md:flex flex-col justify-center bg-[#e3ecde] p-8 w-1/3 space-y-6">
          <div className="mb-6">
            <div className="flex items-center flex-col gap-3">
              <div className="bg-[#4b8b3b] p-5 rounded-full">
                <MdEmail size={20} className="text-white" />
              </div>
              <span className="text-gray-700">info@kimeya.in</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center flex-col gap-3">
              <div className="bg-[#4b8b3b] p-5 rounded-full">
                <MdPhone size={20} className="text-white" />
              </div>
              <span className="text-gray-700">
                +91 7883 53 98 48 &nbsp; | &nbsp; +91 9244 12 17 90
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-[#4b8b3b] p-5 rounded-full">
                <MdLocationOn size={20} className="text-white" />
              </div>
              <p className="text-gray-700 leading-relaxed text-center">
                <Trans
                  i18nKey="contactPage.address"
                  components={{
                    br: <br />
                  }}
                />
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-2/3 border border-[#CFF24D] p-8">
          <h2 className="text-[#4B8B3B] text-2xl font-bold mb-6">
            {t("contactPage.title")}
          </h2>

          {/* Status Message */}
          {submitStatus.type && (
            <div
              className={`mb-4 p-3 rounded ${submitStatus.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
                }`}
            >
              {submitStatus.type === "success" ? (
                <p>{t("contactPage.thankYouMessage")}</p>
              ) : submitStatus.type === "error" ? (
                <p>{t("contactPage.errorMessage")}</p>
              ) : null
              }
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <input
                {...register("name")}
                type="text"
                placeholder={t("contactPage.form.namePlaceholder")}
                className={`w-full border-b focus:outline-none py-2 text-gray-700 placeholder-gray-500 ${errors.name ? "border-red-500" : "border-[#CFF24D]"
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                placeholder={t("contactPage.form.emailPlaceholder")}
                className={`w-full border-b focus:outline-none py-2 text-gray-700 placeholder-gray-500 ${errors.email ? "border-red-500" : "border-[#CFF24D]"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("mobile")}
                type="tel"
                placeholder={t("contactPage.form.mobilePlaceholder")}
                className={`w-full border-b focus:outline-none py-2 text-gray-700 placeholder-gray-500 ${errors.mobile ? "border-red-500" : "border-[#CFF24D]"
                  }`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("company")}
                type="text"
                placeholder={t("contactPage.form.companyPlaceholder")}
                className={`w-full border-b focus:outline-none py-2 text-gray-700 placeholder-gray-500 ${errors.company ? "border-red-500" : "border-[#CFF24D]"
                  }`}
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("title")}
                type="text"
                placeholder={t("contactPage.form.titlePlaceholder")}
                className={`w-full border-b focus:outline-none py-2 text-gray-700 placeholder-gray-500 ${errors.title ? "border-red-500" : "border-[#CFF24D]"
                  }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <textarea
                {...register("message")}
                placeholder={t("contactPage.form.messagePlaceholder")}
                rows={4}
                className={`w-full border-b focus:outline-none py-2 text-gray-700 placeholder-gray-500 resize-none ${errors.message ? "border-red-500" : "border-[#CFF24D]"
                  }`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`px-6 py-2 text-sm font-semibold rounded-[3px] transition-colors ${isSubmitting || !isValid
                  ? "bg-[#d9efcc] text-gray-600 cursor-not-allowed"
                  : "bg-[#4b8b3b] text-white hover:bg-[#7EB33E]"
                }`}
            >
              {isSubmitting
                ? "Submitting..."
                : t("contactPage.form.submitButton")}
            </button>
          </form>

          {/* Mobile Contact Info (only shows on small screens) */}
          <div className="mt-10 space-y-4 md:hidden">
            <div className="flex items-center gap-3">
              <div className="bg-[#CFF24D] p-2 rounded-full">
                <MdEmail size={18} />
              </div>
              <span className="text-gray-800">info@kimeya.in</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#CFF24D] p-2 rounded-full">
                <MdPhone size={18} />
              </div>
              <span className="text-gray-800">
                +91 7883 53 98 48 &nbsp; | &nbsp; +91 9244 12 17 90
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}