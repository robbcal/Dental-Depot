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
                    {/* comment */}
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
                        <li className="active"><a href="Inventory.html"><i><img src="../bootstrap/icons/boxes.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Inventory</span></a></li>
                        <li><a href="Users.html"><i><img src="../bootstrap/icons/multiple-users-silhouette.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Users</span></a></li>
                        <li><a href="Logs.html"><i><img src="../bootstrap/icons/graph-line-screen.png" id="sidebarImage"/></i><span id="sidebarMainTabs">Logs</span></a></li>
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
  getInitialState: function() {
      return { 
       itemName: "null",
itemDescription: "null", 
      itemPrice: "null", 
      itemStock: "null", 
  latestHistory: "null"
      };
  },

  componentWillMount: function(){
    console.log(itemID);
    const self = this;
    var uid = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('items/'+itemID);
    ref.on('value', function(snapshot) {
      self.setState({
         itemName: snapshot.val().item_name,
  itemDescription: snapshot.val().description, 
        itemPrice: snapshot.val().price, 
        itemStock: snapshot.val().stock 
      });
    });
  },

  render: function() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{position: 'relative', top: '30px', left: '40px', width: '1000px'}}>
          <div className="row">
            <a href="Inventory.html" className="pull-left"><img src="../bootstrap/icons/left-arrow.png" height="25px"/></a>
            <div className="pull-right">
              <a className="btn btn-primary" id="addItemButton" href="" data-toggle="modal" data-target="#editInfoModal" onClick={this.showModal}>ADD</a>&nbsp;
              <a className="btn btn-primary" id="editItemButton" href="" data-toggle="modal" data-target="#editInfoModal" onClick={this.showModal}>EDIT</a>&nbsp;
              <button className="btn btn-primary" id="deleteItemButton">DELETE</button>          
            </div>        
          </div>

          <div className="row" style={{position: 'relative', top: '15px', height: '425px', backgroundColor:'white'}}>
            <label>{this.state.itemName}</label><br/>
            <label>{this.state.itemDescription}</label><br/>
            <label>{this.state.itemPrice}</label><br/>
            <label>{this.state.itemStock}</label><br/>
            <label>Item Latest History</label><br/>
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
