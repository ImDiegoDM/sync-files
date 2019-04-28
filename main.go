package main

import (
	"SyncFiles/api"
	"SyncFiles/utils"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

const (
	port = "8080"
)

func main() {
	r := mux.NewRouter()

	go utils.HashAndSave("./sync")

	api.SetRoutes(r)

	http.Handle("/", r)
	log.Println("Server is runing on port " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
