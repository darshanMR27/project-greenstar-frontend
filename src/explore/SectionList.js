import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, Form, FormGroup, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@kenshooui/react-multi-select/dist/style.css";
import axios from 'axios';
import {API_PROXY_URL} from "../Constants";

class SectionList extends Component {
  constructor(props) {
    super(props);
  this.state = {
    school:"",
    section:"",
    grade:"",
      sections: [],
      showForm: false,
    schools : [],
    grades : [],
    selectedItems: []
  };
  this.handleSchoolChange = this.handleSchoolChange.bind(this);
  this.handleClassChange = this.handleClassChange.bind(this);
 // this.remove = this.remove.bind(this);
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
        sections: result.data, 
        error:false,
        showForm:true
      });
      }).catch(error => {
      console.error("error", error);
      this.setState({
        error:`${error}`
      });
    });
  }

 
  viewSections = async () => {
    this.setState({showForm: true});
  }
  
  hideHeader = async () => {
    document.getElementById("AddSection").style.display="none";
    this.setState({showForm: false, showSchoolForm: false});
  }

  // async remove(id) {
  //   await fetch(`/api/section/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(() => {
  //     let updatedSections = [...this.state.sections].filter(i => i.id !== id);
  //     this.setState({sections: updatedSections});
  //   });
  // }

  render() {
    const {sections, selectedSchool, selectedGrade,
      schools,grades } = this.state;
    const showHide = {
      'display': this.state.showForm ? 'block' : 'none'
    };
    const showHideSection = {
      'display': this.state.showSchoolForm ? 'block' : 'none'
    };
    return (
      <div>
           <div className="row float-right">
            <Container>
              <Form>
                  <FormGroup>
                    <Button id="AddSection" color="success" onClick={() => this.hideHeader()}  tag={Link} to="/sections/new">Add Section</Button>{'     '}
                  </FormGroup>
              </Form>
            </Container>
          </div>
            <div style={showHideSection}>
              <h2>List Section</h2>
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
                </Form>
            </Container>
        </div>
        <div style={showHide}>
            <Table className="mt-4 tableStyle">
              <thead>
                <tr>
                  <th className="thStyle" width="20%">School</th>
                  <th className="thStyle" width="20%">Grade</th>
                  <th className="thStyle" width="20%">Section</th>
                  <th className="thStyle" width="20%">Action</th>
                </tr>
              </thead>
              <tbody style={{color: '#dee2e6'}}>
              {sections.map(section => (
                    <tr key={section.id}>
                        <td className="thStyle" style={{whiteSpace: 'nowrap'}}>{section.schoolName}</td>
                        <td className="thStyle">{section.className}</td>
                        <td className="thStyle">{section.label}</td>
                        <td className="thStyle">
                        <ButtonGroup>
                            <Button size="sm" color="primary" onClick={() => this.hideHeader()} tag={Link} to={"/sections/" + section.id}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => this.remove(section.id)} disabled>Delete</Button>
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

export default SectionList;