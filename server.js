const express = require('express');
const parser = require('body-parser');
const PORT = 3000;
const API = require('./apiRoutes')

const app = express();
app.use(parser.json());

app.use('/', express.static('src', {extensions:['html']}));

app.use(API);


// Start Server
app.listen(PORT, ()=>{
  console.log(`
    ----------------------------------------------------------------
         ARKADIUM MOVIE APP Listening on PORT: ${PORT}
    --------------------------------------------------------------`);
})
