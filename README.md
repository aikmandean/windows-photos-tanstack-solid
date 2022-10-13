# SQLite Photo Explorer for Windows 10/11 Photos App
  
## Setup
#### 1. Dependencies
NPM install the dependencies in the project directory.
```
npm install
```
  
#### 2. Run Windows Photos AI on your photos
Place photos to scan into the `./data/all` folder in 
the project directory.
  
In the Settings app, reset the Photos app to factory settings, 
then open the Photos app. Inside Photos, add the `./data/all` folder 
from the project directory. It will start scanning.
  
After it has finished scanning, you're ready to use the SQLite 
database. Go to folder your `AppData` directory (a hidden folder 
inside your user folder `C:/Users/<YOUR_USER>/AppData`). From there, 
copy `./Local/Packages/Microsoft.Windows.Photos_8wekyb3d8bbwe/LocalState/MediaDb.v1.sqlite` to `./data/` in the project directory.
  
You're now ready to use the app.
  
#### 3. Launch the app
In the project directory, run the following:
```
node index.js
```
  
Open another terminal from inside `./data/all`, then run,
```
npx http-server -p3030
```
  
Open a final terminal from inside `./app`, then run,
```
npx vite --port 3000
```
  
Open your browser to `localhost:8080` to use the app, or 
`localhost:8080/swagger` to see all the APIs.
  
## Packages Used
#### 1. Prisma
The SQLite DB the Windows Photos maintains is highly normalized, 
it's not fun to query. Prisma handles the SQL.
  
#### 2. TanStack Table
Table adds all the filtering, sorting, nested grouping features 
available in the app.

#### 3. TanStack Virtual
Virtual allows 10s of 1000s of rows to be loaded in app. 
All the rows can be filtered against, aggregated, but not 
displayed at once. Instead, only a "screen-full" of rows 
are truly displayed. Uses infinite scrolling similar to social apps.
  
#### 4. Others
+ SolidJS - Frontend framework
+ Fastify - Backend server
+ Swagger - API discovery
+ Http Server - Serves images
+ ST - Runtime type definitions