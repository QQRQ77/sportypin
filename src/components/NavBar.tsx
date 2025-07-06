import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between mx-auto w-full px-14 py-4 bg-white max-sm:px-4 border-b-2">
      <Link href="/" className="">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image
            src="/images/logo.png"
            alt="SportyPin Logo"
            width={40}
            height={40}
          />
          <p className="font-bold text-3xl">SportPin</p>
        </div> 
      </Link>
      <NavItems />
    </nav>
  );
}