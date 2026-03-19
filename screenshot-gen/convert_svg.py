import re
import os

def convert_file(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove all react-native-svg imports
    content = re.sub(r"import Svg[^\n]*'react-native-svg';", "", content)

    # Replace SVG tags
    tags = ["Svg", "Circle", "Ellipse", "Path", "Rect", "G", "Line", "Defs", "LinearGradient", "Stop"]
    for tag in tags:
        content = re.sub(r'<' + tag + r'(\s|>)', r'<' + tag.lower() + r'\1', content)
        content = re.sub(r'</' + tag + '>', '</' + tag.lower() + '>', content)

    # Some attributes might need CamelCase to lowercase for standard SVG in React
    # Actually React DOM SVG elements support camelCase attributes like strokeWidth!
    # But attributes like `strokeMiterlimit` are fine in React. 
    # Just need to remove any React Native specific stuff if any, but Svg elements translate 1:1 to React DOM usually.

    # We also need to add export if not there, but it already has exports.
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

convert_file(
    r'c:\Users\ehddn\Desktop\before\test2\src\constants\MoodCharacters.js',
    r'c:\Users\ehddn\Desktop\before\test2\screenshot-gen\src\app\icon\MoodCharacters.tsx'
)

convert_file(
    r'c:\Users\ehddn\Desktop\before\test2\src\constants\DoodleStickers.js',
    r'c:\Users\ehddn\Desktop\before\test2\screenshot-gen\src\app\icon\DoodleStickers.tsx'
)
