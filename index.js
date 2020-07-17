const mysqlDB = require("./server")
const express = require("express")
const uuid = require("uuid")
var passwordHash = require('password-hash');
const bodyParser = require('body-parser');
const { json } = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Función POST para añadir Post
app.post('/addPost', (req, res)=>{
    
    //Este diccionario guarda los atributos pasados por req.body para realizar el INSERT a MySQL
    let post = {id:uuid.v4(), title:req.body.title, description: req.body.description, 
    content:req.body.content, image:req.body.image, publish_date:new Date().toString()};
    let sql = 'INSERT INTO post SET ?';
    mysqlDB.db.query(sql, post, (err, result)=>{
        if(err){console.log("Error: "+err); res.send(err);} 
        else{
            console.log("Post Succesfully uploaded: "+result)
            res.send("Post Upload");
        }
    });
});

//Función POST Registro de Usuario (Validación de Email y verificar Registro previo)
app.post('/addUser', (req, res)=>{

    //Email Verficiation
    const verification_str = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const verification =  verification_str.test(req.body.email);
    if(verification){
        //Este diccionario guarda los atributos pasados por req.body para realizar el INSERT a MySQL
        let user = {id:uuid.v4(), name:req.body.name, email:req.body.email, register_date:new Date().toString(),
        hashed_password:passwordHash.generate(req.body.password)};
        let sql = 'INSERT INTO user SET ?';
        mysqlDB.db.query(sql, user, (err, result)=>{
            if(err){console.log("Error: "+err); res.send(err);} 
            else{
                console.log("Registered Succesfully uploaded: "+result)
                res.send("User Registered");
            }
            
        }); }
    else{
        console.log("Not valid email")
        res.send("Invalid Email");
    }
    
});

//Función POST Creación de Categoría 
app.post('/addCategory', (req, res)=>{
        
    //Este diccionario guarda los atributos pasados por req.body para realizar el INSERT a MySQL
    let category = {id:uuid.v4(), name:req.body.name, description: req.body.description, publish_date:new Date().toString()};
    let sql = 'INSERT INTO category SET ?';
    mysqlDB.db.query(sql, category, (err, result)=>{
        if(err){console.log("Error: "+err);  res.send(err);} 
        else{
            console.log("Category Succesfully uploaded: "+result)
            res.send("Category Upload");
        }
    });
});

//Función GET de Categorías (Índice de categorías)
app.get('/getCategories', (req, res)=>{
    
    let sql = 'SELECT * FROM category';
    mysqlDB.db.query(sql,(err, result)=>{
        if(err){console.log("Error: "+err);} 
        else{
        // Itera por los nombres de las categorías 
        Object.keys(result).forEach((key)=> {
            var row = result[key];
            console.log(row.name)})   
            }
            res.send("Categories Fetched");
    });
});

//Función GET para Posts por categoría ***CHECAR  el parámetro para pasar category_fk
app.get('/getPostsByCategory/:id', (req, res)=>{
    
    // ERASE cc226865-7d8a-4d3b-94a2-d166746dec30
    let sql = 'SELECT * FROM post WHERE category_fk = ?';
    mysqlDB.db.query(sql, req.params.id,  (err, result)=>{
        if(err){console.log("Error: "+err);} 
        else{
        // Itera por los nombres de las categorías 
        if(Object.keys(result).length === 0){res.send("There are any related posts");}
        else{
            Object.keys(result).forEach((key)=> {
                var row = result[key];
                console.log(row.title)})   
                }
                res.send("Posts Fetched");
        }
    });
});

//Función UPDATE de atributo title para categoría
app.post('/updateCategoryName/:id', (req, res)=>{
    
    //e.g. Category ID: 1b2b6aa1-b589-44ab-a2e1-f6a08a29b46f
    //cc226865-7d8a-4d3b-94a2-d166746dec30
    let new_name = req.body.new_name;
    let category_id = req.params.id;
    let sql = `UPDATE category SET name = '${new_name}' WHERE id = '${category_id}'`;
    mysqlDB.db.query(sql,  (err, result)=>{
        if(err){console.log("Error: "+err); res.send(err);} 
        else{
            console.log(result)
            res.send("Category Title Updated");
        }
    });
});

//Función DELETE para Categoría junto los Posts relacionados
app.get('/deleteCategory/:id', (req, res)=>{
    
    let category_id = req.params.id;
    let posts_sql = `DELETE FROM post WHERE category_fk = '${category_id}'`;
    mysqlDB.db.query(posts_sql,  (err, result)=>{
        if(err){console.log("Failed to DELETE Posts: "+err);} 
        else{
            console.log("DELETED ALL CATEGORY POSTS")
            let category_sql = `DELETE FROM category WHERE id = '${category_id}'`;
            mysqlDB.db.query(category_sql,  (err, result)=>{
                if(err){console.log("Failed to DELETE Posts: "+err); res.send(err);} 
                else{
                    console.log("DELETED CATEGORY" + result)
                    res.send("DELETED CATEGORY");
                }
                });
        }
    });
});

