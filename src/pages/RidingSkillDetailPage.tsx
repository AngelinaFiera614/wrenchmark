
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRidingSkillById } from "@/services/ridingSkillsService";
import { RidingSkill } from "@/types/riding-skills";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import SkillHeader from "@/components/riding-skills/SkillHeader";
import SkillMedia from "@/components/riding-skills/SkillMedia";
import SkillContentSection from "@/components/riding-skills/SkillContentSection";
import SkillSidebarInfo from "@/components/riding-skills/SkillSidebarInfo";
import SkillLoading from "@/components/riding-skills/SkillLoading";

const RidingSkillDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<RidingSkill | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSkill = async () => {
      if (!id) {
        navigate("/riding-skills");
        return;
      }

      try {
        const data = await getRidingSkillById(id);
        if (data) {
          setSkill(data);
        } else {
          toast({
            title: "Skill not found",
            description: "The requested riding skill doesn't exist.",
            variant: "destructive",
          });
          navigate("/riding-skills");
        }
      } catch (error) {
        console.error("Failed to load riding skill", error);
        toast({
          title: "Error",
          description: "Failed to load skill details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSkill();
  }, [id, navigate, toast]);

  if (loading) {
    return <SkillLoading />;
  }

  if (!skill) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`${skill.title} | Riding Skills | Wrenchmark`}</title>
        <meta name="description" content={`Learn ${skill.title} - ${skill.category} riding skill for ${skill.level} riders`} />
      </Helmet>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-fadeIn">
          <SkillHeader skill={skill} />
          
          <SkillMedia 
            videoUrl={skill.video_url} 
            imageUrl={skill.image_url}
            title={skill.title}
          />
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <SkillContentSection instructions={skill.instructions} />
            </div>
            
            <div>
              <SkillSidebarInfo 
                practiceLayout={skill.practice_layout}
                videoUrl={skill.video_url}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default RidingSkillDetailPage;
