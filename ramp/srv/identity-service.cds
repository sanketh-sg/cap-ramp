using {asset_management} from '../db/schema';

@restrict: [
    {
        grant: '*',
        where: 'ADMIN'
    },
    {
        grant: 'READ',
        to: ['Employee', 'SupportAgent', 'AssetManager']
    }
]
service IdentityService {

    entity Users       as
        projection on asset_management.Users {
            ID,
            firstName,
            lastName,
            email,
            role,
            department
        };

    entity Departments as projection on asset_management.Departments;

}
