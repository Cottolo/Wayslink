package routes

import (
	"server/handlers"
	"server/pkg/middleware"
	"server/pkg/mysql"

	// "server/pkg/postgre"
	"server/repositories"

	"github.com/gorilla/mux"
)

func SocialMediaRoutes(r *mux.Router) {
	socialMediaRepository := repositories.RepositorySocialMedia(mysql.DB)
	h := handlers.HandlerSocialMedia(socialMediaRepository)

	r.HandleFunc("/social-media", middleware.Auth(middleware.UploadFile(h.CreateSocialMedia))).Methods("POST")
	r.HandleFunc("/social-media/{id}", middleware.Auth(middleware.UploadFile(h.EditeSocialMedia))).Methods("PATCH")
	r.HandleFunc("/social-media/{link_id}", h.GetSocialMedia).Methods("GET")
}
