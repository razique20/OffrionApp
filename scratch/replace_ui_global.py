import os
import glob

replacements = {
    "bg-premium-gradient text-white": "bg-[#111] text-white border border-[#333]",
    "bg-premium-gradient": "bg-[#111] border border-[#333]",
    "text-premium-gradient": "text-white",
    "border-primary/20": "border-[#333]",
    "bg-primary/5": "bg-[#0a0a0a]",
    "bg-primary/10": "bg-[#111]",
    "frost-glass": "",
    "glassmorphism": "",
    "rounded-[40px]": "rounded-md",
    "rounded-[32px]": "rounded-md",
    "rounded-2xl": "rounded-md",
    "rounded-xl": "rounded-md",
    "backdrop-blur-md": "",
    "backdrop-blur-lg": "",
    "backdrop-blur-xl": "",
    "shadow-2xl": "shadow-none",
    "shadow-xl": "shadow-none",
    "shadow-lg shadow-primary/20": "shadow-none",
    "shadow-lg": "shadow-none",
    "shadow-md": "shadow-none",
    "shadow-sm": "shadow-none",
    "hover:shadow-md": "",
    "hover:shadow-lg": "",
    "text-primary": "text-white"
}

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {filepath}: {e}")
        return

    old_content = content
    for old, new in replacements.items():
        content = content.replace(old, new)

    if content != old_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for filepath in glob.glob('src/**/*.tsx', recursive=True):
    process_file(filepath)

print("Global replacement complete.")
