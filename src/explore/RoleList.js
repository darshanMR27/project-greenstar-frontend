import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, Form, FormGroup} from 'reactstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import axios from 'axios';
import {API_PROXY_URL} from "../Constants";

class RoleList extends Component {
  emptyItem = {
    roleName:""
  };

  state = {
    loading:true,
    error:"",
    data: [],
  }
    componentDidMount(){
      this.setState({showForm: true});
      return axios.get(API_PROXY_URL+`/api/v1/roles/all`)
      .then(result => {
        console.log(result);
        this.setState({
          data: result.data, error:false});
        }).catch(error => {
        console.error("error", error);
        this.setState({
          error:`${error}`
        });
      });
    }
    

  viewGroups = async () => {
    this.setState({showForm: true});
  }
  
  hideHeader = async () => {
    document.getElementById("AddRole").style.display="none";
    this.setState({showForm: false});
    this.setState({groupName:""});
    //this.props.history.push('/groups');
  }

  // async remove(id) {
  //   await fetch(`/api/group/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(() => {
  //     let updatedGroups = [...this.state.groups].filter(i => i.id !== id);
  //     this.setState({groups: updatedGroups});
  //   });
  // }

  render() {
    const {error, data} = this.state;
    const showHide = {
      'display': this.state.showForm ? 'block' : 'none'
    };
    if(error){
      return (
          <p>
            There was an error loading the response.. {'  '}
            <Button  color="primary" onClick={() => this.viewGroups()}  tag={Link} to="/groups">Try Again</Button>
          </p>
      );
    }
    return ( 
      <div>
          <div className="row float-right">
            <Container>
              <Form>
                  <FormGroup>
                    <Button id="AddRole" color="success" onClick={() => this.hideHeader()}  tag={Link} to="/roles/new">Add Role</Button>{'     '}
                  </FormGroup>
              </Form>
          </Container>
          </div>
          <div style={showHide}>
                <h2>List Roles</h2>                        
                <Table className="mt-4 tableStyle">
                  <thead>
                    <tr>
                      <th className="thStyle" width="10%">Role Name</th>
                      <th className="thStyle" width="10%">Privilages</th>
                      <th className="thStyle" width="10%">Action</th>
                    </tr>
                  </thead>
                  <tbody style={{color: '#dee2e6'}}>
                  {data.map(role => (
                    <tr key={role.id}>
                      <td className="thStyle" style={{whiteSpace: 'nowrap'}}>{role.label}</td>
                      {role.privilages.map(privilage => (
                        <tr>{privilage.label}</tr>
                      ))}
                      <td className="thStyle">
                        <ButtonGroup>
                          <Button size="sm" color="primary" onClick={() => this.hideHeader()} tag={Link} to={"/roles/"+ role.label}>Edit</Button>
                          <Button size="sm" color="danger" disabled>Delete</Button>
                        </ButtonGroup>
                      </td>
                    </tr> ))}
                  </tbody>
                </Table>
                </div>
      </div>
    );
  }
}

export default RoleList;