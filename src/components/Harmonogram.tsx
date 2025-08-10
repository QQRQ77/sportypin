import { HarmonogramItem } from "@/types";

interface HarmonogramProps {
  items: HarmonogramItem[];
}

export default function Harmonogram({items}: HarmonogramProps) {
  
  return (
    <>
      {items.map((item, idx) => (
        <div key={item.id} className={`w-full lg:w-11/12 flex flex-wrap lg:flex-nowrap gap-2 p-4 rounded-xl shadow-xl ${idx % 2 === 0 ? "bg-sky-200" : "bg-gray-200"} cursor-grab`}>
          <div className="w-1/4 lg:w-1/12 text-center">{idx + 1}.</div>
          <div className="w-1/4 lg:w-1/12 text-center">{item.start_time}</div>
          <div className="w-1/4 lg:w-1/12 text-center">{item.end_time}</div>
          <div className="w-full lg:w-3/4 text-center lg:text-left font-medium">{item.description}</div>
        </div>
      ))}
    </>
  );
}