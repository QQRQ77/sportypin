import { HarmonogramItem } from "@/types";
import DateViewer from "./DataViewer";

interface HarmonogramProps {
  items: HarmonogramItem[];
}

export default function Harmonogram({items}: HarmonogramProps) {
  
  function addLP(items: HarmonogramItem[]): (HarmonogramItem & { LP: number })[] {
    // licznik dla każdej daty
    const counter: Record<string, number> = {};

    return items.map(item => {
      const date = item.date;
      counter[date] = (counter[date] || 0) + 1;
      return { ...item, LP: counter[date] };
    });
  }

  items = addLP(items)
  
  return (
    <>
      <div className="w-full flex flex-wrap gap-2 mb-2 p-4 rounded-xl shadow-xl">
        <div className="w-[80px] text-center">Lp.</div>
        <div className="w-[100px] text-center">Początek</div>
        <div className="w-[100px] text-center">Koniec</div>
        <div className="flex-1 text-center lg:text-left">Opis</div>
        <div className="w-[100px] text-center hidden lg:block">Kategoria</div>
        <div className="block lg:hidden w-full text-center mt-1">Kategoria</div>
      </div>
      {items.map((item, idx) => (
        <div key={item.id} className="w-full flex flex-col gap-2 mb-4">
          {idx === 0 && <div className="w-full flex justify-center mb-2">
            <DateViewer date={item.date}/>    
          </div>}
          {idx > 0 && items[idx].date !== items[idx - 1].date && <div className="w-full flex justify-center mb-2">
            <DateViewer date={item.date}/>    
          </div>}
          <div className={`w-full flex flex-wrap p-4 gap-2 rounded-xl shadow-xl ${idx % 2 === 0 ? "bg-sky-200" : "bg-gray-200"} items-center`}>
            <div className="flex gap-2">
              <div className="w-[80px] text-center">{item.LP}.</div>
              <div className="w-[100px] text-center">{item.start_time}</div>
              <div className="w-[100px] text-center">{item.end_time}</div>
            </div>
            <div className="flex-1 text-center lg:text-left font-medium">{item.description}</div>
            <div className="hidden lg:block">
                <div className="flex gap-2 justify-center items-center">
                  <div className="w-[100px] text-center">
                    {item.itemType !== "inny" ? item.itemType : ""}
                  </div>
                  <div className="w-[100px] text-center">
                    {item.cathegory !== "wszystkie" ? item.cathegory : ""}
                  </div>
                </div>
              </div>
              <div className="block lg:hidden mx-auto">
                <div className="flex gap-2 justify-center items-center">
                  <div className="w-[100px] text-center">
                    {item.itemType !== "inny" ? item.itemType : ""}
                  </div>
                  <div className="w-[100px] text-center">
                    {item.cathegory !== "wszystkie" ? item.cathegory : ""}
                  </div>
                </div>
              </div>
          </div>
        </div>
      ))}
    </>
  );
}