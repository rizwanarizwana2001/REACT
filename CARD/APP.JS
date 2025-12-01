import "./App.css";
import Card from "./Component/Card.js";
import doll from "./Asset/Img/doll2.jpg";

function App() {
  return (
    <div>
      <Card title="Dolls" description="This Dolls are beautiful and wonderful" src={doll} />
      <Card title="Dolls Beauty" description="This Dolls are beautiful and wonderful" src={doll} />
    </div>
  );
}

export default App;
