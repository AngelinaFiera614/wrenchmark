
import { GlossaryTerm } from "@/types/glossary";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash } from "lucide-react";
import { format } from "date-fns";
import { ColumnVisibility } from "./ColumnVisibilityControls";
import { SmartSearchInput } from "./SmartSearchInput";
import { DefinitionDisplay } from "./DefinitionDisplay";

interface AdminGlossaryTableProps {
  terms: GlossaryTerm[];
  allTerms: GlossaryTerm[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (term: GlossaryTerm) => void;
  onDelete: (term: GlossaryTerm) => void;
  columnVisibility: ColumnVisibility;
  selectedTerms: string[];
  onSelectionChange: (termIds: string[]) => void;
}

export function AdminGlossaryTable({
  terms,
  allTerms,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  columnVisibility,
  selectedTerms,
  onSelectionChange,
}: AdminGlossaryTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(terms.map(term => term.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectTerm = (termId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedTerms, termId]);
    } else {
      onSelectionChange(selectedTerms.filter(id => id !== termId));
    }
  };

  const isAllSelected = terms.length > 0 && selectedTerms.length === terms.length;

  return (
    <div className="space-y-4">
      <SmartSearchInput
        value={searchTerm}
        onChange={onSearchChange}
        terms={allTerms}
        placeholder="Search terms, definitions, categories..."
      />
      
      {terms.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columnVisibility.term && <TableHead>Term</TableHead>}
                {columnVisibility.definition && <TableHead>Definition</TableHead>}
                {columnVisibility.categories && <TableHead>Categories</TableHead>}
                {columnVisibility.relatedTerms && <TableHead>Related Terms</TableHead>}
                {columnVisibility.updated && <TableHead>Updated</TableHead>}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {terms.map((term) => (
                <TableRow key={term.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTerms.includes(term.id)}
                      onCheckedChange={(checked) => handleSelectTerm(term.id, checked as boolean)}
                    />
                  </TableCell>
                  {columnVisibility.term && (
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div>{term.term}</div>
                        <div className="text-xs text-muted-foreground">
                          {term.slug}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.definition && (
                    <TableCell>
                      <DefinitionDisplay 
                        definition={term.definition}
                        maxLength={100}
                        className="text-sm max-w-md"
                      />
                    </TableCell>
                  )}
                  {columnVisibility.categories && (
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
                  )}
                  {columnVisibility.relatedTerms && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {term.related_terms && term.related_terms.length > 0
                          ? term.related_terms.slice(0, 3).map((relatedTerm) => (
                              <Badge key={relatedTerm} variant="secondary" className="text-xs">
                                {relatedTerm}
                              </Badge>
                            ))
                          : <span className="text-xs text-muted-foreground">None</span>
                        }
                        {term.related_terms && term.related_terms.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{term.related_terms.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.updated && (
                    <TableCell className="text-muted-foreground">
                      {format(new Date(term.updated_at), "MMM d, yyyy")}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        className="h-8 w-8 bg-accent-teal text-black hover:bg-accent-teal/80 border border-accent-teal/30 hover:border-accent-teal"
                        onClick={() => onEdit(term)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 border border-destructive/30 hover:border-destructive"
                        onClick={() => onDelete(term)}
                      >
                        <Trash className="h-4 w-4" />
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
