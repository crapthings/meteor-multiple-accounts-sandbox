echo "> Start transpiling"
echo ""
npx babel lib --ignore __tests__ --out-dir ./dist
echo ""
echo "> Complete transpiling"
