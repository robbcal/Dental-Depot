var Content = React.createClass({
  login: function(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if(email && password){
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        var uid = firebase.auth().currentUser.uid;
        //alert("Success");
        firebase.database().ref('/users/'+uid).once('value').then(function(snapshot) {
          var type = snapshot.val().user_type
          if(type == "admin"){
            window.location.replace("admin/Inventory.html");
          }else if(type == "user"){
            window.location.replace("user/Items.html");
          }
        });
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("errorMessage").innerHTML= errorMessage;
        $('#errorModal').appendTo("body").modal('show');
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      });
    }else{
      //alert("Input required data!");
      document.getElementById("errorMessage").innerHTML= "Input required data";
      $('#errorModal').appendTo("body").modal('show');
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
      {/* <div className="se-pre-con" disabled></div> */}
      <div className="login-box" style={{ width: 500}}>
        <div className="login-logo col-lg-12 col-md-12 col-sm-12" style={{ paddingLeft: 50, paddingRight: 10, paddingBottom: 10, marginBottom: 0}}>
          <a href="http://127.0.0.1:8080/">
            <div className="col-lg-6 col-md-6 col-sm-6" style={{ paddingRight: 0, width: 175, paddingLeft: 40}}>
              <img src="bootstrap/icons/tooth.png" style={{ height: 100, marginTop: 80, width: 100}}/>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6" style={{ paddingLeft: 0, paddingRight: 110, right: 0}}>
              <span ><h1 style={{color: '#4b6d9d', marginTop: 90, fontFamily: 'Montserrat',
                fontWeight: 101, fontSize: 39,
                lineHeight: 1.1,
              letterSpacing: 0}}>DENTAL<br/>DEPOT</h1></span>
            </div>
          </a>
        </div>
        <div className="login-box-body" style={{ paddingLeft: 0, paddingRight: 30, backgroundColor: '#d2d6de'}}>
          <div className="form-group has-feedback" style={{marginLeft: 15}}>
            <input required type="email" id="email" className="form-control" placeholder="email address" style={{width: 476.5, height: 39, borderRadius: 7}}/>
          </div>
          <div className="form-group has-feedback" style={{marginLeft: 15}}>
            <input required type="password" id="password" className="form-control" placeholder="password" style={{width: 476.5, height: 39, borderRadius: 7}} />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12" style={{width: 432, paddingLeft: 0, paddingRight: 12}}>
            <center><button className="btn btn-primary col-lg-12 col-md-12 col-sm-12" style={{width: 475, height: 39, borderRadius: 7, left: 15, marginTop: 3}} onClick={this.login}>LOGIN</button></center>
          </div>
          <br/><br/>
        </div>
			</div>

     <div className="example-modal">
        <div className="modal fade bs-example-modal-lg" id="errorModal">
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h5 className="modal-title">Error</h5>
                    </div>
                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

                        <h5><strong id="errorMessage"> Error </strong></h5>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default pull-right" data-dismiss="modal">OK</button>
                        
                    </div>
                </div>
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
        window.location.replace("user/Items.html");
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
