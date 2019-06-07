package api

import (
	"SyncFiles/api/apimessage"
	"SyncFiles/api/upload"
	"SyncFiles/utils"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
)

const (
	downloadPath     = "/sync/"
	downloadEndPoint = "/download/"
)

func serveHash(w http.ResponseWriter, r *http.Request) {
	hashPath := "./hashed.json"

	file, err := ioutil.ReadFile(hashPath)
	if err != nil {
		apimessage.ThrowAPIError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.Write(file)
	go utils.HashAndSave("./sync")
}

// SetRoutes set the routes for web applications
func SetRoutes(router *mux.Router) {

	uploadHandler := upload.Handler{
		Path:      "./sync/",
		MaxMemory: 20 * 1024,
	}
	router.PathPrefix(downloadEndPoint).Methods("POST").Handler(http.StripPrefix(downloadEndPoint, uploadHandler))

	// static files for download
	router.PathPrefix(downloadEndPoint).Methods("GET").Handler(http.StripPrefix(downloadEndPoint, http.FileServer(http.Dir("."+downloadPath))))

	router.HandleFunc("/hash", serveHash).Methods("GET")
}
