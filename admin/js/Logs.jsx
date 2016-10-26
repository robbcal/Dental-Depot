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
                    <li><a href="Users.html"><i><img src="../bootstrap/icons/multiple-users-silhouette.png" height="15px"/></i><span> Users</span></a></li>
                    <li className="active"><a href="Logs.html"><i><img src="../bootstrap/icons/graph-line-screen.png" height="15px"/></i><span> Logs</span></a></li>
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