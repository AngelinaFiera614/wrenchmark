
import React, { useState, useEffect } from "react";
import { getSkills, deleteSkill } from "@/services/skillsService";
import { Skill } from "@/types/course";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MoreVertical, Pencil, Trash2, ListFilter, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SkillFormDialog from "@/components/admin/courses/SkillFormDialog";

const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Load skills
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true);
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error("Error loading skills:", error);
        toast.error("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  // Filter skills by search query
  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (skill.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (skill.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // Delete a skill
  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter((skill) => skill.id !== id));
      toast.success("Skill deleted successfully");
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    }
  };

  // Open the edit dialog
  const handleEdit = (skill: Skill) => {
    setEditSkill(skill);
    setIsDialogOpen(true);
  };

  // Handle skill creation/edit
  const handleSkillFormSuccess = (skill: Skill, isNew: boolean) => {
    if (isNew) {
      setSkills([skill, ...skills]);
    } else {
      setSkills(skills.map(s => s.id === skill.id ? skill : s));
    }
    setIsDialogOpen(false);
    setEditSkill(null);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Skill
            </Button>
          </DialogTrigger>
          <SkillFormDialog 
            skill={editSkill}
            onSuccess={handleSkillFormSuccess}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditSkill(null);
            }}
          />
        </Dialog>
      </div>

      <div className="bg-card border rounded-md">
        <div className="p-4 flex items-center gap-4 border-b">
          <div className="relative flex-1">
            <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 float-right" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : filteredSkills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Lightbulb className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="font-medium text-lg">No skills found</h3>
                      <p className="text-sm text-muted-foreground">
                        {skills.length === 0 
                          ? "Create your first skill to get started" 
                          : "Try adjusting your search query"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>{skill.category || "—"}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {skill.description || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(skill)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{skill.name}"? This action cannot be undone and may affect courses that use this skill.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(skill.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;
