# OpenROV Cockpit ROS Plugin

This repository contains the OpenROV Cockpit plugin enabling communication with ROS.
Several packages need to be installed on the Beagle Bone Black (BBB) for the plugin to function, so your ROV will need internet access. There are multiple ways to do this, but the most surefire method used for this guide was the connect the BBB directly to a LAN that will provide a DHCP address, plugging the BBB into your computer using the supplied USB cable, and disabling the OpenROV proxy server. The USB port (should) show up on your computer as a USB network interface. Configure it with IP `192.168.7.1` and netmask `255.255.255.252`.

This guide has been tested under OpenROV software version 30.0.3

First, ssh (default pass: 'OpenROV' no quotes) into the ROV, disable the proxy server and update apt

    ssh rov@192.168.7.2
    sudo /etc/init.d/openrov-proxy stop
    sudo apt-get update

Now, install the necessary apt packages (some may already be installed)

    sudo apt-get install libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential

Install canvas

    sudo chown -R $USER /usr/local
    cd /opt/openrov/cockpit/src/plugins
    npm install canvas

Install roslib

    npm install roslib

Install the OpenROV ROS Cockpit plugin

    git clone https://github.com/laughlinbarker/plugin-roslibjs.git ros

the ROS plugin should be ready now!

The plugin will load automatically when the ROV boots, or if you restart cockpit.

You can monitor this on the ROV via

    tail -f /var/log/openrov.log |grep ROS

Note that for the plugin to function properly, you cannot load the cockpit on your browser
(i.e. don't have any browser windows open to 192.168.254.1:8080)

With the node running, you should see a message once you've sucessfully connected
via the rosbridge_socket.

 (make list of currently availiable commands here)

#Run motors [port, vert, stbd]
    rostopic pub -1 openrov/motortarget openrov/motortarget '{motors:[1500, 1500, 1500]}'
