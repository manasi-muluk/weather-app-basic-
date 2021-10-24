const http = require("http");
const fs = require("fs");
var requests = require("requests");
const port=process.env.PORT ||8000
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal=(tempVal,orgVal)=>
{
    let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
     temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min);
     temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max);
     temperature=temperature.replace("{%location%}",orgVal.name);
     temperature=temperature.replace("{%country%}",orgVal.sys.country);
     temperature=temperature.replace("{%tempStatus%}",orgVal.weather[0].main);
    return temperature;
}
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Rajgurunagar&appid=39f650044139ea55f09f364be4218ffe")
            .on('data', function (chunk) {
                const objdata=JSON.parse(chunk);
                const arrData=[objdata]
                //console.log(arrData[0].main.temp)
                const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
                     
                     res.write(realTimeData);

            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                 res.end();
                console.log('end');
            });
    }

});
server.listen(port,()=>{
   console.log(`Listening to the port ${port}`)
});
