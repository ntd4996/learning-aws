"use client";
import React, { Fragment, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LOGIN = {
  MIN_LENGTH_ID: 1,
  MAX_LENGTH_ID: 50,
  MIN_LENGTH_PASSWORD: 1,
  MAX_LENGTH_PASSWORD: 255,
  MESSAGE_REQUIRED_ID: "Email is required",
  MESSAGE_REQUIRED_PASSWORD: "Password is required",
  MESSAGE_LOGIN_FAILED: "Email or password is incorrect",
  MESSAGE_INVALID_EMAIL: "Invalid email address",
};

const schemaLogin = z.object({
  email: z
    .string()
    .min(LOGIN.MIN_LENGTH_ID, {
      message: LOGIN.MESSAGE_REQUIRED_ID,
    })
    .email(LOGIN.MESSAGE_INVALID_EMAIL),
  password: z.string().min(LOGIN.MIN_LENGTH_PASSWORD, {
    message: LOGIN.MESSAGE_REQUIRED_PASSWORD,
  }),
});
type IFormLogin = z.infer<typeof schemaLogin>;

const LoginForm = () => {
  const { push } = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<IFormLogin>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schemaLogin),
    mode: "all",
  });

  const onSubmit = async (data: IFormLogin) => {
    console.log(data);
    await login(data);
  };

  const {
    mutate: login,
    isPending,
    data: dataLogin,
  } = useMutation({
    mutationFn: async (data: object) => {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      return result;
    },
  });

  useEffect(() => {
    if (dataLogin?.ok) {
      push("/board");
    }
    if (dataLogin?.error) {
      toast.error(LOGIN.MESSAGE_LOGIN_FAILED);
    }
  }, [dataLogin, push]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Không Nest thì Next!
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    {...field}
                    className={`w-full px-3 py-2 border ${
                      !!fieldState.error ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Enter your email"
                    list="email-suggestions"
                  />
                  <AnimatePresence>
                    {!!fieldState.error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {fieldState.error?.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Fragment>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className={`w-full px-3 py-2 border ${
                          !!fieldState.error
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {!!fieldState.error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {fieldState.error.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </Fragment>
                )}
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full cursor-pointer bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-300"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
