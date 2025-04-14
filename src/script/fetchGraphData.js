import { request } from "graphql-request";

const fetchGraphData = async (endpoint, query, variables) => {
  try {
    const data = await request(endpoint, query, variables);
    return { data, loading: false, error: null };
  } catch (err) {
    return { data: null, loading: false, error: err };
  }
};

export default fetchGraphData;
