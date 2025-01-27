package config

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

var Values = initConfig()

type Config struct {
	DbHost                   string
	DbPort                   int
	DbUser                   string
	DbPassword               string
	DbName                   string
	DbConn                   string
	JwtSecret                []byte
	UploadPath               string
	MinVMMemory              string
	MaxVMMemory              string
	VMCPUs                   uint32
	VMSSHPUBLICKEY           string
	ChallengeLifetimeMinutes int
	BackendUrl               string
	ChallengeDomain          string
	VMImageUrl               string
	AdminPassword            string
	Namespace                string
	CTFDURL                  string
	CTFDAPIToken             string
	IngressClassName         string
	IngressTlsSecretName     string
	IngressAnnotations       string
	JwksUrl                  string
	RootCert                 string
}

func initConfig() Config {
	_ = godotenv.Load()

	var cfg Config
	err := envconfig.Process("", &cfg)
	if err != nil {
		log.Fatal("Error loading config")
	}

	if len(cfg.DbConn) == 0 {
		cfg.DbConn = fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable",
			cfg.DbUser, cfg.DbPassword, cfg.DbHost, cfg.DbPort, cfg.DbName)
	}

	return cfg
}
