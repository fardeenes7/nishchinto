"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
  IconH2,
  IconH3,
  IconLink,
} from "@tabler/icons-react";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { cn } from "@repo/ui/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your product description...",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "underline text-primary" },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon"
      className="size-7"
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div
      className={cn(
        "rounded-md border focus-within:ring-1 focus-within:ring-ring",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <IconBold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <IconItalic className="size-3.5" />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <IconH2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <IconH3 className="size-3.5" />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <IconList className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <IconListNumbers className="size-3.5" />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          <IconLink className="size-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />
      {!value && (
        <div className="pointer-events-none absolute top-[52px] left-3 text-muted-foreground text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
}
