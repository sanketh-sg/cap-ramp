using { Currency, managed, sap } from '@sap/cds/common';
namespace bookshop;

entity Books : managed {
  key ID : Integer;
  title  : localized String;
  descr  : localized String;
  author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal;
  currency : Currency;
}

entity Authors : managed {
  key ID : Integer;
  name   : String;
  books  : Association to many Books on books.author = $self;
}

entity Genres : sap.common.CodeList {
  key ID : Integer;
  parent : Association to Genres;
}

entity Orders {
  key ID : UUID;
  title  : String;
  Items  : Composition of many OrderItems on Items.order = $self;
}
entity OrderItems {
  key order : Association to Orders;
  key pos  : Integer;
  descr: String;
}