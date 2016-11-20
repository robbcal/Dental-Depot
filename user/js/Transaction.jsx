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
    $('[data-toggle="tooltip"]').tooltip();
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
            <div className="main-sidebar">
                <div className="sidebar">
                    <ul className="sidebar-menu">
                        <br/>
                        <li className="header">NAVIGATION</li>
                        <li className="active"><a href="Inventory.html"><i className="fa fa-archive" id="sidebarImage"></i><span>Inventory</span></a></li>
                        <li><a href="Profile.html"><i className="fa fa-user" id="sidebarImage"></i><span>Profile</span></a></li>
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
        var itemStock = data.val().quantity;

        $("#item").append("<option id="+id+" value="+id+"|"+itemStock+">"+itemName+"</option>");
      });

      ref.on('child_changed', function(data) {
        var id=data.key
        var itemName = data.val().item_name;
        var itemStock = data.val().quantity;

        $("option#"+id).replaceWith("<option id="+id+" value="+id+"|"+itemStock+">"+itemName+"</option>");
      });

      ref.on('child_removed', function(data) {
        var id=data.key

        $("option#"+id).remove();
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
        document.getElementById(id).value = id+"|"+reStock;

        var curTotal = document.getElementById("total").value;
        var newTotal = Number(curTotal) - Number(subtotal);

        document.getElementById("total").value = newTotal.toFixed(2);;
        document.getElementById("stock").value = "";
        document.getElementById("number").value = "";
        document.getElementById("ID").value = "";
        document.getElementById("price").value = "";
        $("#item option:eq(0)").attr("selected", "selected");
      });
      document.getElementById("number").style.borderColor = "red";
      document.getElementById("customer").style.borderColor = "red";
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
        document.getElementById("errorMessage").innerHTML= "Insufficient stock";
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

        document.getElementById("total").value = runningTotal.toFixed(2);
        document.getElementById("stock").value = newStock;
        document.getElementById("number").max = newStock;
        document.getElementById(id).value = id+"|"+newStock;
        document.getElementById("number").value = "";

        if($('#transactionTable tr > td:contains('+id+')').length == 0){
            $("#transactionTableBody").append("<tr id="+id+"><td id='del' class='delete'><button class='btn btn-danger btn-xs deleteRow' value="+id+">x</button></td><td style='display:none'>"+id+"</td><td class='name' value="+id+">"+itemName+"</td><td id="+id+"A"+id+" class='number' value="+num+">"+num+"</td><td id="+id+"B"+id+" class='subtotal' value="+subtotal.toFixed(2)+">"+subtotal.toFixed(2)+"</td></tr>");
        }else{
          var transQty = $("td#"+id+"A"+id+"").text();
          var transSubtotal = $("td#"+id+"B"+id+"").text();
          var newQty = Number(transQty) + Number(num);
          var newSubtotal = Number(transSubtotal) + Number(subtotal);

          $("td#"+id+"A"+id+"").replaceWith("<td id="+id+"A"+id+" class='number' value="+newQty+">"+newQty+"</td>");
          $("td#"+id+"B"+id+"").replaceWith("<td id="+id+"B"+id+" class='subtotal' value="+newSubtotal.toFixed(2)+">"+newSubtotal.toFixed(2)+"</td>");
        }
      }else{
        document.getElementById("errorMessage").innerHTML= "Missing input";
        $('#errorModal').appendTo("body").modal('show');
      }
    },

    checkTransaction: function(){
        var total = document.getElementById("total").value;
        var customer = document.getElementById("customer").value;

        if(total != 0 && customer != ""){
            $('#addConfirmation').appendTo("body").modal('show');
        }else{
            document.getElementById("errorMessage").innerHTML= "No items added";
            $('#errorModal').appendTo("body").modal('show');
        }
    },

    createTransaction: function(){
      var date = document.getElementById("date").value;
      var release = document.getElementById("release").value;
      var total = document.getElementById("total").value;
      var tableLength = document.getElementById("transactionTable").rows.length - 1;
      var transactionItems = []
      var now = new Date();
      var transactionID = now.getFullYear()+""+(now.getMonth()+1)+""+now.getDate()+""+now.getHours()+""+now.getMinutes()+""+now.getSeconds()+""+now.getMilliseconds();
      var userEmail = firebase.auth().currentUser.email;
      var uid = firebase.auth().currentUser.uid;
      var customer = document.getElementById("customer").value;

      if(total != 0){
        for(var y = 1; y <= tableLength; y++){
          var itemID = document.getElementById("transactionTable").rows[y].cells[1].innerHTML;
          var itemName = document.getElementById("transactionTable").rows[y].cells[2].innerHTML;
          var qty = document.getElementById("transactionTable").rows[y].cells[3].innerHTML;
          var subtotal = document.getElementById("transactionTable").rows[y].cells[4].innerHTML;

          var itemElement = {id: itemID, name: itemName, qty: qty, subtotal: subtotal};
          transactionItems.push(itemElement);
        }
        var transactionLength = transactionItems.length;
        firebase.database().ref('users/'+uid).once('value', function(snapshot) {;
          var userName = snapshot.val().firstname+" "+snapshot.val().lastname;
          firebase.database().ref("transactions/"+transactionID).set({
            total: total,
            userID: uid,
            user: userName,
            release_method: release,
            customer: customer,
            date: date
          });
        });

        for(var a = 0; a < transactionLength; a++){
          firebase.database().ref("transactions/"+transactionID+"/items_purchased/"+transactionItems[a].id).set({
            item_name: transactionItems[a].name,
            item_quantity: transactionItems[a].qty,
            item_subtotal: transactionItems[a].subtotal
          });
          firebase.database().ref('items/'+transactionItems[a].id).once('value', function(snapshot) {
            var stock = snapshot.val().quantity;
            var newQty = Number(stock) - Number(transactionItems[a].qty);
            firebase.database().ref("items/"+transactionItems[a].id).update({
              quantity: newQty
            });
            
            firebase.database().ref('users/'+uid).once('value', function(snapshot) {;
              var userName = snapshot.val().firstname+" "+snapshot.val().lastname;
              firebase.database().ref("items/"+transactionItems[a].id+"/item_history/").push().set({
                user: userName,
                date: date,
                action_performed: "Add transaction.",
                quantity: transactionItems[a].qty
              });
            });
          });
        }
        firebase.database().ref("users/"+uid+"/activity").push().set({
          action_performed: "Add transaction.",
          object_changed: transactionID,
          quantity: "n/a",
          date: date
        });
        document.getElementById("total").value = 0;
        document.getElementById("stock").value = "";
        document.getElementById("number").value = "";
        document.getElementById("ID").value = "";
        document.getElementById("price").value = "";
        document.getElementById("customer").value = "";
        $("#item option:eq(0)").attr("selected", "selected");
        $("#transactionTable tbody tr").remove();
        $('#addConfirmation').modal('hide');
        $('#informSuccessAdd').appendTo("body").modal('show');
        setTimeout(function() { $("#informSuccessAdd").modal('hide'); }, 1000);
      }else{
        $('#addConfirmation').modal('hide');
        document.getElementById("errorMessage").innerHTML= "No items added.";
        $('#errorModal').appendTo("body").modal('show');
      }
    },

    formValidation: function(){
      if(document.getElementById("number").value == ""){
        document.getElementById("number").style.borderColor = "red";
      }else{
        document.getElementById("number").style.borderColor = "";
      }
      if(document.getElementById("customer").value == ""){
        document.getElementById("customer").style.borderColor = "red";
      }else{
        document.getElementById("customer").style.borderColor = "";
      }
      if(document.getElementById("date").value == ""){
        document.getElementById("date").style.borderColor = "red";
      }else{
        document.getElementById("date").style.borderColor = "";
      }
    },

  render: function() {
    return (
      <div className="row" id="mainContent">
          <div className="col-md-6" id="boxBodyContent">
              <a id="headerButtons" data-toggle="modal" className="pull-left" data-target="#exitTransaction">
                  <img src="../bootstrap/icons/left-arrow.png" height="25px"/>
              </a>
              <div className="box box-primary" id="transBody">
                  <div className="box-body table-responsive" id="transWindow">
                      <input type="hidden" id="ID" className="form-control"/>
                      <div className="row">
                          <div className="pull-right">
                              <label id="userInTrans">{this.state.curUser}</label>
                          </div>
                      </div>
                      <br/>
                      <div className="row">
                          <div className="col-sm-6">
                              <label>Item Name</label>
                              <select id="item" className="form-control" onChange={this.displayItemOnModal}>
                                  <option id="header" value="">- Choose an item -</option>
                              </select>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-sm-6" id="boxbodyContent">
                              <label>Item Stock</label>
                              <input type="number" id="stock" readOnly className="form-control"/>
                          </div>
                          <div className="col-sm-6" id="boxbodyContent">
                              <label>Item Price</label>
                              <input type="number" id="price" readOnly className="form-control"/>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-sm-6" id="boxbodyContent">
                              <label>Quantity</label>
                              <input type="number" id="number" className="form-control" min="1" onChange={this.formValidation} onBlur={this.checkStock}/>
                          </div>
                          <div className="col-sm-6" id="boxbodyContent">
                              <label>Release Method</label>
                              <select id="release" className="form-control">
                                  <option value="Over the Counter">Over the counter</option>
                                  <option value="Shipping">Shipping</option>
                                  <option value="Delivery">Delivery</option>
                              </select>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-sm-6" id="boxbodyContent">
                              <label>Date</label>
                              <input type="date" id="date" className="form-control" onChange={this.formValidation}/>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-sm-6" id="boxbodyContent"></div>
                          <div className="col-sm-6" id="boxbodyContent">
                              <button className="btn btn-primary pull-right" id="addItem" onClick={this.addItemToTable}>ADD ITEM</button>
                          </div>
                      </div>
                      <br/>
                      <div className="row">
                          <div className="callout callout-info col-sm-12" id="boxbodyContent">
                              <div className="form-group">
                                  <h4 className="col-sm-4 control-label">TOTAL</h4>
                                  <div className="col-sm-8">
                                      <strong><input className="form-control" type="number" id="total" readOnly min="0"/></strong>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="col-md-6">
              <div className="box box-default" id="transBody">
                  <div className="box-body" id="transWindow">
                      <div className="box box-solid">
                          <div className="box-body" id="transTable">
                              <table className="table table-hover table-bordered table-responsive" id="transactionTable">
                                  <thead>
                                      <tr>
                                          <th></th>
                                          <th style={{display:'none'}}></th>
                                          <th><center>ITEM</center></th>
                                          <th><center>QUANTITY</center></th>
                                          <th><center>PRICE</center></th>
                                      </tr>
                                  </thead>
                                  <tbody id="transactionTableBody">
                                  </tbody>
                              </table>
                          </div>
                      </div>
                      <div className="col-sm-8" id="boxbodyContent">
                          <input type="text" id="customer" placeholder="Customer" className="form-control pull-left" onChange={this.formValidation}/>
                      </div>
                      <button className="btn btn-primary btn-block" id="createTransactionButton" onClick={this.checkTransaction}>CREATE TRANSACTION</button>
                  </div>
              </div>
          </div>

          {/* MODALS */}
          <div className="modal fade bs-example-modal-lg" id="exitTransaction">
              <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                      <div className="modal-body">
                          <center>
                              <h5>Stop creating transaction?</h5>
                              <a role="button" className="btn btn-primary" href="Inventory.html" id="itemButtons">YES</a>
                              <button type="button" className="btn btn-default" data-dismiss="modal" id="itemButtons">NO</button>
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
                              <h5>Confirm transaction?</h5>
                              <button type="button" className="btn btn-primary" onClick={this.createTransaction} id="itemButtons">YES</button>
                              <button type="button" className="btn btn-default" data-dismiss="modal" id="itemButtons">NO</button>
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
                              <h4><strong>Transaction Successful.</strong></h4>
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
        window.location.replace("../admin/Inventory.html");
      }else if(this.state.type == "user"){
        res = (
          <div>
              <Header/>
              <Body/>
          </div>
        );
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