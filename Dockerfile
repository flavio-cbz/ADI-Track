# Étape de construction
FROM node:18-alpine AS builder
WORKDIR /app

# Copier les fichiers de dépendances et installer
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copier le reste des fichiers et construire l'application
COPY . .
RUN npm run build

# Étape de production
FROM node:18-alpine AS runner
WORKDIR /app

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV PORT=3456
ENV JWT_SECRET=VotreSecretIci  # Définissez votre secret ici ou via docker run -e

# Copier les fichiers nécessaires
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
# On ne copie pas le dossier standalone car il n'existe pas
COPY --from=builder /app/.next ./.next

# Exposer le port configuré
EXPOSE 3456

# Utiliser la commande par défaut de Next.js pour démarrer le serveur
CMD ["npx", "next", "start", "-p", "3456"]
