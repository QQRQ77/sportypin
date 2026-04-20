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
    <div className='flex flex-2 items-center justify-center gap-8'>
      <div className='team-1'>
        {team_1_members && team_1_members.length > 0 ? (
          <div className='flex flex-2 md:flex-3 md:gap-4 items-center justify-center'>
            {team_1_members.map((member) => (
              <IconContext.Provider value={{ className: "text-sky-600" }} key={member.id}>
                <div className='relative'>
                  <IoShirtOutline size={96} />
                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">{member.start_number}</p>
                </div>
              </IconContext.Provider>
            ))}
          </div>
        ) : (
          <p>Brak członków zespołu 1</p>
        )}
      </div>
      <div className='team-2 flex flex-col items-center gap-2'>
        <h3 className='text-xl font-semibold'>Zespół 2</h3>
        {team_2_members && team_2_members.length > 0 ? (
          <ul className='list-disc list-inside'>
            {team_2_members.map((member, index) => (
              <li key={index}>{member.name} (#{member.start_number})</li>
            ))}
          </ul>
        ) : (
          <p>Brak członków zespołu 2</p>
        )}
      </div>

    </div>
  );
};

export default MatchTeamsMembers;