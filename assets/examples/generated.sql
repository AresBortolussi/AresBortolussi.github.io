-- SQL Toolkit: reviewed schema only; no automatic execution.
PRAGMA foreign_keys=ON;
BEGIN;
CREATE TABLE "books" (
  "id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE "loans" (
  "id" INTEGER NOT NULL,
  "book_id" INTEGER NOT NULL,
  "member_id" INTEGER NOT NULL,
  "loan_date" TEXT NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE TABLE "members" (
  "id" INTEGER NOT NULL,
  "alias" TEXT NOT NULL,
  PRIMARY KEY ("id")
);
COMMIT;
