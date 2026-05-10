# Rules for AI Coding Agents

## 1. Programming Language & Frameworks

- **Primary Language**: TypeScript (Strict Mode)
- **Main Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query (React Query)
- **Database**: PostgreSQL with Prisma
- **UI Components**: Use shadcn/ui components where appropriate

## 2. Project Structure (App Router)

- All pages must use the App Router (`/app` directory)
- Server Components by default, use `'use client'` only when necessary
- Route handlers: `app/api/.../route.ts`

## 3. Component Design

- **Server Components**: Default for data fetching and rendering
- **Client Components**: Mark with `'use client'` when using React hooks or browser APIs
- **File Naming**: PascalCase for components (`Button.tsx`), kebab-case for routes (`matches/page.tsx`)

## 4. API Conventions

- All API endpoints must be defined as Route Handlers in `app/api/.../route.ts`
- Use HTTP methods correctly (GET, POST, PATCH, DELETE)
- Return JSON responses
- Use proper error handling and status codes

## 5. Data Fetching

- Use TanStack Query for server-side data fetching
- Define custom hooks in `services/` directory
- Always handle loading and error states

## 6. Styling with Tailwind CSS v4

- Use utility classes for styling
- Do not use inline styles (except for dynamic values)
- All components should be responsive
- Prefer dark mode support

## 7. Best Practices

- **Code Quality**: Clean, modular, and maintainable code
- **Performance**: Optimize for speed and SEO
- **Security**: Handle authentication and authorization properly
- **Accessibility**: Follow ARIA guidelines

## 8. Important Notes

- This project uses Next.js 16 with TypeScript
- Always write type-safe code
- Update documentation as needed
- Test all code changes before considering them complete
