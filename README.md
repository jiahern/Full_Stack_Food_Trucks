**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Group Project Repository

Welcome!

We have added to this repository a `README.md`, `.gitignore`, and `.gitattributes`.

* **README.md**: is the document you are currently reading. It should be replaced with information about your project, and instructions on how to use your code in someone else's local computer.

* **.gitignore**: lets you filter out files that should not be added to git. For example, Windows 10 and Mac OS create hidden system files (e.g., .DS_Store) that are local to your computer and should not be part of the repository. This files should be filtered by the `.gitignore` file. This initial `.gitignore` has  been created to filter local files when using MacOS and Node. Depending on your project make sure you update the `.gitignore` file.  More information about this can be found in this [link](https://www.atlassian.com/git/tutorials/saving-changes/gitignore).

* **.gitattributes**: configures the line ending of files, to ensure consistency across development environments. More information can be found in this [link](https://git-scm.com/docs/gitattributes).

Remember that _"this document"_ can use `different formats` to **highlight** important information. This is just an example of different formating tools available for you. For help with the format you can find a guide [here](https://docs.github.com/en/github/writing-on-github).

## Table of contents
* [Team Members](#team-members)
* [General Info](#general-info)
* [Technologies](#technologies)
* [Commits for submission](#commits-for-submission)
* [Live website](#Live-website)
* [Database Details](#database-details)
* [Environment variables](#environment-variables)
* [Tests](#Tests)
* [Login Details](#login-details)
* [Postman](#postman)
* [Deliverable 3](#deliverable-3)


## Team Members

| Name | Student ID |
| :---         |     :---      |
| Kuoyuan Li  | 1072843     |
| Jia Hern Lee  | 997562      |
| Zhenyang Huang  | 1221982     |
| Kaiyuan Zheng  | 1024904     |
| Peicong Shangguan    | 1222843      |

Workload is evenly distributed to all team members in the team. No specific part is allocated to a couple of members.

## General info
This is a repository used for INFO30005 project ___Snacks in a Van___. Snacks in a Van runs a fleet of food trucks that work as popup cafe.

## Technologies
Project is created with:
* bcrypt: ^5.0.1
* bcrypt-nodejs: ^0.0.3
* bcryptjs: ^2.4.3
* body-parser: ^1.19.0
* connect-flash-plus: ^0.2.1
* cookie-parser: ^1.4.5
* cors: ^2.8.5
* dotenv: ^8.2.0
* express: 4.17.1
* express-handlebars: ^5.3.0
* express-session: ^1.17.2
* mongoose:^5.12.3
* NodeJs 14.15.1
* passport:^0.4.1
* passport-jwt: ^4.0.0
* passport-local: ^1.0.0

## Live website
The project is fully deployed on [Heroku](https://dashboard.heroku.com/apps/project-t18-hellozeus).The live website is https://project-t18-hellozeus.herokuapp.com/

## Commits For Submission
Please evaluate and grade our project based on **commit:8bd1acd70224999de62242e6c22c6685eaba3d96**

## Database Details
To access the MongoDB Atlas database via MongoDB Compass
```Bash
mongodb+srv://project-t18-hellozeus:allforhighscore@project-t18-hellozeus.shgk0.mongodb.net/test
```
This means the username is **project-t18-hellozeus** and password is **allforhighscore**

To access via the mongo shell
```Bash
mongo "mongodb+srv://project-t18-hellozeus.shgk0.mongodb.net/myFirstDatabase" --username project-t18-hellozeus
```
Replace **myFirstDatabase** with the name of the database that connections will use by default. You will be prompted for the password for the Database User, project-t18-hellozeus. When entering your password, make sure all special characters are URL encoded.

## Environment variables
Please include following for .env file:

MONGO_USERNAME = project-t18-hellozeus

MONGO_PASSWORD = allforhighscore

PASSPORT_KEY = 00000000

MODIFY_TIME = 600000

DISCOUNT_TIME = 900000

DISCOUNT = 0.8


## Tests
 **Integration test on setVanStatus**
 ```Bash
 npm test -- setVanStatus_integration.js --forceExit
 ```
 Run the above command to carry out the integration test. The expected respond will be statusCode 302 and this test could be passed properly.
 **Unit test on setVanStatus**
 ```Bash
 npm test -- setVanStatus_unit.js --forceExit
 ```
 Run the above command to carry out the unit test. 

## Login Details
Customer: Customer can sign up a new account, or sign in with the following dummy accounts

1. **User 1:**
    - Email (User name): test@test.com
    - Password: test0001

2. **User 2:**
    - Email (User name): test2@test.com
    - Password: test0002

3. **User 3:**
    - Email (User name): test3@test.com
    - Password: test0003

Van: Van can sign in using the provided van accounts

1. **Van 1:**
    - Van name: van001
    - Password: v001

2. **Van 2:**
    - Van name: van002
    - Password: v002

3. **Van 3:**
    - Van name: van003
    - Password: v003v003

4. **Van 4:**
    - Van name: van004
    - Password: v004
    
5. **Van 5:**
    - Van name: van005
    - Password: v005

6. **Van 6:**
    - Van name: van006
    - Password: v006

7. **Van 7:**
    - Van name: van007
    - Password: v007

8. **Van 8:**
    - Van name: van008
    - Password: v008


## Postman
Customer:
1.  Route: /customer/menu  
Request: GET  
Body: None  
Description: 
    - Successful case: 
      The route will hand this request to the specific controller, retriving and getting all the items of the menu including details from the database and return them in JSON format.
    - Failure case: 
      If the path in the request is not defined for the route, it will trigger 404 warning.

2.  Route: /customer/menu/Cappuccino  
Request: GET  
Body: None  
Description: 
    - Successful case: 
      The route will hand this request to the specific controller, retriving and getting the details (descriptions) of the specific item (which is Cappucino here) in the menu from the database.
    - Failure case: 
      If the van name is not found in the database, then return query failed.  

3.  Route: /customer/menu/Latte  
Request: GET  
Body: None  
Description: 
    - Successful case: 
      The route will hand this request to the specific controller, retriving and getting the details (descriptions) of the specific item (which is Latte here) in the menu from the database.
    - Failure case: 
      If the van name is not found in the database, then return query failed.  


4.  Route: /customer/customerOrders  
Request: POST  
Body: The order itself  
Description:
    - Successful case: 
    The route reads a JSON file from the client side, and stores the new order in the database collection ***orders*** with status ***ongoing***.
    - Failure case:
    If the new order does not meet the schema, then return "Database insert failed" message.


Vendor:
1.  Route: /vendor/van  
Request: GET  
Body: None  
Description: Return a list of all vans' infomation 

2.  Route: /vendor/getByName/:name  
Request: GET  
Body: The choosen van's name  
Description:
    - Successful case: 
      This route reads the van name as a path parameter from the client side, and looks it up in the database.
      Then, return the data of the demanding van once it’s found. 
    - Failure case: 
      If the van name is not in the database, then return a not found message.

3.  Route: /vendor/setVanStatus  
Request: POST  
Body: Choosen van's name and data that needs update  
Description:
    - Successful case: 
      This route reads a JSON file from the client side, and apply it as the desired updated version for
      the van. The JSON file must have a “name” attribute since it’s used to find the van in database.
      Multiple changes could be applied at the same time, including changing and adding new attributes. 
    - Failure case: 
      If the van name is not in the database, then return the van is not found. If the update violates
      the van schema(such as wrong status words, adding no existing attributes), return database update failed. 

4.  Route: /vendor/updateVanStatusOpen  
Request: POST  
Body: Choosen van's name  
Description: 
    - Successful case: 
      This route reads a JSON file from the client side. The JSON file must have a “name” attribute since it’s
      used to find the van which need to change status to "ready-to-orders" in database.  
    - Failure case:
      If the van name is not in the database, then return the van is not found.  

5.  Route: /vendor/updateVanStatusClosed  
Request: POST  
Body: Choosen van's name  
Description: 
    - Successful case:
      This route reads a JSON file from the client side. The JSON file must have a “name” attribute since it’s 
      used to find the van which need to change status to "closed" in database.  
    - Failure case:
      If the van name is not in the database, then return the van is not found.

6.  Route: /vendor/allOutstandingOrders  
Request: GET  
Body: None  
Description:
    - Successful case: 
    The route will hand this request to the specific controller, retriving and getting the details of all outstanding (i.e fulfilling and fulfilled) orders from the database.
    - Failure case:
      If the path in the request is not defined for the route, it will trigger 404 warning.



7.  Route: /vendor/updateOrderStatus  
Request: POST  
Body: OrderID of the choosen order  
Description: 
    - Successful case:
      This route reads a JSON file from the client side. The JSON file must have a “orderID” attribute since it’s
      used to find the order which need to change status to "fulfilled" in database.  
    - Failure case: 
      If the orderID is not in the database, then return the order is not found.

Details of the routes and their request body samples can be found in the submitted Postman JSON file


## Deliverable 3
1. **Feature 1:**
    - **Page:** https://project-t18-hellozeus-fe.herokuapp.com/customer/login
    - **Note:** You can use the url above to enter the login page. With the email and password provided, you can login. Once the email and password are checked as a valid user, the page will be redirected to the menu page. If the email and password are invalid, then it will remain at the login page.

2. **Feature 2:** 
    - **Page:** After successfully logged-in
    - **Note:** The menu page can be viewed by logging in with the valid user email and password provided in Login Details section. (ps: Sections in the navigation block -are not working for now except the "CART")

3. **Feature 3:**
    - **Page:** Menu page
    - **Note:** If you do not have an ongoing order, then you can add different food items into cart by clicking the "Add to Cart" button located at each food item's block. You can view the cart page by clicking the cart icon in the navigation bar.
    (ps: Currently, a new order can only contain one food item. If more food is clicked, the order could not be updated in the database.)

4. **Feature 4**
    - **Page (3 users with 3 different status):**
    https://project-t18-hellozeus-fe.herokuapp.com/customer/confirmOrderPage/6094c1b3ae94db2b2fcbec7f
    https://project-t18-hellozeus-fe.herokuapp.com/customer/confirmOrderPage/60951c49c017e10004b6ef6e
    https://project-t18-hellozeus-fe.herokuapp.com/customer/confirmOrderPage/60951cf5c017e10004b6ef71
    - **Note:** User confirm order page. For user1 (test@test.com) who has an ongoing order, goes to the confirm page will allow him/her to click the confirm button, and then the order will be confirmed and placed. Users can also attach a note to the order by clicking the "Add Note" button. After confirming, the user will be redirected to the order status page. For user2 (test2@test.com) and user3 (test3@test.com) who has an fulfilling/fulfilled order, goes to the confirm page will redirect him/her to the order status page.

5.  **Feature 5:** 
    - **Page (3 users with 3 different status):**
    https://project-t18-hellozeus-fe.herokuapp.com/customer/confirmOrderPage/6094c1b3ae94db2b2fcbec7f
    https://project-t18-hellozeus-fe.herokuapp.com/customer/confirmOrderPage/60951c49c017e10004b6ef6e
    https://project-t18-hellozeus-fe.herokuapp.com/customer/confirmOrderPage/60951cf5c017e10004b6ef71
    - **Note:** User check order status. For user1 (test@test.com) who has an ongoing order, goes to the order status page will tell him/her that you do not have a placed order. For user2 (test2@test.com) who has an fulfilling order, goes to the order status page will show them the order details and its current status(fulfilling for user2). Users can cancel or change the order here (not implemented yet).
For user3 (test3@test.com) who has an fulfilled order, goes to the order status page will show them the order details and its current status(fulfilled for user2).

