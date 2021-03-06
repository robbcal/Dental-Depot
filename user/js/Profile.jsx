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
          <div className="main-sidebar">
              <div className="sidebar">
                  <ul className="sidebar-menu">
                      <br/>
                      <li className="header">NAVIGATION</li>
                      <li><a href="Inventory.html"><i className="fa fa-archive" id="sidebarImage"></i><span>Inventory</span></a></li>
                      <li><a href="Transaction.html"><i className="fa fa-shopping-cart" id="sidebarImage"></i><span>Transaction</span></a></li>
                      <li className="active"><a href="Profile.html"><i className="fa fa-user" id="sidebarImage"></i><span>Profile</span></a></li>
                  </ul>
              </div>
          </div>
          <div className="content-wrapper" style={{height: '100vh', backgroundColor: '#e1e1e1'}}>
              <div id="content" className="content" style={{backgroundColor: '#e1e1e1'}}>
                  <Content/>
              </div>
          </div>
      </div>
    );
  }
});

var Content = React.createClass({
  getInitialState: function() {
    return {
      firstName: "null",
      lastName: "null",
      fullName: "null",
      address: "null",
      age: "null",
      birthDate: "null",
      email: "null",
      contactNumber: "null",
      userType: "null"
    };
  },

  //initialization of fields
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
        if(snapshot.val() == "admin"){
          window.location.reload();
        }
      });
    });
    
    ref.on('value', function(snapshot) {
      self.setState({
        firstName: snapshot.val().firstname,
        lastName: snapshot.val().lastname,
        fullName: snapshot.val().firstname+" "+snapshot.val().lastname,
        address: snapshot.val().address,
        age: snapshot.val().age,
        birthDate: snapshot.val().birthday,
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
        $(function(){
          var dtToday = new Date();
          var month = dtToday.getMonth() + 1;
          var day = dtToday.getDate();
          var year = dtToday.getFullYear();
          var minYear = year - 99;  

          if(month < 10){
            month = '0' + month.toString();
          }
          if(day < 10){
            day = '0' + day.toString();
          }

          var maxDate = year + '-' + month + '-' + day;
          var minDate = minYear + '-' + month + '-' + day;
          $('#birthDate').attr('max', maxDate);
          $('#birthDate').attr('min', minDate);
        });
        $("#birthDate").focusout(function(){
          var dtToday = new Date();
          var yearNow = dtToday.getFullYear();
          var date = new Date($('#birthDate').val());
          var year = date.getFullYear();
          if(yearNow - year > 99 || yearNow - year < 1){
            $('#birthDate').val("");
          }
        });
      }(jQuery));
    });
  },

  checkProfile: function(){
    var firstName = document.getElementById("firstName").value.trim();
    var lastName = document.getElementById("lastName").value.trim();
    var address = document.getElementById("address").value.trim();
    var contactnumber = document.getElementById("contactNumber").value.trim();
    var email = document.getElementById("email").value.trim();
    var age = document.getElementById("age").value.trim();
    var birthDate = document.getElementById("birthDate").value.trim();
    var password = document.getElementById("password").value;

    if(firstName != "" && lastName != "" && address != "" && contactnumber != "" && email != "" && age != "" && birthDate != "" && password != ""){
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

    if(firstName == ""){
      document.getElementById("firstName").value = "";
    }
    if(lastName == ""){
      document.getElementById("lastName").value = "";
    }
    if(address == ""){
      document.getElementById("address").value = "";
    }
    if(contactnumber == ""){
      document.getElementById("contactNumber").value = "";
    }
    if(email == ""){
      document.getElementById("email").value = "";
    }
    if(birthDate == ""){
      document.getElementById("birthDate").value = "";
    }
    if(age == ""){
      document.getElementById("age").value = "";
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
      document.getElementById("birthDate").value = snapshot.val().birthday;
      document.getElementById("prevEmail").value = snapshot.val().user_email;
      document.getElementById("email").value = snapshot.val().user_email;
      document.getElementById("contactNumber").value = snapshot.val().contact_no;
      document.getElementById("password").value = atob(snapshot.val().password);
    });
    document.getElementById("firstName").style.borderColor = "";
    document.getElementById("lastName").style.borderColor = "";
    document.getElementById("address").style.borderColor = "";
    document.getElementById("contactNumber").style.borderColor = "";
    document.getElementById("email").style.borderColor = "";
    document.getElementById("birthDate").style.borderColor = "";
    document.getElementById("password").style.borderColor = "";
  },

  ageCalculator: function(){
    var today = new Date();
    var birthDate = new Date(document.getElementById("birthDate").value);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    document.getElementById("age").value = age;
  },

  editUser: function(){
    var now = new Date();
    var hh = ((now.getHours())>=10)? (now.getHours()) : '0' + (now.getHours());
    var mm = ((now.getMinutes())>=10)? (now.getMinutes()) : '0' + (now.getMinutes());
    var ss = ((now.getSeconds())>=10)? (now.getSeconds()) : '0' + (now.getSeconds());
    var time = hh+":"+mm+":"+ss;

    var month=((now.getMonth()+1)>=10)? (now.getMonth()+1) : '0' + (now.getMonth()+1);
    var day=((now.getDate())>=10)? (now.getDate()) : '0' + (now.getDate());
    var today = now.getFullYear()+"-"+month+"-"+day;
    today = today+" "+time;

    var uid = firebase.auth().currentUser.uid;
    var firstName =document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var address = document.getElementById("address").value;
    var contactnumber = document.getElementById("contactNumber").value;
    var prevEmail = document.getElementById("prevEmail").value;
    var email = document.getElementById("email").value;
    var age = document.getElementById("age").value;
    var birthDate = document.getElementById("birthDate").value;
    var password = btoa(document.getElementById("password").value);
    firstName = firstName.substring(0, 50);
    lastName = lastName.substring(0, 50);
    email = email.substring(0, 50);
    address = address.substring(0, 200);
    password = password.substring(0, 50);

    if(firstName && lastName && address && contactnumber && email && age && birthDate && password){
      firebase.auth().currentUser.updateEmail(email).then(function() {
        firebase.auth().currentUser.updatePassword(password).then(function() {
          firebase.auth().currentUser.sendEmailVerification().then(function() {
            firebase.database().ref('users/'+uid).update({
              firstname: firstName,
              lastname: lastName,
              user_email: email,
              address: address,
              contact_no: contactnumber,
              age: age,
              birthday: birthDate,
              password: password
            });
            firebase.database().ref('activities').push().set({
              action_performed: "Edited profile.",
              object_changed: firstName+" "+lastName,
              quantity: "n/a",
              date: today,
              user: firstName+" "+lastName
            });
            firebase.database().ref('users/'+uid+'/activity').push().set({
              action_performed: "Edited profile.",
              object_changed: firstName+" "+lastName,
              quantity: "n/a",
              date: today
            });
            if(email != prevEmail){
              firebase.database().ref('users/'+uid).update({
                status:"Unverified"
              });
            }
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

  render: function() {
    var style={
      color: 'red'
    }
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
                      <h5 className="text-muted" id="profileContents">{this.state.birthDate}</h5>
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
                                      <label><span style={style}>* </span>First Name</label>
                                      <input type="text" id="firstName" className="form-control" maxLength="50"/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="col-sm-6" id="editInfoModalComponents">
                                      <label><span style={style}>* </span>Last Name</label>
                                      <input type="text" id="lastName" className="form-control" maxLength="50"/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="col-sm-6" id="editInfoModalComponents">
                                      <label><span style={style}>* </span>Email</label>
                                      <input type="hidden" id="prevEmail"/>
                                      <input type="email" id="email" className="form-control" maxLength="50"/>
                                  </div>
                                  <div className="col-sm-6" id="editInfoModalComponents">
                                      <label><span style={style}>* </span>Contact Number</label>
                                      <input type="number" id="contactNumber" className="form-control" maxLength="50"/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div id="editInfoModalComponents">
                                      <label><span style={style}>* </span>Address</label>
                                      <input type="text" id="address" className="form-control" maxLength="200"/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="col-sm-8" id="editInfoModalComponents">
                                      <label><span style={style}>* </span>Birthdate</label>
                                      <input type="date" id="birthDate" className="form-control" onBlur={this.ageCalculator}/>
                                  </div>
                                  <div className="col-sm-4" id="editInfoModalComponents">
                                      <label>Age</label>
                                      <input type="number" id="age" className="form-control" min="1" max="99" readOnly/>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="col-sm-6" id="editInfoModalComponents">
                                      <label><span style={style}>* </span>Password</label>
                                      <input type="password" id="password" className="form-control" maxLength="50"/>
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
          <div className="wrapper">
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
