# Getting Started

Welcome to your new CAP project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`readme.md` | this getting started guide

## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start with your domain model, in a CDS file in `db/`

## Learn More

Learn more at <https://cap.cloud.sap>.


CDS models can be represented in different formats:

CQL Conceptual Query language to query the DB directly
CDL (Contextual Definition Language) is the human-friendly textual notation.
CSN (Core Schema Notation) is the machine-readable object notation,
which can be serialized to JSON or YAML,
or translated to other languages, such as SQL DDL or OData EDMX.
Databases

The cds repl command boots up a minimal CAP environment in an interactive shell that allows us to enter and execute CAP JavaScript commands, with results printed to the console. It's a great way to explore and interact with our models, services, and data in an ad-hoc way.

AdminService is for administrators to maintain master data. It exposes all entities as-is from the domain model, allowing full CRUD access to all data.

CatalogService is for visitors to browse and order books. It serves denormalized read-only views on Books, with flattened fields for author and genre, to simplify browsing. Entities Authors and Genres are not exposed, nor internal admin details createdBy and modifiedBy.

CQL is a high-level query language, similar to SQL, but adapted to CDS concepts, in particular associations, by path expressions and nested projections. It can be used in different CAP runtimes and services to capture and execute queries in a conceptual way, largely agnostic to the underlying database.

Unless replaced by a custom index.html in the app/ folder, CAP serves a generic welcome page at the root of the server. Open http://localhost:4004 in your browser to view the generated index.html page: