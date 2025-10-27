import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  // UserButton,
} from '@clerk/nextjs'
import Image from "next/image";
import Link from 'next/link';
import UserMenu from './UserMenu';

const size = 60; // Size for the logos

export default function NavItems() {
  return (
    <nav className="flex items-center gap-6">
      <Link href="/events" className='flex items-center gap-2 border rounded-lg hover:bg-gray-100 transition-colors'>
        <Image
          src="/images/logo_events.png"
          alt="Sport Event Logo"
          width={size}
          height={size}
        />
        <p className='hidden sm:block text-lg font-semibold underline mr-3'>Wydarzenia</p>
      </Link>
      <Link href="/venue" className='flex items-center gap-2 border rounded-lg hover:bg-gray-100 transition-colors'>
        <Image
          src="/images/logo_place.png"
          alt="Sport Places Logo"
          width={size}
          height={size}
        />
        <p className='hidden sm:block text-lg font-semibold underline mr-3'>Obiekty</p>
      </Link>
      <Link href="/teams" className='flex items-center gap-2 border rounded-lg hover:bg-gray-100 transition-colors'>
        <Image
          src="/images/logo_team.png"
          alt="Sport Teams Logo"
          width={size}
          height={size}
        />
        <p className='hidden sm:block text-lg font-semibold underline mr-3'>Zespoły</p>
      </Link>
      <Link href="/athlete" className='flex items-center gap-2 border rounded-lg hover:bg-gray-100 transition-colors'>
        <Image
          src="/images/logo_athlete.png"
          alt="Sport Athlete Logo"
          width={size}
          height={size}
        />
        <p className='hidden sm:block text-lg font-semibold underline mr-3'>Zawodnicy</p>
      </Link>
      <SignedOut>
        <SignInButton >
          <button className="bg-amber-600 text-white rounded-lg font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Zaloguj się
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="bg-red-700 text-white rounded-lg font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Zarejestruj się
          </button>
        </SignUpButton>
      </SignedOut>
       <SignedIn>
        <UserMenu />
        {/* <UserButton /> */}
      </SignedIn>
    </nav>
  );
}