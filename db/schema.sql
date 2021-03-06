DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments(
id INTEGER(10)AUTO_INCREMENT  NOT NULL  ,
name VARCHAR(100) NOT NULL,
PRIMARY KEY(id)
); 

CREATE TABLE roles(
id INTEGER(10)AUTO_INCREMENT  NOT NULL ,
title VARCHAR(100)NOT NULL ,
salary DECIMAL NOT NULL,
department_id INTEGER(10) NOT NULL,
PRIMARY KEY(id),
CONSTRAINT fk_departments FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);


CREATE TABLE employees(
id INTEGER(10)AUTO_INCREMENT  NOT NULL ,
first_name VARCHAR(45) NOT NULL,
last_name VARCHAR(45) NOT NULL,
role_id INTEGER(10) NOT NULL,
manager_id INTEGER(10),
PRIMARY KEY(id),
CONSTRAINT fk_roles FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
CONSTRAINT fk_mngr FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE CASCADE
);