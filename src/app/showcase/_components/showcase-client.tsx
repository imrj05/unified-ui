"use client";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { baseOptions } from "@/app/layout.config";
import { FooterSection } from "@/components/home/footer-section";
import { HomeLayout } from "@/components/layout/home";
import { Nav } from "@/components/layout/nav";
import { cn } from "@/lib/cn";

const SHOWCASE_PROJECTS = [
  {
    title: "Nebula Dashboard",
    category: "Enterprise",
    description:
      "A comprehensive analytics platform for data-heavy applications with real-time monitoring.",
    image:
      "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=2070&auto=format&fit=crop",
    tags: ["React 19", "Orama Search", "Radix UI"],
    link: "#",
  },
  {
    title: "Velocity OS",
    category: "Developer Tools",
    description:
      "High-performance IDE for web-based development environments with integrated version control.",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98aadebc25a?q=80&w=2088&auto=format&fit=crop",
    tags: ["Next.js 16", "Tailwind CSS", "Monaco"],
    link: "#",
  },
  {
    title: "Krypton Flow",
    category: "Fintech",
    description:
      "Secure, real-time transaction monitoring and asset management system for digital currencies.",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2232&auto=format&fit=crop",
    tags: ["D3.js", "Zustand", "Unified UI"],
    link: "#",
  },
  {
    title: "Genesis LMS",
    category: "Education",
    description:
      "A fast, accessible learning management system built for scalability and customizability.",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop",
    tags: ["Fumadocs", "PostgreSQL", "React"],
    link: "#",
  },
  {
    title: "Apex Media",
    category: "Entertainment",
    description:
      "Dynamic video streaming platform with intelligent content discovery and personalization.",
    image:
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=2070&auto=format&fit=crop",
    tags: ["Motion", "HLS.js", "Shadow UI"],
    link: "#",
  },
  {
    title: "Zenith Design",
    category: "Creative",
    description:
      "Portfolio management and designer-first showcase tool with unique interactive transitions.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    tags: ["Gsap", "React Three Fiber", "UI"],
    link: "#",
  },
];
export default function ShowcaseClient() {
  const [activeFilter, setActiveFilter] = useState("All Products");
  const filteredProjects =
    activeFilter === "All Products"
      ? SHOWCASE_PROJECTS
      : SHOWCASE_PROJECTS.filter((p) => p.category === activeFilter);
  return (
    <HomeLayout
      {...baseOptions}
      nav={{
        ...baseOptions.nav,
        component: <Nav />,
      }}
    >
      <div className="relative flex flex-col min-h-screen">
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 border-b border-fd-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fd-primary/5 border border-fd-primary/10 text-[10px] md:text-xs font-bold mb-8 uppercase tracking-widest text-fd-primary">
              The Showcase
            </div>
            <h1 className="text-4xl sm:text-7xl font-bold tracking-tight text-fd-foreground mb-6 leading-tight">
              Built with <span className="text-fd-primary">Unified UI</span>
            </h1>
            <p className="text-lg sm:text-xl text-fd-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Explore the next generation of web applications. From startups to
              enterprises, discover how teams are shipping faster.
            </p>
          </div>
        </section>
        {/* Filter / Stats Bar */}
        <div className="sticky top-[64px] z-40 bg-fd-background/80 backdrop-blur-md border-b border-fd-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {["All Products", "Enterprise", "Creative", "Fintech"].map(
                (f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300",
                      activeFilter === f
                        ? "bg-fd-foreground text-fd-background border-fd-foreground"
                        : "bg-fd-background text-fd-muted-foreground border-fd-border hover:border-fd-primary/50",
                    )}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
            <div className="text-[10px] md:text-xs font-mono text-fd-muted-foreground uppercase tracking-widest">
              Showing {filteredProjects.length} curated projects
            </div>
          </div>
        </div>
        {/* Projects Grid */}
        <main className="flex-1 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {filteredProjects.map((project, _idx) => (
                <div
                  key={project.title}
                  className="group flex flex-col items-start"
                >
                  <div className="relative w-full aspect-[16/10] mb-6 rounded-3xl overflow-hidden border border-fd-border/50 bg-fd-card/50">
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-fd-primary/10 transition-colors duration-500" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-fd-background/20 to-transparent" />
                    <Link
                      href={project.link}
                      className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-fd-background/90 backdrop-blur shadow-xl flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none lg:pointer-events-auto"
                    >
                      <ArrowUpRight className="w-5 h-5 text-fd-foreground" />
                    </Link>
                  </div>
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-fd-primary">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-fd-foreground tracking-tight group-hover:text-fd-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-fd-muted-foreground font-light leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-fd-secondary text-fd-secondary-foreground text-[10px] font-medium border border-fd-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Submit CTA */}
            <div className="mt-32 p-12 sm:p-20 rounded-[3rem] border border-fd-border bg-fd-card/30 backdrop-blur-sm relative overflow-hidden text-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-br from-fd-primary/5 to-transparent -z-10" />
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
                Built something incredible?
              </h2>
              <p className="text-lg text-fd-muted-foreground mb-10 max-w-xl mx-auto font-light leading-relaxed">
                Join the ranks of world-class developers. Submit your project to
                be featured in our official showcase.
              </p>
              <button
                type="button"
                className="px-8 py-3 rounded-full bg-fd-foreground text-fd-background font-bold hover:opacity-90 transition-all shadow-xl shadow-fd-foreground/10"
              >
                Submit Your Project
              </button>
            </div>
          </div>
        </main>
        <FooterSection />
      </div>
    </HomeLayout>
  );
}
