'use client';

import { cn } from "@/lib/utils";
import { useSignUp } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { SignUpConfirmationModal } from "./modals/SignUpConfirmation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useApi } from "../../lib/api";

interface Props {
  className?: string
}

const SignUpForm = (props: Props) => {
  const { className } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const api = useApi();
  const router = useRouter();

  const { isLoaded, signUp, setActive } = useSignUp();

  const onValidate = async (value: string) => {
    if (!isLoaded) return;

    const completeSignUp = await signUp.attemptEmailAddressVerification({ code: value });

    if (completeSignUp.status === 'complete') {
      setActive({ session: completeSignUp.createdSessionId });
      await api.post('/auth/register', { role: 'admin', email, clerk_user_id: completeSignUp.createdUserId, stripe_status: 'error' });
      router.push('/onboarding/general');
    } else {
      toast.error('Código de verificación incorrecto.');
    }

  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification();
      await SignUpConfirmationModal({ onValidate });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea una cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@ejemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Registrarse
                </Button>
              </div>
              <div className="text-center text-sm">
                Ya tienes cuenta?{" "}
                <a href="#" className="underline underline-offset-4">
                  Inicia sesión
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpForm