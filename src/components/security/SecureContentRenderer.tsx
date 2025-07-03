
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { sanitizeHtml, sanitizeMarkdown, validateUrl } from '@/services/security/inputSanitizer';

interface SecureContentRendererProps {
  content: string;
  type?: 'markdown' | 'html' | 'text';
  className?: string;
  allowedElements?: string[];
  maxLength?: number;
}

/**
 * Enhanced secure content renderer that safely displays user-generated content
 * without XSS vulnerabilities - now with additional security validations
 */
export const SecureContentRenderer: React.FC<SecureContentRendererProps> = ({
  content,
  type = 'markdown',
  className = '',
  allowedElements,
  maxLength = 50000
}) => {
  // Input validation - prevent processing of excessively large content
  if (!content) {
    return <div className={className}>No content available</div>;
  }

  if (content.length > maxLength) {
    console.warn(`Content length (${content.length}) exceeds maximum allowed (${maxLength})`);
    return <div className={className}>Content too large to display safely</div>;
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
            disallowedElements={['script', 'iframe', 'object', 'embed', 'form', 'input']}
            urlTransform={(url) => {
              // Enhanced URL validation
              if (!validateUrl(url)) {
                console.warn(`Blocked invalid URL: ${url}`);
                return '';
              }
              // Only allow safe URLs
              if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
                return url;
              }
              return '';
            }}
            transformLinkUri={(uri) => {
              // Additional link security - ensure all external links open safely
              if (uri.startsWith('http://') || uri.startsWith('https://')) {
                return uri;
              }
              if (uri.startsWith('/')) {
                return uri;
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
      // Even for plain text, sanitize to prevent any potential issues
      const sanitizedText = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
      
      return (
        <div className={className}>
          {sanitizedText}
        </div>
      );
  }
};

export default SecureContentRenderer;