//Función UPDATE de Post (show_post, content) (version++)
app.post('/updatePost/:id', (req, res)=>{
    
    let new_content = req.body.new_content;
    let new_show_post = req.body.new_show_post;
    let post_id = req.params.id;

    let version_sql = `SELECT * FROM post WHERE id = '${post_id}'`;
    mysqlDB.db.query(version_sql,  (err, result)=>{
        if(err){console.log("Error: "+err);res.send(err);} 
        else{
        // Itera por los nombres de las categorías 
        if(Object.keys(result).length === 0){res.send("Post not found");}
        else{
            Object.keys(result).forEach((key)=> {
                this.new_version = result[key].version + 1 })   
                
            let post_sql = `UPDATE post SET content = '${new_content}',
             show_post = '${new_show_post}', version = '${this.new_version}' WHERE id = '${post_id}'`;
            mysqlDB.db.query(post_sql,  (err, result)=>{
                if(err){console.log("Error: "+err); res.send(err);} 
                else{
                    console.log(result)
                    res.send("Post Updated");
                }
            }); 
        } 
        }
    });
    
});

//Función DELETE Post (Primero DELETE Likes)
app.get('/deletePost/:id', (req, res)=>{
    
    let post_id = req.params.id;
    let posts_sql = `DELETE FROM likes WHERE post_fk = '${post_id}'`;
    mysqlDB.db.query(posts_sql,  (err, result)=>{
        if(err){console.log("Failed to DELETE Posts: "+err);} 
        else{
            console.log("DELETED LIKES")
            let category_sql = `DELETE FROM post WHERE id = '${post_id}'`;
            mysqlDB.db.query(category_sql,  (err, result)=>{
                if(err){console.log("Failed to DELETE Post: "+err); res.send(err);} 
                else{
                    console.log("POST DELETED" + result)
                    res.send("POST DELETED ");
                }
                });
        }
    });
});

//Función POST Like (Crea Like con Foreign Keys de: User y Post) (Likes++ del Post)
app.post('/updateLikePost/:id', (req, res)=>{
    let post_id = req.params.id;
    let version_sql = `SELECT * FROM post WHERE id = '${post_id}'`;
    mysqlDB.db.query(version_sql,  (err, result)=>{
        if(err){console.log("Error: "+err);res.send(err);} 
        else{
        // Itera por los nombres de las categorías 
        if(Object.keys(result).length === 0){res.send("Post not found");}
        else{
            Object.keys(result).forEach((key)=> {
                this.update_likes = result[key].likes + 1 })   
                
            //e.g. Post ID: 13db3dce-bb08-420c-ac84-dc5c74b8e73a
            let post_sql = `UPDATE post SET likes = '${this.update_likes}' WHERE id = '${post_id}'`;
            mysqlDB.db.query(post_sql,  (err, result)=>{
                if(err){console.log("Error: "+err); res.send(err);} 
                else{
                    // Crea un nuevo like en la Tabla de Likes
                    //Static User_FK = bd2289ae-c58b-4912-9f9d-ee57d41413f3
                    let user_fk = "bd2289ae-c58b-4912-9f9d-ee57d41413f3"
                    let category = {id:uuid.v4(), user_fk:user_fk, post_fk:post_id, like_date:new Date().toString()};
                    let sql = 'INSERT INTO likes SET ?';
                    mysqlDB.db.query(sql, category, (err, result)=>{
                        if(err){console.log("Error: "+err);  res.send(err);} 
                        else{
                            console.log(result)
                            res.send("Like Posted");
                        }
                        });
                        }
            }); } 
        }
    });
    
});

//Función GET Likes: Nombres de Usuario con FK, llamando a la FK del post
app.get('/getPostLikes/:id', (req, res)=>{
    let post_id = req.params.id;
    let sql = 'SELECT * FROM likes WHERE post_fk = ?';
    mysqlDB.db.query(sql, post_id,  (err, result)=>{
        if(err){console.log("Error: "+err);} 
        else{
        // Itera por los nombres de las categorías 
        if(Object.keys(result).length === 0){res.send("Any Registered Likes");}
        else{
            Object.keys(result).forEach((key)=> {
                var row = result[key];
                console.log(row.user_fk)})   
                }
                res.send("Likes Fetched\n\n Total Likes: "+Object.keys(result).length);
        }
    });
});

//Función GET Búsqueda y Filtrado por título de Post
app.get('/getPostBySearch/:search', (req, res)=>{
    let search = req.params.search;
    console.log(search)
    let sql = `SELECT * FROM post WHERE title = '${search}'`;
    mysqlDB.db.query(sql,  (err, result)=>{
        if(err){console.log(err);} 
        else{
        // Itera por los nombres de las categorías 
        if(Object.keys(result).length === 0){res.send("No Posts Found");}
        else{
            let posts = []
            Object.keys(result).forEach((key)=> {
                var row = result[key];
                posts.push(row.title)
                console.log(row.title)})

            res.send("Posts Found: \n"+posts);   
                }
                
        }
    });
});

app.listen(3000, () => {
    console.log("Escuchando puerto", 3000);
});


//BORRAR:
// ALTER TABLE post ADD COLUMN category_fk varchar(255);
// ALTER TABLE post ADD constraint FK_Category FOREIGN KEY (category_fk) REFERENCES category(category_fk)




