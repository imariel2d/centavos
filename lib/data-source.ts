import "server-only";

// Toggle: set USE_MOCK_DATA=true in .env.local to bypass Directus and serve
// data from data/mock.ts. Default is Directus (the production path).
export const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";
