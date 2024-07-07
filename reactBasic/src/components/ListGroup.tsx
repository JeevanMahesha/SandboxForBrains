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

  const notFoundCountries = countries.length === 0 && <p>No countries found</p>;

  return (
    <>
      <h1>List Group</h1>
      {notFoundCountries}
      <ul className="list-group">
        {countries.map((country) => (
          <li className="list-group-item" key={country}>
            {country}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
