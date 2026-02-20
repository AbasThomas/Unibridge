const LOCAL_FALLBACK_URL = "http://localhost:3000";

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getSiteUrl(explicitOrigin?: string): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (envUrl) {
    return stripTrailingSlash(envUrl);
  }

  if (explicitOrigin) {
    return stripTrailingSlash(explicitOrigin);
  }

  if (typeof window !== "undefined") {
    return stripTrailingSlash(window.location.origin);
  }

  return LOCAL_FALLBACK_URL;
}

export function getAuthCallbackUrl(explicitOrigin?: string): string {
  return `${getSiteUrl(explicitOrigin)}/auth/callback`;
}
