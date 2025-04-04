# Remove the existing remote
git remote remove origin

# Remove node_modules folder
rm -rf node_modules

# Remove from git if it was already added
git rm -r --cached node_modules