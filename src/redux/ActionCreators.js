import * as ActionTypes from './ActionTypes';

/* Action creator function
args: 1 idea object
returns action object.  fields: type and payload (which holds the 1 idea) */
export const addIdea = idea => (
  {
    type: ActionTypes.ADD_IDEA,
    payload: idea
  }
);

/* Action creator function
args: An array of sorted ideas
returns action object.  fields: type and payload (which holds sorted ideas array) */
export const addSortedIdeas = ideas => {
  return(
    { type: ActionTypes.ADD_SORTED_IDEAS,
      payload: ideas.sort((a,b) => a.likedRank > b.likedRank ? -1 : 1)
    }
  );
};

// Action creator function
// returns an empty action (no payload) with type IDEAS_LOADING
export const ideasLoading = () => (
  { type: ActionTypes.IDEAS_LOADING }
);

/* Action creator function
args: An error message
returns action object.  fields: type and payload (which holds the error message) */
export const ideasFailed = errorMessage => (
  { type: ActionTypes.IDEAS_FAILED,
    payload: errorMessage
  }
);

/* Thunk action creator function (curried) which fetches Ideas from the server
returns: a function that takes dispatch and (optionally)
getState which returns an action object (created by either 
addIdeas or ideasFailed). */
export const fetchIdeas = () => dispatch => {
  
  dispatch(ideasLoading());

  return fetch('/ideas')
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        let error = new Error('Error ' + response.status
                    + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
      let errorMessage = new Error(error.message);
      throw errorMessage;
    })
    .then(response => response.json())
    .then(ideas => dispatch(addSortedIdeas(ideas)))
    .catch(error => dispatch(ideasFailed(error.message)));
};

/* Thunk action creator function (curried) which posts 1 idea to the server
args: 1 idea
returns: a function that takes dispatch and (optionally)
getState which returns an action object created by 
addIdea or it calls alert() */
export const postIdea = ideaText => dispatch => {
  const newIdea = { text: ideaText };
  const bearer = 'bearer ' + localStorage.getItem('token');

  return fetch('/ideas', {
    method: 'POST',
    body: JSON.stringify(newIdea),  // post the 1 idea to the server
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer
    },
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        let error = new Error('Error ' + response.status
                    + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
      let errorMessage = new Error(error.message);
      throw errorMessage;
    })
    .then(response => response.json())
    .then(idea => dispatch(addIdea(idea)))
    .catch(error => alert('Error: ' + error.message));
};

export const fetchLikedIdeas = () => dispatch => {
  dispatch(ideasLoading());

  const bearer = 'bearer ' + localStorage.getItem('token');

  return fetch('/users/likedIdeas', {
    headers: {
        'Authorization': bearer
    },
  })
  .then(response => {
      if (response.ok) {
          return response;
      }
      else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
      }
  },
  error => {
      var errmess = new Error(error.message);
      throw errmess;
  })
  .then(response => response.json())
  .then(ideas => dispatch(likeIdeas(ideas)))
  .catch(error => dispatch(ideasFailed(error.message)));
}

export const fetchFlaggedIdeas = () => dispatch => {
  dispatch(ideasLoading());

  const bearer = 'bearer ' + localStorage.getItem('token');

  return fetch('/users/flaggedIdeas', {
    headers: {
        'Authorization': bearer
    },
  })
  .then(response => {
      if (response.ok) {
          return response;
      }
      else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
      }
  },
  error => {
      var errmess = new Error(error.message);
      throw errmess;
  })
  .then(response => response.json())
  .then(ideas => dispatch(flagIdeas(ideas)))
  .catch(error => dispatch(ideasFailed(error.message)));
}

