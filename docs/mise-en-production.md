# Mise en production (une seule fois)

## 1. Accès SSH à Infomaniak

1. Manager Infomaniak → Hébergement web → **FTP / SSH** → créer (ou activer) un utilisateur avec accès SSH.
2. Noter : serveur (ex. `xxxx.ftp.infomaniak.com`), utilisateur, et le **dossier racine du site** (Manager → Sites → institutclairdelune.ch → dossier).
3. Clé SSH dédiée :
   ```sh
   ssh-keygen -t ed25519 -f ~/.ssh/clairdelune -C clairdelune-deploy
   ssh-copy-id -i ~/.ssh/clairdelune.pub <utilisateur>@<serveur>   # ou coller la clé publique dans le Manager
   ```
4. `~/.ssh/config` :
   ```
   Host clairdelune
     HostName <serveur>
     User <utilisateur>
     IdentityFile ~/.ssh/clairdelune
   ```
5. Test : `ssh clairdelune ls`.

## 2. Sauvegarde de WordPress (avant de toucher à quoi que ce soit)

```sh
mkdir -p ~/archives/clairdelune-wordpress && cd ~/archives/clairdelune-wordpress
rsync -az clairdelune:<dossier-du-site>/ fichiers/
ssh clairdelune "mysqldump -h <hôte-db> -u <user-db> -p <nom-db>" > base.sql   # infos dans wp-config.php
```
Plus, par sécurité, une sauvegarde depuis le Manager (Sauvegardes).

## 3. Bascule

1. Créer un nouveau dossier pour le site statique (ex. `sites/clairdelune-statique/`) et y déployer : `DEPLOY_PATH=sites/clairdelune-statique/ npm run deploy:prd -- --go`.
2. Manager → Sites → institutclairdelune.ch → changer le **dossier racine** vers ce nouveau dossier. Désactiver PHP si l'option existe.
3. Vérifier : toutes les pages, `curl -I http://institutclairdelune.ch/reiki` (→ 301 vers https://www…/reiki/), `curl -I https://www.institutclairdelune.ch/` (en-têtes de cache), page 404, `/wp-admin` (→ 410).
4. Fixer `DEST` dans `tools/deploy-prd.sh` sur le nouveau dossier.
5. Après quelques semaines sans problème : supprimer l'ancien dossier WordPress et la base de données dans le Manager.

L'email du domaine (s'il y en a un chez Infomaniak) n'est pas concerné. Carole utilise une adresse Gmail.
