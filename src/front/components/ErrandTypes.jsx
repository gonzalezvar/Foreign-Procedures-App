import procedures_categorized from "../assets/img/procedures_categorized.json"

export const ErrandTypes = () => {
    // Access the global state and dispatch function using the useGlobalReducer hook.



    return (
        <div className="p-4">
            <h1>Lista de artículos</h1>
            <ul>
                {procedures_categorized.map((item) => (
                    <li key={item.id}>
                        <h2>{item.title}</h2>
                        <p>{item.category}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}






