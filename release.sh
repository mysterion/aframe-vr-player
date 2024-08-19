if [ $# -eq 0 ]; then
  echo "Error: No version"
  exit 1
fi

VERSION=$1

git tag $VERSION
git-cliff > CHANGELOG.md
git add CHANGELOG.md
git commit -m'bump'
git tag -d $VERSION
git tag $VERSION

echo "Push changes to repo?"
read -p "Confirm (YES/no): " confirm
if [ "$confirm"!= "YES" ]; then
  echo "Aborting..."
  exit 1
fi

git push
git push origin $VERSION
