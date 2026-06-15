const cds = require('@sap/cds');
const { INSERT, SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');


class TicketService extends cds.ApplicationService {
    async init() {
        this.before('CREATE', 'ServiceRequests', this.validateCreateRequest);

        this.on('assignTicket', this.assignTicket);
        this.on('resolveTicket', this.resolveTicket);
        this.on('closeTicket', this.closeTicket);
        this.on('addComment', this.addComment);
        this.on('addAttachment', this.addAttachment);

        // Audit logging for all CREATE/UPDATE/DELETE operations
        this.after('CREATE', 'ServiceRequests', this.logAudit);
        this.after('UPDATE', 'ServiceRequests', this.logAudit);
        this.after('DELETE', 'ServiceRequests', this.logAudit);

        return super.init();
    }

    async validateCreateRequest(req) {
        const { title, description, requester_ID } = req.data;

        if (!title?.trim()) {
            return req.error(400, 'Title is required');
        }

        if (!description?.trim()) {
            return req.error(400, 'Description is required');
        }

        if (!requester_ID) {
            return req.error(400, 'Requester is required');
        }

        const requester = await cds.run(SELECT.one
            .from('asset_management.Users')
            .where({ ID: requester_ID }));

        if(!requester) {
            return req.error(404, 'Requester not found');
        }

        req.data.status = 'NEW';
    }

    async assignTicket(req) {
        const { ticketID, agentID } = req.data;

        if(!ticketID || !agentID) {
            return req.error(400, 'Missing required fields: ticketID and agentID');
        }

        const db = await cds.connect.to('db');

        const ticket =  await db.run(
            SELECT.one.from('asset_management.ServiceRequests').where({ ID: ticketID })
        );

        if (!ticket) {
            return req.error(404, 'ServiceRequest not found');
        }

        const agent = await db.run(
            SELECT.one.from('asset_management.Users').where({ ID: agentID })
        );

        if (!agent) {
            return req.error(404, 'Agent not found');
        }

        if (agent.role !== 'SUPPORT_AGENT' || agent.role !=='ADMIN'){
            return req.error(
                403,
                'Only SUPPORT_AGENT or ADMIN can be assigned to tickets'
            );
        }


        await db.run(UPDATE('asset_management.ServiceRequests')
                    .set({
                        assignedAgent_ID: agentID,
                        status: 'ASSIGNED'
                    })
                    .where({ ID:ticketID })
                );

        return {
            message: 'Ticket assigned successfully',
            success: true,
            ticketID: ticketID,
            agentID: agentID
        }
    }

    async resolveTicket(req) {
        const { ticketID, resolutionDetails } = req.data;

        if (!ticketID) {
            req.error(400, 'ticketID is required');
        }

        if (!resolutionDetails?.trim()) {
            return req.error(400, 'Resolution details are required');
        }

        const db = await cds.connect.to('db');

        const ticket = await db.run(
            SELECT.one.from('asset_management.ServiceRequests').where({ ID: ticketID })
        );

        if (!ticket) {
            return req.error(404, 'ServiceRequest not found');
        }
        
        if (ticket.status == 'CLOSED') {
            return req.error(400, 'Cannot resolve a closed ticket');
        }

        const commentId = cds.utils.uuid();
            await db.run(
            UPDATE('asset_management.ServiceRequests')
                .set({ status: 'RESOLVED' })
                .where({ ID: ticketID })
        );

        await db.run(
            INSERT.into('asset_management.Comments').entries({
                ID: commentId,
                request_ID: ticketID,
                author_ID: req.user.ID,
                content: `RESOLUTION: ${resolutionDetails}`,
                createdAt: new Date(),
                createdBy: req.user.id,
                modifiedAt: new Date(),
                modifiedby: req.user.id
            })
        );

        return {
            message: 'Ticket resolved successfully',
            success: true,
            ticketID: ticketID
        };
    }
    
    async closeTicket(req) {
        const { ticketID } = req.data;

        if (!ticketID) {
            return req.error(400, 'ticketID is required');
        }

        const db = await cds.connect.to('db');

        const ticket = await db.run(
            SELECT.one.from('asset_management.ServiceRequests').where({ ID: ticketID })
        );

        if (!ticket) {
            return req.error(404, 'ServiceRequest not found');
        }

        if (ticket.status == 'CLOSED') {
            return req.error(400, 'Ticket is already closed');
        }

        if (ticket.status == 'RESOLVED') {
            return req.error(400, 'Can only close RESOLVED tickets. Current status: ' + ticket.status);
        }
        
        await db.run(
            UPDATE('asset_management.ServiceRequests')
            .set({ status: 'CLOSED' })
            .where({ ID: ticketID })
        );

        return {
            message: 'Ticket closed successfully',
            success: true,
            ticketID: ticketID
        };
    }

    async addAttachment(req) {
        const { ticketID, content, filename, mimeType } = req.data;

        if (!ticketID) {
            return req.error(400, 'ticketID is required');
        }

        if (!filename?.trim()) {
            return req.error(400, 'Filename is required');
        }

        if (!mimeType?.trim()) {
            return req.error(400, 'MIME type is required');
        }

        const db = await cds.connect.to('db')

        const ticket = await db.run(
            SELECT.one.from('asset_management.ServiceRequests').where({ ID: ticketID })
        );

        if (!ticket) {
            return req.error(404, 'ServiceRequest not found');
        }


        const attachmentID = cds.utils.uuid();

        const storagePath = `/attachments/${ticketID}/${attachmentID}/${filename}`;

        await db.run(
            INSERT.into('asset_management.Attachments').entries({
                ID: attachmentId,
                request_ID: ticketID,
                fileName: filename,
                mimeType: mimeType,
                storagePath: storagePath,
                createdAt: new Date(),
                createdBy: req.user.id,
                modifiedAt: new Date(),
                modifiedBy: req.user.id
            })
        );

        return {
            message: 'Attachment added successfully',
            success: true,
            attachmentID: attachmentId,
            ticketID: ticketID,
            filename: filename
        };
    }

        async addComment(req) {
        const { ticketID, content } = req.data;

        // Validate required fields
        if (!ticketID) {
            return req.error(400, 'ticketID is required');
        }

        if (!content?.trim()) {
            return req.error(400, 'Comment content is required');
        }

        const db = await cds.connect.to('db');

        // Validate ticket exists
        const ticket = await db.run(
            SELECT.one.from('asset_management.ServiceRequests').where({ ID: ticketID })
        );

        if (!ticket) {
            return req.error(404, 'ServiceRequest not found');
        }

        // Create comment
        const commentId = cds.utils.uuid();
        await db.run(
            INSERT.into('asset_management.Comments').entries({
                ID: commentId,
                request_ID: ticketID,
                author_ID: req.user.id,
                content: content,
                createdAt: new Date(),
                createdBy: req.user.id,
                modifiedAt: new Date(),
                modifiedBy: req.user.id
            })
        );

        return {
            message: 'Comment added successfully',
            success: true,
            commentID: commentId,
            ticketID: ticketID
        };
    }

    async logAudit(req, key, agg) {
        try {
            if (req.error) return;
            
            const db = await cds.connect.to('db')
            const entity = req.subject;
            const action = req.event;
            const user = req.user;

            if (entity !== 'ServiceRequests') return;

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

}