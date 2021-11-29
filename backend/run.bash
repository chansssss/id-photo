sudo kill -9 $(sudo lsof -t -i:3030)
nohup node ./src/index.js &