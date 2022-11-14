package repositories

import (
	"server/models"

	"gorm.io/gorm"
)

type LinkRepository interface {
	CreateLInk(link models.Link) (models.Link, error)
	FindUserLink(userID int) ([]models.Link, error)
	GetLink(unique_link string) (models.Link, error)
	DeleteLink(link models.Link, unique_link string) (models.Link, error)
	UpdateLink(link models.Link, unique_link string) (models.Link, error)
}

func RepositoriesLink(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) CreateLInk(link models.Link) (models.Link, error) {
	err := r.db.Create(&link).Error

	return link, err
}

func (r *repository) FindUserLink(userID int) ([]models.Link, error) {
	var links []models.Link
	err := r.db.Preload("User").Preload("SocialMedia").Find(&links, "user_id = ?", userID).Error

	return links, err
}

func (r *repository) GetLink(unique_link string) (models.Link, error) {
	var links models.Link
	err := r.db.Preload("User").Preload("SocialMedia").First(&links, "unique_link=?", unique_link).Error

	return links, err
}

func (r *repository) UpdateLink(link models.Link, unique_link string) (models.Link, error) {
	err := r.db.Model(&link).Where("unique_link=?", unique_link).Updates(&link).Error

	return link, err
}

func (r *repository) DeleteLink(link models.Link, unique_link string) (models.Link, error) {
	err := r.db.Delete(&link).Error
	return link, err
}
