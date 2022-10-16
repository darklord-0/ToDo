const express = require("express");
const fs = require("fs");
const session = require('express-session')

const multer  = require('multer')
const upload = multer({ dest: 'uploads' })

const startDb = require('./database/init');
const userModel = require('./database/models/user')
const todoModel = require('./database/models/todo')

startDb();

const app = express();



app.use( express.static("public") );
app.use( express.static("uploads") );
app.use( express.json() );
app.use( express.urlencoded({extended : true}) )


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }	
}))

app.set("view engine","ejs");
app.set("views","views")

app.listen(3000,function(req,res)
{
	console.log('server started on port 3000');
});


app.get("/", Home);

app.route("/todo").get(GetTodo).post(upload.single('todopic') , PostTodo);
app.route("/todo/:val").delete(DeleteTodo).put(EditToDo);

//this or use MW static uploads
// app.get("/uploads/:id",function(req , res)
// {
// 	res.sendFile(__dirname + "/uploads/" + req.params.id)
// })

app.get("/user",GetUser);

app.route("/signin")
.get(function(req,res)
{
	if(!req.session.isLoggedIn)
	{
		res.render("signin", { error : "" });
	}
	else
	{
		res.redirect("/");
	}
})
.post(function(req,res)
{
	console.log("post signin")

	getUser( req.body.username , req.body.password , function(err , user)
	{

		console.log("1",user)
		if(user.length === 1)
		{
			req.session.username = user[0].username;
			// req.session.todopic = user[0].todopic;
			req.session.isLoggedIn = true;	// creating a flag
			// res.end("login success");
			res.redirect("/");
		}
		else
		{
			res.render("signin" , { error : "user not found, login failed" });
		}
	})
})


app.route("/signup")
.get(function(req,res)
{
	res.sendFile(__dirname + "/public/html/signup.html");
})
.post(function(req,res)
{
	saveUser(req.body,  function(err)
	{
		if(err)
		{
			res.render("signup" , {error : "cant save user, already exists"});
		}
		else
		{
			// res.end("success signup")

			res.redirect("/signin")
		}
	})

})



app.get("/logout",function(req,res)
{
	req.session.destroy();
	res.redirect("/");
})


function GetUser(req,res)
{

	if(req.session.isLoggedIn)
	{
		res.json(req.session.username);
	}
	else
		res.end("login first");
}


function Home(req,res)
{
	
	if(req.session.isLoggedIn)
	{
		getTodos(function(err,todos)
		{

			const userTodos = todos.filter(function(todo)
			{
				return todo.createdBy === req.session.username;
			})

			// console.log("2" ,req.session.todopic );
			
			res.render("home" ,{ data : userTodos , username : req.session.username , todopic : req.session.todopic });
		// res.sendFile(__dirname + "/public/html/home.html");

		})
	}
	else
	{
		res.redirect("/signin");
	}
}

function PostTodo(req,res)
{
	console.log(req.file)

	req.session.todopic = req.file.filename;


	const todo = {
		task : req.body.task,
		createdBy : req.session.username,
		todopic : req.file.filename
	}

	saveTodo( todo , function(err)
	{
		if(err)
		{
			console.log(err)
		}
		res.redirect("/");
	});

}

function GetTodo(req,res)
{
	getTodos(function(err,todos)
	{
		if(err)
		{
			console.log(err)
		}
		res.json(todos);
	})
}

function DeleteTodo(req,res)
{
	console.log("delete req came")

	getTodos(function(err,data)
	{
		let index = 0;		
		data.forEach(function(v)
		{

			if( v.task === req.params.val)
			{
				index =  data.indexOf(v);
				return;
			}  

		})
		
		data.splice(index,1);
	
		deleteandwrite(data)

	});
}

function EditToDo(req,res)
{
	// for checkbox and renaming
	
	let oldval = req.params.val;
	let newval = req.body;

	// console.log(oldval)

	if(newval.task)
	{
		getTodos(function(err,data)
		{

		// console.log('check1');
			data.forEach(function(ele)
			{
				if(ele.task === oldval )
				{
					ele.task = newval.task;
				}
			})
			
			deleteandwrite(data);
		});
	}
	else 
	{
		// console.log('check2');
		getTodos(function(err,data)
		{
			data.forEach(function(ele)
			{
				if(ele.task === oldval)
				{
					ele.ischecked = newval.ischecked;
				}
			})

			deleteandwrite(data);
		})
	}

}	

function deleteandwrite(data)
{
	fs.writeFileSync('./todo.txt', JSON.stringify(data), 
	{
	encoding: 'utf8',
	flag: 'w'
	})

}


function getTodos(callback)
{

	todoModel.find({})
	.then(function(todos)
	{
		callback(null , todos)	
	})
	.catch(function(err)
	{
		callback("cant get todos")
	})

}


function saveTodo(todo, callback)
{

	todoModel.create(todo)
	.then(function()
	{
		callback(null)	
	})
	.catch(function()
	{
		callback("cant save todo")
	})

}



function saveUser(user, callback)
{
	
	console.log('saveuser', user)

	userModel.create(user)
	.then(function()
	{
		callback(null)	
	})
	.catch(function(err)
	{
		callback(err)
	})
}


function getUser(username , password , callback)
{

	userModel.find({username:username , password:password})
	.then(function(data)
	{
		callback(null , data)	
	})
	.catch(function(err)
	{
		callback(err)
	})

}