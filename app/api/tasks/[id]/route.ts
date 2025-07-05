import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock task database - in a real app, this would be a proper database
const MOCK_TASKS = [
  {
    id: "1",
    title: "Setup project structure",
    description: "Create the initial project structure with TypeScript and React",
    status: "done" as const,
    priority: "high" as const,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    userId: "1",
  },
  {
    id: "2",
    title: "Implement authentication",
    description: "Add user login and session management",
    status: "in-progress" as const,
    priority: "high" as const,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    userId: "1",
  },
  {
    id: "3",
    title: "Design task board UI",
    description: "Create responsive task board with drag and drop",
    status: "todo" as const,
    priority: "medium" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "1",
  },
]

async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return session.userId
  } catch {
    return null
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const userId = await getAuthenticatedUser()

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const updates = await request.json()
    const taskIndex = MOCK_TASKS.findIndex((task) => task.id === id && task.userId === userId)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    MOCK_TASKS[taskIndex] = {
      ...MOCK_TASKS[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(MOCK_TASKS[taskIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const userId = await getAuthenticatedUser()

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const taskIndex = MOCK_TASKS.findIndex((task) => task.id === id && task.userId === userId)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    MOCK_TASKS.splice(taskIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
