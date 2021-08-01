import axios from "axios";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import Table from "../../components/Table";

const BtcProfitabilityPage: FC = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Date",
        accessor: (row: { date: string }) => {
          return moment(row.date).local().format("YYYY-MM-DD");
        },
      },
      {
        Header: "BTC",
        accessor: (row: { btc: string }) => {
          // convert value from MHash/s to THash/s
          return +(+new Number(row.btc) * 1000000).toFixed(6);
        },
      },
    ],
    []
  );

  useEffect(() => {
    axios.get("http://localhost:8000/profitability/btc").then((res) => {
      setData(res.data);
    });
  }, []);

  const [data, setData] = useState([]);
  return (
    <div className='min-h-screen bg-gray-100 text-gray-900'>
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
        <div className='flex'>
          <div className='m-auto'>
            <h1 className='text-xl font-semibold text-center'>BTC profitability</h1>
            <div className='mt-4 text-center'>
              <label>Mining Profitability USD/Day for 1 THash/s</label>
            </div>
          </div>
        </div>
        <div className='mt-4'>
          <Table columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
};

export default BtcProfitabilityPage;
