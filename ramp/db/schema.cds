namespace asset_management;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Departments : cuid, managed {
    name : String(100) not null;
    description : String(255);
    users       : Association to many Users
                    on users.department = $self;
}entity Users : cuid, managed {
    employeeId : String(50);
    firstName : String(100) not null;
    lastName : String(100) not null;
    virtual fullName : String; //computed in service logic not stored in DB
    email : String(255) not null;
    role : UserRoles default 'EMPLOYEE';

    department  : Association to Departments;

    requests : Association to many ServiceRequests
                on requests.requester = $self;

    assignedRequests : Association to many ServiceRequests
                        on assignedRequests.assignedAgent = $self;

    assignments : Association to many AssetAssignments
                    on assignments.user = $self;
                
}

entity Vendors : cuid, managed, ContactInfo {
    name : String(100) not null;
    assets : Association to many Assets
                on assets.vendor = $self;
}

entity AssetCategories : cuid, managed {

    name        : String(100) not null;
    description : String(255);

    assets       : Association to many Assets
                       on assets.category = $self;
}

entity Assets : cuid, managed {

    assetTag       : String(50) not null;
    serialNumber   : String(100) not null;
    name           : String(255) not null;
    status         : AssetStatus default 'AVAILABLE';
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

    @mandatory
    title          : String(255);

    description    : LargeString;
    status         : TicketStatus default 'NEW';
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

aspect ContactInfo {
    email : String(255) not null;
    phone : String(50) not null;
}