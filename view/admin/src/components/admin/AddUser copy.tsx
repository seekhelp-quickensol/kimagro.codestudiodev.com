import ComponentCard from "./../common/ComponentCard";
import Label from "../form/Label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../validations/validationSchema";
import NewInput from "../form/input/NewInputField";
import ControlledSelect from "../form/ControlledSelect";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import {
  getAllDepartments,
  getAllDesignations,
  submitUserForm,
  checkEmailIdUnique,
} from "../services/serviceApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import useFetchUserById from "../../hooks/useUserById";
import toast from "react-hot-toast";
import { useUniqueValidation } from "../../hooks/useUniqueValidation";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  // Define department and designation options
  const [departmentOptions, setDepartmentOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [designationOptions, setDesignationOptions] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await getAllDepartments();
      const departmentData = response.data.data;

      setDepartmentOptions([
        {
          value: 0,
          label: "Select Department",
        },
        ...departmentData.map((dept: any) => ({
          value: dept.id,
          label: dept.department_name,
        })),
      ]);
    };

    const fetchDesignations = async () => {
      const response = await getAllDesignations();
      const designationData = response.data.data;

      setDesignationOptions([
        {
          value: 0,
          label: "Select Designation",
        },
        ...designationData.map((desig: any) => ({
          value: desig.id,
          label: desig.designation_name,
        })),
      ]);
    };

    fetchDesignations();
    fetchDepartments();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
      department_id: 0,
      designation_id: 0,
    },
  });

  const { title } = useFetchUserById(reset);

  const emailId = watch("email");

  // Set up unique validation hook
  const { validateUnique, isValidating, isUnique, resetValidation } =
    useUniqueValidation({
      checkUnique: checkEmailIdUnique,
      debounceMs: 300,
      minLength: 2,
      errorMessage: "This email already exists",
      currentId: id || null,
    });

  // Reset validation when component unmounts or ID changes
  useEffect(() => {
    resetValidation();
  }, [id, resetValidation]);

  // Validate uniqueness when department name changes
  useEffect(() => {
    if (emailId && emailId.trim().length >= 2) {
      validateUnique(emailId);
    } else {
      resetValidation();
    }
  }, [emailId, validateUnique, resetValidation]);
  const getInputState = () => {
    if (isValidating) return "loading";
    if (errors.email) return "error";
    if (isUnique === false) return "error";
    if (isUnique === true && emailId && emailId.trim().length >= 2)
      return "success";
    return "default";
  };

  const getInputHint = () => {
    if (isValidating) return "Checking availability...";
    if (errors.email) return undefined;
    if (isUnique === false) return "This email name is already taken";
    if (isUnique === true && emailId && emailId.trim().length >= 2) {
      return "Department name is available";
    }
    return "";
  };

  const onSubmit = async (data: any) => {
    //  setLoading(true);
    try {
      const isNameUnique = await checkEmailIdUnique(
        data.emailId,
        id || null
      );

      if (!isNameUnique) {
        return;
      }
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("middle_name", data.middle_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("department_id", data.department_id);
      formData.append("designation_id", data.designation_id);

      const method = id ? "put" : "post";
      const response = await submitUserForm(id ?? null, formData, method);
      const { success, message } = response.data;
      success ? toast.success(`${message}`) : toast.error(`${message}`);

      if (success) {
        reset();
        navigate("/user-list");
      }
    } catch (err) {
      let msg = "An unexpected error occurred";

      if (err instanceof Error) {
        msg = err.message;
      }
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response: { data: { message: string } } };
        msg = axiosErr.response?.data?.message || msg;
      }
      reset();
      toast.error(`Error: ${msg}`);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <ComponentCard title="User Management " desc={title}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-6">
          {/* First Name */}
          <div className="col-span-12 md:col-span-4">
            <Label>
              First Name<span className="text-red-500">*</span>
            </Label>
            <NewInput
              name="first_name"
              type="text"
              placeholder="Enter First Name"
              className="w-full"
              register={register}
              errors={errors}
            />
          </div>

          {/* Middle Name */}
          <div className="col-span-12 md:col-span-4">
            <Label>
              Middle Name<span className="text-red-500">*</span>
            </Label>

            <NewInput
              name="middle_name"
              type="text"
              placeholder="Enter Middle Name"
              className="w-full"
              register={register}
              errors={errors}
            />
          </div>

          {/* Last Name */}
          <div className="col-span-12 md:col-span-4">
            <Label>
              Last Name<span className="text-red-500">*</span>
            </Label>
            <NewInput
              name="last_name"
              type="text"
              placeholder="Enter Last Name"
              className="w-full"
              register={register}
              errors={errors}
            />
          </div>

          {/* Department */}
          <div className="col-span-12 md:col-span-6">
            <Label>
              Department<span className="text-red-500">*</span>
            </Label>
            <ControlledSelect
              name="department_id"
              control={control}
              errors={errors}
              options={departmentOptions}
              placeholder="Select Department"
              castToNumber
            />
          </div>

          {/* Designation */}
          <div className="col-span-12 md:col-span-6">
            <Label>
              Designation<span className="text-red-500">*</span>
            </Label>
            <ControlledSelect
              name="designation_id"
              control={control}
              errors={errors}
              options={designationOptions}
              placeholder="Select Designation"
              castToNumber
            />
          </div>

          {/* Email */}
          <div className="col-span-12 md:col-span-6">
            <Label>
              Email<span className="text-red-500">*</span>
            </Label>
            <NewInput
              name="email"
              type="text"
              placeholder="Enter Email"
              className="w-full"
              register={register}
              errors={errors}
              success={getInputState() === "success"}
              hint={getInputHint()}
        
            />
          </div>

          {/* Username */}
          <div className="col-span-12 md:col-span-6">
            <Label>
              Username<span className="text-red-500">*</span>
            </Label>
            <NewInput
              name="username"
              type="text"
              placeholder="Enter Username"
              className="w-full"
              register={register}
              errors={errors}
            />
          </div>

          {!id && (
            <div className="col-span-12 md:col-span-6 relative">
              <Label htmlFor="password">
                Password<span className="text-red-500">*</span>
              </Label>
              <NewInput
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full"
                register={register}
                errors={errors}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-[3rem] -translate-y-1/2 p-1 focus:outline-none"
                aria-label={
                  passwordVisible ? "Hide password" : "Show password"
                }>
                {passwordVisible ? (
                  <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                )}
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="col-span-12">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Submit
            </button>
          </div>
        </div>
      </form>
    </ComponentCard>
  );
}
