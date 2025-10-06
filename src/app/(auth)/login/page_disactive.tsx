import LoginForm from "@/components/forms/SignInForm";

// interface Props {
//   searchParams: Promise<{
//     callbackUrl?: string;
//   }>;
// }

export default async function SigninPage() {

  return (
    <div className="flex items-center justify-center flex-col w-11/12 md:w-96 mx-auto mt-40 gap-4 mb-20">
      <h1 className="font-bold text-2xl">Logowanie:</h1>
      <LoginForm />
    </div>
  );
};