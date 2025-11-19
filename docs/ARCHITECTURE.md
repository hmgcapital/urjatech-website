# Architecture Overview

This document provides a high-level overview of the Urjatech Website architecture.

## 🏗️ System Overview

The application is a monolithic full-stack web application:
-   **Frontend**: Single Page Application (SPA) built with React.
-   **Backend**: Node.js/Express server that serves the API and the static frontend assets.
-   **Database**: PostgreSQL database accessed via Drizzle ORM.

## 🖥️ Frontend Architecture

### Directory Structure (`client/src`)

-   **`pages/`**: Top-level route components. Each file corresponds to a major view (Home, Products, About, etc.).
-   **`components/`**:
    -   **`ui/`**: Low-level, reusable UI components (Buttons, Inputs, Dialogs). Based on `shadcn/ui`.
    -   **`sections/`**: Larger, page-specific sections (Hero, Testimonials, Manufacturing). These compose UI components.
    -   **`layout/`**: Global layout components (Navbar, Footer).
-   **`hooks/`**: Custom React hooks (e.g., `use-mobile`, `use-toast`).
-   **`lib/`**: Utilities, including the API client (`queryClient.ts`) and helper functions (`utils.ts`).

### Key Concepts

-   **Routing**: Client-side routing is handled by `wouter`. It's lightweight and simple.
-   **Data Fetching**: `TanStack Query` (React Query) is used for server state management. It handles caching, loading states, and error handling for API requests.
-   **Styling**: Tailwind CSS is the primary styling engine. The `theme.json` and `tailwind.config.ts` define the design tokens (colors, fonts, spacing).

## ⚙️ Backend Architecture

### Directory Structure (`server/`)

-   **`index.ts`**: The entry point. It sets up the Express app, middleware, and starts the server.
-   **`routes.ts`**: Defines all API endpoints. It maps HTTP requests to controller logic (currently inline or using storage methods).
-   **`storage.ts`**: The Data Access Layer. It defines an interface `IStorage` and implements it (e.g., `DatabaseStorage` or `MemStorage`). This abstracts the database implementation from the business logic.
-   **`vite.ts`**: Middleware to integrate Vite for hot module replacement (HMR) during development.

### Data Access Layer

-   **Drizzle ORM**: Used to interact with the PostgreSQL database.
-   **Schema (`shared/schema.ts`)**: Defines the database tables and Zod schemas for validation. This file is shared between client and server to ensure type safety across the network boundary.

## 🗃️ Database Schema

The database schema is defined in `shared/schema.ts`.

### Current Tables

-   **`users`**:
    -   `id`: Serial Primary Key
    -   `username`: Text (Unique)
    -   `password`: Text

*(Note: The current schema is minimal. As the application grows, more tables like `products`, `inquiries`, etc., will be added here.)*

## 🔄 Request Flow

1.  **Client** initiates a request (e.g., form submission).
2.  **React Component** calls an API function or mutation via `TanStack Query`.
3.  **Express Server** receives the request on `/api/...`.
4.  **Router** (`routes.ts`) matches the endpoint.
5.  **Handler** validates input using Zod schemas.
6.  **Storage Layer** (`storage.ts`) interacts with the database.
7.  **Database** returns data.
8.  **Server** sends JSON response.
9.  **Client** updates UI based on the response.

