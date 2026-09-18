# Vayrix

Plateforme de transport (VTC) pour le marché camerounais — site public + dashboard admin.

## Structure

```
app/
  page.tsx              → Site public (accueil)
  chauffeurs/page.tsx   → Recrutement chauffeurs
  admin237/page.tsx     → Connexion admin
  dashboard/            → Dashboard admin (protégé)
  api/mock/             → Routes API mock
lib/
  api.ts               → Couche d'accès API centralisée
  i18n/                → Système de traduction (fr.json, en.json, hook)
components/public/      → Composants du site public
```

## Brancher le vrai backend (NestJS)

1. **API content** : Toutes les données du site public passent par `lib/api.ts`.
   - Remplacer `BASE_URL` par l'URL du backend NestJS.
   - Supprimer les routes sous `app/api/mock/`.
   - Les composants n'ont pas besoin de modification.

2. **Authentification admin** :
   - Le formulaire `/admin237` appelle `login()` dans `lib/api.ts`.
   - En production, le backend NestJS doit :
     - Valider les credentials (bcrypt + JWT)
     - Définir un cookie `httpOnly` (Secure, SameSite=Strict)
     - Ne pas retourner le token dans le body JSON
   - Modifier `login()` pour utiliser `credentials: 'include'`
   - Remplacer la route mock `app/api/mock/auth/login/route.ts`

3. **Traductions** :
   - Ajouter des clés dans `lib/i18n/fr.json` et `lib/i18n/en.json`
   - Utiliser `const { t } = useTranslations()` dans les composants
   - Appeler `t('nav.home')` pour récupérer la valeur

## Illustrations

Les SVG dans `components/public/illustrations.tsx` sont des placeholders.
Pour remplacer par de vrais visuels :
- Remplacer les composants (`RouteIllustration`, `PhoneIllustration`, etc.)
- Garder la même interface (`{ className?: string }`)
- Utiliser des images optimisées (WebP/AVIF) servies localement

## Démo admin

- Email : `admin@vayrix.cm`
- Mot de passe : `vayrix2025`

## Développement

```bash
npm install
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Démarrer le build
```
