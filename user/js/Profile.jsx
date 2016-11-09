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
                              <a href="#" className="dropdown-toggle profile" data-toggle="dropdown">
                                  <span onClick={this.logout}><img className="profileDropdown" src="../bootstrap/icons/tooth.png"/></span>
                              </a>
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
                      <li><a href="Items.html"><i><img src="../bootstrap/icons/boxes.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Inventory</span></a></li>
                      <li className="active"><a href="Profile.html"><i><img src="../bootstrap/icons/graph-line-screen.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Profile</span></a></li>
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
    var ref = firebase.database().ref('users/'+uid);
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

    firebase.auth().currentUser.updateEmail(email).then(function() {
      firebase.auth().currentUser.updatePassword(password).then(function() {
        firebase.database().ref('users/'+uid).update({
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
       //alert("Profile edited");
      }, function(error) {
        //alert(error);
        document.getElementById("errorMessage").innerHTML= error;
        $('#errorModal').appendTo("body").modal('show');
        $('#editConfirmation').modal('hide');
      });
    }, function(error) {
      //alert(error);
      document.getElementById("errorMessage").innerHTML= error;
      $('#errorModal').appendTo("body").modal('show');
      $('#editConfirmation').modal('hide');
    });
    
  },

  render: function() {
      return (
          <div id="userProfileContent">
              <div className="row" id="userProfileButtons">
                  <div className="col-sm-6"></div>
                  <div className="col-sm-6">
                      <a className="btn btn-primary pull-right" id="editInfoButton" data-toggle="modal" data-target="#editInfoModal"
                          onClick={this.showModal}>EDIT INFO
                      </a>
                  </div>
              </div>

              <div className="row col-xs-8 box" id="userProfileMainContent">
                  <div>
                      <h2><strong> {this.state.fullName} </strong></h2>
                      <h4> {this.state.address} </h4><br/><br/>
                      <div className="row">
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
                      <div className="row">
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
                  </div>
              </div>

              {/*MODAL CONTENT*/}
              
              <div className="example-modal">
                  <div className="modal fade bs-example-modal-lg" id="editConfirmation">
                      <div className="modal-dialog modal-md">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                  <h4 className="modal-title">Confirmation</h4>
                              </div>
                              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                  <h4><strong> Are you sure you want to edit this profile? </strong></h4>

                              </div>
                              <div className="modal-footer">
                                  <button type="button" className="btn btn-default pull-left" data-dismiss="modal">NO</button>
                                  <button type="button" className="btn btn-primary" onClick={this.editUser}>YES</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="example-modal">
                  <div className="modal fade bs-example-modal-lg" id="errorModal">
                      <div className="modal-dialog modal-sm">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                  <h4 className="modal-title">Error</h4>
                              </div>
                              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                  <h4><strong id="errorMessage"> Error </strong></h4>

                              </div>
                              <div className="modal-footer">
                                  <button type="button" className="btn btn-default pull-right" data-dismiss="modal">OK</button>
                                  
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="example-modal">
                  <div className="modal fade bs-example-modal-lg" id="informSuccess">
                      <div className="modal-dialog modal-md">
                          <div className="modal-content">
                              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <h4><strong> Profile Updated! </strong></h4>
                              </div>
                              <div className="modal-footer">
                                <center>
                                  <button type="button" className="btn btn-default" data-dismiss="modal">OK</button>
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
                                          <input type="number" id="age" className="form-control" onChange={this.onAge} value={this.state.age}/>
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
