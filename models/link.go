package models

type Link struct {
	ID          int           `json:"id" gorm:"primary_key:auto_increment"`
	Title       string        `json:"title" gorm:"type:varchar(255)"`
	Description string        `json:"description" gorm:"type:varchar(255)"`
	Image       string        `json:"image" gorm:"type:varchar(255)"`
	Template    string        `json:"template"`
	SocialMedia []SocialMedia `json:"social_media"`
	UserID      int           `json:"user_id"`
	User        User          `json:"user"`
	UniqueLink  string        `json:"unique_link"`
}

type UserLink struct {
	ID int `json:"id"`
}

func (UserLink) tableName() string {
	return "links"
}

type LinkSocialMedia struct {
	ID int `json:"id"`
}
