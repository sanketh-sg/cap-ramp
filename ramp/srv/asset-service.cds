using asset_management from '../db/schema';


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
    
    action assignAssetToUser(
        assetID : UUID,
        userID  : UUID
    ) returns String;

    action returnAsset(
        assignmentID : UUID
    ) returns String;

}

