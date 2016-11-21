var Content = React.createClass({
  componentDidMount: function(){
    $(document).ready(function () {
      (function ($) {
        $("#password").keyup(function(event){
          if(event.keyCode == 13){
            event.preventDefault();
            $("#loginButton").trigger('click');
          }
        });
      }(jQuery));
    });
  },

  login: function(){
    var email = document.getElementById("email").value;
    var password = btoa(document.getElementById("password").value);
    if(email && password){
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
          var type = snapshot.val().user_type
          if(type == "admin"){
            window.location.replace("admin/Inventory.html");
          }else if(type == "user"){
            window.location.replace("user/Inventory.html");
          }
        });
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("errorAlert").innerHTML= errorMessage;
        $('#errorBox').show();
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      });
    }else{
      document.getElementById("errorAlert").innerHTML= "Input required data";
      $('#errorBox').show();
    }
  },

  reset: function(){
    var auth = firebase.auth();
    var emailAddress = document.getElementById("fg_email").value;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
      alert("Email sent.");
      document.getElementById("fg_email").value = "";
      $('#forgotPassModal').modal('hide');
    }, function(error) {
      alert(error);
    });
  },

  render: function() {
    return (
    <div>
        <div className="login-box" id="loginBox">
            <div className="login-logo col-lg-12 col-md-12 col-sm-12" id="loginLogo">
                <a href="http://127.0.0.1:8080/">
                    <div className="col-lg-6 col-md-6 col-sm-6" id="toothImgHolder">
                        <img src="bootstrap/icons/tooth.png" id="toothImg"/>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6" id="projectNameHolder">
                        <span><h1 id="dentalDepotIndex1">DENTAL</h1></span>
                        <span><h1 id="dentalDepotIndex2">DEPOT</h1></span>
                    </div>
                </a>
            </div>
            <div className="login-box-body" id="loginBoxBody">
                <div className="form-group has-feedback" id="formGroup">
                    <input type="email" id="email" className="form-control" placeholder="email address"/>
                </div>
                <div className="form-group has-feedback" id="formGroup">
                    <input type="password" id="password" className="form-control" placeholder="password"/>
                </div>
                <div className="col-sm-12" id="loginSubmit">
                    <center><button className="btn btn-primary col-sm-12" id="loginButton" onClick={this.login}>
                        LOGIN
                    </button></center>
                </div>
                <br/><br/>
            </div>
            <div className="col-sm-12 col-lg-12 col-md-12">
                <div className="alert alert-danger alert-dismissible col-sm-12" style={{display:'none'}} id="errorBox">
                    <h4><i className="icon fa fa-ban"></i>Error</h4>
                    <h6 id="errorAlert"></h6>
                </div>
            </div>
        </div>
    </div>
    );
  }
});

var Main = React.createClass({
  getInitialState: function() {
    return { signedIn: false, type: 0, res : null};
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
      }
    }, function(error) {
      console.log(error);
    });
  },

  render: function() {
    var res;
    if(this.state.signedIn == false){
      res = (
        <div>
            <Content/>
        </div>
      );
    }else{
      res = (
        <div>
            <div className="se-pre-con"></div>
        </div>
      );
      if(this.state.type == "admin"){
        window.location.replace("admin/Inventory.html");
      }else if(this.state.type == "user"){
        window.location.replace("user/Inventory.html");
      }
    }
    return(
      res
    );
  }
});

ReactDOM.render(
  <Main/>,
  document.getElementById('main')
);
