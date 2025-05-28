import { Link, useParams } from "react-router-dom";  
import PropTypes from "prop-types";  
import useGlobalReducer from "../hooks/useGlobalReducer";  
import { useFavorites } from "../hooks/favoriteReducer";
import Button from '@mui/material/Button';

export const ErrandDetail = () => {
    const { errand_id } = useParams();  
    const { store, dispatch } = useGlobalReducer();
     const { state: favoritesState, dispatch: favoriteReducer } = useFavorites();
  

    // const getLocalStorage = localStorage.getItem("errands");
    const stoOfErrands = store.content.errands.data || [];


const singleErrand = stoOfErrands.find(
    (item) => item.errand_id === parseInt(errand_id)
);

if (!singleErrand) {
    return <div>No se encontró el trámite.</div>;
}

   const handleFavorite = (e, item) => {
           e.stopPropagation();
           const userId = store.main.user_data ? store.main.user_data.users_id : null;
           console.log({ userId });
       const isFavorite = favoritesState.favorites.some(fav => fav.id === item.errand_id);
   
   
   
           if (isFavorite) {
               // Quitar favorito
               favoritesServices.removeFavorite(favoriteReducer, item.errand_id);
           } else {
               // Agregar favorito
   
               favoritesServices.addFavorite(favoriteReducer, userId, {
                   id: item.errand_id,
                   name: item.errand_name,
               });
           }
       };

       const isFavorite = true

    return (
        <>
           <div className="col-md-4 mb-4">
        <div className="card" style={{ width: '100%' }}>
            <img
                src="https://plus.unsplash.com/premium_photo-1661329930662-19a43503782f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top"
                alt="errand"
            />
            <div className="card-body">
                <h5 className="card-title">{singleErrand.name}</h5>
                <p className="card-text">Descripción del tipo de trámite{singleErrand.errand_type.description}</p>
                <p className="card-text">Procedimiento{singleErrand.procedures}</p>
                <p className="card-text">Requerimientos:{singleErrand.requirements}</p>
                 <Button variant="contained" size="large" style={{ textDecoration: 'none', backgroundColor: 'orange', }} onClick={(e) => handleFavorite(e)}>
                    {isFavorite ? "❤️" : "🤍"}
                </Button>
                
            </div>
        </div>
    </div>
        </>
    );
};

// Use PropTypes to validate the props passed to this component, ensuring reliable behavior.
ErrandDetail.propTypes = {
    // Although 'match' prop is defined here, it is not used in the component.
    // Consider removing or using it as needed.
    match: PropTypes.object
};


