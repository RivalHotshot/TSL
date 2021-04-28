//default react imports
import React, { useState } from "react";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container, Card, Button } from "react-bootstrap";
import Link from "next/link";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";
//services
import matchservice from "services/matchservice";

export default function ManageForfeitScheduleItem({homeTeam, awayTeam, matchupID, byeWeek, score, apiToken, updateScore}) {
    let scoreHome = score?.split('-')[0].replace(' ', '');
    let scoreAway = score?.split('-')[1].replace(' ', '');

    const RenderTeamImage = (t) => {
        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        if(t == null)
        {
            return (<Img webp width={70} height={70} alt={t?.teamName} title={t?.teamName} src={require("public/images/byeweek.png")} className="MhTeamImg" draggable={false}></Img>);
        }
        else {
        return (t?.teamLogoPath != null ? <Image loading={"eager"} height={70} width={70} alt={t?.teamName} title={t?.teamName} src={imagePath} className="MhTeamImg" draggable={false}></Image> :
                <Img webp width={70} height={70} alt={t?.teamName} title={t?.teamName} src={require("public/images/teamBadge.png")} className="MhTeamImg" draggable={false}></Img>);
        }
    };

    const checkScore = (teamIsHome) => {
        if(scoreHome > 1 || scoreAway > 1)
        {
            return true;
        }
        else {
            return teamIsHome ? (score != null ? !(scoreHome < 2) : false) : (score != null ? !(scoreAway < 2) : false);
        }
    }

    const forfeitMatch = async(forfeitID) => {
        const data = {
            matchupID: matchupID,
            forfeitingTeamID: forfeitID
          }
        await matchservice.ForfeitMatchup(data,apiToken).then((res) => {
            if(res.status == 200)
            {
                console.log(res.data);

                if(forfeitID == awayTeam.teamID)
                {
                    updateScore(matchupID, score != null ? (Number(scoreHome) + 1) + " - " + (scoreAway) : "1 - 0");
                }
                else {
                    updateScore(matchupID, score != null ? (scoreHome) + " - " + (Number(scoreAway) + 1) : "0 - 1");
                }
            }
        }).catch((err) => {console.log(err);});
    };

    const handleForfeitAway = () => {forfeitMatch(awayTeam.teamID)};
    const handleForfeitHome = () => {forfeitMatch(homeTeam.teamID)};

    return (
        <Card className="text-center mb-2">
            <Card.Body>
                <Container>
                    <Row>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={3} className="p-0">
                                    {RenderTeamImage(homeTeam)}
                                </Col>
                                <Col md={9} className="my-auto"><h3 className="">{homeTeam?.teamName != null ? <Link href={`/stats/team/${homeTeam.teamID}`}><span className="Hoverable Clickable" title={"click to see team stats"}>{homeTeam?.teamName}</span></Link> : "No opponent this week"}</h3></Col>
                            </Row>
                            <Row className="mt-1">
                                <Col><Button block disabled={checkScore(true)} onClick={handleForfeitHome}>Forfeit 1 Game</Button></Col>
                            </Row>
                        </Col>
                        <Col md={2} className="my-auto"><h2>VS</h2></Col>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={9} className="my-auto"><h3 className="">{awayTeam?.teamName != null ? <Link href={`/stats/team/${awayTeam.teamID}`}><span className="Hoverable Clickable" title={"click to see team stats"}>{awayTeam?.teamName}</span></Link> : "No opponent this week"}</h3></Col>
                                <Col md={3} className="p-0">
                                    {RenderTeamImage(awayTeam)}
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col><Button block disabled={checkScore(false)} onClick={handleForfeitAway}>Forfeit 1 Game</Button></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Card.Text>
                        {byeWeek ? "Bye week" 
                        : <>{score != null ? <Link href={"/matchhistory/" + matchupID}>{score}</Link> : "Not played yet"}  </>}
                       
                    </Card.Text>
                </Container>
            </Card.Body>

        </Card>
    );
}