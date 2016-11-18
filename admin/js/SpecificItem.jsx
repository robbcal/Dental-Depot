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

<<<<<<< HEAD
  render: function() {
    return (
        <div>
          <div className="main-header">
            <div className="logo">
              <span className="logo-lg" id="mainHeader">Dental Depot</span>
            </div>
            <div className="navbar navbar-static-top" role="navigation">
              <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span className="sr-only">Toggle navigation</span>
              </a>
              {/* comment */}
              <div className="navbar-custom-menu">
                <ul className="nav navbar-nav">
                  <li className="dropdown user user-menu">
                    <a href="#"><span onClick={this.logout}>
                      <img className="profileDropdown" src="../bootstrap/icons/tooth.png" data-toggle="tooltip" title="Logout" data-placement="bottom"/>
                    </span></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
=======
  showConfirmationModal: function(){
    $('#editConfirmation').appendTo("body").modal('show');
  },

  showDeleteModal: function(){
    $('#deleteConfirmation').appendTo("body").modal('show');
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
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
        </div>
    );
  }
});

var Body = React.createClass({
  render: function() {
      return (
        <div>
<<<<<<< HEAD
          <div className="main-sidebar">
            <div className="sidebar">
              <ul className="sidebar-menu">
                <br/>
                <li className="header">NAVIGATION</li>
                <li className="active"><a href="Inventory.html"><i><img src="../bootstrap/icons/boxes.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Inventory</span></a></li>
                <li><a href="Users.html"><i><img src="../bootstrap/icons/multiple-users-silhouette.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Users</span></a></li>
                <li><a href="Logs.html"><i><img src="../bootstrap/icons/graph-line-screen.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Logs</span></a></li>
                <li><a href="AdminProfile.html"><i className="fa fa-user" id="sidebarImage"></i><span id="sidebarProfileTab">Profile</span></a></li>
              </ul>
            </div>
          </div>

          <div style={{height: '588px', backgroundColor: '#e1e1e1'}}>
            <div className="content-wrapper" style={{height: '588px', backgroundColor: 'rgb(225, 225, 225)', minHeight: 612}}>
              <div id="content" className="content" style={{backgroundColor: 'rgb(225, 225, 225)'}}>
                
                <Content/>
              </div>
            </div>
          </div>
          {/* LOGOUT MODAL CONTENT */}
=======
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
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
        </div>
    );
  }
});

