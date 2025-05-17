from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from playwright.sync_api import sync_playwright

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.goto("https://www.inclusion.gob.es/web/migraciones/listado-completo")
    
    page.wait_for_selector("div.container > ul > li > a")

    links = page.locator("div.container > ul > li > a")

    if links.count() > 0:
        titulo = links.nth(0).text_content().strip()
        enlace = links.nth(0).get_attribute("href")
        print(f"Título: {titulo}")
        print(f"Enlace: {enlace}")

    browser.close()

# para que haga todos de la primera pagina, hay que buscar la forma de hacer de las demás páginas
    # for i in range(links.count()):
    # titulo = links.nth(i).text_content().strip()
    # enlace = links.nth(i).get_attribute("href")
    # print(f"Título: {titulo}")
    # print(f"Enlace: {enlace}")
    # print("---")
