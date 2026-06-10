using { asset_management } from '../db/schema';

@restrict: [
    { grant: '*', where: 'role = "ADMIN"' }
]
service AuditLogsService {

    entity AuditLogs as projection on asset_management.AuditLogs;

}