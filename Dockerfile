# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances en respectant le package-lock.json
RUN npm ci --legacy-peer-deps

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

# Copier les fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
# La ligne suivante a été supprimée car le dossier standalone n'existe pas
# COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Exposer le port configuré
EXPOSE 3456

# Commande de démarrage
CMD ["node", "server.js"]
