"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";
import { HelpLabel } from "./HelpTip";

type EditorCommand = {
  command: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  value?: string;
};

const commands: EditorCommand[] = [
  { command: "bold", label: "Bold", icon: Bold },
  { command: "italic", label: "Italic", icon: Italic },
  { command: "underline", label: "Underline", icon: Underline },
  { command: "strikeThrough", label: "Strikethrough", icon: Strikethrough },
  { command: "insertUnorderedList", label: "Bullets", icon: List },
  { command: "insertOrderedList", label: "Numbered list", icon: ListOrdered },
  { command: "formatBlock", value: "blockquote", label: "Quote", icon: Quote },
  { command: "formatBlock", value: "h2", label: "Heading", icon: Heading1 },
  { command: "formatBlock", value: "h3", label: "Subheading", icon: Heading2 },
];

export function RichDescriptionEditor({
  defaultHtml = "",
  label = "Description",
}: {
  defaultHtml?: string | null;
  label?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(defaultHtml || "");
  const [text, setText] = useState("");

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = defaultHtml || "";
    setText(editorRef.current.innerText.trim());
  }, [defaultHtml]);

  useEffect(() => {
    const editor = editorRef.current;
    const form = editor?.closest("form");
    if (!editor || !form) return;

    const onReset = () => {
      requestAnimationFrame(() => {
        editor.innerHTML = "";
        setHtml("");
        setText("");
      });
    };

    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  const syncValue = () => {
    const editor = editorRef.current;
    if (!editor) return;
    setHtml(editor.innerHTML);
    setText(editor.innerText.trim());
  };

  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncValue();
  };

  return (
    <div className="flex flex-col gap-2">
      <HelpLabel
        help="Optional rich description. Use formatting when a transaction needs more context than the table note."
        className="mb-0"
      >
        {label}
      </HelpLabel>
      <input type="hidden" name="description_html" value={html} />
      <input type="hidden" name="description_text" value={text} />
      <div className="overflow-hidden rounded-lg border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark)">
        <div className="flex flex-wrap gap-1 border-b border-(--color-hairline-on-dark) bg-(--color-surface-elevated-dark)/70 p-1.5">
          {commands.map(({ command, value, label: commandLabel, icon: Icon }) => (
            <button
              key={`${command}-${value || "default"}`}
              type="button"
              onClick={() => runCommand(command, value)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-(--color-muted) transition-colors hover:bg-(--color-surface-card-dark) hover:text-(--color-on-dark)"
              title={commandLabel}
              aria-label={commandLabel}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncValue}
          onBlur={syncValue}
          className="rich-description-editor min-h-32 w-full overflow-y-auto px-3 py-3 text-body-md text-(--color-on-dark) outline-none"
          data-placeholder="Add formatted context, bullets, headings, links, or reminders..."
        />
      </div>
    </div>
  );
}

export function RichDescriptionView({ html }: { html?: string | null }) {
  if (!html) {
    return <p className="text-body-sm text-(--color-muted)">No rich description added.</p>;
  }

  return (
    <div
      className="rich-description-view text-body-md text-(--color-on-dark)"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
