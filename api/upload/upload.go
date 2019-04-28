package upload

import (
	"SyncFiles/api/apimessage"
	"errors"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// Upload a file to the sync folder
func Upload(path string) {
	panic("not implemented yet")
}

func breakURL(path string) []string {
	return strings.Split(path, "/")
}

func isFile(name string) (bool, string) {
	splited := strings.Split(name, ".")
	if len(splited) <= 1 {
		return false, ""
	}
	fileType := splited[len(splited)-1]
	return true, fileType
}

// Handler is a handler for http calls that handle file upload
type Handler struct {
	Path      string
	MaxMemory int64
}

func fileIsMissing(w http.ResponseWriter) {
	apimessage.ThrowAPIError(w, "the file param is missing", http.StatusUnprocessableEntity)
}

func unsupportedMediaType(w http.ResponseWriter) {
	apimessage.ThrowAPIError(w, "request Content-Type isn't multipart/form-data", http.StatusUnsupportedMediaType)
}

func isMultipart(r *http.Request) bool {
	contentType := r.Header.Get("Content-type")

	return strings.Contains(contentType, "multipart/form-data")
}

func (u Handler) replaceFile(relativePathToFile string, newFile multipart.File, handler *multipart.FileHeader) error {
	fileExt := filepath.Ext(relativePathToFile)
	newFileExt := filepath.Ext(handler.Filename)

	if fileExt != newFileExt {
		return errors.New("The files extensions did not match")
	}

	fmt.Println(u.Path + relativePathToFile)

	file, err := os.Create(u.Path + relativePathToFile)
	if err != nil {
		return err
	}
	defer file.Close()

	filebytes, readError := ioutil.ReadAll(newFile)
	if readError != nil {
		return readError
	}

	_, writeError := file.Write(filebytes)
	if writeError != nil {
		return writeError
	}

	file.Sync()

	return nil
}

// ServeHTTP handle the http for Handler struct and upload a file
func (u Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(u.MaxMemory)
	url := r.URL.Path

	isMultipartOk := isMultipart(r)

	if !isMultipartOk {
		unsupportedMediaType(w)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		fileIsMissing(w)
		return
	}
	defer file.Close()

	ext := filepath.Ext(url)
	if ext != "" {

		err = u.replaceFile(url, file, handler)

		if err != nil {

			if err.Error() == "The files extensions did not match" {
				apimessage.ThrowAPIError(w, "the file you try to replace have a diferent extension that the file we recived", http.StatusUnprocessableEntity)
				return
			}

			apimessage.ThrowAPIError(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		apimessage.APIResponse(w, "the file has been successfully uploaded")
		return
	}

	fmt.Fprintln(w, "last is not a file")
}
