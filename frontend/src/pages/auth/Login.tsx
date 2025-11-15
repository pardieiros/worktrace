import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import cover from "@assets/worktrace_logo_with_text.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      const redirectTo = (location.state as any)?.from?.pathname ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      // handled by store error state
    } finally {
      setSubmitting(false);
    }
  });

  const authError = useAuthStore((state) => state.error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md space-y-6">
        <div className="text-center">
          <img src={cover} alt={t("common.appName")} className="mx-auto h-32 w-auto md:h-20" />
          <h1 className="mt-4 text-2xl font-semibold text-text">{t("login.title")}</h1>
          <p className="text-sm text-primary/80">{t("login.subtitle")}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4" aria-label={t("login.formAriaLabel")}>
          <div className="space-y-2">
            <Label htmlFor="email">{t("login.fields.email.label")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("login.fields.email.placeholder")}
              {...register("email", { required: t("login.errors.emailRequired") })}
            />
            {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("login.fields.password.label")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("login.fields.password.placeholder")}
              {...register("password", { required: t("login.errors.passwordRequired") })}
            />
            {errors.password && <p className="text-sm text-danger">{errors.password.message}</p>}
          </div>
          {authError && <div className="rounded-md bg-danger/10 p-3 text-sm text-danger">{authError}</div>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("login.actions.authenticating") : t("login.actions.submit")}
          </Button>
        </form>
        <p className="text-center text-xs text-primary/70">{t("login.securityNote")}</p>
      </Card>
    </div>
  );
}

