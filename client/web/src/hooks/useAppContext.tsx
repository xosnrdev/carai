import { useDispatch } from "react-redux";
import { type TogglePayload, onIsOpen } from "../redux/app_slice";
import { type AppDispatch, type RootState, useGlobalSelector } from "../redux/store";

const useAppContext = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isOpen = useGlobalSelector((state: RootState) => state.app.isOpen);
    const setIsOpen = (payload: TogglePayload) => dispatch(onIsOpen(payload));

    return { isOpen, setIsOpen };
};

export default useAppContext;
