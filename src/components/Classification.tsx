import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { ClassificationItem } from "@/types";
import ClassificationSingleItem from "./ClassificationItem";



interface ClassificationProps {
  classification?: ClassificationItem[];
  isUserCreator?: boolean;
  eventId: string;
  setItems: React.Dispatch<React.SetStateAction<ClassificationItem[]>>;
}

function groupByCategory(classification: ClassificationItem[]) {
  return classification.reduce<Record<string, ClassificationItem[]>>((groups, place) => {
    const category = place.cathegory || "Brak kategorii";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(place);
    return groups;
  }, {});
}

function getCategoryKeys(obj: Record<string, ClassificationItem[]>) {
    return Object.keys(obj);
  }

export default function Classification({eventId, isUserCreator = false, classification = [], setItems}: ClassificationProps) {

  const classificationByCategory = groupByCategory(classification);

  const categoryKeys = getCategoryKeys(classificationByCategory);

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
              {category} ({classificationByCategory[category].length})
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div className="flex flex-col gap-2">
              {classificationByCategory[category].map((place) => (
                <ClassificationSingleItem 
                  key={place.id} 
                  item={place}
                  eventId={eventId} 
                  isUserCreator={isUserCreator} 
                  setItems={setItems} 
                  classification={classification}
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
