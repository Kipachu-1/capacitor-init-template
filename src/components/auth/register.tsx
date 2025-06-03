
import { Key, User, Mail } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils";
import { useTranslation } from "react-i18next";
import TermsOfUse from "../common/terms-of-use";
import PrivacyPolicy from "../common/privacy-policy";

// Define the validation schema using Zod
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type for registration form
type RegisterFormData = z.infer<typeof registerSchema>;

interface SignUpFormProps {
  onSubmit?: (email: string, password: string) => void;
  isLoading?: boolean;
}

// Sign Up Form Component
const SignUpForm = ({ onSubmit, isLoading = false }: SignUpFormProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false as unknown as true,
    },
  });

  const handleFormSubmit = (data: RegisterFormData) => {
    if (onSubmit) {
      onSubmit(data.email, data.password);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <div
          className={cn(
            "flex items-center border rounded-md overflow-hidden",
            errors.name && "border-red-500",
            "focus-within:ring-1 focus-within:ring-primary"
          )}
        >
          <span className="px-3 py-2 border-r">
            <User size={16} className="text-muted-foreground" />
          </span>
          <input
            id="name"
            type="text"
            className="w-full p-2 text-sm outline-none bg-transparent"
            placeholder={t("auth.signup.full_name")}
            {...register("name")}
            disabled={isLoading}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">
            {t("auth.validation.name_min")}
          </p>
        )}
      </div>

      <div>
        <div
          className={cn(
            "flex items-center border rounded-md overflow-hidden",
            errors.email && "border-red-500",
            "focus-within:ring-1 focus-within:ring-primary"
          )}
        >
          <span className="px-3 py-2 border-r">
            <Mail size={16} className="text-muted-foreground" />
          </span>
          <input
            id="signup-email"
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
          className={cn(
            "flex items-center border rounded-md overflow-hidden",
            errors.password && "border-red-500",
            "focus-within:ring-1 focus-within:ring-primary"
          )}
        >
          <span className="px-3 py-2 border-r">
            <Key size={16} className="text-muted-foreground" />
          </span>
          <input
            id="signup-password"
            type="password"
            className="w-full p-2 text-sm outline-none bg-transparent"
            placeholder={t("auth.signup.create_password")}
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

      <div>
        <div
          className={cn(
            "flex items-center border rounded-md overflow-hidden",
            errors.confirmPassword && "border-red-500",
            "focus-within:ring-1 focus-within:ring-primary"
          )}
        >
          <span className="px-3 py-2 border-r">
            <Key size={16} className="text-muted-foreground" />
          </span>
          <input
            id="confirm-password"
            type="password"
            className="w-full p-2 text-sm outline-none bg-transparent"
            placeholder={t("auth.signup.confirm_password")}
            {...register("confirmPassword")}
            disabled={isLoading}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {t("auth.validation.passwords_no_match")}
          </p>
        )}
      </div>

      <div className="flex items-start space-x-1.5 mt-1">
        <Controller
          name="terms"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="terms"
              className={cn(
                "h-3.5 w-3.5 rounded border-gray-300 mt-0.5",
                errors.terms && "border-red-500"
              )}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isLoading}
            />
          )}
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground">
          {t("auth.signup.terms_agreement")}{" "}
          <span className="text-primary">
            <TermsOfUse />
          </span>
          {t("auth.signup.and")}{" "}
          <span className="text-primary">
            <PrivacyPolicy />
          </span>
        </label>
      </div>
      {errors.terms && (
        <p className="text-red-500 text-xs mt-1">
          {t("auth.validation.terms_required")}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full bg-primary text-primary-foreground p-2.5 rounded-md font-medium text-sm",
          "hover:bg-primary/90 transition-colors",
          "disabled:opacity-70 disabled:cursor-not-allowed"
        )}
      >
        {isLoading
          ? t("auth.common.creating_account")
          : t("auth.common.create_account")}
      </button>
    </form>
  );
};

export default SignUpForm;
