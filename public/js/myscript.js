console.log('client script ')

const inputtodo = document.getElementById("inputtodo");
const addbtn = document.getElementById("addtodo");
const parent = document.getElementById("parent");
const username = document.getElementById("username");

const allcheckbox = document.querySelectorAll(".item input.checkbox") ;

getAllToDo();
getUser();

addbtn.addEventListener("click",function()
{

  const value = inputtodo.value;

  addToDo(value);

});

inputtodo.addEventListener("keypress",function(e){

  // e.preventDefault();
  // e.stopPropagation();
  var todo = inputtodo.value;

  if(e.key=="Enter")
  {
    addToDo(todo);
  }

});

function getUser()
{
  const userreq = new XMLHttpRequest;
  userreq.open("GET", "https://todoserver-3p34g89v2el8ugannf.codequotient.in/user");
  userreq.send();

  userreq.addEventListener("load",function()
  {
    username.innerText = "HI " +  JSON.parse(userreq.responseText) + " !";
  });
}


function addToDo(value)
{

  const check = checkValid(value);
 
  if(check)
  {

    const postOneTodoReq = new XMLHttpRequest();
    postOneTodoReq.open("POST","https://todoserver-3p34g89v2el8ugannf.codequotient.in/todo");
    postOneTodoReq.setRequestHeader("Content-Type","application/json");

    var body = {
      task : value,
      ischecked : false
    }

    postOneTodoReq.send(JSON.stringify(body));
    postOneTodoReq.addEventListener("load",function()
    {
      if(postOneTodoReq.status === 200)
      {
        insideEachToDo(body);
      }
      else
      {
        console.log("error in post todo  ,client ")
      }
    });
  }

}

function checkValid(value)
{
  if(!value)
  {
    inputtodo.setAttribute("class","warning");
    // alert("Fill this field first");
    return false; 
  }
  inputtodo.classList.remove("warning");
  
  return true;
}



function getAllToDo()
{

  const getAllTodoReq = new XMLHttpRequest();
  getAllTodoReq.open("GET","https://todoserver-3p34g89v2el8ugannf.codequotient.in/todo");

  getAllTodoReq.send();

  getAllTodoReq.addEventListener("load",function()
  {
    if(getAllTodoReq.status === 200)
    {
      var allTodos = JSON.parse(getAllTodoReq.responseText);

      allTodos.forEach(function(todo)
      {
        if(todo)
        {
          insideEachToDo(todo);
        }
      });
    }
    else
    {
      console.log("error in get todo  ,client ")
    }

  });
}


function insideEachToDo(todo)
{
 
  // let value = todo.task;
  
  inputtodo.value = "";

  const tododiv = document.createElement("div");
  tododiv.classList.add("item");

  const eachtodo = document.createElement("p");
  eachtodo.classList.add("eachtodo")
  eachtodo.innerText = todo.task;


  var checkbox = document.createElement("input");
  checkbox.setAttribute("type","checkbox");
  checkbox.classList.add("checkbox");

  if(todo.ischecked)
  {
    eachtodo.classList.add("todocheck");

    // todo.setAttribute("checked", "checked");
    // console.log(checkbox.checked)
    // console.log(tododiv.children);
  }
  else
  {
    eachtodo.classList.remove("todocheck");

  }
  
  checkbox.addEventListener("change" ,function(e){

    if(e.target.checked)
    {    
      eachtodo.classList.add("todocheck");
      
    }
    else
    {
      eachtodo.classList.remove("todocheck");
    }


    let oldval = eachtodo.innerText;
    const checkedToDoReq = new  XMLHttpRequest();
    checkedToDoReq.open("PUT",`https://todoserver-3p34g89v2el8ugannf.codequotient.in/todo/${oldval}`);
    checkedToDoReq.setRequestHeader("Content-Type","application/json");
    let renbody = {
      ischecked : e.target.checked
    }
    checkedToDoReq.send(JSON.stringify(renbody));

    checkedToDoReq.addEventListener("load",function()
    {
      console.log('rename req sent')
    })
  });



  var delbtn = document.createElement("button");
  delbtn.innerHTML = "&#9747";
  delbtn.classList.add("delbtn");

  delbtn.addEventListener("click",function(){

    deleteToDo(tododiv,eachtodo);   

  });

  var rename = document.createElement("button");
  rename.innerHTML="&#9998;";
  rename.classList.add("renbtn");

  rename.addEventListener("click",function(){

    renameToDo(eachtodo)

  });

  tododiv.appendChild(checkbox);
  tododiv.appendChild(eachtodo);
  tododiv.appendChild(delbtn);
  tododiv.appendChild(rename);

  parent.appendChild(tododiv); 
}

function deleteToDo(tododiv,eachtodo)
{
  tododiv.parentNode.removeChild(tododiv);

  const eachtodovalue = eachtodo.innerText;

  const delToDoReq = new  XMLHttpRequest();
  delToDoReq.open("DELETE",`https://todoserver-3p34g89v2el8ugannf.codequotient.in/todo/${eachtodovalue}`);
  delToDoReq.send();

  delToDoReq.addEventListener("load",function()
  {
    console.log('delete req sent')
  })
}

function renameToDo(eachtodo)
{
  let oldval = eachtodo.innerText;
  var newval  = prompt("enter new value");

  const valid = checkValid(newval);
  
  if(valid)
  {
    if(newval)
    {
      eachtodo.innerText = newval;
    }
  }


  const renToDoReq = new  XMLHttpRequest();
  renToDoReq.open("PUT",`https://todoserver-3p34g89v2el8ugannf.codequotient.in/todo/${oldval}`);
  renToDoReq.setRequestHeader("Content-Type","application/json");
  let renbody = {
    task : newval
  }
  renToDoReq.send(JSON.stringify(renbody));

  renToDoReq.addEventListener("load",function()
  {
    console.log('rename req sent')
  })

}