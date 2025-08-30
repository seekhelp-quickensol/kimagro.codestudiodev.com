import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Alert from "../../components/Alert";
import { adminLogin } from "../../features/auth/authSlice";
import type { AppDispatch, RootState } from "../../features/auth/store";
import {
  loginSchema,
  LoginFormValues,
} from "../../validations/validationSchema";


export default function SignInForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
   const isAuthenticated = useSelector(
     (state: RootState) => state.auth.isAuthenticated
   );

   if(isAuthenticated){
    navigate("/home");
   }


  const [message, setMessage] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result = await dispatch(adminLogin(data));
    if ("error" in result) {
      setMessage("Error: " + (result.error?.message || "Login failed"));
    } else {
      setMessage("Login successful!");
      navigate("/home");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="sign-form">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          {message && <Alert message={message} />}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <input
                  type="text"
                  placeholder="info@gmail.com"
                  {...register("email")}
                  className="lowercase h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
                {errors.email && (
                  <p className="text-error-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
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
                {errors.password && (
                  <p className="text-error-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Button className="w-full btn-sign-in" size="sm">
                  Sign in
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
