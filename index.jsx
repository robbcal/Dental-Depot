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
          var type = snapshot.val().user_type;
          var isDeleted = snapshot.val().isDeleted;

          if(isDeleted == false){
            try {
              if(type == "admin"){
                window.location.replace("admin/Inventory.html");
              }else if(type == "user"){
                window.location.replace("user/Inventory.html");
              }
            } catch(e) {
              var email = firebase.auth().currentUser.email;
              firebase.auth().currentUser.delete().then(function() {
                document.getElementById("errorAlert").innerHTML= "This action confirms the deletion of the account of "+email+".";
                $('#errorBox').show();
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
              }, function(error) {
                console.log(error);
              });
            }
          }else if(isDeleted == true){
            firebase.auth().signOut().then(function() {
              window.location.replace("http://127.0.0.1:8080/");
            }, function(error) {
              console.log(error);
            });
            alert("This account has been recently deleted");
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

  resetPassword: function(){
    var emailAddress = document.getElementById("fEmail").value;

    firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
      $('#forgetPassModal').modal('hide');
      $('#informSuccessAddExisting').appendTo("body").modal('show');
      setTimeout(function() { $("#informSuccessAddExisting").modal('hide'); }, 1000);
    }, function(error) {
      $('#forgetPassModal').modal('hide');
      document.getElementById("errorAlert").innerHTML= error;
      $('#errorBox').show();
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
                    <input type="email" id="email" className="form-control" placeholder="email address" maxLength="50"/>
                </div>
                <div className="form-group has-feedback" id="formGroup">
                    <input type="password" id="password" className="form-control" placeholder="password" maxLength="50"/>
                </div>
                <div className="col-sm-12" id="loginSubmit">
                    <center><button className="btn btn-primary col-sm-12" id="loginButton" onClick={this.login}>
                        LOGIN
                    </button></center>
                </div>
                <br/><br/><br/>
                <div>
                  <center><a id="forgotPassword" href="#" data-toggle="modal" data-target="#forgetPassModal" style={{color: 'red'}}>Forgot password?</a></center>
                </div>

                <div className="modal fade bs-example-modal-sm" id="forgetPassModal">
                  <div className="modal-dialog modal-sm">
                      <div className="modal-content">
                          <div className="modal-header">
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                              <h4 className="modal-title">Forgot Password?</h4>
                          </div>
                          <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div>
                                      <label>An email will be sent to your email address.</label>
                                  </div>
                                  <div>
                                      <input type="email" id="fEmail" className="form-control" placeholder="Email" maxLength="50"/>
                                  </div>
                              </div>
                          </div>
                          <div className="modal-footer">
                              <button type="button" className="btn btn-primary" onClick={this.resetPassword}>SUBMIT</button>
                          </div>
                      </div>
                  </div>
                </div>

                <div className="modal fade modal-success" id="informSuccessAddExisting">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <center>
                                    <h4><strong>Email sent.</strong></h4>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>

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

  componentDidMount: function(){
    const self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
          try {
            self.setState({ signedIn: true, type: snapshot.val().user_type });
            if(user.emailVerified) {
              firebase.database().ref('users/'+uid).update({
                status:"Verified"
              });
            }  
          } catch(e) {
            var email = firebase.auth().currentUser.email;
            firebase.auth().currentUser.delete().then(function() {
              document.getElementById("errorAlert").innerHTML= "This "+email+" account has been recently deleted.";
              $('#errorBox').show();
              document.getElementById("email").value = "";
              document.getElementById("password").value = "";
            }, function(error) {
            });
          }
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
