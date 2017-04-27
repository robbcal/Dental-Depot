var Header = React.createClass({
  logout: function(){
    firebase.auth().signOut().then(function() {
      window.location.replace("http://127.0.0.1:8080/");
    }, function(error) {
      console.log(error);
    });
  },

  showModal: function(){
    $('#logoutConfirmation').appendTo("body").modal('show');
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
                      <li className="active"><a href="Users.html"><i className="fa fa-users" id="sidebarImage"></i><span>Users</span></a></li>
                      <li><a href="Logs.html"><i className="fa fa-line-chart" id="sidebarImage"></i><span>Logs</span></a></li>
                      <li><a href="Profile.html"><i className="fa fa-user" id="sidebarImage"></i><span>Profile</span></a></li>
                  </ul>
              </section>
          </aside>
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
      cur_password: "null"
    };
  },

  //display users to table and initialization of fields
  componentDidMount: function(){
    const self = this;
    var cur_uid = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('users/'+cur_uid);

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

    firebase.database().ref('users/'+cur_uid).once('value').then(function(snapshot) {
      self.setState({
        cur_password: snapshot.val().password
      });
    });

    var ref = firebase.database().ref('users').orderByChild('firstname');
    ref.on('value', function(snapshot) {
      $('#user_table').DataTable().clear().draw().destroy();
      snapshot.forEach(function(data) {
        var id=data.key
        var firstName = data.val().firstname;
        var lastName = data.val().lastname;
        var email = data.val().user_email;
        var address = data.val().address;
        var contactNumber = data.val().contact_no;
        var age = data.val().age;
        var birthDate = data.val().birthday;
        var userType = data.val().user_type;
        var status = data.val().status;
        var isDeleted = data.val().isDeleted;
        firstName = firstName.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
        lastName = lastName.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");

        if(isDeleted == false){
          $("#userList").append("<tr id="+id+"><td>"+firstName+" "+lastName+"</td><td>"+email+"</td><td>"+userType+"</td><td>"+status+"</td></tr>");
          $("#"+id+"").dblclick(function() {
            document.getElementById("user_id").value = id;
            document.getElementById("submit").click();
          });
        }
      });
      $('#user_table').DataTable({
        dom: 'Bfrtip',
        buttons: ['print'],
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

    $('#addUserModal').on('hidden.bs.modal', function () {
      document.getElementById("firstName").value="";
      document.getElementById("lastName").value="";
      document.getElementById("email").value="";
      document.getElementById("address").value="";
      document.getElementById("contactNumber").value="";
      document.getElementById("age").value="";
      document.getElementById("birthDate").value="";
      $("#userType option:eq(0)").attr("selected", "selected");
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

  showTable: function(){
    if($('#tableSearch').val == null){
      $('#userList tr').show();
    }
  },

  checkInput: function(){
    var firstName = document.getElementById("firstName").value.trim();
    var lastName = document.getElementById("lastName").value.trim();
    var email = document.getElementById("email").value.trim();
    var address = document.getElementById("address").value.trim();
    var contactNumber = document.getElementById("contactNumber").value.trim();
    var age = document.getElementById("age").value.trim();
    var birthDate = document.getElementById("birthDate").value.trim();
    var userType = document.getElementById("userType").value.trim();

    if(firstName && lastName && address && contactNumber && email && age && birthDate && userType){
      if(Number(age) <= 0){
        document.getElementById("errorMessage").innerHTML= "Invalid age.";
        $('#errorModal').appendTo("body").modal('show');
      }else{
        $('#addConfirmation').appendTo("body").modal('show');
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
    if(contactNumber == ""){
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
    if(userType == ""){
      document.getElementById("userType").value = "";
    }
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

  addUser: function(){
    var curUID = firebase.auth().currentUser.uid;
    var now = new Date();
    var hh = ((now.getHours())>=10)? (now.getHours()) : '0' + (now.getHours());
    var mm = ((now.getMinutes())>=10)? (now.getMinutes()) : '0' + (now.getMinutes());
    var ss = ((now.getSeconds())>=10)? (now.getSeconds()) : '0' + (now.getSeconds());
    var time = hh+":"+mm+":"+ss;

    var month=((now.getMonth()+1)>=10)? (now.getMonth()+1) : '0' + (now.getMonth()+1);
    var day=((now.getDate())>=10)? (now.getDate()) : '0' + (now.getDate());
    var today = now.getFullYear()+"-"+month+"-"+day;
    today = today+" "+time;

    var cur_email = firebase.auth().currentUser.email;
    var cur_password = this.state.cur_password;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var address = document.getElementById("address").value;
    var contactNumber = document.getElementById("contactNumber").value;
    var age = document.getElementById("age").value;
    var birthDate = document.getElementById("birthDate").value;
    var userType = document.getElementById("userType").value;
    var password = btoa("123456");
    firstName = firstName.substring(0, 50);
    lastName = lastName.substring(0, 50);
    email = email.substring(0, 50);
    address = address.substring(0, 200);

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
      var uid = firebase.auth().currentUser.uid;
      var user = firebase.auth().currentUser;
      user.sendEmailVerification().then(function() {
        firebase.auth().signInWithEmailAndPassword(cur_email, cur_password).then(function(){
          firebase.database().ref('users/'+uid).set({
            firstname: firstName,
            lastname: lastName,
            user_email: email,
            address: address,
            contact_no: contactNumber,
            age: age,
            birthday: birthDate,
            user_type: userType,
            password: password,
            status:"Unverified",
            isDeleted: false
          }, function(error) {
            console.log(error)
            $('#addConfirmation').modal('hide');
            $('#addUserModal').modal('hide');
          }).then(function(error) {
            firebase.database().ref("users/"+curUID+"/activity").push().set({
              action_performed: "Added user.",
              object_changed: firstName+" "+lastName,
              quantity: "n/a",
              date: today
            });
            firebase.database().ref('users/'+curUID).once('value').then(function(snapshot) {
              var fullname = snapshot.val().firstname+" "+snapshot.val().lastname;
              firebase.database().ref("activities").push().set({
                action_performed: "Added user.",
                object_changed: firstName+" "+lastName,
                quantity: "n/a",
                date: today,
                user: fullname
              });
            });

            $('#addConfirmation').modal('hide');
            $('#addUserModal').modal('hide');
            $('#informSuccess').appendTo("body").modal('show');
            setTimeout(function() { $("#informSuccess").modal('hide'); }, 3000);
            document.getElementById("firstName").value="";
            document.getElementById("lastName").value="";
            document.getElementById("email").value="";
            document.getElementById("address").value="";
            document.getElementById("contactNumber").value="";
            document.getElementById("age").value="";
            document.getElementById("birthDate").value="";
            $("#userType option:eq(0)").attr("selected", "selected");
          });
        })
      }, function(error) {
        document.getElementById("errorMessage").innerHTML= error;
        $('#errorModal').appendTo("body").modal('show');
      });
    }).catch(function(error) {
        document.getElementById("errorMessage").innerHTML= error;
        $('#errorModal').appendTo("body").modal('show');
    });
  },

  render: function() {
    var style={
      color: 'red'
    }
    return (
      <div id="mainContent">
          <form id="UserIDForm" type="get" action="SpecificUser.html">
              <input type="hidden" id="user_id" name="user_id"/>
              <button type="submit" value="Send" name="submit" id="submit" style={{display: 'none'}}></button>
          </form>
          <div className="box">
              <div className="box-header" id="headerContent">
                  <div className="col-sm-6">
                      <a className="btn btn-primary" id="addUserButton" href="" data-toggle="modal" data-target="#addUserModal">ADD USER</a>
                  </div>
              </div>
              <div className="box-body table-responsive" id="usersMainTable">
                  <table id="user_table" className="table table-bordered table-hover hover">
                      <thead>
                          <tr>
                              <th><center>USERNAME</center></th>
                              <th><center>EMAIL ADDRESS</center></th>
                              <th><center>USER TYPE</center></th>
                              <th><center>STATUS</center></th>
                          </tr>
                      </thead>
                      <tbody id="userList">
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
                              <button type="button" className="btn btn-primary" onClick={this.checkInput}>ADD</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="example-modal">
              <div className="modal fade bs-example-modal-lg" id="addConfirmation">
                  <div className="modal-dialog modal-sm">
                      <div className="modal-content">
                          <div className="modal-body">
                              <center>
                                  <h5>Are you sure you want to add this user?</h5>
                                  <button type="button" className="btn btn-primary" onClick={this.addUser} id="confirmAddUser">YES</button>&nbsp;
                                  <button type="button" className="btn btn-default" data-dismiss="modal" id="confirmAddUser">NO</button>
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
                              <h4><strong>Successfully Added User. Please check your email for verification.</strong></h4>
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
          <div className="wrapper">
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
