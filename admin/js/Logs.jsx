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
                          <div className="navbar-custom-menu">
                              <ul className="nav navbar-nav">
                                  <li className="dropdown user user-menu">
                                      <a href="#" className="btn btn-default" data-toggle="modal" data-target="#confirmModal" style={{borderWidth: 0, lineHeight: 0, color: "rgba(255, 255, 255, 0.15)", top: 3, right: 5}} onClick={this.showConfirmLogout}>
                                  <span><img style={{top: 5, right: 15}} className="profileDropdown" src="../bootstrap/icons/tooth.png"/></span>
                                </a>
                                <div className="example-modal">
                                  <div className="modal" id="confirmModal">
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">x</span>
                                          </button>
                                          <h4 className="modal-title">Log-out</h4>
                                        </div>
                                        <div className="modal-body">
                                          <center><p> Are you sure you want to log-out?</p></center>
                                        </div>
                                        <div className="modal-footer">
                                          <button type="button" className="btn btn-default pull-left" data-dismiss="modal" aria-label="No">NO</button>
                                          <button type="button" className="btn btn-primary" data-dismiss="modal" aria-label="No" onClick={this.logout}>YES</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
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
                              <li><a href="Inventory.html"><i><img src="../bootstrap/icons/boxes.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Inventory</span></a></li>
                              <li><a href="Users.html"><i><img src="../bootstrap/icons/multiple-users-silhouette.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Users</span></a></li>
                              <li className="active"><a href="Logs.html"><i><img src="../bootstrap/icons/graph-line-screen.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Logs</span></a></li>
                              <li><a href="AdminProfile.html"><i className="fa fa-user" id="sidebarImage"></i><span id="sidebarProfileTab">Profile</span></a></li>
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
        render: function() {
          return (
            <div>
                <h1>LOGSSSSSSSSSSSSSs</h1>
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
