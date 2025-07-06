import { cn } from "clsx-tailwind-merge";

type Props = {
    passStrength: number
}

export default function PassStrengthBar({ passStrength }: Props) {

    return (
        <div
          className={cn(" col-span-2 flex gap-2", {
            "justify-around": passStrength === 3,
            "justify-start": passStrength < 3,
          })}
        >
          {Array.from({ length: passStrength + 1 }).map((i, index) => (
            <div
              key={index}
              className={cn("h-2 w-20 rounded-md mb-2", {
                "bg-red-500": passStrength === 0,
                "bg-orange-500": passStrength === 1,
                "bg-yellow-500": passStrength === 2,
                "bg-green-500": passStrength === 3,
              })}
            ></div>
          ))}
        </div>
      );
}