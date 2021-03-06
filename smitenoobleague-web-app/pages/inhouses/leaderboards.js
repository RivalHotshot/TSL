//default react imports
import React, { useState } from "react";
import Link from "next/link";
import DefaultErrorPage from "next/error";
//default page stuff
import InhouseNavBar from "src/components/inhouses/InhouseNavBar";
import Footer from "src/components/Footer";
//boostrap components
import {Container, Row, Col, Alert} from "react-bootstrap";
//custom imports
import InhouseLeaderBoardStatCard from "src/components/inhouses/InhouseLeaderboardStatCard";
//chart
import {Pie, Bar} from "react-chartjs-2";
//Auth
import helpers from "utils/helpers";
//services
import inhouseservice from "services/inhouseservice";


export default function leaderboards({LoginSession, Data, status, errMsg, apiToken }) {

  let TopDamageLabels = [];
  let TopDamageData = [];

  Data?.top10DamageAndRemainingInPercentage?.forEach(x => {
    TopDamageLabels.push(x?.player?.playername);
    TopDamageData.push(x?.score)
  });

  let Top5KdaLabels = [];
  let Top5KdaData = [];

  Data?.top5KdaPlayers?.forEach(x => {
    Top5KdaLabels.push(x?.player?.playername);
    Top5KdaData.push(x?.score);
  });

  const BarData = {
    labels: Top5KdaLabels,
    datasets: [
      {
        label: "Player KDA",
        backgroundColor: "#EB2602",
        borderColor: "#EB2602",
        borderWidth: 1,
        hoverBackgroundColor: "#EB2602",
        hoverBorderColor: "#EB2602",
        data: Top5KdaData
      }
    ]
  };

  const BarOptions = {
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                // OR //
                beginAtZero: true,   // minimum value will be 0.
                stepSize: 2
            }
        }]
    }
};
  const data = {
    labels: TopDamageLabels,
    datasets: [{
        data: TopDamageData,
        backgroundColor: [
            "#6925E8",
            "#27DBF2",
            "#57DB2D",
            "#F2C027",
            "#EB2602",
            "#ff9a00",
            "#052F5F",
            "#005377",
            "#06A77D",
            "#F1A208",
            "#9B287B",
            "#BB342F",
        ],
        hoverBackgroundColor: [
          "#6925E8",
          "#27DBF2",
          "#57DB2D",
          "#F2C027",
          "#EB2602",
          "#ff9a00",
          "#052F5F",
          "#005377",
          "#06A77D",
          "#F1A208",
          "#9B287B",
          "#BB342F",
        ]
    }]
};
// percentage option in tooltip
const options = {
    legend: {
        display: false,
        labels: {
            fontSize: 10,
            fontStyle: "bold",
            fontFamily: "Roboto",
        },
     },
    tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            try {
              let label = " " + data.labels[tooltipItem.index] || "";
    
              if (label) {
                label += ": ";
              }
    
              const sum = data.datasets[0].data.reduce((accumulator, curValue) => {
                return accumulator + curValue;
              });
              const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
    
              label += Number((value / sum) * 100).toFixed(0) + "%";
              return label;
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
  };
  if (status != null && status != 404) {
    return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="playerpageErrorPage" /></>);
  }
  else {
  return (
    <>
      <InhouseNavBar LoginSession={LoginSession} apiToken={apiToken}/>
      <Container fluid className="mt-2">
        {status == 404 ? <><Row className="mt-5">
                <Col md={3}></Col>
                <Col md={6} className="d-inline-flex justify-content-center">
                <Alert variant="warning" className="rounded">
                  <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">Not enough data available for leaderboards</h3>
                </Alert> 
                </Col>
                <Col md={3}></Col>
              </Row> </> : <>
        <Row>
          <Col md={9}>
            <Row>
              <Col md={3} className="p-0 pl-1 pr-1">
                <InhouseLeaderBoardStatCard Title={"Kills"} Stat={Data?.kills}/>
              </Col>

              <Col md={3} className="p-0 pl-1 pr-1">
                <InhouseLeaderBoardStatCard Title={"Assists"} Stat={Data?.assists}/>
              </Col>

              <Col md={3} className="p-0 pl-1 pr-1">
                <InhouseLeaderBoardStatCard Title={"Damage dealt"} Stat={Data?.damageDealt}/>
              </Col>

              <Col md={3} className="p-0 pl-1 pr-1">
              <InhouseLeaderBoardStatCard Title={"Damage Mitigated"} Stat={Data?.damageMitigated}/>
              </Col>
            </Row>
          </Col>
          <Col md={3} className="p-0 pl-1 pr-1">
            {/* Pie chart of total damage dealt */}
            <Row>
              <Col md={12} className="text-center"><h6 className="font-weight-bold mt-2 p-3">Top 10 Damage dealers, compared to the rest</h6></Col>
            </Row>
           <Row className="mb-2">
             <Col>
             <Pie data={data} height={200} options={options}/>
             </Col>
           </Row>

          </Col>
        </Row>

        {/* Second row of stats */}
        <Row>
          <Col md={9}>
            <Row>
              <Col md={3} className="p-0 pl-1 pr-1">
                <InhouseLeaderBoardStatCard Title={"Kill participation"} Stat={Data?.killParticipation} Percentage={"%"}/>
              </Col>

              <Col md={3} className="p-0 pl-1 pr-1">
               <InhouseLeaderBoardStatCard Title={"Deaths"} Stat={Data?.deaths}/>
              </Col>

              <Col md={3} className="p-0 pl-1 pr-1">
              <InhouseLeaderBoardStatCard Title={"Damage taken"} Stat={Data?.damageTaken}/>
              </Col>

              <Col md={3} className="p-0 pl-1 pr-1">
                <InhouseLeaderBoardStatCard Title={"Healing"} Stat={Data?.healing}/>
              </Col>
            </Row>
          </Col>
          <Col md={3} className="p-0 pl-1 pr-1">
            {/* Line Chart of stats */}
            <Row>
              <Col md={12} className="text-center"><h6 className="font-weight-bold">Top 5 highest KDA players</h6></Col>
            </Row>
            <Row className="mb-2">
              <Col><Bar data={BarData} height={230} options={BarOptions} /></Col>
            </Row>
          </Col>
        </Row> </>}
      </Container>
      <Footer />
    </>
  );
  }
}

export async function getServerSideProps(context) {

  const loginSessionData = await helpers.GetLoginSession(context.req);
  let apiTokenForClient = null;

  if (loginSessionData?.user != null) {
    apiTokenForClient = await helpers.GetAccessTokenForClient(context.req, context.res);
  }

  //object to fill
  let response = { data: null, statusCode: null, errMsg: null };
  //call api for the data
  await inhouseservice.GetInhouseLeaderboardData()
    .then(res => { response.data = res.data })
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
      Data: response.data,
      status: response.statusCode,
      errMsg: response.errMsg,
      apiToken: apiTokenForClient
    },
  };
}