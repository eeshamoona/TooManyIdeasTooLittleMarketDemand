import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// NOTE: Add public routes here
const publicRoutes = ["/", "/signup", "/login", "/error", "/check-email"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requestedPath = request.nextUrl.pathname;

  // Redirect logged-in users to `/write` if they access public routes, except for "/"
  if (user && publicRoutes.includes(requestedPath) && requestedPath !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/write";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to `/signup` if they access protected routes
  if (
    !user &&
    !publicRoutes.includes(requestedPath) &&
    !requestedPath.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/signup";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is
  return supabaseResponse;
}
