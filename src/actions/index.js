import _ from "lodash";
import jsonPlaceholder from "../apis/jsonPlaceholder";

// 6 Alternative to memoized function - call action creators from action creator (remember we need to manually dispatch)
// Idea is to 1 get all posts, 2 from that the unique list of users, 3 get user details.  Also update posts and users reducers.
// Now in our UserHeader we associate users who made posts to user details
export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  // Updates postsReducer
  await dispatch(fetchPosts()); // now manually dispatch the function returned by calling the action creator fetchPosts which is then sent to thunk and run.  Starts process of dispatch.

  // At this point we should have updated redux state available
  // console.log(getState().posts);

  const userIds = _.uniq(_.map(getState().posts, "userId")); // return array of unique userId's
  // console.log(userIds);

  // Updates usersReducer with unique user ids
  userIds.forEach((id) => dispatch(fetchUser(id))); // .forEach does not allow for async/await if needed
};

// Array of posts
export const fetchPosts = () => {
  return async (dispatch, getState) => {
    const response = await jsonPlaceholder.get("/posts"); // returns [{},{}..]

    dispatch({ type: "FETCH_POSTS", payload: response.data });
  };
};

// 5 Single user detail - Alternative to memoized function
export const fetchUser = (id) => async (dispatch) => {
  const response = await jsonPlaceholder.get(`/users/${id}`); //  returns {}

  dispatch({ type: "FETCH_USER", payload: response.data });
};

/*
  // 3 Single user detail - ORIGINAL - overfetching
  export const fetchUser = (id) => async (dispatch) => {
    const response = await jsonPlaceholder.get(`/users/${id}`); //  returns {}

    dispatch({ type: "FETCH_USER", payload: response.data });
  };    
*/

/*
  // 4 Single user detail - MEMOIZED USING LODASH - idea is to return a function that runs a memoized function (memoized outside of the action creator)
  export const fetchUser = (id) => (dispatch) => {
    _fetchUser(id, dispatch);
  };

  const _fetchUser = _.memoize(async (id, dispatch) => {
    const response = await jsonPlaceholder.get(`/users/${id}`); // returns {}

    dispatch({ type: "FETCH_USER", payload: response.data });
  });
*/

/* 
  // 2 Memoize will not work as we are return a memoized version every single time.
  export const fetchUser = function (id) {
    return _.memoize(async function (dispatch) {
      const response = await jsonPlaceholder.get(`/users/${id}`);

      dispatch({ type: "FETCH_USER", payload: response.data });
    });
  };

  // 1 Return action is also fine
  export const selectPost = () => {
    return {
      type: "SELECT_POSTS",
    };
  };
*/
