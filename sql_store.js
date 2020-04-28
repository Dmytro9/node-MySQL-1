const express = require('express');
const mysql = require('mysql');

// Create db connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  // password : '123456',
  database: 'sql_store'
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

const app = express();

// Get all customers
app.get('/customers', (req, res) => {
  /*
   * Specific props
   *
   **/
  let sql = `SELECT customer_id, first_name  FROM customers`;

  /*
   * with calculation (write also  AS 'discount factor')
   *
   **/
  let sql = `SELECT customer_id, first_name,
            points,
            (points + 10) * 100 AS discount_factor,
            points - 10,
            points * 10 + 100,
            points % 10
            FROM customers`;

  let sql = 'SELECT 1, 2 FROM customers';

  /*
   * Unique positions ('state' in this case) without duplacates
   *
   **/
  let sql = `SELECT DISTINCT state FROM customers`;

  /*
   * Normal one with order
   *
   **/
  let sql = `SELECT * FROM customers 
            ORDER by first_name`;

  /*
   * Where prop > >= < <= = != <>
   *
   **/
  let sql = `SELECT * FROM customers 
            WHERE points > 3000`;
  // WHERE points >= 3000`;
  // WHERE points < 3000`;
  // WHERE points = 3000`;
  // WHERE points != 3000`;
  // WHERE points <> 3000`; (not equal)

  // WHERE state = 'VA'`;
  // WHERE state != 'VA'`; // WHERE state <> 'VA'`;
  // WHERE birth_date > '1900-01-01'`;

  /*
   * Combine conditions: AND OR NOT
   *
   **/
  let sql = `SELECT * FROM customers 
            WHERE points > 3000 AND birth_date > '1900-01-01'`;

  // WHERE points > 3000 OR birth_date > '1900-01-01'`; (at least one condition)

  // WHERE points > 3000 OR birth_date > '1900-01-01' AND state = 'VA'`;

  // WHERE points > 3000 OR ( birth_date > '1900-01-01' AND state = 'VA' )`;

  // WHERE NOT ( points > 3000 OR birth_date > '1900-01-01' )`;

  // WHERE order_id > 3000 AND unit_price * quantity > 30 )`; // with calculationg inside

  /*
   * IN - operator
   *
   **/
  let sql = `SELECT * FROM customers 
            WHERE state IN ('VA', 'FL', 'GA')`;

  // WHERE state NOT IN ('VA', 'FL', 'GA')`;

  /*
   * BETWEEN - operator (inclusive >= 1000 and <= 3000)
   *
   **/
  let sql = `SELECT * FROM customers 
            WHERE points BETWEEN 1000 AND 3000`;

  /*
   * LIKE - operator (for search usually) a string matches a pattern
   * ILIKE - case insensitive version of LIKE
   *
   **/
  let sql = `SELECT * FROM customers 
            WHERE last_name LIKE 'b%'`; // all customers where last_name starts with 'b'

  // _	matches any single character
  // %	matches any number of characters

  // WHERE last_name LIKE '%b%'`; // all customers where last_name contains 'b'

  // WHERE last_name LIKE '%b'`; // all customers where last_name ends with 'b'

  // WHERE last_name LIKE '_b'`; // all customers where last_name consists from 2 letters and second one is 'b'

  // WHERE last_name LIKE '___y'`; // all customers where last_name consists from 4 letters and 4 one is 'y'

  // WHERE last_name LIKE 'b___y'`;

  // WHERE address LIKE '%trail%' OR address LIKE '%avenue%'`;

  // WHERE phone LIKE '%9'`;

  /*
   * SIMILAR TO - operator (regexp)
   *
   * SELECT * FROM tracks WHERE composer SIMILAR TO '%(AC/DC|Green Day)%';
   *
   **/

  /*
   * REGEXP - operator
   *
   * ^ beginning
   * $ end
   * | logical or
   * [abcd]
   * [a-h]
   *
   **/

  let sql = `SELECT * FROM customers 
            WHERE last_name REGEXP 'field'`;

  // WHERE last_name REGEXP '^field'`; // starts with field

  // WHERE last_name REGEXP 'field$'`; // ends with field

  // WHERE last_name REGEXP 'field|mac'`; // last_name is/contains field or mac

  // WHERE last_name REGEXP 'field|mac|rose'`; // last_name is/contains field or mac or rose

  // WHERE last_name REGEXP '^field|mac|rose'`; // starts with field or is/contains mac or rose in last_name

  // WHERE last_name REGEXP '[gim]e'`; before 'e' in last_name is 'g or i or m'

  // WHERE last_name REGEXP '[a-h]e'`; before 'e' in last_name is letter from a to h

  /*
   * NULL - operator
   *
   * empty value
   *
   **/
  let sql = `SELECT * FROM customers 
            WHERE phone IS NULL`;

  // WHERE phone IS NOT NULL`;

  /*
   * ORDER BY - operator
   *
   *
   **/
  let sql = `SELECT * FROM customers 
            ORDER BY fist_name`;

  // ORDER BY fist_name DESC`;

  // ORDER BY state, fist_name`;

  // ORDER BY state DESC, fist_name DESC`;

  // ORDER BY 1, 2`; // bad - it can be added some additional fields to SELECT - ( SELECT one, two, three FROM customers )

  `SELECT *, quantity * unit_price AS total_price 
            FROM customers 
            ORDER BY total_price DESC`;

  // or

  `SELECT * 
             FROM customers 
             ORDER BY quantity * unit_price DESC`;

  /*
   * Limit
   *
   * pagination
   * -- page 1: 1 - 3
   * -- page 2: 3 - 6
   * -- page 3: 7 - 9
   *
   **/
  let sql = `SELECT * FROM customers 
            LIMIT 3`;

  // LIMIT 3000`; // will return all if 3000 > than there are in table

  // LIMIT 6, 3`; // pagination: page 3 (skip 6 records and return after 6 3 records)

  /*
   * COUNT(name of column or *)
   *
   *
   **/
  let sql = `SELECT COUNT(*) FROM tracks;`; // COUNT 3503
  let sql = `SELECT COUNT(album) FROM tracks;`; // COUNT of specific columns

  /*
   * (INNER) JOIN - INNER is optionaly
   * get data from two ref tables
   *
   **/
  let sql = `SELECT * FROM orders 
            INNER JOIN customers 
              ON orders.customer_id = customers.customer_id`;

  `SELECT order_id, first_name, last_name, orders.customer_id
            FROM orders 
            INNER JOIN customers 
            ON orders.customer_id = customers.customer_id``SELECT order_id, first_name, last_name, o.customer_id
            FROM orders o
            INNER JOIN customers c
            ON o.customer_id = c.customer_id`;

  /*
   * Get data from different dbs
   *
   **/
  let sql = `SELECT * FROM order_items oi 
           JOIN sql_inventory.products p 
            ON oi.products_id = p.product_id`;

  /*
   * JOIN (self)
   *
   **/

  let sql = `SELECT e.employee_id, e.first_name, m.first_name AS manager 
           FROM employees e 
           JOIN employees m 
            ON e.reports_to = m.employee_id`;

  /*
   * JOIN more then 2 tables (and get specific fields)
   *
   **/

  let sql = `SELECT *
            FROM orders o 
            JOIN customers c 
              ON o.customer_id = c.customer_id
            JOIN order_statuses os 
              ON o.status = os.order_status_id`;

  `SELECT o.order_id, o.order_date, c.first_name, c.last_name, os.name AS status
              FROM orders o 
              JOIN customers c 
                ON o.customer_id = c.customer_id
              JOIN order_statuses os 
                ON o.status = os.order_status_id`;

  /*
   * JOIN 2 tables based on 2 columns (2 columns make uniq item)
   * compound join condition
   *
   **/

  let sql = `SELECT *
            FROM order_items oi 
            JOIN order_item_notes oin 
              ON oi.order_id = oin.order_id
              AND oi.product_id = oin.product_id`;

  /*
   * LEFT JOIN  (outer join)
   * return all customers even when customer doesn't have order
   *
   **/

  let sql = `SELECT *
            FROM customers c 
            LEFT JOIN orders o 
              ON c.customer_id = 0.customer_id`;

  /*
   * RIGHT JOIN  (outer join)
   * only customer with order ( when ON c.customer_id = 0.customer_id condition is true )
   *
   **/

  let sql = `SELECT *
            FROM customers c 
            RIGHT JOIN orders o 
              ON c.customer_id = 0.customer_id`;

  /*
   * RIGHT JOIN  (outer join) with multiply tables
   *
   **/

  let sql = `SELECT *
            FROM customers c 
            RIGHT JOIN orders o 
              ON c.customer_id = 0.customer_id`;

  /*
   * Self Outer Joins (also manager itself)
   *
   **/

  let sql = `SELECT e.employee_id, e.first_name, m.firts_name AS manager 
            FROM employees e 
            LEFT JOIN employees m
              ON e.reports_to = m.empotyee_id`;

  /*
   * The USING Clause (like ON o.customer_id = c.customer_id)
   *
   **/

  let sql = `SELECT o.order_id, c.firts_name, sh.name AS sipper 
            FROM orders o 
            JOIN customers c
              USING (customer_id)
            LEFT JOIN shippers sh
              USING (shipper_id)`; // should be exactly the same name of column in different tables

  // USING (shipper_id, order_id)`; // compound join condition

  /*
   * Cross Joins (combine columns with every record)
   *
   **/

  let sql = `SELECT 
              c.first_name AS customer
              p.name AS product
            FROM customers c 
            CROSS JOIN products p
            ORDER BY c.first_name`;

  // the same
  `SELECT 
              c.first_name AS customer
              o.name AS product
            FROM customers c, orders o 
            ORDER BY c.first_name`;

  /*
   * Unions (combine rows for multiply tables)
   *
   **/

  let sql = `SELECT 
              order_id,
              order_date,
              'Active' AS status  
            FROM orders
            WHERE order_date >= '2019-01-01'

          UNION  

          SELECT 
            order_id,
            order_date,
            'Archived' AS status  
          FROM orders
          WHERE order_date < '2019-01-01'`; // one table

  `SELECT 
              first_name,
            FROM customers

          UNION  

          SELECT 
            name,
          FROM shippers`; // two tables (should be the same number of select columns)

  /*
   * Insert into one table one row
   *
   **/

  let sql = `INSERT INTO customers
            VALUES (
              DEFAULT, 
              'John', 
              'Smith', 
              '1990-01-01',
              NULL // (DEFAULT),
              'address',
              'city',
              'CA',
              DEAFULT
              )`;

  `INSERT INTO customers (
            firts_name,
            last_name,
            birth_date,
            address,
            city,
            state
          )
            VALUES (
              'John', 
              'Smith', 
              '1990-01-01',
              'address',
              'city',
              'CA'
              )`;

  /*
   * Insert many rows into one table
   *
   **/

  let sql = `INSERT INTO shippers (name)
              VALUES ('Shipper1'),
                     ('Shipper2'),
                     ('Shipper3')`;

  /*
   * Insert data into multiply tables (child ref)
   *
   **/

  let sql = `INSERT INTO orders (customer_id, order_date, status)
              VALUES (1, '2019-01-02', 1)
              
           INSERT INTO order_items
            VALUES (LAST_INSERT_ID(), 1, 1, 2.95),    
            VALUES (LAST_INSERT_ID(), 2, 1, 4.88)`;

  /*
   * Copy table to a new table
   *
   **/

  let sql = `CREATE TABLE orders_archived AS
            SELECT * FROM orders` // order_id is not marked as primary key and not auto increment
  `INSERT INTO orders_archived
            SELECT * FROM orders 
            WHERE order_date < '2019-01-02'`; // when table is created

  /*
   * Update data in single row
   *
   **/

  let sql = `UPDATE invoices 
            SET payment_total = 10, 
            payment_date = '2019-01-02'
            WHERE invoices_id = 1`;

  `UPDATE invoices 
            SET 
              payment_total = invoices_total * 0.5, 
              payment_date = due_date
            WHERE invoices_id = 3`;

  /*
   * Update data in multiply rows
   *
   **/

  let sql = `UPDATE invoices 
            SET payment_total = 10, 
            payment_date = '2019-01-02'
            WHERE invoices_id IN (3, 4)`;

  `UPDATE invoices 
            SET payment_total = 10, 
            payment_date = '2019-01-02'`; // all

  `UPDATE customers 
            SET points = points + 50, 
            WHERE birth_date = '2019-01-02'`;

  /*
   * Using Subqueries in Updates
   *
   **/

  let sql = `UPDATE invoices 
           SET
            payment_total = invoice_total * 0.5
            payment_date = due_date
           WHERE client_id = (
             SELECT client_id
             FROM clients
             WHERE name = 'Myworks'
           )`;

  `UPDATE invoices 
           SET
            payment_total = invoice_total * 0.5
            payment_date = due_date
           WHERE client_id IN (
             SELECT client_id
             FROM clients
             WHERE state IN ('CA', 'NY')
           )`;

  /*
   * DELETE rows
   *
   **/

  let sql = `DELETE FROM invoices
            WHERE invoice_id = 1`;

  `DELETE FROM invoices
            WHERE client_id = (
              SELECT * FROM clients
              WHERE name = 'Myworks'
            )`;

  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

// Get customer by id
app.get('/customers/:id', (req, res) => {
  let sql = `SELECT * FROM customers
                 WHERE customer_id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    // if (!result.length) res.status(404).send('not found')
    res.send(result);
  });
});

app.listen('3000', () => {
  console.log('Server started on port 3000');
});

// viRdpJdDmjUWAw2
// skyworker
