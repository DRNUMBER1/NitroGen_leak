const request = require('request');
const logger = require(__dirname + '/util/logger');
const fs = require('fs');
const c = require('ansi-colors');



const PROXY_FILE = __dirname + "/proxies.txt";

const triesPerSecond = 0.001;

var proxyLine = 0;
var proxyUrl = "";
var working = [];

getGiftCode = function () {
    let code = '';
    let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for(var i = 0; i < 18; i++){
        code = code + dict.charAt(Math.floor(Math.random() * dict.length));
    }
    return code;
}

function updateLine(){
    proxyLine++;
    var lineReader = require('line-reader');
    var readLine = 0;
    lineReader.eachLine(PROXY_FILE, function(line, last) {
        readLine++;
        if (readLine === proxyLine) {
            proxyUrl = "http://" + line;
        }
        if (last) {
            readLine = 0;
        }
    });
}

updateLine();

checkCode =  function (code) {
   var proxiedRequest = request.defaults({'proxy': proxyUrl});
    proxiedRequest.timeout = 800;
    proxiedRequest.get(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`,  (error, resp, body)  => {
        if(error){
            console.log( c.bold.cyan (`This proxy is not working / dead. {Connecting to a new one}`) );
            updateLine();
            return;
        }
        try {
            body = JSON.parse(body);
            if(body.message != "Unknown Gift Code" && body.message != "You are being rate limited."){
                logger.log('\x1b[41m', `Generated: https://discord.gift/${code} {Nitro Gift}`);
                console.log(JSON.stringify(body, null, 4));
                working.push(`https://discord.gift/${code}`);
                fs.writeFileSync(__dirname + '/codes.json', JSON.stringify(working, null, 4));
            }
            else if(body.message === "You are being rate limited.") {
                updateLine();
                console.log(c.bold.yellow ("This proxy has been limited by Discord {Rate Limit}"));

            }else{
                console.log(c.red.bold (`Generated: ${code} {Invaild Gift}` ));
            }
        }
        catch (error) {
            logger.error(`An error occurred:`);
            logger.error(error);
            return;
        }
    });
}
logger.info(`NitrogenX - Premium`);
logger.info(`\n\n\n\n Thank you for buying Nitrogen! - \n\n\n\n\n\n\n`)
logger.info(`Copyright (c) @saintic`)
logger.info(` Version REVAMP`);


checkCode(getGiftCode());
setInterval(() => {
    checkCode(getGiftCode());
    }, (100/triesPerSecond) * 0.001);
	
	function getStuff() { 
  return fetchStuff().then(stuff => 
    process(stuff)
  ).catch(err => {
    console.error(err);
  });
}
