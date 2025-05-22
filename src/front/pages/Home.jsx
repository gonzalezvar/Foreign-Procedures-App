import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import procedures_categorized from "../assets/img/procedures_categorized.json";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Signup } from "../components/Signup.jsx";
import { Login } from "../components/Login.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer();
	const [selectedProcedure, setSelectedProcedure] = useState(null);

	const handleSelect = (eventKey) => {
		const procedure = procedures_categorized.find(p => p.title === eventKey);
		if (procedure) {
			setSelectedProcedure(procedure);
			console.log("Procedimiento seleccionado:", procedure);
		}
	};

	const truncateText = (text, maxLength) => {
		if (text.length > maxLength) {
			return text.substring(0, maxLength) + '...';
		}
		return text;
	};

	const maxTitleLength = 25;

	return (
		<div className="text-center mt-5">
			<Signup></Signup>
			<Login></Login>
			<div className="p-4">
				<DropdownButton
					id="dropdown-basic-button"
					title={selectedProcedure ? truncateText(selectedProcedure.title, maxTitleLength) : "Seleccionar Trámite"} // También truncamos el título del botón
					onSelect={handleSelect}
					className="w-100"
					variant="info"
				>
					{procedures_categorized && procedures_categorized.length > 0 ? (
						procedures_categorized.map((item) => (
							<Dropdown.Item
								key={item.title}
								eventKey={item.title}
								active={selectedProcedure?.title === item.title}
								className="py-1"
								style={{ transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out', backgroundColor: 'white' }}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'scale(1.02)';
									e.currentTarget.style.backgroundColor = '#f0f0f0';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'scale(1)';
									e.currentTarget.style.backgroundColor = 'white';
								}}
							>
								<div className="d-flex flex-column">
									<h6 className="mb-0 fw-normal" style={{ fontSize: '0.9rem' }}>
										{truncateText(item.title, maxTitleLength)}
									</h6>
									<small className="text-muted" style={{ fontSize: '0.75rem' }}>{item.category}</small>
								</div>
							</Dropdown.Item>
						))
					) : (
						<Dropdown.Item disabled>No hay trámites disponibles</Dropdown.Item>
					)}
				</DropdownButton>
			</div>
		</div>
	);
};