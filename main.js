const { program } = require('commander');
const http = require('http');
const fs = require('fs').promises; // Use promises API
const path = require('path');

program
  .option('-h, --host <address>', 'адреса сервера', 'localhost')
  .option('-p, --port <number>', 'порт сервера', 3000)
  .option('-c, --cache <path>', 'шлях до директорії, яка міститиме закешовані файли');

program.parse(process.argv);

const options = program.opts();

const requestListener = async function (req, res) {
  const filePath = path.join(options.cache, req.url + ".jpg");

  switch(req.method){
    case 'GET':
        fs.readFile(filePath)
        .then(content => {
          res.setHeader("Content-Type", "image/jpeg");
          res.writeHead(200);
          res.end(content);
        })
        .catch(() => {
          console.error('No picture in cache:', filePath);
          res.writeHead(404);
          res.end();
        });
      }
}

  

const server = http.createServer(requestListener);

server.listen(options.port, options.host, () => {
  console.log(`Server is listening on http://${options.host}:${options.port}`);
});
