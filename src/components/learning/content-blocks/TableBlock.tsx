
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TableBlockProps {
  data: {
    title?: string;
    headers: string[];
    rows: string[][];
    caption?: string;
  };
}

export default function TableBlock({ data }: TableBlockProps) {
  if (!data.headers || !data.rows) {
    return null;
  }

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        {data.title && (
          <h3 className="text-xl font-semibold mb-4 text-accent-teal">{data.title}</h3>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {data.headers.map((header, index) => (
                  <TableHead key={index} className="text-accent-teal font-semibold">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="text-foreground">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {data.caption && (
          <p className="text-sm text-muted-foreground mt-3 text-center">
            {data.caption}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
