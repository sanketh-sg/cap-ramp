using { asset_management } from '../db/schema';

@restrict: [
    { grant: '*', where: 'role = "ADMIN"' },
    { grant: 'READ', where: 'role = "EMPLOYEE"' }
]
service IdentityService {

    entity Users as projection on asset_management.Users{
        ID,
        firstName,
        lastName,
        email,
        role,
        department
    };

    entity Departments as projection on asset_management.Departments;
    
}
