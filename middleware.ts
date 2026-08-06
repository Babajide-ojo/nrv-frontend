import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Chrome DevTools – return empty JSON so the request doesn't 404
  if (pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
    return NextResponse.json({});
  }

  // react-toastify source maps – return 204 so the request doesn't 404
  if (
    pathname.endsWith('.map') &&
    (pathname.includes('react-toastify') || pathname.includes('ReactToastify'))
  ) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.next();
}
