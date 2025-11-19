# Contributing to Urjatech Website

Thank you for your interest in contributing to the Urjatech Website project! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/urjatech-website.git
    cd urjatech-website
    ```
3.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```

## 💻 Development Workflow

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the development server**:
    ```bash
    npm run dev
    ```
3.  **Make your changes**. Ensure your code follows the existing style and conventions.

## 🎨 Code Style

-   **TypeScript**: We use TypeScript for type safety. Please ensure all new code is typed correctly.
-   **Formatting**: The project uses standard formatting rules.
-   **Components**: We use `shadcn/ui` components. When creating new components, try to reuse existing UI primitives from `client/src/components/ui`.
-   **Styling**: Use Tailwind CSS utility classes for styling. Avoid writing custom CSS in `index.css` unless absolutely necessary.

## 🗄️ Database Changes

If your changes involve the database schema:

1.  Modify `shared/schema.ts`.
2.  Run `npm run db:push` to update your local database.
3.  Ensure your code handles the new schema correctly.

## 提交 Pull Request (PR)

1.  **Push your branch** to GitHub:
    ```bash
    git push origin feature/amazing-feature
    ```
2.  **Open a Pull Request** against the `main` branch of the original repository.
3.  **Describe your changes** clearly in the PR description. Include screenshots if relevant.

## 🐛 Reporting Bugs

If you find a bug, please open an issue on GitHub with:
-   A clear description of the issue.
-   Steps to reproduce.
-   Expected vs. actual behavior.

Thank you for contributing!

