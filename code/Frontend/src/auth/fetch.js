import Cookies from "universal-cookie";
import {
  getTokenPopup,
  getTokenRedirect,
} from "./authConfig";
import { protectedResources } from "./authConfig";

const cookies = new Cookies();

export async function callApi(method, endpoint, token, data = null) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  if (data) {
    headers.append("Content-Type", "application/json");
  }

  const options = {
    method: method,
    headers: headers,
    body: data ? JSON.stringify(data) : null,
  };

  const response = await fetch(endpoint, options);
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response;
  }
}

export async function handleToDoListActions(task, method, endpoint) {
  let listData;

  try {
    const accessToken = await getToken();
    const data = await callApi(method, endpoint, accessToken, task);

    switch (method) {
      case "POST":
        listData = JSON.parse(localStorage.getItem("todolist"));
        listData = [data, ...listData];
        localStorage.setItem("todolist", JSON.stringify(listData));
        AddTaskToToDoList(data);
        break;
      case "DELETE":
        listData = JSON.parse(localStorage.getItem("todolist"));
        const index = listData.findIndex((todoItem) => todoItem.id === task.id);
        localStorage.setItem(
          "todolist",
          JSON.stringify([...listData.splice(index, 1)])
        );
        showToDoListItems(listData);
        break;
      default:
        console.log("Unrecognized method.");
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getToDos() {
  try {
    const accessToken = await getToken();

    const data = await callApi(
      "GET",
      protectedResources.todolistApi.endpoint,
      accessToken
    );

    if (data) {
      localStorage.setItem("todolist", JSON.stringify(data));
      showToDoListItems(data);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getToken() {
  let tokenResponse;

  if (typeof getTokenPopup === "function") {
    tokenResponse = await getTokenPopup({
      scopes: [...protectedResources.todolistApi.scopes.read],
      redirectUri: "/redirect",
    });
  } else {
    tokenResponse = await getTokenRedirect({
      scopes: [...protectedResources.todolistApi.scopes.read],
    });
  }

  if (!tokenResponse) {
    return null;
  }

  const accessToken = tokenResponse.accessToken;

  cookies.set("access_token", accessToken, { path: "/" });

  localStorage.setItem("access_token", accessToken);

  return accessToken;
}
