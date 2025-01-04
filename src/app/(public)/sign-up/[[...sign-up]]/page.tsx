import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex justify-center flex-1 w-full items-center">
      <SignUp />
    </div>
  );
}

export default SignUpPage;