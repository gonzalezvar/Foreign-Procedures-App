import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Signup } from "../components/Signup.jsx";
import { Login } from "../components/Login.jsx";
import { ErrandTypes } from "../components/ErrandTypes.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()


	return (
		<div className="text-center mt-5">
			<ErrandTypes></ErrandTypes>
		</div>
	);
}; 