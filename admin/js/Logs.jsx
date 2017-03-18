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

  showConfirmLogout: function(){
    $('#confirmModal').appendTo("body").modal("show");
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
                      <li><a href="Inventory.html"><i className="fa fa-archive" id="sidebarImage"></i><span>Inventory</span></a></li>
                      <li><a href="Transaction.html"><i className="fa fa-shopping-cart" id="sidebarImage"></i><span>Transaction</span></a></li>
                      <li><a href="Users.html"><i className="fa fa-users" id="sidebarImage"></i><span>Users</span></a></li>
                      <li className="active"><a href="Logs.html"><i className="fa fa-line-chart" id="sidebarImage"></i><span>Logs</span></a></li>
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
      curUser: "null"
    };
  },

  //display transactions and activities to table and initialization of fields
  componentDidMount: function(){
    const self = this;
    var uid = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('users/'+uid);

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
        curUser: snapshot.val().firstname+" "+snapshot.val().lastname
      });
    });

    //transaction table
    var ref = firebase.database().ref('transactions').orderByChild("date");
    ref.on('value', function(snapshot) {
      $('#transactionTable').DataTable().clear().draw().destroy();
      snapshot.forEach(function(data) {
        var id = data.key;
        var total = data.val().total;
        var date = data.val().date;
        var userID = data.val().userID;
        var user = data.val().user;
        var release = data.val().release_method;
        var customer = data.val().customer;
        user = user.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
        customer = customer.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");

        $("#transactionList").prepend("<tr id="+id+"><td>"+id+"</td><td>"+total+"</td><td>"+date+"</td><td>"+user+"</td></tr>");
        $("#"+id+"").dblclick(function() {
          $("#transactionTableBody tr").remove();
          document.getElementById("transID").value = id;
          $('#transactionModal').modal('show');
          document.getElementById("transHeader").innerHTML = "Transaction No. "+id;
          document.getElementById("transTotal").innerHTML = "Total: "+total;
          document.getElementById("transDate").innerHTML = "Date: "+date;
          document.getElementById("transRelease").innerHTML = "Release Method: "+release;
          document.getElementById("transCustomer").innerHTML = "Customer: "+customer;

          var ref = firebase.database().ref('transactions/'+id+'/items_purchased').orderByChild("item_name");
          ref.on('value', function(snapshot) {
            $('#transactionItemTable').DataTable().clear().draw().destroy();
            snapshot.forEach(function(data) {
              var itemName = data.val().item_name;
              var itemQuantity = data.val().item_quantity;
              var itemPrice = data.val().item_price;
              var subtotal = data.val().item_subtotal;

              $("#transactionTableBody").append("<tr id="+id+"><td>"+itemName+"</td><td>"+itemQuantity+"</td><td>"+itemPrice+"</td></td><td>"+subtotal+"</td></tr>");
            });
            $('#transactionItemTable').DataTable({
              "paging": true,
              "lengthChange": true,
              "searching": true,
              "ordering": true,
              "info": true,
              "retrieve": true,
              "autoWidth": false,
              "order": [[0, "asc"]]
            });
          });
        });
      });
      $('#transactionTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "retrieve": true,
        "autoWidth": false,
        "order": [[2, "desc"]]
      });
    });

    //activity table
    var actRef = firebase.database().ref('activities').orderByChild("date");
    actRef.on('value', function(snapshot) {
      $('#activityTable').DataTable().clear().draw().destroy();
      snapshot.forEach(function(data) {
        var id = data.key;
        var action = data.val().action_performed;
        var object = data.val().object_changed;
        var quantity = data.val().quantity;
        var date = data.val().date;
        var user = data.val().user;
        object = object.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
        user = user.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");

        $("#activityList").prepend("<tr id="+id+"><td>"+action+"</td><td>"+object+"</td><td>"+quantity+"</td><td>"+date+"</td><td>"+user+"</td></tr>");
      });
      $('#activityTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "retrieve": true,
        "autoWidth": false,
        "order": [[3, "desc"]]
      });
    });

    // today sales
    var ref = firebase.database().ref('transactions');
    var now = new Date();
    var month=((now.getMonth()+1)>=10)? (now.getMonth()+1) : '0' + (now.getMonth()+1);
    var day=((now.getDate())>=10)? (now.getDate()) : '0' + (now.getDate());
    var today = now.getFullYear()+"-"+month+"-"+day;
    ref.on('value', function(snapshot) {
        var total = 0;
        snapshot.forEach(function(childSnapshot){
            var childKey = childSnapshot.key;
            var date = childSnapshot.val().date;
            if(date.includes(today)){
              total = total + parseFloat(childSnapshot.val().total);
            }
            document.getElementById("todaySales").innerHTML = total.toFixed(2);;
        });
    });
    document.getElementById("dateToday").innerHTML = today;

    // yesterday sales
    var ref = firebase.database().ref('transactions');
    var now = new Date();
    now.setDate(now.getDate() - 1);
    var month=((now.getMonth()+1)>=10)? (now.getMonth()+1) : '0' + (now.getMonth()+1);
    var day=((now.getDate())>=10)? (now.getDate()) : '0' + (now.getDate());
    var yesterday = now.getFullYear()+"-"+month+"-"+day;
    ref.on('value', function(snapshot) {
        var total = 0;
        snapshot.forEach(function(childSnapshot){
            var childKey = childSnapshot.key;
            var date = childSnapshot.val().date;
            if(date.includes(yesterday)){
              total = total + parseFloat(childSnapshot.val().total);
            }
            document.getElementById("yesterdaySales").innerHTML = total.toFixed(2);;
        });
    });
    document.getElementById("dateYesterday").innerHTML = yesterday;

    $(document).ready(function () {
      (function ($) {
        /*$('#logsSearch').keyup(function () {
          var rex = new RegExp($(this).val(), 'i');
          $('#transactionList tr').hide();
          $('#transactionList tr').filter(function () {
              return rex.test($(this).text());
          }).show();
          $('#no-data-trans').hide();
          if($('#transactionList tr:visible').length == 0){
            $('#no-data-trans').show();
          }
        });

        $('#activitySearch').keyup(function () {
          var rex = new RegExp($(this).val(), 'i');
          $('#activityList tr').hide();
          $('#activityList tr').filter(function () {
              return rex.test($(this).text());
          }).show();
          $('#no-data-activity').hide();
          if($('#activityList tr:visible').length == 0){
            $('#no-data-activity').show();
          }
        });*/
      }(jQuery));
    });
  },

  showTable: function(){
    if($('#logsSearch').val == null){
      $('#transactionList tr').show();
    }
  },

  showActivityTable: function(){
    if($('#activitySearch').val == null){
      $('#activityList tr').show();
    }
  },

  // specific sale
  generateSales: function(){
    var ref = firebase.database().ref('transactions');
    var day = document.getElementById("daterange").value;
    ref.on('value', function(snapshot) {
      var total = 0;
      snapshot.forEach(function(childSnapshot){
        var childKey = childSnapshot.key;
        var date = childSnapshot.val().date;
        if(date.includes(day)){
          total = total + parseFloat(childSnapshot.val().total);
        }
        document.getElementById("dailySale").innerHTML = total.toFixed(2);
      });
    });
  },

  render: function() {
    return (
      <div id="mainContent">
          <input type="hidden" id="transID" name="transID"/>
          <div className="nav-tabs-custom">
              <ul className="nav nav-tabs">
                  <li className="active"><a href="#sales" data-toggle="tab">SALES</a></li>
                  <li><a href="#transaction" data-toggle="tab">TRANSACTION</a></li>
                  <li><a href="#activity" data-toggle="tab">ACTIVITY</a></li>
              </ul>
              <div className="tab-content table-responsive" id="tabContent">
                  <div className="active tab-pane" id="sales">
                      <div className="row" id="salesContent">
                          <div className="col-lg-2 col-xs-6"></div>
                          <div className="col-lg-4 col-xs-6">
                              <div className="small-box bg-navy">
                                  <div className="inner">
                                      <h3 id="yesterdaySales">0.00</h3>

                                      <p>Yesterday's Sales</p>
                                  </div>
                                  <div className="icon">
                                      <i className="ion ion-refresh"></i>
                                  </div>
                                  <p className="small-box-footer" id="dateYesterday"></p>
                              </div>
                          </div>
                          <div className="col-lg-4 col-xs-6">
                              <div className="small-box bg-aqua">
                                  <div className="inner">
                                      <h3 id="todaySales">0.00</h3>

                                      <p>Today's Sales</p>
                                  </div>
                                  <div className="icon">
                                      <i className="ion ion-calendar"></i>
                                  </div>
                                  <p className="small-box-footer" id="dateToday"></p>
                              </div>
                          </div>
                      </div>
                      <div className="row" id="salesContent2">
                          <div className="box box-primary" id="basicInfo">
                              <div className="box-header with-border">
                                  <h3 className="box-title">Sales Tracker</h3>
                              </div>
                              <div className="box-body">
                                  <div className="row" id="boxContent">
                                      <div className="col-sm-1"></div>
                                      <div className="form-group col-sm-4">
                                          <label>Date:</label>

                                          <div className="input-group">
                                              <div className="input-group-addon">
                                                  <i className="fa fa-calendar"></i>
                                              </div>
                                              <input type="date" className="form-control pull-right" onInput={this.generateSales} id="daterange"/>
                                          </div>
                                      </div>
                                      <div className="col-sm-1"></div>
                                      <div className="col-sm-4">
                                          <strong><i className="fa fa-calendar-check-o margin-r-5"></i> Total Sales for this Day:</strong>
                                          <h1 className="text-muted" id="dailySale"></h1>
                                      </div>
                                      <div className="col-sm-2"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="tab-pane" id="transaction">
                      <div className="row">
                          <div className="col-sm-8"></div>
                          <div className="col-sm-4 pull-right">
                              {/*<div className="box-tools pull-right">
                                  <div className="input-group stylish-input-group" id="logsTransSearch">
                                      <input type="text" name="tableSearch" className="form-control pull-right" placeholder="Search" id="logsSearch" onChange={this.showTable}/>
                                      <span className="input-group-addon">
                                          <div>
                                              <span className="glyphicon glyphicon-search"></span>
                                          </div>
                                      </span>
                                  </div>
                              </div>*/}
                          </div>
                      </div>
                      <div className="table-responsive">
                          <div className="col-sm-12">
                              <br/>
                              <div className="box-body">
                                  <table id="transactionTable" className="table table-bordered table-hover">
                                      <thead>
                                          <tr>
                                              <th><center>TRANSACTION ID</center></th>
                                              <th><center>TOTAL</center></th>
                                              <th><center>DATE</center></th>
                                              <th><center>USER</center></th>
                                          </tr>
                                      </thead>
                                      <tbody id="transactionList">
                                          {/*<tr id="no-data-trans" style={{display:'none'}}>
                                              <td><center>No Results Found.</center></td>
                                              <td><center>No Results Found.</center></td>
                                              <td><center>No Results Found.</center></td>
                                              <td><center>No Results Found.</center></td>
                                          </tr>*/}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="tab-pane" id="activity">
                      <div className="row">
                          <div className="col-sm-8"></div>
                          <div className="col-sm-4 pull-right">
                              {/*<div className="box-tools pull-right">
                                  <div className="input-group stylish-input-group" id="logsTransSearch">
                                      <input type="text" name="tableSearch" className="form-control pull-right" placeholder="Search" id="activitySearch" onChange={this.showActivityTable}/>
                                      <span className="input-group-addon">
                                          <div>
                                              <span className="glyphicon glyphicon-search"></span>
                                          </div>
                                      </span>
                                  </div>
                              </div>*/}
                          </div>
                      </div>
                      <div className="table-responsive">
                          <div className="col-sm-12">
                              <br/>
                              <div className="box-body">
                                  <label id="currentUser" style={{display:'none'}}>{this.state.curUser}</label>
                                  <table id="activityTable" className="table table-bordered table-hover">
                                      <thead>
                                          <tr>
                                              <th><center>ACTION</center></th>
                                              <th><center>OBJECT</center></th>
                                              <th><center>QUANTITY</center></th>
                                              <th><center>DATE</center></th>
                                              <th><center>USER</center></th>
                                          </tr>
                                      </thead>
                                      <tbody id="activityList">
                                          {/*<tr id="no-data-activity" style={{display:'none'}}>
                                              <td><center>No Results Found.</center></td>
                                              <td><center>No Results Found.</center></td>
                                              <td><center>No Results Found.</center></td>
                                              <td><center>No Results Found.</center></td>
                                              <td><center>No Results Found.</center></td>
                                          </tr>*/}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="modal fade bs-example-modal-lg" id="transactionModal">
              <div className="modal-dialog modal-md">
                  <div className="modal-content">
                      <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 className="modal-title" id="transHeader"></h4>
                      </div>
                      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive">
                          <div className="row">
                              <div className="col-sm-12" id="transTable">
                                  <table className="table table-bordered table-striped dataTable" id="transactionItemTable">
                                      <thead>
                                          <tr>
                                              <th><center>ITEM NAME</center></th>
                                              <th><center>QUANTITY</center></th>
                                              <th><center>PRICE</center></th>
                                              <th><center>SUBTOTAL</center></th>
                                          </tr>
                                      </thead>
                                      <tbody id="transactionTableBody">

                                      </tbody>
                                  </table>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6">
                                  <h5 id="transDate"></h5>
                              </div>
                              <div className="col-sm-6">
                                  <h4 className="pull-right" id="transTotal"></h4>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col-sm-6">
                                  <h5 id="transRelease"></h5>
                              </div>
                              <div className="col-sm-6">
                                  <h5 id="transCustomer" className="pull-right"></h5>
                              </div>
                          </div>
                      </div>
                      <div className="modal-footer">
                      </div>
                  </div>
              </div>
          </div>
          <div className="modal fade modal-danger" id="deleteTransactionModal">
              <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                      <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <center><h5 className="modal-title">DELETE TRANSACTION</h5></center>
                      </div>
                      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <center>
                              <h5 id="errorMessage">Are you sure you want to delete this transaction?</h5>
                              <br/>
                              <button type="button" className="btn btn-outline" onClick={this.deleteTransaction} id="deleteTransButtons">YES</button>
                              <button type="button" className="btn btn-outline" data-dismiss="modal" id="deleteTransButtons">NO</button>
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
                              <h4><strong>Successfully Deleted Transaction.</strong></h4>
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
          <div>
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
