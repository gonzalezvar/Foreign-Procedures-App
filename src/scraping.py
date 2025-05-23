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
        "name": "Residencia Temporal y No Lucrativa",
        "description": "Autorizaciones temporales, iniciales o renovaciones, incluidas no lucrativas."
    },
    "no lucrativa": {
        "name": "Residencia Temporal y No Lucrativa",
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
        "description": "Residencia por colaboración con autoridades policiales o judiciales."
    },
    "larga duración": {
        "name": "Residencia de Larga Duración y Movilidad UE",
        "description": "Permite residencia permanente nacional o movilidad dentro de la UE."
    },
    "búsqueda de empleo": {
        "name": "Búsqueda de Empleo y Otros",
        "description": "Permite búsqueda activa de empleo o inicio de proyectos empresariales."
    }
}

TEMP_PDF = "temp_procedure.pdf"


def extract_procedure_section(pdf_text):
    pattern = re.compile(
        r'(Procedimiento.*?)(?:\n[A-ZÁÉÍÓÚÑ\s]+:|\Z)', re.DOTALL | re.IGNORECASE)
    match = pattern.search(pdf_text)
    if match:
        return match.group(1).strip()
    return None


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
            print(f"  Link PDF encontrado: {pdf_href}")

            if pdf_href:
                if not pdf_href.startswith("http"):
                    pdf_href = f"https://www.inclusion.gob.es{pdf_href}"
                print(f"  URL completo del PDF: {pdf_href}")

                with page.expect_download() as download_info:
                    page.click("a.m-attachment__link.m-icon-pdf")
                download = download_info.value
                download.save_as(TEMP_PDF)

                pdf_text = extract_text_from_pdf(TEMP_PDF)
                print(f"  Extracted PDF text length: {len(pdf_text)}")
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
    with open("procedures_categorized.json", "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=2)

print("Proceso finalizado, datos guardados en procedures_categorized.json")
