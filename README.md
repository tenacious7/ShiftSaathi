# ShiftSaathi 🚀

> **New City. No Stress. ShiftSaathi.**

ShiftSaathi is a comprehensive, all-in-one platform designed to help students and professionals seamlessly transition into a new city. Currently live in Bangalore and Bhubaneswar, it simplifies the most stressful parts of relocation: finding a place to stay, finding compatible roommates, buying essential items, and building a local community.

## 🌟 Key Features

*   **🏠 Accommodation Finder (`Explore` & `PGDetails`)**
    *   Discover verified PGs, hostels, mess services, and rental rooms.
    *   Filter by location, budget, amenities, and more.
*   **🤝 Roommate Matcher (`FindRoommate`)**
    *   Find compatible roommates based on lifestyle preferences, habits, and budget.
    *   Connect securely through the platform.
*   **🛒 Marketplace (`Marketplace` & `SellItem`)**
    *   Buy and sell pre-owned furniture, appliances, books, and other essentials locally.
    *   Perfect for students and professionals moving in or out.
*   **🌐 Community Hub (`CommunityHub`)**
    *   Join local groups, attend weekend events, and connect with like-minded people.
    *   Categories include sports, coding clubs, yoga, weekend parties, and more.
*   **🚨 Emergency Services (`Emergency`)**
    *   Quick access to local emergency contacts, hospitals, and essential services in your new city.
*   **💼 Business Dashboard (`BusinessDashboard`)**
    *   A dedicated portal for PG owners, mess providers, and local businesses to list and manage their services.

## 🛠️ Tech Stack

**Frontend:**
*   [React 19](https://react.dev/) - UI Library
*   [Vite](https://vitejs.dev/) - Build Tool & Bundler
*   [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
*   [Framer Motion](https://www.framer.com/motion/) - Smooth, physics-based animations and page transitions
*   [Lucide React](https://lucide.dev/) - Beautiful, consistent iconography
*   [React Router DOM](https://reactrouter.com/) - Client-side routing

**Backend & Database:**
*   [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) - Custom server setup
*   [Supabase](https://supabase.com/) - Authentication and Database
*   [SQLite](https://sqlite.org/) - Local database support (`better-sqlite3`)

## 📂 Project Structure

```text
├── src/
│   ├── components/     # Reusable UI components (BottomNav, Cards, etc.)
│   ├── pages/          # Application routes/pages
│   │   ├── auth/       # Authentication pages
│   │   ├── onboarding/ # User profile setup and onboarding flow
│   │   ├── Landing.tsx # Animated hero landing page
│   │   ├── Explore.tsx # PG and accommodation discovery
│   │   ├── CommunityHub.tsx # Local events and groups
│   │   └── ...
│   ├── lib/            # Utility functions and helpers
│   ├── App.tsx         # Main application component and route definitions
│   ├── main.tsx        # React entry point
│   ├── index.css       # Global styles and Tailwind imports
│   └── supabaseClient.ts # Supabase initialization
├── server.ts           # Express server entry point
├── package.json        # Dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in the root directory and add the required environment variables (refer to `.env.example` if available).
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Development Server
Start the local development server (runs via `tsx server.ts` to support the full-stack Express + Vite setup):
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Building for Production
To create a production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run start
```

## 🎨 Design Philosophy
ShiftSaathi employs a modern, premium design language featuring:
*   **Glassmorphism:** Frosted glass effects for navigation and overlays.
*   **Fluid Animations:** Extensive use of Framer Motion for layout transitions, expandable cards, and micro-interactions.
*   **Mobile-First:** Fully responsive design optimized for touch interactions on mobile devices, scaling gracefully to desktop.
