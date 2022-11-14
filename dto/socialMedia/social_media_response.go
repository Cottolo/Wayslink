package socialmediadto

type SocialMediaResponse struct {
	ID              int    `json:"id"`
	SocialMediaName string `json:"social_media_name"`
	Url             string `json:"url"`
	Image           string `json:"image"`
	LinkID          int    `json:"link_id"`
}
