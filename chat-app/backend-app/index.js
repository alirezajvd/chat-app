const app = require('./middleware');
const routes = require('./routes');
const {createUserTable, createMessageTable} = require('./db');

createUserTable();
createMessageTable();
const port = process.env.PORT || 8000;

app.use('/', routes);


app.listen(port, () =>{
    console.log(`server is running oon http://localhost:${port}`);
});
