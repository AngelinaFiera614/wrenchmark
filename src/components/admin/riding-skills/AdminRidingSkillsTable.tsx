
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { RidingSkill } from '@/types/riding-skills';

interface AdminRidingSkillsTableProps {
  skills: RidingSkill[];
  onEdit: (skill: RidingSkill) => void;
  onDelete: (id: string) => void;
}

export const AdminRidingSkillsTable: React.FC<AdminRidingSkillsTableProps> = ({
  skills,
  onEdit,
  onDelete
}) => {
  return (
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
                  onClick={() => onEdit(skill)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(skill.id)}
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
  );
};
