# Urjatech Website

A modern, full-stack web application for Urjatech, built with React, Express, and PostgreSQL. This project showcases Urjatech's manufacturing capabilities, products, and certifications.

## 🚀 Tech Stack

### Frontend
- **Framework:** [React](https://react.dev/) (v18)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Routing:** [wouter](https://github.com/molefrog/wouter)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Server:** [Express.js](https://expressjs.com/)
- **Runtime:** [Node.js](https://nodejs.org/)
- **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Validation:** [Zod](https://zod.dev/)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (for the database)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hmgcapital/urjatech-website.git
   cd urjatech-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory (if not already present) and configure your database connection:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/urjatech_db
   ```

4. **Database Setup**
   Push the schema to your database:
   ```bash
   npm run db:push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`.

## 📜 Scripts

- `npm run dev`: Starts the development server (Express + Vite).
- `npm run build`: Builds the frontend and backend for production.
- `npm run start`: Starts the production server.
- `npm run check`: Runs TypeScript type checking.
- `npm run db:push`: Pushes Drizzle schema changes to the database.

## 📂 Project Structure

```
urjatech-website/
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/     # Reusable UI components & sections
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions & query client
│   │   ├── pages/          # Application pages (Home, About, etc.)
│   │   └── App.tsx         # Main application component
│   └── index.html          # HTML entry point
├── server/                 # Backend code
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes definition
│   └── storage.ts          # Database storage interface
├── shared/                 # Shared code between client & server
│   └── schema.ts           # Database schema & types
└── drizzle.config.ts       # Drizzle ORM configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

