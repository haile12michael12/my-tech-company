import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Clock, User, ArrowRight, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = ["All", "Engineering", "AI & ML", "Cloud", "Security", "Company News"];

const posts = [
  {
    title: "Building Scalable Microservices with Kubernetes",
    excerpt:
      "Learn how to design and deploy microservices architectures that can scale to millions of users using Kubernetes and Docker.",
    image: "bg-gradient-to-br from-blue-500 to-cyan-500",
    author: "Yonas Tekle",
    date: "Jan 15, 2024",
    readTime: "8 min read",
    category: "Engineering",
    tags: ["Kubernetes", "Docker", "DevOps"],
    featured: true,
  },
  {
    title: "The Future of AI in African Tech",
    excerpt:
      "Exploring how artificial intelligence is transforming businesses across Africa and creating new opportunities for innovation.",
    image: "bg-gradient-to-br from-purple-500 to-pink-500",
    author: "Dr. Abeba Mekonnen",
    date: "Jan 12, 2024",
    readTime: "6 min read",
    category: "AI & ML",
    tags: ["AI", "Africa", "Innovation"],
    featured: true,
  },
  {
    title: "Securing Your Cloud Infrastructure: Best Practices",
    excerpt:
      "Essential security practices for protecting your cloud infrastructure from modern threats and vulnerabilities.",
    image: "bg-gradient-to-br from-green-500 to-emerald-500",
    author: "Dawit Solomon",
    date: "Jan 10, 2024",
    readTime: "10 min read",
    category: "Security",
    tags: ["Security", "Cloud", "Best Practices"],
  },
  {
    title: "React Server Components: A Deep Dive",
    excerpt:
      "Understanding React Server Components and how they can improve your application's performance and user experience.",
    image: "bg-gradient-to-br from-cyan-500 to-teal-500",
    author: "Meron Hailu",
    date: "Jan 8, 2024",
    readTime: "12 min read",
    category: "Engineering",
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    title: "NovaTech Expands to Nairobi",
    excerpt:
      "We're excited to announce the opening of our new office in Nairobi, Kenya, as we continue our expansion across East Africa.",
    image: "bg-gradient-to-br from-amber-500 to-orange-500",
    author: "NovaTech Team",
    date: "Jan 5, 2024",
    readTime: "3 min read",
    category: "Company News",
    tags: ["Company", "Expansion", "Kenya"],
  },
  {
    title: "Implementing Zero-Trust Security Architecture",
    excerpt:
      "A comprehensive guide to implementing zero-trust security in your organization for maximum protection.",
    image: "bg-gradient-to-br from-red-500 to-rose-500",
    author: "Kebede Assefa",
    date: "Jan 3, 2024",
    readTime: "15 min read",
    category: "Security",
    tags: ["Security", "Zero Trust", "Architecture"],
  },
];

const Blog = () => {
  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Blog & Insights
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tech Insights & Company Updates
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Stay updated with the latest technology trends, best practices, 
              and news from our team.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-12 h-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <article
                key={post.title}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className={cn("aspect-video relative", post.image)}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-xl font-bold opacity-75">
                      Featured Image
                    </div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-primary">
                    Featured
                  </Badge>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{post.author}</div>
                        <div className="text-xs text-muted-foreground">{post.date}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <article
                key={post.title}
                className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className={cn("aspect-video relative", post.image)}>
                  <Badge className="absolute top-3 left-3 bg-white/20 text-white border-0">
                    {post.category}
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-8">
              Get the latest articles and insights delivered to your inbox weekly.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="h-12" />
              <Button className="bg-gradient-primary h-12 px-6">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
