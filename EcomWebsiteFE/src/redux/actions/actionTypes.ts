export enum ActionType {
  // primary action types
  SHOW_SIDEBAR_CATEGORIES = "SHOW_SIDEBAR_CATEGORIES",
  SHOW_SIDEBAR_MENU = "SHOW_SIDEBAR_MENU",
  GET_TITLE = "GET_TITLE",
  IS_LOADING = "IS_LOADING",
  SHOW_SEARCH_AREA = "SHOW_SEARCH_AREA",
  SHOW_OR_HIDE_DROPDOWNCART = "SHOW_OR_HIDE_DROPDOWNCART",
  SHOW_SIDEBAR_FILTER = "SHOW_SIDEBAR_FILTER",

  // cart action types
  ADD_TO_CART = "ADD_TO_CART",
  DELETE_FROM_CART = "DELETE_FROM_CART",
  INCREASE_PRODUCT_COUNT = "INCREASE_PRODUCT_COUNT",
  DECREASE_PRODUCT_COUNT = "DECREASE_PRODUCT_COUNT",
  MAKE_ISINCART_TRUE = "MAKE_ISINCART_TRUE",
  CLEAR_CART = "CLEAR_CART",

  // product action types
  SORT_BY_LATEST_AND_PRICE = "SORT_PRODUCTS_BY_LATEST_AND_PRICE",
  SORT_BY_CATEGORY = "SORT_BY_CATEGORY",
  SORT_BY_BRAND = "SORT_BY_BRAND",
  SEARCH_PRODUCT = "SEARCH_PRODUCT",
  MAKE_ISINCART_FALSE = "MAKE_ISINCART_FALSE",
  MAKE_IS_IN_WISHLIST_FALSE = "MAKE_IS_IN_WISHLIST_FALSE",
  MAKE_IS_IN_COMPARE_FALSE = "MAKE_IS_IN_COMPARE_FALSE",

  // wishlist action types
  ADD_TO_WISHLIST = "ADD_TO_WISHLIST",
  MAKE_IS_IN_WISHLIST_TRUE_IN_WISHLIST = "MAKE_IS_IN_WISHLIST_TRUE_IN_WISHLIST",
  MAKE_WISHLIST_PRODUCT_ISINCART_FALSE = "MAKE_WISHLIST_PRODUCT_ISINCART_FALSE",
  REMOVE_FROM_WISHLIST = "REMOVE_FROM_WISHLIST",

  // compare action types
  ADD_TO_COMPARE = "ADD_TO_COMPARE",
  REMOVE_FROM_COMPARE = "REMOVE_FROM_COMPARE",
  MAKE_IS_IN_COMPARE_TRUE_IN_COMPARE = "MAKE_IS_IN_COMPARE_TRUE_IN_COMPARE",
  MAKE_COMPARE_PRODUCT_ISINCART_FALSE = "MAKE_COMPARE_PRODUCT_ISINCART_FALSE",

  // user action types
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
  UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE",
}

// interfaces for primary actions
interface ShowSidebarCategoriesAction {
  type: ActionType.SHOW_SIDEBAR_CATEGORIES;
  payload: boolean;
}

interface ShowSidebarMenuAction {
  type: ActionType.SHOW_SIDEBAR_MENU;
  payload: boolean;
}

interface GetTitleAction {
  type: ActionType.GET_TITLE;
  payload: string;
}

interface IsLoadingAction {
  type: ActionType.IS_LOADING;
  payload: boolean;
}

interface ShowSearchAreaAction {
  type: ActionType.SHOW_SEARCH_AREA;
  payload: boolean;
}

interface ShowOrHideDropdownCartAction {
  type: ActionType.SHOW_OR_HIDE_DROPDOWNCART;
}

interface ShowSidebarFilterAction {
  type: ActionType.SHOW_SIDEBAR_FILTER;
  payload: boolean;
}

// interfaces for cart actions
interface AddToCartAction {
  type: ActionType.ADD_TO_CART;
  payload: any;
}

interface DeleteFromCartAction {
  type: ActionType.DELETE_FROM_CART;
  payload: number;
}

interface ClearCartAction {
  type: ActionType.CLEAR_CART;
}

