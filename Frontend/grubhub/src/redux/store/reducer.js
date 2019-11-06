import { pathToFileURL } from "url";

const initialStore = {
  registered: false,
  buyerlogin: false,
  ownerlogin: false,
  ownerregistered: false,
  save: false,
  buyer_id: 0,
  buyer_name: "",
  buyer_address: "",
  restaurant_name: "",
  restaurant_id: 0,
  buyer_search: false,
  searchedItem: "",
  deletesection: false,
  messagetobuyer: false,
  messagetoowner: false,
  statuschanged: false
};
const reducer = (state = initialStore, action) => {
  if (action.type === "BUYER_SIGNUP") {
    return {
      ...state,
      registered: true
    };
  }

  if (action.type === "BUYER_SIGNIN" && action.status == 200) {
    return {
      ...state,
      buyerlogin: true,
      buyer_id: action.payload._id,
      buyer_name: action.payload.name,
      buyer_address: action.payload.address,
      buyer_phone: action.payload.phone,
      buyer_email: action.payload.email
    };
  }
  if (action.type === "BUYER_SIGNIN" && action.status != 200) {
    return {
      ...state,
      buyerlogin: false
    };
  }
  if (action.type === "OWNER_SIGNUP") {
    return {
      ...state,
      ownerregistered: true
    };
  }

  if (action.type === "BUYER_LOGOUT") {
    return {
      ...state,
      buyerlogin: false
    };
  }
  if (action.type === "OWNER_SIGNIN" && action.status == 200) {
    return {
      ...state,
      ownerlogin: true,
      restaurant_id: action.payload._id,
      restaurant_name: action.payload.restaurant_name
    };
  }

  if (action.type === "OWNER_SIGNIN" && action.status != 200) {
    return {
      ...state,
      ownerlogin: false
    };
  }
  if (action.type === "OWNER_LOGOUT") {
    return {
      ...state,
      ownerlogin: false
    };
  }

  if (action.type === "SAVE") {
    return {
      ...state,
      save: true
    };
  }

  if (action.type === "BUYER_SEARCH") {
    return {
      ...state,
      buyer_search: true,
      searchedItem: action.payload.searchedItem
    };
  }

  if (action.type === "DELETE_SECTION") {
    return {
      ...state,
      deletesection: true
    };
  }

  if (action.type === "MESSAGE_TO_BUYER") {
    return {
      ...state,
      messagetobuyer: true
    };
  }
  if (action.type === "MESSAGE_TO_OWNER") {
    return {
      ...state,
      messagetoowner: true
    };
  }
  if (action.type === "CHANGE_STATUS") {
    return {
      ...state,
      statuschanged: true
    };
  }

  return state;
};

export default reducer;
