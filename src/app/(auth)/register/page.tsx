import SignUpForm from "@/components/forms/SingUpForm"

export const dynamic = 'force-dynamic'

export default function SignupPage() {
    return (
        <div className="flex items-center justify-center flex-col w-11/12 md:w-96 mx-auto mt-20 gap-4 mb-20">
            <h1 className="font-bold text-2xl">Rejestracja:</h1>
            <SignUpForm/>
        </div>
    )
}