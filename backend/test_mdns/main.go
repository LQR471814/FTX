package main

import (
	"context"
	"log"
	"os"
	"os/signal"

	"github.com/grandcat/zeroconf"
)

const (
	MDNS_SERVICE_STR = "_test._tcp"

	MDNS_DESCRIPTOR = "An mdns testing service"
)

func Register(name string) error {
	_, err := zeroconf.Register(
		name, MDNS_SERVICE_STR, "", 0,
		[]string{MDNS_DESCRIPTOR}, nil,
	)

	return err
}

func ListenService(ctx context.Context, service string, callback func(*zeroconf.ServiceEntry)) {
	resolver, err := zeroconf.NewResolver(nil)
	if err != nil {
		panic(err)
	}

	entries := make(chan *zeroconf.ServiceEntry)
	go func() {
		for entry := range entries {
			callback(entry)
		}
	}()

	resolver.Browse(ctx, service, "local", entries)
}

func CancelOnSignal(cancel context.CancelFunc) {
	quitChan := make(chan os.Signal, 1)
	signal.Notify(quitChan, os.Interrupt)
	go func() {
		for range quitChan {
			cancel()
		}
	}()
}

func main() {
	hostname, err := os.Hostname()
	if err != nil {
		panic(err)
	}

	Register(hostname)
	c, cancel := context.WithCancel(context.Background())

	CancelOnSignal(cancel)
	ListenService(c, MDNS_SERVICE_STR, func(se *zeroconf.ServiceEntry) {
		log.Println(se)
	})

	<-c.Done()
}
