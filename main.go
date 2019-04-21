package main

import (
	"SyncFiles/api"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	api.SetRoutes(r)

	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
