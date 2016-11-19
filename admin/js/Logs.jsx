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
<<<<<<< HEAD
                  </div>
              </div>
          );
        }
      });
=======
                  </nav>
              </header>
          </div>
      );
    }
  });
>>>>>>> master

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
<<<<<<< HEAD
          const self = this;
          firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                if (user.emailVerified) {
                  var uid = firebase.auth().currentUser.uid;
                  firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
                    self.setState({ signedIn: true, type: snapshot.val().user_type });
                    $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
                  });
                }else {
                  firebase.auth().signOut().then(function() {
                    window.location.replace("http://127.0.0.1:8080/");
                  }, function(error) {
                    console.log(error);
                  });
                }  
              } else {
                self.setState({ signedIn: false });
                window.location.replace("http://127.0.0.1:8080/");
              }
            }, function(error) {
              console.log(error);
=======
            const self = this;
            var uid = firebase.auth().currentUser.uid;
            var ref = firebase.database().ref('users/'+uid);
            ref.on('value', function(snapshot) {
              self.setState({
                curUser: snapshot.val().firstname+" "+snapshot.val().lastname
              });
            });

            var ref = firebase.database().ref('transactions').orderByChild("date");
            ref.on('child_added', function(data) {
                var id = data.key;
                var transId = id;
                var total = data.val().total;
                var date = data.val().date;
                var user = data.val().user;
                var release = data.val().release_method;
                $("#transactionList").append("<tr id="+id+"><td><center>"+transId+"</center></td><td><center>"+total+"</center></td><td><center>"+date+"</center></td><td><center>"+user+"</center></td></tr>");
                $("#"+id+"").dblclick(function() {
                    document.getElementById("transID").value = id;
                    $('#transactionModal').modal('show');
                    document.getElementById("transHeader").innerHTML = "Transaction No. "+id;
                    document.getElementById("transTotal").innerHTML = "Total: "+total;
                    document.getElementById("transDate").innerHTML = "Date: "+date;
                    document.getElementById("transRelease").innerHTML = "Release Method: "+release;
                    document.getElementById("transUser").innerHTML = user;

                    var ref = firebase.database().ref('transactions/'+id+'/items_purchased').orderByChild("item_name");
                    ref.on('child_added', function(data) {
                        var itemName = data.val().item_name;
                        var itemQuantity = data.val().item_quantity;
                        var subtotal = data.val().item_subtotal;

                        $("#transactionTableBody").append("<tr id="+id+"><td><center>"+itemName+"</center></td><td><center>"+itemQuantity+"</center></td><td><center>"+subtotal+"</center></td></tr>");
                    });
                });
            });

            $(document).ready(function () {
                  (function ($) {
                      $('#logsSearch').keyup(function () {
                        var rex = new RegExp($(this).val(), 'i');
                        $('#transactionList tr').hide();
                        $('#transactionList tr').filter(function () {
                            return rex.test($(this).text());
                        }).show();
                        $('#no-data').hide();
                        if($('#transactionList tr:visible').length == 0)
                        {
                          $('#no-data').show();
                        }
                      })
                  }(jQuery));
                });
            },

            showTable: function(){
              if($('#logsSearch').val == null){
                $('#transactionList tr').show();
            }
        },

        deleteTransaction: function(){
          var now = new Date();
          var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
          var uid = firebase.auth().currentUser.uid;
          var action = "Deleted transaction."
          var idTrans = document.getElementById("transID").value;

          firebase.database().ref("users"+uid+"/activity").push().set({
            action: action,
            object_changed: idTrans,
            quantity: "n/a",
            date: today
>>>>>>> master
          });
          $('#deleteTransactionModal').modal('hide');
          $('#informSuccessDelete').appendTo("body").modal('show');
          setTimeout(function() { $("#informSuccessItemDelete").modal('hide'); }, 3000);
          firebase.database().ref('transactions/'+idTrans).remove();
          window.location.replace("Inventory.html");
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

                          </div>

                          <div className="tab-pane" id="transaction">
                              <div className="row">
                                  <div className="col-sm-8"></div>
                                  <div className="col-sm-4 pull-right">
                                      <div className="box-tools pull-right">
                                          <div className="input-group input-group-md" id="logsTransSearch">
                                              <input type="text" name="tableSearch" className="form-control pull-right" placeholder="Search" id="logsSearch"/>
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
                                                  <tr id="no-data" style={{display:'none'}}>
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
                                              <input type="text" name="tableSearch" className="form-control pull-right" placeholder="Search" id="logsSearch"/>
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
                                                      <th><center>ITEM</center></th>
                                                      <th><center>ACTION</center></th>
                                                      <th><center>DATE</center></th>
                                                      <th><center>USER</center></th>
                                                  </tr>
                                              </thead>
                                              <tbody id="activityList">

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
                                                      <th>ITEM NAME</th>
                                                      <th>QUANTITY</th>
                                                      <th>PRICE</th>
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
                                          <h5 id="transUser"></h5>
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
          if (user) {
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
