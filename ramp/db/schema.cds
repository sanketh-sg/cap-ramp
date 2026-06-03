namespace asset.managemant;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Departments : cuid, managed {
    name : String(100);
    description : String(255);

    users : Composition of many Users
                on users.department = $self;
}

entity Users : cuid, managed {
    employeeId : String(50);
    firstName : String(100);
    lastName : String(100);
    email : String(255);
    role : UserRoles;

    department : Association to Departments;

    requests : Association to many ServiceRequests
                on requests.requester = $self;

    assignments : Association to many AssetAssignments
                    on assignments.user = $self;
                
}

entity Vendors : cuid, managed {
    name : String(100);
    email : String(255);
    phone : String(20);

    assets : Association to many Assets
                on assets.vendor = $self;
}

entity AssetCategories : cuid, managed {

    name        : String(100);
    description : String(255);

    assets       : Association to many Assets
                       on assets.category = $self;
}

entity Assets : cuid, managed {

    assetTag       : String(50);
    serialNumber   : String(100);
    name           : String(255);
    status         : AssetStatus;
    purchaseDate   : Date;

    category       : Association to AssetCategories;

    vendor         : Association to Vendors;

    assignments    : Composition of many AssetAssignments
                        on assignments.asset = $self;
}

entity AssetAssignments : cuid, managed {

    user          : Association to Users;
    asset         : Association to Assets;

    assignedAt    : Timestamp;
    returnedAt    : Timestamp;

    remarks       : String(255);
}

entity ServiceRequests : cuid, managed {

    title          : String(255);
    description    : LargeString;
    status         : TicketStatus;
    priority       : Priority;

    requester      : Association to Users;

    assignedAgent  : Association to Users;

    comments       : Composition of many Comments
                        on comments.request = $self;

    attachments    : Composition of many Attachments
                        on attachments.request = $self;

    audits         : Composition of many AuditLogs
                        on audits.request = $self;
}

entity Comments : cuid, managed {

    request     : Association to ServiceRequests;

    author      : Association to Users;

    content     : LargeString;
}

entity Attachments : cuid, managed {

    request      : Association to ServiceRequests;

    fileName     : String(255);

    mimeType     : String(100);

    storagePath  : String(500);
}

entity AuditLogs : cuid {

    request       : Association to ServiceRequests;

    action        : String(100);

    oldValue      : LargeString;

    newValue      : LargeString;

    changedBy     : String(255);

    changedAt     : Timestamp;
}


entity Roles : cuid {
    name : String(50);
    description : String(255);
}

type UserRoles : String enum {
    EMPLOYEE;
    SUPPORT_AGENT;
    ASSET_MANAGER;
    ADMIN;
}

type TicketStatus : String enum {
    NEW;
    ASSIGNED;
    IN_PROGRESS;
    RESOLVED;
    CLOSED;
}

type Priority : String enum {
    LOW;
    MEDIUM;
    HIGH;
    CRITICAL;
}

type AssetStatus : String enum {
    AVAILABLE;
    ASSIGNED;
    IN_MAINTENANCE;
    RETIRED;
}