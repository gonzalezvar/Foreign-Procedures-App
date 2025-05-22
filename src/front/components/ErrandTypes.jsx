import React, { useState } from 'react';
import procedures_categorized from "../assets/img/procedures_categorized.json";

export const ErrandTypes = () => {
    const [selectedCategory, setSelectedCategory] = useState("Todas");

    const uniqueCategories = ["Todas", ...new Set(procedures_categorized.map(item => item.category))];

    const filteredProcedures = selectedCategory === "Todas"
        ? procedures_categorized
        : procedures_categorized.filter(item => item.category === selectedCategory);

    return (
        <div className="p-4">
            <h1>Lista de Trámites</h1>

            <div className="mb-3">
                <label htmlFor="category-select" className="form-label">Filtrar por Categoría:</label>
                <select
                    id="category-select"
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="row">
                {filteredProcedures.map((item) => (
                    <div className="col-md-4 mb-4" key={item.id}>
                        <div className="card" style={{ width: '100%' }}>
                            <img
                                src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                className="card-img-top"
                                alt="errand"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">{item.category}</p>
                                <a href="#" className="btn btn-primary">
                                    Ver más
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};
