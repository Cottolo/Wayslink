package socialmediadto

type socialMediaRequest struct {
	LinkID          int    `json:"link_id"`
	socialMediaName string `jsom:"social_media_name"`
	Url             string `json:"url"`
	Image           string `json:"image"`
}
