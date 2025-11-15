import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Create response with cleared cookies
    const response = NextResponse.json({ success: true }, { status: 200 })

    // Clear authentication cookies
    response.cookies.set("auth_token", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
    })

    response.cookies.set("user_session", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
