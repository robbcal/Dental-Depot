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
            <span className="logo-lg"><b>Dental Depot</b></span>
          </div>
          <div className="navbar navbar-static-top" role="navigation">
            <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
              <span className="sr-only">Toggle navigation</span>
            </a>
            <div className="navbar-custom-menu">
              <ul className="nav navbar-nav">
                <li className="dropdown user user-menu">
                  <a href="#" className="dropdown-toggle profile" data-toggle="dropdown">
                    <span><img className="profileDropdown" src="../bootstrap/icons/tooth.png"/></span>
                  </a>
                  <ul className="dropdown-menu" style={{width:'100px'}}>
                    <li className="user-body">
                      <div className="profileButton">
                        <button className="btn btn-default btn-flat" data-toggle="modal" data-target="#profileModal" style={{width:'100px'}}>PROFILE</button>
                      </div>
                      <div className="logoutButton">
                        <button className="btn btn-default btn-flat" onClick={this.logout} style={{width:'100px'}}>LOGOUT</button>
                      </div>
                    </li>
                  </ul>
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
              <li className="header">NAVIGATION</li>
              <li><a href="Inventory.html"><i><img src="../bootstrap/icons/boxes.png" height="15px"/></i><span> Inventory</span></a></li>
              <li className="active"><a href="Users.html"><i><img src="../bootstrap/icons/multiple-users-silhouette.png" height="15px"/></i><span> Users</span></a></li>
              <li><a href="Logs.html"><i><img src="../bootstrap/icons/graph-line-screen.png" height="15px"/></i><span> Logs</span></a></li>
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
  mixins: [ReactFireMixin],

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
  },

  addUser: function(){
    var cur_email = firebase.auth().currentUser.email;
    var cur_password = this.state.cur_password
   
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var address = document.getElementById("address").value;
    var contactNumber = document.getElementById("contactNumber").value;
    var age = document.getElementById("age").value;
    var birthdate = document.getElementById("birthdate").value;
    var userType = document.getElementById("userType").value;
    var password = "123456";

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
        alert("User Added");
        $('#addUserModal').modal('hide');
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
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode+" : "+errorMessage);
    });
  },

  viewSpecificUser: function(){
    alert("hilo");
  },

  render: function() {
    var viewUser = function() {
      var ref = firebase.database().ref('users');
      ref.on('child_added', function(data) {
        var uid=data.key
        var firstName = data.val().firstname;
        var lastName = data.val().lastname;
        var email = data.val().user_email;
        var address = data.val().address;
        var contactNumber = data.val().contact_no;
        var age = data.val().age;
        var birthdate = data.val().birthday;
        var userType = data.val().user_type;

        $("#userList").append("<tr onclick='viewSpecificUser()'><td>"+firstName+" "+lastName+"</td><td>"+email+"</td><td>"+userType+"</td></tr>");
      });
    };
    return (
      <div>
        <br/><br/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12">  
            <span className="pull-left">
              <input type="text" id="userSearch" /*className="searchBox"*//>
                <button id="userSearchButton"><img src="../bootstrap/icons/search.png" height="15px"/></button>
              </span>
            <span className="pull-right">
              <a className="btn btn-primary" id="addUserButton" href="" data-toggle="modal" data-target="#addUserModal">ADD USER</a>
            </span>
          </div>
          <br/><br/>
          <div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12">    
            <table className="table table-hover table-striped table-bordered /*adminTable*/">
              <thead>
                <tr>
                  <th><center>USERNAME</center></th>
                  <th><center>EMAIL ADDRESS</center></th>
                  <th><center>USER TYPE</center></th>
                </tr>
              </thead>
              <tbody id="userList">
                <tr onClick={this.viewSpecificUser}>
                  <td>sample</td>
                  <td>sample</td>
                  <td>sample</td>
                </tr>
                <tr onClick={this.viewSpecificUser}>
                  <td>sample</td>
                  <td>sample</td>
                  <td>sample</td>
                </tr>
                {viewUser()}
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
                  <h4 className="modal-title">ADD USER</h4>
                </div>
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>First Name</label>
                      <input type="text" id="firstName" className="form-control"/>
                    </span>
                    <span>
                      <label>Last Name</label>
                      <input type="text" id="lastName" className="form-control"/>
                    </span>
                    <span>
                      <label>Email</label>
                      <input type="email" id="email" className="form-control"/>
                    </span>
                    <span>
                      <label>Address</label>
                      <input type="text" id="address" className="form-control"/>
                    </span>
                    <span>
                      <label>Contact Number</label>
                      <input type="text" id="contactNumber" className="form-control"/>
                    </span>
                    <span>
                      <label>Age</label>
                      <input type="number" id="age" className="form-control"/>
                    </span>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>
                      <label>Birthdate</label>
                      <input type="date" id="birthdate" className="form-control"/>
                    </span>
                    <span>
                      <label>User Type</label>
                      <select id="userType" className="form-control">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </span>
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