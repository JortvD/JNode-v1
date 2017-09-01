There are a few steps you need to go through when installing JNode:
<br>

### Step 1: Installing NodeJS
Go to the NodeJS [download](https://nodejs.org/en/download/current/) page and download the latest version for your operating system. After installing NodeJS, execute the installation file, if needed. When your done with installing NodeJS and NPM you can test if it has worked with the command ```node -v```. If the installation went correctly it should show it's current version.
<br>

### Step 2: Installing Git
To install JNode you will need Git. Follow the tutorial for your operating system.

**Windows**<br>
Go to [this](https://git-for-windows.github.io/) site and click the download button. This will automatically download the latest version of Git for Windows. When it's done downloading, double click the file and go through the installation process. To check if Git installed succesfully use the command ```git --version```.

**MacOS**<br>
Follow [this](https://sourceforge.net/projects/git-osx-installer/files/) link to find the Git installers for MacOS. Please select the version at the top. After downloading the file you can install Git by double clicking the file. To check if Git installed succesfully use the command ```git --version```.

**Linux**<br>
For installing git on Linux (Debian/Ubuntu) you only have to use the following commands:
```
sudo apt-get update
sudo apt-get install git
```
<br>

### Step 3: Installing JNode
To installing JNode you will need to use the following commands:
```
npm init
npm install https://gitlab.com/JortvD/JNode.git --save-exact
```
This command will install JNode using NPM and directly save it to your package.json file.
<br>

When you've followed this steps you are ready to move on to the [next tutorial](/tutorial-tutorial1.md).
