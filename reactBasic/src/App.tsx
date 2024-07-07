import "./App.css";
import ListGroup from "./components/ListGroup";

function App() {
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
    <div>
      <ListGroup heading="Countries" items={countries} />
    </div>
  );
}

export default App;
