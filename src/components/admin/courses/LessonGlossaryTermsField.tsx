
import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchGlossaryTerms } from '@/services/glossaryService';

interface LessonGlossaryTermsFieldProps {
  form: UseFormReturn<any>;
}

export default function LessonGlossaryTermsField({ form }: LessonGlossaryTermsFieldProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: glossaryTerms = [], isLoading } = useQuery({
    queryKey: ['adminGlossaryTerms'],
    queryFn: fetchGlossaryTerms
  });

  // Filter terms based on search query
  const filteredTerms = glossaryTerms.filter(term => 
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
    term.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get currently selected terms
  const selectedTerms = form.watch('glossary_terms') || [];
  
  const toggleTerm = (slug: string) => {
    const currentTerms = [...selectedTerms];
    const termIndex = currentTerms.indexOf(slug);
    
    if (termIndex >= 0) {
      currentTerms.splice(termIndex, 1);
    } else {
      currentTerms.push(slug);
    }
    
    form.setValue('glossary_terms', currentTerms, { shouldValidate: true });
  };
  
  const removeTerm = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTerms = [...selectedTerms];
    const termIndex = currentTerms.indexOf(slug);
    
    if (termIndex >= 0) {
      currentTerms.splice(termIndex, 1);
      form.setValue('glossary_terms', currentTerms, { shouldValidate: true });
    }
  };
  
  return (
    <FormField
      control={form.control}
      name="glossary_terms"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Glossary Terms</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    <span className="truncate">
                      {selectedTerms.length > 0
                        ? `${selectedTerms.length} term${selectedTerms.length > 1 ? 's' : ''} selected`
                        : "Select glossary terms"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search terms..." 
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        {isLoading ? 'Loading...' : 'No terms found.'}
                      </CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {filteredTerms.map((term) => {
                          const isSelected = selectedTerms.includes(term.slug);
                          return (
                            <CommandItem
                              key={term.slug}
                              value={term.slug}
                              onSelect={() => toggleTerm(term.slug)}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                                  isSelected ? "bg-primary border-primary" : "opacity-50"
                                )}>
                                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                </div>
                                <span>{term.term}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{term.slug}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {/* Display selected terms */}
              {selectedTerms.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTerms.map(slug => {
                    // Find the term to display its name
                    const term = glossaryTerms.find(t => t.slug === slug);
                    return (
                      <Badge key={slug} variant="secondary" className="pl-2">
                        {term?.term || slug}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 pl-1 text-muted-foreground hover:text-foreground"
                          onClick={(e) => removeTerm(e, slug)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
