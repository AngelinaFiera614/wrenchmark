import { useSearchParams } from "react-router-dom";
import { motorcyclesData } from "@/data/motorcycles";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotorcycleFilters from "@/components/motorcycles/MotorcycleFilters";
import MotorcycleGrid from "@/components/motorcycles/MotorcycleGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMotorcycleFilters } from "@/hooks/useMotorcycleFilters";

export default function Motorcycles() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    filters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    filteredMotorcycles
  } = useMotorcycleFilters(motorcyclesData);

  // Update search when user types and sync with URL params
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    handleSearchChange(searchTerm);

    // Update URL params
    if (searchTerm) {
      searchParams.set("search", searchTerm);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-10">
          {/* Sidebar with filters */}
          <aside className="w-full">
            <MotorcycleFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Main content */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">Motorcycles</h1>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search motorcycles..."
                    className="pl-8"
                    value={filters.searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'result' : 'results'}
                </div>
              </div>
            </div>

            <MotorcycleGrid motorcycles={filteredMotorcycles} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
