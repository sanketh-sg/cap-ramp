using {bookshop as my} from '../db/schema';

/** Serves registered users managing their account and their orders */
@requires: 'authenticated-user'
service UsersService {
  @restrict: [{ grant: 'READ', where: 'buyer = $user' }] // limit to own ones
  @readonly entity Orders as projection on my.Orders;
  action cancelOrder ( ID: Orders:ID, reason:String );
}