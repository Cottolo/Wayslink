import react, { useState, useContext, useEffect } from "react";
import styleCSS from "./CreateLink.module.css";
import { API } from "../../config/api";
import { UserContext } from "../../context/userContext";
import Phone from "../../assets/Phone1.png";
import Chess from "../../assets/Chess.png";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, CloseButton, NavItem } from "react-bootstrap";

const EditeLink = ({ unique_link }) => {
  
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const [linkID, setLinkID] = useState("");
  
  // LINK
  const [dataLink,setDataLink] = useState([])

  const getLink = async () => {
    try {
      const config= {
        headers: {
            Authorization : `Bearer ${localStorage.token}`,
        }
    }
      const response = await API.get(`/link/${unique_link}`,config);
      setDataLink(response.data.data);
      getSocmed(response.data.data.id)
    } catch (error) {
      console.log(error);
    }
  };


  const [preview, setPreview] = useState(null);
  const [formLink, setformLink] = useState({
    title: "",
    description: "",
    image: "",
  });


  const onChangeLink = (e) => {
    setformLink({
      ...formLink,
      [e.target.name]: e.target.value,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
    console.log(formLink);
  };

  // Submit Link
  const handleEditeLink = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization : `Bearer ${localStorage.token}`,

        },
      };
      
      const formData = new FormData();
      formData.set("title", formLink.title);
      formData.set("description", formLink.description);
      formData.set("image", formLink.image[0], formLink.image[0].name);
      // formData.set("template", template);

      const response = await API.patch(`/edite-link/${unique_link}`, formData, config);
      console.log("RESPONSE",response);
      console.log("FORM DATA",formData);
      setLinkID(response.data.data.id);
      setformLink({
        title : "",
        description:"",
        image:""
      })

      const alert = (
        <Alert variant="success" className="py-1">
          Succes to Edite
        </Alert>
      );
      setMessage(alert);
     
    } catch (error) {
      console.log(error);
      const alert = (
        <Alert variant="danger" className="py-1">
         Please Select Image
        </Alert>
      );
      setMessage(alert);
    }
  };


  // SOCMED
  const [dataSocmed, setDataSocmed] = useState([])

  const getSocmed = async (linkId) => {
    try {
      const response = await API.get(`/social-media/${linkId}`);
      setDataSocmed(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [imageSocmedPreview, setImageSocmedPreview] = useState(null);
  const [socmedForm, setSocmedForm] = useState({
    social_media_name: "",
    url: "", 
    image: "",
  }); 


  const handleChangeSocmed = (e) => {
    setSocmedForm({
      ...socmedForm,
      [e.target.name]: e.target.value,
      [e.target.name]: 
      e.target.type === "file" ? e.target.files : e.target.value,
    });
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setImageSocmedPreview(url);
    }

    console.log("form",socmedForm);
  };

  
  // EDITE SOCMED
  const handleEditeSocmed = async (socmedId) => {
    try {
      // e.preventDefault();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization : `Bearer ${localStorage.token}`,
        },
      };

      const formData = new FormData();
      formData.set("link_id", linkID);
      formData.set("social_media_name", socmedForm.social_media_name);
      formData.set("url", socmedForm.url);
      formData.set("image", socmedForm.image[0], socmedForm.image[0].name);
      
      const response = await API.patch(`/social-media/${socmedId}`, formData, config);
      console.log("somed response", response);
      
      setSocmedForm({
        image: "",
        linkId: "",
        social_media_name: "",
        url: "",
      });
      setImageSocmedPreview(null);
    }
    catch (error) {
      console.log(error);
    }
  };  

  useEffect(()=>{
    getLink()
  },[])
  // console.log("FORM LINK", formLink);
  console.log("FORM SOCMED",socmedForm);
  console.log("SOCMED ID",dataSocmed.id);

  return (
    <div className={styleCSS.createLinkContent}>
      <div className={styleCSS.createLinkHeader}>
        <p>Template</p>
      </div>
      <div className={styleCSS.createLinkForm}>
        <div className={styleCSS.createLinkFormTop}>
          <p>Edite Link</p>
          
        </div>
        <div className={styleCSS.createLinkFormBottom}>
          <div className={styleCSS.createLinkFormInput}>
            <div className={styleCSS.formLink}>
              <form onSubmit={handleEditeLink}>
                <div className={styleCSS.preview}>
                  {preview != null? <img className="w-50 h-50" src={preview} alt="Preview" />: <img className="w-50" src={dataLink.image}/>}
                  <div>
                    <label style={{cursor:"pointer"}} className="bgYellow mt-3 py-1 px-4 fw-bold text-light rounded-2" htmlFor="image">Upload</label>
                  </div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className={styleCSS.uploadButton}
                    onChange={onChangeLink}
                  />
                </div>
                <div className={styleCSS.mainInput}>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    onChange={onChangeLink}
                    value={formLink.title}
                    placeholder={dataLink.title}
                    autoComplete="off"
                  />
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    name="description"
                    onChange={onChangeLink}
                    value={formLink.description}
                    placeholder={dataLink.description}
                    autoComplete="off"
                  />
                  <div className="mt-3">
                    {message && message}
                    <button className={styleCSS.addLinkButton} type="submit">
                      Save Link
                    </button>
                  </div>
                </div>
              </form>

              {/* SOCMED FORM */}
              
                <>
                {dataSocmed?.map((socmed,index)=>(
                  <div key={index} className={styleCSS.secondInput}>
                    <div className={styleCSS.linksCard}>
                      <form id="sosmedForm" onSubmit={()=>handleEditeSocmed(socmed.id)}>
                        <div className={styleCSS.linkImage}>
                          <img
                            src={
                              imageSocmedPreview ? imageSocmedPreview : socmed.image
                            }
                            alt="link image"
                          />
                          <label htmlFor="imageS">Upload</label>
                          <input
                            type="file"
                            id="imageS"
                            name="image"
                            className="d-none"
                            onChange={handleChangeSocmed}
                          />
                        </div>
                        <div className={styleCSS.linkInput}>
                          <label htmlFor="social_media_name">Title Link</label>
                          <input
                            type="text"
                            id="social_media_name"
                            name="social_media_name"
                            autoComplete="off"
                            onChange={handleChangeSocmed}
                            value={socmedForm.social_media_name}
                            placeholder={socmed.social_media_name}
                          />
                          <label htmlFor="url">Link</label>
                          <input
                            type="text"
                            id="url"
                            name="url"
                            autoComplete="off"
                            placeholder={socmed.url}
                            onChange={handleChangeSocmed}
                            value={socmedForm.url}
                          />
                        </div>
                        <button
                          className={styleCSS.addLinkButton}
                          type="submit"
                        >
                          Save Link
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
                </>
            </div>
          </div>
          <div className={styleCSS.createLinkFormTemplatePreview}>
            <img src={Phone} alt="Template" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditeLink;
