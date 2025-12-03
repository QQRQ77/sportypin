import { CreateAthlete } from "@/types"
import Image from "next/image";
import Link from "next/link";

interface SmallAthleteCardProps {
  athlete: CreateAthlete
}

export default function AthleteCardSmall({ athlete }: SmallAthleteCardProps) {

  return (
    <>
      <Link 
        href={`/athlete/${athlete.id}`}
        className="cursor-pointer"
        >
        <div className="border-4 border-orange-700 rounded-xl shadow-md flex flex-col items-center overflow-hidden bg-orange-600 relative">
          <Image
            src={athlete.imageUrls && athlete.imageUrls[0] || "/images/logo_athlete.png"}
            alt={`${athlete.first_name} ${athlete.last_name ? athlete.last_name : ""}`}
            width={200}
            height={200}
            className="object-contain"
          />
          <div className="w-full bg-orange-700 bg-opacity-60 text-white p-4 text-center flex flex-col justify-center items-center gap-3">
            <h2 className="text-2xl font-bold">{athlete.first_name} {athlete.last_name}</h2>
            <h2 className="text-xl font-medium">{athlete.birth_year}</h2>
            <div className="flex justify-center items-center gap-4">
                <Image
                  src={athlete.home_team_logo_URL && athlete.home_team_logo_URL[0] || "/images/logo_team.png"}
                  alt={`${athlete.home_team_name} logo`}
                  width={50}
                  height={50}
                  className={`object-contain rounded-xl`}
                />
              <h2 className="text-xl font-bold">{athlete.home_team_name}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {athlete.sports && athlete.sports.map((sport: string, idx: number) => (
                <div key={idx} className="flex items-center bg-orange-600 px-2 py-1 rounded">
                  {sport}              
                </div>
              ))}
            </div>   
            <div className="flex flex-wrap gap-2">
              {athlete.cathegories && athlete.cathegories.map((cathegory: string, idx: number) => (
                <div key={idx} className="flex items-center bg-orange-800 px-2 py-1 rounded">
                  {cathegory}              
                </div>
              ))}
            </div>       
          </div>
        </div>
      </Link>
    </>
  )
}