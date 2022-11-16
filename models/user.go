package models

type User struct {
	ID       int            `json:"id" gorm:"primary_key:auto_increment"`
	FullName string         `json:"full_name" gorm:"type:varchar(255)"`
	Email    string         `json:"email" gorm:"type:varchar(255)"`
	Password string         `json:"-" gorm:"type:varchar(255)"`
	LinkID   int            `json:"link_id"`
	Link     []LinkResponse `json:"link" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type UserResponse struct {
	ID       int    `json:"id"`
	FullName string `json:"full_name"`
	Email    string `json:"email"`
}

func (UserResponse) TableName() string {
	return "users"
}
