const cds = require("@sap/cds");
const { SELECT, INSERT, UPDATE } = require("@sap/cds/lib/ql/cds-ql");

class AssetsService extends cds.ApplicationService {
    async init() {
        this.on ('assignAssetToUser', this.assignAssetToUser);

        this.on('returnAsset', this.returnAsset);

        this.before('CREATE', 'Assets', async (req) => {
        //todo: implement logic to handle asset creation, e.g., validating input data or setting default values
            const existingAsset = await cds.run(SELECT.one.from('asset_management.Assets').where({ assetTag: req.data.assetTag }));
            if (existingAsset) {
                return req.error(400, "Asset with the same assetTag already exists"); // Asset with the same assetTag already exists
            }
        });

        this.before('DELETE', 'Assets', async (req) => {
            const assignments = await cds.run(SELECT.one.from('asset_management.AssetAssignments').where({ assetID: req.data.ID, returnedAt: null }));
            if (assignments) {
                return req.error(400, "Cannot delete asset that is currently assigned to a user"); // Cannot delete asset that is currently assigned to a user
            }
        });
        
        return super.init();
    }

    async assignAssetToUser(req) {

        const { assetID, userID } = req.data;
        if (!assetID || !userID) {
            return req.error(400, "Missing required fields: assetID and userID"); // Missing required fields
        }
        const db = await cds.connect.to('db'); // Connect to the database 
        // CAP automatically throws exception and returns 500 if failed
        
        const assset = await db.run(SELECT.one.from('asset_management.Assets').where({ ID: assetID }));
        if (!assset) {
            return req.error(404, "Asset not found")    ; // Asset not found
        }

        const existingAssignment = await db.run(SELECT.one.from('asset_management.AssetAssignments').where({ assetID: assetID, returnedAt: null }));
        
        if(existingAssignment){
            return req.error(400, "Asset is already assigned to another user"); // Asset is already assigned
        }

        await db.run(INSERT.into('asset_management.AssetAssignments').entries({
            ID: cds.utils.uuid(),
            assetID: assetID,
            userID: userID,
            assignedAt: new Date()
        }));
        
        return { message: "Asset assigned successfully", success: true }; 
    } 

    async returnAsset(req) {

        const { assignmentID } = req.data;
        if (!assignmentID) {
            return req.error(400, "Missing required field: assignmentID"); // Missing required field
        }

        const db = await cds.connect.to('db'); // Connect to the database

        const assignment = await db.run(SELECT.one.from('asset_management.AssetAssignments').where({ ID: assignmentID}));

        if (!assignment) {
            return req.error(404, "Active assignment not found"); // Active assignment not found
        }

        if (assignment.returnedAt) {
            return req.error(400, "Asset has already been returned"); // Asset has already been returned
        }

        await db.run(UPDATE('asset_management.AssetAssignments').set({ returnedAt: new Date() }).where({ ID: assignmentID }));

        return { message: "Asset returned successfully", success: true }; 
    }
        
};

module.exports = AssetsService;
