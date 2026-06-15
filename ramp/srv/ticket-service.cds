using {asset_management} from '../db/schema';


@restrict: [
    {
        grant: ['CREATE'],
        to: 'Employee',
        where: 'requester_ID = $user.id'  // Employees can only create tickets for themselves
    },
    {
        grant: ['READ'],
        to: ['Employee', 'SupportAgent', 'AssetManager', 'Admin']
    },
    {
        grant: ['UPDATE'],
        to: 'SupportAgent'  // Only support agents can update (resolve, assign)
    },
    {
        grant: '*',
        to: 'Admin'  // Admins have full access
    }
]
service TicketingService {

    entity ServiceRequests as projection on asset_management.ServiceRequests;

    entity Comments        as projection on asset_management.Comments;

    entity Attachments     as projection on asset_management.Attachments;

    action assignTicket(ticketID: UUID, agentID: UUID) returns {
        message: String;
        success: Boolean;
        ticketID: UUID;
        agentID: UUID;
    };

    action resolveTicket(ticketID: UUID, resolutionDetails: String) returns {
        message: String;
        success: Boolean;
        ticketID: UUID;
    };

    action closeTicket(ticketID: UUID) returns {
        message: String;
        success: Boolean;
        ticketID: UUID;
    };

    action addComment(ticketID: UUID, content: String) returns {
        message: String;
        success: Boolean;
        commentID: UUID;
        ticketID: UUID;
    };

    action addAttachment(ticketID: UUID, filename: String, mimeType: String, content: Binary) returns {
        message: String;
        success: Boolean;
        attachmentID: UUID;
        ticketID: UUID;
        filename: String;
    };
}
