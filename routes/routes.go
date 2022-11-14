package routes

import (
	"github.com/gorilla/mux"
)

func RouteInit(r *mux.Router) {
	AuthRoutes(r)
	LinkRoutes(r)
	SocialMediaRoutes(r)
	UserRoutes(r)
}
