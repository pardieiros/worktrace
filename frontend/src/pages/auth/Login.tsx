import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

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
          <img src={cover} alt="Worktrace" className="mx-auto h-12 w-auto" />
          <h1 className="mt-4 text-2xl font-semibold text-text">Entrar na plataforma</h1>
          <p className="text-sm text-primary/80">Controle de horas e transparência num só painel.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4" aria-label="Formulário de login">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@worktrace.demo"
              {...register("email", { required: "Email é obrigatório." })}
            />
            {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password", { required: "Password é obrigatória." })}
            />
            {errors.password && <p className="text-sm text-danger">{errors.password.message}</p>}
          </div>
          {authError && <div className="rounded-md bg-danger/10 p-3 text-sm text-danger">{authError}</div>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "A autenticar..." : "Entrar"}
          </Button>
        </form>
        <p className="text-center text-xs text-primary/70">
          Cookies HttpOnly + CSRF protegem o seu acesso. Para suporte contacte support@worktrace.app.
        </p>
      </Card>
    </div>
  );
}

