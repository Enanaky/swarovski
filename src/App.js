import React from "react";
import * as algoliasearch from "algoliasearch";

function App() {
  const apiCall = query => {
    const client = algoliasearch("latency", "6be0576ff61c053d5f9a3225e2a90f76");
    const index = client.initIndex("ikea");
    const hits = index
      .search("ikea", {
        query: query,
        hitsPerPage: 16,
        attributesToRetrieve: ["name", "objectID", "image"]
      })
      .then(res => console.log(res));
  };

  return (
    <div className="App">
      <h2>Swarovsky Code Challenge</h2>
      <div className="container">
        <div className="input-field">
          <input
            type="text"
            placeholder="Enter query"
            onChange={e => apiCall(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
