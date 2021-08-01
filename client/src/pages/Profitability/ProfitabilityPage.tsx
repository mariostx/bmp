import axios from "axios";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import Table from "../../components/Table";

const ProfitabilityPage: FC = () => {
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
          return row.btc ?? "-";
        },
      },
      {
        Header: "ETH",
        accessor: (row: { eth: string }) => {
          return row.eth ?? "-";
        },
      },
      {
        Header: "XRP",
        accessor: (row: { xrp: string }) => {
          return row.xrp ?? "-";
        },
      },
      {
        Header: "ETC",
        accessor: (row: { etc: string }) => {
          return row.etc ?? "-";
        },
      },
      {
        Header: "LTC",
        accessor: (row: { ltc: string }) => {
          return row.ltc ?? "-";
        },
      },
    ],
    []
  );

  useEffect(() => {
    axios.get("http://localhost:8000/profitability").then((res) => {
      setData(res.data);
    });
  }, []);

  const [data, setData] = useState([]);
  return (
    <div className='min-h-screen bg-gray-100 text-gray-900'>
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
        <div className='flex'>
          <div className='m-auto'>
            <h1 className='text-xl font-semibold text-center'>Crypto profitability</h1>
            <div className='mt-4 text-center'>
              <label>Mining Profitability USD/Day for 1 MHash/s</label>
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

export default ProfitabilityPage;
