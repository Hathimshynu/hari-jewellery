import { Fragment, type ReactNode } from "react";

type HeadingTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface MaskLinesProps {
  as?: HeadingTag;
  lines: ReactNode[];
  className?: string;
  /** Adds data-reveal="lines" so the line-by-line rise plays on scroll. */
  reveal?: boolean;
  lineClassName?: string;
  id?: string;
}

/** Multi-line display heading where each line rises from behind a mask. */
export function MaskLines({ as = "h2", lines, className, reveal = true, lineClassName, id }: MaskLinesProps) {
  const Tag = as;
  return (
    <Tag id={id} className={className} data-reveal={reveal ? "lines" : undefined}>
      {lines.map((line, i) => (
        <span key={i} className={`mask-line ${lineClassName ?? ""}`}>
          <span>
            {line}
            {i < lines.length - 1 ? " " : null}
          </span>
        </span>
      ))}
    </Tag>
  );
}

interface SplitWordsProps {
  as?: HeadingTag;
  text: string;
  className?: string;
}

/** Paragraph or heading revealed word by word. */
export function SplitWords({ as = "p", text, className }: SplitWordsProps) {
  const Tag = as;
  const words = text.split(" ");
  return (
    <Tag className={className} data-reveal="words">
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="word">
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className ?? ""}`}>{children}</p>;
}
