const app = require('./middleware');
const routes = require('./routes');
const {createUserTable} = require('./db');

createUserTable();

const port = process.env.PORT || 5000;

app.use('/', routes);


app.listen(port, () =>{
    console.log(`server is running oon http://localhost:${port}`);
});
