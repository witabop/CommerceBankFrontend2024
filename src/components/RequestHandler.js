import axios from "axios";

const isMock = true;

// Search and Sort
// Visual spasc


async function RequestHandler(route, data) {

    switch (route) {
        case 'auth':
            if (isMock) {
                if (data.username === 'user' && data.password === 'pass') {
                    return { uid: 2, authenticated: true, admin: false, applications: ['API', 'PUP', 'RFS', 'TBD', 'INF', 'MQS'] }
                }

                else if (data.username === 'admin' && data.password === 'root') {
                    return { uid: 1, authenticated: true, admin: true, applications: ['API', 'PUP', 'RFS', 'TBD', 'INF', 'TCS', 'MQS'] }
                } else
                    return { authenticated: false, isAdmin: false, applications: [] }

            } else {
                const response = await axios.post(`http://localhost:8080/api/v1/users/auth`, {
                    username: data.username,
                    password: data.password
                });
                console.log(response)

                return response.data
            }
        case 'servers':
            if (isMock) {
                return {
                    servers: [
                        { id: 1709250097200, name: 'Puppet Service', application: 'PUP', ip: '192.168.20.1', ipstatus: true, port: 8000, sourceIP: '127.0.0.1', sourceName: 'PUPHost' },
                        { id: 1709250104457, name: 'Files Now', application: 'RFS', ip: '192.168.1.1', ipstatus: false, port: 8080, sourceIP: '10.0.0.1', sourceName: 'RFSHost' }
                    ]
                }
            } else {
                const response = await axios.get(`/servers?UID=${data.UID}`);
                const parsedResponse = {}; // parse response data to match mock form

                return parsedResponse;
            }
        case 'add':
            if (isMock) {
                return { status: true }
            } else {
                const response = await axios.post('/add', {
                    id: data.id,
                    name: data.destinationHostname,
                    application: data.newServerApplication,
                    ip: data.destinationIp,
                    port: data.destinationPort,
                    sourceName: data.sourceHostname,
                    sourceIP: data.sourceIP,
                    ipstatus: data.ipstatus,


                })
                const parsedResponse = {};

                return parsedResponse;
            }

        case 'modifyapps':
            if (isMock) {
                if (data.isAdmin) {
                    return { status: true }
                } else {
                    return {}
                }
            } else {
                const response = await axios.post('/modifyapps', {
                    updatedApps: data.applications
                })
                const parsedResponse = {};
                return parsedResponse;
            }

        case 'users':
            if (isMock) {
                if (data.isAdmin) {
                    return [{ id: 1, applications: ['API', 'PUP', 'RFS', 'TBD', 'INF', 'TCS', 'MQS'] }, { id: 2, applications: ['PUP', 'RFS', 'TBD', 'INF', 'MQS'] }]
                } else {
                    return []
                }

            } else {
                if (data.isAdmin) {
                    const response = await axios.get('/users')
                    const parsedResponse = {};

                    return parsedResponse;
                }

            }
        case 'modifyuser':
            if (isMock) {
                return { status: true }
            } else {
                if (data.isAdmin) {
                    const response = await axios.post('/modifyuser', {
                        id: data.id,
                        application: data.applications,
                    })
                    const parsedResponse = {};

                    return parsedResponse;
                }
            }
        case 'delete':
            if (isMock) {
                return { status: true }
            } else {
                const response = await axios.delete(`/delete/${data.id}`);
                const parsedResponse = {}; // parse response data to match mock form

                return parsedResponse;
            }
    }
}

export default RequestHandler;

