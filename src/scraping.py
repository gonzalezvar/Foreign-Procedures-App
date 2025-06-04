from playwright.sync_api import sync_playwright
import json
import pdfplumber
import re
import os

# Definir las palabras clave y sus categorías
keyword_categories = {
    "estancia de larga duración": {
        "name": "Estancia por Estudios y Formación",
        "description": "Permite residir por estudios, formación o movilidad académica."
    },
    "prácticas": {
        "name": "Estancia por Prácticas y Voluntariado",
        "description": "Permite realizar prácticas formativas y participar en voluntariados."
    },
    "voluntariado": {
        "name": "Estancia por Prácticas y Voluntariado",
        "description": "Permite participar en programas de voluntariado."
    },
    "residencia temporal": {
        "name": "Residencia Temporal General",
        "description": "Autorizaciones temporales, iniciales o renovaciones, incluidas no lucrativas, y otras circunstancias especiales."
    },
    "no lucrativa": {
        "name": "Residencia Temporal General",
        "description": "Permite residir sin actividad laboral con medios económicos propios."
    },
    "trabajo por cuenta ajena": {
        "name": "Trabajo por Cuenta Ajena y Propia",
        "description": "Permite trabajar para un empleador o por cuenta propia."
    },
    "trabajo por cuenta propia": {
        "name": "Trabajo por Cuenta Ajena y Propia",
        "description": "Permite trabajar por cuenta propia."
    },
    "reagrupación familiar": {
        "name": "Reagrupación y Residencia Independiente",
        "description": "Permite reagrupar familiares y obtener residencia propia."
    },
    "residencia independiente": {
        "name": "Reagrupación y Residencia Independiente",
        "description": "Residencia propia para familiares reagrupados."
    },
    "arraigo": {
        "name": "Circunstancias Excepcionales y Arraigos",
        "description": "Permite residencia por arraigo social, laboral, familiar y otras circunstancias excepcionales."
    },
    "colaboración con autoridades": {
        "name": "Circunstancias Excepcionales y Arraigos",
        "description": "Residencia por colaboración con autoridades policiales, fiscales o judiciales."
    },
    "larga duración": {
        "name": "Residencia de Larga Duración y Movilidad UE",
        "description": "Permite residencia permanente nacional o movilidad dentro de la UE."
    },
    "búsqueda de empleo": {
        "name": "Búsqueda de Empleo y Prácticas",
        "description": "Permite búsqueda activa de empleo, inicio de proyectos empresariales o realización de prácticas formativas."
    },
    "excepción a la autorización de trabajo": {
        "name": "Otras Residencias Temporales Específicas",
        "description": "Autorizaciones de residencia temporal para casos específicos como excepciones laborales, retorno voluntario, o vínculos con nacionales españoles."
    },
    "retorno voluntario": {
        "name": "Otras Residencias Temporales Específicas",
        "description": "Autorizaciones de residencia temporal para casos específicos como excepciones laborales, retorno voluntario, o vínculos con nacionales españoles."
    },
    "familiares de nacionalidad española": {
        "name": "Otras Residencias Temporales Específicas",
        "description": "Autorizaciones de residencia temporal para casos específicos como excepciones laborales, retorno voluntario, o vínculos con nacionales españoles."
    },
    "actividades de temporada": {
        "name": "Trabajo Temporal y Migración Circular",
        "description": "Autorizaciones de residencia y trabajo para actividades de temporada, gestión colectiva de contrataciones en origen (GECCO), y migración circular."
    },
    "gestión colectiva de contrataciones en origen": {
        "name": "Trabajo Temporal y Migración Circular",
        "description": "Autorizaciones de residencia y trabajo para actividades de temporada, gestión colectiva de contrataciones en origen (GECCO), y migración circular."
    },
    "trabajadores transfronterizos": {
        "name": "Trabajadores Transfronterizos",
        "description": "Autorizaciones de trabajo para ciudadanos extranjeros que residen en un país y trabajan en otro, cruzando la frontera."
    },
    "menores extranjeros": {
        "name": "Residencia y Desplazamiento de Menores y Discapacitados",
        "description": "Autorizaciones de residencia y desplazamiento temporal para menores extranjeros (acompañados o no), incluyendo fines médicos, vacacionales, o de escolarización, y para personas con discapacidad."
    },
    "desplazamiento temporal de menores": {
        "name": "Residencia y Desplazamiento de Menores y Discapacitados",
        "description": "Autorizaciones de residencia y desplazamiento temporal para menores extranjeros (acompañados o no), incluyendo fines médicos, vacacionales, o de escolarización, y para personas con discapacidad."
    },
    "contratación de no residentes": {
        "name": "Contratación de No Residentes y Trámites Complementarios",
        "description": "Normativas sobre la contratación de ciudadanos extranjeros no residentes y procedimientos administrativos complementarios como la legalización de documentos."
    },
    "legalización y traducción de documentos": {
        "name": "Contratación de No Residentes y Trámites Complementarios",
        "description": "Normativas sobre la contratación de ciudadanos extranjeros no residentes y procedimientos administrativos complementarios como la legalización de documentos."
    },
    "familiar de ciudadano de la unión europea": {
        "name": "Residencia de Familiares de Ciudadanos de la Unión",
        "description": "Tarjetas de residencia para familiares de ciudadanos de la Unión Europea, incluyendo la residencia permanente."
    },
    "penados extranjeros": {
        "name": "Trabajo para Personas en Régimen Especial",
        "description": "Autorizaciones de trabajo para penados extranjeros en régimen abierto o libertad condicional."
    }
}


