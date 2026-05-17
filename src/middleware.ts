import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

/** Routes (after stripping locale prefix) that require authentication */
const PROTECTED_ROUTES = ["/profile"];

/** Strip the locale prefix from a pathname, e.g. "/fr/profile" → "/profile" */
function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(fr|ar)/, "") || "/";
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = stripLocale(pathname);

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/")
  );

  if (isProtected) {
    const session = request.cookies.get("afya_session");
    if (!session?.value) {
      // Detect locale from path prefix, default to "fr"
      const locale = pathname.startsWith("/ar") ? "ar" : "fr";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
