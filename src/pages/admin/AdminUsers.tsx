import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  Shield,
  UserCheck,
  UserX,
  Download,
  Filter,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const users = [
  {
    id: 1,
    name: "Alemayehu Tadesse",
    email: "alemayehu@novatech.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2 hours ago",
    avatar: "AT",
  },
  {
    id: 2,
    name: "Sarah Bekele",
    email: "sarah@novatech.com",
    role: "Editor",
    status: "Active",
    lastLogin: "5 hours ago",
    avatar: "SB",
  },
  {
    id: 3,
    name: "Yonas Getachew",
    email: "yonas@novatech.com",
    role: "Editor",
    status: "Active",
    lastLogin: "1 day ago",
    avatar: "YG",
  },
  {
    id: 4,
    name: "Meron Hailu",
    email: "meron@novatech.com",
    role: "Viewer",
    status: "Inactive",
    lastLogin: "2 weeks ago",
    avatar: "MH",
  },
  {
    id: 5,
    name: "Daniel Asfaw",
    email: "daniel@novatech.com",
    role: "Editor",
    status: "Active",
    lastLogin: "3 hours ago",
    avatar: "DA",
  },
  {
    id: 6,
    name: "Tigist Worku",
    email: "tigist@novatech.com",
    role: "Admin",
    status: "Active",
    lastLogin: "Just now",
    avatar: "TW",
  },
  {
    id: 7,
    name: "Abebe Kebede",
    email: "abebe@client.com",
    role: "Client",
    status: "Active",
    lastLogin: "Yesterday",
    avatar: "AK",
  },
  {
    id: 8,
    name: "Helen Tadesse",
    email: "helen@partner.com",
    role: "Client",
    status: "Pending",
    lastLogin: "Never",
    avatar: "HT",
  },
];

const roles = ["Admin", "Editor", "Viewer", "Client"];

const AdminUsers = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AdminLayout title="User Management">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role.toLowerCase()}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select defaultValue="viewer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role.toLowerCase()}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Send Invitation Email</div>
                    <div className="text-xs text-muted-foreground">
                      User will receive login credentials
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-primary">Create User</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: "156", icon: Shield, color: "text-primary" },
          { label: "Active Users", value: "142", icon: UserCheck, color: "text-success" },
          { label: "Inactive", value: "12", icon: UserX, color: "text-muted-foreground" },
          { label: "Pending Invite", value: "2", icon: Mail, color: "text-warning" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-4 border border-border flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                      {user.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      user.role === "Admin" && "border-primary text-primary",
                      user.role === "Editor" && "border-secondary text-secondary-foreground",
                      user.role === "Client" && "border-accent text-accent-foreground"
                    )}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      user.status === "Active" && "bg-success",
                      user.status === "Inactive" && "bg-muted text-muted-foreground",
                      user.status === "Pending" && "bg-warning"
                    )}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="w-4 h-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
