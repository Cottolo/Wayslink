import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import chessImg from "../../assets/Chess.png";
import { API } from "../../config/api";

const Template = ({ title, description, image, dataSocmed, unique_link,visit}) => {
  const navigate = useNavigate()
  const handleAddVisit = async ({socmed}) => {
    // e.preventDefault();
    try {
        let dataVisit ={
          visit : visit += 1
        }       
        const response = await API.patch("/link/" + unique_link , dataVisit)
        console.log(response);
        window.open(`${socmed}`);
    } catch (error) {
        console.log(error);
    }
};

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="rounded p-5">
            <div className="d-flex align-items-center justify-content-center flex-column w-100">
              <img
                src={image}
                style={{ objectFit: "cover", borderRadius: "50%" }}
                width="150"
                height={150}
              />
              <h3 className="fw-bold mt-3">{title}</h3>
              <p className="w-100 fs-4 text-center">{description}</p>
            </div>
            <div className="d-flex align-items-center justify-content-center flex-column">
              {dataSocmed?.map((socmed) => (
                <div className="w-100"
                  onClick={()=>handleAddVisit(socmed.url)}
                >
                  <a
                    href={socmed.url}
                    target="_blank"
                    className="rounded bg-dark d-flex w-100 py-1 px-2 align-items-center justify-content-start text-decoration-none mb-3"
                    key={socmed.id}

                  >
                    <img
                      src={socmed.image}
                      style={{ objectFit: "cover", width:'75px', height:'75px', borderRadius:'100%'}}
                      />
                    <p
                      className="text-white mt-3 mx-auto fw-bold fs-2"
                    >
                      {socmed.social_media_name}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Template;
