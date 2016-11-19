var Header = React.createClass({
  logout: function(){
    firebase.auth().signOut().then(function() {
      window.location.replace("http://127.0.0.1:8080/");
    }, function(error) {
      console.log(error);
    });
  },

  componentDidUpdate: function(){
    $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
  },

  showAddModal: function(){
    $('#addConfirmation').appendTo("body").modal('show');
  },

  render: function() {
    return (
        <div className="wrapper">
            <header className="main-header">
                <a href="Inventory.html" className="logo">
                    <span className="logo-mini"><b>DD</b></span>
                    <span className="logo-lg" id="mainHeader">Dental Depot</span>
                </a>
                <nav className="navbar navbar-static-top">
                    <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a>
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li>
                                <a href="#"><span onClick={this.logout}>
                                    <img className="profileDropdown" src="../bootstrap/icons/tooth.png" data-toggle="tooltip" title="Logout" data-placement="left"/>
                                </span></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
    );
  }
});

var Body = React.createClass({
  render: function() {
      return (
          <div>
              <aside className="main-sidebar">
                  <section className="sidebar">
                      <ul className="sidebar-menu">
                          <br/>
                          <li className="header">NAVIGATION</li>
                          <li className="active"><a href="Inventory.html"><i className="fa fa-archive" id="sidebarImage"></i><span>Inventory</span></a></li>
                          <li><a href="Users.html"><i className="fa fa-users" id="sidebarImage"></i><span>Users</span></a></li>
                          <li><a href="Logs.html"><i className="fa fa-line-chart" id="sidebarImage"></i><span>Logs</span></a></li>
                          <li><a href="Profile.html"><i className="fa fa-user" id="sidebarImage"></i><span>Profile</span></a></li>
                      </ul>
                  </section>
              </aside>
              <div className="content-wrapper">
                  <section id="content" className="content"><Content/></section>
              </div>
          </div>
    );
  }
});

