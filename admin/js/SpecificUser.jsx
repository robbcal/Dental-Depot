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
          <aside className="main-sidebar">
            <section className="sidebar">
              <ul className="sidebar-menu">
                <br/>
                <li className="header">NAVIGATION</li>
                <li><a href="Inventory.html"><i className="fa fa-archive" id="sidebarImage"></i><span>Inventory</span></a></li>
                <li><a href="Users.html"><i className="fa fa-users" id="sidebarImage"></i><span>Users</span></a></li>
                <li><a href="Logs.html"><i className="fa fa-line-chart" id="sidebarImage"></i><span>Logs</span></a></li>
                <li className="active"><a href="Profile.html"><i className="fa fa-user" id="sidebarImage"></i><span>Profile</span></a></li>
              </ul>
            </section>
          </aside>
          <div className="content-wrapper">
            <section id="content" className="content" style={{backgroundColor: "rgb(236, 240, 245)", width: 930, marginLeft: 60}}><Content/></section>
            </div>
        </div>
    );
  }
});


var Content = React.createClass({
  getInitialState: function() {
      return {
       firstname: "null",
        lastname: "null",
        fullName: "null",
         address: "null",
             age: "null",
       birthdate: "null",
           email: "null",
   contactNumber: "null",
        password: "null"
      };
  },

  componentWillMount: function(){
    const self = this;
    var uid = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('users/'+userID);
    ref.on('value', function(snapshot) {
      self.setState({
       firstname: snapshot.val().firstname,
        lastname: snapshot.val().lastname,
        fullName: snapshot.val().firstname+" "+snapshot.val().lastname,
         address: snapshot.val().address,
             age: snapshot.val().age,
       birthdate: snapshot.val().birthday,
           email: snapshot.val().user_email,
   contactNumber: snapshot.val().contact_no,
        password: snapshot.val().password
      });
    });

    $(document).ready(function () {
      (function ($) {
          $('#activitySearch').keyup(function () {
            var rex = new RegExp($(this).val(), 'i');
            $('#activityList tr').hide();
            $('#activityList tr').filter(function () {
                return rex.test($(this).text());
            }).show();
            $('#no-data').hide();
            if($('#activityList tr:visible').length == 0)
            {
              $('#no-data').show();
            }
          })
      }(jQuery));
    });
  },

  checkProfile: function(){
      var firstname = document.getElementById("firstName").value;
      var lastname = document.getElementById("lastName").value;
      var address = document.getElementById("address").value;
      var contactnumber = document.getElementById("contactNumber").value;
      var email = document.getElementById("email").value;
      var age = document.getElementById("age").value;
      var birthdate = document.getElementById("birthdate").value;
      var password = document.getElementById("password").value;

      if(firstname != "" && lastname != "" && address != "" && contactnumber != "" && email != "" && age != "" && birthdate != "" && password != ""){
          $('#editConfirmation').appendTo("body").modal('show');
      }else{
          document.getElementById("errorMessage").innerHTML= "Missing input.";
          $('#errorModal').appendTo("body").modal('show');
      }
  },

  showModal: function(){
    $('#editInfoModal').appendTo("body").modal('show');
  },

  showConfirmationModal: function(){
    $('#editConfirmation').appendTo("body").modal('show');
  },

  showTable: function(){
    if($('#activitySearch').val == null){
      $('#itemList tr').show();
    }
  },

  onFirstName: function(e) {
    this.setState({firstname: e.target.value});
  },
  onLastName: function(e) {
    this.setState({lastname: e.target.value});
  },
  onAddress: function(e) {
    this.setState({address: e.target.value});
  },
  onAge: function(e) {
    this.setState({age: e.target.value});
  },
  onEmail: function(e) {
    this.setState({email: e.target.value});
  },
  onContactNumber: function(e) {
    this.setState({contactNumber: e.target.value});
  },
  onBirthdate: function(e) {
    this.setState({birthdate: e.target.value});
  },
  onPassword: function(e) {
    this.setState({password: e.target.value});
  },

  editUser: function(){
    var uid = firebase.auth().currentUser.uid;
    var firstname = document.getElementById("firstName").value;
    var lastname = document.getElementById("lastName").value;
    var address = document.getElementById("address").value;
    var contactnumber = document.getElementById("contactNumber").value;
    var email = document.getElementById("email").value;
    var age = document.getElementById("age").value;
    var birthdate = document.getElementById("birthdate").value;
    var password = document.getElementById("password").value;

    if(firstname && lastname && address && contactnumber && email && age && birthdate && password){
      firebase.auth().currentUser.updateEmail(email).then(function() {
        firebase.auth().currentUser.updatePassword(password).then(function() {
          firebase.database().ref('users/'+userID).update({
            firstname: firstname,
            lastname: lastname,
            user_email: email,
            address: address,
            contact_no: contactnumber,
            age: age,
            birthday: birthdate,
            password: password
          });
          $('#editConfirmation').modal('hide');
          $('#editInfoModal').modal('hide');
          $('#informSuccess').appendTo("body").modal('show');
          setTimeout(function() { $("#informSuccess").modal('hide'); }, 1000);
        }, function(error) {
          document.getElementById("errorMessage").innerHTML= error;
          $('#errorModal').appendTo("body").modal('show');
          $('#editConfirmation').modal('hide');
        });
      }, function(error) {
        document.getElementById("errorMessage").innerHTML= error;
        $('#errorModal').appendTo("body").modal('show');
        $('#editConfirmation').modal('hide');
      });
    }else{
      document.getElementById("errorMessage").innerHTML= "Missing input.";
      $('#errorModal').appendTo("body").modal('show');
      $('#editConfirmation').modal('hide');
    }
  },

  deleteUser: function(){
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    var uid = firebase.auth().currentUser.uid;
    var action = "Deleted user."

    firebase.database().ref('users/'+userID).remove();
    alert(action);
    window.location.replace("Users.html");
  },


  render: function() {
      return (
        <div id="mainContent">

          <div className="nav-tabs-custom" style={{paddingLeft: 0, width: 920}}>
            <ul className="nav nav-tabs pull-right" style={{width: 920}}>
              <a href="Users.html" className="pull-left"><img src="../bootstrap/icons/left-arrow.png" height="25px" style={{paddingLeft:  15, paddingTop: 10, width: 40, height: 35}}/></a>
              <li><a href="#activity" data-toggle="tab">ACTIVITY</a></li>
              <li className="active"><a href="#userProfileMainContent" data-toggle="tab">PROFILE</a></li>
            </ul>

            <div className="tab-content table-responsive" style={{width: 920, height:420}}>

              <div className="tab-pane" id="activity">
                <div className="row">
                  <div className="col-sm-8"></div>
                  <div className="col-sm-4">
                    <div className="input-group input-group-md">
                      <input type="text" name="tableSearch" className="form-control pull-right" id="activitySearch" placeholder="Search" onChange={this.showTable}/>
                      <div className="input-group-btn">
                        <button type="submit" className="btn btn-default" id="activityButton">
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-body table-responsive" id="activityMainTable">
                  <table id="activityTable" className="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info">
                    <thead>
                      <tr>
                        <th className="sorting" tabIndex="0" aria-controls="example2" rowSpan="1" colSpan="1" aria-label="Rendering engine: activate to sort column ascending" aria-sort="ascending">ACTION</th>
                        <th className="sorting" tabIndex="0" aria-controls="example2" rowSpan="1" colSpan="1" aria-label="Rendering engine: activate to sort column ascending" aria-sort="ascending">ITEM/</th>
                        <th className="sorting" tabIndex="0" aria-controls="example2" rowSpan="1" colSpan="1" aria-label="Rendering engine: activate to sort column ascending" aria-sort="ascending">STOCK</th>
                        <th className="sorting" tabIndex="0" aria-controls="example2" rowSpan="1" colSpan="1" aria-label="Rendering engine: activate to sort column ascending" aria-sort="ascending">DATE</th>
                      </tr>
                    </thead>
                    <tbody id="activityList">
                      <tr id="no-data" style={{display:'none'}}>
                        <h5>No Results Found.</h5>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="active tab-pane" id="userProfileMainContent" style={{height: 360, marginLeft: 0, width: 890}}>
                <h2><strong style={{paddingLeft: 50}}> {this.state.fullName} </strong></h2>
                <h4 style={{paddingLeft: 50}}> {this.state.address} </h4><br/>
                <div className="row" style={{paddingLeft: 50}}>
                  <div className="col-sm-1" style={{ marginTop: '9px'}}>
                    <img src="../bootstrap/icons/age.png" height="45px"/>
                  </div>
                  <div className="col-sm-6">
                    <h5 style={{color: 'gray'}}><strong> AGE </strong></h5>
                    <h4><strong> {this.state.age} YRS OLD </strong></h4><br/>
                  </div>
                  <div className="col-sm-1" style={{ marginTop: '9px'}}>
                    <img src="../bootstrap/icons/bday.png" height="45px"/>
                  </div>
                  <div className="col-sm-3">
                    <h5 style={{color: 'gray'}}><strong> BIRTHDAY </strong></h5>
                    <h4><strong> {this.state.birthdate} </strong></h4><br/>
                  </div>
                </div>
                <br/>
                <div className="row" style={{paddingLeft: 50}}>
                  <div className="col-sm-1" style={{ marginTop: '9px'}}>
                    <img src="../bootstrap/icons/message.png" height="45px"/>
                  </div>
                  <div className="col-sm-6">
                    <h5 style={{color: 'gray'}}><strong> EMAIL ADDRESS </strong></h5>
                    <h4><strong> {this.state.email} </strong></h4><br/>
                  </div>
                  <div className="col-sm-1" style={{ marginTop: '9px'}}>
                    <img src="../bootstrap/icons/phone-book.png" height="45px"/>
                  </div>
                  <div className="col-sm-4">
                    <h5 style={{color: 'gray'}}><strong> CONTACT NUMBER </strong></h5>
                    <h4><strong> {this.state.contactNumber} </strong></h4><br/>
                  </div>
                </div>

                <div className="row" id="userProfileButtons">
                  <div className="col-sm-6"></div>
                  <div className="col-sm-6 pull-right" style={{paddingRight: 0, paddingTop: 25, paddingLeft: 280, marginRight: 60}}>
                    <a className="btn btn-primary pull-right" id="editInfoButton" data-toggle="modal" data-target="#editInfoModal" style={{width: 80}}
                      onClick={this.showModal}>EDIT
                    </a>
                    <div className="col-sm-6">
                      <a className="btn btn-primary pull-right" id="deleteUserButton" data-toggle="modal" data-target="#deleteUserModal">DELETE</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* </div> */}

          <div className="example-modal">
            <div className="modal fade bs-example-modal-lg" id="editConfirmation">
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <div className="modal-body">
                    <center>
                      <h5>Are you sure you want to edit this profile?</h5>
                      <button type="button" className="btn btn-primary" onClick={this.editUser} id="confirmProfileEdit">YES</button>
                      <button type="button" className="btn btn-default" data-dismiss="modal" id="confirmProfileEdit">NO</button>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="example-modal">
            <div className="modal fade bs-example-modal-lg" id="deleteUserModal">
              <div className="modal-dialog modal-md">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Delete User</h4>
                  </div>
                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <center><h4><strong>Are you sure you want to delete this user?</strong></h4></center>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default pull-left" data-dismiss="modal">NO</button>
                    <button type="button" className="btn btn-primary" onClick={this.deleteUser}>YES</button>
                  </div>
                </div>
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

          <div className="example-modal">
            <div className="modal modal-success" id="informSuccess">
              <div className="modal-dialog modal-md">
                <div className="modal-content">
                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <center>
                      <h4><strong>Successfully Updated Profile.</strong></h4>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="example-modal">
            <div className="modal fade bs-example-modal-lg" id="editInfoModal">
              <div className="modal-dialog modal-md">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Edit Info</h4>
                  </div>
                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="row">
                      <div className="col-sm-6" id="editInfoModalComponents">
                        <label>First Name</label>
                        <input type="text" id="firstName" className="form-control" onChange={this.onFirstName} value={this.state.firstname}/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6" id="editInfoModalComponents">
                        <label>Last Name</label>
                        <input type="text" id="lastName" className="form-control" onChange={this.onLastName} value={this.state.lastname}/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6" id="editInfoModalComponents">
                        <label>Email</label>
                        <input type="email" id="email" className="form-control" onChange={this.onEmail} value={this.state.email}/>
                      </div>
                      <div className="col-sm-6" id="editInfoModalComponents">
                        <label>Contact Number</label>
                        <input type="text" id="contactNumber" className="form-control" onChange={this.onContactNumber} value={this.state.contactNumber}/>
                      </div>
                    </div>
                    <div className="row">
                      <div id="editInfoModalComponents" style={{marginLeft: 15, marginRight: 15}}>
                        <label>Address</label>
                        <input type="text" id="address" className="form-control" onChange={this.onAddress} value={this.state.address}/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-8" id="editInfoModalComponents">
                        <label>Birthdate</label>
                        <input type="date" id="birthdate" className="form-control" onChange={this.onBirthdate} value={this.state.birthdate}/>
                      </div>
                      <div className="col-sm-4" id="editInfoModalComponents">
                        <label>Age</label>
                        <input type="number" id="age" className="form-control" onChange={this.onAge} value={this.state.age} disabled/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6" id="editInfoModalComponents">
                        <label>Password</label>
                        <input type="password" id="password" className="form-control" onChange={this.onPassword} value={this.state.password}/>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default pull-left" data-dismiss="modal">CANCEL</button>
                    <button type="button" className="btn btn-primary" id="editConfirmBtn" onClick={this.checkProfile}>SAVE</button>
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

  componentWillMount: function(){
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var uid = firebase.auth().currentUser.uid;
          firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
            self.setState({ signedIn: true, type: snapshot.val().user_type });
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
