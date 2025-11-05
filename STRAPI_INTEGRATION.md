# Strapi Authentication Integration

This project was updated to use Strapi's built-in authentication instead of Supabase.

Files changed/added:

- `lib/strapi/auth.ts` - helper functions: `strapiLogin`, `strapiRegister`, `setAuthToken`, `getAuthToken`, `removeAuthToken`, `fetchMe`
- `app/auth/login/page.jsx` - login page now calls `strapiLogin` and stores the JWT
- `app/auth/signup/page.jsx` - signup page now calls `strapiRegister` and stores the JWT if returned
- `app/auth/logout/page.jsx` - clears token and redirects
- `components/UserProfileClient.jsx` - client component that reads token, fetches `/api/users/me`, and shows sign out

Environment variable:

- Add `NEXT_PUBLIC_STRAPI_URL` to your `.env` (example):

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

Notes:

- For development we store the JWT in a non-HttpOnly cookie and localStorage for ease. For production, prefer server-side HttpOnly cookies set from a secure route.
- Strapi registration at `/api/auth/local/register` may require email confirmation depending on Strapi settings. If email confirmation is enabled, registration may return a user object without `jwt` until the email is confirmed.

Testing:

1. Start Strapi (default `http://localhost:1337`).
2. Start this Next.js app: `npm run dev`.
3. Go to `http://localhost:3000/auth/signup` and register.
4. If jwt is returned, you'll be redirected to `/students`.
5. If no jwt is returned, check your Strapi auth settings (email confirmation).
6. Login at `http://localhost:3000/auth/login`.
7. Visit `http://localhost:3000/test-auth` to see the current user (server-side check).

Security:

- This integration is intended as a development convenience. For production use:
  - Set tokens via server-side endpoints and HttpOnly cookies.
  - Use CSRF protections if needed.

If you want, I can convert token storage to server-side HttpOnly cookies and create API route handlers for login/register/logout which will set/clear cookies securely. Let me know.
