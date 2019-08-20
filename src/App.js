import React, { useState } from "react";
import { debounce } from "lodash";
import axios from "axios";

function App() {
  // Storage for Hits.
  const [items, setItems] = useState([]);
  // Aditional search params.
  const [visible, setVisible] = useState(false);
  const [howMany, setHowMany] = useState(16);
  const [delay, setDelay] = useState(200);
  // Save loading state and errors.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normally I put the services in a diferent module, but this is a small SPA.
  const apiCall = query => {
    const algoliaAgent = "Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser";
    const algoliaApiKey = "6be0576ff61c053d5f9a3225e2a90f76";
    const params = `query=ikea&query=${query}&hitsPerPage=${howMany}&attributesToRetrieve=%5B%22name%22%2C%22objectID%22%2C%22image%22%5D`;
    const url = `https://latency-dsn.algolia.net/1/indexes/ikea/query?x-algolia-agent=${algoliaAgent}&x-algolia-application-id=latency&x-algolia-api-key=${algoliaApiKey}`;

    const hits = axios
      .post(url, {
        params: params
      })
      .catch(error => setError(error));

    return hits;
  };

  // Debounce(func(), delay) apply the debounce effect every time "getData" is called.
  const getData = debounce(async function(query) {
    setError(null);
    if (query === "") {
      setItems([]);
    } else {
      try {
        //1. Making the ajax call.
        const data = await apiCall(query);
        setLoading(false);
        //2. Store the data on state.
        setItems(data.data.hits);
      } catch (err) {
        setError(err);
        console.log(err.debugData);
      }
    }
  }, delay);

  const handleClick = () => {
    visible === false ? setVisible(true) : setVisible(false);
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
          <button className="visible" onClick={handleClick}>
            {visible === false ? "More" : "Less"}
          </button>
        </div>
        {visible === true ? (
          <div className="show-hide">
            Default: 16
            <input
              type="text"
              placeholder="Hits per page"
              onChange={e => setHowMany(e.target.value)}
            />
            <input
              type="text"
              placeholder="Delay on search"
              onChange={e => setDelay(e.target.value)}
            />
            Default: 200.ms
          </div>
        ) : null}
        {loading === true ? <p className="loading">loading...</p> : null}
        {error !== null ? <p className="error">{error}</p> : null}
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
