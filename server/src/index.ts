const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
import { Request, Response } from 'express';
import { Profitability } from './interfaces/Profitability';

const app = express();
const startTime = new Date();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST_IP,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.use(cors());

//const url = 'https://bitinfocharts.com/comparison/bitcoin-mining_profitability.html#3m';
const url = 'https://bitinfocharts.com/comparison/mining_profitability-btc-eth-xrp-etc-ltc.html#3m';

axios.get(url)
  .then((response: { data: any; }) => {
    const data = response.data;
    const beginIndex = data.indexOf('[[new Date');
    const endIndex = data.indexOf(']]', beginIndex) + 2;
    const profitabilityDataString = data.substring(beginIndex, endIndex);
    const profitabilityData = parseProfitability(profitabilityDataString);
    const datesCount = profitabilityData.length;
    console.log(`profitability data retrieved, count dates=${datesCount}`);
  })
  .catch((error: any) => {
    console.log(error);
  });

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});

app.get('/profitability', (req: Request, res: Response) => {
  console.info("get /profitability");
  pool.query(`select * from profitability`, (err: any, results: any) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(results);
    }
  });
});

app.get('/profitability/btc', (req: Request, res: Response) => {
  console.info("get /profitability/btc");
  pool.query(`select id, date, btc from profitability`, (err: any, results: any) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(results);
    }
  });
});

app.post('/profitability/selected/:id', (req: Request, res: Response) => {
  const profitabilityId = req.params.id;
  console.log(`profitability selected: id=${profitabilityId}`)
  pool.query(`INSERT INTO selected(profitabilityId) VALUES ('${profitabilityId}')`, (err: any, results: any) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(results);
    }
  });
});

function parseProfitability(profitabilityDataString: string): Array<Array<string | null>> {
  let startIndex = 1;
  const dateValue: Profitability | {} = {};
  const profitabilityResult: Array<Array<string | null>> = [];
  if (profitabilityDataString === null || profitabilityDataString.length <= startIndex) {
    return [];
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
      const newProfitability: Array<string | null> = [];
      const date = profitabilityElement.substring(profitabilityElement.indexOf('"') + 1, profitabilityElement.lastIndexOf('"'));
      newProfitability.push(date.replace(/\//g, '-'));
      let endParsing = false;
      let currentIndex = 0;
      do {
        let begin = profitabilityElement.indexOf(',', currentIndex);
        if (begin < 0) {
          break;
        }
        let end = profitabilityElement.indexOf(',', begin + 1);
        if (end < 0) {
          end = profitabilityElement.indexOf(']', begin + 1);
        }
        if (end > begin) {
          currentIndex = end;
          let cryptoValue: string | null = profitabilityElement.substring(begin + 1, end);
          if (cryptoValue === 'null') {
            cryptoValue = null;
          }
          newProfitability.push(cryptoValue);
        } else {
          endParsing = true;
        }
      } while (!endParsing);
      // console.log(newProfitability);
      profitabilityResult.push(newProfitability);
    }
    startIndex = startIndex + profitabilityElement.length
  } while (profitabilityDataString.length < startIndex || profitabilityElement.length);
  storeProfitabilityData(profitabilityResult);
  return profitabilityResult;
}

function storeProfitabilityData(profitabilities: Array<Array<string | null>>) {
  if (profitabilities.length) {
    pool.getConnection(function(err: any, connection: { query: (arg0: string, arg1: { (err: any, rows: any): void; (err: any, rows: any): void; }) => void; release: () => void; }) {
      profitabilities.forEach((profitability) => {
        connection.query(`INSERT IGNORE INTO profitability (date, btc, eth, xrp, etc, ltc) VALUES (
           '${profitability[0]}',
           '${profitability[1]}',
           '${profitability[2]}',
           '${profitability[3]}',
           '${profitability[4]}',
           '${profitability[5]}'
           )`, function(err, rows) {
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
  //TODO select * where selected.created >= this.startTime
  //const result = pool.query('select id from selected');
  //console.log(result);
  process.exit(0)
}

[
  'beforeExit', 'uncaughtException', 'unhandledRejection', 
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 
  'SIGABRT','SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 
  'SIGUSR2', 'SIGTERM'
].forEach(signal => process.on(signal, closeGracefully));
