import { useState, useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import procedures_categorized from "../assets/img/procedures_categorized.json";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Signup } from "../components/Signup.jsx";
import { Login } from "../components/Login.jsx";
import { ErrandTypes } from '../components/ErrandTypes.jsx';
import { motion, useScroll, useSpring } from "framer-motion";
// import get_offices from "../../get_offices.py";

export const Home = () => {

	// useEffect(() => {
	// 	offices = get_offices()
	// 	console.log("Offices:", offices);
	// }
	// 	, []);

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

	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001
	});

	return (
		<div className="text-center mt-5">
			{/* 🔵 Barra de progreso del scroll */}
			<motion.div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					height: "4px",
					background: "#0d6efd",
					transformOrigin: "0%",
					scaleX
				}}
			/>

			<div className="p-4">
				<ErrandTypes></ErrandTypes>
			</div>
		</div>
	);
};

/* 
export const Slideshow = ({ image }) => (
  <AnimatePresence>
	<motion.img
	  key={image.src}
	  src={image.src}
	  initial={{ x: 300, opacity: 0 }}
	  animate={{ x: 0, opacity: 1 }}
	  exit={{ x: -300, opacity: 0 }}
	/>
  </AnimatePresence>
) */