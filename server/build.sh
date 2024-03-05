mkdir templates
cd ..
npm run build
cd server
cp ../dist/index.html templates/index.html
cp -r ../dist/static .
pyinstaller --add-data "templates;templates" --add-data "static;static" --onefile  avrp.py

rm -rf templates/ static/