import { CreateTeam } from "@/types"
import Image from "next/image";

interface TeamCardProps {
  team: CreateTeam
}

export default function TeamCard({ team }: TeamCardProps) {

  return (
    <>
      <div className="border-4 border-orange-700 rounded-xl shadow-md flex flex-col items-center overflow-hidden bg-cyan-400 relative">
        <Image
          src={team.imageUrls ? team.imageUrls[0] : "/images/default_team_logo.jpeg"}
          alt={`${team.name} logo`}
          width={400}
          height={400}
          className="object-contain"
        />
        <div className="w-full bg-orange-700 bg-opacity-60 text-white p-4 text-center flex flex-col justify-center items-center gap-3">
          <h2 className="text-2xl font-bold">{team.name}</h2>
          <h2 className="text-xl font-medium">{team.host_city}</h2>
        </div>
      </div>
    </>

  )
}