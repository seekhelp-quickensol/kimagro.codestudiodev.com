import { useEffect, useState } from "react";
import ComponentCard from "./../common/ComponentCard";
import Label from "../form/Label";
import { checkDepartmentNameUnique, submitDepartmentForm } from "../../components/services/serviceApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { departmentSchema } from "../../validations/validationSchema";

import DepartmentList from "./DepartmentList";
import NewInput from "../../components/form/input/NewInputField";

import { useNavigate, useParams } from "react-router";
import useDepartmentById from "../../hooks/useDepartmentById";
import toast from "react-hot-toast";
import { useUniqueValidation } from "../../hooks/useUniqueValidation";

export default function DepartmentMaster() {
  const { id } = useParams();
  const navigator = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(departmentSchema(id || null)),
    defaultValues: {
      department_name: "",
    },
    mode: 'onChange',
  });


  

  const {title} = useDepartmentById(reset);

  const departmentName = watch('department_name');

  // Set up unique validation hook
  const {
    validateUnique,
    isValidating,
    isUnique,
    resetValidation
  } = useUniqueValidation({
    checkUnique: checkDepartmentNameUnique,
    debounceMs: 300,
    minLength: 2,
    errorMessage: 'This department name already exists',
    currentId: id || null
  });

  // Reset validation when component unmounts or ID changes
  useEffect(() => {
    resetValidation();
  }, [id, resetValidation]);

  // Validate uniqueness when department name changes
  useEffect(() => {
    if (departmentName && departmentName.trim().length >= 2) {
      validateUnique(departmentName);
    } else {
      resetValidation();
    }
  }, [departmentName, validateUnique, resetValidation]);
  const getInputState = () => {
    if (isValidating) return 'loading';
    if (errors.department_name) return 'error';
    if (isUnique === false) return 'error';
    if (isUnique === true && departmentName && departmentName.trim().length >= 2) return 'success';
    return 'default';
  };

  const getInputHint = () => {
    if (isValidating) return 'Checking availability...';
    if (errors.department_name) return undefined; // Let error message show
    if (isUnique === false) return 'This department name is already taken';
    if (isUnique === true && departmentName && departmentName.trim().length >= 2) {
      return 'Department name is available';
    }
    return '';
  };
  const onSubmit = async (data: any) => {
    //  setLoading(true);
    try {
      const isNameUnique = await checkDepartmentNameUnique(data.department_name.trim(), id || null);
      
      if (!isNameUnique) {
        return;
      }
      const formData = new FormData();
      formData.append("department_name", data.department_name);
      const method = id ? "put" : "post";
      const response = await submitDepartmentForm(id ?? null, formData, method);
      const { success, message } = response.data;   
      success ? toast.success(`${message}`) : toast.error( `${message}`);

      if (success) {
        reset({
          department_name: "",
        });
        navigator("/department-master");
        setRefresh(!refresh);
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
      console.log(`Error: ${msg}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <ComponentCard title="Department Master" desc={title}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <Label>
                Department Name{" "}<span className="text-red-500">*</span>
              </Label>
              <NewInput
                name="department_name"
                type="text"
                placeholder="Enter Department Name"
                className="w-full"
                register={register}
                errors={errors}
                success={getInputState() === 'success'}
                hint={getInputHint()}
               
              />
            </div>
 

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

      <div className="p-4 bg-white rounded-xl shadow">
        <DepartmentList
          refresh={refresh}
          setRefresh={setRefresh}
          
        />
      </div>
    </div>
  );
}
