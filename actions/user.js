import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleResponse } from "./auth";

export const userPublicProfile = (username) => {
  //   console.log("blog: ", blog); // Check if the blog object is being passed correctly
  return fetch(`${API}/user/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      //   console.log("response: ", response); // Check if the response object is being returned correctly
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getProfile = (token) => {
  return fetch(`${API}/user/profile`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      //   console.log("response: ", response); // Check if the response object is being returned correctly
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const update = (token, user) => {
  return fetch(`${API}/user/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: user,
  })
    .then((response) => {
      handleResponse(response);
      //   console.log("response: ", response); // Check if the response object is being returned correctly
      return response.json();
    })
    .catch((err) => console.log(err));
};
