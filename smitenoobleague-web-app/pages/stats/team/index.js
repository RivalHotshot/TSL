//default react imports
import React, { useState, useEffect } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//bootstrap components
import { Container, Card, Image, FormControl, InputGroup, Form, Button, Col, Row, Alert } from "react-bootstrap";
//custom components
import TeamCard from "src/components/TeamCard";
//Auth
import helpers from "utils/helpers";
//services
import divisionservice from "services/divisionservice";
import teamservice from "services/teamservice";

export default function team({LoginSession, DivisionList, TeamList}) {
    //Divisions for dropdown
    const [Divisions, setDivisions] = useState(DivisionList);
    //CurrentSchedule
    const [TeamsToShow, setTeamsToShow] = useState(TeamList);

    //Select Division
    const [SelectedDivisionID, setSelectedDivisionID] = useState(DivisionList?.length > 0 ? DivisionList[0]?.divisionID : 0);
    const changeDivision = async(evt) => {
      setSelectedDivisionID(evt.target.value);

      //check if the no division is selected or one of the other divisions
      if(evt.target.value == 0)
      {
        //Get teams that are in no division
        await teamservice.GetListOfTeamsWithoutDivisions().then((res) => {setTeamsToShow(res.data);}).catch((error) => {setTeamsToShow(null)});
      }
      else 
      {         
        //Get teams from selected division
        await teamservice.GetListOfTeamsByDivisionID(evt.target.value).then((res) => {setTeamsToShow(res.data);}).catch((error) => {setTeamsToShow(null)});
      }

    };

    useEffect(() => {
      //Add the teams without division
        if(Divisions?.length > 0)
        {
          setDivisions(Divisions.concat({divisionID: 0, divisionName: "Division-less Teams"}));
        }
    }, []);



  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      <Container className="mt-4">
        <Row>
          <Col></Col>
          <Col md={4} xl={3} className="d-flex justify-content-center">
              <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivisionID}>
                {Divisions?.length > 0 ? Divisions.map((d, index) => (
                  <option key={index} disabled={d.divisionID == 0 && d.divisionName == "No divisions"} value={d.divisionID}>{d.divisionName}</option>
                )) : <option disabled value={0}>{ "No divisions"}</option>}
              </Form.Control>
          </Col>
          <Col></Col>
        </Row>
        <Row className="mt-4">
          <Col md={10} xl={7} className="mx-auto">
            {/*Team cards */}
            {TeamsToShow != null ? <>
              {TeamsToShow.map((t, index) => (
                <TeamCard key={index} Team={t} />
              ))}
             </> : 
             <> 
              <Row className="mt-5">
                <Col md={3}></Col>
                <Col md={6} className="d-inline-flex justify-content-center">
                <Alert variant="warning" className="rounded">
                  <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No teams found</h3>
                </Alert> 
                </Col>
                <Col md={3}></Col>
              </Row> 
            </>}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);
    //Get division names and id and get the list of teams for the first division in the list
    let listOfDivisions = [];
    let listOfTeams = null;
    //Get division data from api
    await divisionservice.GetBasicListOfDivisions().then(res => { listOfDivisions = res.data }).catch(err => {});
    
      //check if there are divisions, if yes check if the first division has teams
  if (listOfDivisions?.length > 0) {
    //get division teams from api
    await teamservice.GetListOfTeamsByDivisionID(listOfDivisions[0]?.divisionID)
      .then((res) => {
        listOfTeams = res.data;
      })
      .catch((error) => {
      });
  }

  return {
      props: {
          LoginSession: loginSessionData,
          DivisionList: listOfDivisions,
          TeamList: listOfTeams
      },
  };
}