const cds = require("@sap/cds");
const { SELECT, INSERT, UPDATE } = require("@sap/cds/lib/ql/cds-ql");

class AssetsService extends cds.ApplicationService {
    async init() {
        this.before('CREATE', 'Assets', async (req) => {
            // Validate asset tag uniqueness
            const existingAsset = await cds.run(
                SELECT.one.from('asset_management.Assets').where({ assetTag: req.data.assetTag })
            );
            if (existingAsset) {
                return req.error(400, "Asset with the same assetTag already exists");
            }
        });

        this.before('DELETE', 'Assets', async (req) => {
            // Check if asset is currently assigned
            const assignments = await cds.run(
                SELECT.one.from('asset_management.AssetAssignments').where({ asset_ID: req.data.ID, returnedAt: null })
            );
            if (assignments) {
                return req.error(400, "Cannot delete asset that is currently assigned to a user");
            }
        });


        // this.on('assignAssetToUser', this.assignAssetToUser);
        // this.on('returnAsset', this.returnAsset);

        //Audit logging for all CREATE/UPDATE/DELETE operations
        this.after('CREATE', 'Assets', this.logAudit);
        this.after('UPDATE', 'Assets', this.logAudit);
        this.after('DELETE', 'Assets', this.logAudit);

        return super.init();
    }

    async assignAssetToUser(req) {

        const { assetID, userID } = req.data;
        if (!assetID || !userID) {
            return req.error(400, "Missing required fields: assetID and userID"); // Missing required fields
        }
        const db = await cds.connect.to('db'); // Connect to the database 
        // CAP automatically throws exception and returns 500 if failed

        const assset = await db.run(
            SELECT.one.from('asset_management.Assets').where({ ID: assetID }));
        if (!assset) {
            return req.error(404, "Asset not found"); // Asset not found
        }

        const user = await db.run(
            SELECT.one.from('asset_management.Users').where({ ID: userID }));
        if (!user) {
            return req.error(404, "User not found");
        }


        const existingAssignment = await db.run(
            SELECT.one.from('asset_management.AssetAssignments').where({ asset_ID: assetID, returnedAt: null }));
        if (existingAssignment) {
            return req.error(400, "Asset is already assigned to another user"); // Asset is already assigned
        }

        const assignmentId = cds.utils.uuid();
        await db.run(
            INSERT.into('asset_management.AssetAssignments').entries({
                ID: assignmentId,
                asset_ID: assetID,
                user_ID: userID,
                assignedAt: new Date(),
                createdAt: new Date(),
                createdBy: req.user.id || 'SYSTEM',
                modifiedAt: new Date(),
                modifiedBy: req.user.id || 'SYSTEM'
            })
        );

        // Update asset status to ASSIGNED
        await db.run(
            UPDATE('asset_management.Assets')
                .set({ status: 'ASSIGNED' })
                .where({ ID: assetID })
        );

        return { 
            message: "Asset assigned successfully", 
            success: true,
            assignmentID: assignmentId,
            assetID: assetID,
            userID: userID
        };
    }

    async returnAsset(req) {

        const { assignmentID } = req.data;

        if (!assignmentID) {
            return req.error(400, "Missing required field: assignmentID"); // Missing required field
        }

        const db = await cds.connect.to('db'); // Connect to the database

        const assignment = await db.run(
            SELECT.one.from('asset_management.AssetAssignments').where({ ID: assignmentID }));

        if (!assignment) {
            return req.error(404, "Active assignment not found"); // Active assignment not found
        }

        if (assignment.returnedAt) {
            return req.error(400, "Asset has already been returned"); // Asset has already been returned
        }

        await db.run(
            UPDATE('asset_management.AssetAssignments')
            .set({ returnedAt: new Date() })
            .where({ ID: assignmentID }));

            
        // Update asset status back to AVAILABLE
        await db.run(
            UPDATE('asset_management.Assets')
                .set({ status: 'AVAILABLE' })
                .where({ ID: assignment.asset_ID })
        );

        return { 
            message: "Asset returned successfully", 
            success: true,
            assignmentID: assignmentID
        };
    }

    async logAudit(req, key, agg) {
            try {
                if (req.error) return;
                
                const db = await cds.connect.to('db')
                const entity = req.subject;
                const action = req.event;
                const user = req.user;
    
                if (entity !== 'Assets') return;
    
                const ticketID = req.data.ID || key;
    
                let oldValue = JSON.stringify(req._result_before || {});
                let newValue = JSON.stringify(req.data || {});
                
                await db.run(
                    INSERT.into('asset_management.AuditLogs').entries({
                        ID: cds.utils.uuid(),
                        request_ID: ticketID,
                        action: action.toUpperCase(),
                        oldValue: oldValue,
                        newValue: newValue,
                        changedBy: user.id || 'SYSTEM',
                        changedAt: new Date()
                    })
                );
            } catch (error) {
                // Log errors but don't fail the main operation
                console.error('Audit logging error:', error);
            }
            
    }

};

module.exports = AssetsService;
