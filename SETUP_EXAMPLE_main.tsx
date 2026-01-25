/**
 * EXAMPLE: React Query Setup in main.tsx
 *
 * This file shows how to properly set up React Query for Contentful integration.
 * Copy this pattern into your actual src/main.tsx file.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Create a client for React Query
// This handles caching, refetching, and state management
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Retry failed requests twice before showing error
            retry: 2,
            // Stale time: Consider data fresh for 5 minutes
            staleTime: 1000 * 60 * 5,
            // GC time: Keep unused data in cache for 10 minutes
            gcTime: 1000 * 60 * 10,
            // Refetch data when window regains focus
            refetchOnWindowFocus: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
)

/**
 * EXPLANATION:
 *
 * 1. QueryClient Creation:
 *    - Creates a single instance to manage all queries
 *    - Configuration applies to all queries unless overridden
 *
 * 2. Default Options:
 *    - retry: 2 - Automatically retry failed requests
 *    - staleTime: 5 min - Data considered fresh for 5 minutes
 *    - gcTime: 10 min - Keep data in memory for 10 minutes
 *    - refetchOnWindowFocus: true - Refresh when tab gains focus
 *    - refetchOnMount: false - Don't refetch if data exists
 *
 * 3. QueryClientProvider:
 *    - Wraps the entire app
 *    - Makes QueryClient available to all components via useQuery
 *    - Must be at the root level
 *
 * 4. Why this matters:
 *    - Automatic caching reduces API calls
 *    - Retry logic handles transient failures
 *    - Window focus handling keeps data fresh
 *    - Consistent behavior across all queries
 */
