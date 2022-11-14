import React from "react"
import SideNavbar from "../../components/sidebar/sidebar"
import ProfileComponent from "../../components/profile/profile"

const Profile = () => {
    return (
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{width : "20%"}}>
                <SideNavbar />
            </div>
            <div style={{width : "80%"}}>
            <ProfileComponent />
            </div>
        </div>
    )
}

export default Profile