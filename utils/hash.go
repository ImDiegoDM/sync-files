package utils

import (
	"fmt"
	"hash/crc32"
	"io/ioutil"
)

func Hash(path string) (uint32, error) {
	file, err := ioutil.ReadFile(path)
	if err != nil {
		return 0, err
	}

	return crc32.ChecksumIEEE(file), nil
}

type HashItems map[string]HashItem

type HashItem struct {
	Checksum interface{} `json:"checksum"`
	SubItens HashItems   `json:"SubItens"`
}

func HashFolder(path string) (HashItems, error) {
	files, err := ioutil.ReadDir(path)
	if err != nil {
		return nil, err
	}
	var hashes HashItems = HashItems{}

	for _, file := range files {
		fmt.Println(file.Name())
		filePath := path
		if path[len(path)-1] != '/' {
			filePath += "/"
		}
		filePath += file.Name()

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
			Checksum: "",
			SubItens: hashed,
		}
	}

	return hashes, nil
}
