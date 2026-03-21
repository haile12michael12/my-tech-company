import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import { ImageCropDialog } from "@/components/ui/image-crop-dialog";

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({
  content = "",
  onChange,
  placeholder = "Write your content here...",
  className,
}: RichTextEditorProps) => {
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setPendingImage(url);
        setShowCropDialog(true);
      };
      reader.readAsDataURL(file);

      // Reset input
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    },
    []
  );

  const handleCropComplete = useCallback(
    (croppedImageUrl: string) => {
      if (!editor) return;
      editor.chain().focus().setImage({ src: croppedImageUrl }).run();
      setPendingImage(null);
    },
    [editor]
  );

  const handleCropCancel = useCallback(() => {
    setShowCropDialog(false);
    setPendingImage(null);
  }, []);

  const addImageFromUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");

    if (url) {
      // For URL images, insert directly without cropping
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Headings */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("heading", { level: 1 }) && "bg-accent")}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("heading", { level: 2 }) && "bg-accent")}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("heading", { level: 3 }) && "bg-accent")}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("bold") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("italic") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("code") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("bulletList") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("orderedList") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("blockquote") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Link & Image */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", editor.isActive("link") && "bg-accent")}
          onClick={setLink}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => imageInputRef.current?.click()}
          title="Upload image"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={addImageFromUrl}
          title="Add image from URL"
        >
          URL
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Image Crop Dialog */}
      <ImageCropDialog
        isOpen={showCropDialog}
        onClose={handleCropCancel}
        imageSrc={pendingImage || ""}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default RichTextEditor;
