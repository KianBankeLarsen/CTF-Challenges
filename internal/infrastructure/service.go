package infrastructure

import (
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func BuildHttpService(namespace string) *corev1.Service {
	// Kubernetes Service HTTP
	return &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "web",
			Namespace: namespace,
			Labels:    map[string]string{},
		},
		Spec: corev1.ServiceSpec{
			Ports: []corev1.ServicePort{
				{
					Name:     "http",
					Protocol: corev1.ProtocolTCP,
					Port:     80,
				},
			},
			Selector: map[string]string{
				"vm.kubevirt.io/name": "challenge",
			},
			Type: corev1.ServiceTypeClusterIP,
		},
	}
}

func BuildHttpsService(namespace string) *corev1.Service {
	// Kubernetes Service HTTPS
	return &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "webs",
			Namespace: namespace,
			Labels:    map[string]string{},
		},
		Spec: corev1.ServiceSpec{
			Ports: []corev1.ServicePort{
				{
					Name:     "https",
					Protocol: corev1.ProtocolTCP,
					Port:     443,
				},
			},
			Selector: map[string]string{
				"vm.kubevirt.io/name": "challenge",
			},
			Type: corev1.ServiceTypeClusterIP,
		},
	}
}