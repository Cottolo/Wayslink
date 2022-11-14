package authdto

type LoginResponse struct {
	ID       int    `gorm:"type: int" json:"id"`
	Email    string `gorm:"type: varchar(255)" json:"email"`
	FullName string `gorm:"type: varchar(255)" json:"full_name"`
	Token    string `gorm:"type: varchar(255)" json:"token"`
}

type AuthResponse struct {
	ID       int    `gorm:"type: int" json:"id"`
	Email    string `gorm:"type: varchar(255)" json:"email"`
	FullName string `gorm:"type: varchar(255)" json:"full_name"`
	Token    string `gorm:"type: varchar(255)" json:"token"`
}

type CheckAuthResponse struct {
	ID       int    `gorm:"type: int" json:"id"`
	FullName string `gorm:"type: varchar(255)" json:"full_name"`
	Email    string `gorm:"type: varchar(255)" json:"email"`
}
