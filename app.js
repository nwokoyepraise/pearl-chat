const express = require('express');
const app = express();
const port_number = 3000;
 

app.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`)
})