var Content = React.createClass({
  getInitialState: function() {
      return {
        curUser: "null",
        itemNameList: []
      };
  },

  componentDidMount: function(){
    const self = this;
    var uid = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('users/'+uid);
    ref.on('value', function(snapshot) {
      self.setState({
        curUser: snapshot.val().firstname+" "+snapshot.val().lastname
      });
    });
    var ref = firebase.database().ref('items').orderByChild("item_name");
    ref.on('child_added', function(data) {
<<<<<<< HEAD
      var id=data.key
      var itemName = data.val().item_name;
      var stock = data.val().stock;
      
      $("#itemList").append("<tr id="+id+"><td>"+itemName+"</td><td>"+stock+"</td></tr>");
      $("#item").append("<option id="+id+" value="+id+">"+itemName+"</option>");
=======
      var id = data.key;
      var itemid = id;
      var itemName = data.val().item_name;
      var quantity = data.val().quantity;

      $("#itemList").append("<tr id="+id+"><td><center>"+itemid+"</center></td><td><center>"+itemName+"</center></td><td><center>"+quantity+"</center></td></tr>");
      $("#item").append("<option id="+id+" value="+id+"><center>"+itemName+"</center></option>");
>>>>>>> master
      $("#"+id+"").dblclick(function() {
        document.getElementById("item_id").value = id;
        document.getElementById("submit").click();
      });
    });

    ref.on('child_changed', function(data) {
<<<<<<< HEAD
      var id=data.key
      var itemName = data.val().item_name;
      var stock = data.val().stock;

      $("tr#"+id).replaceWith("<tr id="+id+"><td>"+itemName+"</td><td>"+stock+"</td></tr>");
      $("option#"+id).replaceWith("<option id="+id+" value="+id+">"+itemName+"</option>");
=======
      var id = data.key;
      var itemid = id;
      var itemName = data.val().item_name;
      var quantity = data.val().quantity;

      $("tr#"+id).replaceWith("<tr id="+id+"><td><center>"+itemid+"</center></td><td><center>"+itemName+"</center></td><td><center>"+quantity+"</center></td></tr>");
      $("option#"+id).replaceWith("<option id="+id+" value="+id+"><center>"+itemName+"</center></option>");
>>>>>>> master
      $("#"+id+"").dblclick(function() {
        document.getElementById("item_id").value = id;
        document.getElementById("submit").click();
      });
    });

    ref.on('child_removed', function(data) {
      var id=data.key
      $("tr#"+id).remove();
      $("option#"+id).remove();
    });
<<<<<<< HEAD
    
    $('#existingItemModal').on('hidden.bs.modal', function () {
      $("#item option:eq(0)").attr("selected", "selected");
      document.getElementById("ID").value = "";
      document.getElementById("existingDescription").value = "";
      document.getElementById("existingPrice").value = "";
      document.getElementById("existingStock").value = "";
      document.getElementById("additionalNumber").value = "";
    });

    $('#newItemModal').on('hidden.bs.modal', function () {
      document.getElementById("newItem").value="";
      document.getElementById("newNumber").value="";
      document.getElementById("newPrice").value="";
      document.getElementById("newDescription").value="";
    });

    $(document).ready(function () {
      (function ($) {
          $('#inventorySearch').keyup(function () {
            var rex = new RegExp($(this).val(), 'i');
            $('#itemList tr').hide();
            $('#itemList tr').filter(function () {
                return rex.test($(this).text());
            }).show();
            $('#no-data').hide();
            if($('#itemList tr:visible').length == 0)
            {
              $('#no-data').show();
            }
          })
      }(jQuery));
    });
=======

    $('#existingItemModal').on('hidden.bs.modal', function () {
        $("#item option:eq(0)").attr("selected", "selected");
        document.getElementById("ID").value = "";
        document.getElementById("existingDescription").value = "";
        document.getElementById("existingPrice").value = "";
        document.getElementById("existingStock").value = "";
        document.getElementById("additionalNumber").value = "";
      });

      $('#newItemModal').on('hidden.bs.modal', function () {
        document.getElementById("newItem").value="";
        document.getElementById("newNumber").value="";
        document.getElementById("newPrice").value="";
        document.getElementById("newDescription").value="";
      });

      $(document).ready(function () {
        (function ($) {
            $('#inventorySearch').keyup(function () {
              var rex = new RegExp($(this).val(), 'i');
              $('#itemList tr').hide();
              $('#itemList tr').filter(function () {
                  return rex.test($(this).text());
              }).show();
              $('#no-data').hide();
              if($('#itemList tr:visible').length == 0)
              {
                $('#no-data').show();
              }
            })
        }(jQuery));
      });
>>>>>>> master
  },

  showTable: function(){
    if($('#inventorySearch').val == null){
      $('#itemList tr').show();
    }
  },

  generateIDandDate: function(){
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    var ID = now.getFullYear()+""+(now.getMonth()+1)+""+now.getDate()+""+now.getHours()+""+now.getMinutes()+""+now.getSeconds()+""+now.getMilliseconds();
    document.getElementById("newId").value = ID;
    document.getElementById("newDate").value = today;
  },

  generateDate: function(){
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    document.getElementById("existingDate").value = today;
  },

  checkNewItem: function(){
      var itemName = document.getElementById("newItem").value;
      var stock = document.getElementById("newNumber").value;
      var price = document.getElementById("newPrice").value;
      var date = document.getElementById("newDate").value;

      if(itemName != "" && stock != "" && price != "" && date != ""){
          $('#addConfirmation').appendTo("body").modal('show');
      }else{
          document.getElementById("errorMessage").innerHTML= "Missing input.";
          $('#errorModal').appendTo("body").modal('show');
      }
  },

  checkExistingItem: function(){
      var id = document.getElementById("ID").value;
      var price = document.getElementById("existingPrice").value;
      var curStock = document.getElementById("existingStock").value;
      var addNumber = document.getElementById("additionalNumber").value;
      var date = document.getElementById("existingDate").value;

      if(id != "" && price != "" && curStock != "" && addNumber != "" && date != ""){
        $('#addExistingConfirmation').appendTo("body").modal('show');
      }else{
        document.getElementById("errorMessage").innerHTML= "Missing input.";
        $('#errorModal').appendTo("body").modal('show');
      }
  },

  addItem: function(){
    var now = new Date();
    var itemID = document.getElementById("newId").value;
    var itemName = document.getElementById("newItem").value;
    var qty = document.getElementById("newNumber").value;
    var price = document.getElementById("newPrice").value;
    var uid = firebase.auth().currentUser.uid;
    var date = document.getElementById("newDate").value;
    var description = document.getElementById("newDescription").value;
    var action = "Added item.";

<<<<<<< HEAD
    if(itemName && stock && price && description){
      firebase.database().ref('items').once('value', function(snapshot) {
        var iList = [];
        var found = false;
        snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val().item_name;
          var itemList = {name: item};
          iList.push(itemList);
        });
        for(var x = 0; x < iList.length; x++){
          if(iList[x].name == itemName){
            found = true;
            break;
          }
        }
        if(found == false){
          firebase.database().ref('items/'+itemID).set({
            key: itemID,
            item_name: itemName,
            description: description,
            stock: Number(stock),
            price: price
          });
          firebase.database().ref('users/'+uid).once('value', function(snapshot) {;
            var userName = snapshot.val().firstname+" "+snapshot.val().lastname;
            firebase.database().ref("items/"+itemID+"/item_history/").push().set({
              user: userName,
              date: date,
              action_performed: action,
              stock: Number(stock)
            });
          });
          firebase.database().ref("users/"+uid+"/activity").push().set({
            action: action,
            itemID: itemID,
            itemName: itemName,
            quantity: stock,
            date: date
          });
          alert(action);
          document.getElementById("newItem").value="";
          document.getElementById("newNumber").value="";
          document.getElementById("newPrice").value="";
          document.getElementById("newDescription").value="";
          $('#newItemModal').modal('hide');
        }else{
          alert("Duplicate item.");
        }
      });
    }else{
      alert("Missing input.");
    }  
=======
    firebase.database().ref('items').once('value', function(snapshot) {
      var iList = [];
      var found = false;
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val().item_name;
        var itemList = {name: item};
        iList.push(itemList);
      });
      for(var x = 0; x < iList.length; x++){
        if(iList[x].name == itemName){
          found = true;
          break;
        }
      }
      if(found == false){
        firebase.database().ref('items/'+itemID).set({
          key: itemID,
          item_name: itemName,
          description: description,
          quantity: Number(qty),
          price: price
        });
        firebase.database().ref('users/'+uid).once('value', function(snapshot) {;
          var userName = snapshot.val().firstname+" "+snapshot.val().lastname;
          firebase.database().ref("items/"+itemID+"/item_history/").push().set({
            user: userName,
            date: date,
            action_performed: action,
            quantity: Number(qty)
          });
        });
        firebase.database().ref("users/"+uid+"/activity").push().set({
          action_performed: action,
          object_changed: itemName,
          quantity: qty,
          date: date
        });
        document.getElementById("newItem").value="";
        document.getElementById("newNumber").value="";
        document.getElementById("newPrice").value="";
        document.getElementById("newDescription").value="";
        $('#addConfirmation').modal('hide');
        $('#newItemModal').modal('hide');
        $('#informSuccessAdd').appendTo("body").modal('show');
        setTimeout(function() { $("#informSuccessAdd").modal('hide'); }, 1000);
      }else{
        document.getElementById("errorMessage").innerHTML= "Duplicate item.";
        $('#errorModal').appendTo("body").modal('show');
        $('#addConfirmation').modal('hide');
      }
    });  
