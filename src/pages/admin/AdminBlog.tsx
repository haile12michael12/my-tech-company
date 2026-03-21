import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import BlogPostEditor from "@/components/admin/BlogPostEditor";

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Ethiopian Tech Industry",
    author: "Alemayehu Tadesse",
    category: "Technology",
    status: "Published",
    date: "Jan 28, 2025",
    views: 1245,
  },
  {
    id: 2,
    title: "How We Built a Scalable E-commerce Platform",
    author: "Sarah Bekele",
    category: "Case Study",
    status: "Published",
    date: "Jan 25, 2025",
    views: 892,
  },
  {
    id: 3,
    title: "Cloud Migration: Best Practices for Enterprise",
    author: "Yonas Getachew",
    category: "Cloud",
    status: "Draft",
    date: "Jan 22, 2025",
    views: 0,
  },
  {
    id: 4,
    title: "Mobile-First Design Principles for African Markets",
    author: "Meron Hailu",
    category: "Design",
    status: "Published",
    date: "Jan 18, 2025",
    views: 2103,
  },
  {
    id: 5,
    title: "Securing Financial Applications in East Africa",
    author: "Daniel Asfaw",
    category: "Security",
    status: "Review",
    date: "Jan 15, 2025",
    views: 0,
  },
];

const AdminBlog = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AdminLayout title="Blog Posts">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setIsEditorOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
        <BlogPostEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Posts", value: "48", color: "bg-primary/10 text-primary" },
          { label: "Published", value: "42", color: "bg-success/10 text-success" },
          { label: "Drafts", value: "4", color: "bg-warning/10 text-warning" },
          { label: "Total Views", value: "24.5K", color: "bg-secondary/10 text-secondary-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-4 border border-border">
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="font-medium max-w-xs truncate">{post.title}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {post.author}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{post.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      post.status === "Published" && "bg-success",
                      post.status === "Draft" && "bg-muted text-muted-foreground",
                      post.status === "Review" && "bg-warning"
                    )}
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    {post.views.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
