import { HarmonogramItem } from "@/types";
import DateViewer from "./DataViewer";

interface HarmonogramProps {
  items: HarmonogramItem[];
}

export default function Harmonogram({items}: HarmonogramProps) {
  
  return (
    <>
      {items.map((item, idx) => (
        <div key={item.id} className="w-full flex flex-col gap-2">
          {idx === 0 && <div className="w-11/12 flex justify-center">
            <DateViewer date={item.date}/>    
          </div>}
          <div className={`w-11/12 flex flex-wrap p-4 gap-2 rounded-xl shadow-xl ${idx % 2 === 0 ? "bg-sky-200" : "bg-gray-200"} items-center`}>
            <div className="w-[80px] lg:w-1/12 text-center">{idx + 1}.</div>
            <div className="w-[100px] lg:w-1/12 text-center">{item.start_time}</div>
            <div className="w-[100px] lg:w-1/12 text-center">{item.end_time}</div>
            <div className="flex-1 text-center lg:text-left font-medium">{item.description}</div>
            <div className="w-[100px] text-center hidden lg:block">{item.cathegory || ""}</div>
            <div className="block lg:hidden w-full text-center mt-1">
              {item.cathegory || ""}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}