
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RidingSkill } from '@/types/riding-skills';
import { getRidingSkills, deleteRidingSkill } from '@/services/ridingSkillsService';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminRidingSkillDialog from '@/components/admin/riding-skills/AdminRidingSkillDialog';

const AdminRidingSkills = () => {
  const [skills, setSkills] = useState<RidingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<RidingSkill | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await getRidingSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast({
        title: 'Failed to load skills',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleCreate = () => {
    setCurrentSkill(null);
    setDialogOpen(true);
  };

  const handleEdit = (skill: RidingSkill) => {
    setCurrentSkill(skill);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setDeleteLoading(true);
      await deleteRidingSkill(deleteId);
      setSkills(skills.filter(skill => skill.id !== deleteId));
      toast({
        title: 'Skill deleted',
        description: 'The riding skill has been removed',
      });
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: 'Failed to delete skill',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleSaveSuccess = (savedSkill: RidingSkill) => {
    setDialogOpen(false);
    
    if (currentSkill) {
      // Update existing skill
      setSkills(skills.map(skill => 
        skill.id === savedSkill.id ? savedSkill : skill
      ));
      toast({
        title: 'Skill updated',
        description: 'The riding skill has been updated successfully'
      });
    } else {
      // Add new skill
      setSkills([...skills, savedSkill]);
      toast({
        title: 'Skill created',
        description: 'The new riding skill has been added successfully'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Riding Skills & Drills</h1>
        <Button
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={handleCreate}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <p className="text-muted-foreground">
        Create and manage riding skills and practice drills for users to improve their motorcycle handling.
      </p>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : skills.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{skill.level}</Badge>
                  </TableCell>
                  <TableCell>{skill.category}</TableCell>
                  <TableCell>
                    {skill.difficulty ? (
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-4 mx-0.5 rounded-sm ${i < skill.difficulty! ? 'bg-accent-teal' : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(skill)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(skill.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">
            No riding skills have been created yet. Add your first skill using the button above.
          </p>
        </div>
      )}
      
      {/* Create/Edit Dialog */}
      <AdminRidingSkillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        skill={currentSkill}
        onSaveSuccess={handleSaveSuccess}
      />
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this riding skill. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminRidingSkills;
