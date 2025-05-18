from playwright.sync_api import sync_playwright
import json

titles = []
links = []
procedures = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Extraer enlaces y títulos
    page.goto("https://www.inclusion.gob.es/web/migraciones/listado-completo")
    page.wait_for_selector("div.container > ul > li > a")
    link_elements = page.locator("div.container > ul > li > a")
    count = link_elements.count()

    for i in range(count):
        titles.append(link_elements.nth(i).text_content().strip())
        links.append(link_elements.nth(i).get_attribute("href"))

    # Extraer procedimientos
    for i in range(count):
        current_link = links[i]
        try:
            page.goto(current_link)
            print(f"Navigating to: {current_link}")

            procedure_content = None

            # Try clicking the "Procedimiento" tab (or similar)
            procedure_tab_locators = [
                "li:has-text('Procedimiento')",
                "li:has-text('Tramitación')",
                "li:has-text('Cómo se realiza')"
            ]
            for locator in procedure_tab_locators:
                tab = page.locator(locator)
                if tab.count() > 0:
                    print(f"Found tab: '{tab.first.text_content()}'")
                    tab.first.click()
                    page.wait_for_timeout(1000)  # Give time for content to load
                    break  # Exit the loop if a tab is found and clicked

            # Try locating the procedure content in different ways
            content_locators = [
                'section[aria-label="Procedimiento"]',
                'div[aria-label="Procedimiento"]',
                'section:has-text-within(strong, "Procedimiento")', # Look for a section containing "Procedimiento" in a strong tag
                'div:has-text-within(strong, "Procedimiento")',
                'div.content-box', # A more generic content box class (inspect the website)
                'div.tab-content.active', # If tabs use this pattern
                'article' # Sometimes the main content is within an article tag
            ]

            for locator in content_locators:
                content_element = page.locator(locator)
                if content_element.count() > 0:
                    procedure_content = content_element.first.text_content().strip()
                    print(f"Found procedure content using locator: '{locator}'")
                    break

            if procedure_content:
                procedures.append(procedure_content)
            else:
                print(f"Could not find procedure content on {current_link}")
                procedures.append(None)

        except Exception as e:
            print(f"Error processing {current_link}: {e}")
            procedures.append(None)

    page.close()
    browser.close()

# Construir lista de diccionarios
data = [
    {"title": title, "link": link, "procedure": procedure}
    for title, link, procedure in zip(titles, links, procedures)
]

# Guardar como JSON
with open("procedures.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Scraping complete. Results saved to procedures.json")