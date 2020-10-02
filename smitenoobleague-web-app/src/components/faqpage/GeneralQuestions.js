import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

export default function GeneralQuestions() {
return (
    <>
        <h3 className="font-weight-bold">General questions</h3>
        <hr />
        <Accordion>
        
        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            <h5 className="m-0">How long does it take for played games to show up?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
            <Card.Body>
            <p className="m-0">Atm there is a delay in the Hi-rez api that prevents custom game data to be pulled right after playing, this delay is <b>7 days</b>. 
            If a captain submits a match-id it get's stored. When the match data becomes available it get's immediately processed.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
            <h5 className="m-0">What is smitenoobleague.com?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
            <Card.Body>
            <p className="m-0">Smitenoobleague or in short SNL is a website where amateur smite league's get hosted and managed. 
            In the smitenoobleague there are multiple divisions, each division contains a number of teams, 
            these teams compete agains eachother for several weeks. during this time team captains submit their played match IDs. 
            These match IDs get collected and processed, with the data the matches provide everything gets calculated.
            Essentially this means you will be able to view the final match results and statistics of every team that plays in the smitenoobleague</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="2">
            <h5 className="m-0">How do i sign up as a team?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
            <Card.Body>
            <p className="m-0">If you want to sign up as a team you should send an e-mail to <a href="mailto:signup@smitenoobleague.com?SUBJECT=Sign up">signup@smitenoobleague.com</a> with the following information:
            <ul>
                <li>Your Gamertag / ingame name</li>
                <li>Your Platform</li>
                <li>Your team's skill level (please answer fairly)</li>
            </ul>
            </p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="3">
            <h5 className="m-0">How do the stats get collected?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="3">
            <Card.Body>
            <p className="m-0">The stats get collected with the match IDs of each played match. 
            These match IDs get submitted by the team captains after each match, with this match ID a request gets made to the Hirez-api, 
            this returns all the data of the match.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="4">
            <h5 className="m-0">How many games are played per match?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="4">
            <Card.Body>
            <p className="m-0">By default each match is a best of 3, so the max amount of games is 3, the minimum amount is 2.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        </Accordion>
    </>
);
}
