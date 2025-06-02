import 'bootstrap/dist/css/bootstrap.min.css';
import { ErrandTypes } from '../components/ErrandTypes.jsx';


export const Home = () => {
	return (
		<div className="text-center mt-5">
			<div className="p-4">
				<ErrandTypes></ErrandTypes>
			</div>
		</div>
	);
};

