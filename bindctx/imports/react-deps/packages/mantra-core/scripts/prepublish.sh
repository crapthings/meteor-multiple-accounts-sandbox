echo "> Start transpiling"
echo ""
npx babel ./src --ignore __tests__ --out-dir ./dist
echo ""
echo "> Complete transpiling"
