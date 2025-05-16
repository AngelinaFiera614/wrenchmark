
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RidingSkill, RidingSkillLevel } from '@/types/riding-skills';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createRidingSkill, updateRidingSkill } from '@/services/ridingSkillsService';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface AdminRidingSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: RidingSkill | null;
  onSaveSuccess: (skill: RidingSkill) => void;
}

const difficultyLevels = [1, 2, 3, 4, 5];
const riderLevels: RidingSkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
const categories = [
  'Parking lot',
  'Low-speed',
  'Highway',
  'Off-road',
  'Emergency',
  'City',
  'Advanced control'
];

interface FormValues {
  title: string;
  level: RidingSkillLevel;
  category: string;
  instructions: string;
  practice_layout: string;
  difficulty: string;
  image_url: string;
  video_url: string;
}

const AdminRidingSkillDialog = ({
  open,
  onOpenChange,
  skill,
  onSaveSuccess
}: AdminRidingSkillDialogProps) => {
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!skill;
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: skill?.title || '',
      level: skill?.level as RidingSkillLevel || 'Beginner',
      category: skill?.category || 'Parking lot',
      instructions: skill?.instructions || '',
      practice_layout: skill?.practice_layout || '',
      difficulty: skill?.difficulty?.toString() || '',
      image_url: skill?.image_url || '',
      video_url: skill?.video_url || '',
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      const skillData = {
        title: data.title,
        level: data.level,
        category: data.category,
        instructions: data.instructions,
        practice_layout: data.practice_layout,
        difficulty: data.difficulty ? parseInt(data.difficulty) : undefined,
        image_url: data.image_url || null,
        video_url: data.video_url || null
      };
      
      let savedSkill;
      
      if (isEditing && skill) {
        savedSkill = await updateRidingSkill(skill.id, skillData);
      } else {
        savedSkill = await createRidingSkill(skillData);
      }
      
      onSaveSuccess(savedSkill);
    } catch (error) {
      console.error('Error saving riding skill:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Riding Skill' : 'Create New Riding Skill'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., U-Turn Practice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                rules={{ required: 'Level is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rider Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {riderLevels.map(level => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty (1-5)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {difficultyLevels.map(level => (
                        <SelectItem key={level} value={level.toString()}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Optional rating from 1 (easiest) to 5 (most difficult)</FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="instructions"
              rules={{ required: 'Instructions are required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Step-by-step instructions for the skill..." 
                      className="min-h-[120px]" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use new lines to separate steps or paragraphs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="practice_layout"
              rules={{ required: 'Practice layout is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Practice Layout</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the space needed and any cone setup..." 
                      className="min-h-[80px]" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to an image showing the skill or diagram (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://youtube.com/embed/..." 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to YouTube or other video demonstration (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Skill'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminRidingSkillDialog;
