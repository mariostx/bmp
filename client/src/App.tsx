import React, { useEffect, useState } from "react";
import "./App.css";
import Table from "./components/Table";
import axios from "axios";
import moment from "moment";

const getData = () => {
  return [
    { id: 1, date: "2021-07-04T00:00:00.000Z", btc: 0.293 },
    { id: 2, date: "2021-07-07T00:00:00.000Z", btc: 0.282 },
    { id: 3, date: "2010-07-17T00:00:00.000Z", btc: 154298 },
  ];
};

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Date",
        minWidth: 1500,
        width: 1500,
        accessor: (row: { date: string }) => {
          return moment(row.date).local().format("DD-MM-YYYY");
        },
      },
      {
        Header: "BTC",
        minWidth: 150,
        accessor: "btc",
      },
    ],
    []
  );

  useEffect(() => {
    axios.get("http://localhost:8000/test?table=sample").then((res) => {
      setData(res.data);
    });
  }, []);

  //const data = React.useMemo(() => getData(), []);
  const [data, setData] = useState([]);

  return (
    <div className='min-h-screen bg-gray-100 text-gray-900'>
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
        <h1 className="text-xl font-semibold">BTC profitability</h1>
        <div className='mt-4'>
          <Table columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
}

export default App;
