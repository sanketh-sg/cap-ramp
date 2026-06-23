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

# Why this architecture

1. Separation of concerns
CAP handles domain logic, persistence, and APIs
Vue.js handles UI 
Database remains abstracted via CDS

2. Domain-driven design approach
Instead of building “tables”, we model business concepts:
Users (not “user_table”)
Service Requests (not “tickets”)
Asset Assignments (not “join table”)

## Concepts
1. Entities (Core Domain Modeling)
Entities represent business objects:
Users
Assets
ServiceRequests
Departments

2. Managed Aspect (cuid, managed)
CAP automatically adds:

ID
createdAt
createdBy
modifiedAt
modifiedBy
Benefit

Removes boilerplate and ensures audit consistency across all entities.

3. Enumerations
Enforces valid states at schema level
Prevents invalid data (e.g. "DONEEEE")
Makes APIs self-documenting

4. Associations (Relationships without Join Tables)
Entities are independent and can exist without each other.
Mental model:
“This entity points to that entity, but does NOT own it.”

CAP automatically resolves joins at query time.

5. Compositions (Ownership Relationships)
One entity owns another and the child cannot exist independently.
Mental model:
“If parent is deleted, children are also deleted.”

Composition means:
Child lifecycle depends on parent
So:
Deleting a ServiceRequest deletes Comments
Attachments cannot exist independently

Associations (Most of the system)
Users ↔ Departments
Users ↔ Assets (via assignments)
Requests ↔ Users
Assets ↔ Vendors
Assets ↔ Categories
Rule:
Independent lifecycle + reusable reference

Compositions (Strict ownership)
Request → Comments
Request → Attachments
Request → AuditLogs
Rule:
Child cannot exist without parent


6. Domain-driven Design (DDD Structure)

We structured the schema around business domains:

Core domains:
Identity (Users, Departments)
Assets (Assets, Vendors, Categories)
Service Management (Requests, Comments, Attachments)
Audit (AuditLogs)

Departments
   └── Users

Users
   ├── ServiceRequests (requester)
   ├── ServiceRequests (assignedAgent)
   └── AssetAssignments

Assets
   ├── Category
   ├── Vendor
   └── AssetAssignments

ServiceRequests
   ├── Comments (composition)
   ├── Attachments (composition)
   └── AuditLogs (composition)

Why Projections?

You might ask:

Why not expose the entities directly?

Because projections create a separation between:

Database Model
        ↓
Service/API Model

Later you can:

Hide fields
Rename fields
Add annotations
Create multiple services

without changing the database schema.

1. First: what can be selective projection?

In CAP, ANY projection can be made selective as long as:

It is not used internally as a full persistence model
You want to control API exposure
You want to hide fields or rename fields

So technically:

✅ All of your entities can be selective projections

BUT… you should NOT do it everywhere blindly.

xs-security.json

Scopes: Fine-grained permissions (e.g., "create tickets", "assign assets")
Role-templates: Group scopes into roles (e.g., EMPLOYEE, SUPPORT_AGENT)
Attributes: User attributes for dynamic authorization
These map to your CDS @restrict annotations