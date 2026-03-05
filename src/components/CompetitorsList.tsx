import { Participant } from "@/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { saveNewParticipant } from "@/lib/events.actions";
import CompetitorSingleItem from "./CompetitorSingleItem";

interface CompetitorsProps {
  participants?: Participant[];
  isUserCreator?: boolean;
  setItems: React.Dispatch<React.SetStateAction<Participant[]>>;
  eventId: string;
  }

function groupByCategory(participants: Participant[]) {
  return participants.reduce<Record<string, Participant[]>>((groups, participant) => {
    const category = participant.cathegory || "Brak kategorii";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(participant);
    return groups;
  }, {});
}

function getCategoryKeys(obj: Record<string, Participant[]>) {
    return Object.keys(obj);
  }

export default function CompetitorsList({eventId, setItems, participants = [], isUserCreator = false}: CompetitorsProps) {

  const participantsByCategory = groupByCategory(participants);

  const categoryKeys = getCategoryKeys(participantsByCategory);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      {categoryKeys.map((category, index) => (
        <AccordionItem key={category} value={`item-${index + 1}`}>
          <AccordionTrigger>
            <div className="text-lg font-medium cursor-pointer">
              {category} ({participantsByCategory[category].length})
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div className="flex flex-col gap-1 pl-2">
              {participantsByCategory[category].map((participant) => (
                <CompetitorSingleItem
                  key={participant.id}
                  participant={participant}
                  isUserCreator={isUserCreator}
                  eventId={eventId}
                  setItems={setItems}
                  participants={participants}
                  cathegories={categoryKeys}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
