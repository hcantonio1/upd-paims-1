How to install and run the software (for testing)!

Installation
    1. Install Node.js and Node Package Manager (npm)
        - Direct installation: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-nodejs-and-npm
        - To check if you have successfully installed Node.js, open a terminal window and execute node
            - Please ensure that your Node.js is at least version 18 or higher
        - To check if you have successfully installed npm, open a terminal window and execute npm --version
    
    2. Install Gatsby Command Line Interface (CLI)
        - Gatsby CLI is an npm package, so simply install via npm install -g gatsby-cli
        - To check if you have it installed, run gatsby --version and ensure that you are on version 3 or newer
    
    3. Install other packages
        - Relevant packages are already included in the .zip file
        - Simply run npm install

    4. Install the database
        - The database is included in the .zip file, labeled paims-recheck-ver3.sql
        - Ensure that you have MySQL installed (either the workbench or as a package)
            - (Further instructions to be added)
        - Import the database
        - Make sure MySQL is running in Services
    
Running the software
    - Ensure that your terminal windows is inside the proper directory (the .zip file contents)
    - On one terminal window, run gatsby develop
        - Once the development bundle has finished, you are free to proceed and go to localhost:8000 for the website
    - On another terminal window, run node expressApp.js
        - This is necessary to run queries for the database in the website
    - As of now, the current username and password for testing is:
        - Username: hcantonio1@up.edu.ph
        - Password: thispass