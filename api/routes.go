package api

import (
	"SyncFiles/api/upload"
	"net/http"

	"github.com/gorilla/mux"
)

const (
	downloadPath     = "/sync/"
	downloadEndPoint = "/download/"
)

// SetRoutes set the routes for web applications
func SetRoutes(router *mux.Router) {

	uploadHandler := upload.Handler{
		Path:      "./sync/",
		MaxMemory: 20 * 1024,
	}
	router.PathPrefix(downloadEndPoint).Methods("POST").Handler(http.StripPrefix(downloadEndPoint, uploadHandler))

	// static files for download
	router.PathPrefix(downloadEndPoint).Methods("GET").Handler(http.StripPrefix(downloadEndPoint, http.FileServer(http.Dir("."+downloadPath))))
}
