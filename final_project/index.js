const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "SECRET_KEY", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    // write auth logic with express-session from the request object
    if (req.session.authorization) {
        const username = req.session.authorization.username;
        console.log(`AUTHORIZING: User: ${username}`);
        //   console.log(JSON.stringify(req.session.authorization));

        let token = req.session.authorization.accessToken;
        // console.log(token);
        jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
            if (!err) {
                // req.user = decoded;
                console.log("AUTHORIZING SUCCESSFUL");
                next();
            } else {
                console.log("Error: " + err);
                res.status(401).send("Unauthorized: You are not Authenticated");
            }
        });
    } else {
        console.log("AUTHORIZING UNSUCCESSFUL: user not logged in");
        res.status(401).send("Unauthorized: You are not logged in!");
    }
});

const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
