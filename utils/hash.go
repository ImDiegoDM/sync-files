package utils

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

// Hash a file in crc32 and return the checksum
func Hash(path string) (string, error) {
	file, err := ioutil.ReadFile(path)
	if err != nil {
		return "", err
	}

	hash := sha256.Sum256(file)

	return hex.EncodeToString(hash[:]), nil
}

// HashItems represente a map of HashItem
type HashItems map[string]HashItem

// HashItem represent a hashed file or a folder with hashed files
type HashItem struct {
	Checksum interface{} `json:"checksum"`
	SubItens HashItems   `json:"subItens"`
}

// HashFolder hashes an intire foleder and return represted in HashItems form
func HashFolder(path string) (HashItems, error) {
	files, err := ioutil.ReadDir(path)
	if err != nil {
		return nil, err
	}

	hashes := HashItems{}

	for _, file := range files {
		filePath := path
		fileName := file.Name()

		if fileName[0] == '.' {
			continue
		}

		if path[len(path)-1] != '/' {
			filePath += "/"
		}
		filePath += fileName

		if !file.IsDir() {
			hash, err := Hash(filePath)

			if err != nil {
				return nil, err
			}

			hashes[file.Name()] = HashItem{
				Checksum: hash,
				SubItens: nil,
			}
			continue
		}

		hashed, err := HashFolder(filePath)

		if err != nil {
			return nil, err
		}

		hashes[file.Name()] = HashItem{
			Checksum: nil,
			SubItens: hashed,
		}
	}

	return hashes, nil
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func saveJSON(json string) {
	f, err := os.Create("hashed.json")
	check(err)

	defer f.Close()

	_, wError := f.WriteString(json)

	check(wError)

}

// HashAndSave hash an folder an save the json representation os that folder hashed
func HashAndSave(path string) {
	hashed, err := HashFolder(path)
	check(err)

	jsonString, err := json.MarshalIndent(hashed, "", "  ")

	check(err)

	saveJSON(string(jsonString))

	fmt.Println("sync folder hashed and saved")
}
