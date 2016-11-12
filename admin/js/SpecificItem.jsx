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
        </div>
    );
  }
});

var Body = React.createClass({
  render: function() {
      return (
        <div>
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
                <div className="content-wrapper" style={{height: '588px', backgroundColor: '#e1e1e1'}}>
                    <div id="content" className="content" style={{backgroundColor: '#e1e1e1'}}>
                        <Content/>
                    </div>
                </div>
            </div>

            {/* LOGOUT MODAL CONTENT */}
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

  generateDate: function(){
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    document.getElementById("addDate").value = today;
    document.getElementById("deleteDate").value = today;
    document.getElementById("editDate").value = today;
  },

  addStock: function(){
    var now = new Date();
    //var itemHistoryID = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"-"+now.getHours()+"-"+now.getMinutes()+"-"+now.getSeconds()+"-"+now.getMilliseconds();
    var additionalStock = document.getElementById("addNumber").value;
    var date = document.getElementById("addDate").value;
    var user = firebase.auth().currentUser.email;
    var action = "Add stock/s to item."
    var uid = firebase.auth().currentUser.uid;

    if(additionalStock && date){
      var newStock = Number(this.state.itemStock) + Number(additionalStock);  
      firebase.database().ref('items/'+itemID).update({
        stock: newStock
      })
      /*firebase.database().ref('items/'+itemID+"/item_history/"+itemHistoryID).set({
        user_email: user,
        date: date,
        action_performed: action,
        stock: additionalStock
      });*/
      firebase.database().ref('items/'+itemID+"/item_history/").push().set({
        user_email: user,
        date: date,
        action_performed: action,
        stock: additionalStock
      });
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
    var uid = firebase.auth().currentUser.uid;
    var curStock = this.state.itemStock;
    
    if(diminishedStock && date){
      if(diminishedStock <= curStock){
        var newStock = Number(curStock) - Number(diminishedStock);  
        firebase.database().ref('items/'+itemID).update({
          stock: newStock
        })
        /*firebase.database().ref('items/'+itemID+"/item_history/"+itemHistoryID).set({
          user_email: user,
          date: date,
          action_performed: action,
          stock: diminishedStock
        });*/
        firebase.database().ref('items/'+itemID+"/item_history/").push().set({
          user_email: user,
          date: date,
          action_performed: action,
          stock: diminishedStock
        });
        alert("Item stock deleted!");
        $('#deleteStockModal').modal('hide');
        document.getElementById("addNumber").value = "";
      }else{
        alert("Di ka ka-delete. Bogo ka ug math!");
      }
    }else{
      alert("Input number!");
    }
  },

  editItem: function(){
    var now = new Date();
    //var itemHistoryID = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"-"+now.getHours()+"-"+now.getMinutes()+"-"+now.getSeconds()+"-"+now.getMilliseconds();
    var user = firebase.auth().currentUser.email;
    var action = "Edit item."
    var date = document.getElementById("editDate").value;
    var itemName = document.getElementById("editItem").value;
    var itemPrice = document.getElementById("editPrice").value;
    var itemDescription = document.getElementById("editDescription").value;

    if(date && itemName && itemPrice && itemDescription){
      firebase.database().ref('items/'+itemID).update({
        item_name: itemName,
      description: itemDescription,
            price: itemPrice
      })
      /*firebase.database().ref('items/'+itemID+"/item_history/"+itemHistoryID).set({
        user_email: user,
        date: date,
        action_performed: action
      });*/
      firebase.database().ref('items/'+itemID+"/item_history/").push().set({
        user_email: user,
        date: date,
        action_performed: action
      });
      alert("Item edited!");
      $('#editItemModal').modal('hide');
    }else{
      alert("Missing input.");
    }
  },

  deleteItem: function(){
    firebase.database().ref('items/'+itemID).remove();
    alert("Item deleted.");
    window.location.replace("Inventory.html");
  },

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
