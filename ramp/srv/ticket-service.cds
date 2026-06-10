
using { asset_management } from '../db/schema';
@restrict: [
  { grant: 'READ', to: 'Employee' },
  { grant: '*', to: 'SupportAgent' }
]
service TicketingService {

    entity ServiceRequests as projection on asset_management.ServiceRequests;

    entity Comments as projection on asset_management.Comments;

    entity Attachments as projection on asset_management.Attachments;

    action assignTicket(
        ticketID : UUID,
        agentID : UUID
    );

    action closeTicket(
        ticketID : UUID
    );
}

