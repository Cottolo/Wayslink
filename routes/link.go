package routes

import (
	"server/handlers"
	"server/pkg/middleware"
	"server/pkg/mysql"
	"server/repositories"

	"github.com/gorilla/mux"
)

func LinkRoutes(r *mux.Router) {
	linkRepository := repositories.RepositoriesLink(mysql.DB)
	h := handlers.HandlerLink(linkRepository)

	r.HandleFunc("/link", middleware.Auth(middleware.UploadFile(h.CreateLInk))).Methods("POST")
	r.HandleFunc("/links", middleware.Auth(h.FindUserLink)).Methods("GET")
	r.HandleFunc("/link/{unique_link}", h.GetLink).Methods("GET")
	r.HandleFunc("/link/{unique_link}", middleware.Auth(h.DeleteLink)).Methods("DELETE")
	r.HandleFunc("/link/{unique_link}", h.UpdateLink).Methods("PATCH")

}
