package models

type SocialMedia struct {
	ID              int    `json:"id" gorm:"primary_key:auto_increment"`
	SocialMediaName string `json:"social_media_name" gorm:"type:varchar(255)"`
	Url             string `json:"url" gorm:"type:varchar(255)"`
	Image           string `json:"image" gorm:"type:varchar(225)"`
	LinkID          int    `json:"link_id"`
	Link            Link   `json:"link"`
}

type SocialMediaResponse struct {
	ID              int    `json:"id"`
	SocialMediaName string `json:"social_media_name"`
	Url             string `json:"url"`
	Image           string `json:"image"`
	LinkID          int    `json:"link_id"`
	Link            Link   `json:"link" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func (SocialMediaResponse) TableName() string {
	return "social_media"
}
