package socialmediadto

type SocialMediaRequest struct {
	LinkID          int    `json:"link_id"`
	SocialMediaName string `jsom:"social_media_name"`
	Url             string `json:"url"`
	Image           string `json:"image"`
}
