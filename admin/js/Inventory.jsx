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

  showModal: function(){
    $('#logoutConfirmation').appendTo("body").modal('show');
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
                              <a href="#"><span data-target="#logoutConfirmation" data-toggle="modal" onClick={this.showModal}>
                                  <img className="profileDropdown" src="../bootstrap/icons/tooth.png" data-toggle="tooltip" title="Logout" data-placement="left"/>
                              </span></a>
                          </li>
                      </ul>
                  </div>
                  <div className="modal fade bs-example-modal-lg" id="logoutConfirmation">
                      <div className="modal-dialog modal-sm">
                          <div className="modal-content">
                              <div className="modal-body">
                                  <center>
                                      <h5>Logout from Dental Depot?</h5>
                                      <button type="button" className="btn btn-primary" onClick={this.logout} id="itemButtons">YES</button>
                                      <button type="button" className="btn btn-default" data-dismiss="modal" id="itemButtons">NO</button>
                                  </center>
                              </div>
                          </div>
                      </div>
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
                      <li><a href="Transaction.html"><i className="fa fa-shopping-cart" id="sidebarImage"></i><span>Transaction</span></a></li>
                      <li><a href="Users.html"><i className="fa fa-users" id="sidebarImage"></i><span>Users</span></a></li>
                      <li><a href="Logs.html"><i className="fa fa-line-chart" id="sidebarImage"></i><span>Logs</span></a></li>
                      <li><a href="Profile.html"><i className="fa fa-user" id="sidebarImage"></i><span>Profile</span></a></li>
                  </ul>
              </section>
          </aside>
          <div className="content-wrapper" style={{height: '100vh', backgroundColor: '#e1e1e1'}}>
              <div id="content" className="content" style={{backgroundColor: '#e1e1e1'}}>
                  <Content/>
              </div>
          </div>
      </div>
    );
  }
});

