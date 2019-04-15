package main

import (
	"SyncFiles/utils"
	"encoding/json"
	"fmt"
	"os"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func saveInJson(json string) {
	f, err := os.Create("hashed.json")
	check(err)

	defer f.Close()

	_, wError := f.WriteString(json)

	check(wError)

}

func main() {
	hashed, err := utils.HashFolder("./sync")
	check(err)

	jsonString, err := json.MarshalIndent(hashed, "", "  ")

	check(err)

	saveInJson(string(jsonString))

	fmt.Println("Saved")
}
