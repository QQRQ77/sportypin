// components/ComboInput.tsx
import { useState, useRef, useEffect } from 'react';
import { useController, UseControllerProps, FieldValues } from 'react-hook-form';
import clsx from 'clsx';
import { useSearchTeams } from '@/lib/hooks';

type Option = { id: string; name: string };

// type Props = UseControllerProps<any> & {
//   label?: string;
//   placeholder?: string;
// };

type Props<TForm extends FieldValues> = UseControllerProps<TForm> & {
  label?: string;
  placeholder?: string;
};

export default function ComboInput<TForm extends FieldValues>(props: Props<TForm>) {
  const {
    field: { onChange, value = { id: '', name: '' }, ref },
    fieldState: { error },
  } = useController(props);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { results, loading } = useSearchTeams(value.name as string);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleSelect = (opt: Option) => {
    onChange(opt);          // <-- zapiszemy {id, name}
    setOpen(false);
  };

  const displayName = (value as Option)?.name ?? '';

  return (
    <div ref={rootRef} className="relative w-full">
      {props.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{props.label}</label>
      )}

      <input
        ref={ref}
        value={displayName}
        onChange={(e) => {
          onChange({ id: '', name: e.target.value }); // reset ID gdy użytkownik pisze
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={props.placeholder}
        className={clsx(
          'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2',
          error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
        )}
      />

      {open && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
          {loading && <li className="px-4 py-2 text-sm text-gray-500">Wyszukiwanie...</li>}
          {!loading && results.length === 0 && displayName && (
            <li className="px-4 py-2 text-sm text-gray-500">Brak wyników</li>
          )}
          {!loading &&
            results.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-blue-50"
              >
                {item.name}
              </li>
            ))}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}