import Image from "next/image";

export default async function Page() {
  return (
      <main className="flex items-center justify-center flex-col w-11/12 mx-auto mt-10 gap-4 mb-20">
        <Image
          src="/images/logo_place.png"
          alt="Sport Venues Logo"
          width={500}
          height={500}
        />
        <h1>OBIEKTY SPORTOWE</h1>
        <p className="text-lg">Lista obiektów sportowych</p>
      </main>
  )
}