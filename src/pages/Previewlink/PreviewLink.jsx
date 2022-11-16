import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../config/api";
import Template from "./Template";


const PreviewLink = () => {
  const [dataLink, setDataLink] = useState(null);
  const [dataSocmed, setDataSocmed] = useState([]);
  const { unique_link } = useParams();

  const getPreviewLinks = async () => {
    try {
      const response = await API.get(`/link/${unique_link}`);
      setDataLink(response.data.data);
      getSocmed(response.data.data.id);
      console.log(getSocmed);
    } catch (error) {
      console.log(error);
    }
  };

  const getSocmed = async (linkId) => {
    try {
      const response = await API.get(`/social-media/${linkId}`);
      setDataSocmed(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPreviewLinks();
  }, []);

  console.log("data link",dataLink);
  console.log("data socmed",dataSocmed);

  return (
      <Template
        visit={dataLink?.visit}
        title={dataLink?.title}
        description={dataLink?.description}
        image={dataLink?.image}
        dataSocmed={dataSocmed}
        unique_link={unique_link}
      />
    );
 
};

export default PreviewLink;
