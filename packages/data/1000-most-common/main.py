from bs4 import BeautifulSoup
import os
import pandas as pd
import requests
import shutil
from tqdm import tqdm


TIMEOUT = 30
LANGUAGES_URL = "https://1000mostcommonwords.com/languages/"


languages_response = requests.get(LANGUAGES_URL, timeout=TIMEOUT)
languages_html = languages_response.text
languages_soup = BeautifulSoup(languages_html, "html.parser")
list_items = languages_soup.find_all("li")


def chunks(list, n):
    # looping till length l
    for i in range(0, len(list), n):
        yield list[i : i + n]


def get_words(link: str, column: str):
    try:
        response = requests.get(link, timeout=TIMEOUT)
        html = response.text
        beautiful_soup = BeautifulSoup(html, "html.parser")
        tables = beautiful_soup.find_all("table")
        words = []
        # Process Table
        for _, table in enumerate(tables):
            rows = table.find("tbody").find_all("tr")
            for row in rows:
                cells = row.find_all("td")
                cells_list = list(cells)
                number_text = cells_list[0].getText().strip().lower()
                language_text = cells_list[1].getText().strip().lower()
                english_text = cells_list[2].getText().strip().lower()
                if "number" != number_text:
                    word = {
                        "language": column,
                        "english": english_text,
                        "vocabulary": language_text,
                    }
                    words.append(word)
        sorted_words = sorted(words, key=lambda h: h["english"])
        return sorted_words
    except Exception as exception:
        print(exception)
        return []


os.makedirs("temp", exist_ok=True)


languages = []


chunks_list_items = chunks(list_items, 30)
for chunk_list_items in chunks_list_items:
    for list_item in tqdm(chunk_list_items):
        anchor = list_item.find("a", href=True)
        language = anchor.text.lower()
        file_name = "-".join(language.split(" "))
        column = "_".join(language.split(" "))
        link = anchor.get("href", "")
        if "1000-most-common" in link and language != "english":
            try:
                words = get_words(link, column)
                languages.append(language)
                words_data_frame = pd.DataFrame(words)
                words_data_frame = words_data_frame.drop_duplicates()
                words_data_frame = words_data_frame.sort_values(by=["english"])
                words_data_frame.to_csv(
                    f"./temp/{language}.csv", index=False, header=True
                )
            except Exception:
                print("link", link)


languages.sort()


languages_file = open("./languages.txt", "w")
languages_file.write("\n".join(languages))


csv_files = []
for root, _, files in os.walk("./temp"):
    for file in files:
        if file.endswith(".csv"):
            csv_files.append(os.path.join(root, file))


data_frames = []
for csv_file in csv_files:
    data_frame = pd.read_csv(csv_file)
    data_frames.append(data_frame)


languages_data_frame = pd.concat(data_frames, ignore_index=True)
languages_data_frame = languages_data_frame.sort_values(by=["language", "english"])
languages_data_frame.to_csv("./languages.csv", index=False)


shutil.rmtree("./temp")
