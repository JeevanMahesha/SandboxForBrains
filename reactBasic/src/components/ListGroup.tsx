import { useState } from "react";

function ListGroup() {
  const countries = [
    "United States",
    "Canada",
    "Mexico",
    "Brazil",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Australia",
    "India",
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const notFoundCountries = countries.length === 0 && <p>No countries found</p>;

  return (
    <>
      <h1>List Group</h1>
      {notFoundCountries}
      <ul className="list-group">
        {countries.map((country, countryIndex) => (
          <li
            className={
              selectedIndex === countryIndex
                ? "list-group-item active"
                : "list-group-item"
            }
            aria-current="true"
            onClick={() => setSelectedIndex(countryIndex)}
            key={country}
          >
            {country}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
