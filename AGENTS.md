# Ehime University Museum Digital Signage Project

## 1. Project Overview

This document outlines the development guidelines for the Ehime University Museum's interactive digital signage application. The goal is to create a captivating, stable, and easily maintainable slideshow experience using React and Framer Motion.

## 2. Core Functionality

The application presents a series of "timelines," each consisting of multiple "scenes" (images or videos).

- **Home Screen**: On startup, the user is presented with a choice of timelines.
- **Scene Display**: Once a timeline is selected, the application plays through its scenes in sequence.
  - **Ken Burns Effect**: Image scenes utilize a subtle pan-and-zoom (Ken Burns effect) to create a sense of motion.
  - **Video Playback**: Video scenes play automatically.
- **Navigation**: The slideshow progresses automatically. A progress bar at the bottom of the screen indicates the duration of the current scene. Users can also click, drag, or use arrow keys to navigate.
  - **Focus Indicator**: A "marching ants" style animated border is displayed around the application window when it has browser focus, providing a clear visual cue of its active state.

## 3. Design & Style Guide

The application's aesthetic is critical. It must feel like a natural extension of the museum.

- **Typography**: The primary font is 'Shippori Mincho', a serif font that evokes a sense of tradition and elegance.
- **Color Palette**: The core color scheme is dark and atmospheric, using a radial gradient from `#1b2735` to `#090a0f` to create depth. White text provides high contrast.
- **Layout**: The layout must be clean, intuitive, and visually balanced.
  - **Target Display**: The application is designed and optimized for a **portrait-oriented 4K display (2160px width by 3840px height)**. While the layout is fluid, this is the primary aspect ratio for which all design decisions are made.
  - **Verified Screen Sizes**: In addition to the target 4K display, the application is verified on the following typical screen sizes:
    - **iPhone SE**: 375 x 667 (Minimum viewport)
    - **iPhone XR / 11**: 414 x 896 (Standard large mobile)
    - **iPhone 12/13/14/15 Pro**: 390 x 844
    - **iPhone 14 Pro Max**: 430 x 932
    - **Pixel 7**: 412 x 915
    - **iPad Air**: 820 x 1180
  - **Home Screen**: A full-screen, portrait-oriented layout featuring a single background image (brochure style) with four distinct touch hotspots. Each hotspot is marked with a large animated hand icon to invite user interaction. This design is optimized for a 2160x3840 4K display.
  - **Scene View**: Content is displayed full-screen with overlayed text for titles and descriptions.

## 4. Data Structure (Timelines & Scenes)

The application's content is driven by a simple JavaScript object structure defined in `src/App.jsx`.

- **`timelines` Object**: The root object, containing a key for each available timeline (e.g., `timeline1`, `timeline2`).
- **Scene Array**: Each timeline consists of an array of scene objects.
- **Scene Object**: Each scene is an object with the following properties:
  - `id`: A unique identifier for the scene.
  - `type`: Either `'image'` or `'video'`.
  - `image` or `video`: The URL path to the media asset.
  - `title`: The main title text for the scene.
  - `description`: The descriptive text for the scene.

**Example:**

```javascript
// Image Scene
{
  id: 1,
  type: 'image',
  image: 'https://picsum.photos/seed/eum/1920/1080',
  title: '愛媛大学ミュージアムへようこそ',
  description: '地球と生命の46億年の歴史を、その手で感じてください。',
  audio: '/hello.mp3',
}

// Video Scene
{
  id: 8,
  type: 'video',
  video: '/sample.mp4',
  title: '紹介動画',
  description: '博物館の紹介動画です。'
}
```

## 5. Audio Management

- Audio is defined per-scene via the optional `audio` property.
- The `useEffect` hook in `App.jsx` manages the playback lifecycle.
- **Volume Control**: The volume for audio tracks is explicitly set within this `useEffect` hook. Any adjustments to playback volume MUST be made by modifying the `audio.volume` property (where `0.0` is silent and `1.0` is maximum).

## 6. Technical Know-how and Pitfalls

This section documents key technical learnings from the development process to assist future developers and AI agents.

### **Critical Issue: Resolving Zero-Height Layouts**

A major layout issue was encountered where panels on the home screen would render with a height of zero, making them invisible. This was **not** a CSS issue in isolation, but a problem rooted in the React component structure.

-   **Problem:** A parent wrapper element, specifically `framer-motion`'s `<motion.div>`, was inserted between a parent with `height: 100%` (`.App`) and its child that also used `height: 100%` (`.home-screen`). This intermediate wrapper did **not** have a defined height.

-   **Root Cause:** The `height: 100%` CSS rule requires an unbroken chain of parent elements, each having a defined height. The intermediate `<motion.div>` broke this chain, causing the browser to calculate the height of `.home-screen` and all its descendants as zero. Endless adjustments to the CSS of the child elements could not fix this structural problem.

