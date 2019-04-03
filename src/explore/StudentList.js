import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, Form, FormGroup, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import axios from 'axios';
import {API_PROXY_URL} from "../Constants";

class StudentList extends Component {
  constructor(props) {
    super(props);
  this.state = {
    school:"",
    section:"",
    grade:"",
    student:"",
    group:"",
      students: [],
      showForm: false,
    schools : [],
    grades : [],
    sections : [],
    groups : [],
    selectedItems: []
  };
  this.handleSchoolChange = this.handleSchoolChange.bind(this);
  this.handleClassChange = this.handleClassChange.bind(this);
  this.handleSectionChange = this.handleSectionChange.bind(this);
  //this.handleGroupChange = this.handleGroupChange.bind(this);
  //this.remove = this.remove.bind(this);
  //this.onSubmit = this.onSubmit.bind(this);
}

componentDidMount(){
  this.setState({showForm: false, showStudentForm: true});
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
//        alert("selectedGrade="+selectedSchool.id);
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
  handleSectionChange = (selectedSec) => {
    this.setState({ selectedSec });
    //alert("selectedSection="+selectedSection);
    return axios.get(API_PROXY_URL+`/api/v1/student/section/`+selectedSec.id)
    .then(result => {
      console.log(result);
      this.setState({
        students: result.data,
        loading:false,
        error:false,
        showForm: true
      });
    }).catch(error => {
      console.error("error", error);
      this.setState({
        error:`${error}`,
        loading:false
      });
    });
  }

  viewGroups = async () => {
    this.setState({showForm: true});
  }
  
  hideHeader = async () => {
    document.getElementById("AddStudent").style.display="none";
    this.setState({showForm: false, showStudentForm: false});
  }

  // async remove(id) {
  //   await fetch(`/api/student/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(() => {
  //     let updatedStudents = [...this.state.students].filter(i => i.id !== id);
  //     this.setState({students: updatedStudents});
  //   });
  // }

  render() {
    const {selectedSchool, selectedGrade, selectedSection,schools,grades,sections, students } = this.state;
    const showHide = {
      'display': this.state.showForm ? 'block' : 'none'
    };
    const showHideStudent = {
      'display': this.state.showStudentForm ? 'block' : 'none'
    };
    return (
      <div>
          <div className="row float-right">
            <Container>
              <Form>
                  <FormGroup>
                    <Button id="AddStudent" color="success" onClick={() => this.hideHeader()}  tag={Link} to="/students/new">Add Student</Button>{'     '}
                  </FormGroup>
              </Form>
          </Container>
        </div>
            <div style={showHideStudent}>
                    <h2>List Student</h2>
                    <Container>
                      <Form className="row">
                        <FormGroup className="col-md-3 mb-3">
                          <Label for="name" style={{color:'white'}}>School Name</Label>
                          <Select options={ schools } name="school" id="school" onChange={this.handleSchoolChange} value={selectedSchool}/>
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
                        <th className="thStyle" width="20%">Name</th>
                        <th className="thStyle" width="20%">Roll Number</th>
                        <th className="thStyle" width="20%">Caste</th>
                        <th className="thStyle" width="20%">Religion</th>
                        <th className="thStyle" width="20%">Gender</th>
                        <th className="thStyle" width="10%">Joining Date</th>
                        <th className="thStyle" width="10%">Address</th>
                        <th className="thStyle" width="10%">City</th>
                        <th className="thStyle" width="10%">Pin Code</th>
                        <th className="thStyle" width="10%">Action</th>
                      </tr>
                    </thead>
                    <tbody style={{color: '#dee2e6'}}>
                      {students.map(student => (
                        <tr key={student.id}>
                            <td className="thStyle" style={{whiteSpace: 'nowrap'}}>{student.label}</td>
                            <td className="thStyle">{student.rollNumber}</td>
                            <td className="thStyle">{student.caste}</td>
                            <td className="thStyle">{student.religion}</td>
                            <td className="thStyle">{student.gender}</td>
                            <td className="thStyle">{student.joiningDate}</td>
                            <td className="thStyle">{student.address}</td>
                            <td className="thStyle">{student.city}</td>
                            <td className="thStyle">{student.pincode}</td>
                            <td className="thStyle">
                            <ButtonGroup>
                                <Button size="sm" color="primary" onClick={() => this.hideHeader()} tag={Link} to={"/students/" + student.id}>Edit</Button>
                                <Button size="sm" color="danger" onClick={() => this.remove(student.id)} disabled>Delete</Button>
                            </ButtonGroup>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
      </div>
    );
  }
}

export default StudentList;