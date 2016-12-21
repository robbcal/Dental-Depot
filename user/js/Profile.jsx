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
                      <li><a href="Inventory.html"><i className="fa fa-archive" id="sidebarImage"></i><span>Inventory</span></a></li>
                      <li className="active"><a href="Profile.html"><i className="fa fa-user" id="sidebarImage"></i><span>Profile</span></a></li>
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
       firstname: "null",
        lastname: "null",
        fullName: "null",
         address: "null",
             age: "null",
       birthdate: "null",
           email: "null",
   contactNumber: "null",
        userType: "null"
      };
  },

  componentDidMount: function(){
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
        userType: snapshot.val().user_type
      });
    });
    $(document).ready(function () {
      (function ($) {
        $("#age").keypress(function(event) {
          if (event.which == 45 || event.which == 46) {
            event.preventDefault();
          }
        });
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
        if(Number(age) <= 0){
          document.getElementById("errorMessage").innerHTML= "Invalid age.";
          $('#errorModal').appendTo("body").modal('show');
        }else{
          $('#editConfirmation').appendTo("body").modal('show');
        }     
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

  displayInfo: function(){
    var uid = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('users/'+uid);
    ref.on('value', function(snapshot) {
      document.getElementById("firstName").value = snapshot.val().firstname;
      document.getElementById("lastName").value = snapshot.val().lastname;
      document.getElementById("address").value = snapshot.val().address;
      document.getElementById("age").value = snapshot.val().age;
      document.getElementById("birthdate").value = snapshot.val().birthday;
      document.getElementById("email").value = snapshot.val().user_email;
      document.getElementById("contactNumber").value = snapshot.val().contact_no;
      document.getElementById("password").value = atob(snapshot.val().password);
    });
    document.getElementById("firstName").style.borderColor = "";
    document.getElementById("lastName").style.borderColor = "";
    document.getElementById("address").style.borderColor = "";
    document.getElementById("contactNumber").style.borderColor = "";
    document.getElementById("email").style.borderColor = "";
    document.getElementById("age").style.borderColor = "";
    document.getElementById("birthdate").style.borderColor = "";
    document.getElementById("password").style.borderColor = "";
  },

  editUser: function(){
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    var uid = firebase.auth().currentUser.uid;
    var firstname = document.getElementById("firstName").value;
    var lastname = document.getElementById("lastName").value;
    var address = document.getElementById("address").value;
    var contactnumber = document.getElementById("contactNumber").value;
    var email = document.getElementById("email").value;
    var age = document.getElementById("age").value;
    var birthdate = document.getElementById("birthdate").value;
    var password = btoa(document.getElementById("password").value);

    if(firstname && lastname && address && contactnumber && email && age && birthdate && password){
      firebase.auth().currentUser.updateEmail(email).then(function() {
        firebase.auth().currentUser.updatePassword(password).then(function() {
          firebase.auth().currentUser.sendEmailVerification().then(function() {
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
            firebase.database().ref('users/'+uid+'/activity').push().set({
              action_performed: "Edited profile.",
              object_changed: firstname+" "+lastname,
              quantity: "n/a",
              date: today
            });
            $('#editConfirmation').modal('hide');
            $('#editInfoModal').modal('hide');
            $('#informSuccess').appendTo("body").modal('show');
            setTimeout(function() { $("#informSuccess").modal('hide'); }, 8000);
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

  formValidation: function(){
    if(document.getElementById("firstName").value == ""){
      document.getElementById("firstName").style.borderColor = "red";
    }else{
      document.getElementById("firstName").style.borderColor = "";
    }
    if(document.getElementById("lastName").value == ""){
      document.getElementById("lastName").style.borderColor = "red";
    }else{
      document.getElementById("lastName").style.borderColor = "";
    }
    if(document.getElementById("address").value == ""){
      document.getElementById("address").style.borderColor = "red";
    }else{
      document.getElementById("address").style.borderColor = "";
    }
    if(document.getElementById("contactNumber").value == ""){
      document.getElementById("contactNumber").style.borderColor = "red";
    }else{
      document.getElementById("contactNumber").style.borderColor = "";
    }
    if(document.getElementById("email").value == ""){
      document.getElementById("email").style.borderColor = "red";
    }else{
      document.getElementById("email").style.borderColor = "";
    }
    if(document.getElementById("age").value == ""){
      document.getElementById("age").style.borderColor = "red";
    }else{
      document.getElementById("age").style.borderColor = "";
    }
    if(document.getElementById("birthdate").value == ""){
      document.getElementById("birthdate").style.borderColor = "red";
    }else{
      document.getElementById("birthdate").style.borderColor = "";
    }
    if(document.getElementById("password").value == ""){
      document.getElementById("password").style.borderColor = "red";
    }else{
      document.getElementById("password").style.borderColor = "";
    }
  },

  render: function() {
      return (
          <div className="row" id="userProfileContent">
              <div className="col-md-4">
                  <div className="box box-primary" id="basicInfo">
                      <div className="box-body box-profile">
                          <center>
                              <img className="profile-user-img img-responsive img-circle" src="../bootstrap/icons/tooth.png" alt="User profile picture" id="imgUser"/>
                          </center>
                          <h3 className="profile-username text-center">{this.state.fullName}</h3>

                          <p className="text-muted text-center">{this.state.userType}</p>
                          <br/>
                          <a className="btn btn-primary pull-right btn-block" id="editInfoButton" data-toggle="modal" data-target="#editInfoModal" onClick={this.displayInfo}>
                              EDIT INFO
                          </a>
                      </div>
                  </div>
              </div>

              <div className="col-md-8">
                  <div className="box box-default" id="basicInfo">
                      <div className="box-header with-border">
                          <h3 className="box-title">User Information</h3>
                      </div>
                      <div className="box-body">
                          <strong><i className="fa fa-envelope-o margin-r-5"></i> Email Address</strong>
                          <h5 className="text-muted" id="profileContents">{this.state.email}</h5>
                          <hr/>
                          <strong><i className="fa fa-birthday-cake margin-r-5"></i> Birthday</strong>
                          <h5 className="text-muted" id="profileContents">{this.state.birthdate}</h5>
                          <hr/>
                          <strong><i className="fa fa-calendar margin-r-5"></i> Age</strong>
                          <h5 className="text-muted" id="profileContents">{this.state.age} years old</h5>
                          <hr/>
                          <strong><i className="fa fa-map-marker margin-r-5"></i> Address</strong>
                          <h5 className="text-muted" id="profileContents">{this.state.address}</h5>
                          <hr/>
                          <strong><i className="fa  fa-mobile-phone margin-r-5"></i> Contact Number</strong>
                          <h5 className="text-muted" id="profileContents">{this.state.contactNumber}</h5>
                      </div>
                  </div>
              </div>

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

              <div className="example-modal">
                  <div className="modal fade modal-success" id="informSuccess">
                      <div className="modal-dialog modal-md">
                          <div className="modal-content">
                              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <center>
                                      <h4><strong>Successfully Updated Profile. <br/>Check email for verification. If you have changed your email, verify it before proceeding.</strong></h4>
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
                                          <input type="text" id="firstName" className="form-control" onChange={this.formValidation} maxLength="50"/>
                                      </div>
                                  </div>
                                  <div className="row">
                                      <div className="col-sm-6" id="editInfoModalComponents">
                                          <label>Last Name</label>
                                          <input type="text" id="lastName" className="form-control" onChange={this.formValidation} maxLength="50"/>
                                      </div>
                                  </div>
                                  <div className="row">
                                      <div className="col-sm-6" id="editInfoModalComponents">
                                          <label>Email</label>
                                          <input type="email" id="email" className="form-control" onChange={this.formValidation} maxLength="50"/>
                                      </div>
                                      <div className="col-sm-6" id="editInfoModalComponents">
                                          <label>Contact Number</label>
                                          <input type="text" id="contactNumber" className="form-control" onChange={this.formValidation} maxLength="50"/>
                                      </div>
                                  </div>
                                  <div className="row">
                                      <div id="editInfoModalComponents">
                                          <label>Address</label>
                                          <input type="text" id="address" className="form-control" onChange={this.formValidation} maxLength="200"/>
                                      </div>
                                  </div>
                                  <div className="row">
                                      <div className="col-sm-8" id="editInfoModalComponents">
                                          <label>Birthdate</label>
                                          <input type="date" id="birthdate" className="form-control" onChange={this.formValidation}/>
                                      </div>
                                      <div className="col-sm-4" id="editInfoModalComponents">
                                          <label>Age</label>
                                          <input type="number" id="age" className="form-control" min="1" max="99" onChange={this.formValidation}/>
                                      </div>
                                  </div>
                                  <div className="row">
                                      <div className="col-sm-6" id="editInfoModalComponents">
                                          <label>Password</label>
                                          <input type="password" id="password" className="form-control" onChange={this.formValidation} maxLength="50"/>
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
        /*alert("Email is not verified");
        firebase.auth().signOut().then(function() {
          window.location.replace("http://127.0.0.1:8080/");
        }, function(error) {
          console.log(error);
        });*/
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
