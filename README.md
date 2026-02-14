# TheHatchGGs Website & Admin Dashboard

This repository contains a full‑stack web application for **TheHatchGGs**, an esports organisation.  It includes a public‑facing website and a secure admin dashboard.  The site is built with **Next.js** (TypeScript) and **TailwindCSS**, stores data in **MongoDB**, and enforces strong security practices.

## Features

### Public Site

* **Home** – Landing page with organisation overview and calls to action.
* **About Us** – Content editable via the admin panel (supports markdown and optional hero image).
* **Merch** – Displays merchandise items from the database and links out to the official store (`https://imprev.store/team/hatch`).  No payment processing occurs on this site.
* **Contact** – Includes a rule‑based support agent.  Users can chat to find answers from the knowledge base.  If the bot cannot help or the user requests escalation, a ticket is created.  Tickets are stored in MongoDB and can contain optional encrypted private info.  After creating a ticket, users may open a Gmail compose window to email support if they need a transcript or have not received a response.

### Admin Dashboard

* **Authentication** – Admins log in via email/password.  On first run, credentials from `ADMIN_SETUP_EMAIL` and `ADMIN_SETUP_PASSWORD` are used to create the initial account.
* **About Editor** – Edit the title, body (markdown) and hero image URL for the About page.
* **Merch Manager** – Create, update, hide/unhide and delete merch display items.
* **Knowledge Base Manager** – Create, edit, publish/unpublish and delete FAQ articles.  These articles power the support agent.
* **Ticket Management** – View tickets, update status, add internal notes and decrypt any private information (encrypted at rest with AES‑256‑GCM).  Transcripts from the support chat are stored with each ticket.
* **Analytics** – First‑party analytics collect page views, sessions, clicks, support events and more.  An analytics dashboard surfaces summary counts for a selectable date range.

## Getting Started

### Prerequisites

* **Node.js** 18 or 20
* **npm** (comes with Node.js)
* A **MongoDB Atlas** cluster or any MongoDB instance

### Installation

1. Clone the repository and install dependencies:

   ```bash
   git clone <repo-url>
   cd thehatchggs
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the required environment variables:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `MONGODB_URI` | Your MongoDB connection string. |
   | `SESSION_SECRET` | A long, random string used to encrypt session cookies (32+ characters). |
   | `ENCRYPTION_KEY` | Base64‑encoded 32‑byte key used to encrypt private ticket information.  You can generate one with `openssl rand -base64 32`. |
   | `ADMIN_SETUP_EMAIL` | Email for the initial admin account. |
   | `ADMIN_SETUP_PASSWORD` | Password for the initial admin account.  Used only on first login. |
   | `APP_URL` | The fully qualified URL of your deployment (e.g. `https://thehatchggs.onrender.com`). |

3. Run the development server:

   ```bash
   npm run dev
   ```

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.  The site will reload automatically when you edit files.

### Build & Start

To build a production version of the app and start it locally:

```bash
npm run build
npm run start
```

### Deployment on Render

1. **Create a new Web Service** on [Render](https://render.com) and link your GitHub repository.
2. Set the environment variables in the Render dashboard according to your `.env` file.
3. Configure the build and start commands:

   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start`
   * **Environment:** Node 18 or Node 20

4. (Optional) Add a `render.yaml` file for one‑click deploys.

### Security Considerations

* **No secrets or sensitive data** are ever exposed on the client.  Encryption/decryption and admin checks run only on the server.
* **Sessions** are stored in HTTP‑only cookies via `iron-session`.
* **Private ticket information** is encrypted using AES‑256‑GCM with a key from `ENCRYPTION_KEY`.  Only admins can decrypt this data via the dashboard.
* **Rate limiting and validation** are implemented on API routes to mitigate abuse.
* **Support email** is handled by redirecting the user to Gmail compose with a prefilled template.  No external email API keys are required.

## Folder Structure

```
thehatchggs/
├── components/         # Shared React components (layout, navigation)
├── lib/               # Database connection, models, session and encryption utilities
├── pages/             # Next.js pages (public site, admin dashboard, API routes)
│   ├── admin/         # Admin dashboard pages
│   ├── api/           # Serverless API routes (public and admin)
│   └── ...
├── styles/            # Global CSS (Tailwind)
├── .env.example       # Sample environment variables file
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Development Notes

* To generate a 32‑byte base64 encryption key for `ENCRYPTION_KEY`, run:

  ```bash
  openssl rand -base64 32
  ```

* When adding knowledge base articles, populate the **keywords** field with comma‑separated terms that relate to the content.  The support bot uses simple keyword matching to retrieve answers.

* To seed the first admin user, simply navigate to `/admin/login` and log in using the credentials in `ADMIN_SETUP_EMAIL` and `ADMIN_SETUP_PASSWORD`.  The account will be created automatically on first successful login.

* **Support agent:** The bot never guesses.  It only returns information stored in the knowledge base or the About page.  When it cannot find an answer, it suggests escalating to a support ticket.  Tickets are stored in MongoDB and can be managed through the admin dashboard.

* **Gmail compose:** After submitting a ticket, users can open a Gmail compose window to email the support team if they are not receiving a response or need a transcript.  The email body includes the ticket ID, user details and a warning not to change the message.

## License

This project is provided as‑is for demonstration purposes.