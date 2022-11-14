import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import styleCSS from "./UserLinks.module.css";
import exampleImage from "../../assets/example.png";
import View from "../../assets/View.png";
import Edit from "../../assets/Edit.png";
import Delete from "../../assets/Delete.png";
import { API } from "../../config/api";
import { UserContext } from "../../context/userContext";
import DeleteData from "../modal/Deletemodal";

const UserLinksContentPage = ({visitor}) => {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [dataLink, setDataLink] = useState([]);
  const [link, setLink] = useState([]);
  let id = state.user.id;

  //Get single link
  // const getLink = async () => {
  //   try {
  //     const response = await API.get(`/link/${unique_link}`);
  //     setLink(response.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  console.log(link);
  // Get all user links
  const getLinks = async () => {
    try {
      const config= {
        headers: {
            Authorization : `Bearer ${localStorage.token}`,
        }
    }
      const response = await API.get("/links",config);
      setDataLink(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("ini getLinks",dataLink);
  
  useEffect(() => {
    getLinks();
  }, []);

  let total = dataLink.length;

  // Navigate according with item.uniqueLink to open the shortlink tab
  const viewLink = (uniqueLink) => {
    navigate("/wayslink/" + uniqueLink);
  };

  // Delete Data
  const [uniqueLinkDelete, setUniqueLinkDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [query, setQuery] = useState("")

  const deleteLink = async (e) => {
    e.preventDefault()
    try {
    const config= {
            headers: {
                Authorization : `Bearer ${localStorage.token}`,
            }
    }
    await API.delete(`/link/${dataLink.id}`,config);
    
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (uniqueLink) => {
    setUniqueLinkDelete(uniqueLink);
    handleShow();
  };

  const deleteByUniqueLink = async (uniqueLink) => {
    try {
      const config= {
        headers: {
            Authorization : `Bearer ${localStorage.token}`,
        }
    }
      await API.delete(`/link/${uniqueLink}`,config);
      getLinks();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleClose();
    deleteByUniqueLink(uniqueLinkDelete);
    setConfirmDelete(null);
  }, [confirmDelete]);

  return (
    <div className={styleCSS.userLinksContent}>
      <div className={styleCSS.userLinksHeader}>
        <p>My Links</p>
      </div>
      <div className='ms-2 d-flex align-items-center'>
        <p className='fs-5 me-2 fw-bold my-auto'>All Links</p>
        <div className="bgYellow rounded-circle p-3">
        <p className='fw-bold m-auto'>{total} </p>
        </div>
        <input
          type="text"
          name="findlink"
          className={styleCSS.findInput}
          placeholder="Find Your Link"
          onChange={(e)=> setQuery(e.target.value)}
        />
        <button className='bgYellow fw-bold text-light border-0 px-4 ms-5 py-2 rounded-2'>Search</button>
      </div>
      <div>
      {dataLink?.filter((item)=>{return query.toLocaleLowerCase() === '' ? item : item.title.toLocaleLowerCase().includes(query);
      }).map((item, index)=>(
        // {dataLink?.map((item, index) => (
          <div className={styleCSS.userLinksList} key={index}>
            <img
              src={item.image}
              alt="link image"
              className={styleCSS.linksImage}
            />
            <div className={styleCSS.linksName}>
              <p className={styleCSS.linkstitle}>{item.title}</p>
              <p className={styleCSS.linksurl}>
                localhost:3000/wayslink/{item.unique_link}
              </p>
            </div>
            <div className='ms-5 mt-3'>
              <p className={styleCSS.titleVisit}>Visit</p>
              <p className='fw-bold fs-3 mb-0 text-center'>{item.visit}</p>
            </div>
            <div className='d-flex w-50 justify-content-end align-items-center me-4'>
              <img
                src={View}
                alt="View"
                style={{width:"50px", height: "50px" }}
                onClick={() => viewLink(item.unique_link)}
              />
              <img src={Edit} 
                className="ms-2"
                style={{width:"50px", height: "50px" }}
              alt="Edit" />
              <img
                style={{width:"50px", height: "50px" }}
                className="ms-2"
                src={Delete}
                alt="Delete"
                onClick={() => handleDelete(item.unique_link)}
              />
            </div>
          </div>
        ))}
      </div>
      <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
      />
    </div>
  );
};

export default UserLinksContentPage;
