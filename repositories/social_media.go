package repositories

import (
	"server/models"

	"gorm.io/gorm"
)

type SosmedRepository interface {
	CreateSosmed(socialMedia models.SocialMedia) (models.SocialMedia, error)
	GetSocialMedia(linkID int) ([]models.SocialMedia, error)
}

func RepositorySosmed(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) CreateSosmed(sosmed models.SocialMedia) (models.SocialMedia, error) {
	err := r.db.Create(&sosmed).Error

	return sosmed, err

}

func (r *repository) FindSosmedsByLinkID(linkID int) ([]models.SocialMedia, error) {
	var sosmeds []models.SocialMedia

	err := r.db.Find(&sosmeds, "link_id = ?", linkID).Error

	return sosmeds, err
}
