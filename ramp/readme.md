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

Use ASSOCIATION for:
Users ↔ Department
Request ↔ User
Asset ↔ Category
Asset ↔ Vendor

Use COMPOSITION for:
Request → Comments
Request → Attachments
Request → AuditLogs
Asset → Assignment history (optional depending design)


6. Domain-driven Design (DDD Structure)

We structured the schema around business domains:

Core domains:
Identity (Users, Departments)
Assets (Assets, Vendors, Categories)
Service Management (Requests, Comments, Attachments)
Audit (AuditLogs)