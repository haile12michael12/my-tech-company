import { useState, useEffect, useRef } from "react";
import { FileText, Image, FileCode, FileSpreadsheet, Download, Upload, FolderOpen, Search, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FileRecord {
  id: string;
  file_name: string;
  file_type: string | null;
  file_size: string | null;
  project_name: string | null;
  uploaded_by: string | null;
  storage_path: string | null;
  created_at: string;
}

const getFileIcon = (type: string | null) => {
  switch (type) {
    case "image": return <Image className="w-5 h-5 text-emerald-500" />;
    case "code": return <FileCode className="w-5 h-5 text-blue-500" />;
    case "spreadsheet": return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    default: return <FileText className="w-5 h-5 text-primary" />;
  }
};

const getFileType = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["js", "ts", "tsx", "py", "sql", "md", "html", "css", "json"].includes(ext)) return "code";
  if (["xlsx", "xls", "csv"].includes(ext)) return "spreadsheet";
  return "document";
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const PortalFiles = () => {
  const { user, profile } = useAuth();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("project_files")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load files");
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("portal-files")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("project_files").insert({
      client_id: user.id,
      file_name: file.name,
      file_type: getFileType(file.name),
      file_size: formatFileSize(file.size),
      storage_path: filePath,
      uploaded_by: profile?.display_name || user.email || "Unknown",
    });

    if (dbError) {
      toast.error("Failed to save file record");
    } else {
      toast.success("File uploaded successfully");
      fetchFiles();
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = async (file: FileRecord) => {
    if (!file.storage_path) return;

    const { data, error } = await supabase.storage
      .from("portal-files")
      .download(file.storage_path);

    if (error || !data) {
      toast.error("Download failed");
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file_name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (file: FileRecord) => {
    if (!file.storage_path) return;

    const { error: storageError } = await supabase.storage
      .from("portal-files")
      .remove([file.storage_path]);

    if (storageError) {
      toast.error("Failed to delete file");
      return;
    }

    const { error: dbError } = await supabase
      .from("project_files")
      .delete()
      .eq("id", file.id);

    if (dbError) {
      toast.error("Failed to remove file record");
    } else {
      toast.success("File deleted");
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    }
  };

  const filtered = files.filter((f) =>
    f.file_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Files & Documents</h1>
          <p className="text-muted-foreground">Access all project files, deliverables, and shared documents.</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search files..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No files yet</p>
          <p className="text-sm">Upload your first file to get started.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.file_type)}
                      <span className="font-medium">{file.file_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{file.project_name || "General"}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{file.file_size || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{file.uploaded_by || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(file.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(file)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(file)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PortalFiles;
