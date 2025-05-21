1) Para realizar scraping se tomo en consideraci{on lo siguiente 


# Tras investigar la primera opción de escrapeo era beutifullsoap, sin embargo eso funciona para página cuyo HTML es estático y no carga dinámicamente
# La segunda opción era Selenium, sin embargo en el etorno de github no permite ser utilizado porque por medidas de seguridad no permite abrir navegadores para realizar las busquedas de información necesaria
# Finalmente usamos playwright, porque gracias a su atributo headless=True es posible emular la navegación sin realmente abirlo cumpliendo con la brecha de seguridad de github
# El proceso de instalación de este paquete es el siguiente
# 1) pip install playwright
# 2) playwright install
# 3) npx playwright install-deps
# 4) playwright install para verificar que se ha instalado

Anotación de como traer solo un resultado de prubea en el arfchivo scraping.py

 if links.count() > 0:
        titulo = links.nth(0).text_content().strip()
        enlace = links.nth(0).get_attribute("href")
        print(f"Título: {titulo}")
        print(f"Enlace: {enlace}")

    browser.close()

# Con esto busca todos los tramites de la primera pagina, hay que buscar la forma de hacer de las demás páginas
    # for i in range(links.count()):
    # titulo = links.nth(i).text_content().strip()
    # enlace = links.nth(i).get_attribute("href")
    # print(f"Título: {titulo}")
    # print(f"Enlace: {enlace}")
    # print("---")

2) Modelado de datos. Tras relizar el modelo nos encontramos que el generador de diagramas no estab aconfigurado en la plantailla facilitada por lo que se tguvo que actualizar la libreria del entorno graphviz mediante los siguientes comandos en terminal. El modelado de dato se encuentra en models, dentro de la carpeta api en src, lo mismo que pasará con las rutas del endpoint

a) sudo apt-get update
b) sudo apt-get install graphviz graphviz-dev

Luego se tuvo que instalar la libraria que hemos ido utlizando durante el curso en la academia, mediante el siguiente comando en terminal:

pipenv install eralchemy2

En el archivo del proyecto Pipfile se indica la variable diagram con el input -i para indicar la dirección preestablecida que tendrá los datos del sql, es decir  postgresql://gitpod:postgres@localhost:5432/example y hacer un output -o de diagram.png, el cual se especifica dentro del gitignore, para que sea visible para los colaboradores del desarrollo y no el público en general que viese el repositorio.

3) Tras revisar que el modelo correspondia con las relaciones indicadas pasamos a desarrollar los endpoints de la api en routes.