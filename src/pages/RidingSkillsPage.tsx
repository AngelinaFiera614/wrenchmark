
import { useState, useEffect } from "react";
import { getRidingSkills } from "@/services/ridingSkillsService";
import RidingSkillCard from "@/components/riding-skills/RidingSkillCard";
import RidingSkillFilter from "@/components/riding-skills/RidingSkillFilter";
import { RidingSkill, RidingSkillLevel } from "@/types/riding-skills";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const RidingSkillsPage = () => {
  const [skills, setSkills] = useState<RidingSkill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<RidingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await getRidingSkills();
        setSkills(data);
        setFilteredSkills(data);
      } catch (error) {
        console.error("Failed to load riding skills", error);
        toast({
          title: "Error",
          description: "Failed to load riding skills. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [toast]);

  const handleFilterChange = (filters: {
    search: string;
    levels: RidingSkillLevel[];
    categories: string[];
  }) => {
    let filtered = [...skills];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(skill => 
        skill.title.toLowerCase().includes(searchLower) ||
        skill.instructions.toLowerCase().includes(searchLower) ||
        skill.practice_layout.toLowerCase().includes(searchLower)
      );
    }

    // Apply level filter
    if (filters.levels.length > 0) {
      filtered = filtered.filter(skill => 
        filters.levels.includes(skill.level as RidingSkillLevel)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(skill => 
        filters.categories.includes(skill.category)
      );
    }

    setFilteredSkills(filtered);
  };

  return (
    <>
      <Helmet>
        <title>Riding Skills | Wrenchmark</title>
        <meta name="description" content="Improve your riding with practice drills and skills" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <section className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Riding <span className="text-accent-teal">Skills</span> & Drills
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Improve your handling, build confidence, and master the art of riding with these targeted practice exercises. From parking lot basics to advanced control techniques.
            </p>
          </section>

          <div className="grid md:grid-cols-4 gap-6">
            <aside className="md:col-span-1">
              <RidingSkillFilter onFilterChange={handleFilterChange} />
            </aside>
            
            <div className="md:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                  <Loader2 className="h-12 w-12 animate-spin text-accent-teal" />
                </div>
              ) : filteredSkills.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                  {filteredSkills.map((skill) => (
                    <RidingSkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
              ) : (
                <div className="bg-muted/20 rounded-lg p-8 text-center">
                  <p className="text-lg text-muted-foreground">
                    No riding skills match your filters.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RidingSkillsPage;
