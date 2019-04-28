package apimessage

import (
	"encoding/json"
	"net/http"
)

// APIError is a struct for sending api error to the user
type APIError struct {
	Message string `json:"message"`
}

func apiMessage(w http.ResponseWriter, message string, status int) {
	apiError := APIError{
		Message: message,
	}

	errorToSend, err := json.Marshal(apiError)

	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("error parsing apierror message"))
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(errorToSend)
}

// APIResponse send a message with the status code 200 pre included
func APIResponse(w http.ResponseWriter, message string) {
	apiMessage(w, message, 200)
}

// ThrowAPIError send a message structed in the apiError form for user
func ThrowAPIError(w http.ResponseWriter, message string, status int) {
	apiMessage(w, message, status)
}
