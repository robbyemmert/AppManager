#App Manager
A tool for managing your app's digital resources and resource translations.
###Features
- Web interface for managing app strings and string translations.
- Web interface for managing app HTML documents and document translations.
- Documents can be exported to HTML files in a zipped iOS folder structure.
- Strings can be exported to iOS .strings files in a zipped iOS folder structure.

###Installation
1. Make sure you have Node JS and NPM installed. ([Get Node JS & NPM](http://nodejs.org)).  You'll also need [MongoDb](http://mongodb.org).
2. Clone the repository: `git clone git@github.com:robbyemmert/AppManager.git` (If you plan to make modifications, you should fork it first, then clone your fork ***recommended**).
3. Navigate to the project folder, then run `npm install && bower install` to install all dependencies.
4. Once that's done, you can fire up the project in development mode with `grunt serve`.

###Configuration
*Note: This tool is in alpha development, so configuration requires some coding skill.*  

**Adding/Removing languages:**  
Edit `/client/components/Settings/Settings.service.js`.  This file is an AngularJS service that controls what set of keys and key labels the application uses when fetching information from the database.  
- `this.keys`: An array of keys that defines which string properties App Manager considers keys, as opposed to translations.  
- `this.languages`: An array of languages that defines which string properties App Manager considers as languages, as opposed to string keys.

**Adding/Removing/Changing User Access**
Currently supported User Roles:
- Admin

Edit `/server/config/seed.js`.  Find the User.create command and modify the list of users and properties that are there.
Make sure to restart the server afterward.

###Notes:
**Applying Exported Files**  
To apply exported files to an iOS project:  
1. Unzip the export file.  In the contents, you will see localized folders (i.e. `en.lproj`) for all of the languages App Manager is configured to support.  
2. You can automatically apply these files to your project by typing the following command:
