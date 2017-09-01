Creating a new application is really easy. To do so, you have to follow the next few steps:
<br>

### Step 1: Create the main file
First you need to create new file. You will use this file as the starting point for all the interaction with JNode, so you need to put it in the same folder were you installed JNode. For now, we will call the file ```main.js```.
<br><br>

### Step 2: Require JNode
The first thing to do in every project is to require JNode. You can do this with one quick line of code.
```javascript
var jnode = require('jnode');
```
<br>

### Step 3: Settings and turning on the server
The next thing will be to change a setting. We will set debug to true so we can test if jnode is starting correctly.
```javascript
jnode.debug = true;
```
You are not required to turn on debugging. We'll just using it for testing. To start the server we just need to turn it on.
```javascript
jnode.start();
```
<br>

### Step 4: All the code together
If you followed all the steps your file should look like this:
```javascript
var jnode = require('jnode');
jnode.debug = true;
jnode.start();
```
<br>

### Step 5: Starting the server
To start the NodeJS server you just need to use the following command:
```
node main.js
```
This will start the server and if everything is working correctly it should log that the server has started listening on port 80. If you want to server hit CTRL+C and the server will stop.
<br><br>

Now your first server is up and running take a look at some of the other tutorials.
