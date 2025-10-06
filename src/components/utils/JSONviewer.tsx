"use client";
import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

interface JsonViewerProps {
  data: unknown;
  name?: string;
}

/**
 * Rekurencyjny, rozwijalny widok JSON-a
 */
const JsonViewer: React.FC<JsonViewerProps> = ({ data, name = "root" }) => {
  const [open, setOpen] = useState(true);

  if (data === null) return <span className="text-slate-500">null</span>;
  if (typeof data === "undefined") return <span className="text-slate-500">undefined</span>;
  if (typeof data === "string") return <span className="text-emerald-600">`&quot;`{data}`&quot;`</span>;
  if (typeof data === "number" || typeof data === "boolean")
    return <span className="text-sky-600">{String(data)}</span>;

  const isArray = Array.isArray(data);
  const keys = isArray ? null : Object.keys(data as Record<string, unknown>);
  const entries = isArray
    ? (data as unknown[]).map((v, i) => [i, v] as const)
    : Object.entries(data as Record<string, unknown>);
  
    return (
    <div className="font-mono text-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 font-semibold"
      >
        {open ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
        <span>{name}</span>
        <span className="text-slate-400">
          {isArray ? `[${(data as unknown[]).length}]` : `{${keys?.length ?? 0}}`}
        </span>
      </button>

      {open && (
        <div className="ml-4 border-l border-slate-300 pl-3">
          {entries?.map(([key, value], idx) => (
            <div key={idx} className="mt-1">
              <span className="text-slate-700">{String(key)}: </span>
              <JsonViewer data={value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonViewer;