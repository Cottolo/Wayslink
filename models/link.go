package models

type Link struct {
	ID          int                   `json:"id" gorm:"primary_key:auto_increment"`
	Title       string                `json:"title" gorm:"type:varchar(255)"`
	Description string                `json:"description" gorm:"type:varchar(255)"`
	UniqueLink  string                `json:"unique_link"`
	Image       string                `json:"image" gorm:"type:varchar(255)"`
	Template    string                `json:"template"`
	Visit       int                   `json:"visit"`
	SocialMedia []SocialMediaResponse `json:"social_media" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	UserID      int                   `json:"user_id"`
	User        UserResponse          `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type LinkResponse struct {
	ID     int          `json:"id"`
	Title  string       `json:"title"`
	UserID int          `json:"user_id"`
	User   UserResponse `json:"user"`
}

func (LinkResponse) TableName() string {
	return "links"
}