>>>>>>> master
  },

  displayItemOnModal: function(){
    var itemVal = document.getElementById("item").value;
<<<<<<< HEAD
    
    if(itemVal == ""){
      document.getElementById("ID").value = "";
      document.getElementById("existingDescription").value = "";
      document.getElementById("existingPrice").value = "";
      document.getElementById("existingStock").value = "";
    }else{
      var itemId = $("#item").val();
      var ref = firebase.database().ref('items/'+itemId);
      ref.once('value', function(snapshot) {
        document.getElementById("ID").value = itemId;
        document.getElementById("existingDescription").value = snapshot.val().description;
        document.getElementById("existingPrice").value = snapshot.val().price;
        document.getElementById("existingStock").value = snapshot.val().stock;
      });
    }
  },

  updateItem: function(){
    var itemName = $("#item option:selected").text();
    var id = document.getElementById("ID").value;
    var price = document.getElementById("existingPrice").value;
    var curStock = document.getElementById("existingStock").value;
    var addNumber = document.getElementById("additionalNumber").value;
    var date = document.getElementById("existingDate").value;
    var uid = firebase.auth().currentUser.uid;
    var action = "Restocked item."

    if(id && price && curStock && addNumber && date){
      var newStock = Number(curStock) + Number(addNumber);
      firebase.database().ref('items/'+id).update({
        price: price,
        stock: newStock
      });
=======

    if(itemVal == ""){
      document.getElementById("ID").value = "";
      document.getElementById("existingDescription").value = "";
      document.getElementById("existingPrice").value = "";
      document.getElementById("existingStock").value = "";
    }else{
      var itemId = $("#item").val();
      var ref = firebase.database().ref('items/'+itemId);
      ref.once('value', function(snapshot) {
        document.getElementById("ID").value = itemId;
        document.getElementById("existingDescription").value = snapshot.val().description;
        document.getElementById("existingPrice").value = snapshot.val().price;
        document.getElementById("existingStock").value = snapshot.val().quantity;
      });
    }
  },

  updateItem: function(){
    var itemName = $("#item option:selected").text();
    var id = document.getElementById("ID").value;
    var price = document.getElementById("existingPrice").value;
    var curStock = document.getElementById("existingStock").value;
    var addNumber = document.getElementById("additionalNumber").value;
    var date = document.getElementById("existingDate").value;
    var uid = firebase.auth().currentUser.uid;
    var action = "Restocked item."

    if(id && price && curStock && addNumber && date){
      var newStock = Number(curStock) + Number(addNumber);
      firebase.database().ref('items/'+id).update({
        price: price,
        quantity: newStock
      });
>>>>>>> master
      firebase.database().ref('users/'+uid).once('value', function(snapshot) {;
        var userName = snapshot.val().firstname+" "+snapshot.val().lastname;
        firebase.database().ref("items/"+id+"/item_history/").push().set({
          user: userName,
          date: date,
          action_performed: action,
<<<<<<< HEAD
          stock: addNumber
        });
      });
      firebase.database().ref("users/"+uid+"/activity").push().set({
        action: action,
        itemID: id,
        itemName: itemName,
        quantity: addNumber,
        date: date
      });
      alert(action);
=======
          quantity: addNumber
        });
      });
      firebase.database().ref("users/"+uid+"/activity").push().set({
        action_performed: action,
        object_changed: itemName,
        quantity: addNumber,
        date: date
      });
