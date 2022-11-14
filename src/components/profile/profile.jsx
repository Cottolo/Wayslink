import React, { useState, useEffect, useContext, useRef } from "react"
import styleCSS from './profile.module.css'
import { UserContext } from "../../context/userContext"
import { API } from "../../config/api"
import { useQuery } from "react-query"
import { Link, Navigate, useNavigate } from "react-router-dom"

const ProfileComponent = () => {
    const [profile, setProfile] = useState({})
    const [state, dispatch] = useContext(UserContext);
    let id = state.user.id
    const navigate=useNavigate()
    console.log(state.user);
    
    // GET PROFILE
    const getProfile = async(id) => {
        try {
            const response = await API.get('/user/'+id)
            setProfile(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    //EDIT PROFILE
    
    const [form, setForm] = useState({
        full_name: '',
        email: '',
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
          
            formData.set("full_name", form.full_name);
            formData.set("email", form.email);
            
            const config= {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${localStorage.token}`,
                }
            }
                        
            const response = await API.patch("/user/" + id ,formData,config)
        } catch (error) {
            console.log(error);
        }
    };
   
    const deleteById = async (e) => {
        e.preventDefault()
        try {
        const config= {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${localStorage.token}`,
                }
        }
        await API.delete(`/user/${id}`,config);
        dispatch({
            type: "LOGOUT",
          });
          navigate("/");
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        getProfile(id)
    }, [])

    return (
        <form onSubmit={(e)=>handleSubmit(e) } className={styleCSS.pageProfileContent}>
            <div className={styleCSS.headerProfile}>
                <p>Profile</p>
            </div>
            <div className={styleCSS.bodyProfile}>
                <p className={styleCSS.profileTitle}>My Information</p>
                <div className={styleCSS.profileCard}>
                        <label>Name</label>
                        <input type="text" 
                        name="full_name"
                        placeholder={profile?.full_name}
                        onChange={handleChange}
                        value={form?.full_name}
                        />
                        <label>Email</label>
                        <input type="email" 
                        name="email"
                        placeholder={profile?.email}
                        onChange={handleChange}
                        value={form?.email} 
                        />
                </div>
                <div className={styleCSS.profileButton}>
                    <button type="submit" className={styleCSS.tombolSimpan}>Save Account</button>
                    <button onClick={deleteById} className={styleCSS.tombolHapus}>
                        DeleteAccout
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ProfileComponent