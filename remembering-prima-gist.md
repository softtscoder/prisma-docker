# Prisma Init Notes:

#### prsima cli must be installed
```
$ npm install -g primsa
```
### then run
```
$ prsima init
```
### you will be presented with a few options, of which I am familiar with two

# Option 1: Create new Database
### aka "Set up a local database using Docker" (note, this requires you have Docker on your system )

#### this will create three files

### 1. docker-compose.yml
#### specifies two images, one for the prisma service and one for the mysql daatabase image.

### 2. prisma.yml
#### endpoint: specifies the endpoint of the api and needs to match the url of the prisma server deployed with Docker.
#### datamodel: points to datamodel file with schema definitions for whatever we intend to store in our prsima db.  "defines the actual api you work with later".  Prisma uses the Types in the datamodel to generate a graphql api to expose CRUD operations.

### then run
```
$ prsima deploy
```
#### this launches the prisma service to the endpoint specified in prisma.yml.  (the prisma service is not to be confused with the separate graphql server that will function as a middleman between the client and the prisma service )

### At this point you can already interact with the mysql database by running
```
$ prisma playground
```
##### this will launch a graql playground in the browser

### To make changes to the datamodel (i.e. adding a new Type to datamodel.graphql) and migrate the underlying database schema rerun
```
$ prisma deploy
```
### which will update the prisma service with the new Types.

## make sure graphql cli is installed:
```
$ npm install -g graphql-cli
```
### Lastly, after making an update you'll want to run, which will update generated/prisma.graphql with new operations for new Types.  
```
$ graphql get-schema --project database
```

# Now for the GraphQL Middleman Service

### 1. Grab boiler, adjust 
### 2. yarn (or npm install)
### 3. launch with
```
$ yarn dev
```










# Eveything below here is boiler markdown for use above.

### Docker version info

```
$ docker version
```
