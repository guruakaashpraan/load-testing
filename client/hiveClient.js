import axios from "axios";
let userDetails = {
  username: "",
  password: "",
  email: "",
  timeZone: "",
};

const initializeClient = () => {
  const username = `user${Math.floor(1000000 + Math.random() * 9000000)}`;
  const password = "loadtest@1";
  userDetails.username = username;
  userDetails.password = password;
  userDetails.email = `${username}@praan.io`;
  userDetails.timeZone = `America/New_York`;

  const connectionClient = axios.create({
    baseURL: process.env.SERVER_URL,
  });

  return connectionClient;
};

export const createNewUser = async () => {
  try {
    const connectionClient = initializeClient();
    const createUserApiResponse = await connectionClient.post(
      `/api/v1/auth/signup`,
      {
        email: userDetails.email,
        name: userDetails.username,
        password: userDetails.password,
        timeZone: userDetails.timeZone,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(
    //   "new user",
    //   createUserApiResponse.status,
    //   createUserApiResponse.data
    // );

    return createUserApiResponse.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const createNewRoom = async (
  token,
  area,
  height,
  roomCategory,
  name,
  roomType
) => {
  try {
    const connectionClient = initializeClient();
    const createNewRoomApiResponse = await connectionClient.post(
      `/api/v1/room`,
      {
        area: area,
        height: height,
        name: name,
        roomCategory: roomCategory,
        roomType: roomType,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log(
    //   "new user",
    //   createNewRoomApiResponse.status,
    //   createNewRoomApiResponse.data
    // );

    return createNewRoomApiResponse.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const createNewInternalDevice = async (
  token,
  deviceId,
  networkType,
  clientType,
  deviceType,
  serialNumber
) => {
  try {
    const connectionClient = initializeClient();

    const createNewInternalDeviceApiResponse = await connectionClient.post(
      `/api/v1/device/internalDevice`,
      {
        deviceID: deviceId,
        networkType: networkType,
        clientType: clientType,
        deviceType: deviceType,
        sensors: ["pm", "temperature", "voc", "sound", "co2", "humidity"],
        serialNumber: serialNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log(
    //   "new internal device",
    //   createNewInternalDeviceApiResponse.status,
    //   createNewInternalDeviceApiResponse.data
    // );

    return createNewInternalDeviceApiResponse.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const createNewDevice = async (
  token,
  roomId,
  name,
  description,
  deviceId
) => {
  try {
    const connectionClient = initializeClient();
    const createNewDeviceApiResponse = await connectionClient.post(
      `/api/v1/device/${roomId}`,
      {
        name: name,
        description: description,
        deviceId: deviceId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log(
    //   "new device",
    //   createNewDeviceApiResponse.status,
    //   createNewDeviceApiResponse.data
    // );

    return createNewDeviceApiResponse.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const adminLogin = async () => {
  try {
    const connectionClient = initializeClient();
    const apiResponse = await connectionClient.post(
      `/api/v1/auth/login`,
      {
        email: "prajwal@praan.io",
        password: "Praan2023@",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("response data", apiResponse.data.data.token);
    return apiResponse.data.data.token;
  } catch (error) {
    console.log("unable to get API token");
  }
};

export default initializeClient;
