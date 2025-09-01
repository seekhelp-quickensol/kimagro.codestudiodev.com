import { useState } from "react";
import ComponentCard from "./../common/ComponentCard";
import Label from "../form/Label";
import { submitDesignationForm } from "../../components/services/serviceApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { designationSchema } from "../../validations/validationSchema";

import DesignationList from "./DesignationList";
import NewInput from "../../components/form/input/NewInputField";

import { useNavigate, useParams } from "react-router";
import useDesignationById from "../../hooks/useDesignationById";
import toast from "react-hot-toast";

export default function DesignationMaster() {
  const { id } = useParams();
 
  const navigator = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(designationSchema),
    defaultValues: {
      designation_name: "",
    },
  });

  const {title} = useDesignationById(reset);

  const onSubmit = async (data: any) => {
    //  setLoading(true);
    try {
      const formData = new FormData();
      formData.append("designation_name", data.designation_name);
      const method = id ? "put" : "post";
      const response = await submitDesignationForm(
        id ?? null,
        formData,
        method
      );
      const { success, message } = response.data;
      success ? toast.success(`${message}`) : toast.error( `${message}`);

      if (success) {
        reset({
          designation_name: "",
        });
        
        navigator("/designation-master");
        setRefresh(!refresh);
      }
      else{
        toast.error(`Error: ${message}`);
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
    } finally {
     
      // setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <ComponentCard title="Designation Master" desc={title}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            {/* Designation Name */}
            <div className="col-span-12 md:col-span-6">
              <Label>
                Designation Name{" "}<span className="text-red-500">*</span>
              </Label>
              <NewInput
                name="designation_name"
                type="text"
                placeholder="Enter Designation Name"
                className="w-full"
                register={register}
                errors={errors}
              />
            </div>

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

      {/* Table */}
      <div className="p-4 bg-white rounded-xl shadow">
        <DesignationList
          refresh={refresh}
          setRefresh={setRefresh}
       
        />
      </div>
    </div>
  );
}
