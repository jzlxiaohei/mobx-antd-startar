
const session = {
  currentUser: {
    id:1,
    avatar:'https://avatars0.githubusercontent.com/u/1884248?v=3&u=1dbe817765c0faaaa0a36021fd9474143650d56a&s=140'
  },//fake data for display user info
  getUser(){
    //TODO you logic for getUser,then set session.currentUser for global use
  },
  redirectToLogin(){
    window.location.href = '/signin';
  },
  signOut(){
    //TODO signOut
    this.redirectToLogin();
  },
  isLogin(){
    return !!this.currentUser;
  }
};

export default session;