import urllib.request
import urllib.parse
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_embeddable_video(query):
    search_url = "https://www.youtube.com/results?search_query=" + urllib.parse.quote(query)
    req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
        video_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
        unique_ids = []
        for vid in video_ids:
            if vid not in unique_ids:
                unique_ids.append(vid)
        
        for vid in unique_ids[:10]:
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}"
            try:
                urllib.request.urlopen(oembed_url, context=ctx)
                return vid
            except Exception as e:
                pass
    except Exception as e:
        print(f"Error searching for {query}: {e}")
    return None

queries = [
    "Drake Make Them Cry Iceman lyric"
]

for q in queries:
    vid = get_embeddable_video(q)
    print(f"{q}: {vid}")

