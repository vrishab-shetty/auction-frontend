# GEMINI.md - Auction Frontend

This document provides context and guidelines for Gemini CLI interactions within the Auction Management System Frontend.

## Project Overview

A React + TypeScript frontend for the Auction Management System, built with **Vite**. It handles real-time auction updates via SSE and robust state management.

### Core Stack
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** 
  - **Server State:** @tanstack/react-query (Caching, syncing)
  - **Global Client State:** Zustand (Auth, UI preferences)
- **API Client:** Axios
- **Icons:** Lucide-React

### Architectural Patterns
- **Feature-Based Module Design:** logic, components, and styles for a domain (e.g., `auctions`, `auth`) are co-located in `src/features/{feature-name}`.
- **Result Wrapper:** All API responses follow the backend's `Result<T>` structure.
- **Auth Flow:** Supports dual-stage authentication (Basic Auth for login -> JWT Bearer token for subsequent requests).
- **Real-time:** SSE implementation in `src/hooks/useAuctionStream.ts` for live bid updates.

## Development Conventions
- **Naming:** PascalCase for components, camelCase for hooks and utilities.
- **Folder Structure:**
  - `src/api`: Axios instance and global types.
  - `src/components`: Shared UI components (Button, Input, etc.).
  - `src/features`: Domain-specific modules.
  - `src/hooks`: Global reusable hooks.
  - `src/store`: Zustand stores.
  - `src/utils`: Reusable helper functions.

## Key Backend Integration
- **Base URL:** Defined in `.env` as `VITE_API_BASE_URL`.
- **Endpoints:** Aligned with Spring Boot API (v1).
- **SSE:** `/api/v1/auctions/{id}/stream`.
