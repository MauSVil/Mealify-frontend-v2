import SignUpForm from "@/components/signup-form";
import { GalleryVerticalEnd } from "lucide-react";

const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10 w-full h-screen bg-muted">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUpPage;