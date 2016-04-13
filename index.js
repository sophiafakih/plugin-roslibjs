function ros(name, deps) {
  console.log("ROS plugin started");

  // Start a ROS session 
  var ROSLIB = require("roslib")
  var ros = new ROSLIB.Ros({
    url : 'ws://192.168.254.2:9090'
  });

  ros.on('connection', function() {
    console.log('ROS connected to websocket');
  });

  ros.on('error', function(error) {
    console.log('ROS error connecting to websocket');
  });

  ros.on('close', function() {
    console.log('ROS closed websocket connection');
  });


  // DEBUG TOPIC
  var rosDebug = new ROSLIB.Topic({
    ros : ros,
    name : '/openrov/debug',
    messageType : 'std_msgs/String'
  });

  var debug = new ROSLIB.Message({
    data : ''
  });

  // RAW STATUS TOPIC
  var rosStatus = new ROSLIB.Topic({
    ros : ros,
    name : '/openrov/status',
    messageType : 'openrov/rovstatus'
  });

  var status = new ROSLIB.Message({
    status : ''
  });

  // MOTOR TARGET TOPIC 
  var rosMotorTarget = new ROSLIB.Topic({
    ros : ros,
    name : '/openrov/motortarget',
    messageType : 'openrov/motortarget'
  });
/*
  var motortarget = new ROSLIB.Message({
    motors : [0,0,0]
  });
*/

  // NAVDATA TOPIC
  var rosNavData = new ROSLIB.Topic({
    ros : ros,
    name : '/openrov/navdata',
    messageType : 'openrov/navdata'
  });

  var navdata = new ROSLIB.Message({
    roll : 0.0,
    pitch : 0.0,
    yaw : 0.0,
    thrust : 0.0,
    heading : 0.0,
    depth : 0.0,
  });

  // TEMPERATURE TOPIC
  var rosTemperature = new ROSLIB.Topic({
    ros : ros,
    name : '/openrov/temperature',
    messageType : 'sensor_msgs/Temperature'
  });

  var temperature = new ROSLIB.Message({
    temperature : 0.0,
    variance : 0.0
  });

  // PRESSURE TOPIC
  var rosPressure = new ROSLIB.Topic({
    ros : ros,
    name : '/openrov/pressure',
    messageType : 'sensor_msgs/FluidPressure'
  });

  var pressure = new ROSLIB.Message({
    fluid_pressure : 0.0,
    variance : 0.0
  });

  // RATE BASED MOTOR CONTROL TOPIC
  var rosCmdRate = new ROSLIB.Topic({
    ros : ros,
    name : '/openrov/cmd_rate',
    messageType : 'geometry_msgs/Twist'
  });
  
    // POSITION BASED MOTOR CONTROL TOPIC
  var rosCmdPose = new ROSLIB.Topic({
    ros : ros,
    name : '/openrov/cmd_pose',
    messageType : 'geometry_msgs/Pose'
  });
  
   // DIAGNOSTIC MESSAGES
   // VOLTAGE
   var rosVoltage = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/diagnostics/voltage',
     messageType : 'diagnostic_msgs/KeyValue'
   });
   
   var voltage = new ROSLIB.Message({
     key : 'voltage',
     value : ''
   });
   
   // CURRENT
   var rosCurrent = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/diagnostics/current',
     messageType : 'diagnostic_msgs/KeyValue'
   });
   
   var current = new ROSLIB.Message({
     key : 'current',
     value : ''
   });
   
   // CPU USAGE
   var rosCPU = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/diagnostics/cpu_usage',
     messageType : 'diagnostic_msgs/KeyValue'
   });
   
   var cpu = new ROSLIB.Message({
     key : 'cpu',
     value : ''
   });
   
   // CAM SERVO TILT
   var rosServo = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/camera_servo',
     messageType : 'std_msgs/UInt16'
   });
   
   var cam_servo = new ROSLIB.Message({
     data : 0.0
   });

  console.log('ROS finished loading ros things.');

  // Subscribe to rate motor control topic
  rosCmdRate.subscribe(function(message) {
    console.log('ROS recived rate command');

    deps.rov.send('yaw('+message.angular.z*100+')');
    deps.rov.send('pitch('+message.angular.x*100+')');
    deps.rov.send('roll('+message.angular.y*100+')');
    deps.rov.send('thrust('+message.linear.y*100+')');
    deps.rov.send('lift('+message.linear.z*100+')');
    deps.rov.send('strafe('+message.linear.x*100+')');
  });
  
  // Subscribe to position motor control topic
  rosCmdPose.subscribe(function(message) {
    console.log('ROS recived pose command');
    
    //deps.rov.send('deptlon('+message.position.z+')');
    //deps.rov.send('headlon('+message.position.z+')');
  });

  // Listen to Status
  deps.rov.on('status', function (data) {
    status.status = JSON.stringify(data);
    rosStatus.publish(status);

    if ('mtarg' in data) {
      var mtargs = data.mtarg.split(",");
      //motortarget[0] = parseInt(mtargs[0]);
      //motortarget[1] = parseInt(mtargs[1]);
      //motortarget[2] = parseInt(mtargs[2]);
      //rosMotorTarget.publish(motortarget);
    }

    if ('temp' in data) {
      temperature.temperature = parseFloat(data.temp);
      rosTemperature.publish(temperature);
    }

    if ('pres' in data) {
      pressure.fluid_pressure = parseFloat(data.pres);
      rosPressure.publish(pressure);
    }
    
    if ('vout' in data) {
      voltage.value = JSON.stringify(data.vout);
      rosVoltage.publish(voltage);
    }
    
    if ('iout' in data) {
      current.value = JSON.stringify(data.iout);
      rosVoltage.publish(voltage);
    }
    
    if ('cpuUsage' in data) {
      current.value = JSON.stringify(data.cpuUsage);
      rosCPU.publish(cpu);
    }
    
    if ('servo' in data) {
      cam_servo.data = parseInt(data.servo);
      rosServo.publish(cam_servo);
    }
    
  });

  // Listen to Navdata
  deps.rov.on('navdata', function (data) {
    if ('roll' in data) navdata.roll = parseFloat(data.roll);
    if ('pitch' in data) navdata.pitch = parseFloat(data.pitch);
    if ('yaw' in data) navdata.yaw = parseFloat(data.yaw);
    if ('thrust' in data) navdata.thrust = parseFloat(data.thrust);
    if ('hdgd' in data) navdata.heading = parseFloat(data.hdgd);
    if ('depth' in data) navdata.depth = parseFloat(data.depth);
    else if ('deapth' in data) navdata.depth = parseFloat(data.deapth);
    rosNavData.publish(navdata);
  });

  // This is how you would register a listner to traffic from 
  // the browser. Currently listening to a Depth Hold Toggle 
  // from Cockpit and publishing a ROS message
  deps.io.sockets.on('connection', function (socket) {
    socket.on('holdDepth_toggle', function () {
      debug.data = 'Hold depth toggled'
      rosDebug.publish(debug);
    });
  });

};

module.exports = ros;
