import { useState } from "react";

type ListGroupProps = {
  heading: string;
  items: string[];
};
function ListGroup({ heading, items }: ListGroupProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const notFoundCountries = items.length === 0 && <p>No {heading} found</p>;

  return (
    <>
      <h1>{heading}</h1>
      {notFoundCountries}
      <ul className="list-group">
        {items.map((country, countryIndex) => (
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
