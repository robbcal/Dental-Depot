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

    var ref = firebase.database().ref('items').orderByChild("item_name");
    ref.on('child_added', function(data) {
      var id=data.key
      var itemName = data.val().item_name;
      var itemStock = data.val().stock;
      
      $("#item").append("<option id="+id+" value="+id+"|"+itemStock+">"+itemName+"</option>");
    });

    ref.on('child_changed', function(data) {
      var id=data.key
      var itemName = data.val().item_name;
      var itemStock = data.val().stock;
      
      $("option#"+id).replaceWith("<option id="+id+" value="+id+"|"+itemStock+">"+itemName+"</option>");
    });

    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    document.getElementById("date").value = today;
    document.getElementById("total").value = 0;

    $(document).on("click", ".deleteRow", function () {
      $(this).closest('tr').remove();
      var id = $(this).val();
      var num = $(this).closest('tr').children('td.number').text();
      var subtotal = $(this).closest('tr').children('td.subtotal').text();
      var val = document.getElementById(id).value;
      var itemVal = val.split('|');
      var curStock = itemVal[1];
      var reStock = Number(curStock) + Number(num);
      //document.getElementById("stock").value = reStock;
      document.getElementById(id).value = id+"|"+reStock;

      var curTotal = document.getElementById("total").value;
      var newTotal = Number(curTotal) - Number(subtotal); 

      document.getElementById("total").value = newTotal;
      document.getElementById("stock").value = "";
      document.getElementById("number").value = "";
      document.getElementById("ID").value = "";
      document.getElementById("price").value = "";
      $("#item option:eq(0)").attr("selected", "selected");
    });
  },

  displayItemOnModal: function(){
    var val = document.getElementById("item").value;
    var itemVal = val.split('|');
    var itemId = itemVal[0];
    var itemStock = itemVal[1];

    if(itemId == ""){
      document.getElementById("ID").value = "";
      document.getElementById("number").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("price").value = "";
    }else{
      var ref = firebase.database().ref('items/'+itemId);
      ref.once('value', function(snapshot) {
        document.getElementById("price").value = snapshot.val().price;
      });
      document.getElementById("ID").value = itemId;
      document.getElementById("stock").value = itemStock;
      document.getElementById("number").max = itemStock;
      document.getElementById("number").value = "";
    }
  },

  checkStock: function(){
    var num = document.getElementById("number").value;
    var max = document.getElementById("stock").value;
    num = 0+num;

    if(Number(num) > max){
      document.getElementById("errorMessage").innerHTML= "Insufficient stock.";
      $('#errorModal').appendTo("body").modal('show');
      document.getElementById("number").value = "";
    }
  },

  addItemToTable: function(){
    var id = document.getElementById("ID").value;
    var num = document.getElementById("number").value;
    var total = document.getElementById("total").value;
    var price = document.getElementById("price").value;
    var stock = document.getElementById("stock").value;
    var itemName = $('#item').children("option:selected").text();
    
    if(id && num){
      var newStock = Number(stock) - Number(num);
      var subtotal = (Number(price) * Number(num))
      var runningTotal = Number(total) + subtotal ;

      document.getElementById("total").value = runningTotal;
      document.getElementById("stock").value = newStock;
      document.getElementById("number").max = newStock;
      document.getElementById(id).value = id+"|"+newStock;
      document.getElementById("number").value = "";
      
      $("#transactionTableBody").append("<tr id="+id+"><td class='delete'><button class='btn btn-default deleteRow' value="+id+">x</button></td><td class='name'>"+itemName+"</td><td class='number'>"+num+"</td><td class='subtotal'>"+subtotal+"</td></tr>");
      
    }else{
      document.getElementById("errorMessage").innerHTML= "Missing input.";
      $('#errorModal').appendTo("body").modal('show');
    }
  },

  render: function() {
    return (
      <div>

        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{position: 'relative', top: '30px', left: '40px', width: '1000px'}}>
          <div className="row">
            <a href="Inventory.html" className="pull-left"><img src="../bootstrap/icons/left-arrow.png" height="25px"/></a>
            <div className="pull-right">
              <label>{this.state.curUser}</label>
            </div>        
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <input type="text" id="ID" className="form-control"/>
              <div className="row">
                <label>Item:</label>
                <select id="item" className="form-control" onChange={this.displayItemOnModal}>
                  <option id="header" value="">- Choose an item -</option>
                </select>
              </div>
              <div className="row">
                <label>Date:</label>
                <input type="date" id="date" className="form-control"/>
              </div><br/>
              <div className="row">
                <button className="btn btn-primary pull-left" id="addItem" onClick={this.addItemToTable}>ADD ITEM</button>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div className="row">
                <label>Stock:</label>
                <input type="number" id="stock" readOnly className="form-control"/>
              </div>
              <div className="row">
                <label>Price:</label>
                <input type="number" id="price" readOnly className="form-control"/>
              </div>
              <div className="row">
                <label>Number:</label>
                <input type="number" id="number" className="form-control" min="1" onBlur={this.checkStock}/>
              </div>
              <div className="row">
                <label>Release Method:</label>
                <select id="releaseMethod" className="form-control">
                  <option value="Over_the_counter">Over the counter</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>
              <div className="row pull-right">
                <label>Total:</label><br/>
                <input type="number" id="total" readOnly min="0"/>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <table className="table table-hover table-striped table-bordered" id="transactionTable">
                <thead>
                  <tr>
                    <th></th>
                    <th><center>ITEM</center></th>
                    <th><center>NUMBER</center></th>
                    <th><center>PRICE</center></th>
                  </tr>
                </thead>
                <tbody id="transactionTableBody">

                </tbody>
              </table>
              <button className="btn btn-primary pull-right" id="createTransactionButton">CREATE</button>
            </div>
          </div>
        </div>

        <div className="example-modal">
          <div className="modal modal-danger" id="errorModal">
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