using { bookshop as my } from '../db/schema';

/** Serves end users browsing books and place orders */
service CatalogService {
  @readonly entity Books as select from my.Books {
    ID, title, author.name as author
  };
  @requires: 'authenticated-user'
  @insertonly entity Orders as projection on my.Orders;
}