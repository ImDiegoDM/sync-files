package upload

import (
	"SyncFiles/api/apimessage"
	"SyncFiles/utils"
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

func splitFileAndPath(pathToFile string) (string, string) {
	splited := strings.SplitAfter(pathToFile, "/")

	file := splited[len(splited)-1]

	path := ""
	for i := 0; i < len(splited)-1; i++ {
		path += splited[i]
	}

	return path, file
}

func exists(path string) bool {
	if _, err := os.Stat("/path/to/whatever"); os.IsNotExist(err) {
		return false
	}

	return true
}

func (u Handler) createIfNotExists(pathToFile string) (*os.File, error) {
	path, _ := splitFileAndPath(pathToFile)

	os.MkdirAll(u.Path+path, os.ModePerm)

	file, err := os.Create(u.Path + pathToFile)
	if err != nil {
		return nil, err
	}

	return file, err
}

func (u Handler) replaceFile(relativePathToFile string, newFile multipart.File) error {

	fmt.Println(u.Path + relativePathToFile)

	file, err := u.createIfNotExists(relativePathToFile)
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
	path := url
	if ext == "" {
		if string(url[len(url)-1]) != "/" {
			path += "/"
		}
		path += handler.Filename
	} else {
		fileExt := filepath.Ext(url)
		newFileExt := filepath.Ext(handler.Filename)

		if fileExt != newFileExt {
			apimessage.ThrowAPIError(w, "the file you try to replace have a diferent extension that the file we recived", http.StatusUnprocessableEntity)
			return
		}
	}

	err = u.replaceFile(path, file)

	if err != nil {
		fmt.Println(err)
		apimessage.ThrowAPIError(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	apimessage.APIResponse(w, "the file has been successfully uploaded")
	go utils.HashAndSave("./sync")
	return
}
