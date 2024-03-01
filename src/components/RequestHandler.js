import axios from "axios";

const isMock = true;

// Search and Sort
// Visual spasc


async function RequestHandler(route, data) {

    switch (route) {
        case 'auth':
            if (isMock) {
                console.log(data)
                if (data.username === 'user' && data.password === 'pass')
                    return { authenticated: true, applications: ['API', 'PUP', 'RFS', 'TBD', 'INF', 'TCS', 'MQS'] }
                else
                    return { authenticated: false, applications: [] }
            } else {
                const response = await axios.get(`/auth?username=${data.username}&password=${data.password}`);
                const parsedResponse = {}; // parse response data to match mock form

                return parsedResponse;
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
                const response = await axios.get(`/servers?username=${data.username}&password=${data.password}`);
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
        case 'update':
            if (isMock) {
                return { status: true }
            } else {
                const response = await axios.post('/update', {
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