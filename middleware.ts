import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN" || token?.role === "SUPER_ADMIN"
    const isAuth = !!token
    
    // Protect /admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url))
      }
      if (!isAdmin) {
        // Logged in but not admin
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Protect /checkout routes - WAJIB login atau register sebelum memesan
    if (req.nextUrl.pathname.startsWith("/checkout")) {
      if (!isAuth) {
        const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)
        return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url))
      }
    }
  },
  {
    callbacks: {
      // Required to trigger middleware function above
      authorized: () => true 
    }
  }
)

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"]
}
