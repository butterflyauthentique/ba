# Butterfly Authentique Tech Stack

This document provides an overview of the technology stack used in the Butterfly Authentique web application.

## Core Framework
- **Next.js**: A powerful React framework for server-side rendering, static site generation, and a robust development environment.
- **React**: The foundational UI library for building the user interface.

## Backend & Database
- **Firebase**: A comprehensive platform for backend services, including:
  - **Firestore**: A NoSQL database for storing product information, user data, and orders.
  - **Firebase Authentication**: Manages user sign-up, login, and authentication.
  - **Firebase Storage**: Used for hosting and managing image uploads.
- **Razorpay**: The integrated payment gateway for processing transactions.

## Styling & UI Components
- **Tailwind CSS**: A utility-first CSS framework for creating custom, modern designs with speed and efficiency.
- **Radix UI**: A library of accessible, unstyled UI components used as a base for the site's interactive elements. We use it for:
  - Forms
  - Dialogs
  - Dropdowns
  - Toasts
- **Lucide React**: A library of simply designed, beautiful icons.

## Form Handling & State Management
- **React Hook Form**: Manages complex form state, validation, and submissions.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Zustand**: A lightweight and fast state management library for React.

## Development & Tooling
- **TypeScript**: The primary programming language, adding static types to JavaScript for improved code quality and maintainability.
- **ESLint**: A code linter to enforce consistent coding styles and catch common errors.
- **Sitemap**: A package to generate the sitemap.xml for SEO.
- **ts-node & tsconfig-paths**: Used for running TypeScript scripts directly from the command line with support for path aliases.
- **dotenv**: Manages environment variables for development and scripts.
