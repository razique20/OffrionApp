import os
import glob
import re

directories = [
    'src/**/*.tsx',
]

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {filepath}: {e}")
        return

    old_content = content

    # 1. Revert hardcoded hex colors to semantic colors
    content = content.replace("bg-[#111]", "bg-secondary")
    content = content.replace("border-[#333]", "border-border")
    content = content.replace("bg-[#0A0A0A]", "bg-muted")
    content = content.replace("bg-[#0a0a0a]", "bg-muted")
    content = content.replace("bg-[#222]", "bg-accent")
    
    # Wait, my previous global script replaced `bg-card` with `bg-black`!
    # Let me revert `bg-black` to `bg-background` where it makes sense.
    # Actually, Vercel section is handled by `.vercel-section` which already uses bg-card!
    # So the only `bg-black` are the ones I manually put. But `<div className="... bg-black">` 
    # should be `bg-background` or `bg-card`
    # Let's replace "bg-black" -> "bg-background" ONLY if it's outside of a specific button wrapper, 
    # but since Next UI used `bg-background`, let's just do it.
    
    # 2. Text-white bug: "some button text is white even the bg is also white"
    # This means a button with `bg-background` has `text-white` because of my global script!
    # Or a button with `bg-secondary` has `text-white`.
    # I should change `text-white` to `text-foreground`, BUT BE CAREFUL!
    # If the button is `bg-red-`, `bg-blue-`, `bg-emerald-`, or `bg-foreground` it SHOULD be text-white!
    # Wait, `bg-foreground` in light mode is BLACK. So `text-background` is WHITE.
    # Actually, `text-white` literally means white.
    # I will replace `text-white` with `text-foreground` UNLESS it's preceded closely by a primary color bg.
    
    # A safer way using python regex:
    # We want to replace `text-white` with `text-foreground` everywhere.
    # But wait, `text-white` is sometimes used for `dark:text-white` which is fine.
    
    # Let's do a simple regex that finds `className="..."` strings, and replaces text-white with text-foreground,
    # except if the class string contains "bg-red", "bg-blue", "bg-emerald", "bg-foreground"
    
    def replacer(match):
        class_str = match.group(1)
        if "bg-red" in class_str or "bg-blue" in class_str or "bg-emerald" in class_str or "bg-foreground" in class_str or "bg-black" in class_str:
            # Leave text-white alone if it's on a dark/colored background
            return 'className="' + class_str + '"'
        else:
            return 'className="' + class_str.replace("text-white", "text-foreground") + '"'
    
    content = re.sub(r'className="([^"]+)"', replacer, content)

    if content != old_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath} for light mode")

for filepath in glob.glob('src/**/*.tsx', recursive=True):
    process_file(filepath)

print("Light mode un-hardcoding complete.")
