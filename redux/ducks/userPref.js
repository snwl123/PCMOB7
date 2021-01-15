const DARK_MODE = "dark"


export function toggleDarkMode()
{
    return { type: DARK_MODE };
};

const initialState = 
{
    darkMode: false
};

export default function blogAuthReducer(state = initialState, action)
{
    switch (action.type)
    {
        case DARK_MODE:
            return {...state, darkMode: !state.darkMode};
        default:
            return state;
    }
}