import { useEffect,useReducer } from "react";

type AvatarState = {
  original: string | null;
  preview: string | null;
  value: string | null;
};

type AvatarAction =
  | { type: "INIT"; payload: string | null }
  | { type: "SELECT"; payload: { preview: string; value: string } }
  | { type: "REMOVE_PREVIEW" }
  | { type: "RESET" };

function avatarReducer(state: AvatarState, action: AvatarAction): AvatarState {
  switch (action.type) {
    case "INIT":
      return {
        original: action.payload,
        preview: null,
        value: action.payload,
      };

    case "SELECT":
      return {
        ...state,
        preview: action.payload.preview,
        value: action.payload.value,
      };

    case "REMOVE_PREVIEW":
      return {
        ...state,
        preview: null,
        value: state.original,
      };

    case "RESET":
      return {
        original: null,
        preview: null,
        value: null,
      };

    default:
      return state;
  }
}

export function useAvatarReducer(initialAvatar?: string | null) {
  const [state, dispatch] = useReducer(avatarReducer, {
    original: initialAvatar ?? null,
    preview: null,
    value: initialAvatar ?? null,
  });

  useEffect(() => {
    if (initialAvatar !== undefined) {
      dispatch({ type: "INIT", payload: initialAvatar });
    }
  }, [initialAvatar]);

  return {
    avatar: state,

    initAvatar: (url: string | null) =>
      dispatch({ type: "INIT", payload: url }),

    selectAvatar: (preview: string, value: string) =>
      dispatch({ type: "SELECT", payload: { preview, value } }),
    removePreview: () => dispatch({ type: "REMOVE_PREVIEW" }),
    resetAvatar: () => dispatch({ type: "RESET" }),
  };
}
