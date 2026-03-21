import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { ImageUpload } from "@/components/ui/image-upload";

const categories = ["Technology", "Case Study", "Cloud", "Design", "Security", "Business"];

interface BlogPostEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogPostEditor = ({ isOpen, onClose }: BlogPostEditorProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("alemayehu");
  const [status, setStatus] = useState("draft");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | undefined>();

  const handleSaveDraft = () => {
    console.log("Saving draft:", { title, category, author, status, content, featuredImage });
    onClose();
  };

  const handlePublish = () => {
    console.log("Publishing:", { title, category, author, status: "published", content, featuredImage });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="Enter an engaging title..."
              className="text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Meta */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Select value={author} onValueChange={setAuthor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alemayehu">Alemayehu Tadesse</SelectItem>
                  <SelectItem value="sarah">Sarah Bekele</SelectItem>
                  <SelectItem value="yonas">Yonas Getachew</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            <ImageUpload
              value={featuredImage}
              onChange={setFeaturedImage}
              aspectRatio="video"
              recommendedSize="1200x630px"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your blog post content here..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Clock className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="bg-gradient-primary" onClick={handlePublish}>
                Publish Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostEditor;
