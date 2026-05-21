"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SidebarProvider } from "./contexts/SidebarContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Stops React Query from endlessly retrying failed API calls
        refetchOnWindowFocus: false, // Stops re-fetching when you click back to the browser tab
      },
    },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </QueryClientProvider>
  );
}
