const express = require("express");
const mysql = require("mysql");


// Create db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  // password : '123456',
  database: "sql_store"
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...");
});

const app = express();




// Get all customers
app.get("/customers", (req, res) => {

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

let sql = "SELECT 1, 2 FROM customers";


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
 * LIKE - operator
 *
 **/
let sql = `SELECT * FROM customers 
            WHERE last_name LIKE 'b%'`; // all customers where last_name starts with 'b'   
            
            // WHERE last_name LIKE '%b%'`; // all customers where last_name contains 'b'  

            // WHERE last_name LIKE '%b'`; // all customers where last_name ends with 'b' 

            // WHERE last_name LIKE '_b'`; // all customers where last_name consists from 2 letters and second one is 'b' 

            // WHERE last_name LIKE '___y'`; // all customers where last_name consists from 4 letters and 4 one is 'y' 

            // WHERE last_name LIKE 'b___y'`; 

            // WHERE address LIKE '%trail%' OR address LIKE '%avenue%'`; 

            // WHERE phone LIKE '%9'`; 




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
            ON orders.customer_id = customers.customer_id` 


            `SELECT order_id, first_name, last_name, o.customer_id
            FROM orders o
            INNER JOIN customers c
            ON o.customer_id = c.customer_id`


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
 * Self Outer Joins
 * 
 **/ 
let sql = `SELECT *
            FROM customers c 
            RIGHT JOIN orders o 
              ON c.customer_id = 0.customer_id`; 



  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});







// Get customer by id
app.get("/customers/:id", (req, res) => {
      let sql = `SELECT * FROM customers
                 WHERE customer_id = ${req.params.id}`
      let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        // if (!result.length) res.status(404).send('not found')
        res.send(result);
      });
    });



app.listen("3000", () => {
  console.log("Server started on port 3000");
});
