# OpenROV Cockpit ROS Plugin

This repository contains the OpenROV Cockpit plugin enabling communication with ROS kinetic.
Several packages need to be installed on the Beagle Bone Black (BBB) for the plugin to function, so your ROV will need internet access. There are multiple ways to do this, but the most surefire method used for this guide was the connect the BBB directly to a LAN that will provide a DHCP address, plugging the BBB into your computer using the supplied USB cable, and disabling the OpenROV proxy server. The USB port (should) show up on your computer as a USB network interface. Configure it with IP `192.168.7.1` and netmask `255.255.255.252`.

This guide has been tested under OpenROV software version 30.0.3

First, ssh (default user and pass: 'OpenROV' no quotes) into the ROV, disable the proxy server and update apt

    ssh rov@192.168.7.2
    sudo /etc/init.d/openrov-proxy stop
    sudo apt-get update

Now, install the necessary apt packages (some may already be installed)

    sudo apt-get install libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++

Install canvas

    sudo chown -R $USER /usr/local
    cd /opt/openrov/cockpit/src/plugins
    npm install canvas@1.2.2

Install roslib

    npm install roslib@0.15.0

Install the OpenROV ROS Cockpit plugin

    git clone https://github.com/sophiafakih/plugin-roslibjs.git ros

the ROS plugin should be ready now! If it does not work, you have to go to the following file and delete its content:
    
             /opt/openrov/cockpit/src/node_modules/roslib/node_modules/xmlshim/node_modules/jsdom/node_modules/cssstyle/lib/CSSStyleDeclaration.js


This should solve the problem and the plugin will load automatically when the ROV boots, or if you restart cockpit.

You can monitor this on the ROV via

    tail -f /var/log/openrov.log |grep ROS

Note that for the plugin to function properly, you cannot load the cockpit on your browser
(i.e. don't have any browser windows open to 192.168.254.1:8080). You have to wait at least 40secs for the node.js server to be initialized. Then you can open the cockpit in a browser window. 

With the node running, you should see a message once you've sucessfully connected
via the rosbridge_socket.

 List of currently availiable commands here:

#Run motors [port, vert, stbd]
    rostopic pub -1 openrov/motortarget openrov/motortarget '{motors:[1500, 1500, 1500]}'
#Lasser toggle
    rostopic pub -1 openrov/laser_toggle std_msgs/Int32 '{data: 0}'
#Light level control
    rostopic pub -1 openrov/light_command std_msgs/Float32 '{data: 0.5}'
#Cam servo control
    rostopic pub -1 openrov/servo_cam_tilt std_msgs/Float32 '{data: 0.0}' 
#Lift and yaw control
    rostopic pub /openrov/cmd\_rate geometry\_msgs/Twist '{linear: {x: 0.0, y: 0.0, z: 0.5}, angular: {x: 0.0,y: 0.0,z: 0.5}}'
