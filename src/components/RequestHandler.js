import axios from "axios";

const isMock = true;

// Search and Sort
// Visual spasc


async function RequestHandler(route, data) {

    switch (route) {
        case 'auth':
            if (!isMock) {
                if (data.username === 'user' && data.password === 'pass') {
                    return { uid: 2, authenticated: true, admin: false, applications: [{ appId: 1, appName: 'API' }, { appId: 3, appName: 'RFS' }, { appId: 5, appName: 'INF' }, { appId: 6, appName: 'TCS' }] }
                }

                else if (data.username === 'admin' && data.password === 'root') {
                    return { uid: 1, authenticated: true, admin: true, applications: [{ appId: 1, appName: 'API' }, { appId: 2, appName: 'PUP' }, { appId: 3, appName: 'RFS' }, { appId: 4, appName: 'TBD' }, { appId: 5, appName: 'INF' }, { appId: 6, appName: 'TCS' }, { appId: 7, appName: 'MQS' }] }
                } else
                    return { authenticated: false, isAdmin: false, applications: [] }

            } else {
                const response = await axios.post(`http://localhost:8080/api/v1/users/auth`, {
                    username: data.username,
                    password: data.password
                });

                let finalApps = []
                for (let i of Object.keys(response.data.applications)) {
                    finalApps.push({ appId: parseInt(i), appName: response.data.applications[i] })
                }

                return { ...response.data, applications: finalApps }
            }
        case 'servers':
            if (!isMock) {
                return {
                    servers: [
                        { id: 1709250097200, name: 'Puppet Service', application: 'PUP', ip: '192.168.20.1', ipstatus: true, port: 8000, sourceIP: '127.0.0.1', sourceName: 'PUPHost' },
                        { id: 1709250104457, name: 'Files Now', application: 'RFS', ip: '192.168.1.1', ipstatus: false, port: 8080, sourceIP: '10.0.0.1', sourceName: 'RFSHost' }
                    ]
                }
            } else {

                if (data.isAdmin) {
                    const response = await axios.get(`http://localhost:8080/api/v1/servers`);
                    console.log(response.data)
                    let finalData = { servers: [] }
                    for (const server of response.data) {
                        finalData.servers.push({
                            id: server.sid,
                            name: server.destinationHostName,
                            application: server.appDesc,
                            ip: server.destinationIpAddress,
                            ipstatus: server.ipStatus,
                            port: parseInt(server.destinationPort),
                            sourceIP: server.sourceIpAddress,
                            sourceName: server.sourceHostname,
                        })
                    }
                    return finalData
                    // return response.data;

                } else {
                    const response = await axios.get(`http://localhost:8080/api/v1/servers/${data.uid}`);
                    let finalData = { servers: [] }
                    for (const server of response.data) {
                        finalData.servers.push({
                            id: server.sid,
                            name: server.destinationHostName,
                            application: server.appDesc,
                            ip: server.destinationIpAddress,
                            ipstatus: server.ipStatus,
                            port: parseInt(server.destinationPort),
                            sourceIP: server.sourceIpAddress,
                            sourceName: server.sourceHostname,
                        })
                    }
                    return finalData

                }

            }
        case 'add':
            if (!isMock) {
                return { status: true }
            } else {

                const response = await axios.post('http://localhost:8080/api/v1/servers/add', {
                    sid: data.id,
                    destinationHostName: data.name,
                    appInfoId: data.application.appId,
                    appDesc: data.application.appName,
                    destinationIpAddress: data.ip,
                    destinationPort: data.port,
                    sourceHostname: data.sourceName,
                    sourceIpAddress: data.sourceIP,
                    ipStatus: data.ipstatus,
                    createBy: data.userId,
                    modifiedBy: data.userId,
                    createdAt: new Date().toISOString().replace('Z', "+00:00"),
                    modifiedAt: new Date().toISOString().replace('Z', "+00:00")


                })

                return response.data;
            }

        case '/appInfo/add':
            if (!isMock) {
                if (data.isAdmin) {
                    return { status: true }
                } else {
                    return {}
                }
            } else {
                console.log(data)
                const response = await axios.post('http://localhost:8080/api/v1/appInfo/add', data.application)


                const parsedResponse = {};
                return response.data;
            }

        case '/appInfo/delete':
            if (!isMock) {
                if (data.isAdmin) {
                    return { status: true }
                } else {
                    return {}
                }
            } else {
                console.log(data.application)
                const response = await axios.delete(`http://localhost:8080/api/v1/appInfo/delete/${data.application.appId}`)
                const parsedResponse = {};
                return response.data;
            }

        case 'users':
            if (!isMock) {
                if (data.isAdmin) {
                    return [{ uid: 1, applications: ['API', 'PUP', 'RFS', 'TBD', 'INF', 'TCS', 'MQS'] }, { uid: 2, applications: ['PUP', 'RFS', 'TBD', 'INF', 'MQS'] }]
                } else {
                    return []
                }

            } else {
                if (data.isAdmin) {
                    const response = await axios.get('http://localhost:8080/api/v1/users')
                    const parsedResponse = {};

                    return response.data;
                }

            }
        case 'modifyuser':
            if (!isMock) {
                return { status: true }
            } else {
                if (data.isAdmin) {
                    const response = await axios.post('http://localhost:8080/api/v1/userapps/modifyusers', {
                        uid: data.id,
                        application: data.applications, //  [{appId, createdAt, createdBy, modifiedAt, modifiedAt, modifiedBy, user_apps_uid (Date.now()) }, ...{}]
                    })
                    console.log({
                        uid: data.id,
                        application: data.applications, //  [{appId, createdAt, createdBy, modifiedAt, modifiedAt, modifiedBy, user_apps_uid (Date.now()) }, ...{}]
                    })
                    const parsedResponse = {};

                    return response.data;
                }
            }
        case 'modifyuser/add/':
            if (!isMock) {
                return { status: true }
            } else {
                if (data.isAdmin) {
                    const response = await axios.post('http://localhost:8080/api/v1/userapps/add', {
                        uid: data.id,
                        application: [data.application], //  [{appId, createdAt, createdBy, modifiedAt, modifiedAt, modifiedBy, user_apps_uid (Date.now()) }, ...{}]
                    })
                    // console.log({
                    //     uid: data.id,
                    //     application: data.application, //  [{appId, createdAt, createdBy, modifiedAt, modifiedAt, modifiedBy, user_apps_uid (Date.now()) }, ...{}]
                    // })
                    const parsedResponse = {};
                    // console.log(data)

                    return response.data;
                }
            }
        case 'modifyuser/delete/':
            if (!isMock) {
                return { status: true }
            } else {
                if (data.isAdmin) {
                    // const response = await axios.post('http://localhost:8080/api/v1/userapps/delete/', {
                    //     uid: data.id,
                    //     appInfoId: data.appInfoId,
                    // })
                    const response = await axios.delete(`http://localhost:8080/api/v1/userapps/delete/${data.id}/${data.appInfoId}`);
                    console.log({
                        uid: data.id,
                        appInfoId: data.appInfoId,
                    })

                    const parsedResponse = {};

                    return response.data;
                }
            }
        case 'delete':
            if (!isMock) {
                return { status: true }
            } else {
                const response = await axios.delete(`http://localhost:8080/api/v1/servers/delete/${data.id}`);
                const parsedResponse = {}; // parse response data to match mock form

                return response.data;
            }
    }
}

export default RequestHandler;

