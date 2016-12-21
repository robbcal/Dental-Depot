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
        userType: snapshot.val().user_type
      });
    });

    firebase.database().ref('users/'+userID+'/activity').orderByKey().on('child_added', function(data){
      var action = data.val().action_performed;
      var object = data.val().object_changed;
      var quantity = data.val().quantity;
      var date = data.val().date;

      $("#activityList").append("<tr><td><center>"+action+"</center></td><td><center>"+object+"</center></td><td><center>"+quantity+"</center></td><td><center>"+date+"</center></td></tr>");
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
        });
        $("#age").keypress(function(event) {
          if (event.which == 45 || event.which == 46) {
            event.preventDefault();
          }
        });
      }(jQuery));
    });
  },

  showTable: function(){
    if($('#activitySearch').val == null){
      $('#activityList tr').show();
    }
  },

  checkProfile: function(){
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var contactNumber = document.getElementById("contactNumber").value;
    var address = document.getElementById("address").value;
    var birthdate = document.getElementById("birthdate").value;
    var age = document.getElementById("age").value;
    var type = document.getElementById("userType").value;  

    if(firstName && lastName && contactNumber && address && birthdate && age && type){
      if(Number(age) <= 0){
        document.getElementById("errorMessage").innerHTML= "Invalid age.";
        $('#errorModal').appendTo("body").modal('show');
        $('#editConfirmation').modal('hide');
      }else{
        $('#editConfirmation').appendTo("body").modal('show');
      }    
    }else{
      document.getElementById("errorMessage").innerHTML= "Missing input.";
      $('#errorModal').appendTo("body").modal('show');
      $('#editConfirmation').modal('hide');
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

  displayInfo: function(){
    firebase.database().ref('users/'+userID).once('value', function(data){
      document.getElementById("firstName").value = data.val().firstname;
      document.getElementById("lastName").value = data.val().lastname;
      document.getElementById("address").value = data.val().address;
      document.getElementById("age").value = data.val().age;
      document.getElementById("birthdate").value = data.val().birthday;
      document.getElementById("contactNumber").value = data.val().contact_no;
      $('#userType option[value='+data.val().user_type+']').attr('selected','selected');
    });
    document.getElementById("firstName").style.borderColor = "";
    document.getElementById("lastName").style.borderColor = "";
    document.getElementById("contactNumber").style.borderColor = "";
    document.getElementById("address").style.borderColor = "";
    document.getElementById("birthdate").style.borderColor = ""; 
    document.getElementById("age").style.borderColor = "";
  },

  editUser: function(){
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    var uid = firebase.auth().currentUser.uid;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var contactNumber = document.getElementById("contactNumber").value;
    var address = document.getElementById("address").value;
    var birthdate = document.getElementById("birthdate").value;
    var age = document.getElementById("age").value;
    var type = document.getElementById("userType").value;

    firebase.database().ref('users/'+userID).update({
        firstname:firstName,
         lastname:lastName,
          address:address,
              age:age,
         birthday:birthdate,
       contact_no:contactNumber,
        user_type:type
    })
    firebase.database().ref("users/"+uid+"/activity").push().set({
      action_performed: "Edited user.",
      object_changed: firstName+" "+lastName,
      quantity: "n/a",
      date: today
    });
    $('#editConfirmation').modal('hide');
    $('#editInfoModal').modal('hide');
    $('#informSuccess').appendTo("body").modal('show');
    setTimeout(function() { $("#informSuccess").modal('hide'); }, 1000);
  },

  deleteUser: function(){
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var now = new Date();
    var today = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    var uid = firebase.auth().currentUser.uid;
    var action = "Deleted user."

    firebase.database().ref("users/"+uid+"/activity").push().set({
      action_performed: action,
      object_changed: firstName+" "+lastName,
      quantity: "n/a",
      date: today
    });
    $('#deleteUserModal').modal('hide');
    $('#informSuccessDelete').appendTo("body").modal('show');
    setTimeout(function() { $("#informSuccessDelete").modal('hide'); }, 3000);
    firebase.database().ref('users/'+userID).remove();
    window.location.replace("Users.html");
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
    if(document.getElementById("contactNumber").value == ""){
      document.getElementById("contactNumber").style.borderColor = "red";
    }else{
      document.getElementById("contactNumber").style.borderColor = "";
    }
    if(document.getElementById("address").value == ""){
      document.getElementById("address").style.borderColor = "red";
    }else{
      document.getElementById("address").style.borderColor = "";
    }
    if(document.getElementById("birthdate").value == ""){
      document.getElementById("birthdate").style.borderColor = "red";
    }else{
      document.getElementById("birthdate").style.borderColor = "";
    }
    if(document.getElementById("age").value == ""){
      document.getElementById("age").style.borderColor = "red";
    }else{
      document.getElementById("age").style.borderColor = "";
    }
  },
    
  render: function() {
    return (
        <div id="mainContent">
            <input type="hidden" id="transID" name="transID"/>
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs pull-right">
                    <li className="pull-left header"><a href="Users.html"><img src="../bootstrap/icons/left-arrow.png" id="backButton"/></a></li>
                    <li><a href="#activity" data-toggle="tab">ACTIVITY</a></li>
                    <li className="active"><a href="#profile" data-toggle="tab">PROFILE</a></li>
                </ul>
                <div className="tab-content table-responsive" id="tabContent">
                    <div className="active tab-pane" id="profile">
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
                                        <div className="row" id="buttonRow"><center>
                                            <button className="btn btn-primary" id="editInfoButton" data-toggle="modal" data-target="#editInfoModal" onClick={this.displayInfo}>EDIT</button>
                                            <button className="btn btn-danger" id="deleteUserButton" data-toggle="modal" data-target="#deleteUserModal">DELETE</button>
                                        </center></div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-8">
                                <div id="basicInfo">
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
                    </div>

                    <div className="tab-pane" id="activity">
                        <div className="row">
                            <div className="col-sm-8"></div>
                            <div className="col-sm-4 pull-right">
                                <div className="box-tools pull-right">
                                    <div className="input-group input-group-md" id="searchField">
                                        <input type="text" name="tableSearch" className="form-control pull-right" placeholder="Search" id="activitySearch"/>
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
                                    <table id="example1" className="table table-bordered table-striped dataTable">
                                        <thead>
                                          <tr>
                                            <th><center>ACTION</center></th>
                                            <th><center>OBJECT</center></th>
                                            <th><center>QUANTITY</center></th>
                                            <th><center>DATE</center></th>
                                          </tr>
                                        </thead>
                                        <tbody id="activityList">
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

                    {/* MODAL COMPONENTS */}
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
                                            <input type="email" id="email" className="form-control" readOnly value={this.state.email}/>
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
                                            <label>User Type</label>
                                            <select id="userType" className="form-control">
                                              <option id="admin" value="admin">Admin</option>
                                              <option id="user" value="user">User</option>
                                            </select>
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
                                        <h4><strong>Successfully Updated Profile.</strong></h4>
                                    </center>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade modal-danger" id="deleteUserModal">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <center><h5 className="modal-title">DELETE USER</h5></center>
                                </div>
                                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <center>
                                        <h5 id="errorMessage">Are you sure you want to delete this user?</h5>
                                        <br/>
                                        <button type="button" className="btn btn-outline" id="deleteButtons" onClick={this.deleteUser}>YES</button>
                                        <button type="button" className="btn btn-outline" id="deleteButtons" data-dismiss="modal">NO</button>
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
                                        <h4><strong>Successfully Deleted User.</strong></h4>
                                    </center>
                                </div>
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
