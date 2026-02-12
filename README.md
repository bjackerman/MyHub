# MyHub - Personal Web Dashboard

A highly customizable, interactive personal dashboard built with Next.js 16 and Tailwind CSS 4. Features a drag-and-drop widget system with state persistence and various productivity tools.

## Features

- **Draggable & Resizable Widgets:** Organize your workspace exactly how you want it.
- **State Persistence:** Your layout and widget positions are automatically saved to `localStorage`.
- **YAML Config Validation:** Built-in schema checks for top-level config sections and `layout.widgets` definitions (type, size, position, and unique IDs).
- **Integrated Widgets:**
  - **Notes:** Quick scratchpad for ideas and lists.
  - **Tasks:** Simple to-do list with completion toggles.
  - **AI Assistant:** Simulated AI chat interface for analysis and drafting.
  - **Clock & Calendar:** Real-time time display and monthly schedule.
  - **Weather:** Current conditions and 3-day forecast (mock data).
  - **Bookmarks:** Quick access to your favorite sites.

## Getting Started

### Prerequisites

- **Node.js:** Version 18.x or higher.
- **npm / yarn / pnpm:** Package manager of your choice.
- **Python 3.x:** (Optional) Required for running the visual verification scripts.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd MyHub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Python environment (for verification):**
    ```bash
    pip install playwright
    playwright install chromium
    ```

## Development and Building

### Run the Development Server

Start the interactive development environment:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

### Build for Production

Generate an optimized production build:

```bash
npm run build
```

### Run Production Server

After building, you can start the production server:

```bash
npm run start
```

### Linting

Check for code quality and style issues:

```bash
npm run lint
```

## YAML Config Schema

The `/config` editor expects the YAML document to include these top-level sections:

- `version` (number)
- `site` (object)
- `layout` (object)
- `setup` (object)

`layout.widgets` must be a list of widget objects with this required shape:

- `id` (unique string)
- `title` (string)
- `type` (`notes | bookmarks | tasks | ai | calendar | clock | weather`)
- `x`, `y`, `width`, `height` (numbers)
- `isLocked` (optional boolean)

## Visual Verification

The project includes a Playwright-based Python script to capture screenshots of the dashboard for visual testing and documentation.

**Ensure the development server is running on `localhost:3000` before executing:**

```bash
python verify_dashboard.py
```

This will generate:
- `verification_dashboard.png`: Screenshot of the main dashboard.
- `verification_library.png`: Screenshot of the widget library page.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable React components.
  - `widgets/`: Individual widget implementations.
- `public/`: Static assets and icons.
- `verify_dashboard.py`: Automation script for visual verification.
- `GEMINI.md`: Instructional context for AI agents.

## License

[MIT](LICENSE)
