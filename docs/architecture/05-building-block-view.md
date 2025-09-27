# Building block view

This section covers the building blocks for the solution. This section is split
in two parts: 

1. The website stored in the directory `server`
2. The command-line client stored in the directory `client`

Each subsection follows a hierarchical approach to decompose the software into
components and subcomponents.

## The website

The website uses NextJS which has a fixed directory structure that looks like
this:

```
├── public                  # Public assets for the application
└── src
    ├── app                 # App router-based API routes and pages
    ├── components          # The application components following atomic design
    │   ├── atoms
    │   ├── molecules
    │   ├── organisms
    │   ├── templates
    │   └── ui              # The standard components installed via shadcn
    ├── db                  # Code related to the database
    └── lib                 # Shared application logic
```

### Component and page structure

The website follows a specific structure for building pages:

1. First, the page is mapped in the [app router](https://nextjs.org/docs/app/getting-started).
2. Next, each page has a template associated with it stored in `src/components/templates`.
3. Then, the components in the page follow a hierarchical structure.
   1. A page is split into sections from top to bottom, each section is a
      component in `src/components/organisms`.
   2. Component groups in a section is considered a molecule. For example, an
      input with a label is a molecule. Molecules are stored in 
      `src/components/molecules`.
   3. Individual components are stored in `src/components/atoms`. Although most
      individual components come from shadcn and are managed through the shadcn
      utility.

### Managing database access

We use drizzle to get data in and out of the database. You can find the schema
for the database in `src/db/schema.ts`. We store everything in a postgres
database.

For each table there is a set of types available in `src/db/types.ts` so we can
easily work with the database from typescript. You can find three types for
each table:

- `Insert{TableName}` - Provides typing for inserting data for a particular entity.
- `{TableName}` - Provides typing for selecting data for a particular entity.

Queries should be stored in `src/db/queries.ts`. Each complex operation on the 
database gets its own function in this file. For example, `insertPromptTemplate`
will have its own function. As does `updatePromptTemplate`.

## The command-line client

TODO: Describe the structure of the command-line client.