import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL;
const OPEN_API_URL = process.env.NEXT_PUBLIC_DEV_OPEN_URL;
// console.log("API_URL:", API_URL);

export const adminLogin = async (email, password) => {
  try {
    const response = await axios.post(API_URL + "login", {
      email,
      password,
    });

    if (
      response.data.status === 200 &&
      response.data.updatedUser.roles === "Admin"
    ) {
      localStorage.setItem("user", JSON.stringify(response.data.updatedUser));
      localStorage.setItem("token", response.data.token);
      return response.data;
    } else if (
      response.data.status === 200 &&
      response.data.updatedUser.roles !== "Admin"
    ) {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Login error", error);
    throw error;
  }
};

export const registerIndividual = async (values) => {
  console.log("values", values);
  try {
    const response = await axios.post(`${API_URL}register`, values);
    console.log("Response", response);

    if (response.data.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Register error", error);
    throw error;
  }
};

export const registerClassroom = async (values) => {
  console.log("values", values);
  try {
    const response = await axios.post(`${API_URL}bulk-register`, values);
    console.log("Response", response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Register error", error);
    throw error;
  }
};

export const allUsersInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/all-users/`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Register error", error);
    throw error;
  }
};

export const deleteUsersInfo = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-user/${userId}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Register error", error);
    throw error;
  }
};

export const getAllSchoolsInfo = async () => {
  try {
    const response = await axios.get(
      "http://localhost:11007" + "/get-all-schools"
    );
    // console.log("getAllSchoolsInfo", response);
    if (response.data.status === 200) {
      // console.log("getAllSchoolsInfo222222", response);
      return response.data;
    } else if (response.data.status === 404) {
      return response.data;
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Login error", error);
    throw error;
  }
};

export const allUsersPosts = async () => {
  try {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    // console.log("token", token);

    if (!token) {
      throw new Error("Token not found"); // Handle the case where the token is not available
    }

    const response = await axios.get(`${API_URL}get-all-posts`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });
    console.log("Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const allPostsLikes = async () => {
  try {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    // console.log("token", token);

    if (!token) {
      throw new Error("Token not found"); // Handle the case where the token is not available
    }

    const response = await axios.get(`${API_URL}get-all-likes`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });
    console.log(" Like Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const allPostsComments = async () => {
  try {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    // console.log("token", token);
    if (!token) {
      throw new Error("Token not found"); // Handle the case where the token is not available
    }
    const response = await axios.get(`${API_URL}get-all-comments`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });
    console.log("Comments Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const createMentor = async (values) => {
  try {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    // console.log("token", token);
    if (!token) {
      throw new Error("Token not found"); // Handle the case where the token is not available
    }
    const response = await axios.post(`${API_URL}create-mentor`, values, {
      // headers: {
      //   Authorization: `Bearer ${token}`, // Include the token in the headers
      // },
    });
    console.log("Mentor Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const getAllMentors = async () => {
  try {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    // console.log("token", token);

    if (!token) {
      throw new Error("Token not found"); // Handle the case where the token is not available
    }

    const response = await axios.get(`${API_URL}/get-all-mentors`, {
      // headers: {
      //   Authorization: `Bearer ${token}`, // Include the token in the headers
      // },
    });
    // console.log(" Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const getAllMentorbyId = async (candidateId) => {
  try {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    // console.log("token", token);

    // if (!token) {
    //   throw new Error("Token not found"); // Handle the case where the token is not available
    // }

    const response = await axios.get(`${API_URL}/get-mentor/${candidateId}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`, // Include the token in the headers
      // },
    });
    console.log(" Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const updateMentor = async (values, candidateId) => {
  try {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    // console.log("token", token);
    if (!token) {
      throw new Error("Token not found"); // Handle the case where the token is not available
    }
    const response = await axios.put(
      `${API_URL}update-mentor/${candidateId}`,
      values
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`, // Include the token in the headers
      //   },
      // }
    );
    console.log("Mentor Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const deleteMentorbyId = async (candidateId) => {
  try {
    console.log("candidate id", candidateId);
    const token = localStorage.getItem("token"); // Get the token from localStorage
    // console.log("token", token);

    if (!token) {
      throw new Error("Token not found"); // Handle the case where the token is not available
    }

    const response = await axios.delete(
      `${API_URL}/delete-mentor/${candidateId}`
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`, // Include the token in the headers
      //   },
      // }
    );
    console.log(" Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
export const addFaq = async (data) => {
  try {
    const response = await axios.post(`${OPEN_API_URL}/add-faq`, data);
    console.log(" Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
export const getFaq = async (id) => {
  try {
    const response = await axios.get(`${OPEN_API_URL}/get-faq/${id}`);
    console.log(" Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
export const getAllFaq = async () => {
  try {
    const response = await axios.get(`${OPEN_API_URL}/get-all-faqs`);
    console.log(" Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
export const updateFaq = async (data, id) => {
  try {
    const response = await axios.put(`${OPEN_API_URL}/edit-faq/${id}`, data);
    console.log(" Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
export const deleteFaq = async (id) => {
  try {
    const response = await axios.delete(`${OPEN_API_URL}/delete-faq/${id}`);
    console.log(" Response", response);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const addPage = async (values) => {
  try {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
      throw new Error("Token not found");
    }

    if (!userString) {
      throw new Error("User data not found");
    }

    // Parse the user string to an object
    const user = JSON.parse(userString);

    // Check if the candidateId exists in the user object
    if (!user.candidateId) {
      throw new Error("Candidate ID not found in user data");
    }

    const response = await axios.post(
      `${API_URL}add-page/${user.candidateId}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Mentor Response", response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const getPage = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
      throw new Error("Token not found");
    }

    if (!userString) {
      throw new Error("User data not found");
    }

    // Parse the user string to an object
    const user = JSON.parse(userString);

    // Check if the candidateId exists in the user object
    if (!user.candidateId) {
      throw new Error("Candidate ID not found in user data");
    }

    const response = await axios.post(
      `${API_URL}get-page/${user.candidateId}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("Mentor Response", response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const getAllPage = async () => {
  try {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
      throw new Error("Token not found");
    }

    if (!userString) {
      throw new Error("User data not found");
    }

    // Parse the user string to an object
    const user = JSON.parse(userString);

    // Check if the candidateId exists in the user object
    if (!user.candidateId) {
      throw new Error("Candidate ID not found in user data");
    }

    const response = await axios.get(
      `${API_URL}get-all-pages/${user.candidateId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("pages Response", response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const updatePage = async (values, id) => {
  try {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
      throw new Error("Token not found");
    }

    if (!userString) {
      throw new Error("User data not found");
    }

    // Parse the user string to an object
    const user = JSON.parse(userString);

    // Check if the candidateId exists in the user object
    if (!user.candidateId) {
      throw new Error("Candidate ID not found in user data");
    }

    const response = await axios.put(
      `${API_URL}edit-page/${user.candidateId}/${id}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("Mentor Response", response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
export const deletePage = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
      throw new Error("Token not found");
    }

    if (!userString) {
      throw new Error("User data not found");
    }

    // Parse the user string to an object
    const user = JSON.parse(userString);

    // Check if the candidateId exists in the user object
    if (!user.candidateId) {
      throw new Error("Candidate ID not found in user data");
    }

    const response = await axios.delete(
      `${API_URL}delete-page/${user.candidateId}/${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("Mentor Response", response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const getAllSubscriptions = async () => {
  try {
    console.log(" Response statrted");

    const response = await axios.get(`${OPEN_API_URL}/get-all-subscription`);

    console.log(" Response", response);

    if (response) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
export const deleteSubscriptions = async (id) => {
  try {
    const response = await axios.delete(
      `${OPEN_API_URL}/delete-subscription/${id}`
    );

    console.log(" Response", response);

    if (response) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
export const editSubscriptions = async (value, id) => {
  try {
    const response = await axios.delete(
      `${OPEN_API_URL}/delete-subscription/${id}`
    );

    console.log(" Response", response);

    if (response) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};

export const getAllMicrocredentials = async () => {
  try {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
      throw new Error("Token not found");
    }

    if (!userString) {
      throw new Error("User data not found");
    }

    // Parse the user string to an object
    const user = JSON.parse(userString);

    // Check if the candidateId exists in the user object
    if (!user.candidateId) {
      throw new Error("Candidate ID not found in user data");
    }

    const response = await axios.get(
      `${API_URL}get-all-microcredential/${user.candidateId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("micro Response", response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
export const deleteMicrocredentials = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
      throw new Error("Token not found");
    }

    if (!userString) {
      throw new Error("User data not found");
    }

    // Parse the user string to an object
    const user = JSON.parse(userString);

    // Check if the candidateId exists in the user object
    if (!user.candidateId) {
      throw new Error("Candidate ID not found in user data");
    }

    const response = await axios.delete(
      `${API_URL}delete-microcredential/${user.candidateId}/${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("micro Response", response);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Not Authorized");
    }
  } catch (error) {
    console.error("Fetch error", error);
    throw error;
  }
};
