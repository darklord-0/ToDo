var inputodo = document.getElementById("todo");
var addbtn = document.getElementById("add");
var parentdiv = document.getElementById("parent");


var storedarray =  localStorage.getItem("todos") || "[]" ;

if(storedarray)
{
  storedarray = JSON.parse(storedarray);
  
  storedarray.forEach(function(items)
  {
    insideEachToDo(items); 
  });
}


function insideEachToDo(items)
{
  
  var itemList = document.createElement("div");
  itemList.style["margin-bottom"]  = "10px";
  itemList.classList.add("item");

  var item = document.createElement("p");
  item.innerHTML = items.todo;


  if(items.status=="1")
    {
      item.classList.add("todocheck");
      
      // console.log(itemList);
      console.log(itemList.children);
      console.log(itemList.children.length);
      
      console.log(itemList.childNodes);
      console.log(itemList.childNodes.length);

    }

  var checkbox = document.createElement("input");
  checkbox.setAttribute("type","checkbox");
  checkbox.classList.add("checkbox");

  checkbox.addEventListener("change" ,function(e){

    if(e.target.checked)
    {    
      items.status = "1";  
      item.classList.add("todocheck");
    }
    else
    {
      items.status = "0";
      item.classList.remove("todocheck");
    }

    localStorage.setItem("todos",JSON.stringify(storedarray));

  });



  var delbtn = document.createElement("button");
  delbtn.innerHTML = "&#9747";
  delbtn.classList.add("delbtn");

  delbtn.addEventListener("click",function(){

    deleteToDo(itemList,parentdiv,items);   

  });


  var rename = document.createElement("button");
  rename.innerHTML="&#9998;";
  rename.classList.add("renbtn");

  rename.addEventListener("click",function(){

    var newval  = prompt("enter new value");
    
    // var index = storedarray.indexOf(items);
    if(newval)
    {
      items.todo = newval;
      item.innerHTML = newval;
    }

    localStorage.setItem("todos", JSON.stringify(storedarray));

  });


  itemList.appendChild(checkbox);
  itemList.appendChild(item);
  itemList.appendChild(delbtn);
  itemList.appendChild(rename);

  parentdiv.appendChild(itemList);
}


function deleteToDo(itemList,parentdiv,items)
{
   // deleting from UI
    parentdiv.removeChild(itemList);

    // deleting from LocalStorage
    var index = storedarray.indexOf(items);
    
    storedarray.splice(index , 1);

    localStorage.setItem("todos", JSON.stringify(storedarray));
}

function addingtodos(todo)
{
  if(!todo)
    {
      inputodo.setAttribute("class","warning");
      alert("Fill this field first");
      return; 
    }
    inputodo.classList.remove("warning");

    const items = {
      todo : todo,
      status: status
    }
    
    items.todo = todo;
    items.status = "0";

    insideEachToDo(items);
    
    storedarray.push(items);

    localStorage.setItem("todos",JSON.stringify(storedarray));

    inputodo.value="";

}

inputodo.addEventListener("keypress",function(e){

  // e.preventDefault();
  // e.stopPropagation();

  var todo = inputodo.value;

  if(e.key=="Enter")
  {
    addingtodos(todo);
  }

});


addbtn.addEventListener("click",function(e){

  var todo = inputodo.value;

  addingtodos(todo);

});