TEMP_PDF = "temp_procedure.pdf"


def extract_procedure_section(pdf_text):
    # Filtrar por "PROCEDIMIENTO" como sección (con salto de línea después)
    matches = list(re.finditer(
        r'\bPROCEDIMIENTO\b\s*\n', pdf_text, re.IGNORECASE))

    if len(matches) == 0:
        return None

    # Usar la última aparición (normalmente el índice aparece primero)
    start_index = matches[-1].end()
    rest_of_text = pdf_text[start_index:]

    # Buscar el siguiente título en mayúsculas como final (mínimo 4 letras y con salto de línea o dos puntos)
    end_match = re.search(r'\n[A-ZÁÉÍÓÚÑ\s]{4,}(\n|:)', rest_of_text)
    end_index = end_match.start() if end_match else len(rest_of_text)

    # Cortar desde procedimiento hasta el fin detectado
    raw_section = rest_of_text[:end_index]

    # Limpieza
    clean_section = re.sub(r'\n{2,}', '\n', raw_section.strip())
    clean_section = "PROCEDIMIENTO\n" + clean_section  # Añadir encabezado nuevamente
    final_section_for_frontend = clean_section.replace('\n', '<br />')

    return final_section_for_frontend


def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Abrir listado principal
    page.goto("https://www.inclusion.gob.es/web/migraciones/listado-completo")
    page.wait_for_selector("div.container > ul > li > a")

    link = page.locator("div.container > ul > li > a")
    count = link.count()

    # Guardamos títulos y enlaces antes de navegar
    tramites = []
    for i in range(count):
        title = link.nth(i).text_content().strip()
        relative_link = link.nth(i).get_attribute("href")
        tramites.append((title, relative_link))

    resultados = []

    for title, relative_link in tramites:
        # Formar URL completa solo si relative_link es relativo
        if relative_link.startswith("http"):
            full_link = relative_link
        else:
            full_link = f"https://www.inclusion.gob.es{relative_link}"

        print(f"Procesando trámite: {title}")
        page.goto(full_link, wait_until="domcontentloaded", timeout=30000)

        # Buscar enlace a PDF (última versión en la página)
        try:
            pdf_link_locator = page.locator("a.m-attachment__link.m-icon-pdf")
            pdf_link_locator.wait_for(state="visible", timeout=10000)

            pdf_href = pdf_link_locator.get_attribute("href")

            if pdf_href:
                if not pdf_href.startswith("http"):
                    pdf_href = f"https://www.inclusion.gob.es{pdf_href}"

                with page.expect_download() as download_info:
                    page.click("a.m-attachment__link.m-icon-pdf")
                download = download_info.value
                download.save_as(TEMP_PDF)

                pdf_text = extract_text_from_pdf(TEMP_PDF)

                procedure_content = extract_procedure_section(pdf_text)
                print(
                    f"  Procedimiento extraído: {procedure_content[:200] if procedure_content else 'None'}")
                os.remove(TEMP_PDF)
            else:
                print("  No se encontró href en el enlace PDF")
                procedure_content = None

        except Exception as e:
            print(f"  No se encontró PDF en la página o error: {e}")
            procedure_content = None

    # Categorizar según keywords
        category = "Sin Categorizar"
        category_description = "Categoría no determinada"
        for keyword, cat in keyword_categories.items():
            if keyword.lower() in title.lower():
                category = cat["name"]
                category_description = cat["description"]
                break

        resultados.append({
            "title": title,
            "link": relative_link,
            "procedure": procedure_content,
            "category": category,
            "category_description": category_description,
            "country": "spain",
        })

    browser.close()

    # Guardar JSON
    with open("src/front/assets/procedures_categorized.json", "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=2)

print("Proceso finalizado, datos guardados en src/front/assets/procedures_categorized.json")
