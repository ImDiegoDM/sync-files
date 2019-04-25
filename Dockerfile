FROM golang:1.11 as build

WORKDIR /go/src/SyncFiles

COPY . ./

RUN go get github.com/gorilla/mux

RUN CGO_ENABLED=0 go build -o main . 

FROM alpine:latest

WORKDIR /root/

COPY --from=build /go/src/SyncFiles/main .
COPY --from=build /go/src/SyncFiles/sync ./sync

EXPOSE 8080

CMD ./main