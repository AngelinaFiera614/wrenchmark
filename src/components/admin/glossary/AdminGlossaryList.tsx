
import { useState } from "react";
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
  onEdit: (term: GlossaryTerm) => void;
  onDelete: (term: GlossaryTerm) => void;
}

export function AdminGlossaryList({
  terms,
  onEdit,
  onDelete,
}: AdminGlossaryListProps) {
  const [search, setSearch] = useState("");
  
  const filteredTerms = terms.filter((term) =>
    term.term.toLowerCase().includes(search.toLowerCase()) ||
    term.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filteredTerms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((term) => (
            <Card key={term.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
                <div>
                  <CardTitle>{term.term}</CardTitle>
                  <CardDescription className="mt-1.5">
                    {term.slug}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3 pt-4">
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
                      <Badge key={cat} variant="outline">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  Updated {format(new Date(term.updated_at), "MMM d, yyyy")}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(term)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(term)}
                    className="text-destructive hover:text-destructive"
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
          {search ? (
            <p>No terms matching "{search}"</p>
          ) : (
            <p>No terms in the glossary yet</p>
          )}
        </div>
      )}
    </div>
  );
}
