import { Suspense } from "react"
import { TaskBoard } from "@/components/task-board"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">TaskFlow</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your tasks efficiently with our modern task management system
            </p>
          </div>

          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <TaskBoard />
          </Suspense>
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  )
}
