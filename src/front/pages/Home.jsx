import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import procedures_categorized from "../assets/img/procedures_categorized.json";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Signup } from "../components/Signup.jsx";
import { Login } from "../components/Login.jsx";
import { ErrandTypes } from '../components/ErrandTypes.jsx';

export const Home = () => {

	const { store, dispatch } = useGlobalReducer();
	const [selectedCategory, setSelectedCategory] = useState(null);
	 console.log(store);

	const uniqueCategories = [...new Set(procedures_categorized.map(item => item.category))];


	const handleSelect = (eventKey) => {
		setSelectedCategory(eventKey);
		console.log("Categoría seleccionada:", eventKey);
		// const procedure = procedures_categorized.find(p => p.category === eventKey);
		// if (procedure) {
		// // 	setSelectedProcedure(procedure);
		// // 	console.log("Procedimiento seleccionado:", procedure);
		// }
	};

	const limitLength = (text, maxLength) => {
		if (text.length > maxLength) {
			return text.substring(0, maxLength) + '...';
		}
		return text;
	};

	const maxTitleLength = 25;

	return (
		<div className="text-center mt-5">
			<div className="p-4">
				<ErrandTypes></ErrandTypes>
			</div>
		</div>
	);
};