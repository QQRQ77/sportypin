import { HarmonogramItem } from "@/types";

interface EventScoresProps {
  harmonogramItems?: HarmonogramItem[];
}

export default function EventScores({ harmonogramItems = []}: EventScoresProps) {

  return (
    <>
      {harmonogramItems.map((item, idx) => (
        item.score &&
        <div key={item.id} className="w-full flex flex-col gap-2 mb-4">
          <div className={`w-full flex flex-wrap p-4 gap-2 rounded-xl shadow-xl ${idx % 2 === 0 ? "bg-sky-200" : "bg-gray-200"} items-center`}>
            <div className="flex gap-2">
              <div className="w-[80px] text-center">{idx + 1}.</div>
            </div>
            <div className="flex-1 text-center lg:text-left font-medium">{item.team_1}{item.team_1 && " vs. "}{item.team_2}{((item.team_1 && item.description) || (item.team_2 && item.description)) && " - "}{` ${item.description}`}</div>
            <div className="w-[100px] text-center">
              {item.score}
            </div>
            <div className="hidden lg:block">
                <div className="flex gap-2 justify-center items-center">
                  <div className="w-[100px] text-center">
                    {item.cathegory !== "wszystkie" ? item.cathegory : ""}
                  </div>
                </div>
              </div>
              <div className="block lg:hidden mx-auto">
                <div className="flex gap-2 justify-center items-center">
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