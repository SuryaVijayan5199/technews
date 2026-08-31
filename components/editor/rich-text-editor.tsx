"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  ImageIcon,
  Loader2,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [isUploading, setIsUploading] = React.useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  if (!editor) return null;

  return (
    <div className="tiptap-toolbar">
      <div className="tiptap-toolbar__group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`tiptap-btn ${editor.isActive("bold") ? "is-active" : ""}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`tiptap-btn ${editor.isActive("italic") ? "is-active" : ""}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`tiptap-btn ${editor.isActive("strike") ? "is-active" : ""}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      <div className="tiptap-toolbar__divider" />

      <div className="tiptap-toolbar__group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`tiptap-btn ${editor.isActive("heading", { level: 2 }) ? "is-active" : ""}`}
          title="Heading 2"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`tiptap-btn ${editor.isActive("heading", { level: 3 }) ? "is-active" : ""}`}
          title="Heading 3"
        >
          <Heading2 className="w-4 h-4" />
        </button>
      </div>

      <div className="tiptap-toolbar__divider" />

      <div className="tiptap-toolbar__group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`tiptap-btn ${editor.isActive("bulletList") ? "is-active" : ""}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`tiptap-btn ${editor.isActive("orderedList") ? "is-active" : ""}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`tiptap-btn ${editor.isActive("blockquote") ? "is-active" : ""}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>

      <div className="tiptap-toolbar__divider" />

      <div className="tiptap-toolbar__group">
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)
            
            if (url === null) return
            
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
              return
            }
            
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
          }}
          className={`tiptap-btn ${editor.isActive("link") ? "is-active" : ""}`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <label className="tiptap-btn cursor-pointer flex items-center justify-center" title="Upload Image">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
        
        <input
          type="color"
          onInput={(event: any) => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes("textStyle").color || "#000000"}
          className="tiptap-color-picker"
          title="Text Color"
        />
      </div>

      <div className="tiptap-toolbar__spacer" />

      <div className="tiptap-toolbar__group">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="tiptap-btn"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="tiptap-btn"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
    ],
    content: content || `<p></p>`, // Ensure paragraph exists
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="tiptap-wrapper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
