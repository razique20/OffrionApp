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

directories = [
    'src/app/admin/dashboard/page.tsx',
    'src/app/merchant/dashboard/page.tsx',
    'src/app/partner/dashboard/page.tsx',
    'src/components/Sidebar.tsx' # Just in case we missed any
]

for filepath in directories:
    if os.path.exists(filepath):
        process_file(filepath)
    else:
        print(f"File not found: {filepath}")

print("Replacement complete.")
