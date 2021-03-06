import React, { Component } from 'react';
import { Navbar, NavbarBrand, ButtonDropdown, DropdownToggle, DropdownMenu, 
        DropdownItem, Form, Input, FormGroup, Button } from 'reactstrap'; 

class CustomDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      userName: '',
      password: ''
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleUserName = this.handleUserName.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  toggleDropDown() {
    this.setState(state => ({
      dropdownOpen: !state.dropdownOpen
    }));
  }

  async logIn() {
    this.setState({dropdownOpen: false});
    await this.props.loginUser({
                          username: this.state.userName,
                          password: this.state.password
                        });
    this.props.fetchLikedIdeas();
    this.props.fetchFlaggedIdeas();
  }

  async signUp() {
    this.setState({signUpModal: false});
    await this.props.signUpUser({
                          username: this.state.userName,
                          password: this.state.password
                          });
    await this.props.loginUser({
                          username: this.state.userName,
                          password: this.state.password
                        });
    this.props.fetchIdeas();
  }

  logOut() {
    this.props.logoutUser();
    this.setState({dropdownOpen: false});
  }

  handleUserName(e) {
    this.setState({userName: e.target.value})
  }

  handlePassword(e) {
    this.setState({password: e.target.value})
  }
  
  render() {
    return(
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
        <DropdownToggle caret>
          {this.props.auth.isAuthenticated ? this.props.auth.user.username : 'Sign Up / Log In'}
        </DropdownToggle>
        <DropdownMenu right={true} className="mt-2">
          {this.props.auth.isAuthenticated ?
            <Form>
              <FormGroup>
                <Button 
                  className="mx-auto my-auto"
                  outline={true}
                  onClick={this.logOut}
                >
                  Log Out
                </Button>
              </FormGroup>
            </Form>
          :
            <React.Fragment>
              <Form className="px-3 py-3">
                <FormGroup>
                  <Input 
                    type="text"
                    value={this.state.userName}
                    onChange={this.handleUserName}
                    placeholder="Username"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    value={this.state.password}
                    onChange={this.handlePassword}
                    placeholder="Password" 
                  />
                </FormGroup>
                <Button 
                  outline={true}
                  onClick={this.logIn}
                >
                  Log In
                </Button>
              </Form>
              <DropdownItem divider />
              <DropdownItem color="secondary" onClick={this.signUp}>Sign up</DropdownItem>
              <DropdownItem>Forgot password?</DropdownItem>
            </React.Fragment>
          } 
        </DropdownMenu>
      </ButtonDropdown>
    );
  } 
}

export default class Header extends Component {

  render() {
    return (
      <div>
        <Navbar color="faded" light>
          <NavbarBrand href="/">Not My Idea</NavbarBrand>
          <CustomDropDown
            auth={this.props.auth}
            fetchIdeas={this.props.fetchIdeas}
            fetchLikedIdeas={this.props.fetchLikedIdeas}
            fetchFlaggedIdeas={this.props.fetchFlaggedIdeas}
            signUpUser={this.props.signUpUser}
            loginUser={this.props.loginUser}
            logoutUser={this.props.logoutUser}
            toggleSignUpModal={this.toggleSignUpModal}
          />
        </Navbar>
      </div>
    );
  }
}

