
import React from 'react';
import { Link } from 'react-router-dom';
import { GlossaryTerm } from '@/types/glossary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface GlossaryCardProps {
  term: GlossaryTerm;
  className?: string;
}

const GlossaryCard: React.FC<GlossaryCardProps> = ({ term, className }) => {
  const truncatedDefinition = term.definition.length > 100
    ? `${term.definition.substring(0, 100)}...`
    : term.definition;

  return (
    <Link to={`/glossary/${term.slug}`}>
      <Card className={`group hover:border-accent-teal transition-colors ${className}`}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{term.term}</CardTitle>
          <ChevronRight className="h-5 w-5 text-accent-teal opacity-70 group-hover:opacity-100 transition-opacity" />
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground">{truncatedDefinition}</p>
          
          {term.category && term.category.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {term.category.map((cat) => (
                <Badge key={cat} variant="outline" className="bg-accent-teal/10 text-accent-teal border-accent-teal/20">
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default GlossaryCard;
