
import json
import os

# Define OT and NT books
OT_BOOKS = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalm", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
]

NT_BOOKS = [
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
    "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
    "1 John", "2 John", "3 John", "Jude", "Revelation"
]

def get_testament(reference):
    for book in NT_BOOKS:
        if reference.startswith(book):
            return "New"
    for book in OT_BOOKS:
        if reference.startswith(book):
            return "Old"
    return "Unknown"

def generate_html(cards):
    html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sermon Cards - Print Layout</title>
    <style>
        @page {
            size: 8.5in 11in;
            margin: 0;
        }
        body {
            font-family: 'Outfit', sans-serif;
            margin: 0;
            padding: 0;
            background: #fff;
        }
        .page {
            width: 8.5in;
            height: 11in;
            padding-top: 0.5in;
            padding-left: 0.75in;
            padding-right: 0.75in;
            display: grid;
            grid-template-columns: 3.5in 3.5in;
            grid-template-rows: repeat(5, 2in);
            gap: 0;
            page-break-after: always;
            box-sizing: border-box;
        }
        .card {
            width: 3.5in;
            height: 2in;
            border: 0.1pt solid #eee; /* Light crop marks */
            box-sizing: border-box;
            padding: 0.25in;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            position: relative;
            overflow: hidden;
            background: #fff;
        }
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
        }
        .card.old::before { background: #d9534f; } /* Red for Old Testament */
        .card.new::before { background: #337ab7; } /* Blue for New Testament */
        
        .verse {
            font-size: 10pt;
            line-height: 1.3;
            margin-bottom: 5pt;
            font-style: italic;
            color: #333;
        }
        .ref {
            font-size: 8pt;
            font-weight: bold;
            color: #000;
        }
        .topic {
            position: absolute;
            top: 5pt;
            right: 10pt;
            font-size: 6pt;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #999;
        }
        .testament-label {
            position: absolute;
            bottom: 5pt;
            right: 10pt;
            font-size: 6pt;
            text-transform: uppercase;
            font-weight: bold;
        }
        .old .testament-label { color: #d9534f; }
        .new .testament-label { color: #337ab7; }

        @media print {
            .no-print { display: none; }
        }
        .controls {
            padding: 20px;
            background: #f4f4f4;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="controls no-print">
        <h1>Print Preview</h1>
        <p>This layout is set for standard Business Card templates (3.5" x 2", 10 per page).</p>
        <button onclick="window.print()">Print Cards</button>
    </div>
    <div class="page">
        {card_content}
    </div>
</body>
</html>
"""
    
    card_html = ""
    for i, card in enumerate(cards):
        testament = get_testament(card["reference"])
        cls = testament.lower()
        
        # Start a new page every 10 cards
        if i > 0 and i % 10 == 0:
            card_html += '</div><div class="page">'
            
        card_html += f"""
        <div class="card {cls}">
            <div class="topic">{card["topic"]}</div>
            <div class="verse">"{card["verse"]}"</div>
            <div class="ref">{card["reference"]}</div>
            <div class="testament-label">{testament} Testament</div>
        </div>
        """
        
    return html_template.replace("{card_content}", card_html)

def main():
    json_path = "resources/data/cards.json"
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return
        
    with open(json_path, "r") as f:
        cards = json.load(f)
        
    html_content = generate_html(cards)
    
    output_path = "print_cards.html"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print(f"Successfully generated {output_path} with {len(cards)} cards.")
    print("Open this file in your browser to print!")

if __name__ == "__main__":
    main()
