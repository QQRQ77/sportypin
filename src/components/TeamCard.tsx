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
          src={team.logoUrl || "/images/default_team_logo.jpeg"}
          alt={`${team.name} logo`}
          width={400}
          height={400}
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
              <div key={idx} className="flex items-center bg-orange-800 px-2 py-1 rounded">
                {cathegory}              
              </div>
            ))}
          </div>
          <div className="text-xl">Kontakt: </div>
          {team.contact_email && <div className="text-lg">email: <span className="ml-4">{team.contact_email}</span></div>}
          {team.contact_phone && <div className="text-lg">telefon: <span className="ml-4">{team.contact_phone}</span></div>}          
        </div>
        <div className="w-full text-right text-base text-white bg-orange-700">
            Dodane przez: <span className="font-semibold">{team.creator_name || 'Nieznany'}</span>
        </div>
      </div>
    </>

  )
}