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
                <li><a href="SpecificUser.html"><i><img src="../bootstrap/icons/graph-line-screen.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Specific User</span></a></li>
                <li><a href="AdminProfile.html"><i className="fa fa-user" id="sidebarImage"></i><span id="sidebarProfileTab">Profile</span></a></li>
              </ul>
            </div>
          </div>

          <div style={{height: '588px', backgroundColor: '#e1e1e1'}}>
            <div className="content-wrapper" style={{height: '588px', backgroundColor: '#e1e1e1', paddingLeft: 80, paddingRight: 30, paddingTop: 10}}>
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
  },

  showModal: function(){
    $('#editInfoModal').appendTo("body").modal('show');
  },

  showConfirmationModal: function(){
    $('#editConfirmation').appendTo("body").modal('show');
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

  render: function() {
      return (
        <div id="mainContent">

          <div className="nav-tabs-custom" style={{paddingLeft: 0}}>

            <ul className="nav nav-tabs pull-right">
              <a href="Inventory.html" className="pull-left"><img src="../bootstrap/icons/left-arrow.png" height="25px" style={{paddingLeft:  15, paddingTop: 10, width: 40, height: 35}}/></a>
              <li><a href="#activity" data-toggle="tab">ACTIVITY</a></li>
              <li className="active"><a href="#userProfileMainContent" data-toggle="tab">PROFILE</a></li>
            </ul>

            <div className="tab-content" style={{width: 470, height: 400}}>
              <div className="tab-pane" id="activity">
                <div className="row">
                  <div className="col-sm-6 pull-right">
                    <div className="box-tools pull-right">
                      <div className="input-group input-group-sm" id="logsTransSearch">
                        <input type="text" name="table_search" className="form-control pull-right" placeholder="Search"/>
                        <div className="input-group-btn">
                          <button type="submit" className="btn btn-default">
                            <i className="fa fa-search"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="box-body">
                      <table id="example1" className="table table-bordered table-striped striped dataTable">
                        <thead>
                          <tr>
                            <th><center>TRANSACTION ID</center></th>
                            <th><center>TOTAL</center></th>
                            <th><center>DATE</center></th>
                            <th><center>USER</center></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Trident</td>
                            <td>Win 95+</td>
                            <td> 4</td>
                            <td>X</td>
                          </tr>
                          <tr>
                            <td>Trident</td>
                            <td>Win 95+</td>
                            <td> 4</td>
                            <td>X</td>
                          </tr>
                          <tr>
                            <td>Trident</td>
                            <td>Win 95+</td>
                            <td> 4</td>
                            <td>X</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row" id="logsRowThree">
                  <div className="col-sm-5">
                    <div className="dataTables_info" id="example2_info" role="status" aria-live="polite">
                      Showing 1 to 10 of 57 entries
                    </div>
                  </div>
                  <div className="col-sm-7">
                    <div className="dataTables_paginate paging_simple_numbers pull-right" id="logsTransPagination">
                      <ul className="pagination">
                        <li className="paginate_button previous disabled">
                          <a href="#" aria-controls="example2" data-dt-idx="0" tabindex="0">Previous</a>
                        </li>
                        <li className="paginate_button active">
                          <a href="#" aria-controls="example2" data-dt-idx="1" tabindex="0">1</a>
                        </li>
                        <li className="paginate_button">
                          <a href="#" aria-controls="example2" data-dt-idx="2" tabindex="0">2</a>
                        </li>
                        <li className="paginate_button next">
                          <a href="#" aria-controls="example2" data-dt-idx="2" tabindex="0">Next</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="active tab-pane" id="userProfileMainContent" style={{height: 444, marginLeft: 0, width: 900}}>
                {/* <div className="row col-xs-8 box" style={{paddingLeft: 20}}>
                <div> */}
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
                  {/* </div>
                  </div> */}
                </div>

                <div className="row" id="userProfileButtons">
                  <div className="col-sm-6"></div>
                  <div className="col-sm-6 pull-right" style={{paddingRight: 0, paddingTop: 20, paddingLeft: 270}}>
                    <a className="btn btn-primary pull-right" id="editInfoButton" data-toggle="modal" data-target="#editInfoModal" style={{width: 80}}
                      onClick={this.showModal}>EDIT
                    </a>
                    <div className="col-sm-6">
                      <a className="btn btn-primary pull-right" id="editInfoButton" data-toggle="modal" data-target="#editInfoModal"
                        onClick={this.showModal}>DELETE
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}

          {/*MODAL CONTENT*/}

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
                      <div id="editInfoModalComponents">
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
                    <button type="button" className="btn btn-primary" id="editConfirmBtn" data-toggle="modal" data-target="#editConfirmation"
                      onClick={this.showConfirmationModal}>SAVE</button>
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
