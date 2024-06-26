import React, { useState } from 'react';
import '../styles/ServerItem.css'; // Create this CSS file for styling the component
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ServerItem({ server, onDelete, onUpdate, applications }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [name, setName] = useState(server.name);
    const [application, setApplication] = useState(server.application);
    const [ip, setIp] = useState(server.ip + ":" + server.port);
    const [ipstatus, setIpStatus] = useState(server.ipstatus); // New state for ipStatus
    const [port, setPort] = useState(server.port); // New state for ipStatus
    const [sourceIP, setSourceIP] = useState(server.sourceIP); // New state for ipStatus
    const [sourceName, setSourceName] = useState(server.sourceName); // New state for ipStatus


    const handleIPPort = (data) => {

        if (data.split(":").length === 2) {
            onUpdate(server.id, { name, application, ip: data.split(":")[0], ipstatus, port: data.split(":")[1], sourceIP, sourceName })
        } else {
            alert("Invalid IP Adress!")
        }


    }

    const handleIpStatusToggle = (data) => {
        if (data.split(":").length === 2) {
            setIpStatus(!ipstatus); // Toggle the boolean value
            onUpdate(server.id, { name, application, ip: data.split(":")[0], ipstatus: !ipstatus, port: data.split(":")[1], sourceIP, sourceName })
        } else {
            alert("Invalid IP Adress!")
        }

    };


    return (
        <div className="server-item">
            <div className="server-summary" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="server-info" style={{ color: server.ipstatus ? '#016749' : 'red' }}>
                    <p style={{ marginLeft: 5 }}><strong>Hostname:</strong> {server.name}</p>
                    <p><strong>Application:</strong> {server.application}</p>
                    <p><strong>IP Address:</strong> {server.ip}:{server.port}</p>
                </div>
                <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
            </div>
            {isExpanded && (
                <div className="server-details">
                    <div className='server-block'>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Update  Hostname" />
                        <button onClick={() => handleIPPort(document.getElementById(server.id).value)}>Update</button>
                    </div>
                    <div className='server-block'>

                        <select value={application} onChange={(e) => setApplication(e.target.value)}>
                            {applications.map((applicationOption, index) => (
                                <option key={index} value={applicationOption.appName}>{applicationOption.appName}</option>
                            ))}
                        </select>
                        <button onClick={() => handleIPPort(document.getElementById(server.id).value)}>Update</button>

                    </div>
                    <div className='server-block'>
                        <input id={server.id} value={ip} onChange={(e) => setIp(e.target.value)} placeholder="Update IP" />
                        <button onClick={() => handleIPPort(document.getElementById(server.id).value)}>Update</button>
                    </div>
                    {/* <div className='server-block'>
                        <input value={port} onChange={(e) => setPort(e.target.value)} placeholder="Port" />
                        <button onClick={() => onUpdate(server.id, { name, application, ip, ipstatus, port, sourceIP, sourceName })}>Update</button>
                    </div> */}

                    <p>Source IP</p>
                    <div className='server-block'>
                        <input value={sourceName} onChange={(e) => setSourceName(e.target.value)} placeholder="Update Source Hostname" />
                        <button onClick={() => handleIPPort(document.getElementById(server.id).value)}>Update</button>
                    </div>
                    <div className='server-block'>
                        <input value={sourceIP} onChange={(e) => setSourceIP(e.target.value)} placeholder="Update IP" />
                        <button onClick={() => handleIPPort(document.getElementById(server.id).value)}>Update</button>
                    </div>

                    <div>
                        <label className="switch">
                            <input type="checkbox" checked={ipstatus} onChange={() => handleIpStatusToggle(document.getElementById(server.id).value)} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className='trash-button' onClick={() => onDelete(server.id)}>
                        <FontAwesomeIcon fontSize={25} width={50} height={50} icon={faTrash} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServerItem;