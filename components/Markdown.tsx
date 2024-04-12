import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import {Twemoji as Emoji} from 'react-emoji-render';

const Markdown = ({
  children,
  onImageLoaded,
}: {
  children: string;
  onImageLoaded?: () => void;
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      components={{
        h1: ({node, ...props}) => (
          <h1 className="mb-4 text-2xl font-bold text-zinc-900" {...props} />
        ),
        p: ({node, children, ...props}) => {
          return (
            <p
              className="mb-2 text-sm leading-relaxed text-zinc-600 last:mb-0"
              {...props}
            >
              {typeof children === 'string' ? (
                <Emoji className="Emoji" text={children} />
              ) : (
                children
              )}
            </p>
          );
        },
        a: ({node, ...props}) => (
          <a
            className="underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        img: ({node, ...props}) => {
          return (
            <span className="flex max-h-80 max-w-80 items-center justify-center overflow-hidden rounded bg-zinc-900">
              <img className="object-fit" {...props} onLoad={onImageLoaded} />
            </span>
          );
        },
        pre: ({node, ...props}) => {
          return <pre className="whitespace-break-spaces" {...props} />;
        },
        ul: ({node, ...props}) => (
          <ul
            // style={{paddingLeft: props.depth * 24}}
            className="mb-2 list-inside list-disc"
            {...props}
          />
        ),
        ol: ({node, ...props}) => (
          <ol className="mb-2 list-decimal" {...props} />
        ),
        table: ({node, ...props}) => (
          <div>
            <table
              className="mb-2 divide-y divide-zinc-700 border border-zinc-700"
              {...props}
            />
          </div>
        ),
        tbody: ({node, ...props}) => (
          <tbody className="divide-y divide-zinc-700" {...props} />
        ),
        th: ({node, ...props}) => (
          <th className="px-3 py-2 text-left" {...props} />
        ),
        td: ({node, ...props}) => (
          <td className="px-3 py-2 align-top" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
