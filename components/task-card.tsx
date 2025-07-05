"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { TaskForm } from "./task-form"
import type { Task } from "./task-board"

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
  }

  const handleStatusChange = (newStatus: Task["status"]) => {
    onUpdate(task.id, { status: newStatus })
  }

  const handleEdit = (updates: Partial<Task>) => {
    onUpdate(task.id, updates)
    setIsEditing(false)
  }

  if (isEditing) {
    return <TaskForm task={task} onSubmit={handleEdit} onCancel={() => setIsEditing(false)} />
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600 dark:text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}

        <div className="flex items-center justify-between">
          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>

          <div className="flex gap-1">
            {task.status !== "todo" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("todo")}
                className="text-xs px-2 py-1 h-auto"
              >
                To Do
              </Button>
            )}
            {task.status !== "in-progress" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("in-progress")}
                className="text-xs px-2 py-1 h-auto"
              >
                In Progress
              </Button>
            )}
            {task.status !== "done" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("done")}
                className="text-xs px-2 py-1 h-auto"
              >
                Done
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Created {new Date(task.createdAt).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  )
}
