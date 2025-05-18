from playwright.sync_api import sync_playwright
import json

# Definir las palabras clave y sus categorías
keyword_categories = {
    "residencia temporal": "Residencia Temporal",
    "autorización de regreso": "Trámites de Salida/Regreso",
    "prórroga de la estancia": "Prórrogas de Estancia",
    "estancia por estudios": "Estancia por Estudios",
    "investigación": "Investigación",
    "formación": "Investigación",  # Consideramos formación dentro de investigación
    "movilidad de alumnos": "Estancia por Estudios",
    "prácticas no laborales": "Estancia por Prácticas",
    "servicios de voluntariado": "Estancia por Voluntariado",
    "no lucrativa": "Residencia No Lucrativa",
    "reagrupación familiar": "Reagrupación Familiar",
    "trabajo por cuenta ajena": "Trabajo por Cuenta Ajena",
    "tarjeta azul-UE": "Movilidad UE (Trabajo/Familiar)",
    "residentes de larga duración-UE": "Movilidad UE (Trabajo/Familiar)",
    "residencia independiente": "Residencia Independiente",
    "renovación": "Renovaciones",
    "inicial": "Solicitudes Iniciales",
    "movilidad de los extranjeros admitidos como investigadores": "Movilidad UE (Investigadores)",
}

titles = []
links = []
procedures = []
categorized_data = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Extraer enlaces y títulos
    page.goto("https://www.inclusion.gob.es/web/migraciones/listado-completo")
    page.wait_for_selector("div.container > ul > li > a")
    link_elements = page.locator("div.container > ul > li > a")
    count = link_elements.count()

    for i in range(count):
        title = link_elements.nth(i).text_content().strip()
        link = link_elements.nth(i).get_attribute("href")
        titles.append(title)
        links.append(link)

    # Extraer procedimientos y categorizar
    for i in range(count):
        current_link = links[i]
        current_title = titles[i]
        procedure_content = None
        category = "Sin Categorizar"  # Categoría por defecto

        try:
            page.goto(current_link)
            print(f"Navigating to: {current_link}")

            procedure_tab_locators = [
                "li:has-text('Procedimiento')",
                "li:has-text('Procedimiento iniciado desde fuera de España')",
                "li:has-text('Procedimiento iniciado desde España')",
            ]
            for locator in procedure_tab_locators:
                tab = page.locator(locator)
                if tab.count() > 0:
                    print(f"Found tab: '{tab.first.text_content()}'")
                    tab.first.click()
                    page.wait_for_timeout(10000)
                    break

            content_locators = [
                'section[aria-label="Procedimiento"]',
                'section[aria-label="Procedimiento iniciado desde fuera de España"]',
                'section[aria-label="Procedimiento iniciado desde España"]',
            ]
            for locator in content_locators:
                content_element = page.locator(locator)
                if content_element.count() > 0:
                    procedure_content = content_element.first.text_content().strip()
                    print(f"Found procedure content using locator: '{locator}'")
                    break

            if not procedure_content:
                print(f"Could not find procedure content on {current_link}")

        except Exception as e:
            print(f"Error processing {current_link}: {e}")

        procedures.append(procedure_content)

        # Categorización basada en palabras clave
        for keyword, cat in keyword_categories.items():
            if keyword.lower() in current_title.lower():
                category = cat
                break  # Asignamos la primera categoría coincidente

        categorized_data.append({
            "title": current_title,
            "link": current_link,
            "procedure": procedure_content,
            "category": category
        })

    page.close()
    browser.close()

# Guardar como JSON con categorías
with open("procedures_categorized.json", "w", encoding="utf-8") as f:
    json.dump(categorized_data, f, ensure_ascii=False, indent=2)

print("Scraping and categorization complete. Results saved to procedures_categorized.json")