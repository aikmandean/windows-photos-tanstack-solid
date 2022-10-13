# SQLite Photo Explorer for Windows 10/11 Photos App
  
### Setup
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