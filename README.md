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
copy `./Local/Packages/Microsoft.Windows.Photos_8wekyb3d8bbwe/LocalState/MediaDb.v1.sqlite` to `./data/` in the project directory. It may also be in `./Local/Packages/Microsoft.PhotosLegacy_8wekyb3d8bbwe/LocalState/MediaDb.v1.sqlite`
  
You're now ready to use the app.
  
#### 3. Launch the app
In the project directory, run the following:
```
node index.js
```
  
## Features
### Object recognition
<img src="https://i.imgur.com/oMNMtM5.png" />
  
### Full Location
<img src="https://i.imgur.com/WODoO0T.png" />
  
### Camera Make/Model
<img src="https://i.imgur.com/2R24CPL.png" />
  

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
+ Fastify - Backend server, static server
+ Vite - Frontend builder
+ ST - Runtime type definitions