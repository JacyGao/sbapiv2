import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { submitEmail } from '../../actions/login'
import EmailContainer from './email'
import { loadState, saveState } from '../../localStorage'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';

const INVALID_EMAIL_ERROR = "Let’s try that again, the email address you have entered is invalid."

class AuthContainer extends Component{
  state = {
    email: "",
    error: "",
  }
  componentDidMount() {
    let email = loadState("email");
    let token = loadState("token");
    if (email !== undefined && token !== undefined) {
      this.props.history.push("/home");
    }
  }
  componentDidUpdate() {
    const { found } = this.props.store.authEmail;
    switch(found) {
      case 0:
        // redirect to sign up
        saveState("email", this.state.email.toLowerCase());
        this.props.history.push("/signup");
        break;
      case 1:
        // redirect to login
        saveState("email", this.state.email.toLowerCase());
        this.props.history.push("/signin");
        break;
      default:
        break; 
    }
  }
  onSubmit(){
    const { email } = this.state;
    if (email === "" || validateEmail(email) === false) {
      this.setState({
        error: INVALID_EMAIL_ERROR,
      });
      return undefined;
    }  
    this.props.submitEmail(email);
  }
  getView(){
    const { error } = this.state;
    const { loading } = this.props.store.authEmail;
    return (
      <EmailContainer 
        onKeyDown={(e)=>{
          if(e.keyCode === 13){
              this.onSubmit();
            }
        }}
        onChange={(e)=>{
          this.setState({
              email: e.target.value,
              error: "",
        })}}
        onNext={(e)=>{this.onSubmit()}}
        error={error} 
        loading = {loading}
      />
    );
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.header}>
          <p className={classes.logo}>studybox.io</p>
        </div>
        <div className={classes.body}></div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {this.getView()}
          </Grid>
        </Grid>
      </div>
    )
  }
}

function validateEmail(e){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(e);
}
function mapStateToProps(store, props) {
  return {store,props}
}

function mapDispatchToProps(dispatch) {
  return Object.assign({}, bindActionCreators({ submitEmail }, dispatch))
}

const style = theme => ({
  container: {
    marginRight: 'auto',
    marginLeft: 'auto',
    maxWidth: '1024px',
  },
  header: {
    paddingTop: '15px',
    marginBottom: '30px',
    marginLeft: '-3px',
  },
  logo: {
    minHeight: '55px',
    fontSize: '2em',
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#000000',
    marginLeft: '10px',
  },
  body: {
    flexGrow: 1,
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(style)(AuthContainer))