
import { GlossaryTerm } from "@/types/glossary";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface AdminGlossaryTableProps {
  terms: GlossaryTerm[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (term: GlossaryTerm) => void;
  onDelete: (term: GlossaryTerm) => void;
}

export function AdminGlossaryTable({
  terms,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}: AdminGlossaryTableProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {terms.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Term</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {terms.map((term) => (
                <TableRow key={term.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div>{term.term}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-md">
                        {term.definition.substring(0, 100)}
                        {term.definition.length > 100 ? "..." : ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {term.category && term.category.length > 0
                        ? term.category.map((cat) => (
                            <Badge key={cat} variant="outline">
                              {cat}
                            </Badge>
                          ))
                        : <span className="text-xs text-muted-foreground">No categories</span>
                      }
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(term.updated_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(term)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(term)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md">
          {searchTerm ? (
            <p>No terms matching "{searchTerm}"</p>
          ) : (
            <p>No terms in the glossary yet</p>
          )}
        </div>
      )}
    </div>
  );
}
