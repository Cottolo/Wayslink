package socialmediadto

type SocialMediaRequest struct {
	LinkID          int    `json:"link_id"`
	SocialMediaName string `json:"social_media_name"`
	Url             string `json:"url"`
	Image           string `json:"image"`
}
