const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    //res.end('Bienvenido al servidor backend Node...')
    // console.log(__dirname),
    res.sendFile(__dirname+'/public/index.html')
})

app.use('/public',express.static(__dirname+'/public'));
app.use('/src',express.static(__dirname+ '/src'));
app.use('/node_modules',express.static(__dirname + '/node_modules'));

// configurar server basico
app.listen(5000,function(){
console.log("Servidor NODE grupo5 corriendo correctamente")
});