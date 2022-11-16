import react, { useState, useContext, useEffect } from "react";
import styleCSS from "./CreateLink.module.css";
import { API } from "../../config/api";
import { UserContext } from "../../context/userContext";
import Phone from "../../assets/Phone1.png";
import Chess from "../../assets/Chess.png";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

const CreateLink = ({ template }) => {
  
  const [showSocmed, setShowSocmed] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const [linkID, setLinkID] = useState("");
  
  // LINK
  
  const [preview, setPreview] = useState(null);
  const [formLink, setformLink] = useState({
    title: "",
    description: "",
    image: "",
    template,
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
  const handleSubmitLink = async (e) => {
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
      formData.set("template", template);

      const response = await API.post("/link", formData, config);
      console.log(response);
console.log(formData);
        setShowSocmed(true);
        setLinkID(response.data.data.id);
     
    } catch (error) {
      console.log(error);
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed
        </Alert>
      );
      setMessage(alert);
    }
  };


  // SOCMED
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
  };

  
  // Submit Socmed
  const handleSubmitSocmed = async (e) => {
    try {
      e.preventDefault();
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
      
      const response = await API.post("/social-media", formData, config);
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

  console.log(socmedForm);
  return (
    <div className={styleCSS.createLinkContent}>
      <div className={styleCSS.createLinkHeader}>
        <p>Template</p>
      </div>
      <div className={styleCSS.createLinkForm}>
        <div className={styleCSS.createLinkFormTop}>
          <p>Create Link</p>
          
        </div>
        <div className={styleCSS.createLinkFormBottom}>
          <div className={styleCSS.createLinkFormInput}>
            <div className={styleCSS.formLink}>
              <form onSubmit={handleSubmitLink}>
                <div className={styleCSS.preview}>
                  {preview != null? <img className="w-50 h-50" src={preview} alt="Preview" />: <img src={Chess}/>}
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
                    autoComplete="off"
                    required
                  />
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    name="description"
                    onChange={onChangeLink}
                    value={formLink.description}
                    autoComplete="off"
                    required
                  />
                  <div className="mt-3">
                    <button className={styleCSS.addLinkButton} type="submit">
                      Publish Link
                    </button>
                  </div>
                </div>
              </form>
              {showSocmed && (
                <>
                  <div className={styleCSS.secondInput}>
                    <div className={styleCSS.linksCard}>
                      <form id="sosmedForm" onSubmit={handleSubmitSocmed}>
                        <div className={styleCSS.linkImage}>
                          <img
                            src={
                              imageSocmedPreview ? imageSocmedPreview : Chess
                            }
                            alt="link image"
                          />
                          <label htmlFor="imageSocmed">Upload</label>
                          <input
                            type="file"
                            id="imageSocmed"
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
                            required
                            onChange={handleChangeSocmed}
                            value={socmedForm.social_media_name}
                          />
                          <label htmlFor="url">Link</label>
                          <input
                            type="text"
                            id="url"
                            name="url"
                            autoComplete="off"
                            required
                            placeholder="ex: http://instagram.com/beematch6"
                            onChange={handleChangeSocmed}
                            value={socmedForm.url}
                          />
                        </div>
                        <button
                          className={styleCSS.addLinkButton}
                          type="submit"
                        >
                          Add new Link
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              ) } 
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

export default CreateLink;
