import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function NavItems() {
  return (
    <nav className="flex items-center gap-6">
      <SignedOut>
        <SignInButton >
          <button className="bg-[#184217] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Zaloguj się
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Zarejestruj się
          </button>
        </SignUpButton>
      </SignedOut>
       <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}