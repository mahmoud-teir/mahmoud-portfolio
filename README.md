<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/mahmoud-teir/Mahmoud-Dev/main/public/logo.png" alt="Mahmoud-Dev Logo" width="200">
  <br>
  <b>MAHMOUD.DEV // PORTFOLIO_OS</b>
  <br>
</h1>

<h4 align="center">A high-performance, brutalist-inspired personal portfolio and admin dashboard built with <a href="https://nextjs.org" target="_blank">Next.js 16</a>.</h4>

<p align="center">
  <a href="#about-the-project">About</a> •
  <a href="#architecture--tech-stack">Tech Stack</a> •
  <a href="#admin-os-features">Admin OS</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#license">License</a>
</p>

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=000000&height=200&section=header&text=Hey%20Everyone!&fontSize=70&fontColor=ffffff&desc=Welcome%20to%20my%20digital%20workspace&descAlignY=70&descAlign=45" alt="Header Banner" width="100%">

## About The Project 👨‍💻

**Mahmoud-Dev** is an open-source, full-stack portfolio application designed to be more than just a static page. It functions as a complete digital operating system (`PORTFOLIO_OS`), featuring a unique **Brutalist Design System** that emphasizes bold typography, high-contrast borders, and neon accents. 

This project isn't just about displaying skills; it's about providing a fully functional, authentic backend experience where all data flows dynamically from a PostgreSQL database.

## Architecture & Tech Stack 🧰

The architecture focuses on edge-ready performance, type-safe robust integrations, and a beautiful UI.

### Core Foundation
<div>
    <img src="https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

### UI / Design System
<div>
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS v4" />
    <img src="https://img.shields.io/badge/framer--motion-%230055FF.svg?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/lucide--react-%23F24E1E.svg?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide Icons" />
</div>

### Backend & Database
<div>
    <img src="https://img.shields.io/badge/PostgreSQL-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma ORM" />
    <img src="https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black" alt="Neon Serverless" />
</div>

### Authentication & Infrastructure
<div>
    <img src="https://img.shields.io/badge/BetterAuth-%23000000.svg?style=for-the-badge&logo=auth0&logoColor=white" alt="Better Auth" />
    <img src="https://img.shields.io/badge/Uploadthing-%23F52020.svg?style=for-the-badge&logo=uploadthing&logoColor=white" alt="Uploadthing" />
    <img src="https://img.shields.io/badge/Resend-%23000000.svg?style=for-the-badge&logo=resend&logoColor=white" alt="Resend" />
</div>

## Admin OS Features ⚙️

The portfolio includes a protected administration panel mapped to `/admin/dashboard`. It features:

- **🔐 Better Auth Protocol**: Biometric-style login interface with real-time session tracking.
- **📝 Dynamic Content Manager**: Update your Bio, Header, Social Links, and Resumé right from the dashboard.
- **💼 Modular Experience/Projects**: Full CRUD operations for career history and project portfolios.
- **🛡️ Security Logging**: Every admin action (logins, logouts, edits, deletes) is tracked and audited in the `SecurityLog` table.
- **🟢 Brutalist UI Elements**: High-contrast, custom-designed alert and confirm dialogs bypassing native browser popups.

## Getting Started 🚀

To run this project locally, follow these steps:

### Prerequisites

Ensure you have Node.js (v18+) and npm installed. You will also need:
- A PostgreSQL Database URL (Neon recommended)
- Resend API Key (for emails)
- Uploadthing Token (for CV/Image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahmoud-teir/Mahmoud-Dev.git
   cd Mahmoud-Dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**  
   Create a `.env` file based on `.env.example` and populate it:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   BETTER_AUTH_SECRET="your_secure_random_string"
   BETTER_AUTH_URL="http://127.0.0.1:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   UPLOADTHING_TOKEN="your_uploadthing_token"
   RESEND_API_KEY="your_resend_api_key"
   ```

4. **Initialize the Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to view the portfolio. The admin panel is located at `/admin/login`.

## GitHub History 📈

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=mahmoud-teir&show_icons=true&theme=radical" alt="Mahmoud's GitHub stats" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=mahmoud-teir&layout=compact&theme=radical" alt="Top Languages" />
</p>

## License 📜

Distributed under the MIT License. Built with 🖤 by Mahmoud.
