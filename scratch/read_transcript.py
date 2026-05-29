import json

transcript_path = r"C:\Users\wailf\.gemini\antigravity\brain\8735771c-00a3-4596-ac72-c1eb17ebfed5\.system_generated\logs\transcript.jsonl"

print("Reading user inputs from transcript:")
with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            step = json.loads(line)
            if step.get("type") == "USER_INPUT":
                print(f"Index: {step.get('step_index')}")
                print(f"Content: {step.get('content')}")
                print("-" * 50)
        except Exception as e:
            pass
