package models

type SocialMedia struct {
	ID              int    `json:"id" gorm:"primary_key:auto_increment"`
	SocialMediaName string `jsoon:"social_media_name" gorm:"type:varchar(255)"`
	Url             string `json:"url" gorm:"type:varchar(255)"`
	Image           string `json:"image" gorm:"type:varchar(225)"`
	LinkID          int    `json:"link_id"`
	Link            Link   `json:"link"`
}

type SocialMediaLink struct {
	ID int `json:"id"`
}

func (SocialMediaLink) TableName() string {
	return "socialmedias"
}
