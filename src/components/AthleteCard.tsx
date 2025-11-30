import { CreateAthlete } from "@/types"
import Image from "next/image";

interface AthleteCardProps {
  athlete: CreateAthlete;
  teamLogoURL?: string | null;
}

export default function AthleteCard({ athlete, teamLogoURL }: AthleteCardProps) {
 
  return (
    <>
      <div className="h-[500px] border-4 border-orange-700 rounded-xl shadow-md flex flex-col items-center overflow-hidden bg-cyan-400 relative">
        <Image
          src={athlete.imageUrls ? athlete.imageUrls[0] : "/images/athlete_avatar2.jpeg"}
          alt={`${athlete.first_name} ${athlete.last_name ? athlete.last_name : ""}`}
          width={384}
          height={500}
          className="object-contain"
        />
        <div className="absolute bottom-0 w-full bg-orange-700 bg-opacity-60 text-white p-4 text-center flex flex-col justify-center items-center gap-3">
          <h2 className="text-2xl font-bold">{athlete.first_name} {athlete.last_name}</h2>
          <h2 className="text-xl font-medium">{athlete.birth_year}</h2>
          <div className="flex justify-center items-center gap-4">
            {teamLogoURL && 
              <Image
                src={teamLogoURL}
                alt={`${athlete.home_team_name} logo`}
                width={50}
                height={50}
                className="object-contain rounded-full border-2 border-white"
              />
            }
            <h2 className="text-xl font-bold">{athlete.home_team_name}</h2>
          </div>
        </div>
      </div>
    </>

  )
}