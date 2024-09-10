import { useState, useEffect } from "react";
import axios from "axios";

const PAGE_SIZE = 12;

const PokeGrid = () => {
  const fetchPokemonPage = async (offset = 0) => {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
    );
    const pokemonNames = await response.data.results;
    return pokemonNames;
  };

  const [pokemon, setPokemon] = useState([]);
  const [isPending, setIsPending] = useState(false);

  // Handle scroll event at window level
  let num_scrolls = 0;
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 && !isPending) {
      num_scrolls++
      setIsPending(true);
      fetchPokemonPage(num_scrolls * PAGE_SIZE).then((newPageOfPokemon) => {
        setPokemon((prevPokemon) => [...prevPokemon, ...newPageOfPokemon]);
        setIsPending(false);
      });
    }
  };

  // Fetch initial pokemon on mount
  useEffect(() => {
    const loadInitialPokemon = async () => {
      setIsPending(true);
      const firstPageOfPokemon = await fetchPokemonPage();
      setPokemon(firstPageOfPokemon);
      console.log(pokemon.length)
      setIsPending(false);
    };

    loadInitialPokemon().then(() => window.addEventListener("scroll", handleScroll));
    

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // No dependencies, runs only once when the component mounts

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Infinite scrolling list of pokemon</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          margin: "auto",
        }}
      >
        {pokemon.map((pokemon) => (
          <div
            key={pokemon.name}
            style={{
              border: "1px solid lightgray",
              padding: "5px",
              margin: "5px",
              textAlign: "center",
            }}
          >
            <h3>{pokemon.name}</h3>
            <img
              src={`https://img.pokemondb.net/artwork/${pokemon.name}.jpg`}
              width="200px"
            />
          </div>
        ))}
      </div>
      {isPending && (
        <div style={{ textAlign: "center", margin: "10px" }}>Loading...</div>
      )}
    </div>
  );
};

export default PokeGrid;