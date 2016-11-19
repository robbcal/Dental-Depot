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
                        <li className="active"><a href="Users.html"><i className="fa fa-users" id="sidebarImage"></i><span>Users</span></a></li>
                        <li><a href="Logs.html"><i className="fa fa-line-chart" id="sidebarImage"></i><span>Logs</span></a></li>
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
       cur_password: "null"
      };
  },

  componentDidMount: function(){
    const self = this;
    var cur_uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users/'+cur_uid).once('value').then(function(snapshot) {
      self.setState({
        cur_password: snapshot.val().password
      });
    });

    var ref = firebase.database().ref('users');
    ref.on('child_added', function(data) {
      var id=data.key
      var firstName = data.val().firstname;
      var lastName = data.val().lastname;
      var email = data.val().user_email;
      var address = data.val().address;
      var contactNumber = data.val().contact_no;
      var age = data.val().age;
      var birthdate = data.val().birthday;
      var userType = data.val().user_type;

      $("#userList").append("<tr id="+id+"><td>"+firstName+" "+lastName+"</td><td>"+email+"</td><td>"+userType+"</td></tr>");
      $("#"+id+"").dblclick(function() {
        document.getElementById("user_id").value = id;
        document.getElementById("submit").click();
      });
    });

    ref.on('child_changed', function(data) {
      var id=data.key
      var firstName = data.val().firstname;
      var lastName = data.val().lastname;
      var email = data.val().user_email;
      var address = data.val().address;
      var contactNumber = data.val().contact_no;
      var age = data.val().age;
      var birthdate = data.val().birthday;
      var userType = data.val().user_type;

      $("tr#"+id).replaceWith("<tr id="+id+"><td>"+firstName+" "+lastName+"</td><td>"+email+"</td><td>"+userType+"</td></tr>");
      $("#"+id+"").dblclick(function() {
        alert(email);
      });
    });

    ref.on('child_removed', function(data) {
      var id=data.key
      $("tr#"+id).remove();
    });

    $(document).ready(function () {
          (function ($) {
              $('#tableSearch').keyup(function () {
                var rex = new RegExp($(this).val(), 'i');
                $('#userList tr').hide();
                $('#userList tr').filter(function () {
                    return rex.test($(this).text());
                }).show();
                $('#no-data').hide();
                if($('#userList tr:visible').length == 0)
                {
                  $('#no-data').show();
                }
              })
          }(jQuery));
        });
    },

    showTable: function(){
      if($('#tableSearch').val == null){
        $('#userList tr').show();
    }
  },

  addUser: function(){
    var cur_email = firebase.auth().currentUser.email;
    var cur_password = this.state.cur_password;

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var address = document.getElementById("address").value;
    var contactNumber = document.getElementById("contactNumber").value;
    var age = document.getElementById("age").value;
    var birthdate = document.getElementById("birthdate").value;
    var userType = document.getElementById("userType").value;
    var password = "123456";

    if(firstName && lastName && address && contactNumber && email && age && birthdate && userType){
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
          var uid = firebase.auth().currentUser.uid;
          firebase.auth().signInWithEmailAndPassword(cur_email, cur_password).then(function(){
            firebase.database().ref('users/'+uid).set({
              firstname: firstName,
              lastname: lastName,
              user_email: email,
              address: address,
              contact_no: contactNumber,
              age: age,
              birthday: birthdate,
              user_type: userType,
              password: password
            });
            $('#addUserModal').modal('hide');
            $('#informSuccess').appendTo("body").modal('show');
            setTimeout(function() { $("#informSuccess").modal('hide'); }, 1000);
            document.getElementById("firstName").value="";
            document.getElementById("lastName").value="";
            document.getElementById("email").value="";
            document.getElementById("address").value="";
            document.getElementById("contactNumber").value="";
            document.getElementById("age").value="";
            document.getElementById("birthdate").value="";
            document.getElementById("userType").value="";
          })
        }).catch(function(error) {
            document.getElementById("errorMessage").innerHTML= error;
            $('#errorModal').appendTo("body").modal('show');
            $('#addConfirmation').modal('hide');
        });
    }else {
        document.getElementById("errorMessage").innerHTML= "Missing input.";
        $('#errorModal').appendTo("body").modal('show');
        $('#addConfirmation').modal('hide');
    }
  },


  render: function() {
    return (
      <div id="mainContent">
          <form id="UserIDForm" type="get" action="SpecificUser.html">
              <input type="hidden" id="user_id" name="user_id"/>
              <button type="submit" value="Send" name="submit" id="submit" style={{display: 'none'}}></button>
          </form>
          <div className="box">
              <div className="box-header" id="headerContent">
                  <div className="col-sm-4">
                      <div className="input-group input-group-md">
                          <input type="text" name="tableSearch" id="tableSearch" className="form-control pull-right" placeholder="Search"/>
                          <div className="input-group-btn">
                              <button type="submit" className="btn btn-default">
                                  <i className="fa fa-search"></i>
                              </button>
                          </div>
                      </div>
                  </div>
                  <div className="col-sm-2"></div>
                  <div className="col-sm-6">
                      <span className="pull-right">
                          <a className="btn btn-primary" id="addUserButton" href="" data-toggle="modal" data-target="#addUserModal">ADD USER</a>
                      </span>
                  </div>
              </div>
              <div className="box-body">
                  <table id="user_table" className="table table-bordered table-hover dataTable">
                      <thead>
                          <tr>
                              <th><center>USERNAME</center></th>
                              <th><center>EMAIL ADDRESS</center></th>
                              <th><center>USER TYPE</center></th>
                          </tr>
                      </thead>
                      <tbody id="userList">
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

          <div className="example-modal">
              <div className="modal fade bs-example-modal-lg" id="addUserModal">
                  <div className="modal-dialog modal-md">
                      <div className="modal-content">
                          <div className="modal-header">
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                              <h4 className="modal-title">Add User</h4>
                          </div>
                          <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <div className="row">
                                  <div className="col-sm-6" id="editInfoModalComponents">
                                      <label>First Name</label>
                                      <input type="text" id="firstName" className="form-control"/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="col-sm-6" id="editInfoModalComponents">
                                      <label>Last Name</label>
                                      <input type="text" id="lastName" className="form-control"/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="col-sm-6" id="editInfoModalComponents">
                                      <label>Email</label>
                                      <input type="email" id="email" className="form-control"/>
                                  </div>
                                  <div className="col-sm-6" id="editInfoModalComponents">
                                      <label>Contact Number</label>
                                      <input type="text" id="contactNumber" className="form-control"/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div id="editInfoModalComponents">
                                      <label>Address</label>
                                      <input type="text" id="address" className="form-control"/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="col-sm-8" id="editInfoModalComponents">
                                      <label>Birthdate</label>
                                      <input type="date" id="birthdate" className="form-control"/>
                                  </div>
                                  <div className="col-sm-4" id="editInfoModalComponents">
                                      <label>Age</label>
                                      <input type="number" id="age" className="form-control"/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="col-sm-6" id="editInfoModalComponents">
                                      <label>User Type</label>
                                      <select id="userType" className="form-control">
                                          <option value="admin">Admin</option>
                                          <option value="user">User</option>
                                      </select>
                                  </div>
                              </div>
                          </div>
                          <div className="modal-footer">
                              <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                              <button type="button" className="btn btn-primary" onClick={this.addUser}>ADD</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/*MODAL CONTENT*/}

          <div className="example-modal">
              <div className="modal fade bs-example-modal-lg" id="addConfirmation">
                  <div className="modal-dialog modal-sm">
                      <div className="modal-content">
                          <div className="modal-body">
                              <center>
                                  <h5>Are you sure you want to add this user?</h5>
                                  <button type="button" className="btn btn-primary" onClick={this.addUser}>YES</button>
                                  <button type="button" className="btn btn-default" data-dismiss="modal">NO</button>
                              </center>
                          </div>

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

          <div className="modal fade modal-success" id="informSuccess">
              <div className="modal-dialog modal-md">
                  <div className="modal-content">
                      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <center>
                              <h4><strong>Successfully Added User.</strong></h4>
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
