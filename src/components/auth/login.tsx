import { Key, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";

// Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Type for login form
type LoginFormData = z.infer<typeof loginSchema>;

interface SignInFormProps {
  onSubmit?: (email: string, password: string) => void;
  isLoading?: boolean;
}

// Sign In Form Component
const SignInForm = ({ onSubmit, isLoading = false }: SignInFormProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = (data: LoginFormData) => {
    if (onSubmit) {
      onSubmit(data.email, data.password);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <div
          className={`flex items-center border rounded-md overflow-hidden ${
            errors.email ? "border-red-500" : ""
          } focus-within:ring-1 focus-within:ring-primary`}
        >
          <span className="px-3 py-2 border-r">
            <Mail size={16} className="text-muted-foreground" />
          </span>
          <input
            id="email"
            type="email"
            className="w-full p-2 text-sm outline-none bg-transparent"
            placeholder={t("auth.common.email")}
            {...register("email")}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">
            {t("auth.validation.email_invalid")}
          </p>
        )}
      </div>

      <div>
        <div
          className={`flex items-center border rounded-md overflow-hidden ${
            errors.password ? "border-red-500" : ""
          } focus-within:ring-1 focus-within:ring-primary`}
        >
          <span className="px-3 py-2 border-r">
            <Key size={16} className="text-muted-foreground" />
          </span>
          <input
            id="password"
            type="password"
            className="w-full p-2 text-sm outline-none bg-transparent"
            placeholder={t("auth.common.password")}
            {...register("password")}
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">
            {t("auth.validation.password_min")}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center space-x-1.5"></div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground p-2.5 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? t("auth.common.signing_in") : t("auth.common.sign_in")}
      </button>
    </form>
  );
};

export default SignInForm;
