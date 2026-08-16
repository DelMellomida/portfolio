import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center py-20">
      <h1 className="text-2xl">Sign in</h1>
      <p className="text-muted mt-2 text-sm">Enter the admin password to manage posts.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
