/**
 * Public origin of the site, from Vercel's VERCEL_PROJECT_PRODUCTION_URL (the production domain as a bare
 * hostname, set automatically at build and run time). Undefined elsewhere, e.g. locally.
 */
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined;