/* Thunk action creator function (curried) which implemeents a
POST request to like an array of ideas
args: an array of ideas to like
thunk: POST request
returns: a function that takes dispatch and (optionally)
getState which returns an action object created by updateIdea */
export const postLikedIdeas = ideas => dispatch => {
  const ideasToLike = ideas.map(idea => {
    return({"_id": idea._id});
  });
  const bearer = 'bearer ' + localStorage.getItem('token');

  return fetch(`/users/likedIdeas`, {
    method: 'POST',
    body: JSON.stringify(ideasToLike),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer
    },
    credentials: 'same-origin'
  })
  .then(response => {
    if (response.ok) {
      return response;
    }
    else {
      let error = new Error('Error ' + response.status
                  + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
  },
  error => {
    let errorMessage = new Error(error.message);
    throw errorMessage;
  })
  .then(response => response.json())
  .then(ideas => dispatch(likeIdeas(ideas)))
  .catch(error => alert('Error: ' + error.message));
};

/* Thunk action creator function (curried) which implemeents a
POST request to flag an array of ideas
args: an array of ideas to flag
thunk: POST request
returns: a function that takes dispatch and (optionally)
getState which returns an action object created by updateIdea */
export const postFlaggedIdeas = ideas => dispatch => {
  const ideasToFlag = ideas.map(idea => {
    return({"_id": idea._id});
  });
  const bearer = 'bearer ' + localStorage.getItem('token');

  return fetch(`/users/flaggedIdeas`, {
    method: 'POST',
    body: JSON.stringify(ideasToFlag),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer
    },
    credentials: 'same-origin'
  })
  .then(response => {
    if (response.ok) {
      return response;
    }
    else {
      let error = new Error('Error ' + response.status
                  + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
  },
  error => {
    let errorMessage = new Error(error.message);
    throw errorMessage;
  })
  .then(response => response.json())
  .then(ideas => dispatch(flagIdeas(ideas)))
  .catch(error => alert('Error: ' + error.message));
};

/* Action creator function
args: 1 array of ideas
returns action object.  fields: type and payload (which update ideas) */
const likeIdeas = ideas => getState => {
  const newLikedIdeas = getState().ideas.ideas;
  for (let i=0; i < newLikedIdeas.length; i++) {
    if (ideas.indexOf(newLikedIdeas[i]._id) !== -1) {
      newLikedIdeas[i].liked = true;
    }
  }
  return (
    {
      type: ActionTypes.LIKE_IDEAS,
      payload: newLikedIdeas
    }
  );      
};

/* Action creator function
args: 1 array of ideas
returns action object.  fields: type and payload (which update ideas) */
const flagIdeas = ideas => getState => {
  const newFlaggedIdeas = getState().ideas.ideas;
  for (let i=0; i < newFlaggedIdeas.length; i++) {
    if (ideas.indexOf(newFlaggedIdeas[i]._id) !== -1) {
      newFlaggedIdeas[i].flagged = true;
    }
  }
  return (
    {
      type: ActionTypes.FLAG_IDEAS,
      payload: newFlaggedIdeas
    }
  );      
};

// *** USER LOGIN ACTION CREATORS *** //

export const requestLogin = (creds) => {
  return {
      type: ActionTypes.LOGIN_REQUEST,
      creds
  }
}

export const receiveLogin = (response) => {
  return {
      type: ActionTypes.LOGIN_SUCCESS,
      token: response.token
  }
}

export const loginError = (message) => {
  return {
      type: ActionTypes.LOGIN_FAILURE,
      message
  }
}

// TODO: Update LoginUser to fetch likedIdeas and flaggedIdeas
export const loginUser = (creds) => (dispatch) => {
  // We dispatch requestLogin to kickoff the call to the API
  dispatch(requestLogin(creds))

  return fetch('/users/login', {
      method: 'POST',
      headers: { 
          'Content-Type':'application/json' 
      },
      body: JSON.stringify(creds)
  })
  .then(response => {
      if (response.ok) {
          return response;
      } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
      }
      },
      error => {
          throw error;
      })
  .then(response => response.json())
  .then(response => {
      if (response.success) {
          // If login was successful, set the token in local storage
          localStorage.setItem('token', response.token);
          localStorage.setItem('creds', JSON.stringify(creds));
          // Dispatch the success action
          dispatch(fetchIdeas());
          dispatch(fetchLikedIdeas());
          dispatch(fetchFlaggedIdeas());
          dispatch(receiveLogin(response));
      }
      else {
          var error = new Error('Error ' + response.status);
          error.response = response;
          throw error;
      }
  })
  .catch(error => dispatch(loginError(error.message)))
};

export const requestLogout = () => {
  return {
    type: ActionTypes.LOGOUT_REQUEST
  }
}

export const receiveLogout = () => {
  return {
    type: ActionTypes.LOGOUT_SUCCESS
  }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
  dispatch(requestLogout())
  localStorage.removeItem('token');
  localStorage.removeItem('creds');
  dispatch(fetchIdeas());
  dispatch(receiveLogout());
}
