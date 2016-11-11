var data;
var mediatype = window.matchMedia("(max-width: 480px)");
var mt = document.getElementById("mobiletable");
window.searchTable = {};

//loadData function loads the HTML using XMLHttpRequest instead of AJAX
function loadData(){
            // We are using different try catch for different browsers
            var http_request = new XMLHttpRequest();
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
                  var jsonObj = JSON.parse(http_request.responseText);
                  data = jsonObj;
                  //media match is done to find the Mobile or Desktop view
                  if(mediatype.matches==true){
                    MobileView();
                    searchTable.init("mobiletable");
                  }
                  else if(mediatype.matches==false){
                    DesktopView();
                    searchTable.init("desktoptable");
                  }
               }
            }
            http_request.open("GET", "http://localhost:3000/data", true);
            http_request.send();
         };

 //Initialize the search object
 searchTable.init = function(table) {
     this.Rows = document.getElementById(table).getElementsByTagName('TR');
     // Setting the object with the properties that are needed
     this.RowsLength = searchTable.Rows.length;
     this.RowsText = [];
     for (var i = 0; i < searchTable.RowsLength; i++) {
         this.RowsText[i] = (searchTable.Rows[i].innerText) ? searchTable.Rows[i].innerText.toUpperCase() : searchTable.Rows[i].textContent.toUpperCase();
     }
 }

//Create function for search as a part of Object
 searchTable.search = function(e) {
             var keycode;
             if (window.event) {
               keycode = window.event.keyCode;
             }
             else {
                return false;
              }
             if (keycode == 13) {
                 searchTable.runSearch();
             }
             else {
                return false;
              }
           }

 searchTable.runSearch = function() {
             // This is the search function triggered when user clicks serach button
             this.Term = document.getElementById('textBoxSearch').value.toUpperCase();
             //Hiding rows that do not match the search term
             for (var i = 1, row; row = this.Rows[i], rowText = this.RowsText[i]; i++) {
                 row.style.display = ((rowText.indexOf(this.Term) != -1) || this.Term === '') ? '' : 'none';
             }
         }

//function when desktop view is opened
function DesktopView(){
    var dt = document.getElementById("desktoptable");
    var dtcol = Object.keys(data[0]).length;
    var dtrow = dt.insertRow(-1);
  //Loop to get the Headers row in Table
    for (var propname in data[0]) {
          var headerCell = document.createElement("TH");
          headerCell.innerHTML = propname;
          dtrow.appendChild(headerCell);
      }
  //Loop through the data object to get the values(td in table)
    data.map(function(data){
      var dtrow = dt.insertRow(-1);
          Object.values(data).map(function(value){
            var dataCell = dtrow.insertCell(-1);
            dataCell.innerHTML = value;
          })
    })
}

//function when Mobile view is opened
function MobileView(){
        var mtcol = Object.keys(data[0]).length;
        var mtrow = mt.insertRow(-1);
    //Loop to get the Headers row in Table
        for (var propname in data[0]) {
              var headerCell = document.createElement("TH");
              if(propname == "Name" || propname == "Title"){
                headerCell.innerHTML = propname;
                mtrow.appendChild(headerCell);
              }
          }
    //Loop through the data object to get the values(td in table)
        data.map(function(data){
          var mtrow = mt.insertRow(-1);
              Object.values(data).map(function(value,i){
                if(Object.keys(data)[i] == "Name" || Object.keys(data)[i] == "Title"){
                  var dataCell = mtrow.insertCell(-1);
                  dataCell.innerHTML = value;
                }
              })
        })
  }
