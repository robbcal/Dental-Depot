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
                    <span className="logo-mini"><b>DD</b></span>
                    <span className="logo-lg" id="mainHeader">Dental Depot</span>
                </div>
                <div className="navbar navbar-static-top" role="navigation">
                    <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a>
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
                        <li className="active"><a href="Inventory.html"><i className="fa fa-archive" id="sidebarImage"></i><span>Inventory</span></a></li>
                        <li><a href="Users.html"><i className="fa fa-users" id="sidebarImage"></i><span>Users</span></a></li>
                        <li><a href="Logs.html"><i className="fa fa-line-chart" id="sidebarImage"></i><span>Logs</span></a></li>
                        <li><a href="AdminProfile.html"><i className="fa fa-user" id="sidebarImage"></i><span>Profile</span></a></li>
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

    var ref = firebase.database().ref('items');
    ref.on('child_added', function(data) {
        var id=data.key
        var itemName = data.val().item_name;
        var stock = data.val().stock;

        $("#itemList").append("<tr id="+id+"><td>"+itemName+"</td><td>"+stock+"</td></tr>");
        $("#"+id+"").dblclick(function() {
           document.getElementById("item_id").value = id;
           document.getElementById("submit").click();
        });
    });

    ref.on('child_changed', function(data) {
        var id=data.key
        var itemName = data.val().item_name;
        var stock = data.val().stock;

        $("tr#"+id).replaceWith("<tr id="+id+"><td>"+itemName+"</td><td>"+stock+"</td></tr>");
        $("#"+id+"").dblclick(function() {
            document.getElementById("item_id").value = id;
            document.getElementById("submit").click();
        });
    });

    ref.on('child_removed', function(data) {
        var id=data.key
        $("tr#"+id).remove();
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
      action_performed: action,
      stock: stock
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
      });
    });
  },

  render: function() {
    return (
      <div id="mainContent">
          <form id="itemIDForm" type="get" action="SpecificItem.html">
              <input type="hidden" id="item_id" name="item_id"/>
              <button type="submit" value="Send" name="submit" id="submit" style={{display: 'none'}}></button>
          </form>
          <div className="box">
              <div className="box-header" id="headerContent">
                  <div className="col-sm-4">
                      <div className="input-group input-group-sm">
                          <input type="text" name="tableSearch" className="form-control pull-right" placeholder="Search"/>
                          <div className="input-group-btn">
                              <button type="submit" className="btn btn-default">
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
                          <li><a data-toggle="modal" data-target="#existingItemModal" onClick={this.displayItemOnModal}>Existing Item</a></li>
                      </ul>
                  </div>
                  <div className="col-sm-2">
                      <a className="btn btn-primary pull-right" id="addTransaction">ADD TRANSACTION</a>
                  </div>
              </div>
              <div className="box-body">
                  <table id="itemTable" className="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info">
                      <thead>
                          <tr>
                              {/* <th className="sorting" tabindex="0" aria-controls="example2" rowspan="1" colspan="1" aria-label="Rendering engine: activate to sort column ascending" aria-sort="ascending">ITEM ID</th> */}
                              <th className="sorting" tabindex="0" aria-controls="example2" rowspan="1" colspan="1" aria-label="Rendering engine: activate to sort column ascending" aria-sort="ascending">ITEM NAME</th>
                              <th className="sorting" tabindex="0" aria-controls="example2" rowspan="1" colspan="1" aria-label="Rendering engine: activate to sort column ascending" aria-sort="ascending">IN STOCK</th>
                          </tr>
                      </thead>
                      <tbody id="itemList">
                      </tbody>
                  </table>
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
