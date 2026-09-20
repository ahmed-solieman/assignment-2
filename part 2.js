const http = require('http');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, 'users.json');

const readUsersFromFile = () => {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile, 'utf-8');
    return data ? JSON.parse(data) : [];
};

const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && req.url === '/user') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newUser = JSON.parse(body);
            const users = readUsersFromFile();

            if (users.find(u => u.email === newUser.email)) {
                res.writeHead(400);
                return res.end(JSON.stringify({ message: "Email already exists." }));
            }

            newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
            users.push(newUser);
            writeUsersToFile(users);

            res.writeHead(201);
            res.end(JSON.stringify({ message: "User added successfully." }));
        });
    }

    else if (req.method === 'GET' && req.url === '/user') {
        const users = readUsersFromFile();
        res.writeHead(200);
        res.end(JSON.stringify(users));
    }

    else if (req.url.startsWith('/user/')) {
        const id = parseInt(req.url.split('/')[2]);
        let users = readUsersFromFile();
        const userIndex = users.findIndex(u => u.id === id);

        if (req.method === 'GET') {
            if (userIndex !== -1) {
                res.writeHead(200);
                res.end(JSON.stringify(users[userIndex]));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: "User not found." }));
            }
        }

        else if (req.method === 'PATCH') {
            if (userIndex === -1) {
                res.writeHead(404);
                return res.end(JSON.stringify({ message: "User ID not found." }));
            }

            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const updates = JSON.parse(body);
                users[userIndex] = { ...users[userIndex], ...updates };
                writeUsersToFile(users);

                res.writeHead(200);
                res.end(JSON.stringify({ message: "User updated successfully." }));
            });
        }

        else if (req.method === 'DELETE') {
            if (userIndex === -1) {
                res.writeHead(404);
                return res.end(JSON.stringify({ message: "User ID not found." }));
            }

            users.splice(userIndex, 1);
            writeUsersToFile(users);
            res.writeHead(200);
            res.end(JSON.stringify({ message: "User deleted successfully." }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});