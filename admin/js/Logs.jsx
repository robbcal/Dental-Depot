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
                          <span className="logo-mini"><b>DD</b></span>
                          <span className="logo-lg" id="mainHeader">Dental Depot</span>
                      </div>
                      <div className="navbar navbar-static-top" role="navigation">
                          <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                              <span className="sr-only">Toggle navigation</span>
                          </a>
                          <div className="navbar-custom-menu">
                              <ul className="nav navbar-nav">
                                  <li className="dropdown user user-menu">
                                      <a href="#"><span onClick={this.logout}>
                                          <img className="profileDropdown" src="../bootstrap/icons/tooth.png" data-toggle="tooltip" title="Logout" data-placement="bottom"/>
                                      </span></a>
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
                              <li><a href="Inventory.html"><i className="fa fa-archive" id="sidebarImage"></i><span>Inventory</span></a></li>
                              <li><a href="Users.html"><i className="fa fa-users" id="sidebarImage"></i><span>Users</span></a></li>
                              <li className="active"><a href="Logs.html"><i className="fa fa-line-chart" id="sidebarImage"></i><span>Logs</span></a></li>
                              <li><a href="Profile.html"><i className="fa fa-user" id="sidebarImage"></i><span>Profile</span></a></li>
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
              <div id="mainContent">
                <div className="nav-tabs-custom">
                  <ul className="nav nav-tabs">
                    <li><a href="#sales" data-toggle="tab">SALES</a></li>
                    <li className="active"><a href="#transaction" data-toggle="tab">TRANSACTION</a></li>
                    <li><a href="#activity" data-toggle="tab">ACTIVITY</a></li>
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane" id="sales">

                    </div>
                    <div className="active tab-pane" id="transaction">
                      <div className="row">
                        <div className="col-sm-6 pull-right">
                          <div className="box-tools pull-right">
                            <div className="input-group input-group-sm" id="logsTransSearch">
                              <input type="text" name="table_search" className="form-control pull-right" placeholder="Search"/>
                              <div className="input-group-btn">
                                <button type="submit" className="btn btn-default">
                                  <i className="fa fa-search"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="box-body">
                            <table id="example1" className="table table-bordered table-striped striped dataTable">
                              <thead>
                                <tr>
                                  <th><center>TRANSACTION ID</center></th>
                                  <th><center>TOTAL</center></th>
                                  <th><center>DATE</center></th>
                                  <th><center>USER</center></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Trident</td>
                                  <td>Win 95+</td>
                                  <td> 4</td>
                                  <td>X</td>
                                </tr>
                                <tr>
                                  <td>Trident</td>
                                  <td>Win 95+</td>
                                  <td> 4</td>
                                  <td>X</td>
                                </tr>
                                <tr>
                                  <td>Trident</td>
                                  <td>Win 95+</td>
                                  <td> 4</td>
                                  <td>X</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="row" id="logsRowThree">
                        <div className="col-sm-5">
                          <div className="dataTables_info" id="example2_info" role="status" aria-live="polite">
                            Showing 1 to 10 of 57 entries
                          </div>
                        </div>
                        <div className="col-sm-7">
                          <div className="dataTables_paginate paging_simple_numbers pull-right" id="logsTransPagination">
                            <ul className="pagination">
                              <li className="paginate_button previous disabled">
                                <a href="#" aria-controls="example2" data-dt-idx="0" tabindex="0">Previous</a>
                              </li>
                              <li className="paginate_button active">
                                <a href="#" aria-controls="example2" data-dt-idx="1" tabindex="0">1</a>
                              </li>
                              <li className="paginate_button">
                                <a href="#" aria-controls="example2" data-dt-idx="2" tabindex="0">2</a>
                              </li>
                              <li className="paginate_button next">
                                <a href="#" aria-controls="example2" data-dt-idx="2" tabindex="0">Next</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane" id="activity">

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
