
import { GlossaryTerm } from "@/types/glossary";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Search, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface AdminGlossaryListProps {
  terms: GlossaryTerm[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (term: GlossaryTerm) => void;
  onDelete: (term: GlossaryTerm) => void;
}

export function AdminGlossaryList({
  terms,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}: AdminGlossaryListProps) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {terms.map((term) => (
            <Card key={term.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{term.term}</CardTitle>
                  <CardDescription className="text-xs font-mono">
                    {term.slug}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3 pt-0">
                {term.image_url ? (
                  <div className="relative aspect-video bg-muted/20 rounded-sm overflow-hidden">
                    <img
                      src={term.image_url}
                      alt={term.term}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center aspect-video bg-muted/20 rounded-sm text-muted-foreground">
                    <ImageOff className="h-6 w-6 opacity-50" />
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {term.definition}
                </p>
                
                {term.category && term.category.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {term.category.map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                )}

                {term.related_terms && term.related_terms.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">Related:</div>
                    <div className="flex flex-wrap gap-1">
                      {term.related_terms.slice(0, 3).map((relatedTerm) => (
                        <Badge key={relatedTerm} variant="secondary" className="text-xs">
                          {relatedTerm}
                        </Badge>
                      ))}
                      {term.related_terms.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{term.related_terms.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4">
                <div className="text-xs text-muted-foreground">
                  {format(new Date(term.updated_at), "MMM d, yyyy")}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-accent-teal text-black hover:bg-accent-teal/80 border border-accent-teal/30 hover:border-accent-teal"
                    onClick={() => onEdit(term)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="border border-destructive/30 hover:border-destructive"
                    onClick={() => onDelete(term)}
                  >
                    <Trash className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
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
