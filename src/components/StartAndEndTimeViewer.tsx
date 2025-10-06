import { Calendar } from "lucide-react";

interface Props {
  start_date?: string;
  end_date?: string;
}

function areDifferentDates(date1: string, date2:string) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Resetowanie czasu dla obu dat
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  return d1.getTime() !== d2.getTime();
}

function dateEndTimeString(date: string) {
  const start = new Date(date);
  const day = start.toLocaleDateString("pl-PL", { day: "2-digit" });
  const month = start.toLocaleDateString("pl-PL", { month: "long" });
  const weekDay = start.toLocaleDateString("pl-PL", { weekday: "long" });
  const year = start.toLocaleDateString("pl-PL", { year: "numeric" });
  const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return `${weekDay}, ${day} ${month} ${year}  ${startTime}`
}

export default function StartAndEndTimeViewer({start_date, end_date}: Props) {
  
  const start_time = start_date ? dateEndTimeString(start_date) : ""
  const end_time = (start_date && end_date) ?
                 (areDifferentDates(start_date, end_date) ?
                  dateEndTimeString(end_date) :
                  new Date(end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  ) : ""
  
  return (
    <>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex gap-2">
          <p className="w-20">Początek: </p>
          <Calendar size={24} />
          <div>
            {start_time}
          </div>
        </div>
        {end_date && 
          <div className="flex gap-2">
            <p className="w-20">Koniec: </p>
            <Calendar size={24} />
            <div>
              {end_time}
            </div>
          </div>}
      </div>
    </>)
}