import React, { useState } from "react";

export default function Searching(props: any) {
  const [search, setSearch] = useState("");
  const { data, setData, type, serverSearching, button } = props;

  const handleSearch = (event: any) => {
    event.preventDefault();

    let searchValue = search ? search : event?.target?.value?.toLowerCase();
    if (type === "client") {
      if (searchValue) {
        const filteredData = data.filter((item: any) => {
          return Object.keys(item).some((key) => {
            if (key === "_id" || key === "updatedAt" || key === "createdAt") {
              return false;
            }
            const itemValue = item[key];
            if (typeof itemValue === "string") {
              return itemValue.toLowerCase().indexOf(searchValue) > -1;
            } else if (typeof itemValue === "number") {
              return itemValue.toString().indexOf(searchValue) > -1;
            }
            return false;
          });
        });
        setData(filteredData);
      } else {
        setData(data);
      }
    } else {
      serverSearching(searchValue);
    }
  };

  return (
    <>
      <>
        <div className="">

          <input
            type="search"
            id="search"
            placeholder="Search..."
            className="form-control"
            style={{ minWidth: 220, height: 38, paddingLeft: 36, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: '10px center' }}
            onChange={
              button
                ? (e) => setSearch(e.target.value)
                : (e) => handleSearch(e)
            }
          />
        </div>
      </>
    </>
  );
}
