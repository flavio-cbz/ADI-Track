#!/bin/bash

# Script de déploiement pour ADITrack

# Vérifier si Docker et Docker Compose sont installés
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "Docker et/ou Docker Compose ne sont pas installés. Veuillez les installer avant de continuer."
    exit 1
fi

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "Création du fichier .env..."
    echo "JWT_SECRET=$(openssl rand -base64 32)" > .env
    echo "Fichier .env créé avec un JWT_SECRET généré aléatoirement."
else
    echo "Fichier .env existant détecté."
fi

# Construire et démarrer les conteneurs
echo "Construction et démarrage des conteneurs Docker..."
docker-compose up -d --build

# Vérifier si le déploiement a réussi
if [ $? -eq 0 ]; then
    echo "Déploiement réussi ! ADITrack est accessible à l'adresse http://localhost:3456"
else
    echo "Une erreur s'est produite lors du déploiement."
    exit 1
fi

echo "Pour arrêter l'application, exécutez: docker-compose down"

