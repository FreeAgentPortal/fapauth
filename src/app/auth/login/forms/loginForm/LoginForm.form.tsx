"use client";

import { useForm } from "react-hook-form";
import styles from "./LoginForm.module.scss";
import { useState } from "react";
import useApiHook from "@/state/useApi";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { mutate: login } = useApiHook({
    method: "POST",
    key: "login",
  }) as any;


  const onSubmit = (data: LoginFormData) => {
    console.log("Login Data:", data);
    login({
      url: "/auth/login",
      data,
      onSuccess: (response: any) => {
        console.log("Login successful:", response);
        // Handle successful login, e.g., redirect or show a success message
      },
      onError: (error: any) => {
        console.error("Login failed:", error);
        // Handle login error, e.g., show an error message
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="you@example.com"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <div className={styles.passwordInput}>
          <input
            type={"password"}
            id="password"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
          /> 
        </div>
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
      </div>

      <button type="submit" className={styles.submitButton}>
        Log In
      </button>
    </form>
  );
}
