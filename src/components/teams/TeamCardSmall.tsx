import { TeamSmall } from "@/types"
import Image from "next/image";

interface TeamCardProps {
  team: TeamSmall
}

export default function TeamCardSmall({ team }: TeamCardProps) {

  return (
    <>
      <div className="border-4 border-orange-700 rounded-xl shadow-md flex flex-col items-center overflow-hidden bg-orange-600 relative">
        <Image
          src={team.imageUrls && team.imageUrls[0] || "/images/default_team_logo.jpeg"}
          alt={`${team.name} logo`}
          width={200}
          height={200}
          className="object-contain"
        />
        <div className="w-full bg-orange-700 bg-opacity-60 text-white p-4 text-center flex flex-col justify-center items-center gap-3">
          <h2 className="text-2xl font-bold">{team.name}</h2>
          <h2 className="text-xl font-medium">{team.host_city}</h2>
          <div className="flex flex-wrap gap-2">
            {team.sports && team.sports.map((sport: string, idx: number) => (
              <div key={idx} className="flex items-center bg-orange-600 px-2 py-1 rounded">
                {sport}              
              </div>
            ))}
          </div>   
          <div className="flex flex-wrap gap-2">
            {team.cathegories && team.cathegories.map((cathegory: string, idx: number) => (
              <div key={idx} className="flex items-center bg-orange-600 px-2 py-1 rounded">
                {cathegory}              
              </div>
            ))}
          </div>       
        </div>
      </div>
    </>
  )
}