-   **Solution:** The component structure in `App.jsx` was refactored.
    1.  The child component (`HomeScreen`) was modified to return only its inner elements using a React Fragment (`<>...</>`), removing its own wrapping `div`.
    2.  The problematic intermediate wrapper (`<motion.div>`) was given the `className="home-screen"` directly.

-   **Key Takeaway:** When debugging layout issues where elements mysteriously have zero height, **always inspect the full DOM hierarchy in the browser's developer tools.** Look for intermediate wrapper elements that may be breaking the `height: 100%` inheritance chain. The solution often lies in refactoring the component structure, not just the stylesheet.

## PWA Support

The application is configured as a Progressive Web App (PWA), allowing it to be installed on devices and work offline.

- **Manifest**: Located at `public/manifest.json`. Defines the app name, colors, and icons.
- **Service Worker**: Located at `public/sw.js`. Handles caching of core assets for offline availability.
- **Registration**: Handled in `index.html` via a script tag.

## Deployment

The application is deployed to Firebase Hosting.

### Firebase Hosting
- **Project ID**: `museum-signage-37925190-100ae`
- **Default Deployment URL**: [https://museum-signage-37925190-100ae.web.app](https://museum-signage-37925190-100ae.web.app)
- **Canonical URL**: [https://signage.museum.ehime-u.ac.jp/](https://signage.museum.ehime-u.ac.jp/)
- **Deployment Command**: `npm run deploy`


## Windows Command Line Tips (PowerShell)

During development on Windows, several shell-specific issues were encountered. Note the following for future tasks:

1.  **Command Substitution**: PowerShell does not support backticks (`` ` ``) for command execution/substitution. Use the `$()` syntax instead.
    - *Bash:* `` `cmd` ``
    - *PowerShell:* `$(cmd)`
2.  **Bun Path**: If `bun` is not in the system PATH, use the full path: `C:\Users\takas\.bun\bin\bun.exe`.
3.  **Command Chaining**: When using `;` or `&&` to chain commands that include variables (like `$hash`), ensure the variables are defined and used within the same session. 
4.  **Quote Escaping**: Avoid complex nested quoting in `powershell -Command "..."` strings. It's safer to run commands directly in the shell or use a script file.

## 7. AI Development Guidelines (Project IDX / Firebase Studio)

These guidelines define the operational principles for AI agents interacting with this React project to enable an efficient and error-resilient workflow.

### Environment & Context Awareness
* **`dev.nix` Configuration:** The `.idx/dev.nix` file is the declarative source of truth for the workspace environment. The AI should leverage it to ensure consistency.
* **Preview Server:** The `web` preview is configured to run the Vite dev server. The AI must continuously monitor its output for real-time feedback on changes.
* **Firebase MCP:** When requested for Firebase tools, add the following server configuration to `.idx/mcp.json` (do not add anything else):
  ```json
  {
      "mcpServers": {
          "firebase": {
              "command": "npx",
              "args": ["-y", "firebase-tools@latest", "experimental:mcp"]
          }
      }
  }
  ```

### Code Modification, Error Detection & Remediation
* **Package Management:** Use `npm install` for regular dependencies and `npm install -D` for dev dependencies.
* **Iterative Flow:** Each time the user requests a change, plan the actionable steps first.
* **Automated Checks:** After every code modification or dependency change, the AI must automatically:
  1. Run `eslint . --fix` to check and fix linting violations.
  2. Monitor IDE diagnostics and terminal output for compilation and runtime errors.
  3. Attempt to automatically fix detected errors (syntax, type mismatches, unresolved imports, hook misuse).
  4. If tests were modified, run `npm test`.
  5. Check the preview server for rendering issues or crashes.
  6. If an error cannot be automatically resolved, clearly report the specific error message, its location, and a suggested manual intervention.

### Implementation Guidelines
* **Component Implementation:** The project relies on standard React DOM components and `framer-motion` for animations. **Do not use external UI component libraries** (no MUI, Ant Design, Tailwind CSS, CSS-in-JS, etc.). Implement UI using standard HTML elements.
* **Styling Strategy**: Use the existing plain CSS files (e.g., `App.css`, `index.css`). Respect and maintain this pattern.
* **Routing and Navigation:** The application uses state-based conditional rendering for routing and scene transitions. **Do not use external routing libraries** like `react-router-dom`.
* **State Management:** The project manages state via React's built-in hooks (`useState`, `useEffect`, `useCallback`). **Do not use external global state libraries** like Redux or Zustand.
* **Accessibility:** Implement accessibility features (A11Y) to empower all users, keeping in mind a wide variety of physical/mental abilities.

### Test Generation & Execution
* Use **Vitest** as the testing framework and **React Testing Library** for components.
* Tests should cover different component states, user interactions, and edge cases.


