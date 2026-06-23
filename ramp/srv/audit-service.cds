using {asset_management} from '../db/schema';

@restrict: [{
    grant: '*',
    where: 'ADMIN'
}]
service AuditLogsService {

    entity AuditLogs as projection on asset_management.AuditLogs;

}
