using asset_management from '../db/schema';


@restrict: [
    {
        grant: ['CREATE', 'UPDATE', 'DELETE'],
        to: 'AssetManager'
    },
    {
        grant: ['CREATE', 'UPDATE'],
        to: 'Admin'
    },
    {
        grant: 'READ',
        to: ['Employee', 'SupportAgent', 'AssetManager', 'Admin']
    }
]
service AssetService {

    entity Assets           as
        projection on asset_management.Assets {
            ID,
            assetTag,
            name,
            serialNumber,
            status,
            category,
            vendor
        };

    entity Vendors          as projection on asset_management.Vendors;

    entity AssetCategories  as projection on asset_management.AssetCategories;

    entity AssetAssignments as
        projection on asset_management.AssetAssignments {
            ID,
            asset,
            user,
            assignedAt,
            returnedAt,
            remarks
        };

    action assignAssetToUser(assetID: UUID, userID: UUID) returns {
        message: String;
        success: Boolean;
        assignmentID: UUID;
        assetID: UUID;
        userID: UUID;
    };

    action returnAsset(assignmentID: UUID) returns {
        message: String;
        success: Boolean;
        assignmentID: UUID;
    };

}
