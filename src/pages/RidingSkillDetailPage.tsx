
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRidingSkillById } from "@/services/ridingSkillsService";
import { RidingSkill } from "@/types/riding-skills";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronRight, Clock, MapPin, Video } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-600/20 text-green-400';
      case 'Intermediate':
        return 'bg-blue-600/20 text-blue-400';
      case 'Advanced':
        return 'bg-amber-600/20 text-amber-400';
      default:
        return 'bg-accent-teal/20 text-accent-teal';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto animate-pulse space-y-4">
            <div className="h-10 bg-muted/30 rounded w-2/3"></div>
            <div className="h-5 bg-muted/30 rounded w-1/3"></div>
            <div className="h-64 bg-muted/30 rounded"></div>
            <div className="h-5 bg-muted/30 rounded"></div>
            <div className="h-5 bg-muted/30 rounded"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!skill) {
    return null;
  }

  const renderInstructions = () => {
    // Split by newlines to support simple formatting
    return skill.instructions.split('\n').map((line, index) => (
      <p key={index} className="mb-3">{line}</p>
    ));
  };

  return (
    <>
      <Helmet>
        <title>{`${skill.title} | Riding Skills | Wrenchmark`}</title>
        <meta name="description" content={`Learn ${skill.title} - ${skill.category} riding skill for ${skill.level} riders`} />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-fadeIn">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-accent-teal">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/riding-skills" className="hover:text-accent-teal">Riding Skills</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-foreground truncate max-w-[200px]">{skill.title}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="mb-6 hover:bg-accent-teal/10 hover:text-accent-teal"
          >
            <Link to="/riding-skills">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all skills
            </Link>
          </Button>

          {/* Header section */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={`font-medium ${getLevelColor(skill.level)}`}>
                {skill.level}
              </Badge>
              <Badge className="bg-accent-teal/20 text-accent-teal">
                {skill.category}
              </Badge>
              {skill.difficulty && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <span>Difficulty:</span>
                  <div className="flex ml-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`w-1.5 h-3 mx-0.5 rounded-sm ${i < skill.difficulty! ? 'bg-accent-teal' : 'bg-muted'}`}
                      />
                    ))}
                  </div>
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {skill.title}
            </h1>
          </div>

          {/* Video or image */}
          {skill.video_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="400"
                src={skill.video_url}
                title={skill.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              ></iframe>
            </div>
          )}
          
          {!skill.video_url && skill.image_url && (
            <div className="mb-8">
              <img 
                src={skill.image_url} 
                alt={skill.title}
                className="rounded-lg w-full max-h-[400px] object-cover"
              />
            </div>
          )}

          {/* Main content */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <div className="text-muted-foreground space-y-1">
                {renderInstructions()}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-muted/20 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-accent-teal" />
                  Practice Layout
                </h3>
                <p className="text-sm text-muted-foreground">
                  {skill.practice_layout}
                </p>
              </div>
              
              {skill.video_url && (
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Video className="mr-2 h-4 w-4 text-accent-teal" />
                    Video Tutorial
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mt-2 border-accent-teal/50 hover:bg-accent-teal/10"
                    asChild
                  >
                    <a href={skill.video_url} target="_blank" rel="noopener noreferrer">
                      Watch on YouTube
                    </a>
                  </Button>
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

export default RidingSkillDetailPage;
