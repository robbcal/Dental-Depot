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
                              <li className="active"><a href="Items.html"><i><img src="../bootstrap/icons/boxes.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Inventory</span></a></li>
                              <li><a href="Profile.html"><i><img src="../bootstrap/icons/graph-line-screen.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Profile</span></a></li>
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
                <h1>ITEMS</h1>
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
