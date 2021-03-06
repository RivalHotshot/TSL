//default react imports
import React, { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import Head from "next/head";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
import { CardColumns, Container, Button, Col, Row, Card, Alert, Jumbotron } from "react-bootstrap";
//Auth
import helpers from "utils/helpers";
//services
import newsservice from "services/newsservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";


export default function news({LoginSession, Article}) {
  // custom loader, this one doesn't use server performance and just displays the image vanilla
  const imageLoader = ({ src, width, quality }) => {
    // return `${src}?w=${width}&q=${quality || 75}`
    return `${src}`;
    }

  const ArticleImg = (a) => {
    const articleImg = process.env.NEXT_PUBLIC_BASE_API_URL + "/news-service/images/" + Article?.articleImagePath;
    return Article?.articleImagePath != null ? <Image loader={imageLoader} alt={"SNL News Image"} layout={"fill"} src={articleImg} className="news-bannerimg" draggable={false}></Image>
    : <Image alt={"SNL News Image"} layout={"fill"} src={"/images/news_placeholder.jpg"} className="news-bannerimg" draggable={false}></Image>;
  };

  const ReadableDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
};

  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      {/* Load override head after navbar, since default twitter head get's loaded in navbar */}
      <Head>
        <meta name="twitter:card" key={"twitter:card"} content="summary_large_image"/>
        <meta name="twitter:site" key="twitter:site" content="@Smitenoobleague"/>
        <meta name="twitter:title" key="twitter:title" content={Article?.articleTitle}/>
        <meta name="twitter:description" key="twitter:description" content={Article?.articleDescription} />
        <meta name="twitter:image" key="twitter:image" content={process.env.NEXT_PUBLIC_BASE_API_URL + "/news-service/images/" + Article?.articleImagePath} />
      </Head>
      <div className="w-100 news-banner position-relative">{ArticleImg(Article)}</div>
      <Container fluid className="mt-3">
        <Row><Col md={6} className="mx-auto text-left">
        <h2 className="display-4 font-weight-bold">{Article?.articleTitle}</h2>
        </Col></Row>
        <Row><Col md={6} className="mx-auto text-left"><h6 className="font-weight-bold">Article type: {Article?.articleType}</h6></Col></Row>
        <Row><Col md={6} className="mx-auto text-left"><h6 className="font-weight-bold">Date posted: {ReadableDate(Article?.articleDate)}</h6></Col></Row>
        <Row><Col><hr/></Col></Row>
        <Row>
          <Col md={6} className="mx-auto text-left">
            <div dangerouslySetInnerHTML={{__html: Article?.articleContent != null ? DOMPurify.sanitize(Article?.articleContent) : ""}}></div>
           
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);

  const slug = context.params.slug;

  let article = null;

  await newsservice.GetArticleBySlug(slug).then(res => {article = res.data;}).catch(err => {});

  return {
      props: {
          LoginSession: loginSessionData,
          Article: article
      },
  };
}