import { CreateAthlete } from "@/types"
import Image from "next/image";
import Link from "next/link";

interface AthleteCardProps {
  athlete: CreateAthlete;
  teamLogoURL?: string | null;
}

export default function AthleteCard({ athlete, teamLogoURL }: AthleteCardProps) {

  console.log("TeamLogoURL 222: ", teamLogoURL);
  console.log("Athlete Image: ", athlete.imageUrls);
 
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
                src={teamLogoURL || "/images/default_team_logo.jpeg"}
                alt={`${athlete.home_team_name} logo`}
                width={50}
                height={50}
                className="object-contain rounded-xl"
              />
            }
            {athlete.home_team_id ?  
              <Link 
                href={`/teams/${athlete.home_team_id}`}
                className="text-xl font-bold cursor-pointer hover:text-gray-400"
              >
                {athlete.home_team_name}
              </Link>           
            :
            <h2 className="text-xl font-bold">{athlete.home_team_name}</h2>}
          </div>
        </div>
      </div>
    </>

  )
}