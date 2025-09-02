import { useState, useEffect } from "react";
import ComponentCard from "./../common/ComponentCard";
import Label from "../form/Label";
import { SKUSchema } from "../../validations/validationSchema";
import {
  getSKUById,
  submitSKUForm,
  checkeQuantityUnique,
} from "../services/serviceApi";
import Modal from "react-modal";
import NewInput from "../form/input/NewInputField";
import ControlledSelect from "../form/ControlledSelect";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useUniqueValidation } from "../../hooks/useUniqueValidation";
import SKUList from "./SKUList";
import toast from "react-hot-toast";

interface SKUFormValues {
  quantity: string;
  unit: string;
}

export default function SkuPage() {
  const options = [
    { value: "", label: "Select Unit" },
    { value: "kg", label: "Kg" },
    { value: "gram", label: "Gram" },
    { value: "milliliter", label: "Milliliter" },
    { value: "liter", label: "Liter" },
  ];
  const [refresh, setRefresh] = useState(false);
  const [title, setTitle] = useState<string>("Add SKU Master");

  Modal.setAppElement("#root");

  const navigate = useNavigate();

  const { id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(SKUSchema),
  });

  const resetForm = () => {
    reset({
      quantity: "",
      unit: "",
    });
  };

  const quantityInput = watch("quantity");
  const unitInput = watch("unit");
  const checkQuantityUnitUnique = async (quantity: string, currentId: string | null = null): Promise<boolean> => {
    try {
      // Get current unit value
      const currentUnit = unitInput || "";
      // Skip validation if either quantity or unit is missing
      if (!quantity || !currentUnit) {
        return true;
      }
      // Call your API with both quantity and unit
      return await checkeQuantityUnique(quantity.trim(), currentUnit, currentId);
    } catch (error) {
      console.error('Error checking SKU uniqueness:', error);
      return true;
    }
  };

  const { validateUnique, isValidating, isUnique, resetValidation } =
    useUniqueValidation({
      checkUnique: checkQuantityUnitUnique,
      debounceMs: 300,
      minLength: 2,
      errorMessage: "This quantity is already added",
      currentId: id || null,
      
    });
  
  useEffect(() => {
    resetValidation();
  }, [id, resetValidation]);

  // Validate when either quantity or unit changes
  useEffect(() => {
    if (quantityInput && quantityInput.trim().length >= 1 && unitInput) {
      validateUnique(quantityInput);
    } else {
      resetValidation();
    }
  }, [quantityInput, unitInput, validateUnique, resetValidation]);

  const getInputState = () => {
    if (isValidating) return "loading";
    if (errors.quantity) return "error";
    if (isUnique === false) return "error";
    if (isUnique === true && quantityInput && quantityInput.trim().length >= 1 && unitInput)
      return "success";
    return "default";
  };

  const getInputHint = () => {
    if (isValidating) return "Checking availability...";
    if (errors.quantity) return undefined;
    if (isUnique === false) return "This quantity and unit combination already exists";
    if (isUnique === true && quantityInput && quantityInput.trim().length >= 1 && unitInput) {
      return "SKU combination is available";
    }
    return "";
  };
  useEffect(() => {
    if (quantityInput && quantityInput.trim().length >= 1 && unitInput) {
      resetValidation();
      setTimeout(() => {
        validateUnique(quantityInput);
      }, 10);
    }
  }, [unitInput]);

  const onSubmit = async (data: SKUFormValues) => {
    try {
      const isUnique = await checkQuantityUnitUnique(data.quantity.trim(), id || null);
      
      if (!isUnique) {
        return;
      }

      const formData = new FormData();
      formData.append("quantity", data.quantity);
      formData.append("unit", data.unit);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const method = id ? "put" : "post";
      const response = await submitSKUForm(id ?? null, formData, method);
      const { success, message } = response.data;
      success ? toast.success(`${message}`) : toast.error(`${message}`);
      if (success) {
        resetForm();
        navigate("/add-sku-master");
        setRefresh(!refresh);
      } else {
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
    }
  };
  useEffect(() => {
    if (id) {
      setTitle("Update SKU Master");
      getSKUById(id)
        .then((res) => {
          const data = res.data.data;
          reset({
            quantity: data.quantity,
            unit: data.unit,
          });
        })
        .catch(() => toast.error(" Error fetching SKU data"));
    } else {
      setTitle("Add SKU Master");
    }
  }, [id, reset]);

  return (
    <div className="space-y-6">
      <ComponentCard title="SKU Master" desc={title}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          name="add_sku_form"
          id="add_sku_form">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <Label>
                Quantity <span className="text-red-500">*</span>
              </Label>
              <NewInput
                name="quantity"
                type="number"
                placeholder="Enter value"
                className="w-full"
                register={register}
                errors={errors}
                min={0}
                success={getInputState() === "success"}
                hint={getInputHint()}
              />
              
            </div>
            <div className="col-span-12 md:col-span-6 relative">
              <Label>
                Unit <span className="text-red-500">*</span>
              </Label>
              <ControlledSelect
                name="unit"
                control={control}
                errors={errors}
                options={options}
                placeholder="Select Unit"
              />
            </div>
            <div className="col-span-12">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                // disabled={isSubmitting}>
              >
                {/* {loading ? "Submitting..." : "Submit"} */}
                Submit
              </button>
            </div>
          </div>
        </form>
      </ComponentCard>
      <div className="p-4 bg-white rounded-xl shadow">
        <SKUList refresh={refresh} setRefresh={setRefresh} />
      </div>
    </div>
  );
}
