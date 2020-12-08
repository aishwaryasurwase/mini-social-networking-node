const http = require('http');
const app = require('./backend/app');
const port = process.env.PORT || 3100;
// mongodb+srv://aishwarya:AukatMeReh@710@cluster0.lunhg.mongodb.net/test
app.set('port', port)
const server = http.createServer(app)

server.listen(port);