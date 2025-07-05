"use client"

import { TaskCard } from "./task-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task } from "./task-board"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  status: Task["status"]
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export function TaskColumn({ title, tasks, status, onUpdateTask, onDeleteTask }: TaskColumnProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={getStatusColor(status)}>{tasks.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tasks yet</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />)
        )}
      </CardContent>
    </Card>
  )
}
