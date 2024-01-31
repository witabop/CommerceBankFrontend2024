//  This will be the page the user lands on after logging in and where they can add servers.
// It is also the root URL so if a user attempts to enter the application without logging in
// they will need to be redirected to the login page to create a session (we will probably just use local storage)

import logo from '../images/logo.svg';
import '../styles/Dashboard.css'

function Dashboard() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Dashboard;
