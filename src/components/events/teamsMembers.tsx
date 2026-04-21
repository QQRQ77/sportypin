'use client';

import React from 'react';
import { EventTeamMemberType } from "@/types";
import { IoShirtOutline } from "react-icons/io5";
import { IconContext } from "react-icons";

interface TeamsMembersProps {
  team_1_members?: EventTeamMemberType[];
  team_2_members?: EventTeamMemberType[];
}

const MatchTeamsMembers: React.FC<TeamsMembersProps> = ({ team_1_members, team_2_members }) => {

  return (
    <div className='w-3/5 flex flex-2 items-center justify-center gap-8'>
      <div className='team-1 w-1/2 flex flex-col items-center gap-2'>
        {team_1_members && team_1_members.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 items-center justify-center'>
            {team_1_members.map((member) => (
              <div className='flex flex-col items-center gap-2 hover:bg-gray-300 rounded-2xl p-2' key={member.id}>
                <IconContext.Provider value={{ className: "text-sky-600 hover:text-sky-800" }}>
                  <div className='relative cursor-pointer'>
                    <IoShirtOutline size={96} />
                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-4xl hover:text-gray-600">{member.start_number}</p>
                  </div>
                </IconContext.Provider>
                <p className="text-base font-bold text-wrap">{member.name}</p>
              </div>
            ))}
            </div>
        ) : (
          <p>Brak członków zespołu 1</p>
        )}
      </div>
      <div className='team-2 w-1/2 flex flex-col items-center gap-2'>
        {team_2_members && team_2_members.length > 0 ? (
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 items-center justify-center'>
            {team_2_members.map((member) => (
              <div className='flex flex-col items-center gap-2 hover:bg-gray-300 rounded-2xl p-2' key={member.id}>
              <IconContext.Provider value={{ className: "text-green-600 hover:text-green-800" }}>
                <div className='relative cursor-pointer'>
                  <IoShirtOutline size={96} />
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-4xl hover:text-gray-600">{member.start_number}</p>
                </div>
              </IconContext.Provider>
              <p className="text-base font-bold text-wrap">{member.name}</p>
            </div>
            ))}
          </div>
        ) : (
          <p>Brak członków zespołu 2</p>
        )}
      </div>

    </div>
  );
};

export default MatchTeamsMembers;