const express = require('express');
const mysql = require('mysql'); 
const cors = require('cors');
const jwt = require('jsonwebtoken'); //jwt token
const multer = require("multer"); //multer for images

const JWT_SECRET = '76348734687346874363443434343443333333333'

const app = express();
app.use(express.json());
app.use(cors());

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

//connecting to database
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'yedo'
})

//For Login
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND passwords = ?";
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length > 0) {
            const user = result[0]; 
            const token = jwt.sign(
                { email: user.email, password: user.pass },
                JWT_SECRET,
                { expiresIn: '1h' } //token for 1h
            );

            return res.status(200).json({
                message: "Login successful",
                token, 
                user: { email: user.email, password: user.password }
            });
        } else {
            return res.status(401).json({ message: "Wrong username/password combination" });
        }
    });
});

//Getting information from token
app.get("/getUserFromToken", (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET); 
        const email = decodedToken.email;

        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const user = result[0];
            
            return res.status(200).json({ success: true, user } );
        });
    } catch (error) {
        console.error("Invalid token:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
});

/////////

//showing avaiable projects
app.get("/chooseProject", (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const email = decodedToken.email;
        
        const sql = `
            SELECT projects.* 
            FROM users 
            JOIN groups ON users.group_id = groups.groupId 
            JOIN projects ON projects.group_Id = groups.groupId 
            WHERE users.email = ? ;
        `;

        db.query(sql, [email], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "No projects found for the user" });
            }

            const projects = result.map(project => ({
                ...project,
                image: project.image ? Buffer.from(project.image).toString('base64') : null,
            }));
        
            return res.status(200).json({ success: true, projects });
        });
    } catch (error) {
        console.error("Invalid token:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
});

////////

//showing project entries
app.get("/getProjectInfo", (req, res) => {
    const authHeader = req.headers.authorization;
    const project_Id = req.query.projectNumber;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Authorization header missing"});
    }
    const token = authHeader.split(" ")[1]; 
    
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const email = decodedToken.email;

        const sql = `
            SELECT entries.* 
            FROM users 
            JOIN groups ON users.group_id = groups.groupId 
            JOIN projects ON projects.group_Id = groups.groupId
            JOIN entries ON projects.ProjectId = entries.project_Id
            WHERE users.email = ? and entries.project_Id = ?;
        `;

        db.query(sql, [email, project_Id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }

            // Return all matching projects
            const projects = result.map(project => ({
                ...project,
                image: project.image ? Buffer.from(project.image).toString('base64') : null, // Convert binary image to Base64
            }));
        
            return res.status(200).json({ success: true, projects });
        });
    } catch (error) {
        console.error("Invalid token:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
});


//inserting an entry 
app.post("/addingEntry", (req, res) => {
    const titleReg = req.body.titleReg;
    const descriptionReg = req.body.descriptionReg;
    const timeNow = req.body.timeNow;    
    const project_Id = req.body.chosenProject;
//add validation
    if(!titleReg || !descriptionReg || !project_Id){
        return res.status(400).json({success: false, massage:"All fields are required"})
    }else{
        db.query("Insert into entries (title, entryHour, description, project_id) values (?,?,?,?)", 
            [titleReg, timeNow ,descriptionReg, project_Id], (err, result) => {
            console.log(err);
        })
    }
})

//inserting an image
app.post("/uploadImage", upload.single("image"), (req, res) => {
    const titleReg = req.query.titleReg;
    const descriptionReg = req.query.descriptionReg;
    const timeNow = req.query.timeNow;    
    const project_Id = req.query.chosenProject;

    if (!req.file) {
        return res.status(400).send({ message: "No file uploaded!" });
    }

    const fileBuffer = req.file.buffer; // Get the file buffer
    const sql = "Insert into entries (title, entryHour, description, image, project_id) values (?,?,?,?,?)";

    db.query(sql, [titleReg, timeNow ,descriptionReg, fileBuffer, project_Id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send({ message: "Database error!" });
        }
        res.send({ message: "File uploaded successfully!" });
    });
});

//adding Project
app.post("/addingProject", (req, res) => {
    const nameReg = req.body.nameReg;
    const descriptionReg = req.body.descriptionReg;
    const timeNow = req.body.timeNow;    
    const email = req.body.email;
//add validation
    if(!nameReg || !descriptionReg){
        return res.status(400).json({success: false, massage:"All fields are required"})
    }else{
        db.query(`INSERT INTO projects (name, createTime, description, group_id)
                VALUES (?,?,? ,(SELECT group_id FROM users WHERE users.email = ?));`,
             [nameReg , timeNow, descriptionReg, email], (err, result) => {
            console.log(err);
        })
    }
})



//Belowe are things for handling ToDoList

//showing to do list
app.get("/getToDoList", (req, res) => {
    const authHeader = req.headers.authorization;
    const project_Id = req.query.projectNumber;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Authorization header missing"});
    }
    const token = authHeader.split(" ")[1]; 
    
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        
        const sql = `
            SELECT todolistentry.*
            FROM todolistentry
            WHERE todolistentry.project_id = ?;
        `;

        db.query(sql, [project_Id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }
            const projects = result.map(project => ({
                ...project,
            }));

            return res.status(200).json({ success: true, projects });
        });
    } catch (error) {
        console.error("Invalid token:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
});
app.post("/addTask", (req, res) => {
    const newTask = req.body.newTask;
    const project_Id = req.body.chosenProject;
    //add validation
        if(!newTask || !project_Id){
            return res.status(400).json({success: false, massage:"Field required"})
        }else{
            db.query("INSERT INTO todolistentry (entryContent, project_id) VALUES (?,?);", [newTask, project_Id], (err, result) => {
                console.log(err);
            })
        }
});

//deleting todolist
app.delete("/deleteTask", (req, res) => {
    const { taskId } = req.query; // Get the task ID from the query string

    if (!taskId) {
      return res.status(400).json({ success: false, message: "Task ID is required" });
    }
  
    const sql = "DELETE FROM todolistentry WHERE toDoListEntryID = ?";
  
    db.query(sql, [taskId], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
  
      if (result.affectedRows > 0) {
        return res.status(200).json({ success: true, message: "Task deleted successfully" });
      } else {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
    });
});

//changin <i> of task 
app.post("/slashTask", (req, res) => {
    const { taskId } = req.body; // Get the task ID from the request body

    if (!taskId) {
        return res.status(400).json({ success: false, message: "Task ID is required" });
    }

    // SQL to toggle the isSlash value
    const sql = `
        UPDATE todolistentry 
        SET isSlash = IF(isSlash = '1', '0', '1') 
        WHERE toDoListEntryID = ?;
    `;

    db.query(sql, [taskId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (result.affectedRows > 0) {
            return res.status(200).json({ success: true, message: "Task updated successfully" });
        } else {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
    });
});


app.listen(8081, () =>{
    console.log("listening to port 8081");
})