/* "use client"
import { motion, useScroll } from "motion/react"
export default function ScrollLinked() {
    const { scrollYProgress } = useScroll()
    return (
        <>
            <motion.div
                id="scroll-indicator"
                style={{
                    scaleX: scrollYProgress,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 10,
                    originX: 0,
                    backgroundColor: "#FF0088",
                }}
            />
            <Content />
        </>
    )
}
/**
 * ==============   Utils   ================
 *
function Content() {
    return (
        <>
            <article
                style={{
                    maxWidth: 500,
                    padding: "150px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}
            >
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aliquam ac rhoncus quam.
                </p>
                <p>
                    Fringilla quam urna. Cras turpis elit, euismod eget ligula
                    quis, imperdiet sagittis justo. In viverra fermentum ex ac
                    vestibulum. Aliquam eleifend nunc a luctus porta. Mauris
                    laoreet augue ut felis blandit, at iaculis odio ultrices.
                    Nulla facilisi. Vestibulum cursus ipsum tellus, eu tincidunt
                    neque tincidunt a.
                </p>
                <h2>Sub-header</h2>
                <p>
                    In eget sodales arcu, consectetur efficitur metus. Duis
                    efficitur tincidunt odio, sit amet laoreet massa fringilla
                    eu.
                </p>
                <p>
                    Pellentesque id lacus pulvinar elit pulvinar pretium ac non
                    urna. Mauris id mauris vel arcu commodo venenatis. Aliquam
                    eu risus arcu. Proin sit amet lacus mollis, semper massa ut,
                    rutrum mi.
                </p>
                <p>
                    Sed sem nisi, luctus consequat ligula in, congue sodales
                    nisl.
                </p>
                <p>
                    Vestibulum bibendum at erat sit amet pulvinar. Pellentesque
                    pharetra leo vitae tristique rutrum. Donec ut volutpat ante,
                    ut suscipit leo.
                </p>
                <h2>Sub-header</h2>
                <p>
                    Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum
                    fringilla aliquet. Pellentesque auctor vehicula malesuada.
                    Aliquam id feugiat sem, sit amet tempor nulla. Quisque
                    fermentum felis faucibus, vehicula metus ac, interdum nibh.
                    Curabitur vitae convallis ligula. Integer ac enim vel felis
                    pharetra laoreet. Interdum et malesuada fames ac ante ipsum
                    primis in faucibus. Pellentesque hendrerit ac augue quis
                    pretium.
                </p>
                <p>
                    Morbi ut scelerisque nibh. Integer auctor, massa non dictum
                    tristique, elit metus efficitur elit, ac pretium sapien nisl
                    nec ante. In et ex ultricies, mollis mi in, euismod dolor.
                </p>
                <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
                <p>
                    Pellentesque id lacus pulvinar elit pulvinar pretium ac non
                    urna. Mauris id mauris vel arcu commodo venenatis. Aliquam
                    eu risus arcu. Proin sit amet lacus mollis, semper massa ut,
                    rutrum mi.
                </p>
                <p>
                    Sed sem nisi, luctus consequat ligula in, congue sodales
                    nisl.
                </p>
                <p>
                    Vestibulum bibendum at erat sit amet pulvinar. Pellentesque
                    pharetra leo vitae tristique rutrum. Donec ut volutpat ante,
                    ut suscipit leo.
                </p>
                <h2>Sub-header</h2>
                <p>
                    Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum
                    fringilla aliquet. Pellentesque auctor vehicula malesuada.
                    Aliquam id feugiat sem, sit amet tempor nulla. Quisque
                    fermentum felis faucibus, vehicula metus ac, interdum nibh.
                    Curabitur vitae convallis ligula. Integer ac enim vel felis
                    pharetra laoreet. Interdum et malesuada fames ac ante ipsum
                    primis in faucibus. Pellentesque hendrerit ac augue quis
                    pretium.
                </p>
                <p>
                    Morbi ut scelerisque nibh. Integer auctor, massa non dictum
                    tristique, elit metus efficitur elit, ac pretium sapien nisl
                    nec ante. In et ex ultricies, mollis mi in, euismod dolor.
                </p>
                <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aliquam ac rhoncus quam.
                </p>
                <p>
                    Fringilla quam urna. Cras turpis elit, euismod eget ligula
                    quis, imperdiet sagittis justo. In viverra fermentum ex ac
                    vestibulum. Aliquam eleifend nunc a luctus porta. Mauris
                    laoreet augue ut felis blandit, at iaculis odio ultrices.
                    Nulla facilisi. Vestibulum cursus ipsum tellus, eu tincidunt
                    neque tincidunt a.
                </p>
                <h2>Sub-header</h2>
                <p>
                    In eget sodales arcu, consectetur efficitur metus. Duis
                    efficitur tincidunt odio, sit amet laoreet massa fringilla
                    eu.
                </p>
                <p>
                    Pellentesque id lacus pulvinar elit pulvinar pretium ac non
                    urna. Mauris id mauris vel arcu commodo venenatis. Aliquam
                    eu risus arcu. Proin sit amet lacus mollis, semper massa ut,
                    rutrum mi.
                </p>
                <p>
                    Sed sem nisi, luctus consequat ligula in, congue sodales
                    nisl.
                </p>
                <p>
                    Vestibulum bibendum at erat sit amet pulvinar. Pellentesque
                    pharetra leo vitae tristique rutrum. Donec ut volutpat ante,
                    ut suscipit leo.
                </p>
                <h2>Sub-header</h2>
                <p>
                    Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum
                    fringilla aliquet. Pellentesque auctor vehicula malesuada.
                    Aliquam id feugiat sem, sit amet tempor nulla. Quisque
                    fermentum felis faucibus, vehicula metus ac, interdum nibh.
                    Curabitur vitae convallis ligula. Integer ac enim vel felis
                    pharetra laoreet. Interdum et malesuada fames ac ante ipsum
                    primis in faucibus. Pellentesque hendrerit ac augue quis
                    pretium.
                </p>
                <p>
                    Morbi ut scelerisque nibh. Integer auctor, massa non dictum
                    tristique, elit metus efficitur elit, ac pretium sapien nisl
                    nec ante. In et ex ultricies, mollis mi in, euismod dolor.
                </p>
                <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
                <p>
                    Pellentesque id lacus pulvinar elit pulvinar pretium ac non
                    urna. Mauris id mauris vel arcu commodo venenatis. Aliquam
                    eu risus arcu. Proin sit amet lacus mollis, semper massa ut,
                    rutrum mi.
                </p>
                <p>
                    Sed sem nisi, luctus consequat ligula in, congue sodales
                    nisl.
                </p>
                <p>
                    Vestibulum bibendum at erat sit amet pulvinar. Pellentesque
                    pharetra leo vitae tristique rutrum. Donec ut volutpat ante,
                    ut suscipit leo.
                </p>
                <h2>Sub-header</h2>
                <p>
                    Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum
                    fringilla aliquet. Pellentesque auctor vehicula malesuada.
                    Aliquam id feugiat sem, sit amet tempor nulla. Quisque
                    fermentum felis faucibus, vehicula metus ac, interdum nibh.
                    Curabitur vitae convallis ligula. Integer ac enim vel felis
                    pharetra laoreet. Interdum et malesuada fames ac ante ipsum
                    primis in faucibus. Pellentesque hendrerit ac augue quis
                    pretium.
                </p>
                <p>
                    Morbi ut scelerisque nibh. Integer auctor, massa non dictum
                    tristique, elit metus efficitur elit, ac pretium sapien nisl
                    nec ante. In et ex ultricies, mollis mi in, euismod dolor.
                </p>
                <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
            </article>
        </>
    )
}
 */
/* import * as motion from "motion/react-client"
export default function Gestures() {
    return (
        <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            style={box}
        />
    )
}
/**
 * ==============   Styles   ================
 *
const box = {
    width: 100,
    height: 100,
    backgroundColor: "#9911FF",
    borderRadius: 5,
} */