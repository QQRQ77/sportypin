import Image from "next/image";

export default async function Page() {
  return (
    <main className="container min-h-[100vh-96px] bg-gray-400">
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src="/images/logo_place.png"
          alt="Sport Venues Logo"
          width={500}
          height={500}
        />
        <h1>OBIEKTY SPORTOWE</h1>
      </div>
    </main>
  )
}