import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { submitForm } from '../../actions/signup'
import { loadState, saveState } from '../../localStorage'
import FormContainer from './form'
import VerifyContainer from './verify'

const INVALID_EMAIL_ERROR = "Let’s try that again, the email address you have entered is invalid."
const INVALID_PASSWORD_ERROR = "Let’s try that again, the password you have entered is invalid."
const EMAIL_FOUND_ERROR = "The email you have entered has already been registered."
const INVALID_CODE_ERROR = "The activation code you have enterred is invalid."
const VIEW_FORM = 0;
const VIEW_CODE = 1;

class Signup extends Component{
  state = {
    email: "",
    password: "",
    error: "",
    view: VIEW_FORM,
  }
  componentDidMount() {
    if(loadState()) {
      if(typeof(loadState().email)!="undefined" && 
        typeof(loadState().token)!="undefined"){
        //this.props.setView("home");
      }
    }
  }
  componentDidUpdate() {
    console.log(this.props);
    if(this.state.view === VIEW_FORM){
      const { response, error } = this.props.store.newSignup;
      if (response !== null) {
        this.setState({
          email: "",
          password: "",
          error: "",
          view: VIEW_CODE,
        })
        return undefined;
      }
      if (error !== "" && this.state.error === "") {
        this.setState({
          error: EMAIL_FOUND_ERROR,
        })
        return undefined;
      }
    }
    if(this.state.view === VIEW_CODE){
      const { email, token, error } = this.props.store.verifyUser;
      if(email === "" || token === "" || error !== "") {
        this.setState({
          error: INVALID_CODE_ERROR,
        })
        return undefined;
      }
      saveState({
        "email": this.props.store.authEmail.email,
        "token": token
      });
      this.props.history.push("/home");
    }
  }
  onSubmitForm(){
    const { email, password } = this.state;
    console.log(email);
    if (email === "" || validateEmail(email) === false) {
      this.setState({
        error: INVALID_EMAIL_ERROR,
      })
      return undefined;
    }
    // TODO: password validation
    if (password === "") {
      this.setState({
        error: INVALID_PASSWORD_ERROR,
      })
      return undefined;
    }
    submitForm(email, password);
  }
  onSubmitCode(code){
    if (code === "") {
      this.setState({
        error: INVALID_CODE_ERROR,
      })
      return undefined;
    }
    this.props.submitCode(code);
  }
  getFormView(){
    return (
      <FormContainer 
        onKeyDown={(e)=>{this.onSubmitForm()}}
        onTypingEmail={(e)=>{
          this.setState({
              email: e.target.value,
        })}}
        onTypingPassword={(e)=>{
            this.setState({
                password: e.target.value,
            })
            return undefined;
        }}
        onSubmit={(e)=>{this.onSubmitForm()}}
        error={this.state.error} />
    )
  }
  getCodeView(){
    return (
      <VerifyContainer
        onKeyDown={(e)=>{this.onSubmitCode(e.target.value)}}
        onChange={(e)=>{
          this.setState({
            error: "",
          })
        }}
        onNext={(e)=>{this.onSubmitCode(e.target.value)}}
        error={this.state.error}
      />
    )
  }
  render() {
    const { view } = this.state;
    return (
      <div className="step-1">
        <p className="text-header">studybox.io</p>
          {view === VIEW_CODE ? this.getCodeView() : this.getFormView()}
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
  return Object.assign({}, bindActionCreators({ submitForm }, dispatch))
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup)