//default react imports
import React, { useState } from "react";
//bootstrap implements
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
//icons
import {FaTimes, FaPlaystation, FaXbox, FaSteam} from "react-icons/fa";
import {RiSwitchFill} from "react-icons/ri";
import {GiPc} from "react-icons/gi";
import {SiEpicgames} from "react-icons/si";
//next link
import Link from "next/link";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function PlayerCard({Player,Team}){

    const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + Team?.teamLogoPath;
    //Player.playerID for link

    return (
      <>
      <Link href={"/stats/player/" + Player?.playerID}>
        <a  className="link-unstyled">
        <Card className="text-center mb-2">
        <Card.Body className="p-1">
          <Container>
            <Row className="">
              <Col md={12} className="p-0 mx-auto">
                <Row>
                  <Col md={2} className="p-0 align-items-left"><Img webp height={70} width={70} sizes={[70]} alt={Player?.teamMemberRole?.roleName} src={require("public/images/roles/" + Player.teamMemberRole.roleName + "_Logo.png")} className="MhTeamImg" draggable={false}></Img></Col>
                  <Col md={6} className="my-auto pl-0 pr-0"><h3 className="text-md-left text-center mb-0">{(Player.teamMemberPlatform == "PS4" &&
                                                    <FaPlaystation />)
                                                || (Player?.teamMemberPlatform == "Steam" &&
                                                    <FaSteam />)
                                                || (Player.teamMemberPlatform == "Xbox" &&
                                                    <FaXbox />)
                                                || (Player.teamMemberPlatform == "HiRez" &&
                                                    <GiPc />)
                                                || (Player.teamMemberPlatform == "Switch" &&
                                                    <RiSwitchFill />)
                                                || (Player.teamMemberPlatform == "Epic_Games" && 
                                                    <SiEpicgames />)
                                                ||
                                                Player.teamMemberPlatform
                                                } {Player?.teamMemberName}</h3>
                  </Col>
                  <Col md={4} className="my-auto">
                    <Row className="">
                      <Col className="d-flex justify-content-center justify-content-md-start">
                      {Team?.teamLogoPath != null ? <Image height={30} width={30} alt={Team?.teamName} src={imagePath} className="SmallTeamImage" draggable={false}></Image>  : 
                        <Img alt={Team?.teamName} src={require("public/images/teamBadge.png")} className="SmallTeamImage" draggable={false}></Img>
                      }
                         <Link href={`/stats/team/${Team?.teamID}`}><a className="link-unstyled my-auto"><p className="ml-2 my-auto Clickable Hoverable">{Team?.teamName}</p></a></Link>
                    </Col>
                    </Row>
                  </Col>
                </Row>
                <p className="text-muted smallfootertext mb-0 mt-0">Click to see player stats</p>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      </a>
      </Link>
      </>
    );
}