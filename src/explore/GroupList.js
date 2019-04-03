import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, Form, FormGroup, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import axios from 'axios';
import {API_PROXY_URL} from "../Constants";

class GroupList extends Component {
  emptyItem = {
    school:"",
    section:"",
    grade:"",
    student:"",
    groupName:""
  };

  state = {
    loading:true,
    error:"",
    data: [],
    selectedSchool:"", 
    selectedGrade:"", 
    selectedSection:"", 
    schools:[],
    grades:[],
    sections:[]
  }
  constructor(props) {
    super(props);
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.handleSectionChange = this.handleSectionChange.bind(this);
  }
  
    componentDidMount(){
      this.setState({showForm: false, showSchoolForm: true});
      return axios.get(API_PROXY_URL+`/api/v1/school/`)
      .then(result => {
        console.log(result);
        this.setState({
          schools: result.data, error:false});
        }).catch(error => {
        console.error("error", error);
        this.setState({
          error:`${error}`
        });
      });
    }
    handleSchoolChange = (selectedSchool) => {
     // alert("selectedGrade="+selectedSchool.id);
      this.setState({ selectedSchool });
      return axios.get(API_PROXY_URL+`/api/v1/class/school/`+selectedSchool.id)
      .then(result => {
        console.log(result);
        this.setState({
          grades: result.data, error:false});
        }).catch(error => {
        console.error("error", error);
        this.setState({
          error:`${error}`
        });
      });
    }
    handleClassChange = (selectedGrade) => {
     // alert("selectedGrade="+selectedGrade.id);
      this.setState({ selectedGrade });
      return axios.get(API_PROXY_URL+`/api/v1/section/class/`+selectedGrade.id)
      .then(result => {
        console.log(result);
        this.setState({
          sections: result.data, error:false});
        }).catch(error => {
        console.error("error", error);
        this.setState({
          error:`${error}`
        });
      });
    }
    handleSectionChange = (selectedSection) => {
      this.setState({ selectedSection });
      //alert("selectedSection="+selectedSection);
      return axios.get(API_PROXY_URL+`/api/v1/group/section/`+selectedSection.id)
      .then(result => {
        console.log(result);
        this.setState({
          data: result.data,
          error:false,
          showForm: true
        });
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
    document.getElementById("AddGroup").style.display="none";
    this.setState({showForm: false, showSchoolForm: false});
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
    const {error, data, selectedSchool, selectedGrade, selectedSection, schools,grades,sections } = this.state;
    const showHide = {
      'display': this.state.showForm ? 'block' : 'none'
    };
    const showHideSection = {
      'display': this.state.showSchoolForm ? 'block' : 'none'
    };
    if(error){
      return (
          <p>
            There was an error loading the response.. {'  '}
            <Button color="primary" onClick={() => this.viewGroups()}  tag={Link} to="/groups">Try Again</Button>
          </p>
      );
    }
    return ( 
      <div>
          <div className="row float-right">
            <Container>
              <Form>
                  <FormGroup>
                    <Button id="AddGroup"  color="success" onClick={() => this.hideHeader()}  tag={Link} to="/groups/new">Add Group</Button>{'     '}
                  </FormGroup>
              </Form>
          </Container>
        </div>
        <div style={showHideSection}>
              <h2>List Group</h2>
              <Container>
              <Form className="row">
                <FormGroup className="col-md-3 mb-3">
                    <Label for="name" style={{color:'white'}}>School Name</Label>
                    <Select options={schools} name="school" id="school" onChange={this.handleSchoolChange} value={selectedSchool}/>
                </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                    <Label for="grade" style={{color:'white'}}>Class or Grade</Label>
                    <Select options={ grades } name="grade" id="grade" onChange={this.handleClassChange} value={selectedGrade}/>
                </FormGroup>
                <FormGroup className="col-md-3 mb-3">
                    <Label for="section" style={{color:'white'}}>Section</Label>
                    <Select options={ sections } name="section" id="section" onChange={this.handleSectionChange} value={selectedSection}/>
                </FormGroup>
              </Form>  
            </Container>
          </div>                      
          <div style={showHide}>
            <Table className="mt-4 tableStyle">
              <thead>
                <tr>
                  <th className="thStyle" width="10%">Name</th>
                  <th className="thStyle" width="10%">School Name</th>
                  <th className="thStyle" width="10%">Class Name</th>
                  <th className="thStyle" width="10%">Section Name</th>
                  <th className="thStyle" width="10%">Student Name(s)</th>
                  <th className="thStyle" width="20%">Action</th>
                </tr>
              </thead>
              <tbody style={{color: '#dee2e6'}}>
              {data.map(group => (
                <tr key={group.id}>
                  <td className="thStyle" style={{whiteSpace: 'nowrap'}}>{group.label}</td>
                  <td className="thStyle">{group.schoolName}</td>
                  <td className="thStyle">{group.className}</td>
                  <td className="thStyle">{group.sectionName}</td>
                  <td className="thStyle">
                      {group.studentNames.map(student => (
                        <tr>{student}</tr>
                      ))}
                  </td>
                  <td className="thStyle" >
                    <ButtonGroup>
                      <Button size="sm" color="primary" onClick={() => this.hideHeader()} tag={Link} to={"/groups/"+ group.id}>Edit</Button>
                      <Button size="sm" color="danger" onClick={() => this.remove(group.id)} disabled>Delete</Button>
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

export default GroupList;