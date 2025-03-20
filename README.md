# Application Quiz Pimenté

Cette application de quiz interactive a été développée avec [Angular](https://angular.io/) version 19.2.3.

## Fonctionnalités

- Quiz thématique sur les piments
- Système de difficulté progressive (de Facile à Brûlant)
- Gestion des participants avec comptage des points
- Affichage des indices (choix multiples) avec réduction des points
- Animation de transition entre les questions
- Option "Aucun vainqueur" si personne ne trouve la réponse

## Prérequis

- Node.js (version 18.x ou supérieure)
- NPM (version 8.x ou supérieure)

## Installation

Pour installer les dépendances du projet :

```bash
npm install
```

## Serveur de développement

Pour démarrer le serveur de développement local :

```bash
npm start
```

Une fois le serveur démarré, ouvrez votre navigateur et accédez à `http://localhost:4200/`. L'application se rechargera automatiquement à chaque modification des fichiers source.

## Construction pour la production

Pour construire le projet pour la production :

```bash
ng build --configuration production
```

Cette commande compilera votre projet et stockera les fichiers de build dans le répertoire `dist/`. Le build de production optimise votre application pour les performances et la vitesse.

## Déploiement

### Sur un hébergement web standard (comme O2switch)

1. Construisez l'application pour la production
2. Téléversez le contenu du dossier `dist/quizz-app/browser` vers votre serveur web
3. Créez un fichier `.htaccess` à la racine du site avec le contenu suivant :

```
# Activer le moteur de réécriture
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Définir la base de réécriture
  RewriteBase /
  
  # Ne pas appliquer les règles aux fichiers existants
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Rediriger toutes les autres requêtes vers index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Protection contre l'accès aux fichiers .htaccess
<Files .htaccess>
  Order allow,deny
  Deny from all
</Files>

# Désactiver l'affichage des répertoires
Options -Indexes

# Activer la compression GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/json
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE text/xml application/xml text/x-component
  AddOutputFilterByType DEFLATE application/xhtml+xml application/rss+xml application/atom+xml
  AddOutputFilterByType DEFLATE image/svg+xml application/vnd.ms-fontobject application/x-font-ttf font/opentype
</IfModule>

# Configurer le cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType application/x-shockwave-flash "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresDefault "access plus 2 days"
</IfModule>
```

## Structure du projet

- `src/app/components` - Tous les composants de l'application
- `src/app/models` - Les interfaces et modèles de données
- `src/app/services` - Les services pour la gestion des données

## Personnalisation

Pour ajouter ou modifier les questions du quiz, modifiez la méthode `getDefaultQuestions()` dans le fichier `src/app/services/quiz.service.ts`.

## Auteur

Quiz Pimenté - Développé avec passion 🌶️
