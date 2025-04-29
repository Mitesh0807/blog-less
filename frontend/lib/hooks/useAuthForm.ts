import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authApi } from "@/app/api";
import { getErrorMessage } from "@/lib/types/errors";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type FormValues = LoginFormValues | RegisterFormValues;

interface UseAuthFormProps {
  type: "login" | "register";
  redirectUrl?: string;
}

export function useAuthForm({ type, redirectUrl = "/" }: UseAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const formSchema = type === "login" ? loginSchema : registerSchema;
  const defaultValues =
    type === "login"
      ? ({ email: "", password: "" } as LoginFormValues)
      : ({
          name: "",
          username: "",
          email: "",
          password: "",
        } as RegisterFormValues);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setError(null);

    try {
      if (type === "login") {
        await authApi.login(data);
      } else {
        const registerData = data as RegisterFormValues;
        await authApi.register({
          email: registerData.email,
          password: registerData.password,
          username: registerData.username,
          name: registerData.name,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      console.error("Auth error:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    type,
  };
}
