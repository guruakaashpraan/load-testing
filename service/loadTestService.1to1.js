import { io } from "socket.io-client";
import initializeClient, {
  adminLogin,
  createNewDevice,
  createNewInternalDevice,
  createNewRoom,
  createNewUser,
} from "../client/hiveClient.js";
import fs from "fs";

const internalDeviceIds = [];

const logStream = fs.createWriteStream("logs.txt", { flags: "a" });

const Sockets = {};

const SocketObject = {};

const getLoadTestService1to1 = async () => {
  try {
    // // create a new internal device using admin credentials
    // const adminApiToken = await adminLogin();
    // const numberOfDeviceIds = 1;

    // console.log("adminApiToken", adminApiToken);

    // for (let i = 0; i < numberOfDeviceIds; i++) {
    //   const deviceId = await generateRandomString(16);
    //   const serialNumber = await generateRandomNumbers(6);
    //   const newInternalDeviceApiResponse = await createNewInternalDevice(
    //     adminApiToken,
    //     deviceId,
    //     "RSSI",
    //     "b2b",
    //     "full",
    //     serialNumber
    //   );

    //   console.log(newInternalDeviceApiResponse);
    //   const internalDeviceId = newInternalDeviceApiResponse.data.deviceID;
    //   console.log("internal device id", internalDeviceId);

    //   internalDeviceIds.push(internalDeviceId);
    // }

    // create a new user
    // const user = await createNewUser();
    // const apiToken = user.data.token;
    // console.log("API T", apiToken);

    // // create a new room
    // const newRoomApiResponse = await createNewRoom(
    //   apiToken,
    //   "1200",
    //   "10",
    //   "Medical",
    //   "efgh",
    //   "Reception/Waiting Room"
    // );

    // const roomId = newRoomApiResponse.data._id;
    // console.log("roomId", roomId);

    // const rnd = await generateRandomNumbers(5);

    // for (let i = 0; i < numberOfDeviceIds; i++) {
    //   // create a new device

    //   const newDeviceApiResponse = await createNewDevice(
    //     apiToken,
    //     roomId,
    //     `Device ${rnd}`,
    //     `this the the description for Device ${rnd}`,
    //     internalDeviceIds[i]
    //   );

    //   console.log("device created", newDeviceApiResponse);
    // }

    // await socketService(apiToken);

    await socketService(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODIxZjZkNzJhMGRkNjdiMGRlMmJkZTEiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidXNlcjc2NTUxNzJAcHJhYW4uaW8iLCJuYW1lIjoidXNlcjc2NTUxNzIiLCJ0aW1lWm9uZSI6IkFtZXJpY2EvTmV3X1lvcmsiLCJpYXQiOjE3NDcwNTYzNDMsImV4cCI6MTc0NzE0Mjc0M30.erG_PobAAVtxDkesrn4vxG6ATAMDNn4p7wGDPifi7b4"
    );

    setTimeout(() => {
      getLoadTestService1to1();
    }, 1000 * 15);
  } catch (error) {
    console.log("error", error);
  }
};

const generateRandomString = async (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const generateRandomNumbers = async (length) => {
  let result = "";

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  result = Math.floor(Math.random() * (max - min + 1)) + min;
  return result;
};

const socketService = async (token) => {
  console.log("token", token);

  logStream.write(`\nToken ---- ${token}`);

  // const arr = new Array(700).fill(0);

  for (let i = 0; i < 100; i++) {
    const str = "Socket" + (await generateRandomString(4));
    Sockets[str] = io(process.env.SERVER_URL, {
      // const Socket = io('http://192.168.0.248:8080', {
      transports: ["websocket"],

      path: "/api/v2",
      auth: {
        token: token,
      },
    });

    Sockets[str].on("connection", () => {
      console.log("Connection To SocketIO!");
      //send a getStatus request here
      //   store.dispatch(toggleSocketStatus(true));
    });

    Sockets[str].on("connect", () => {
      console.log("Connect To SocketIO!");
      SocketObject[str] = true;

      logStream.write(
        `\n${new Date().toISOString()} - Connect to SocketIO! for SOCKET ${str}`
      );
      //send a getStatus request here
      //   store.dispatch(toggleSocketStatus(true));
    });

    Sockets[str].on("connect_error", (err) => {
      console.log("socket connect error -->", err.message); // prints the message associated with the error
      if (err.message == "Unauthorized") {
      }
      console.log("socket error", err.message);
      logStream.write(
        `\n${new Date().toISOString()} - Error ${err.message} for SOCKET ${str}`
      );

      //if message is 'Unauthorized' send refresh token request here, if successful, try connection again and resend the request or if failed logout the user.
    });

    Sockets[str].on("disconnect", (reason) => {
      console.log("disconnected from socket --> ", reason);
      SocketObject[str] = false;

      logStream.write(
        `\n${new Date().toISOString()} - Disconnect to SocketIO! ${reason} for SOCKET ${str}`
      );
    });

    Sockets[str].emit("getStatus", { room: "681b058e5a68ec2a3ce1cef0" });

    // if (i == 1) {
    //   setInterval(() => {
    //     Sockets[str].emit("controlRoom", {
    //       room: "681b058e5a68ec2a3ce1cef0",
    //       powerStatus: true,
    //     });
    //   }, 1000 * 60 * 5);
    // }

    Sockets[str].onAny((eventName, ...args) => {
      console.log("socket event --> ", eventName, "rcvd");
      // logStream.write(
      //   `\n${new Date().toISOString()} - socket event --> ${eventName} rcvd for SOCKET - ${str}`
      // );
    });

    // await Socket.disconnect();
  }
  // Socket.on("getStatus", (msg) => {
  //   console.log("msg", "rcvd");
  // });
};

export default getLoadTestService1to1;
