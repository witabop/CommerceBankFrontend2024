//  This will be the page the user lands on after logging in and where they can add servers.
// It is also the root URL so if a user attempts to enter the application without logging in
// they will need to be redirected to the login page to create a session (we will probably just use local storage)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exportFromJSON from 'export-from-json'
import '../styles/Dashboard.css'; // Make sure to create this CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faServer } from '@fortawesome/free-solid-svg-icons'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import logo from '../images/commercelogo.png';
import ServerItem from '../components/ServerItem';
import RequestHandler from '../components/RequestHandler';

const possibleApplications = ['API', 'PUP', 'RFS', 'TBD', 'INF', 'TCS', 'MQS'];
// all the applications the user has access to,is returned in the auth call.
let applications = []
let isAdmin = false;


function Dashboard() {

  // Example server data
  let initialServers = []

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [servers, setServers] = useState(initialServers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalBOpen, setIsModalBOpen] = useState(false);
  const [destinationHostname, setDestinationHostname] = useState('');
  const [destinationIp, setDestinationIP] = useState('');
  const [destinationPort, setDestinationPort] = useState('');
  const [sourceHostname, setSourceHostname] = useState('');
  const [sourceIP, setSourceIp] = useState('');
  const [newServerApplication, setNewServerApplication] = useState('API');
  const [users, setUsers] = useState([]);
  const [userID, setUserID] = useState(1);
  const [RemovePrimedApplication, setRemovePrimedApplication] = useState('');
  const [addPrimedApplication, setAddPrimedApplication] = useState('');
  const [effectRan, setEffectRan] = useState(false);
  const navigate = useNavigate();

  window.remove = RemovePrimedApplication;
  window.add = addPrimedApplication;
  window.users = users;

  let selectedUser;
  let unusedApps;

  if (users.length > 0) {
    selectedUser = users.findIndex(item => item.id === userID);

    unusedApps = possibleApplications.filter(app => !users[selectedUser].applications.includes(app));
    console.log(unusedApps)

  }

  useEffect(() => {
    if (users.length > 0 && !effectRan) {
      console.log(users[selectedUser].applications[0])
      console.log(unusedApps[0])

      setRemovePrimedApplication(users[selectedUser].applications[0]);
      setAddPrimedApplication(unusedApps[0]);
      setEffectRan(true);
    }

  }, [users, effectRan, selectedUser, unusedApps])

  useEffect(() => {
    setAddPrimedApplication(document.getElementById('addapp')?.value);
    setRemovePrimedApplication(document.getElementById('removeapp')?.value);
  }, [users, userID, isModalBOpen])




  useEffect(() => {
    //on load logic
    const session = localStorage.getItem('session');

    if (!session) {
      navigate('/login');
    } else {
      applications = localStorage.getItem('apps').split(',');
      setNewServerApplication(applications[0]);

      isAdmin = JSON.parse(localStorage.getItem('admin'));
      RequestHandler('servers', { UID: localStorage.getItem('session') }).then(response => {
        setServers(response.servers)
      })

      if (isAdmin) {
        RequestHandler('users', { isAdmin }).then(response => {

          setUsers(response);

        })
      }
    }

    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setIsSidebarOpen(false);
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };


  }, [navigate]);


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

  const openModalB = () => {
    setIsSidebarOpen(false);

    setIsModalBOpen(true);
    setUserID(users[0].id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalBOpen(false);
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

  const handleAddUser = () => {

    RequestHandler('modifyuser', { id: userID, applications: [...users[selectedUser].applications, addPrimedApplication] });
    setUsers(users.map(user => user.id === userID ? { ...user, applications: [...user.applications, addPrimedApplication] } : user));

  }

  const handleRemoveUser = () => {

    RequestHandler('modifyuser', { id: userID, applications: users[selectedUser].applications.filter(app => app !== RemovePrimedApplication) });
    setUsers(users.map(user => user.id === userID ? { ...user, applications: user.applications.filter(app => app !== RemovePrimedApplication) } : user));

  }

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

      {/* Hamburger Menu */}
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
        {isAdmin && (
          <div className="sidebar-item" onClick={() => openModalB()}>
            <FontAwesomeIcon icon={faScrewdriverWrench} /><span>Manage Users</span>
          </div>
        )}
        <div className="sidebar-item" onClick={() => { localStorage.removeItem("apps"); localStorage.removeItem("session"); localStorage.removeItem("admin"); navigate("/login") }}>
          <span>Logout</span>
        </div>
      </div>

      {/* User Management Modal */}
      {isModalBOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">

              <button className="close-btn" onClick={closeModal}>X</button>
            </div>
            <div className='modal-content'>
              <span>Manage User</span>

              <select id="accountswitcher" required onChange={(e) => setUserID(parseInt(e.target.value))}>
                {users.map((user, index) => (
                  <option key={index} value={user.id}>User: {user.id}</option>
                ))}
              </select>

              <div className='modal-block'>
                <select id="removeapp" required onChange={(e) => setRemovePrimedApplication(e.target.value)}>
                  {users[selectedUser].applications.map((application, index) => (
                    <option key={index} value={application}>{application}</option>
                  ))}
                </select>
                <button style={{ backgroundColor: 'red' }} onClick={() => { handleRemoveUser() }}>Remove</button>
              </div>
              {unusedApps.length > 0 && (
                <div className='modal-block'>
                  <select id="addapp" required onChange={(e) => setAddPrimedApplication(e.target.value)}>
                    {unusedApps.map((application, index) => (
                      <option key={index} value={application}>{application}</option>
                    ))}
                  </select>
                  <button style={{ paddingLeft: '44px', paddingRight: '41px' }} onClick={() => { handleAddUser() }}>Add</button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Add Server Modal */}
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