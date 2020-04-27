USE employee_db;


INSERT INTO departments (name)
VALUES ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 30000.00, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Janet", "Smith", 1, null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Barker", 1, 1);


  
    

   
-- joining tables
-- INSERT INTO authors (firstName, lastName) values ('Jane', 'Austen');
-- INSERT INTO authors (firstName, lastName) values ('Mark', 'Twain');
-- INSERT INTO authors (firstName, lastName) values ('Lewis', 'Carroll');
-- INSERT INTO authors (firstName, lastName) values ('Andre', 'Asselin');

-- INSERT INTO books (title, authorId) values ('Pride and Prejudice', 1);
-- INSERT INTO books (title, authorId) values ('Emma', 1);
-- INSERT INTO books (title, authorId) values ('The Adventures of Tom Sawyer', 2);
-- INSERT INTO books (title, authorId) values ('Adventures of Huckleberry Finn', 2);
-- INSERT INTO books (title, authorId) values ('Alice''s Adventures in Wonderland', 3);
-- INSERT INTO books (title, authorId) values ('Dracula', null);

-- SELECT * FROM authors;
-- SELECT * FROM books;

-- -- show ALL books with authors
-- -- INNER JOIN will only return all matching values from both tables
-- SELECT title, firstName, lastName
-- FROM books
-- INNER JOIN authors ON books.authorId = authors.id;

-- -- show ALL books, even if we don't know the author
-- -- LEFT JOIN returns all of the values from the left table, and the matching ones from the right table
-- SELECT title, firstName, lastName
-- FROM books
-- LEFT JOIN authors ON books.authorId = authors.id;

-- -- show ALL books, even if we don't know the author
-- -- RIGHT JOIN returns all of the values from the right table, and the matching ones from the left table
-- SELECT title, firstName, lastName
-- FROM books
-- RIGHT JOIN authors ON books.authorId = authors.id;

