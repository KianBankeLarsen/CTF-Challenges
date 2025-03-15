package handlers

import (
	"deployer/internal/auth"
	"deployer/internal/infrastructure"
	"deployer/internal/storage"
	"net/http"

	"github.com/gin-gonic/gin"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

// ChallengeStop godoc
// @Summary      Challenge Stop
// @Tags         challenges
// @Param        id	path		string				true	"Challenge ID"
// @Accept       json
// @Produce      json
// @Router       /challenges/{id}/stop [post]
// @Security BearerAuth
func StopChallenge(c *gin.Context) {
	challengeId := c.Param("id")
	userId := auth.GetCurrentUserId(c)

	challenge, err := storage.GetChallengeWrapper(challengeId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}

	instanceIdChallenge, err := infrastructure.GetRunningChallengeInstanceId(c, userId, challenge.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	instanceIdTest, err := infrastructure.GetRunningTestInstanceId(c, challenge.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if instanceIdChallenge == "" && instanceIdTest == "" {
		c.JSON(http.StatusNotFound, gin.H{"message": "Challenge instance not running"})
		return
	}

	if instanceIdChallenge != "" {
		deleteNamespace(c, instanceIdChallenge, infrastructure.GetNamespaceNameChallenge)
	}

	if instanceIdTest != "" {
		deleteNamespace(c, instanceIdTest, infrastructure.GetNamespaceNameTest)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Stopping challenge",
	})
}

func deleteNamespace(c *gin.Context, instanceId string, getNameSpace func(string) string) {
	kubeconfig := infrastructure.GetKubeConfigSingleton()
	clientset, err := kubernetes.NewForConfig(kubeconfig)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = clientset.CoreV1().Namespaces().Delete(c, getNameSpace(instanceId), metav1.DeleteOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}
