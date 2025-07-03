
import React, { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Eye, 
  EyeOff,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/services/security/inputSanitizer';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter definition...",
  className,
  minHeight = 120
}: RichTextEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // Track text area ref for selection manipulation
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSelectionChange = useCallback(() => {
    if (textAreaRef.current) {
      setSelectionStart(textAreaRef.current.selectionStart);
      setSelectionEnd(textAreaRef.current.selectionEnd);
    }
  }, []);

  const insertFormatting = useCallback((before: string, after: string = before) => {
    if (!textAreaRef.current) return;

    const start = selectionStart;
    const end = selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        const newCursorPos = start + before.length + selectedText.length + after.length;
        textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [value, selectionStart, selectionEnd, onChange]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      const selectedText = value.substring(selectionStart, selectionEnd);
      const linkText = selectedText || 'link text';
      insertFormatting(`[${linkText}](`, ')');
    }
  }, [value, selectionStart, selectionEnd, insertFormatting]);

  // SECURITY FIX: Secure content rendering with proper DOMPurify sanitization
  const renderSecurePreview = (text: string) => {
    // Convert markdown-like syntax to HTML first
    const htmlContent = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent-teal underline" target="_blank" rel="noopener">$1</a>')
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
      .replace(/\n/g, '<br>');
    
    // Sanitize the HTML content before rendering
    return sanitizeHtml(htmlContent);
  };

  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = value.length;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border rounded-md bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('**', '**')}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('*', '*')}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('__', '__')}
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('* ', '')}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('1. ', '')}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className="h-8 w-8 p-0"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        
        <div className="flex-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="h-8 w-8 p-0"
          title="Toggle Preview"
        >
          {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {/* Editor/Preview Area - SECURITY FIX: Now uses secure rendering */}
      {isPreviewMode ? (
        <div 
          className="p-3 border rounded-md bg-background min-h-[120px] prose prose-sm max-w-none"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: renderSecurePreview(value) }}
        />
      ) : (
        <Textarea
          ref={textAreaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onSelect={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          onClick={handleSelectionChange}
          placeholder={placeholder}
          className="bg-background resize-none"
          style={{ minHeight }}
        />
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Type className="h-3 w-3 mr-1" />
            {wordCount} words
          </Badge>
          <Badge variant="outline" className="text-xs">
            {charCount} characters
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Use **bold**, *italic*, __underline__, [link](url), * lists
        </div>
      </div>
    </div>
  );
}
