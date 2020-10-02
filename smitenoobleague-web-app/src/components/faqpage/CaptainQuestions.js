import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

export default function CaptainQuestions() {
return (
    <>
        <h3 className="font-weight-bold">Captain questions</h3>
        <hr />
        <Accordion>
        
        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            <h5 className="m-0">How do I manage my team?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
            <Card.Body>
            <p className="m-0">On the captainpage you will see big button with manage team members; use it, it is pretty self explanatory.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
            <h5 className="m-0">Can I disband my team?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
            <Card.Body>
            <p className="m-0">If you would like to disband your team you should <b>contact the league admin</b>. 
            Together with the admin you can look if the rest of the team also wants to disband and if the captain role could be taken over. 
            If this is not an option the admin will delete the team. When the team gets deleted the data will be kept but not displayed on the site anymore</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="2">
            <h5 className="m-0">Can I change my team name at anytime?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
            <Card.Body>
            <p className="m-0"><b>Yes</b> you can change your team name whenenver you want, it is however advised to keep the same name during a split to be recognizable.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="3">
            <h5 className="m-0">Can I change my teams division?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="3">
            <Card.Body>
            <p className="m-0"><b>No</b> you can't change your teams division, if you would like to switch to another division contact the league admin.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        </Accordion>
    </>
);
}
