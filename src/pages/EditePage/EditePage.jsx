import React from "react";
import styleCSS from "./InsertPage.module.css";
import SideNavbar from "../../components/sidebar/sidebar";
import { useParams } from "react-router-dom";
import EditeLink from "../../components/Edite/EditeLink";

const EditePage = () => {
  const { unique_link } = useParams();

  return (
    <div className={styleCSS.insertPageMainContent}>
      <div className={styleCSS.insertPageSideBar}>
        <SideNavbar />
      </div>
      <div className={styleCSS.insertPageRightSide}>
        <EditeLink unique_link={unique_link} />
      </div>
    </div>
  );
};

export default EditePage;
