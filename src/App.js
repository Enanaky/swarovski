import React, { useState } from "react";
import * as algoliasearch from "algoliasearch";

function App() {
  const [items, setItems] = useState([]);

  const apiCall = query => {
    const client = algoliasearch("latency", "6be0576ff61c053d5f9a3225e2a90f76");
    const index = client.initIndex("ikea");
    const hits = index.search("ikea", {
      query: query,
      hitsPerPage: 16,
      attributesToRetrieve: ["name", "objectID", "image"]
    });
    return hits;
  };

  const getData = async function(query) {
    if (query === "") {
      setItems([]);
    } else {
      try {
        //1. Making the ajax call.
        const data = await apiCall(query);
        //2. Store the data on state.
        setItems(data.hits);
      } catch (err) {
        console.log(err);
        console.log(err.debugData);
      }
    }
  };

  return (
    <div className="App">
      <h2>Swarovsky Code Challenge</h2>
      <div className="container">
        <div className="input-field">
          <input
            type="text"
            placeholder="Enter query"
            onChange={e => getData(e.target.value)}
          />
        </div>
        <ul className="list-items">
          {items &&
            items.map(hit => {
              return (
                <li key={hit.objectID} className="card">
                  <img src={hit.image} className="card-img" alt="..." />
                  <div className="card-body">
                    <p className="card-text">{hit.name}</p>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default App;
