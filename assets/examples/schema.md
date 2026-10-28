# Database schema

Generated from validated schema IR; no business data included.

## public.books

| Column | Type | Nullable |
|---|---|---|
| id | INTEGER | false |
| title | TEXT | false |

Primary key: id

## public.loans

| Column | Type | Nullable |
|---|---|---|
| id | INTEGER | false |
| book_id | INTEGER | false |
| member_id | INTEGER | false |
| loan_date | TEXT | false |

Primary key: id

Foreign key: book_id → public.books (id)

Foreign key: member_id → public.members (id)

## public.members

| Column | Type | Nullable |
|---|---|---|
| id | INTEGER | false |
| alias | TEXT | false |

Primary key: id

