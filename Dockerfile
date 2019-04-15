FROM golang:1.8

WORKDIR /go/src/app

RUN go get github.com/go-martini/martini

CMD go run main.go