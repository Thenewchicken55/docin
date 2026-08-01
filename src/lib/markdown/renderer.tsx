import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import type { Components } from 'react-markdown';
import { useEffect, useRef } from 'react';

const components: Components = {
  table: ({ children, ...props }) => (
    <div className="md-table-wrapper">
      <table {...props}>{children}</table>
    </div>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <div className="md-code-block-wrapper">
          <code className={className} {...props}>{children}</code>
        </div>
      );
    }
    return (
      <code className="md-inline-code" {...props}>{children}</code>
    );
  },
  a: ({ href, children, ...props }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="md-blockquote" {...props}>{children}</blockquote>
  ),
};

type MarkdownPreviewProps = {
  content: string;
  className?: string;
};

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const headings = containerRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        if (!heading.id) {
          const text = heading.textContent || '';
          heading.id = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        }
      });
    }
  }, [content]);

  return (
    <div ref={containerRef} className={`md-preview ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
