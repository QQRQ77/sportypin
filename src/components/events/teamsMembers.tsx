'use client';

import React from 'react';
import { EventTeamMemberType } from "@/types";
import { IoShirtOutline } from "react-icons/io5";
import { IconContext } from "react-icons";

interface TeamsMembersProps {
  team_1_members?: EventTeamMemberType[];
  team_2_members?: EventTeamMemberType[];
  team1active: boolean;
  team2active: boolean;
  members1active: boolean;
  members2active: boolean;
  setTeam1Active: (active: boolean) => void;
  setTeam2Active: (active: boolean) => void;
  setMembers1Active?: (active: boolean) => void;
  setMembers2Active?: (active: boolean) => void;
}

const MatchTeamsMembers: React.FC<TeamsMembersProps> = 
  ({ team_1_members, team_2_members, members1active = true, members2active = true, setTeam1Active, setTeam2Active }) => {

  const noTeam1Members = !team_1_members || team_1_members.length === 0;
  const noTeam2Members = !team_2_members || team_2_members.length === 0;

  const handleTeam1Click = () => {
    setTeam1Active(true);
    setTeam2Active(false);
  }

  const handleTeam2Click = () => {
    setTeam1Active(false);
    setTeam2Active(true);
  }

  return (
    <div className='w-3/5 flex flex-2 items-center justify-center gap-8'>
      <div className={`team-1 w-1/2 flex flex-col items-center gap-2 p-2 ${members1active && !noTeam1Members ? "pulse-border-blue rounded-2xl" : "border-5 border-transparent"}`}>
        {team_1_members && team_1_members.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 items-center justify-center cursor-pointer'
              onClick={handleTeam1Click}>
            {team_1_members.map((member) => (
              <div className={`flex flex-col items-center gap-2 ${members1active && !noTeam1Members ? "hover:bg-gray-300" :""}  rounded-2xl p-2`} key={member.id}>
                <IconContext.Provider value={{ className: "text-sky-600 hover:text-sky-800" }}>
                  <div className='relative'>
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
      <div className={`team-2 w-1/2 flex flex-col items-center gap-2 p-2 ${members2active && !noTeam2Members ? "pulse-border-green rounded-2xl" : "border-5 border-transparent"}`}>
        {team_2_members && team_2_members.length > 0 ? (
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 items-center justify-center cursor-pointer'
            onClick={handleTeam2Click}
          >
            {team_2_members.map((member) => (
              <div className={`flex flex-col items-center gap-2 ${members2active && !noTeam2Members ? "hover:bg-gray-300" :""} rounded-2xl p-2`} key={member.id}>
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