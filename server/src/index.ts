import { Profitability } from './interfaces/Profitability';
const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const util = require('util');
const sleep = require('await-sleep');

const app = express();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST_IP,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.use(cors());

axios.get('https://bitinfocharts.com/comparison/bitcoin-mining_profitability.html#3m')
  .then((response: { data: any; }) => {
    const data = response.data;
    const beginIndex = data.indexOf('[[new Date');
    const endIndex = data.indexOf(']]', beginIndex) + 2;
    const profitabilityDataString = data.substring(beginIndex, endIndex);
    const profitabilityData = parseProfitability(profitabilityDataString);
    //console.log(profitabilityDataString);
  })
  .catch((error: any) => {
    console.log(error);
  });

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});

app.get('/test', (req: { query: { table: any; }; }, res: { send: (arg0: any) => any; }) => {
  const { table } = req.query;

  pool.query(`select * from ${table}`, (err: any, results: any) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(results);
    }
  });
});

function parseProfitability(profitabilityDataString: string): Array<Profitability> {
  const profitability: Array<Profitability> = [];
  profitabilityParser(profitability, profitabilityDataString);
  return profitability;
}

function profitabilityParser(result: Array<Profitability>, profitabilityDataString: string, startIndex: number = 1) {
  const dateValue: Profitability | {} = {};
  const profitabilityResult: Array<Array<string>> = [];
  if (profitabilityDataString === null || result === null || profitabilityDataString.length <= startIndex) {
    return;
  }
  let profitabilityElement = null;
  do {
    const substringStart = profitabilityDataString.indexOf('[', startIndex);
    const substringEnd = profitabilityDataString.indexOf(']', substringStart) + 1;
    if ( substringStart < 0 || substringEnd < 0) {
      break;
    }
    profitabilityElement = profitabilityDataString.substring(substringStart, substringEnd);
    
    if (profitabilityElement) {
      const newProfitability: Array<string> = [];
      const date = profitabilityElement.substring(profitabilityElement.indexOf('"') + 1, profitabilityElement.lastIndexOf('"'));
      newProfitability.push(date.replace(/\//g, '-'));
      newProfitability.push(profitabilityElement.substring(profitabilityElement.indexOf(',') + 1, profitabilityElement.indexOf(']')))
      console.log(newProfitability);
      profitabilityResult.push(newProfitability);
    }
    startIndex = startIndex + profitabilityElement.length
  } while (profitabilityDataString.length < startIndex || profitabilityElement.length);

  if (profitabilityResult.length) {
    pool.getConnection(function(err: any, connection: { query: (arg0: string, arg1: { (err: any, rows: any): void; (err: any, rows: any): void; }) => void; release: () => void; }) {
      profitabilityResult.forEach((profitability) => {
        connection.query(`INSERT IGNORE INTO sample (date, btc) VALUES ('${profitability[0]} 00:00:00', '${profitability[1]}')`, function(err, rows) {
          if(err) {
            console.log(err);
          }
        });
      });
      connection.release();
    });
  }
}

async function closeGracefully(signal: any) {
  console.log(`Received signal to terminate: ${signal}`)
  // const result = pool.query('select * from test');
  // console.log(result);
  console.time('Sleeping');
  console.log('going to sleep');
  await sleep(3000);
  console.timeEnd('Sleeping');
  console.log('waked up');

  // await db.close() if we have a db connection in this app
  // await other things we should cleanup nicely
  process.exit(0)
}

// process.on('SIGINT', closeGracefully)
// process.on('SIGTERM', closeGracefully)

[
  'beforeExit', 'uncaughtException', 'unhandledRejection', 
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 
  'SIGABRT','SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 
  'SIGUSR2', 'SIGTERM'
].forEach(signal => process.on(signal, closeGracefully));
