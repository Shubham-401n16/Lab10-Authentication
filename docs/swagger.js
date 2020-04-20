const generateSwagger =(app) => {
    const expressSwagger = require('express-swagger-generator')(app);
    
    let options = {
        swaggerDefinition: {
            info: {
                description: 'Access CRUD operations for signup and signin',
                title: 'Lab10-Authentication',
                version: '1.0.0',
            },
            host: 'localhost:3000',
            basePath: '/',
            produces: [
                "application/json",
                "application/xml"
            ],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
                }
            }
        },
        basedir: __dirname, //app absolute path
        files: ['../lib/server.js','../lib/routes/auth-router.js'] //Path to the API handle folder
    };
    expressSwagger(options);
    //app.listen(3001);
}

module.exports = generateSwagger;