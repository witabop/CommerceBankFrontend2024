//  This will be the page the user lands on after logging in and where they can add servers.
// It is also the root URL so if a user attempts to enter the application without logging in
// they will need to be redirected to the login page to create a session (we will probably just use local storage)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exportFromJSON from 'export-from-json'
import '../styles/Dashboard.css'; // Make sure to create this CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCircleUp, faRocket, faScrewdriverWrench, faTrash } from '@fortawesome/free-solid-svg-icons'
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
  const [isModalCOpen, setIsModalCOpen] = useState(false);
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
  const [searchCriteria, setSearchCriteria] = useState(''); // Default criteria
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAttribute, setSortAttribute] = useState('');
  const [sortDirection, setSortDirection] = useState(0); // 0: none, 1: ascending, -1: descending
  const [mode, setMode] = useState('add'); // 'add' or 'delete'
  const [newAppName, setNewAppName] = useState('');
  const [adminApplications, setApplications] = useState([{ appId: 1, appName: 'API' }, { appId: 2, appName: 'PUP' }, { appId: 3, appName: 'RFS' }, { appId: 4, appName: 'TBD' }, { appId: 5, appName: 'INF' }, { appId: 6, appName: 'TCS' }, { appId: 7, appName: 'MQS' }]); // Example initial apps
  const [selectedApp, setSelectedApp] = useState('');
  const navigate = useNavigate();

  window.remove = RemovePrimedApplication;
  window.add = addPrimedApplication;
  window.users = users;

  let selectedUser;
  let unusedApps;

  if (users.length > 0) {
    selectedUser = users.findIndex(item => item.uid === userID);

    unusedApps = adminApplications.filter(app => !users[selectedUser].applications.includes(app.appName));
  }



  useEffect(() => {
    //on load logic
    const session = localStorage.getItem('session');

    if (!session) {
      navigate('/login');
    } else {
      applications = JSON.parse(localStorage.getItem('apps'))
      setNewServerApplication(applications[0].appName);

      isAdmin = JSON.parse(localStorage.getItem('admin'));
      RequestHandler('servers', { isAdmin: isAdmin, uid: localStorage.getItem('session') }).then(response => {
        setServers(response.servers)
      })

      if (isAdmin) {
        RequestHandler('users', { isAdmin }).then(response => {
          setUsers(response);

        })
        RequestHandler('auth', { username: localStorage.getItem('username'), password: localStorage.getItem('password') }).then(response => {
          // console.log(response)
          console.log(response)
          setApplications(response.applications)
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

  useEffect(() => {
    if (users.length > 0 && !effectRan) {
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
    setSelectedApp(adminApplications[0].appName);
    let appcheck = adminApplications.length < 1 ? 'add' : mode;
    setMode(appcheck)
  }, [adminApplications])



  const deleteServer = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setServers(servers.filter(server => server.id !== id));
      RequestHandler('delete', { id: id });
    }

  };

  const updateServer = (id, updatedInfo) => {
    setServers(servers.map(server => server.id === id ? { ...server, ...updatedInfo } : server));
    // console.log(adminApplications.filter(app => app.appName === updatedInfo.application)[0])
    RequestHandler('add', { userId: localStorage.getItem('username'), id: id, ...updatedInfo, application: adminApplications.filter(app => app.appName === updatedInfo.application)[0] })
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
    setUserID(users[0].uid);
  };


  const openModalC = () => {
    setIsSidebarOpen(false);

    setIsModalCOpen(true);
    // setUserID(users[0].id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalBOpen(false);
    setIsModalCOpen(false);
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
    RequestHandler('add', { ...newServer, userId: localStorage.getItem('username'), application: adminApplications.filter(app => app.appName === newServerApplication)[0] });

    setDestinationHostname('');
    setDestinationIP('');
    setDestinationPort('');
    setSourceHostname('');
    setSourceIp('');
    setNewServerApplication(applications[0].appName);


    closeModal();
  };

  // const handleAddUser = () => {

  //   let updatedUserAppList = [...users[selectedUser].applications, addPrimedApplication];
  //   console.log(adminApplications.filter(app => app.appName === addPrimedApplication)[0])
  //   let finalList = [];

  //   for (let i of updatedUserAppList) {
  //     for (let j of adminApplications) {
  //       if (i == j.appName) {
  //         finalList.push({ appInfoId: j.appId, user_apps_uid: Math.floor(Date.now() / Math.random()), modifiedBy: localStorage.getItem('username'), createdBy: localStorage.getItem('username') })
  //       }
  //     }
  //   }

  //   RequestHandler('modifyuser', { isAdmin: isAdmin, id: userID, applications: finalList }); //  [{appId, createdAt, createdBy, modifiedAt, modifiedAt, modifiedBy, user_apps_uid (Date.now()) }, ...{}]
  //   setUsers(users.map(user => user.uid === userID ? { ...user, applications: [...user.applications, addPrimedApplication] } : user));

  // }

  // const handleRemoveUser = () => {
  //   let updatedUserAppList = users[selectedUser].applications.filter(app => app !== RemovePrimedApplication)
  //   let finalList = [];

  //   for (let i of updatedUserAppList) {
  //     for (let j of adminApplications) {
  //       if (i == j.appName) {
  //         finalList.push({ appInfoId: j.appId, user_apps_uid: Math.floor(Date.now() / Math.random()), modifiedBy: localStorage.getItem('username'), createdBy: localStorage.getItem('username') })
  //       }
  //     }
  //   }

  //   RequestHandler('modifyuser', { isAdmin: isAdmin, id: userID, applications: finalList });
  //   setUsers(users.map(user => user.uid === userID ? { ...user, applications: user.applications.filter(app => app !== RemovePrimedApplication) } : user));

  // }


  const handleAddUser = () => {

    const addedApp = adminApplications.filter(app => app.appName === addPrimedApplication)[0];


    RequestHandler('modifyuser/add/', { isAdmin: isAdmin, id: userID, application: { appInfoId: addedApp.appId, user_apps_uid: Math.floor(Date.now() / Math.random()), modifiedBy: localStorage.getItem('username'), createdBy: localStorage.getItem('username') } }); //  [{appId, createdAt, createdBy, modifiedAt, modifiedAt, modifiedBy, user_apps_uid (Date.now()) }, ...{}]
    setUsers(users.map(user => user.uid === userID ? { ...user, applications: [...user.applications, addPrimedApplication] } : user));

  }

  const handleRemoveUser = () => {
    const removedApp = adminApplications.filter(app => app.appName === RemovePrimedApplication)[0];

    RequestHandler('modifyuser/delete/', { isAdmin: isAdmin, id: userID, appInfoId: removedApp.appId });
    setUsers(users.map(user => user.uid === userID ? { ...user, applications: user.applications.filter(app => app !== RemovePrimedApplication) } : user));

  }


  const toggleMode = (selectedMode) => {
    if (selectedMode === 'delete') {
      adminApplications.length > 0 && setMode(selectedMode);
    } else {
      setMode(selectedMode);
    }

  };

  const addApp = () => {
    if (newAppName.length === 3) {
      const genId = Date.now() * 2;
      RequestHandler('/appInfo/add', { isAdmin: isAdmin, application: { appInfoId: genId, app_desc: newAppName.toUpperCase(), createdAt: new Date().toISOString().replace('Z', "+00:00"), modifiedAt: new Date().toISOString().replace('Z', "+00:00"), modifiedBy: localStorage.getItem('username') } });
      setApplications([...adminApplications, { appId: genId, appName: newAppName.toUpperCase() }]);
      setNewAppName(''); // Clear input field
    }

  };

  const deleteApp = () => {
    console.log(adminApplications);
    const deletedApp = adminApplications.filter(app => app.appName === selectedApp);
    console.log(deletedApp)
    console.log('here')

    if (deletedApp.length > 0) {
      RequestHandler('/appInfo/delete', { isAdmin: isAdmin, application: deletedApp[0] });
      setApplications(adminApplications.filter(app => app.appName !== selectedApp));
    }


  };

  const exportData = () => {
    const fileName = 'whitelist'
    const exportType = exportFromJSON.types.xls

    exportFromJSON({ data: servers, fileName, exportType })
  }

  const sortedServers = sortDirection === 0 ? servers : structuredClone(servers).sort((a, b) => {
    if (!sortAttribute || sortDirection === 0) return 0; // No sorting

    let compareA = a[sortAttribute];
    let compareB = b[sortAttribute];

    if (sortAttribute.includes('Ip')) {
      compareA = compareA.split('.').map(num => (`000${num}`).slice(-3)).join('.');
      compareB = compareB.split('.').map(num => (`000${num}`).slice(-3)).join('.');
    }

    if (compareA < compareB) return sortDirection === 1 ? -1 : 1;
    if (compareA > compareB) return sortDirection === 1 ? 1 : -1;
    return 0;
  });

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
        {isAdmin && (
          <div className="sidebar-item" onClick={() => openModalB()}>
            <FontAwesomeIcon icon={faScrewdriverWrench} /><span>Manage Users</span>
          </div>
        )}
        {isAdmin && (
          <div className="sidebar-item" onClick={() => openModalC()}>
            <FontAwesomeIcon icon={faRocket} /><span>Manage Applications</span>
          </div>
        )}
        <div className="sidebar-item" onClick={() => exportData()}>
          <FontAwesomeIcon icon={faFileArrowDown} /><span>Export</span>
        </div>
        <div className="sidebar-item" onClick={() => { localStorage.removeItem("apps"); localStorage.removeItem("session"); localStorage.removeItem("admin"); navigate("/login") }}>
          <span>Logout</span>
        </div>
      </div>

      {/* Application Management Modal */}
      {isModalCOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ width: "400px" }}>
            <div className="modal-header">
              <button className="close-btn" onClick={closeModal}>X</button>
            </div>
            <div className='modal-content'>
              <span>Manage Applications</span>
              <div className='button-block'>
                <button
                  onClick={() => toggleMode('add')}
                  className={`mode-button ${mode === 'add' ? 'green' : ''}`}
                >Add</button>
                <button
                  onClick={() => toggleMode('delete')}
                  className={`mode-button ${mode === 'delete' ? 'red' : ''}`}
                >Delete</button>
              </div>
              {(mode === 'add' || adminApplications.length < 1) && (
                <div className='modal-block-app'>
                  <input
                    type="text"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    maxLength="3"
                    placeholder='APP...'
                    style={{ textTransform: "uppercase" }}
                  />
                  <div className='arrow-up-button' onClick={addApp}>
                    <FontAwesomeIcon fontSize={29} width={50} height={50} icon={faCircleUp} />
                  </div>
                </div>
              )}
              {(mode === 'delete' && adminApplications.length > 0) && (
                <div className='modal-block-app'>
                  <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)}>
                    {adminApplications.map(app => (
                      <option key={app.appName} value={app.appName}>{app.appName}</option>
                    ))}
                  </select>
                  <div className='trash-button' onClick={deleteApp}>
                    <FontAwesomeIcon fontSize={25} width={50} height={50} icon={faTrash} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                  <option key={index} value={user.uid}>User: {user.uid}</option>
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
                      <option key={index} value={application.appName}>{application.appName}</option>
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
          <div className="modal" >
            <div className="modal-header">

              <button className="close-btn" onClick={closeModal}>X</button>
            </div>
            <div className='modal-content'>
              <span>Server Information</span>
              <form onSubmit={handleAddServer}>
                <select required onChange={(e) => setNewServerApplication(e.target.value)}>
                  {applications.map((application, index) => (
                    <option key={index} value={application.appName}>{application.appName}</option>
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
        <div className="search-area">
          <select value={searchCriteria} onChange={(e) => setSearchCriteria(e.target.value)}>
            <option value="" selected>Search by</option>
            <option value="hostname">Hostname</option>
            <option value="hostIp">Host IP</option>
            <option value="sourceHostname">Source Hostname</option>
            <option value="sourceIp">Source IP</option>
            <option value="app">Application Name</option>
            {/* Add more criteria as needed */}
          </select>
          <input
            type="text"
            placeholder="server..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="sort-area">
            <select value={sortAttribute} onChange={(e) => setSortAttribute(e.target.value)}>
              <option value="" selected>Sort by</option>
              <option value="name">Hostname</option>
              <option value="ip">Host IP</option>
              <option value="sourceName">Source Hostname</option>
              <option value="sourceIP">Source IP</option>
              <option value="application">Application Name</option>
              {/* Add more sorting attributes as needed */}
            </select>
            <button
              onClick={() => setSortDirection(sortDirection === 1 ? -1 : sortDirection + 1)}
              className={`sort-button ${sortDirection === 1 ? 'green' : sortDirection === -1 ? 'red' : ''}`}
            >
              {sortDirection === 0 ? "-" : sortDirection === 1 ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {servers.length > 0 ? (

          sortedServers.filter(server => {
            if (!searchQuery) return true; // If no query, don't filter out anything
            const regex = new RegExp(searchQuery, 'i'); // Case insensitive search
            switch (searchCriteria) {
              case 'hostname':
                return regex.test(server.name);
              case 'hostIp':
                return regex.test(server.ip);
              case 'sourceIp':
                return regex.test(server.sourceIP);
              case 'soureHostname':
                return regex.test(server.sourceName);
              case 'app':
                return regex.test(server.application);
              // Add more cases for different criteria later
              default:
                return true;
            }
          }).map(server => (
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