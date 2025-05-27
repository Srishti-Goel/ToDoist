# Making of the Login-SignUp Functionality

There are basically 2 parts to the code - the client-side and the server-side code
## Server-side
This is the part of the code responsible for all DB transactions. The DB we use in this is a MongoDB one.  
### What all was needed on the server?
1. Create a MongoDB Cluster using the WebUI
2. Connect to the DB table with the <connection string>/<table name>
3. A log-in API which is of the POST kind. This guy must validate the inputs (even if the same is done on the client-side, no harm done here),