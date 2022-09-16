import React, { useEffect, useMemo, useState } from "react";

import { SonicTable } from "./SonicTable/SonicTable";
import axios from "axios";

const App = () => {
  const [posts, setPosts] = useState([]);
  const columns = useMemo(
    () => [
      {
        id: "Id",
        accessorKey: "id",
      },
      {
        id: "UserId",
        accessorKey: "userId",
      },
      {
        id: "Title",
        accessorKey: "title",
      },
      {
        id: "Actions",
        cell: (row: object) => (
          <>
            <button>Delete</button>
            <button>Edit</button>
          </>
        ),
      },
    ],
    []
  );

  const paginate = ({ page, size }: { page: number; size: number }) => {
    console.log(page, "page");
    console.log(size, "size");
    axios
      .get(`http://localhost:9001/api/v1/posts?offSet=${page}&limit=${size}`)
      .then((res) => {
        setPosts(res.data);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:9001/api/v1/posts?offSet=1&limit=10")
      .then((res) => {
        console.log(res.data);
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <SonicTable
      data={posts}
      columns={columns}
      onPaginate={({ page, size }) => {
        paginate({ page, size });
      }}
      paginationState={{
        totalRows: 100,
      }}
      onSearch={(e) => {
        console.log(e.target, "debounce");
      }}
    />
  );
};

export default App;
