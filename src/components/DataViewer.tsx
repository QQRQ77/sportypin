import { Calendar } from "lucide-react";

interface Props {
  date?: string;
}

function dateEndTimeString(date: string) {
  const start = new Date(date);
  const day = start.toLocaleDateString("pl-PL", { day: "2-digit" });
  const month = start.toLocaleDateString("pl-PL", { month: "long" });
  const weekDay = start.toLocaleDateString("pl-PL", { weekday: "long" });
  const year = start.toLocaleDateString("pl-PL", { year: "numeric" });

  return `${weekDay}, ${day} ${month} ${year}`
}

export default function DateViewer({ date }: Props) {
  
  const date_string = date ? dateEndTimeString(date) : ""
  
  return (
    <>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex gap-2">
          <Calendar size={24} />
          <div>
            {date_string}
          </div>
        </div>
      </div>
    </>)
}