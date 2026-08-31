import { EventTeamMemberType } from '@/types';
import React from 'react';

interface HandballGameReviewTeamMembersProps {
  team_1_members?: EventTeamMemberType[];
  team_2_members?: EventTeamMemberType[];
}

const HandballGameReviewTeamMembers: React.FC<HandballGameReviewTeamMembersProps> = ({
  team_1_members,
  team_2_members,
}) => {


  
  return (
    <div className="handball-game-review-team-members w-full lg:w-3/5 flex flex-2 items-start justify-center md:gap-8">
      <div className="team-1 w-1/2 flex flex-col items-center justify-start gap-2 p-2 border-5 border-transparent">
        {team_1_members && team_1_members.length > 0 ? (
          <ul className="w-full">
            {team_1_members.map((member) => (
              <li key={member.id} className="text-lg font-medium">
                {member.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Brak członków drużyny</p>
        )}
      </div>
      <div className="team-2 w-1/2 flex flex-col items-center justify-start gap-2 p-2 border-5 border-transparent">
        {team_2_members && team_2_members.length > 0 ? (
          <ul className="w-full">
            {team_2_members.map((member) => (
              <li key={member.id} className="text-lg font-medium">
                {member.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Brak członków drużyny</p>
        )}
      </div>  
    </div>
  );
};

export default HandballGameReviewTeamMembers;
