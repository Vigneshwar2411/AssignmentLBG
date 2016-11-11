var account;
var mediatype = window.matchMedia("(max-width: 480px)");
var mt = document.getElementById("mobiletable");
//Flags
// var flag1 = false;
// var flag2 = false;
//catch the ids of the navigation menus in Mobile View
var leftaid = document.getElementById("left");
var rightaid = document.getElementById("right");
//Default value of interest type is declared
var def;
var i = 0;

//loadData function loads the HTML using XMLHttpRequest instead of AJAX
function loadData(){
            var http_request = new XMLHttpRequest();
            //Different try and catch for browsers compatiability
            try{
               http_request = new XMLHttpRequest();
            }catch (e){
               try{
                  http_request = new ActiveXObject("Msxml2.XMLHTTP");
               }catch (e) {
                  try{
                     http_request = new ActiveXObject("Microsoft.XMLHTTP");
                  }catch (e){
                     return false;
                  }
               }
            }

            http_request.onreadystatechange = function(){
               if (http_request.readyState == 4  ){
                  // Javascript function to parse JSON data
                  var jsonObj = JSON.parse(http_request.responseText);
                  console.log("JSON DATA",jsonObj);
                  account = jsonObj;
                  //media match is done to find the Mobile or Desktop view
                  if(mediatype.matches==true){
                    // flag1 = true;
                    leftaid.innerHTML = '';
                    rightaid.innerHTML = account[i+1].Product+"&gt";
                    def = account[i].Product;
                    MobileView();
                  }
                  else if(mediatype.matches==false){
                    console.log("Its Desktop or Tablet View",account);
                    // flag1 = false;
                    // flag2 = true;
                    DesktopView();
                  }
               }
            }
            //http request to get the data from JSON which is being served through JSON-server
            http_request.open("GET", "http://localhost:3001/account", true);
            http_request.send();
         };

//function when desktop view is opened
function DesktopView(){
  // if(flag2){
    var dt = document.getElementById("desktoptable");
    var dtcol = Object.keys(account[0]).length;
    var dtrow = dt.insertRow(-1);
    for (var propname in account[0]) {
          var headerCell = document.createElement("TH");
          headerCell.innerHTML = propname;
          dtrow.appendChild(headerCell);
      }
    account.map(function(data){
      var dtrow = dt.insertRow(-1);
          Object.values(data).map(function(value){
            var dataCell = dtrow.insertCell(-1);
            dataCell.innerHTML = value;
          })
    })
  // }
}

//function when mobile view is opened
function MobileView(){
  // if(flag1){
      account.map(function(data){
        if(data.Product == def){
          var row = mt.insertRow(-1);
          var headerCell = document.createElement("TH");
          headerCell.innerHTML = data.Product;
          row.appendChild(headerCell);
          Object.values(data).map(function(value,i){
            var row1 = mt.insertRow(-1);
            var dataCell = row1.insertCell(-1);
            //The if condition is to eliminate the headers
            if(value != def){
                dataCell.innerHTML = Object.keys(data)[i]+":"+value;
            }
          })
        }
      });
  }

//Change function is called when the navigation links are clicked in Mobile view
function change(id){
  console.log("id",id);
  mt.innerHTML = '';
  //Setting the names of the navigation links dynamically 
  if(id == "right"){
    leftaid.innerHTML = "&lt"+def;
    i++;
    def = account[i].Product;
      if(i==(account.length-1)){
        rightaid.innerHTML = '';
      }
      else{
        rightaid.innerHTML = account[i+1].Product+"&gt";
      }
  }
  else{
    i--;
    rightaid.innerHTML = def+"&gt";
    def = account[i].Product;
        if(i==0){
            leftaid.innerHTML = '';
        }

        else {
            leftaid.innerHTML = "&lt"+account[i-1].Product;
        }
  }
  MobileView();
}
