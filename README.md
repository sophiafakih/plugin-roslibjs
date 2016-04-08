This is the ros plugin for OpenROV Cockpit.

Itegration of ROS with the OpenROV

update apt-get
```
sudo apt-get upgrade
```
install necessary packages
```
sudo apt-get install libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential
```
install canvas from the Node Package Manager
```
sudo chown -R $USER /usr/local
cd /opt/openrov/cockpit/src/plugins
npm install canvas
```

install roslib
```
npm install roslib
```

install the plugin (note the below repo has both the cockpit plugin, and the ROS bridge software), break into two repos on git
```
cd /opt/openrov/cockpit/src/plugins
git cline https://github.com/laughlinbarker/plugin-roslibjs.git ros
```

install ros...

install rosbridge & gscam
```
sudo apt-get install ros-indigo-rosbridge-server

sudo apt-get install -y ros-indigo-rosbridge-suite gstreamer0.10 libgstreamer-plugins-base0.10-dev ros-indigo-image-transport ros-indigo-camera-calibration-parsers ros-indigo-camera-info-manager

cd ~/catkin_ws/src
git clone https://github.com/ros-drivers/gscam
cd ..
catkin_make
```

install OpenROV-ros (as above, this is currently in a single repo along with roslib and needs to be broken out)
```
cd ~/catkin_src
git clone https://github.com/laughlinbarker/plugin-roslibjs.git openrov
cd ..
catkin_make
```


