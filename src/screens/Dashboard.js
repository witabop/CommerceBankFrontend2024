//  This will be the page the user lands on after logging in and where they can add servers.
// It is also the root URL so if a user attempts to enter the application without logging in
// they will need to be redirected to the login page to create a session (we will probably just use local storage)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exportFromJSON from 'export-from-json'
import '../styles/Dashboard.css'; // Make sure to create this CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faServer } from '@fortawesome/free-solid-svg-icons'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import logo from '../images/commercelogo.png';
import ServerItem from '../components/ServerItem';
import RequestHandler from '../components/RequestHandler';

// all the applications the user has access to,is returned in the auth call.
let applications = []


function Dashboard() {

  // Example server data
  let initialServers = []

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [servers, setServers] = useState(initialServers); // This array will be used to store server objects
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destinationHostname, setDestinationHostname] = useState('');
  const [destinationIp, setDestinationIP] = useState('');
  const [destinationPort, setDestinationPort] = useState('');
  const [sourceHostname, setSourceHostname] = useState('');
  const [sourceIP, setSourceIp] = useState('');
  const [newServerApplication, setNewServerApplication] = useState('API');
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (!session) {
      navigate('/login');
    } else {
      applications = localStorage.getItem('apps').split(',')
    }

  }, [navigate]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) closeModal(); // 27 is the Escape key
    };

    window.addEventListener('keydown', handleEsc);
    const session = localStorage.getItem('session');
    if (!session) {
      navigate('/login');
    } else {
      RequestHandler('servers', { username: localStorage.getItem('session').split('|')[0], password: localStorage.getItem('session').split('|')[1] }).then(response => {
        setServers(response.servers)
      })

    }



    return () => {
      window.removeEventListener('keydown', handleEsc);
    };


  }, []);

  const deleteServer = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setServers(servers.filter(server => server.id !== id));
      RequestHandler('delete', { id: id });
    }

  };

  const updateServer = (id, updatedInfo) => {
    setServers(servers.map(server => server.id === id ? { ...server, ...updatedInfo } : server));
    RequestHandler('add', { id: id, ...updatedInfo })
  };


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openModal = () => {
    setIsSidebarOpen(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddServer = (e) => {
    e.preventDefault();

    const newServer = {
      id: Date.now(), // Simple way to generate a unique ID, we might end up using something else later
      name: destinationHostname,
      application: newServerApplication,
      ip: destinationIp,
      port: destinationPort,
      sourceName: sourceHostname,
      sourceIP: sourceIP,
      ipstatus: true,

    };

    setServers([...servers, newServer]);
    RequestHandler('/add', newServer);

    setDestinationHostname('');
    setDestinationIP('');
    setDestinationPort('');
    setSourceHostname('');
    setSourceIp('');
    setNewServerApplication('API');


    closeModal();
  };

  const exportData = () => {
    const fileName = 'whitelist'
    const exportType = exportFromJSON.types.xls

    exportFromJSON({ data: servers, fileName, exportType })
  }


  return (
    <div className="dashboard">
      <nav className="navbar">
        <img src={logo} className="brand-logo2" alt="logo" />
        <div onClick={toggleSidebar} className="hamburger-icon">
          <FontAwesomeIcon fontSize={30} width={50} height={50} icon={faBars} />
        </div>

      </nav>

      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-item" onClick={() => setIsSidebarOpen(false)}>
          <FontAwesomeIcon icon={faXmark} /> <span>Close</span>
        </div>
        <div className="sidebar-item" onClick={() => openModal()}>
          <FontAwesomeIcon icon={faServer} /><span>Add New Server</span>
        </div>
        <div className="sidebar-item" onClick={() => exportData()}>
          <FontAwesomeIcon icon={faFileArrowDown} /><span>Export</span>
        </div>
        <div className="sidebar-item" onClick={() => { localStorage.removeItem("apps"); localStorage.removeItem("session"); navigate("/login") }}>
          <span>Logout</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">

              <button className="close-btn" onClick={closeModal}>X</button>
            </div>
            <div className='modal-content'>
              <span>Server Information</span>
              <form onSubmit={handleAddServer}>
                <select required onChange={(e) => setNewServerApplication(e.target.value)}>
                  {applications.map((application, index) => (
                    <option key={index} value={application}>{application}</option>
                  ))}
                </select>
                {/* Add text inputs for hostname, IP, port, etc. */}
                <input type="text" placeholder="Destination hostname" required onChange={(e) => setDestinationHostname(e.target.value)} />
                <input type="text" placeholder="Destination IP" required onChange={(e) => setDestinationIP(e.target.value)} />
                <input type="text" placeholder="Destination Port" required onChange={(e) => setDestinationPort(e.target.value)} />
                <input type="text" placeholder="Source Hostname" required onChange={(e) => setSourceHostname(e.target.value)} />
                <input type="text" placeholder="Source IP" required onChange={(e) => setSourceIp(e.target.value)} />
                <button type="submit" className="add-btn">Add</button>
              </form>
            </div>

          </div>
        </div>
      )}

      <main className={isSidebarOpen ? 'content blur' : 'content'}>
        {servers.length > 0 ? (
          servers.map(server => (
            <ServerItem key={server.id} server={server} onDelete={deleteServer} onUpdate={updateServer} applications={applications} />
          ))
        ) : (
          <div className="no-servers">Looks like there's nothing here yet...</div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;