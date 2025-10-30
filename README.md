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
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Storybook](https://storybook.js.org/)** - Component development and testing

## System Requirements

Before you begin, ensure you have the following installed on your system:

- **Node.js** - Version 20.x or higher ([Download](https://nodejs.org/))
- **npm** - Version 10.x or higher (comes with Node.js)
- **Docker & Docker Compose** (Recommended) - For easy PostgreSQL setup ([Download](https://docs.docker.com/get-docker/))
  - *OR* **PostgreSQL** - Version 14 or higher if not using Docker ([Download](https://www.postgresql.org/download/))

You can verify your installations by running:
```bash
node --version
npm --version

# If using Docker
docker --version
docker-compose --version

# If using local PostgreSQL
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

#### Option A: Using Docker (Recommended)

The easiest way to set up PostgreSQL is using Docker Compose:

```bash
# Copy the example environment file
cp .env.example .env

# Start PostgreSQL in the background
docker-compose up -d

# Verify the database is running
docker-compose ps
```

The default credentials are already configured in `.env.example`. The database will be accessible at `localhost:5432`.

#### Option B: Using an Existing PostgreSQL Installation

If you have PostgreSQL installed locally:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE promptyard;
```

Then create a `.env` file:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env` with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/promptyard
```

### 4. Run Database Migrations

Set up the database schema using Drizzle Kit:

```bash
npx drizzle-kit push
```

This command will create the necessary tables and schema in your PostgreSQL database.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will automatically reload when you make changes to the code.

## Available Scripts

### Development
- `npm run dev` - Start the development server on port 3000
- `npm run build` - Create an optimized production build
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Testing
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report

### Storybook
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build Storybook for production

### Database
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

### Docker Commands (if using Docker)
- `docker-compose up -d` - Start PostgreSQL in the background
- `docker-compose down` - Stop PostgreSQL
- `docker-compose logs -f postgres` - View PostgreSQL logs
- `docker-compose ps` - Check container status

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

### Component Development with Storybook

Storybook is used for component development and testing. To work with Storybook:

1. **Start Storybook**: Run `npm run storybook` to start the Storybook dev server
2. **View Components**: Open [http://localhost:6006](http://localhost:6006) in your browser
3. **Create Stories**: Add `.stories.tsx` files next to your components in the `components/` or `app/` directories

Example story structure:
```typescript
// components/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    // component props
  },
};
```

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


