<!-- BEGIN:project-rules -->

# Application Architecture Rules

This project uses:

- Next.js App Router (NO pages router)
- .NET API as primary backend
- React Query for client-side data fetching
- Feature-based architecture

## Rules

- Do NOT use pages/ router
- Do NOT use getServerSideProps or getStaticProps
- All API calls go through shared/api/baseClient.ts
- Business logic must live inside features/
- UI components must be reusable via shared/components/
- Server-side logic goes inside server/

## Data Flow

UI → hooks → services → .NET API

## Realtime

SignalR connections must stay inside feature folders

<!-- END:project-rules -->
