"use client"

import { useState, useEffect } from "react"
import { TaskColumn } from "./task-column"
import { TaskForm } from "./task-form"
import { Button } from "@/components/ui/button"
import { Plus, LogOut } from "lucide-react"
import { useAuth } from "./auth-provider"
import { useToast } from "@/hooks/use-toast"

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const { user, logout } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks((prev) => [...prev, newTask])
        setShowTaskForm(false)
        toast({
          title: "Success",
          description: "Task created successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
        toast({
          title: "Success",
          description: "Task updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id))
        toast({
          title: "Success",
          description: "Task deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const doneTasks = tasks.filter((task) => task.status === "done")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Welcome back, {user?.name}!</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowTaskForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn title="To Do" tasks={todoTasks} status="todo" onUpdateTask={updateTask} onDeleteTask={deleteTask} />
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          status="in-progress"
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
        <TaskColumn title="Done" tasks={doneTasks} status="done" onUpdateTask={updateTask} onDeleteTask={deleteTask} />
      </div>

      {showTaskForm && <TaskForm onSubmit={createTask} onCancel={() => setShowTaskForm(false)} />}
    </div>
  )
}