var Content = React.createClass({
  getInitialState: function() {
      return {
        curUser: "null",
         itemId: itemID,
       itemName: "null",
itemDescription: "null",
      itemPrice: "null",
      itemStock: "null",
  latestHistory: "null"
      };
  },

  componentWillMount: function(){
    const self = this;
    var uid = firebase.auth().currentUser.uid;
    var refUser = firebase.database().ref('users/'+uid);
    refUser.on('value', function(snapshot) {
      self.setState({
        curUser: snapshot.val().firstname+" "+snapshot.val().lastname
      });
    });
    var ref = firebase.database().ref('items/'+itemID);
    ref.on('value', function(snapshot) {
      self.setState({
         itemName: snapshot.val().item_name,
  itemDescription: snapshot.val().description,
        itemPrice: snapshot.val().price,
        itemStock: snapshot.val().stock
      });
    });
    var refHistory = firebase.database().ref('items/'+itemID+'/item_history');
    refHistory.on('child_added', function(data) {
      self.setState({
        latestHistory: data.val().date
      })
    })
  },

<<<<<<< HEAD
=======
  checkAddModal: function(){
      var additionalStock = document.getElementById("addNumber").value;
      var date = document.getElementById("addDate").value;

      if(additionalStock != "" && date != ""){
          $('#addConfirmation').appendTo("body").modal('show');
      }else{
          document.getElementById("errorMessage").innerHTML= "Missing input.";
          $('#errorModal').appendTo("body").modal('show');
      }
  },

  checkDeleteModal: function(){
      var diminishedStock = document.getElementById("deleteNumber").value;
      var date = document.getElementById("deleteDate").value;

      if(diminishedStock != "" && date != ""){
          $('#deleteConfirmation').appendTo("body").modal('show');
      }else{
          document.getElementById("errorMessage").innerHTML= "Missing input.";
          $('#errorModal').appendTo("body").modal('show');
      }
  },

  checkEditModal: function(){
      var date = document.getElementById("editDate").value;
      var itemName = document.getElementById("editItem").value;
      var itemPrice = document.getElementById("editPrice").value;

      if(date != "" && itemName != "" && itemPrice != ""){
          $('#editConfirmation').appendTo("body").modal('show');
      }else{
          document.getElementById("errorMessage").innerHTML= "Missing input.";
          $('#errorModal').appendTo("body").modal('show');
      }
  },

>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
  generateDate: function(){
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    document.getElementById("addDate").value = today;
    document.getElementById("deleteDate").value = today;
    document.getElementById("editDate").value = today;
  },

<<<<<<< HEAD
  addStock: function(){
    var now = new Date();
    //var itemHistoryID = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"-"+now.getHours()+"-"+now.getMinutes()+"-"+now.getSeconds()+"-"+now.getMilliseconds();
    var additionalStock = document.getElementById("addNumber").value;
    var date = document.getElementById("addDate").value;
    var user = firebase.auth().currentUser.email;
    var action = "Add stock/s to item."
=======
  restockItem: function(){
    var now = new Date();
    var additionalStock = document.getElementById("addNumber").value;
    var date = document.getElementById("addDate").value;
    var user = firebase.auth().currentUser.email;
    var action = "Restocked item."
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
    var uid = firebase.auth().currentUser.uid;

    if(additionalStock && date){
      var newStock = Number(this.state.itemStock) + Number(additionalStock);
      firebase.database().ref('items/'+itemID).update({
        stock: newStock
      })
<<<<<<< HEAD
      /*firebase.database().ref('items/'+itemID+"/item_history/"+itemHistoryID).set({
        user_email: user,
        date: date,
        action_performed: action,
        stock: additionalStock
      });*/
=======
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
      firebase.database().ref('items/'+itemID+"/item_history/").push().set({
        user_email: user,
        date: date,
        action_performed: action,
        stock: additionalStock
      });
<<<<<<< HEAD
      alert("Item stock added!");
      $('#addStockModal').modal('hide');
      document.getElementById("addNumber").value = "";
    }else{
      alert("Input number!");
    }
  },

  deleteStock: function(){
    var now = new Date();
    //var itemHistoryID = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"-"+now.getHours()+"-"+now.getMinutes()+"-"+now.getSeconds()+"-"+now.getMilliseconds();
    var diminishedStock = document.getElementById("deleteNumber").value;
    var date = document.getElementById("deleteDate").value;
    var user = firebase.auth().currentUser.email;
    var action = "Delete stock/s from item."
=======
      firebase.database().ref("users/"+uid+"/activity").push().set({
        action: action,
        itemID: itemID,
        itemName: this.state.itemName,
        quantity: additionalStock,
        date: date
      });
      $('#addConfirmation').modal('hide');
      $('#addStockModal').modal('hide');
      $('#informSuccessAdd').appendTo("body").modal('show');
      setTimeout(function() { $("#informSuccessAdd").modal('hide'); }, 1000);
      document.getElementById("addNumber").value = "";
    }else{
        document.getElementById("errorMessage").innerHTML= "Missing input.";
        $('#errorModal').appendTo("body").modal('show');
        $('#addConfirmation').modal('hide');
    }
  },

  releaseStock: function(){
    var now = new Date();
    var diminishedStock = document.getElementById("deleteNumber").value;
    var date = document.getElementById("deleteDate").value;
    var user = firebase.auth().currentUser.email;
    var action = "Released item."
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
    var uid = firebase.auth().currentUser.uid;
    var curStock = this.state.itemStock;

    if(diminishedStock && date){
      if(diminishedStock <= curStock){
        var newStock = Number(curStock) - Number(diminishedStock);
        firebase.database().ref('items/'+itemID).update({
          stock: newStock
        })
<<<<<<< HEAD
        /*firebase.database().ref('items/'+itemID+"/item_history/"+itemHistoryID).set({
          user_email: user,
          date: date,
          action_performed: action,
          stock: diminishedStock
        });*/
=======

>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
        firebase.database().ref('items/'+itemID+"/item_history/").push().set({
          user_email: user,
          date: date,
          action_performed: action,
          stock: diminishedStock
        });
<<<<<<< HEAD
        alert("Item stock deleted!");
        $('#deleteStockModal').modal('hide');
        document.getElementById("addNumber").value = "";
      }else{
        alert("Di ka ka-delete. Bogo ka ug math!");
      }
    }else{
      alert("Input number!");
=======

        firebase.database().ref("users/"+uid+"/activity").push().set({
          action: action,
          itemID: itemID,
          itemName: this.state.itemName,
          quantity: diminishedStock,
          date: date
        });
        $('#deleteConfirmation').modal('hide');
        $('#deleteStockModal').modal('hide');
        $('#informSuccessDelete').appendTo("body").modal('show');
        setTimeout(function() { $("#informSuccessDelete").modal('hide'); }, 1000);
        document.getElementById("deleteNumber").value = "";
      }else{
          document.getElementById("errorMessage").innerHTML= "Unable to delete.";
          $('#errorModal').appendTo("body").modal('show');
          $('#deleteConfirmation').modal('hide');
      }
    }else{
        document.getElementById("errorMessage").innerHTML= "Missing input.";
        $('#errorModal').appendTo("body").modal('show');
        $('#deleteConfirmation').modal('hide');
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
    }
  },

  editItem: function(){
    var now = new Date();
<<<<<<< HEAD
    //var itemHistoryID = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"-"+now.getHours()+"-"+now.getMinutes()+"-"+now.getSeconds()+"-"+now.getMilliseconds();
    var user = firebase.auth().currentUser.email;
    var action = "Edit item."
=======
    var user = firebase.auth().currentUser.email;
    var action = "Edited item."
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
    var date = document.getElementById("editDate").value;
    var itemName = document.getElementById("editItem").value;
    var itemPrice = document.getElementById("editPrice").value;
    var itemDescription = document.getElementById("editDescription").value;
<<<<<<< HEAD

    if(date && itemName && itemPrice && itemDescription){
=======
    var uid = firebase.auth().currentUser.uid;

    if(date && itemName && itemPrice){
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
      firebase.database().ref('items/'+itemID).update({
        item_name: itemName,
      description: itemDescription,
            price: itemPrice
      })
<<<<<<< HEAD
      /*firebase.database().ref('items/'+itemID+"/item_history/"+itemHistoryID).set({
        user_email: user,
        date: date,
        action_performed: action
      });*/
=======

>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
      firebase.database().ref('items/'+itemID+"/item_history/").push().set({
        user_email: user,
        date: date,
        action_performed: action
      });
<<<<<<< HEAD
      alert("Item edited!");
      $('#editItemModal').modal('hide');
    }else{
      alert("Missing input.");
=======

      firebase.database().ref("users/"+uid+"/activity").push().set({
        action: action,
        itemID: itemID,
        itemName: this.state.itemName,
        quantity: "n/a",
        date: date
      });
      $('#editConfirmation').modal('hide');
      $('#editItemModal').modal('hide');
      $('#informSuccess').appendTo("body").modal('show');
      setTimeout(function() { $("#informSuccess").modal('hide'); }, 1000);
    }else{
        document.getElementById("errorMessage").innerHTML= "Missing input.";
        $('#errorModal').appendTo("body").modal('show');
        $('#editConfirmation').modal('hide');
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
    }
  },

  deleteItem: function(){
<<<<<<< HEAD
    firebase.database().ref('items/'+itemID).remove();
    alert("Item deleted.");
    window.location.replace("Inventory.html");
  },

=======
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    var uid = firebase.auth().currentUser.uid;
    var action = "Deleted item."

    firebase.database().ref("users/"+uid+"/activity").push().set({
      action: action,
      itemID: itemID,
      itemName: this.state.itemName,
      quantity: "n/a",
      date: today
    });
    $('#deleteItemModal').modal('hide');
    $('#informSuccessItemDelete').appendTo("body").modal('show');
    setTimeout(function() { $("#informSuccessItemDelete").modal('hide'); }, 3000);
    firebase.database().ref('items/'+itemID).remove();
    window.location.replace("Inventory.html");
  },

  generateIDandDate: function(){
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    var ID = now.getFullYear()+""+(now.getMonth()+1)+""+now.getDate()+""+now.getHours()+""+now.getMinutes()+""+now.getSeconds()+""+now.getMilliseconds();
    document.getElementById("newId").value = ID;
    document.getElementById("newDate").value = today;
    document.getElementById("existingDate").value = today;
  },


>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
  onItemName: function(e) {
    this.setState({itemName: e.target.value});
  },

  onItemPrice: function(e) {
    this.setState({itemPrice: e.target.value});
  },

  onItemDescription: function(e) {
    this.setState({itemDescription: e.target.value});
  },

  render: function() {
    return (
<<<<<<< HEAD
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{position: 'relative', top: '30px', left: '40px', width: '1000px'}}>
          <div className="row">
            <a href="Inventory.html" className="pull-left"><img src="../bootstrap/icons/left-arrow.png" height="25px"/></a>
            <div className="pull-right">
              <a className="btn btn-primary" id="addStockButton" href="" data-toggle="modal" data-target="#addStockModal" onClick={this.generateDate}>ADD STOCK</a>&nbsp;
              <a className="btn btn-primary" id="deleteStockButton" href="" data-toggle="modal" data-target="#deleteStockModal" onClick={this.generateDate}>DELETE STOCK</a>&nbsp;
              <a className="btn btn-primary" id="editItemButton" href="" data-toggle="modal" data-target="#editItemModal" onClick={this.generateDate}>EDIT</a>&nbsp;
              <button className="btn btn-primary" id="deleteItemButton" href="" data-toggle="modal" data-target="#deleteItemModal">DELETE</button>
            </div>
          </div>

          <div className="row" style={{position: 'relative', top: '15px', height: '425px', backgroundColor:'white'}}>
            <label>ITEM NAME: {this.state.itemName}</label><br/>
            <label>ITEM DESCRIPTION: {this.state.itemDescription}</label><br/>
            <label>ITEM PRICE: {this.state.itemPrice}</label><br/>
            <label>ITEM STOCK: {this.state.itemStock}</label><br/>
            <label>LATEST HISTORY: {this.state.latestHistory}</label><br/>
          </div>
        </div>

        <div className="example-modal">
          <div className="modal fade bs-example-modal-lg" id="addStockModal">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Add Stock</h4>
                </div>
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>ID</label>
                      <input type="text" readOnly className="form-control" value={this.state.itemId}/>
                    </span>
                    <span>
                      <label>Item</label>
                      <input type="text" readOnly className="form-control" value={this.state.itemName}/>
                    </span>
                    <span>
                      <label>Number</label>
                      <input type="number" id="addNumber" className="form-control" min="1"/>
                    </span>
                    <span>
                      <label>User</label>
                      <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                    </span>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>Date</label>
                      <input type="date" id="addDate" className="form-control"/>
                    </span>
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                  <button type="button" className="btn btn-primary" onClick={this.addStock}>ADD</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="example-modal">
          <div className="modal fade bs-example-modal-lg" id="deleteStockModal">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Delete Stock</h4>
                </div>
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>ID</label>
                      <input type="text" readOnly className="form-control" value={this.state.itemId}/>
                    </span>
                    <span>
                      <label>Item</label>
                      <input type="text" readOnly className="form-control" value={this.state.itemName}/>
                    </span>
                    <span>
                      <label>Number</label>
                      <input type="number" id="deleteNumber" className="form-control" min="1"/>
                    </span>
                    <span>
                      <label>User</label>
                      <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                    </span>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>Date</label>
                      <input type="date" id="deleteDate" className="form-control"/>
                    </span>
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                  <button type="button" className="btn btn-primary" onClick={this.deleteStock}>DELETE</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="example-modal">
          <div className="modal fade bs-example-modal-lg" id="editItemModal">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Edit Item</h4>
                </div>
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>ID</label>
                      <input type="text" readOnly className="form-control" value={this.state.itemId}/>
                    </span>
                    <span>
                      <label>Item</label>
                      <input type="text" id="editItem" className="form-control" onChange={this.onItemName} value={this.state.itemName}/>
                    </span>
                    <span>
                      <label>Stock</label>
                      <input type="number" readOnly className="form-control" value={this.state.itemStock}/>
                    </span>
                    <span>
                      <label>Price</label>
                      <input type="number" id="editPrice" className="form-control" onChange={this.onItemPrice} value={this.state.itemPrice}/>
                    </span>
                    <span>
                      <label>User</label>
                      <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                    </span>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>Description</label>
                      <textarea id="editDescription" className="form-control" onChange={this.onItemDescription} value={this.state.itemDescription}></textarea>
                    </span>
                    <span>
                      <label>Date</label>
                      <input type="date" id="editDate" className="form-control"/>
                    </span>
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                  <button type="button" className="btn btn-primary" onClick={this.editItem}>EDIT</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="example-modal">
          <div className="modal fade bs-example-modal-lg" id="deleteItemModal">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">Delete Item</h4>
                </div>
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <h4><strong>Are you sure you want to delete this item?</strong></h4>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal">NO</button>
                  <button type="button" className="btn btn-primary" onClick={this.deleteItem}>YES</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
=======
        <div id="mainContent">
            <div className="col-sm-4 pull-left">
                <a href="Inventory.html"><img src="../bootstrap/icons/left-arrow.png" id="backButton"/></a>
            </div>
            <br/><br/>
            <div className="col-md-4">
                <div className="box box-primary" id="basicInfo">
                    <div className="box-body box-profile table-responsive" id="specificItemLeftContent">
                        <h1 className="text-center">{this.state.itemName}</h1>
                        <br/>
                        <p>Description:</p>
                        <p className="text-muted">{this.state.itemDescription}</p>
                        <br/>
                        <center>
                            <div className="btn-group" id="specificItemButtons">
                                <button className="btn bg-navy">STOCK</button>
                                <button type="button" className="btn bg-navy dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <span className="caret"></span>
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu" role="menu">
                                    <li><a data-toggle="modal" data-target="#addStockModal" onClick={this.generateDate}>Add</a></li>
                                    <li><a data-toggle="modal" data-target="#deleteStockModal" onClick={this.generateDate}>Delete</a></li>
                                </ul>
                            </div>
                            <a className="btn btn-primary" id="specificItemButtons" data-toggle="modal" data-target="#editItemModal" onClick={this.generateDate}>EDIT</a>
                            <a className="btn btn-danger" id="specificItemButtons" data-toggle="modal" data-target="#deleteItemModal">DELETE</a>
                        </center>
                    </div>
                </div>
            </div>

            <div className="col-md-8">
                <div className="box box-default" id="basicInfo">
                    <div className="box-header with-border">
                        <h3 className="box-title">Item Information</h3>
                    </div>
                    <div className="box-body">
                        <br/>
                        <strong><i className="fa fa-suitcase margin-r-5"></i> Items in Stock</strong>
                        <h3 className="text-muted" id="itemInfoContent">{this.state.itemStock}</h3>
                        <hr/>
                        <strong><i className="fa fa-money margin-r-5"></i> Item Price</strong>
                        <h3 className="text-muted" id="itemInfoContent">{this.state.itemPrice}</h3>
                        <hr/>
                        <strong><i className="fa fa-calendar margin-r-5"></i> Date Stock Updated</strong>
                        <h3 className="text-muted" id="itemInfoContent">{this.state.latestHistory}</h3>
                        <hr/>
                    </div>
                </div>
            </div>

            <div id="modalContent">
                <div className="modal fade bs-example-modal-lg" id="addStockModal">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">Add Stock: {this.state.itemName}</h4>
                            </div>
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="row">
                                    <div className="col-sm-6" id="addStockModalComponents">
                                        <label>Item ID</label>
                                        <input type="text" readOnly className="form-control" value={this.state.itemId}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6" id="addStockModalComponents">
                                        <label>Current Item Stock</label>
                                        <input type="number" readOnly className="form-control" value={this.state.itemStock}/>
                                    </div>
                                    <div className="col-sm-6" id="addStockModalComponents">
                                        <label>Quantity to Add</label>
                                        <input type="number" id="addNumber" className="form-control"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6" id="addStockModalComponents">
                                        <label>User</label>
                                        <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                                    </div>
                                    <div className="col-sm-6" id="addStockModalComponents">
                                        <label>Date</label>
                                        <input type="date" id="addDate" className="form-control"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                                <button type="button" className="btn btn-primary" onClick={this.checkAddModal}>ADD</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade bs-example-modal-lg" id="deleteStockModal">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">Delete Stock: {this.state.itemName}</h4>
                            </div>
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="row">
                                    <div className="col-sm-6" id="delStockModalComponents">
                                        <label>Item ID</label>
                                        <input type="text" readOnly className="form-control" value={this.state.itemId}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6" id="delStockModalComponents">
                                        <label>Current Item Stock</label>
                                        <input type="number" readOnly className="form-control" value={this.state.itemStock}/>
                                    </div>
                                    <div className="col-sm-6" id="delStockModalComponents">
                                        <label>Quantity to Delete</label>
                                        <input type="number" id="deleteNumber" className="form-control"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6" id="delStockModalComponents">
                                        <label>User</label>
                                        <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                                    </div>
                                    <div className="col-sm-6" id="delStockModalComponents">
                                        <label>Date</label>
                                        <input type="date" id="deleteDate" className="form-control"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                                <button type="button" className="btn btn-primary" onClick={this.checkDeleteModal}>DELETE</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade bs-example-modal-lg" id="editItemModal">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">Edit Item Details</h4>
                            </div>
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="row">
                                    <div className="col-sm-6" id="editItemModalComponents">
                                        <label>Item ID</label>
                                        <input type="text" readOnly className="form-control" value={this.state.itemId}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6" id="editItemModalComponents">
                                        <label>Item Name</label>
                                        <input type="text" id="editItem" className="form-control" onChange={this.onItemName} value={this.state.itemName}/>
                                    </div>
                                    <div className="col-sm-6" id="editItemModalComponents">
                                        <label>Item Description</label>
                                        <textarea id="editDescription" className="form-control" onChange={this.onItemDescription} value={this.state.itemDescription}></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6" id="editItemModalComponents">
                                        <label>Item in Stock</label>
                                        <input type="number" readOnly className="form-control" value={this.state.itemStock}/>
                                    </div>
                                    <div className="col-sm-6" id="editItemModalComponents">
                                        <label>Item Price</label>
                                        <input type="number" id="editPrice" className="form-control" onChange={this.onItemPrice} value={this.state.itemPrice}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6" id="editItemModalComponents">
                                        <label>User</label>
                                        <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                                    </div>
                                    <div className="col-sm-6" id="editItemModalComponents">
                                        <label>Date</label>
                                        <input type="date" id="editDate" className="form-control"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                                <button type="button" className="btn btn-primary" onClick={this.checkEditModal}>EDIT</button>
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

                <div className="modal fade bs-example-modal-lg" id="editConfirmation">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-body">
                                <center>
                                    <h5>Are you sure you want to edit this item?</h5>
                                    <button type="button" className="btn btn-primary" onClick={this.editItem} id="confirmEditItemButtons">YES</button>
                                    <button type="button" className="btn btn-default" data-dismiss="modal" id="confirmEditItemButtons">NO</button>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade bs-example-modal-lg" id="addConfirmation">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-body">
                                <center>
                                    <h5>Add item stock to inventory?</h5>
                                    <button type="button" className="btn btn-primary" onClick={this.restockItem} id="confirmEditItemButtons">YES</button>
                                    <button type="button" className="btn btn-default" data-dismiss="modal" id="confirmEditItemButtons">NO</button>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade bs-example-modal-lg" id="deleteConfirmation">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-body">
                                <center>
                                    <h5>Delete item stock from inventory?</h5>
                                    <button type="button" className="btn btn-primary" onClick={this.releaseStock} id="confirmEditItemButtons">YES</button>
                                    <button type="button" className="btn btn-default" data-dismiss="modal" id="confirmEditItemButtons">NO</button>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade modal-success" id="informSuccess">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <center>
                                    <h4><strong>Successfully Edited Item.</strong></h4>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade modal-success" id="informSuccessDelete">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <center>
                                    <h4><strong>Successfully Deleted from Item Stock.</strong></h4>
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
                                    <h4><strong>Successfully Added to Item Stock.</strong></h4>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade modal-success" id="informSuccessItemDelete">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <center>
                                    <h4><strong>Successfully Deleted Item from Inventory.</strong></h4>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade modal-danger" id="deleteItemModal">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <center><h5 className="modal-title">DELETE ITEM</h5></center>
                            </div>
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <center>
                                    <h5 id="errorMessage">Are you sure you want to delete this item from the Inventory?</h5>
                                    <br/>
                                    <button type="button" className="btn btn-outline" onClick={this.deleteItem} id="deleteItemButtons">YES</button>
                                    <button type="button" className="btn btn-outline" data-dismiss="modal" id="deleteItemButtons">NO</button>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
>>>>>>> bf84ac1a5ead3828d9b0460805a3b6faf9bd0ab7
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
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
          self.setState({ signedIn: true, type: snapshot.val().user_type });
          $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
        });
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
