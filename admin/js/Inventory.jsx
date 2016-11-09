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

  showConfirmLogout: function(){
    $('#confirmModal').appendTo("body").modal("show");
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
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li className="dropdown user user-menu">
                                <a href="#" className="btn btn-default" data-toggle="modal" data-target="#confirmModal" style={{borderWidth: 0, lineHeight: 0, color: "rgba(255, 255, 255, 0.15)", top: 3, right: 5}} onClick={this.showConfirmLogout}>
                                  <span><img style={{top: 5, right: 15}} className="profileDropdown" src="../bootstrap/icons/tooth.png"/></span>
                                </a>
                                <div className="example-modal">
                                  <div className="modal" id="confirmModal">
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">x</span>
                                          </button>
                                          <h4 className="modal-title">Log-out</h4>
                                        </div>
                                        <div className="modal-body">
                                          <center><p> Are you sure you want to log-out?</p></center>
                                        </div>
                                        <div className="modal-footer">
                                          <button type="button" className="btn btn-default pull-left" data-dismiss="modal" aria-label="No">NO</button>
                                          <button type="button" className="btn btn-primary" data-dismiss="modal" aria-label="No" onClick={this.logout}>YES</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
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
        curUser: "null"
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
  },

  generateIDandDate: function(){
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    var ID = now.getFullYear()+""+(now.getMonth()+1)+""+now.getDate()+""+now.getHours()+""+now.getMinutes()+""+now.getSeconds()+""+now.getMilliseconds();
    document.getElementById("newId").value = ID;
    document.getElementById("newDate").value = today;
    document.getElementById("existingDate").value = today;
  },

  addItem: function(){
    var now = new Date();
    var itemID = document.getElementById("newId").value;
    var itemName = document.getElementById("newItem").value;
    var stock = document.getElementById("newNumber").value;
    var price = document.getElementById("newPrice").value;
    var user = firebase.auth().currentUser.email;
    var date = document.getElementById("newDate").value;
    var description = document.getElementById("newDescription").value;
    var action = "Add new item.";
    var itemHistoryID = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"-"+now.getHours()+"-"+now.getMinutes()+"-"+now.getSeconds()+"-"+now.getMilliseconds();

    firebase.database().ref('items/'+itemID).set({
      key: itemID,
      item_name: itemName,
      description: description,
      stock: stock,
      price: price
    });
    firebase.database().ref('items/'+itemID+"/item_history/"+itemHistoryID).set({
      user_email: user,
      date: date,
      action_performed: action
    });
    alert("Item added");
    document.getElementById("newItem").value="";
    document.getElementById("newNumber").value="";
    document.getElementById("newPrice").value="";
    document.getElementById("newDescription").value="";
    $('#newItemModal').modal('hide');
  },

  displayItemOnModal: function(){
    var ref = firebase.database().ref('items');
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        console.log(childSnapshot.val().key);
        //var childData = childSnapshot.val();

      });
    });
  },

  render: function() {
    return (
      <div>
          <br/><br/>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <span className="pull-left">
                      <input type="text" id="inventorySearch" /*className="searchBox"*//>
                      <button id="inventoryButton"><img src="../bootstrap/icons/search.png" height="15px"/></button>
                  </span>
                  <span className="pull-right">
                      <a className="btn btn-primary" id="addItem" href="" data-toggle="modal" data-target="#addItemModal">ADD ITEM</a>&nbsp;
                      <button className="btn btn-primary" id="addTransaction">ADD TRANSACTION</button>
                  </span>
              </div>
              <br/><br/>
              <div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <table className="table table-hover table-striped table-bordered /*adminTable*/">
                      <thead>
                          <tr>
                              <th><center>NAME</center></th>
                              <th><center>STOCK</center></th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>sample</td>
                              <td>sample</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <div className="example-modal">
              <div className="modal fade bs-example-modal-lg" id="addItemModal">
                  <div className="modal-dialog modal-sm">
                      <div className="modal-content">
                          <div className="modal-body">
                              <a className="btn btn-primary" href="" data-toggle="modal" data-target="#newItemModal" onClick={this.generateIDandDate}>NEW ITEM</a>&nbsp;
                              <a className="btn btn-primary pull-right" href="" data-toggle="modal" data-target="#existingItemModal" onClick={this.displayItemOnModal}>EXISTING ITEM</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

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
                                      <input type="number" id="newPrice" className="form-control"/>
                                  </span>
                                  <span>
                                      <label>User</label>
                                      <input type="text" id="user" readOnly className="form-control" value={this.state.curUser}/>
                                  </span>
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

          <div className="example-modal">
              <div className="modal fade bs-example-modal-lg" id="existingItemModal">
                  <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                          <div className="modal-header">
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                              <h4 className="modal-title">Existing Item</h4>
                          </div>
                          <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <span className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                      <label>Item</label>
                                      <input type="text" id="existingItem" className="form-control"/>
                                  </span>
                                  <span className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                      <label>Stock</label>
                                      <input type="text" id="stock" readOnly className="form-control"/>
                                  </span>
                                  <span className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                      <label>Number</label>
                                      <input type="number" id="existingNumber" className="form-control"/>
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
                                          <input type="number" id="existingPrice" className="form-control"/>
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
                              <button type="button" className="btn btn-primary">UPDATE</button>
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
