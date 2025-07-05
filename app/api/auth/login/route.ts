import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database - in a real app, this would be a proper database
const MOCK_USERS = [
  {
    id: "1",
    email: "demo@example.com",
    password: "demo123", // In real app, this would be hashed
    name: "Demo User",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user (in real app, compare hashed passwords)
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set session cookie (in real app, use proper JWT or session management)
    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify({ userId: user.id }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
