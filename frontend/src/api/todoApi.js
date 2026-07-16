import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5100/api";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" }
});

// Every function throws if the request fails; the caller (App.jsx) is
// responsible for catching and surfacing the error.message to the user.
function extractErrorMessage(error) {
  return error.response?.data?.message || error.message || "Something went wrong.";
}

export const todoApi = {
  async getAll({ search, category, priority } = {}) {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (priority) params.priority = priority;

      const { data } = await client.get("/todos", { params });
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  async create(todo) {
    try {
      const { data } = await client.post("/todos", todo);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  async update(id, todo) {
    try {
      const { data } = await client.put(`/todos/${id}`, todo);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  async remove(id) {
    try {
      await client.delete(`/todos/${id}`);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  }
};
