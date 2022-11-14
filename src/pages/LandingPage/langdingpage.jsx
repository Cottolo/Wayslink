import React, { useState, useContext, useEffect } from "react"
import icon from "../../assets/Icon.png"
import device from "../../assets/Device.png"
import { Modal,Form, InputGroup, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { API } from "../../config/api"
import { UserContext } from "../../context/userContext"

const LandingPage = () => {
    const [showRegister, setShowRegister] = useState(false)
    const closeRegister = () => {
        setShowRegister(!showRegister)
    }
    const [showLogin, setShowLogin] = useState(false)
    const closeLogin = () => {
        setShowLogin(!showLogin)
    }
    const changeModal = () => {
        setShowRegister(!showRegister)
        setShowLogin(!showLogin)
    }
    
    const navigate = useNavigate()

    const [message, setMessage] = useState(null);
    const [messageL, setMessageL] = useState(null);
    
    const [state, dispatch] = useContext(UserContext)

    const checkAuth = () => {
        if (state.isLogin === true) {
            navigate("/dashboard");
        }
    }

    checkAuth()
    
    // REGIS
    const [formRegister, setFormRegister] = useState({
        full_name: "",
        email: "",
        password: ""
    })


    const handleChangeRegister = (e) => {
        setFormRegister({
          ...formRegister,
          [e.target.name]: e.target.value,
    })
    }

    const handleSubmitRegister = async(e) => {
        try {
            e.preventDefault()
            const configregister = {
                headers: {
                    "Content-Type" : "application/json"
                }
            }
            
            const body = JSON.stringify(formRegister)
            
            const response = await API.post('/register', body, configregister)
            // console.log("ini regis respon",response)
          
                const alert = (
                  <Alert variant="success" className="py-1">
                    Success
                  </Alert>
                );
                setMessage(alert);
             
              setFormRegister({
                full_name: "",
                email: "",
                password: ""
              })
            
              changeModal()

        } catch (error) {
            console.log(error)
            const alert = (
                <Alert variant="danger" className="py-1">
                  Failed to Register!
                </Alert>
              );
              setMessage(alert);
        }
    }



    
    const [formLogin, setFormLogin] = useState({
        email:"",
        password:""
    })

    const handleLoginChange = (e) => {
        setFormLogin({
            ...formLogin,
            [e.target.name] : e.target.value
        })
    }

    const handleLoginSubmit = async(e) => {
        try {
            e.preventDefault()
            const configlogin = {
                headers : {
                    "Content-Type" : "application/json"
                }
            }

            const bodylogin = JSON.stringify(formLogin)
            const response = await API.post('/login', bodylogin, configlogin)
            console.log(response)
          
                dispatch({
                  type: "LOGIN_SUCCESS",
                  payload: response.data.data,
                });

        } catch (error) {
            console.log(error)
            const alertLogin = (
                <Alert variant="danger" className="py-1">
                  Wrong Email of Password!
                </Alert>
              );
              setMessageL(alertLogin);
        }
    }

    return (
        <div className='bgYellow'>
            <div className='bgGray py-3 d-flex justify-content-between px-4'>
                <div >
                    <img src={icon} alt="icon" />
                </div>
                <div className=''>
                    <button className='me-3 border-0 bgGray fw-bold' onClick={() => setShowLogin(!showLogin)}>Login</button>
                    <button className='bgYellow text-light border-0 text-Light fw-bold rounded-2 py-1 px-2' onClick={() => setShowRegister(!showRegister)}>Register</button>
                </div>
            </div>
            <div className='text-light d-flex py-5 px-4'>
                <div className='my-auto'>
                    <p className='fs-1  fw-bold'>The Only Link You'll Ever Need</p>
                    <p className=''>Add a link for your Social Bio and optimize your social media traffic.</p>
                    <p className=''>safe, fast and easy to use</p>
                    <button className='bg-dark mt-5 text-light fw-bold border-0 rounded-2 py-2 px-5' onClick={() => setShowRegister(!showRegister)}>Get Started For Free</button>
                </div>
                <div className='my-auto'>
                    <img src={device} alt="device" />
                </div>
            </div>

            {/* Form Register */}
            <Modal
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showRegister}
                onHide={closeRegister}
                >
                <div className="mx-3 mt-3">
                    <Modal.Title id="contained-modal-title-vcenter" >
                        <p className='text-dark fw-bold'>Sign Up</p>
                    </Modal.Title>                    
                </div>
                    {message && message}
                <Modal.Body>
                    <Form onSubmit={handleSubmitRegister}>
                    <InputGroup className="mb-3">
                        <Form.Control type="email" 
                        name="email" 
                        value={formRegister.email} 
                        onChange={handleChangeRegister} 
                        className="signupinput" 
                        placeholder="Email" 
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <Form.Control type="password" 
                        name="password" 
                        value={formRegister.password} 
                        onChange={handleChangeRegister} 
                        placeholder="Password" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" 
                        name="full_name" 
                        value={formRegister.full_name} 
                        onChange={handleChangeRegister}  
                        className="signupinput" 
                        placeholder="Full Name" 
                        />
                    </InputGroup>
                    <button className='bgYellow w-100 border-0 rounded-2 text-light fw-bold p-2' type="submit">Register</button>
                    </Form>                    
                </Modal.Body>
                <Modal.Footer>
                    <p className=''>Already have an account ? Klik <span onClick={changeModal} className='border-0 fw-bold'>Here</span></p>
                </Modal.Footer>
            </Modal>

            {/* Form Login  */}
            <Modal
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showLogin}
                onHide={closeLogin}
                >
                <div className="mx-3 mt-3">
                    <Modal.Title id="contained-modal-title-vcenter">
                    <p className='text-dark fw-bold'>Login</p>
                    </Modal.Title>                    
                </div>
                {messageL && messageL}
                <Modal.Body>
                    <Form onSubmit={handleLoginSubmit}>
                    <InputGroup className="mb-3">
                        <Form.Control type="email" className="signupinput" placeholder="Email" 
                        onChange={handleLoginChange}
                        name="email" 
                        value={formLogin.email} 
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <Form.Control type="password" className="signupinput" placeholder="Password" 
                        onChange={handleLoginChange}
                        name="password" 
                        value={formLogin.password} 
                        />
                    </InputGroup>
                    <button className='bgYellow w-100 border-0 rounded-2 text-light fw-bold p-2 ' type="submit" >Login</button>
                    </Form>                    
                </Modal.Body>
                <Modal.Footer>
                    <p className=''>Already have an account ? Klik <span onClick={changeModal} className='border-0 fw-bold'>Here</span></p>
                </Modal.Footer>
            </Modal>
        </div>
    )
    }

export default LandingPage