>>>>>>> master
      $("#item").val("");
      document.getElementById("ID").value = "";
      document.getElementById("existingPrice").value = "";
      document.getElementById("existingStock").value = "";
      document.getElementById("additionalNumber").value = "";
<<<<<<< HEAD
      $('#existingItemModal').modal('hide');
      document.getElementById("additionalNumber").value = "";
    }else{
      alert("Missing input.");
=======
      document.getElementById("additionalNumber").value = "";
      document.getElementById("existingDescription").value = "";
      $('#existingItemModal').modal('hide');
      $('#addExistingConfirmation').modal('hide');
      $('#informSuccessAddExisting').appendTo("body").modal('show');
      setTimeout(function() { $("#informSuccessAddExisting").modal('hide'); }, 1000);
    }else{
        document.getElementById("errorMessage").innerHTML= "Missing input.";
        $('#errorModal').appendTo("body").modal('show');
        $('#addExistingConfirmation').modal('hide');
>>>>>>> master
    }
  },

  render: function() {
    return (
<<<<<<< HEAD
      <div>
        <form id="itemIDForm" type="get" action="SpecificItem.html">
          <input type="hidden" id="item_id" name="item_id"/>
          <button type="submit" value="Send" name="submit" id="submit" style={{display: 'none'}}></button>
        </form>
        <br/><br/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <span className="pull-left">
              <input type="text" id="inventorySearch" onChange={this.showTable}/>
              <button id="inventoryButton"><img src="../bootstrap/icons/search.png" height="15px"/></button>
            </span>
            <span className="pull-right">
              <a className="btn btn-primary" id="addItem" href="" data-toggle="modal" data-target="#addItemModal">ADD ITEM</a>&nbsp; 
              <a className="btn btn-primary" id="addTransaction" href="Transaction.html">ADD TRANSACTION</a>
            </span>
=======
      <div id="mainContent">
          <form id="itemIDForm" type="get" action="SpecificItem.html">
              <input type="hidden" id="item_id" name="item_id"/>
              <button type="submit" value="Send" name="submit" id="submit" style={{display: 'none'}}></button>
          </form>
          <div className="box">
              <div className="box-header" id="headerContent">
                  <div className="col-sm-4">
                      <div className="input-group input-group-md">
                          <input type="text" name="tableSearch" className="form-control pull-right" id="inventorySearch" placeholder="Search" onChange={this.showTable}/>
                          <div className="input-group-btn">
                              <button type="submit" className="btn btn-default" id="inventoryButton">
                                  <i className="fa fa-search"></i>
                              </button>
                          </div>
                      </div>
                  </div>
                  <div className="col-sm-4"></div>
                  <div className="btn-group col-sm-2">
                      <button className="btn btn-primary">ADD ITEM</button>
                      <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                          <span className="caret"></span>
                          <span className="sr-only">Toggle Dropdown</span>
                      </button>
                      <ul className="dropdown-menu" role="menu">
                          <li><a data-toggle="modal" data-target="#newItemModal" onClick={this.generateIDandDate}>New Item</a></li>
                          <li><a data-toggle="modal" data-target="#existingItemModal" onClick={this.generateDate}>Existing Item</a></li>
                      </ul>
                  </div>
                  <div className="col-sm-2">
                      <a className="btn btn-primary pull-right" id="addTransaction" href="Transaction.html">ADD TRANSACTION</a>
                  </div>
              </div>
              <div className="box-body table-responsive" id="inventoryMainTable">
                  <table id="itemTable" className="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info">
                      <thead>
                          <tr>
                              <th><center>ITEM ID</center></th>
                              <th><center>ITEM NAME</center></th>
                              <th><center>IN STOCK</center></th>
                          </tr>
                      </thead>
                      <tbody id="itemList">
                          <tr id="no-data" style={{display:'none'}}>
                              <td><center>No Results Found.</center></td>
                              <td><center>No Results Found.</center></td>
                              <td><center>No Results Found.</center></td>
                          </tr>
                      </tbody>
                  </table>
              </div>
>>>>>>> master
          </div>
          <br/><br/>
          <div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12">  
            <table className="table table-hover table-striped table-bordered" id="itemsTable">
              <thead>
                <tr>
                  <th><center>NAME</center></th>
                  <th><center>STOCK</center></th>
                </tr>
              </thead>
              <tbody id="itemList">
                <tr id="no-data" style={{display:'none'}}>
                  <td>Result not found</td>
                  <td>Result not found</td>
              </tr>
              </tbody>
            </table>
          </div>      
        </div>

<<<<<<< HEAD
        <div className="example-modal">
          <div className="modal fade bs-example-modal-lg" id="addItemModal">
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body">
                  <a className="btn btn-primary" href="" data-toggle="modal" data-target="#newItemModal" onClick={this.generateIDandDate}>NEW ITEM</a>&nbsp;
                  <a className="btn btn-primary pull-right" href="" data-toggle="modal" data-target="#existingItemModal" onClick={this.generateIDandDate}>EXISTING ITEM</a>
                </div>
=======
          <div className="modal fade bs-example-modal-lg" id="newItemModal">
              <div className="modal-dialog modal-md">
                  <div className="modal-content">
                      <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 className="modal-title">Add New Item</h4>
                      </div>
                      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item ID</label>
                                  <input type="text" id="newId" readOnly className="form-control"/>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item Name</label>
                                  <input type="text" id="newItem" className="form-control"/>
                              </div>
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item Description</label>
                                  <textarea id="newDescription" className="form-control"></textarea>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Quantity</label>
                                  <input type="number" id="newNumber" className="form-control"/>
                              </div>
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item Price</label>
                                  <input type="number" id="newPrice" className="form-control"/>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>User</label>
                                  <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                              </div>
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Date</label>
                                  <input type="date" id="newDate" className="form-control"/>
                              </div>
                          </div>
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                          <button type="button" className="btn btn-primary" onClick={this.checkNewItem}>ADD</button>
                      </div>
                  </div>
>>>>>>> master
              </div>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="example-modal">
          <div className="modal fade bs-example-modal-lg" id="newItemModal">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">New Item</h4>
                </div>
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>ID</label>
                      <input type="text" id="newId" readOnly className="form-control"/>
                    </span>
                    <span>
                      <label>Item</label>
                      <input type="text" id="newItem" className="form-control"/>
                    </span>
                    <span>
                      <label>Number</label>
                      <input type="number" id="newNumber" className="form-control"/>
                    </span>
                    <span>
                      <label>Price</label>
                      <input type="number" id="newPrice" className="form-control" step=".01"/>
                    </span>
                    <span>
                      <label>User</label>
                      <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                    </span>
=======
          <div className="modal fade bs-example-modal-lg" id="addConfirmation">
              <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                      <div className="modal-body">
                          <center>
                              <h5>Add new item to inventory?</h5>
                              <button type="button" className="btn btn-primary" onClick={this.addItem} id="itemButtons">YES</button>
                              <button type="button" className="btn btn-default" data-dismiss="modal" id="confirmEditItemButtons">NO</button>
                          </center>
                      </div>
                  </div>
              </div>
          </div>

          <div className="modal fade modal-success" id="informSuccessAdd">
              <div className="modal-dialog modal-md">
                  <div className="modal-content">
                      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <center>
                              <h4><strong>Successfully Added New Item to Inventory.</strong></h4>
                          </center>
                      </div>
                  </div>
              </div>
          </div>

          <div className="modal fade modal-danger" id="errorModal">
              <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                      <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <center><h5 className="modal-title">ERROR</h5></center>
                      </div>
                      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <center>
                              <h5 id="errorMessage">Error</h5>
                              <br/>
                              <button type="button" className="btn btn-default btn-sm pull-right" data-dismiss="modal">OK</button>
                          </center>
                      </div>
>>>>>>> master
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>Description</label>
                      <textarea id="newDescription" className="form-control"></textarea>
                    </span>
                    <span>
                      <label>Date</label>
                      <input type="date" id="newDate" className="form-control"/>
                    </span>
                  </div>  
                  
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                  <button type="button" className="btn btn-primary" onClick={this.addItem}>ADD</button>
                </div>
              </div>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="example-modal">
          <div className="modal fade bs-example-modal-lg" id="existingItemModal">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Existing Item</h4>
                </div>
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <input type="hidden" id="ID" readOnly className="form-control"/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <span className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <label>Item</label>
                        <select id="item" className="form-control" onChange={this.displayItemOnModal}>
                          <option id="header" value="">- Choose an item -</option>
                        </select>
                      </span>
                      <span className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <label>Stock</label>
                        <input type="text" id="existingStock" readOnly className="form-control"/>
                      </span>
                      <span className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <label>Number</label>
                        <input type="number" id="additionalNumber" className="form-control" min="1"/>
                      </span>
                      <span className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <label>Description</label>
                        <textarea id="existingDescription" readOnly className="form-control"></textarea>
                      </span>
                    </div>

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <span>
                          <label>Price</label>
                          <input type="number" id="existingPrice" readOnly className="form-control" step=".01"/>
                        </span>
                        <span>
                          <label>User</label>
                          <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                        </span>
                      </div>
                      <span className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <label>Date</label>
                        <input type="date" id="existingDate" className="form-control"/>
                      </span>  
                    </div>  
                  
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                  <button type="button" id="update" className="btn btn-primary" onClick={this.updateItem}>UPDATE</button>
                </div>
=======
          <div className="modal fade bs-example-modal-lg" id="existingItemModal">
              <div className="modal-dialog modal-md">
                  <div className="modal-content">
                      <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 className="modal-title">Add Existing Item</h4>
                      </div>
                      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item ID</label>
                                  <input type="text" id="ID" readOnly className="form-control"/>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item Name</label>
                                  <select id="item" className="form-control" onChange={this.displayItemOnModal}>
                                      <option id="header" value="">- Choose an item -</option>
                                  </select>
                              </div>
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item Description</label>
                                  <textarea id="existingDescription" readOnly className="form-control"></textarea>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item Stock</label>
                                  <input type="text" id="existingStock" readOnly className="form-control"/>
                              </div>
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Quantity to Add</label>
                                  <input type="number" id="additionalNumber" className="form-control" min="1"/>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item Price</label>
                                  <input type="number" id="existingPrice" readOnly className="form-control" step=".01"/>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>User</label>
                                  <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                              </div>
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Date</label>
                                  <input type="date" id="existingDate" className="form-control"/>
                              </div>
                          </div>
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                          <button type="button" className="btn btn-primary" onClick={this.checkExistingItem}>ADD</button>
                      </div>
                  </div>
              </div>
          </div>

          <div className="modal fade bs-example-modal-lg" id="addExistingConfirmation">
              <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                      <div className="modal-body">
                          <center>
                              <h5>Add item stock to inventory?</h5>
                              <button type="button" className="btn btn-primary" onClick={this.updateItem} id="itemButtons">YES</button>
                              <button type="button" className="btn btn-default" data-dismiss="modal" id="confirmEditItemButtons">NO</button>
                          </center>
                      </div>
                  </div>
              </div>
          </div>

          <div className="modal fade modal-success" id="informSuccessAddExisting">
              <div className="modal-dialog modal-md">
                  <div className="modal-content">
                      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <center>
                              <h4><strong>Successfully Added to Item Stock.</strong></h4>
                          </center>
                      </div>
                  </div>
>>>>>>> master
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
});