var Content = React.createClass({
  getInitialState: function() {
    return {
      curUser: "null"
    };
  },

  //display items to table and initialization of fields
  componentDidMount: function(){
    const self = this;
    var uid = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('users/'+uid);
    var inventoryItems = [];

    ref.on('child_removed', function(data) {
      firebase.auth().signOut().then(function() {
        window.location.replace("http://127.0.0.1:8080/");
      }, function(error) {
        console.log(error);
      });
    });

    ref.on('child_changed', function(data) {
      var typeRef = firebase.database().ref('users/'+uid +'/user_type');
      typeRef.on('value', function(snapshot) {
        if(snapshot.val() == "user"){
          window.location.reload();
        }
      });
    });

    ref.on('value', function(snapshot) {
      self.setState({
        curUser: snapshot.val().firstname+" "+snapshot.val().lastname,
      });
    });

    var ref = firebase.database().ref('items').orderByChild("item_name");
    ref.on('value', function(snapshot) {
      $('#itemTable').DataTable().clear().draw().destroy();
      snapshot.forEach(function(data) {
        var id = data.key;
        var itemID = id;
        var itemName = data.val().item_name;
        var quantity = data.val().quantity;
        var isDeleted = data.val().isDeleted;
        itemName = itemName.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");

        if(data.val().isDeleted == false){
          $("#itemList").append("<tr id="+id+"><td>"+itemID+"</td><td>"+itemName+"</td><td>"+quantity+"</td></tr>");
          $("#item").append("<option id="+id+" value="+id+">"+itemName+"</option>");
          $("#"+id+"").dblclick(function() {
            document.getElementById("item_id").value = id;
            document.getElementById("submit").click();
          });
        }
      });
      $('#itemTable').DataTable({
        dom: 'Bfrtip',
        buttons: ['print'],
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "retrieve": true,
        "autoWidth": false,
        "order": [[1, "asc"]]
      });
    });

    $('#existingItemModal').on('hidden.bs.modal', function () {
      $('#item option').eq(0).prop('selected', true);
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
        $("#newNumber, #newPrice, #additionalNumber").keypress(function(event) {
          if ( event.which == 45 ){
            event.preventDefault();
          }
        });
        $("#newNumber, #additionalNumber").keypress(function(event) {
          if ( event.which == 46 ){
            event.preventDefault();
          }
        });
        $('#newPrice').blur(function(){
          var num = parseFloat($(this).val());
          var cleanNum = num.toFixed(2);
          $(this).val(cleanNum);
        });
      }(jQuery));
    });
  },

  showTable: function(){
    if($('#inventorySearch').val == null){
      $('#itemList tr').show();
    }
  },

  generateIDandDate: function(){
    var now = new Date();
    var month=((now.getMonth()+1)>=10)? (now.getMonth()+1) : '0' + (now.getMonth()+1);
    var day=((now.getDate())>=10)? (now.getDate()) : '0' + (now.getDate());
    var today = now.getFullYear()+"-"+month+"-"+day;
    var ID = now.getFullYear()+""+(now.getMonth()+1)+""+now.getDate()+""+now.getHours()+""+now.getMinutes()+""+now.getSeconds()+""+now.getMilliseconds();
    document.getElementById("newId").value = ID;
    document.getElementById("newDate").value = today;
  },

  generateDate: function(){
    var now = new Date();
    var month=((now.getMonth()+1)>=10)? (now.getMonth()+1) : '0' + (now.getMonth()+1);
    var day=((now.getDate())>=10)? (now.getDate()) : '0' + (now.getDate());
    var today = now.getFullYear()+"-"+month+"-"+day;
    document.getElementById("existingDate").value = today;
  },

  checkNewItem: function(){
    var itemName = document.getElementById("newItem").value.trim();
    var stock = document.getElementById("newNumber").value.trim();
    var price = document.getElementById("newPrice").value.trim();
    var date = document.getElementById("newDate").value.trim();

    if(itemName != "" && stock != "" && price != "" && date != ""){
      if(Number(stock) <= 0 || Number(price) <= 0){
        document.getElementById("errorMessage").innerHTML= "Invalid quantity/price.";
        $('#errorModal').appendTo("body").modal('show');
      }else{
        $('#addConfirmation').appendTo("body").modal('show');
      }
    }else if(itemName == ""){
      document.getElementById("errorMessage").innerHTML= "Missing input.";
      $('#errorModal').appendTo("body").modal('show');
      document.getElementById("newItem").value = "";
      document.getElementById("newItem").style.borderColor = "red";
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
      if(Number(addNumber) <= 0){
        document.getElementById("errorMessage").innerHTML= "Invalid quantity.";
        $('#errorModal').appendTo("body").modal('show');
      }else{
        $('#addExistingConfirmation').appendTo("body").modal('show');
      }
    }else{
      document.getElementById("errorMessage").innerHTML= "Missing input.";
      $('#errorModal').appendTo("body").modal('show');
    }
  },

  addItem: function(){
    var now = new Date();
    var hh = ((now.getHours())>=10)? (now.getHours()) : '0' + (now.getHours());
    var mm = ((now.getMinutes())>=10)? (now.getMinutes()) : '0' + (now.getMinutes());
    var ss = ((now.getSeconds())>=10)? (now.getSeconds()) : '0' + (now.getSeconds());
    var time = hh+":"+mm+":"+ss;

    var itemID = document.getElementById("newId").value;
    var itemName = document.getElementById("newItem").value.trim();
    var qty = document.getElementById("newNumber").value;
    var price = document.getElementById("newPrice").value+"";
    var uid = firebase.auth().currentUser.uid;
    var date = document.getElementById("newDate").value;
    date = date+" "+time;

    var description = document.getElementById("newDescription").value.trim();
    var action = "Added item.";
    itemName = itemName.substring(0, 50);
    description = description.substring(0, 200);

    firebase.database().ref('items').once('value', function(snapshot) {
      var iList = [];
      var found = false;
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val().item_name;
        var isDeleted = childSnapshot.val().isDeleted;
        var itemList = {name: item};
        if(isDeleted == false){
          iList.push(itemList);
        }
      });
      for(var x = 0; x < iList.length; x++){
        if(iList[x].name.toUpperCase() == itemName.toUpperCase()){
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
          price: price,
          isDeleted: false
        }, function(error) {
          console.log(error)
          $('#addConfirmation').modal('hide');
          $('#newItemModal').modal('hide');
        }).then(function(error) {
          firebase.database().ref('users/'+uid).once('value', function(snapshot) {;
            var userName = snapshot.val().firstname+" "+snapshot.val().lastname;
            firebase.database().ref("items/"+itemID+"/item_history/").push().set({
              user: userName,
              date: date,
              action_performed: action,
              quantity: qty+""
            });
          });
          firebase.database().ref("users/"+uid+"/activity").push().set({
            action_performed: action,
            object_changed: itemName,
            quantity: qty+"",
            date: date
          });
          firebase.database().ref('users/'+uid).once('value').then(function(snapshot) {
            var fullname = snapshot.val().firstname+" "+snapshot.val().lastname;
            firebase.database().ref("activities").push().set({
              action_performed: action,
              object_changed: itemName,
              quantity: qty+"",
              date: date,
              user: fullname
            });
          });
          document.getElementById("newItem").value="";
          document.getElementById("newNumber").value="";
          document.getElementById("newPrice").value="";
          document.getElementById("newDescription").value="";
          $('#addConfirmation').modal('hide');
          $('#newItemModal').modal('hide');
          $('#informSuccessAdd').appendTo("body").modal('show');
          setTimeout(function() { $("#informSuccessAdd").modal('hide'); }, 1000);
        });
      }else{
        document.getElementById("errorMessage").innerHTML= "Duplicate item.";
        $('#errorModal').appendTo("body").modal('show');
        $('#addConfirmation').modal('hide');
      }
    });
  },

  displayItemOnModal: function(){
    var itemVal = document.getElementById("item").value;

    if(itemVal == ""){
      document.getElementById("ID").value = "";
      document.getElementById("existingDescription").value = "";
      document.getElementById("existingPrice").value = "";
      document.getElementById("existingStock").value = "";
    }else{
      var itemID = $("#item").val();
      var ref = firebase.database().ref('items/'+itemID);
      ref.once('value', function(snapshot) {
        document.getElementById("ID").value = itemID;
        document.getElementById("existingDescription").value = snapshot.val().description;
        document.getElementById("existingPrice").value = snapshot.val().price;
        document.getElementById("existingStock").value = snapshot.val().quantity;
      });
    }
  },

  updateItem: function(){
    var now = new Date();
    var hh = ((now.getHours())>=10)? (now.getHours()) : '0' + (now.getHours());
    var mm = ((now.getMinutes())>=10)? (now.getMinutes()) : '0' + (now.getMinutes());
    var ss = ((now.getSeconds())>=10)? (now.getSeconds()) : '0' + (now.getSeconds());
    var time = hh+":"+mm+":"+ss;

    var itemName = $("#item option:selected").text();
    var id = document.getElementById("ID").value;
    var price = document.getElementById("existingPrice").value+"";
    var curStock = document.getElementById("existingStock").value;
    var addNumber = document.getElementById("additionalNumber").value;
    var date = document.getElementById("existingDate").value;
    date = date+" "+time;

    var uid = firebase.auth().currentUser.uid;
    var action = "Restocked item."

    if(id && price && curStock && addNumber && date){
      var newStock = Number(curStock) + Number(addNumber);
      firebase.database().ref('items/'+id).update({
        price: price,
        quantity: newStock
      });
      firebase.database().ref('users/'+uid).once('value', function(snapshot) {;
        var userName = snapshot.val().firstname+" "+snapshot.val().lastname;
        firebase.database().ref("items/"+id+"/item_history/").push().set({
          user: userName,
          date: date,
          action_performed: action,
          quantity: addNumber
        });
      });
      firebase.database().ref("users/"+uid+"/activity").push().set({
        action_performed: action,
        object_changed: itemName,
        quantity: addNumber,
        date: date
      });
      firebase.database().ref('users/'+uid).once('value').then(function(snapshot) {
        var fullname = snapshot.val().firstname+" "+snapshot.val().lastname;
        firebase.database().ref("activities").push().set({
          action_performed: action,
          object_changed: itemName,
          quantity: addNumber,
          date: date,
          user: fullname
        });
      });
      $("#item").val("");
      document.getElementById("ID").value = "";
      document.getElementById("existingPrice").value = "";
      document.getElementById("existingStock").value = "";
      document.getElementById("additionalNumber").value = "";
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
    }
  },

  render: function() {
    var style={
      color: 'red'
    }
    return (
      <div id="mainContent">
          <form id="itemIDForm" type="get" action="SpecificItem.html">
              <input type="hidden" id="item_id" name="item_id"/>
              <button type="submit" value="Send" name="submit" id="submit" style={{display: 'none'}}></button>
          </form>
          <div className="box">
              <div className="box-header" id="headerContent">
                  <div className="btn-group col-sm-2">
                      <button className="btn btn-primary no-click">ADD ITEM</button>
                      <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                          <span className="caret"></span>
                          <span className="sr-only">Toggle Dropdown</span>
                      </button>
                      <ul className="dropdown-menu" role="menu">
                          <li><a data-toggle="modal" data-target="#newItemModal" onClick={this.generateIDandDate}>New Item</a></li>
                          <li><a data-toggle="modal" data-target="#existingItemModal" onClick={this.generateDate}>Existing Item</a></li>
                      </ul>
                  </div>
              </div>
              <div className="box-body table-responsive" id="inventoryMainTable">
                  <table id="itemTable" className="table table-bordered table-hover hover">
                      <thead>
                          <tr>
                              <th><center>ITEM ID</center></th>
                              <th><center>ITEM NAME</center></th>
                              <th><center>IN STOCK</center></th>
                          </tr>
                      </thead>
                      <tbody id="itemList">
                      </tbody>
                  </table>
              </div>
          </div>

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
                                  <label><span style={style}>* </span>Item Name</label>
                                  <input type="text" id="newItem" className="form-control" maxLength="50"/>
                              </div>
                              <div className="col-sm-6" id="modalComponents">
                                  <label>Item Description</label>
                                  <textarea id="newDescription" className="form-control" maxLength="200"></textarea>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label><span style={style}>* </span>Quantity</label>
                                  <input type="number" id="newNumber" className="form-control" min="1"/>
                              </div>
                              <div className="col-sm-6" id="modalComponents">
                                  <label><span style={style}>* </span>Item Price</label>
                                  <input type="number" id="newPrice" className="form-control" min="0.01"/>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6" id="modalComponents">
                                  <label>User</label>
                                  <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                              </div>
                              <div className="col-sm-6" id="modalComponents">
                                  <label><span style={style}>* </span>Date</label>
                                  <input type="date" id="newDate" className="form-control"/>
                              </div>
                          </div>
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                          <button type="button" className="btn btn-primary" onClick={this.checkNewItem}>ADD</button>
                      </div>
                  </div>
              </div>
          </div>

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
                  </div>
              </div>
          </div>

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
                                  <label><span style={style}>* </span>Quantity to Add</label>
                                  <input type="number" id="additionalNumber" className="form-control" min="1" maxLength="50"/>
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
                                  <label><span style={style}>* </span>Date</label>
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
      if(!user){
        self.setState({ signedIn: false});
        window.location.replace("http://127.0.0.1:8080/");
      }else if(user.emailVerified) {
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
          self.setState({ signedIn: true, type: snapshot.val().user_type });
          $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
        });
        firebase.database().ref("/users/"+uid).on('value', function(snapshot) {
            var isDeleted = snapshot.val().isDeleted;
            if(isDeleted == true){
              firebase.auth().signOut().then(function() {
                window.location.replace("http://127.0.0.1:8080/");
              }, function(error) {
                console.log(error);
              });
            }
        });
      }else{
        alert("Email is not verified");
        firebase.auth().signOut().then(function() {
          window.location.replace("http://127.0.0.1:8080/");
        }, function(error) {
          console.log(error);
        });
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
          <div className="wrapper">
              <Header/>
              <Body/>
          </div>
        );
      }else if(this.state.type == "user"){
        window.location.replace("../user/Inventory.html");
      }
    }else{
      res = (
        <div>
            <div className="se-pre-con"></div>
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
