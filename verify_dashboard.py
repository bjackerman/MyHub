import time
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Set viewport to a desktop size to match the design
    context = browser.new_context(viewport={"width": 1600, "height": 900})
    page = context.new_page()

    # Wait for server to start
    print("Navigating to Dashboard...")
    try:
        page.goto("http://localhost:3000", timeout=60000)
    except Exception as e:
        print(f"Failed to load page: {e}")
        browser.close()
        return

    # Screen 1: Dashboard
    print("Capturing Screen 1 (Dashboard)...")
    # Wait for content to load
    try:
        page.wait_for_selector("text=My Workspace", timeout=10000)
        # Add a small delay to ensure styles are fully applied
        time.sleep(2)
        page.screenshot(path="verification_dashboard.png", full_page=True)
    except Exception as e:
        print(f"Error capturing dashboard: {e}")

    # Screen 2: Library
    print("Navigating to Library...")
    try:
        page.goto("http://localhost:3000/library")
        print("Capturing Screen 2 (Library)...")
        page.wait_for_selector("text=Widget Library", timeout=10000)
        time.sleep(2)
        page.screenshot(path="verification_library.png", full_page=True)
    except Exception as e:
        print(f"Error capturing library: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
