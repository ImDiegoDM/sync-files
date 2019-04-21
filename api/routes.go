package api

import (
	"net/http"

	"github.com/gorilla/mux"
)

const (
	downloadPath     = "/sync/"
	downloadEndPoint = "/download/"
)

// SetRoutes set the routes for web applications
func SetRoutes(router *mux.Router) {
	router.PathPrefix(downloadEndPoint).Handler(http.StripPrefix(downloadEndPoint, http.FileServer(http.Dir("."+downloadPath))))
}