var MainContent = React.createClass({
  getInitialState: function() {
      return { signedIn: false, type: 0 };
  },

  componentDidMount: function(){
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
<<<<<<< HEAD
        if (user.emailVerified) {
          var uid = firebase.auth().currentUser.uid;
          firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
            self.setState({ signedIn: true, type: snapshot.val().user_type });
            $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
          });
        }else {
          alert("Email is not verified");
          firebase.auth().signOut().then(function() {
            window.location.replace("http://127.0.0.1:8080/");
          }, function(error) {
            console.log(error);
          });
        }  
=======
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
          self.setState({ signedIn: true, type: snapshot.val().user_type });
          $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
        });
        /*if(self.state.type == 0){
          firebase.auth().signOut().then(function() {
            window.location.replace("http://127.0.0.1:8080/");
          });
        }*/
>>>>>>> master
      } else {
        self.setState({ signedIn: false });
        window.location.replace("http://127.0.0.1:8080/");
      }
    }, function(error) {
      console.log(error);
    });
  },

  render: function() {
    var res;
    if(this.state.signedIn == true){
      if(this.state.type == "admin"){
        res = (
          <div>
              <Header/>
              <Body/>
          </div>
        );
      }else if(this.state.type == "user"){
        window.location.replace("../user/Items.html");
      }
    }else{
      res = (
        <div>
        </div>
      );
    }
    return(
      res
    );
  }
});

ReactDOM.render(
  <MainContent/>,
  document.getElementById('main')
);
