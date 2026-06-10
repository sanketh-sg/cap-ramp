using { bookshop as my } from '../db/schema';

service BookshopService {
    //This way, services become facades to encapsulated domain data, exposing different aspects tailored to respective use cases.
    entity Books as projection on my.Books;
    entity Authors as projection on my.Authors;
    
    action submitOrder (book : Books:ID, quantity : Integer);
    

}