package linkdto

import "server/models"

type LinkResponse struct {
	ID          int                  `json:"id"`
	Title       string               `json:"title"`
	Description string               `json:"description"`
	Image       string               `json:"image"`
	Template    string               `json:"template"`
	SocialMedia []models.SocialMedia `json:"social_media" `
	UniqueLink  string               `json:"unique_link"`
	UserID      int                  `json:"user_id"`
	User        models.User          `json:"user"`
	Visit       int                  `json:"visit"`
}
