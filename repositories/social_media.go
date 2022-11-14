package repositories

import (
	"server/models"

	"gorm.io/gorm"
)

type SocialMediaRepository interface {
	CreateSocialMedia(socialMedia models.SocialMedia) (models.SocialMedia, error)
	GetSocialMedia(linkID int) ([]models.SocialMedia, error)
}

func RepositorySocialMedia(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) CreateSocialMedia(socialMedia models.SocialMedia) (models.SocialMedia, error) {
	err := r.db.Create(&socialMedia).Error

	return socialMedia, err
}

func (r *repository) GetSocialMedia(linkID int) ([]models.SocialMedia, error) {
	var socialMedias []models.SocialMedia

	err := r.db.Find(&socialMedias, "link_id = ?", linkID).Error

	return socialMedias, err
}
