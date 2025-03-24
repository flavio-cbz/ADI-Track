# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances avec CI pour respecter le package-lock.json
RUN npm ci

# Copier le reste des fichiers source
COPY . .

# Construire l'application en mode production
RUN npm run build

# Étape de production - image plus légère
FROM node:18-alpine AS runner

WORKDIR /app

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV PORT=3456

# Copier uniquement les fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Exposer le port configuré
EXPOSE 3456

# Commande de démarrage
CMD ["node", "server.js"]

