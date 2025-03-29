import { useState, useEffect, useCallback } from "react";

function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [details, setDetails] = useState({});

  const fetchData = useCallback(debounce(async (query) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${query}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  }, 500), []);

  const fetchDetails = async (id) => {
    try {
      const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products/${id}`);
      const data = await response.json();
      setDetails(data);
      
      setQuery("");
      setSuggestions([]);
    } catch (error) {
      console.error("Errore nel caricare i dettagli del prodotto:", error);
    }
  };

  useEffect(() => {
    fetchData(query);
  }, [query]);

  return (
    <div className="container">
      <h1>Autocomplete</h1>
      <div className="search-box">
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          placeholder="Cerca prodotti..."
        />
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((product) => (
              <li
                key={product.id}
                onClick={() => { fetchDetails(product.id); }}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {details.name && (
        <div className="product-details">
          <button onClick={() => setDetails({})} className="close-button">❌</button>
          <h2>{details.name}</h2>
          <img src={details.image} alt={details.name} />
          <p>{details.description}</p>
          <p><strong>Price:</strong> ${details.price}</p>
        </div>
      )}
    </div>
  );
};

export default App;