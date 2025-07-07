import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center flex-col w-11/12 mx-auto mt-20 gap-4 mb-20">
      <SignIn />
    </div>
  )
}