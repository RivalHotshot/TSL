import React, { useState, useEffect } from "react";
import {Row, Col, Button, Badge, Modal, Container, Form, InputGroup, FormControl, Alert} from "react-bootstrap";
import {FaTimes, FaPlaystation, FaXbox, FaSteam} from "react-icons/fa";
import {RiSwitchFill} from "react-icons/ri";
import {GiPc} from "react-icons/gi";
import {SiEpicgames} from "react-icons/si";
import manageteamservice from "services/manageteamservice";




export default function SearchPlayer({apiToken, setCaptainFunc}) {
    const [PlayerModal, setPlayerModal] = useState(false);
    const [FoundPlayers, setFoundPlayers] = useState([]);
    const [SelectedPlayer, setSelectedPlayer] = useState();
    const [SearchName, setSearchName] = useState("");
    const [CaptainPlayer, setCaptainPlayer] = useState();

    const updateSearchName = (event) => {
        if(event.target.value != null)
        {
            if(event.target.value.length < 30)
            {
                setSearchName(event.target.value);
            }
        }
    };

    const handleClose = () => {
        setPlayerModal(false);
        setFoundPlayers([]);
        setSelectedPlayer(null);
        setSearchName("");
        setMsgPlayerInfo("");
        setShowPlayerInfoAlert(false);
    };
    const handleShow = () => {
        setPlayerModal(true);
    };

const handleSearchPlayer = async() => { 
    if(SearchName != null && SearchName != "")
    {
        const name = SearchName;
        manageteamservice.GetPlayersByName(apiToken, name)
        .then(res => {
            setFoundPlayers(res.data); 
            if(res.data.length > 0) 
            {
                setSelectedPlayer(res.data[0]);
            }
            else {
                setMsgPlayerInfo("No results found.");
                setShowPlayerInfoAlert(true);
            }
        })
        .catch(err => {
            setMsgPlayerInfo(err?.response?.data);
            setShowPlayerInfoAlert(true);
        });
    }
};
const handleSelectPlayer = (event) => {
    const playerSelected = FoundPlayers?.filter(member => member.playerID == event.target.value)[0];
    setSelectedPlayer(playerSelected);
 };


const handleAddPlayer = async() => {
    setCaptainPlayer(SelectedPlayer);
    setCaptainFunc(SelectedPlayer);
    handleClose();
};

const [msgPlayerInfo, setMsgPlayerInfo] = useState("Error msg");
const [showPlayerInfoAlert, setShowPlayerInfoAlert] = useState(false);
function PlayerInfoAlert() {
  if (showPlayerInfoAlert) {
    return (
      <Alert className="" variant="danger" onClose={() => setShowPlayerInfoAlert(false)} dismissible>
        <p className="my-auto">
          {msgPlayerInfo}
        </p>
      </Alert>
    );
  }
  return <> </>;
};

    return (
        <>
            <Row className="">
                <Col md={8} xs={8} className="d-flex">
                    <h4 className="my-auto font-weight-bold p-auto pl-2 PlayerText">{(CaptainPlayer?.platform == "PS4" &&
                                                    <FaPlaystation />)
                                                || (CaptainPlayer?.platform == "Steam" &&
                                                    <FaSteam />)
                                                || (CaptainPlayer?.platform == "Xbox" &&
                                                    <FaXbox />)
                                                || (CaptainPlayer?.platform == "HiRez" &&
                                                    <GiPc />)
                                                || (CaptainPlayer?.platform == "Switch" &&
                                                    <RiSwitchFill />)
                                                || (CaptainPlayer?.platform == "Epic_Games" && 
                                                    <SiEpicgames />)
                                                ||
                                                
                                                CaptainPlayer?.teamMemberPlatform

                                                } {CaptainPlayer?.playername != null ? CaptainPlayer.playername + " " : "No player selected yet. "} </h4>
                </Col>
                <Col xs={4} className="my-auto">{CaptainPlayer?.playerID != null ? <Button onClick={handleShow} variant="primary" size="sm" className="PlayerEdit" block>Edit</Button> : <Button onClick={handleShow} variant="success" size="sm" className="PlayerEdit" block>Add</Button>}</Col>
            </Row>

            {/* Modal */}
            <Modal show={PlayerModal} onHide={handleClose}>
                    <Container className="p-3">
                        {/* Header */}
                    <Row className="mb-2">
                        <Col md={10}><h5>{CaptainPlayer != null ? "Edit" : "Add"} player</h5></Col>  
                        <Col md={2} className="justify-content-end d-flex"><FaTimes className="Clickable" onClick={handleClose} /></Col>
                    </Row>
                    {/* Body */}
                    <Row className="mb-4">
                        <Col>
                        <Row>
                            <Col>
                            <Alert variant="secondary">
                                <Alert.Heading>How to's</Alert.Heading>
                                <p>
                                    <b>Step 1.</b> Fill in a playername and press search player.<br />
                                    <b>Step 2.</b> Choose a player from the dropdown results.<br />
                                    <b>Step 3.</b> Press add player to add the selected player.
                                </p>
                            </Alert>
                            </Col>
                        </Row>
                            <Row>
                            <Col>  
                                <InputGroup className="mb-3">
                                    <FormControl value={SearchName} onChange={updateSearchName}
                                    placeholder="Player ingame name..."
                                    aria-label="Player ingame name"
                                    />
                                    <InputGroup.Append>
                                    <Button variant="primary" onClick={handleSearchPlayer}>Search player</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                            </Row>
                            {FoundPlayers?.length > 0 ? <>
                                <Row>
                                <Col>  
                                    <Form.Group controlId="SelectPlayer">
                                        <Form.Label>Players found by name: "{SearchName}"</Form.Label>
                                        <Form.Control as="select" onChange={handleSelectPlayer}>
                                        {FoundPlayers.map((player, index) => (
                                            <option key={index} value={player.playerID}>{player.playername} {player.platform}</option>
                                        ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            </> : <> </>}
                            <Row>
                                <Col><PlayerInfoAlert /></Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* Footer */}
                    <Row>
                        <Col className="justify-content-end d-flex">
                        <Button variant="danger" onClick={handleClose} className="mr-1">
                               Cancel
                            </Button>
                            {CaptainPlayer != null ?
                            <Button variant="primary" onClick={handleAddPlayer}>
                               Edit player
                            </Button> : 
                            <Button variant="success" onClick={handleAddPlayer}>
                            Add player
                            </Button>}
                        </Col>
                    </Row>
                </Container>
        </Modal>
        </>
    );
}