interface IncreaseAction {
  type: ActionType.INCREASE_PRODUCT_COUNT;
  payload: number;
}

interface DecreaseAction {
  type: ActionType.DECREASE_PRODUCT_COUNT;
  payload: number;
}

interface MakeIsInCartTrueAction {
  type: ActionType.MAKE_ISINCART_TRUE;
  payload: number;
}

// interfaces for product actions
interface SortByLatestAndPrice {
  type: ActionType.SORT_BY_LATEST_AND_PRICE;
  payload: string;
}

interface SortByCategoryAction {
  type: ActionType.SORT_BY_CATEGORY;
  payload: string;
}

interface SortByBrandAction {
  type: ActionType.SORT_BY_BRAND;
  payload: string;
}

interface SearchAction {
  type: ActionType.SEARCH_PRODUCT;
  payload: string;
}

interface MakeIsInCartFalseAction {
  type: ActionType.MAKE_ISINCART_FALSE;
  payload: number;
}

interface MakeIsInWishlistFalseAction {
  type: ActionType.MAKE_IS_IN_WISHLIST_FALSE;
  payload: number;
}

interface MakeIsInCompareFalseAction {
  type: ActionType.MAKE_IS_IN_COMPARE_FALSE;
  payload: number;
}

// interfaces for wishlist actions
interface AddToWishlistAction {
  type: ActionType.ADD_TO_WISHLIST;
  payload: any;
}

interface RemoveFromWishlistAction {
  type: ActionType.REMOVE_FROM_WISHLIST;
  payload: number;
}

interface MakeWishlistProductTrueInWishlistAction {
  type: ActionType.MAKE_IS_IN_WISHLIST_TRUE_IN_WISHLIST;
  payload: number;
}

interface MakeWishlistProductIsInCartFalseAction {
  type: ActionType.MAKE_WISHLIST_PRODUCT_ISINCART_FALSE;
  payload: number;
}

// interfaces for compare actions
interface AddToCompareAction {
  type: ActionType.ADD_TO_COMPARE;
  payload: any;
}

interface RemoveFromCompareAction {
  type: ActionType.REMOVE_FROM_COMPARE;
  payload: number;
}

interface MakeCompareProductTrueInCompareAction {
  type: ActionType.MAKE_IS_IN_COMPARE_TRUE_IN_COMPARE;
  payload: number;
}

interface MakeCompareProductIsInCartFalseAction {
  type: ActionType.MAKE_COMPARE_PRODUCT_ISINCART_FALSE;
  payload: number;
}

// interface for user login success
interface LoginSuccessAction {
  type: ActionType.LOGIN_SUCCESS;
  payload: any; // payload will store user information
}

// interface for user login failure
interface LoginFailureAction {
  type: ActionType.LOGIN_FAILURE;
  payload: string; // payload will store error message
}

// interface for user logout
interface LogoutAction {
  type: ActionType.LOGOUT;
}

// interface for updating user profile
interface UpdateUserProfileAction {
  type: ActionType.UPDATE_USER_PROFILE;
  payload: any; // payload will store updated user information
}

export type PrimaryAction =
  | ShowSidebarCategoriesAction
  | ShowSidebarMenuAction
  | GetTitleAction
  | IsLoadingAction
  | ShowSearchAreaAction
  | ShowOrHideDropdownCartAction
  | ShowSidebarFilterAction;

export type CartAction =
  | AddToCartAction
  | DeleteFromCartAction
  | IncreaseAction
  | DecreaseAction
  | MakeIsInCartTrueAction
  | ClearCartAction;

export type ProductAction =
  | SortByLatestAndPrice
  | SortByCategoryAction
  | SearchAction
  | MakeIsInCartFalseAction
  | MakeIsInWishlistFalseAction
  | MakeIsInCompareFalseAction
  | SortByBrandAction;

export type WishlistAction =
  | AddToWishlistAction
  | RemoveFromWishlistAction
  | MakeWishlistProductTrueInWishlistAction
  | MakeWishlistProductIsInCartFalseAction;

export type CompareAction =
  | AddToCompareAction
  | RemoveFromCompareAction
  | MakeCompareProductTrueInCompareAction
  | MakeCompareProductIsInCartFalseAction;
export type UserAction =
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction
  | UpdateUserProfileAction;
