import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    // Don't throw on 401 errors - they just mean not authenticated
    throwOnError: (error: any) => {
      return !error.message?.includes("401");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
  };
}
