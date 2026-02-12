# Personal Web Dashboard - Project Context

This project is a customizable personal web dashboard built with a modern web stack. It features a widget-based interface allowing users to organize their digital workspace with tools like notes, tasks, AI assistants, and system monitoring.

## Project Overview

- **Core Functionality:** A drag-and-drop dashboard interface with various specialized widgets (Notes, Tasks, AI Chat, Calendar, etc.).
- **Main Views:**
    - **Dashboard (`/`):** Interactive workspace where widgets can be moved and resized.
    - **Library (`/library`):** A structured grid overview and widget management interface with a sidebar.
- **Technology Stack:**
    - **Framework:** Next.js 16 (App Router)
    - **Library:** React 19
    - **Language:** TypeScript
    - **Styling:** Tailwind CSS 4.0
    - **Icons:** Google Material Symbols Outlined
    - **Verification:** Playwright (Python) for automated screenshots and visual verification.

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- Python 3.x (for verification scripts)

### Commands
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Start Production Server:** `npm run start`
- **Linting:** `npm run lint`
- **Visual Verification:** `python verify_dashboard.py`
    - *Note: Requires `pip install playwright` and `playwright install chromium`.*

## Project Structure

- `app/`: Contains the main page routes and layout.
    - `page.tsx`: The main interactive dashboard.
    - `library/page.tsx`: The widget library/overview view.
    - `layout.tsx`: Root layout with font and icon configurations.
- `components/`: Reusable UI components.
    - `DashboardWidget.tsx`: The core wrapper for dashboard items, handling position and sizing.
    - `Sidebar.tsx`: Widget selection and library management.
    - `Header.tsx`: Navigation and global actions.
    - `Card.tsx`: Standard container for library items.
- `public/`: Static assets (SVG icons).
- `verify_dashboard.py`: Automation script to capture screenshots of the dashboard for verification.

## Development Conventions

- **"use client" Directive:** Heavily used in pages and components that require interactivity (Next.js App Router convention).
- **Styling:** Tailwind CSS 4 is used for all styling. Preferred theme is Dark Mode (`dark` class on `html`).
- **Component Patterns:** Props are defined using TypeScript interfaces. UI components are modular and separated into the `components/` directory.
- **Icons:** Use the Material Symbols Outlined font. Syntax: `<span className="material-symbols-outlined">icon_name</span>`.
- **Responsive Design:** Grid-based layouts (Tailwind `grid` and `flex`) are used to ensure the dashboard adapts to different screen sizes, though it is optimized for desktop usage (1600x900 viewport targeted in verification).
