import os

filepath = 'src/app/admin/dashboard/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_content = """  return (
    <div className="w-full flex flex-col font-sans animate-fade-in relative z-10 px-4 md:px-0">
      
      {/* ── HORIZONTAL SUB-NAVIGATION (VERCEL STYLE) ── */}
      <div className="border-b border-[#333] mb-8 sticky top-0 z-40 bg-black/80 backdrop-blur-md">
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {(['overview', 'merchants', 'partners', 'deals', 'categories', 'review', 'admins', 'financials'] as TabType[])
            .filter(tab => tab !== 'admins' || me?.role === 'super_admin')
            .map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-2 py-4 text-sm font-medium transition-all relative whitespace-nowrap",
                    isActive 
                      ? "text-white" 
                      : "text-[#888] hover:text-white"
                  )}
                >
                  <span className="capitalize">{tab}</span>
                  {tab === 'review' && moderationData.deals.length + moderationData.merchants.length + moderationData.regionalRequests.length > 0 && (
                    <span className="w-5 h-5 bg-[#222] text-white text-[10px] flex items-center justify-center rounded-md font-bold mb-0.5 ml-2">
                      {moderationData.deals.length + moderationData.merchants.length + moderationData.regionalRequests.length}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-t-full" />
                  )}
                </button>
              );
            })}
        </nav>
      </div>

      {notification && (
        <div className={cn(
          "fixed bottom-8 right-8 z-[100] px-6 py-3 rounded-md text-sm font-bold animate-in slide-in-from-right duration-300 flex items-center gap-3",
          notification.type === 'success' ? "bg-white text-black" : "bg-[#E00] text-white"
        )}>
          {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100 font-normal underline text-[10px]">DISMISS</button>
        </div>
      )}

      {/* Main Content Render */}
      <div className="w-full flex-1 flex flex-col">
        {/* Subtle Dynamic Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-[10px] text-[#888] uppercase tracking-[0.2em] font-black mb-2 opacity-80">
            <span>Foundation</span>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span className="text-white">{activeTab}</span>
          </div>
"""

# Lines 415 to 518 (0-indexed means slice 414:518)
new_lines = lines[:414] + [new_content] + lines[518:]

# Fixing the closing divs at the bottom by replacing lines [:-2] to check closing.
# Wait, if we wiped `<div className="flex h-screen...">`, `<div className="flex-1...">`, and `<div className="max-w-6xl...">`
# The original code had 3 closing `</div>` at the bottom.
# Our new code has `<div className="w-full flex flex-col...">` and `<div className="w-full flex-1 flex flex-col">`, which requires exactly 2 closing `</div>`.
# So we need to remove one `</div>` from the end of the file.

# Find the last 3 lines
#      </div>
#    </div>
#  );
#}
# Let's clean the ending up perfectly.

final_lines = []
for line in new_lines:
    final_lines.append(line)

# Let's fix the bottom divs dynamically using a quick read of the last few lines.

bottom_content = """        </div>
      </div>
    </div>
  );
}
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(final_lines)

# Fix bottom wrapper manually since we dropped a div depth
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('          </div>\\n        </div>\\n      </div>\\n    </div>\\n  );\\n}', '        </div>\\n      </div>\\n    </div>\\n  );\\n}')
# Wait, it's safer to just overwrite the file and run prettier/eslint.

print("Replaced layout sidebar with horizontal tabs.")
