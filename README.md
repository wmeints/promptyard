# Promptyard

A TypeScript-based web application that helps users store, organize, and share their favorite prompts. Whether you're working with AI assistants, templates, or any reusable text snippets, Promptyard makes it easy to manage and collaborate on prompts with friends and colleagues.

## Features

- **Store Prompts**: Keep all your favorite prompts in one centralized location
- **Create Collections**: Organize prompts into collections for different projects or purposes
- **Share & Collaborate**: Work on prompts together with others
- **Quick Search**: Find your prompts quickly with built-in search functionality

## Technology Stack

- **[Next.js](https://nextjs.org)** - React framework for production
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM for SQL databases
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[BetterAuth](https://www.better-auth.com/)** - Authentication solution
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

## System Requirements

Before you begin, ensure you have the following installed on your system:

- **Node.js** - Version 20.x or higher ([Download](https://nodejs.org/))
- **npm** - Version 10.x or higher (comes with Node.js)
- **PostgreSQL** - Version 14 or higher ([Download](https://www.postgresql.org/download/))

You can verify your installations by running:
```bash
node --version
npm --version
psql --version
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/wmeints/promptyard.git
cd promptyard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

Create a PostgreSQL database for the application:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE promptyard;
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Required: PostgreSQL connection string
DATABASE_URL=postgresql://username:password@localhost:5432/promptyard

# Optional: Database connection pool settings (defaults shown)
DB_MAX_CONNECTIONS=20
DB_CONNECTION_TIMEOUT=30000
DB_IDLE_TIMEOUT=10000
```

Replace `username` and `password` with your PostgreSQL credentials.

### 5. Run Database Migrations

```bash
npm run db:push
```

*Note: If this command doesn't exist yet, you may need to set up migrations manually using Drizzle Kit.*

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will automatically reload when you make changes to the code.

## Available Scripts

- `npm run dev` - Start the development server on port 3000
- `npm run build` - Create an optimized production build
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
promptyard/
├── app/              # Next.js app directory (pages, layouts, routes)
├── lib/              # Utility functions and shared code
│   ├── db/          # Database configuration and types
│   └── utils/       # Helper utilities
├── public/          # Static assets
└── ...config files
```

## Development

### Modifying Pages

You can start editing pages by modifying files in the `app/` directory. The page auto-updates as you edit the file.

### Database Schema

Database schema is managed using Drizzle ORM. Schema files can be found in the `lib/db/` directory.

## Quality Standards

This project follows strict quality guidelines:

- ✅ Every component has a Storybook file for testing
- ✅ TypeScript files include unit tests
- ✅ Important user scenarios are covered by Playwright tests

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Make sure to configure your environment variables in your deployment platform:
- `DATABASE_URL` - Your PostgreSQL connection string (required)
- Other optional database configuration variables

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please ensure your code:
- Includes appropriate tests
- Follows the existing code style
- Passes all linting and build checks

## License

This project is private and proprietary.
