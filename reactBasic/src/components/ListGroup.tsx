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

  return (
    <>
      <h1>List Group</h1>
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
