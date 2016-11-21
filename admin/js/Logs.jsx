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
                            <li><a href="Inventory.html"><i className="fa fa-archive" id="sidebarImage"></i><span>Inventory</span></a></li>
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

      componentDidMount: function(){
        const self = this;
        var uid = firebase.auth().currentUser.uid;
        var ref = firebase.database().ref('users/'+uid);
        ref.on('value', function(snapshot) {
          self.setState({
            curUser: snapshot.val().firstname+" "+snapshot.val().lastname
          });
        });

        var ref = firebase.database().ref('transactions').orderByKey();
        ref.on('child_added', function(data) {
          var id = data.key;
          var total = data.val().total;
          var date = data.val().date;
          var userID = data.val().userID;
          var user = data.val().user;
          var release = data.val().release_method;
          var customer = data.val().customer;
          firebase.database().ref('users/'+userID).once('value', function(dataSnapshot){
            var name = dataSnapshot.val().firstname+" "+dataSnapshot.val().lastname;
            $("#transactionList").append("<tr id="+id+"><td>"+id+"</td><td>"+total+"</td><td>"+date+"</td><td>"+name+"</td></tr>");
            $("#"+id+"").dblclick(function() {
              $("#transactionTableBody tr").remove();
              document.getElementById("transID").value = id;
              $('#transactionModal').modal('show');
              document.getElementById("transHeader").innerHTML = "Transaction No. "+id;
              document.getElementById("transTotal").innerHTML = "Total: "+total;
              document.getElementById("transDate").innerHTML = "Date: "+date;
              document.getElementById("transRelease").innerHTML = "Release Method: "+release;
              document.getElementById("transCustomer").innerHTML = customer;
              
              var ref = firebase.database().ref('transactions/'+id+'/items_purchased').orderByChild("item_name");
              ref.on('child_added', function(data) {
                var itemName = data.val().item_name;
                var itemQuantity = data.val().item_quantity;
                var subtotal = data.val().item_subtotal;

                $("#transactionTableBody").append("<tr id="+id+"><td>"+itemName+"</td><td>"+itemQuantity+"</td><td>"+subtotal+"</td></tr>");
              }); 
            });
          });  
        });

        ref.on('child_removed', function(data) {
          var id=data.key
          $("tr#"+id).remove();
        });

        var ref = firebase.database().ref('users');
        ref.once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot){
            var childKey = childSnapshot.key
            var name = childSnapshot.val().firstname+" "+childSnapshot.val().lastname;
            firebase.database().ref('users/'+childKey+'/activity').on('child_added', function(data){
              var id = data.key;
              var action = data.val().action_performed;
              var object = data.val().object_changed;
              var quantity = data.val().quantity;
              var date = data.val().date;
              $("#activityList").append("<tr id="+id+"><td>"+action+"</td><td>"+object+"</td><td>"+quantity+"</td><td>"+date+"</td><td>"+name+"</td></tr>");
            });

            firebase.database().ref('users/'+childKey+'/activity').on('child_removed', function(data) {
              var id=data.key
              $("tr#"+id).remove();
            });
          })
        });

        $(document).ready(function () {
          (function ($) {
            $('#logsSearch').keyup(function () {
              var rex = new RegExp($(this).val(), 'i');
              $('#transactionList tr').hide();
              $('#transactionList tr').filter(function () {
                  return rex.test($(this).text());
              }).show();
              $('#no-data-trans').hide();
              if($('#transactionList tr:visible').length == 0)
              {
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
              if($('#activityList tr:visible').length == 0)
              {
                $('#no-data-activity').show();
              }
            });

            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                datasets: [{
                  label: 'apples',
                  data: [12, 19, 3, 17, 6, 3, 7],
                  backgroundColor: "rgba(153,255,51,0.4)"
                }]
              }
            });
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

      deleteTransaction: function(){
        var now = new Date();
        var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
        var uid = firebase.auth().currentUser.uid;
        var action = "Deleted transaction."
        var idTrans = document.getElementById("transID").value;

        firebase.database().ref("users/"+uid+"/activity").push().set({
          action_performed: action,
          object_changed: idTrans,
          quantity: "n/a",
          date: today
        });
        $('#deleteTransactionModal').modal('hide');
        $('#transactionModal').modal('hide');
        $('#informSuccessDelete').appendTo("body").modal('show');
        setTimeout(function() { $("#informSuccessDelete").modal('hide'); }, 3000);
        firebase.database().ref('transactions/'+idTrans).remove();
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
                          <div className="row">
                                <div className="col-sm-8">
                                    <canvas id="myChart"></canvas>
                                </div>
                                <div className="form-group col-sm-4">
                                    <label>Date range:</label>

                                    <div className="input-group">
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar"></i>
                                        </div>
                                        <input type="text" className="form-control pull-right" name="daterange" id="daterange" onFocus={this.dateRange}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tab-pane" id="transaction">
                            <div className="row">
                                <div className="col-sm-8"></div>
                                <div className="col-sm-4 pull-right">
                                    <div className="box-tools pull-right">
                                        <div className="input-group input-group-md" id="logsTransSearch">
                                            <input type="text" name="tableSearch" className="form-control pull-right" placeholder="Search" id="logsSearch" onChange={this.showTable}/>
                                            <div className="input-group-btn">
                                                <button type="submit" className="btn btn-default">
                                                    <i className="fa fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <div className="col-sm-12">
                                    <br/>
                                    <div className="box-body">
                                        <table id="example1" className="table table-bordered table-hover dataTable">
                                            <thead>
                                                <tr>
                                                    <th><center>TRANSACTION ID</center></th>
                                                    <th><center>TOTAL</center></th>
                                                    <th><center>DATE</center></th>
                                                    <th><center>USER</center></th>
                                                </tr>
                                            </thead>
                                            <tbody id="transactionList">
                                                <tr id="no-data-trans" style={{display:'none'}}>
                                                    <td><center>No Results Found.</center></td>
                                                    <td><center>No Results Found.</center></td>
                                                    <td><center>No Results Found.</center></td>
                                                    <td><center>No Results Found.</center></td>
                                                </tr>
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
                                    <div className="box-tools pull-right">
                                        <div className="input-group input-group-md" id="logsTransSearch">
                                            <input type="text" name="tableSearch" className="form-control pull-right" placeholder="Search" id="activitySearch" onChange={this.showActivityTable}/>
                                            <div className="input-group-btn">
                                                <button type="submit" className="btn btn-default">
                                                    <i className="fa fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <div className="col-sm-12">
                                    <br/>
                                    <div className="box-body">
                                        <label id="currentUser" style={{display:'none'}}>{this.state.curUser}</label>
                                        <table id="example1" className="table table-bordered table-hover dataTable">
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
                                                <tr id="no-data-activity" style={{display:'none'}}>
                                                    <td><center>No Results Found.</center></td>
                                                    <td><center>No Results Found.</center></td>
                                                    <td><center>No Results Found.</center></td>
                                                    <td><center>No Results Found.</center></td>
                                                    <td><center>No Results Found.</center></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TRANSACTION MODAL */}
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
                                        <table className="table table-bordered table-striped dataTable" id="transactionTable">
                                            <thead>
                                                <tr>
                                                    <th><center>ITEM NAME</center></th>
                                                    <th><center>QUANTITY</center></th>
                                                    <th><center>PRICE</center></th>
                                                </tr>
                                            </thead>
                                            <tbody id="transactionTableBody">

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6"></div>
                                    <div className="col-sm-6">
                                        <h4 className="pull-right" id="transTotal"></h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <h5 id="transCustomer"></h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <h5 id="transDate"></h5>
                                    </div>
                                    <div className="col-sm-6">
                                        <h5 id="transRelease"></h5>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#deleteTransactionModal">DELETE</button>
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
