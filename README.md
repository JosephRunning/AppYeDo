## **YeDo is a simple web application for adding and managing projects.** <br>
### App is written using mainly react.js for frontend, node.js for backend and mySQL as database
To install this aplication go to folder and do:<br>
```
git clone https://github.com/JosephRunning/AppYeDo.git
cd AppYeDo/react-app
npm install

```
This will clone project and install all packages needed.<br>
### Starting backend and frontend 
To start **_backend_** go to AppYeDo/Backend and do:
```
npm start
```

To start **_frontend_** go to AppYeDo/react-app and do:
```
npm run dev
```

### Database settup
Start your database. I was using mySQL. <br>
Simple SQL structure will be in SQL.txt file which you can copy into your database
To login in application pls make a group and a user with that group. <br>
Example SQL query for that:
```
INSERT INTO `groups` (`groupId`, `name`, `project_id`) VALUES ('1', 'test_group', '1');
INSERT INTO `users` (`email`, `passwords`, `group_id`) VALUES ('asd@asd.com', 'asd', '1');
```
To make more groups and users you need to make them directly in sql.
<br>
<br>
After all that to use application pls go to:
```
http://localhost:5173/
```



