using asset_management from '../db/schema';

@restrict: [
    { grant: '*', where: 'role = "ADMIN"' },
    { grant: 'READ', where: 'role = "EMPLOYEE"' }
]
service IdentityService {

    entity Users as projection on asset_management.Users{
        ID,
        firstName,
        lastName,
        email,
        role,
        department
    };

    entity Departments as projection on asset_management.Departments;
    
}

@restrict: [
    { grant: 'WRITE', where: 'role = "ASSET_MANAGER"' },
    { grant: 'READ', where: 'role = "EMPLOYEE"' }
]
service AssetService {

    entity Assets as projection on asset_management.Assets{
        ID,
        assetTag,
        name,
        serialNumber,
        status,
        category,
        vendor
    };

    entity Vendors as projection on asset_management.Vendors;

    entity AssetCategories as projection on asset_management.AssetCategories;

    entity AssetAssignments as projection on asset_management.AssetAssignments{
        ID,
        asset,
        user,
        assignedAt,
        returnedAt,
        remarks
    };
    
}

@restrict: [
  { grant: 'READ', to: 'Employee' },
  { grant: '*', to: 'SupportAgent' }
]
service TicketingService {

    entity ServiceRequests as projection on asset_management.ServiceRequests;

    entity Comments as projection on asset_management.Comments;

    entity Attachments as projection on asset_management.Attachments;

}

@restrict: [
    { grant: '*', where: 'role = "ADMIN"' }
]
service AuditLogsService {

    entity AuditLogs as projection on asset_management.AuditLogs;

}