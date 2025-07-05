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

export async function GET() {
  try {
    const userId = await getAuthenticatedUser()

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userTasks = MOCK_TASKS.filter((task) => task.userId === userId)
    return NextResponse.json(userTasks)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser()

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { title, description, status, priority } = await request.json()

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      status,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    }

    MOCK_TASKS.push(newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
