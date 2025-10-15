

interface HarmonogramSearchAndFiltersProps {
      setSearchString: (value: string) => void;
      types: string[];
      cathegories: string[];
      teams: string[];
      setFilterType: (value: string) => void;
      setFilterCathegory: (value: string) => void;
      setFilterTeam: (value: string) => void;
}

// export default function HarmonogramSearchAndFilters({types, cathegories, teams, setSearchString, setFilterType, setFilterCathegory, setFilterTeam}: HarmonogramSearchAndFiltersProps ) {
export default function HarmonogramSearchAndFilters() {
  return (
    <div className="w-full flex flex-wrap gap-2 mb-2 p-4 rounded-xl shadow-xl border-2">
      SEARCH AND FILTERS
      {/* Tutaj dodaj komponenty do wyszukiwania i filtrowania */}
    </div>
  );
}