import ProfitabilityPage from "./pages/Profitability";
import { BrowserRouter as Router, Link, NavLink, Route, Switch } from "react-router-dom";
import BtcProfitabilityPage from "./pages/BtcProfitability";
import Menu from "./components/Menu";

function App() {
  return (
    <Router>
      <div className="bg-blue-300">
        <Menu />
      </div>
      <Switch>
        <Route path='/btc'>
          <BtcProfitabilityPage />
        </Route>
        <Route path='/'>
          <ProfitabilityPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
