"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProjectDashboard from "@/components/ProjectDashboard";
import { supabase } from "@/lib/supabaseClient";
import { LoadingSpinner } from "@/components/ui/loading";
import type { Project } from "@/types";

// Error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (hasError) {
      console.error("Dashboard Error:", error);
    }
  }, [hasError, error]);

  if (hasError) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="bg-[#161b22] border border-red-600 rounded-lg p-8 max-w-md w-full">
          <h2 className="text-xl text-red-400 mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-4">
            {error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => setHasError(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    // Fetch projects
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user, loading, router]);

  const handleCreateProject = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name,
            user_id: user?.id,
            status: "draft",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setProjects((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Error creating project:", err);
      setError(err instanceof Error ? err.message : "Failed to create project");
    }
  };

  const handleOpenProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      // Navigate to project designer
      router.push(`/projects/${projectId}`);
    } catch (err) {
      console.error("Error opening project:", err);
      setError(err instanceof Error ? err.message : "Failed to open project");
    }
  };

  if (loading || loadingProjects) {
    return <LoadingSpinner message="Loading projects..." />;
  }

  // Check for errors and display them
  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="bg-[#161b22] border border-red-600 rounded-lg p-8 max-w-md w-full">
          <h2 className="text-xl text-red-400 mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ProjectDashboard
        projects={projects}
        onCreateProject={handleCreateProject}
        onOpenProject={handleOpenProject}
        error={error}
      />
    </ErrorBoundary>
  );
}
