import { Participant } from "@/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

interface CompetitorsProps {
  participants?: Participant[];
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

export default function CompetitorsList({participants = [],}: CompetitorsProps) {

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
            <div className="text-lg font-medium">
              {category} ({participantsByCategory[category].length})
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <ul className="list-disc list-inside">
              {participantsByCategory[category].map((participant) => (
                <li key={participant.id} className="text-base">
                  {participant.name} 
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
