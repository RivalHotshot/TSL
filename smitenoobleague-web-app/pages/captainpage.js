//default react imports
import React, { useState, useEffect } from "react";
import Router from "next/router";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
import DefaultErrorPage from "next/error";
//bootstrap components
import { Container, Row, Col, Form, Card, Button, Image, Badge, Toast, Alert } from "react-bootstrap";
//custom imports
import { FaEdit, FaCheck, FaBan } from "react-icons/fa";
import { ReactSortable, Sortable, Swap } from "react-sortablejs";
import PlayerManagement from "src/components/captainpage/PlayerManagement";
//importing images
import Jungle from "public/images/roles/Jungle_Logo.png";
import Solo from "public/images/roles/Solo_Logo.png";
import Support from "public/images/roles/Support_Logo.png";
import Mid from "public/images/roles/Mid_Logo.png";
import Adc from "public/images/roles/Adc_Logo.png";
import TeamBadge from "public/images/teamBadge.png"
//Auth & API
import helpers from "utils/helpers";
import captainservice from "services/captainservice";

export default function captainpage({ LoginSession, apiResponse, status, errMsg, apiToken, ...props }) {
  //#region SubmitMatch
  const [matchID, setMatchID] = useState(0);
  const [submissionMsg, setSubmissionMsg] = useState({ text: "Submission msg here...", color: "danger" });
  const [showSubmissionAlert, setShowSubmissionAlert] = useState(false);
  function SubmissionAlert() {
    if (showSubmissionAlert) {
      return (
        <Alert className="" variant={submissionMsg?.color} onClose={() => setShowSubmissionAlert(false)} dismissible data-testid="captainPageMatchAlert">
          <p className="my-auto" data-testid="captainPageMatchAlertText">
            {submissionMsg?.text}
          </p>
        </Alert>
      );
    }
    return <> </>;
  };

  const handleChange = (event) => {
    if (event.target?.value != null) {
      //update matchID
      setMatchID(event.target.value);
      //show messag during typing
      if (event.target.value.length <= 10) {
        setShowSubmissionAlert(false);
      }

      if (event.target.value.length > 10) {
        setSubmissionMsg({ text: "gameID too long to be valid. a maximum of 10 characters is allowed", color: "danger" })
        setShowSubmissionAlert(true);
      }
    }
    else {
      setShowSubmissionAlert(false);
      setMatchID(0);
    }
  };
  const handleSubmit = async (event) => {

    if (matchID != null && matchID != "" && matchID?.length >= 5 && matchID?.length <= 10) {
      setShowSubmissionAlert(false);
      const id = Number(matchID);
      await captainservice.SubmitMatchID(apiToken, id)
        .then(res => {
          setSubmissionMsg({ text: res.data, color: "success" });
          setShowSubmissionAlert(true);
        })
        .catch(err => {
          setSubmissionMsg({ text: err.response.data, color: "danger" })
          setShowSubmissionAlert(true);
        });
    }
    else if(matchID?.length == 0 || matchID == "" || matchID == null){
      setSubmissionMsg({ text: "gameID not filled in.", color: "warning" })
      setShowSubmissionAlert(true);
    }
    else if (matchID?.length < 5) {
      setSubmissionMsg({ text: "gameID too short to be valid. a minimum of 5 characters is required", color: "danger" })
      setShowSubmissionAlert(true);
    }
    else if (matchID?.length > 10) {
      setSubmissionMsg({ text: "gameID too long to be valid. a maximum of 10 characters is allowed", color: "danger" })
      setShowSubmissionAlert(true);
    }
  };
  //#endregion

  //#region TeamMembers
  const [teamMembers, setTeamMembers] = useState([]);
  //const [test, setTest] = useState([{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }, { id: 3, name: "Player 3" }, { id: 4, name: "Player 4" }, { id: 5, name: "Player 5" }]);
  //Get every team member for each role. to make sure they are on the correct position if less then 5 members get returned
  useEffect(() => {
    const team = [];
    const solo = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 1)[0];
    team.push(solo != undefined ? solo : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 1, roleName: "Solo" } }); //SOLO
    const jungle = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 2)[0]
    team.push(jungle != undefined ? jungle : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 2, roleName: "Jungle" } }); //JUNGLE
    const mid = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 3)[0];
    team.push(mid != undefined ? mid : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 3, roleName: "Mid" } }); //MID
    const support = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 4)[0];
    team.push(support != undefined ? support : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 4, roleName: "Support" } }); //SUPPORT
    const adc = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 5)[0];
    team.push(adc != undefined ? adc : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 5, roleName: "Adc" } }); //ADC

    setTeamMembers(team);

  }, []);

  const updateSwap = async (event) => {

    if (teamMembers[event.oldIndex]?.teamMemberID != null || teamMembers[event.newIndex]?.teamMemberID != null) {
      const Roles = ["Solo", "Jungle", "Mid", "Support", "Adc"];

      const items = Array.from(teamMembers);
      //Set correct roles. swapping them in the array doesn't change the object value. 
      items[event.oldIndex].teamMemberRole.roleID = event.newIndex + 1;
      items[event.newIndex].teamMemberRole.roleID = event.oldIndex + 1;
      items[event.oldIndex].teamMemberRole.roleName = Roles[event.newIndex];
      items[event.newIndex].teamMemberRole.roleName = Roles[event.oldIndex];
      //swap items at index
      items[event.newIndex] = teamMembers[event.oldIndex];
      items[event.oldIndex] = teamMembers[event.newIndex];

      if (event.oldIndex != event.newIndex) {
        if (items[event.newIndex].teamMemberID != null) {
          const data = {
            teamMemberID: items[event.newIndex].teamMemberID,
            roleID: items[event.newIndex].teamMemberRole.roleID
          };
          //api call to update role
          await captainservice.UpdatePlayerRole(apiToken, data).then(res => { }).catch(err => { SetNote({ msg: err.response, type: "bg-danger" }); SetNotify(true); });
        }
        else if (items[event.oldIndex].teamMemberID != null) {
          const data = {
            teamMemberID: items[event.oldIndex].teamMemberID,
            roleID: items[event.oldIndex].teamMemberRole.roleID
          };
          //api call to update role
          await captainservice.UpdatePlayerRole(apiToken, data).then(res => { }).catch(err => { SetNote({ msg: err.response, type: "bg-danger" }); SetNotify(true); });
        }
      }

      setTeamMembers(items);
    }
  };
  //#endregion

  //#region EditTeamName
  const [editing, setEditing] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [oldName, setOldName] = useState("");
  //handle change
  const handleEditTeamName = (event) => {
    setTeamName(event.target.value);
  };
  //Set initial states
  useEffect(() => {
    setTeamName(apiResponse != null ? apiResponse.teamName : "Api Unavailable");
    setOldName(apiResponse != null ? apiResponse.teamName : "Api Unavailable");
  }, []);
  //Buttons
  const editTeamName = () => {
    setEditing(true);
  };
  const cancelNameEdit = () => {
    setEditing(false);
    setTeamName(oldName);
    setShowTeamInfoAlert(false);
  };
  const confirmNameEdit = async () => {
    if (teamName != apiResponse.teamName) {
      //call api to update team
      const data = {
        teamID: apiResponse?.teamID,
        teamName: teamName,
      };
      await captainservice.UpdateTeamInfo(apiToken, data).then(res => { setOldName(teamName); setShowTeamInfoAlert(false); setEditing(false); })
        .catch(err => {
          if (err.response.status != 400) {
            SetNote({ title: "Error", msg: "Oh oh something went wrong trying to update the teamname.", type: "bg-danger" });
            SetNotify(true);
          }
          else {
            setMsgTeamInfo(err.response.data.TeamName[0]);
            setShowTeamInfoAlert(true);
          }
        });
    }
    else {
      setEditing(false);
    }
  };
  const [msgTeamInfo, setMsgTeamInfo] = useState("Error msg");
  const [showTeamInfoAlert, setShowTeamInfoAlert] = useState(false);
  function TeamInfoAlert() {
    if (showTeamInfoAlert) {
      return (
        <Alert className="" variant="danger" onClose={() => setShowTeamInfoAlert(false)} dismissible data-testid="captainPageTeamAlert">
          <p className="my-auto" data-testid="captainPageTeamAlertText">
            {msgTeamInfo}
          </p>
        </Alert>
      );
    }
    return <> </>;
  };
  //#endregion

  //#region notify
  const [notify, SetNotify] = useState(false);
  const [note, SetNote] = useState({ msg: "", type: "", title: "" });
  const toggleNotify = () => SetNotify(!notify);
  //#endregion

  if (status != null) {
    return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="captainPageError"/></>);
  }
  else {

    return (
      <>
        <NavBar LoginSession={LoginSession} />
        <Container fluid>
          <Row className="mt-4 mb-4"><Col className="text-center"><h1 className="font-weight-bold">CAPTAINPAGE</h1></Col></Row>
          <Row>
            <Col xl={1}></Col>
            <Col md={5} xl={4}>
              <Row className="mb-2">
                <Col className="rounded">
                  <Card className="bg-light">
                    <Card.Body className="">
                      <h2 className="font-weight-bold">SUBMIT MATCH</h2>
                      <Form.Group className="">
                        <Form.Control type="number" placeholder="Match ID..." className="mb-2" onChange={handleChange} maxLength={10} data-testid="captainPageMatchIdInput"/>
                        <Button variant="primary" size="lg" block onClick={handleSubmit} data-testid="captainPageSubmitButton">Submit</Button>
                      </Form.Group>
                      <Row><Col><SubmissionAlert /></Col></Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Card className="bg-light">
                    <Card.Body className="h-100">
                      <Container fluid>
                        <Row><Col className="pl-0"><h2 className="font-weight-bold">TEAM INFO</h2></Col></Row>
                        <Row className="mb-4">
                          <Col md={3} xs={3} className="my-auto p-0"><h5 className="font-weight-bold mb-0 TeamInfoTitle">Name:</h5></Col>
                          <Col md={7} xs={7} className="my-auto p-0">
                            <Form.Group className="my-auto" controlId="validationCustom01">
                              <Form.Control type="text" value={teamName} onChange={handleEditTeamName} placeholder={"Teamname..."} className="TeamInfoText" disabled={!editing} required />
                            </Form.Group>
                          </Col>
                          <Col className="my-auto p-0 ml-2">
                            <a className="TeamInfoIcon my-auto Clickable">{editing ? <FaCheck color={"green"} className="mr-1" onClick={confirmNameEdit} /> : <FaEdit onClick={editTeamName} />}</a>{editing ? <a onClick={cancelNameEdit} className="TeamInfoIcon my-auto Clickable"><FaBan color={"red"} /></a> : <></>}
                          </Col>
                        </Row>
                        <Row>
                          <Col md={3} xs={3} className="my-auto p-0"><h5 className="font-weight-bold mb-0 TeamInfoTitle">Logo:</h5></Col>
                          <Col md={7} xs={7} className="my-auto p-0"><Image src={TeamBadge} className="MainTeamImage" draggable={false} alt="Team logo"></Image></Col>
                          <Col className="my-auto p-0 ml-2">
                            <a className="TeamInfoIcon my-auto Disabled"><FaEdit color={"grey"} /></a>
                          </Col>
                        </Row>
                        <Row><Col><TeamInfoAlert /></Col></Row>
                      </Container>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col md={7} xl={6} className="mb-2">
              <Card className="bg-light w-100 h-100">
                <Card.Body className="">
                  <Container>
                    <Row><Col><h2 className="font-weight-bold">MANAGE TEAM</h2></Col></Row>
                    <Row>
                      <Col md={1} xs={2}>
                        <Row className="mb-2">
                          <Image src={Solo} className="PlayerRole my-auto" draggable={false} alt="Solo"></Image>
                        </Row>
                        <Row className="mb-2">
                          <Image src={Jungle} className="PlayerRole my-auto" draggable={false} alt="Jungle"></Image>
                        </Row>
                        <Row className="mb-2">
                          <Image src={Mid} className="PlayerRole my-auto" draggable={false} alt="Mid"></Image>
                        </Row>
                        <Row className="mb-2">
                          <Image src={Support} className="PlayerRole my-auto" draggable={false} alt="Support"></Image>
                        </Row>
                        <Row className="mb-2">
                          <Image src={Adc} className="PlayerRole my-auto" draggable={false} alt="Adc"></Image>
                        </Row>
                      </Col>
                      <Col md={1} xs={0} className="d-none d-sm-none d-md-block"></Col>
                      <Col md={10} xs={10}>
                        <ReactSortable
                          group="TeamMembers" list={teamMembers}
                          setList={() => { }}
                          onUpdate={(ev) => updateSwap(ev)}
                          swap={true}
                          swapClass={"text-success"}
                          chosenClass={"PlayerBoxGrapped"}
                          dragClass={"PlayerBoxGrapped"}
                          delayOnTouchOnly={true}
                          delay={200}>

                          {teamMembers.map((member, index) => (
                            <PlayerManagement key={index} member={member} apiToken={apiToken} teamID={apiResponse?.teamID} />
                          ))}
                        </ReactSortable>
                        <Row><Col><h6 className="text-muted float-right ExtraInfoText">Drag and drop players to swap their roles.</h6></Col></Row>
                      </Col>
                    </Row>

                    {/* Maybe have an info alert here. with info about the page */}
                  </Container>


                </Card.Body>
              </Card>
            </Col>
            <Col xl={1}></Col>
          </Row>
        </Container>
        <Footer />
        {/* Notification Toast */}

        <Toast show={notify} onClose={() => SetNotify(false)} delay={3000} autohide style={{ position: 'fixed', top: 5, right: 5, }}>
          <Toast.Header className={"text-white " + note?.type}>
            <img
              src="/images/SNL_Navbar_Logo.png"
              className={"rounded mr-2"}
              height={22}
              alt=""
            />
            <strong className="mr-auto pr-3">{note?.title}</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body className="bg-white rounded">{note?.msg}</Toast.Body>
        </Toast>
      </>
    );
  }
}

export async function getServerSideProps({ req, params, res }) {

  const loginSessionData = await helpers.GetLoginSession(req);

  if (loginSessionData?.user != null) {
    const apiTokenForClient = await helpers.GetAccessTokenForClient(req, req);
    let response = { data: null, statusCode: null, errMsg: null };
    await captainservice.GetTeamByCaptainID(apiTokenForClient,loginSessionData.user.sub)
      .then(res => {
        response.data = res.data;
      })
      .catch(err => {
        if (err.response == null) {
          response.statusCode = 503;
          response.errMsg = "SNL API unavailable";
        }
        else {
          response.statusCode = JSON.stringify(err?.response?.status);
          response.errMsg = err?.response?.data;
        }

      });

    return {
      props: {
        LoginSession: loginSessionData,
        apiResponse: response.data,
        status: response.statusCode,
        errMsg: response.errMsg,
        apiToken: apiTokenForClient
      }
    }
  }
  else {
    res.statusCode = 302
    res.setHeader('Location', `/api/login`) // redirect to login page
  }

  return {
    props: {
      LoginSession: loginSessionData
    },
  };
}