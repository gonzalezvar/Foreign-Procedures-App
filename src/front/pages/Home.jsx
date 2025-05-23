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
				<DropdownButton
					id="dropdown-basic-button"
					title={selectedCategory ? limitLength(selectedCategory, maxTitleLength) : "Seleccionar Trámite"}
					onSelect={handleSelect}
					className="w-100"
					variant="info"
				>
					{uniqueCategories.length > 0 ? (
						uniqueCategories.map((item) => (
							<Dropdown.Item
								key={item.id}
								eventKey={item}
								active={selectedCategory?.category === item.category}
								className="py-1"
								style={{ transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out', backgroundColor: 'black' }}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'scale(1.02)';
									e.currentTarget.style.backgroundColor = 'grey';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'scale(1)';
									e.currentTarget.style.backgroundColor = 'black';
								}}
							>
								<div className="d-flex flex-column">
									<h6 className="mb-0 fw-normal" style={{ fontSize: '0.9rem' }}>
										{limitLength(item, maxTitleLength)}
									</h6>
								</div>
							</Dropdown.Item>
						))
					) : (
						<Dropdown.Item disabled>No hay trámites disponibles</Dropdown.Item>
					)}
				</DropdownButton>
				<ErrandTypes></ErrandTypes>
			</div>
		</div>
	);
};