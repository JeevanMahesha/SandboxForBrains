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

  const handleClick = (clickEvent: React.MouseEvent) => {
    console.log("clicked", clickEvent);
  };

  return (
    <>
      <h1>List Group</h1>
      {notFoundCountries}
      <ul className="list-group">
        {countries.map((country) => (
          <li className="list-group-item" onClick={handleClick} key={country}>
            {country}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
