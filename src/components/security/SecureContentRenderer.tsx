
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { sanitizeHtml, sanitizeMarkdown } from '@/services/security/inputSanitizer';

interface SecureContentRendererProps {
  content: string;
  type?: 'markdown' | 'html' | 'text';
  className?: string;
  allowedElements?: string[];
}

/**
 * Secure content renderer that safely displays user-generated content
 * without XSS vulnerabilities
 */
export const SecureContentRenderer: React.FC<SecureContentRendererProps> = ({
  content,
  type = 'markdown',
  className = '',
  allowedElements
}) => {
  if (!content) {
    return <div className={className}>No content available</div>;
  }

  switch (type) {
    case 'markdown':
      const sanitizedMarkdown = sanitizeMarkdown(content);
      return (
        <div className={className}>
          <ReactMarkdown
            allowedElements={allowedElements || [
              'p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 
              'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
              'blockquote', 'code', 'pre', 'a'
            ]}
            disallowedElements={['script', 'iframe', 'object', 'embed']}
            urlTransform={(url) => {
              // Only allow safe URLs
              if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
                return url;
              }
              return '';
            }}
          >
            {sanitizedMarkdown}
          </ReactMarkdown>
        </div>
      );

    case 'html':
      const sanitizedHtml = sanitizeHtml(content);
      return (
        <div 
          className={className}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      );

    case 'text':
    default:
      return (
        <div className={className}>
          {content}
        </div>
      );
  }
};

export default SecureContentRenderer;
