import React, { Component, Fragment } from 'react';
import './App.css';
import EnhancedTable from './components/Table';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { CSVLink, CSVDownload } from "react-csv";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      users: null,
      allUsers: null,
      addData: false,
      email: null,
      phone: null,
      wrongData: false,
      id: null,
      searchValue: null
    }

    this.getUsers = this.getUsers.bind(this);
    this.postData = this.postData.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.setSortedData = this.setSortedData.bind(this);
  }

  async componentDidMount(){
    //Call our fetch function below once the component mounts
    try{
      console.log('componentDidMount - getting Data');
      const users = await this.getUsers();
      this.setState({ users : users, allUsers: users });
    }
    catch(e){
      throw Error(e);
    }
  }

  async getUsers(){
    console.log('getUsers')
    const response = await fetch('/api/users'); 
    const body = await response.json();
    console.log('users response', body)
    if (response.status !== 200) {
      throw Error(body.message)
    }

    return body;
  }

  async postData() {
    console.log('postData', this.state.phone, this.state.email)
    const response = await fetch(`/api/users?id=${this.state.id}`, {
      method: 'POST',
      // mode: 'no-cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({ phone: this.state.phone, email: this.state.email })
    });
    const body = await response.status;
    if(response.status === 200){
      const updatedUsers = this.state.users.map(user => {
        if(user._id === this.state.id){
          console.log('Found user', user, this.state.phone, this.state.email)
          if(this.state.phone){
            user.phone = this.state.phone;
          }
          if(this.state.email){
            user.email = this.state.email;
          }
        }
        return user;
      });

      console.log('upadtedUsers', updatedUsers);

      const updatedAllUsers = this.state.allUsers.map(user => {
        if(user._id === this.state.id){
          if (this.state.phone) {
            user.phone = this.state.phone;
          }
          if (this.state.email) {
            user.email = this.state.email;
          }
        }
        return user;
      });

      console.log('updatedAllusers', updatedAllUsers)

      this.setState({ users: updatedUsers, allUsers: updatedAllUsers, phone: null, email: null });
    }
    console.log('users response', body)
    // if (response.status !== 200) {
    //   throw Error(body.message)
    // }
    // return body;
  }

  handleClick(id){
    console.log('handleClick passed id back up', id);
    this.setState({addData: true, id: id})
  }

  handleNameChange(event){
    console.log('handleNameChange', event.target.value)
    this.setState({
      phone: event.target.value,
    });
  }

  handleEmailChange(event){
    console.log('handlePhoneChange', event.target.value)
    this.setState({
      email: event.target.value,
    });
  }

  handleSubmit(event){
    console.log('handleSubmit');
    event.preventDefault();

    console.log('submitting to API', );
    if(this.state.phone && !this.state.phone.match(/\d/g).length === 10){
      this.setState({ wrongData: true});
    }
    else if(this.state.email && !this.state.email.includes('@')){
      this.setState({ wrongData: true});
    }
    else{
      const data = this.postData();
      this.setState({ addData: false });
    }
  }

  handleSearch(event){
    console.log('handleSearch', event.target.value);
    this.setState({ searchValue: event.target.value });
    const filteredUsers = this.state.allUsers.filter( user => user.login.toLowerCase().includes(event.target.value));
    console.log('filteredUsers = ', filteredUsers);
    this.setState({ users: filteredUsers });
    console.log('finished setting new users')
  }

  setSortedData(data){
    this.setState({ data });
  }

  render() {
    const { classes } = this.props;
    console.log('this.state.users', this.state.users);
    return (
      <div className="App">
        {this.state.users && !this.state.addData &&
          <Fragment>
            <TextField
              id="standard-name"
              label="Search Users"
              className={classes.textField}
              value={this.state.searchValue}
              onChange={(event) => { this.handleSearch(event) }}
              margin="normal"
            />
            <CSVLink data={this.state.users}>Download me</CSVLink>
            <EnhancedTable
              data={this.state.users}
              handleClick={this.handleClick}
              setSortedData={this.setSortedData}
            />
          </Fragment>
        }
        {this.state.addData &&
        <div>
          {this.state.wrongData && 
            <div>
              Submission does not have correct data format. Phone number must be 10 digit number. Email must be a string with '@'
            </div>
          }
        <form onSubmit={this.handleSubmit} >
          <TextField
            id="standard-name"
            label="Phone Number"
            className={classes.textField}
            value={this.state.phone ? this.state.phone : ''}
            onChange={(event) => {this.handleNameChange(event)}}
            margin="normal"
          />
          <TextField
            id="standard-name"
            label="Email"
            className={classes.textField}
            value={this.state.email ? this.state.email : ''}
            onChange={(event) => {this.handleEmailChange(event)}}
            margin="normal"
            type = {'email'}
          />
          <Button variant='contained' className={classes.button} type='submit' >
            Add Info
          </Button>
        </form>
        </div>
        }
        { !this.state.users && <CircularProgress className={classes.progress} />}
      </div>
    );
  }
}

export default withStyles(styles)(App);
